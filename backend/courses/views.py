import uuid

from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from .certificate_serializer import CertificateSerializer
from .enrollment_serializer import EnrollmentSerializer
from .lesson_serializers import LessonSerializer
from .models import Certificate, Course, Enrollment, Lesson, LessonProgress
from .progress_serializer import LessonProgressSerializer
from .serializers import CourseSerializer


def _learning_student():
    user, _ = User.objects.get_or_create(
        username="learning-student",
        defaults={"email": "student@edunova.local", "first_name": "Learning"},
    )
    return user


def _student_from_request(request):
    student_id = request.data.get("student") or request.GET.get("student_id")

    if student_id:
        try:
            student = User.objects.filter(id=student_id).first()
        except (TypeError, ValueError):
            student = None

        if student:
            return student

    return _learning_student()


@api_view(["GET"])
def course_list(request):
    courses = Course.objects.all().order_by("-created_at")
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def create_course(request):
    serializer = CourseSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def course_detail(request, pk):
    course = get_object_or_404(Course, id=pk)
    serializer = CourseSerializer(course)
    return Response(serializer.data)


@api_view(["DELETE"])
def delete_course(request, pk):
    course = get_object_or_404(Course, id=pk)
    course.delete()
    return Response({"message": "Course deleted"})


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def create_lesson(request):
    serializer = LessonSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def course_lessons(request, course_id):
    get_object_or_404(Course, id=course_id)
    lessons = Lesson.objects.filter(course_id=course_id).order_by("created_at")
    serializer = LessonSerializer(lessons, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def enroll_course(request):
    student = _student_from_request(request)
    course = get_object_or_404(Course, id=request.data.get("course"))

    enrollment, created = Enrollment.objects.get_or_create(
        student=student,
        course=course,
    )

    serializer = EnrollmentSerializer(enrollment)
    return Response(
        serializer.data,
        status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
    )


@api_view(["GET"])
def my_courses(request):
    student = _student_from_request(request)
    enrollments = Enrollment.objects.filter(student=student).select_related("course")

    data = []
    for item in enrollments:
        data.append({
            "id": item.course.id,
            "title": item.course.title,
            "category": item.course.category,
            "description": item.course.description,
            "instructor": item.course.instructor,
            "thumbnail": item.course.thumbnail.url if item.course.thumbnail else None,
            "created_at": item.course.created_at,
        })

    return Response(data)


@api_view(["POST"])
def mark_complete(request):
    student = _student_from_request(request)
    lesson = get_object_or_404(Lesson, id=request.data.get("lesson"))
    completed = bool(request.data.get("completed", True))

    progress, _ = LessonProgress.objects.update_or_create(
        student=student,
        lesson=lesson,
        defaults={"completed": completed},
    )

    serializer = LessonProgressSerializer(progress)
    return Response(serializer.data)


@api_view(["GET"])
def course_progress(request, course_id):
    student = _student_from_request(request)
    get_object_or_404(Course, id=course_id)

    total_lessons = Lesson.objects.filter(course_id=course_id).count()
    completed_lessons = LessonProgress.objects.filter(
        student=student,
        lesson__course_id=course_id,
        completed=True,
    ).count()

    percentage = 0
    if total_lessons > 0:
        percentage = round((completed_lessons / total_lessons) * 100)

    return Response({
        "total_lessons": total_lessons,
        "completed_lessons": completed_lessons,
        "progress": percentage,
    })


@api_view(["GET"])
def teacher_students(request):
    enrollments = Enrollment.objects.select_related("student", "course").order_by(
        "student__first_name",
        "student__username",
        "course__title",
    )

    data = []
    for enrollment in enrollments:
        student = enrollment.student
        course = enrollment.course
        placeholder_values = {
            student.username.lower(),
            student.first_name.lower(),
            student.email.lower(),
        }
        if "demo" in placeholder_values or student.email.endswith("@edunova.local"):
            continue

        total_lessons = Lesson.objects.filter(course=course).count()
        completed_lessons = LessonProgress.objects.filter(
            student=student,
            lesson__course=course,
            completed=True,
        ).count()

        progress = 0
        if total_lessons:
            progress = round((completed_lessons / total_lessons) * 100)

        if total_lessons == 0:
            status_label = "No Lessons"
        elif progress >= 80:
            status_label = "On Track"
        elif progress >= 50:
            status_label = "Needs Review"
        else:
            status_label = "At Risk"

        data.append({
            "id": enrollment.id,
            "student_id": student.id,
            "name": student.get_full_name() or student.username,
            "email": student.email,
            "course_id": course.id,
            "course": course.title,
            "progress": progress,
            "completed_lessons": completed_lessons,
            "total_lessons": total_lessons,
            "status": status_label,
            "enrolled_at": enrollment.enrolled_at,
        })

    return Response(data)


@api_view(["POST"])
def generate_certificate(request):
    student = _student_from_request(request)
    course = get_object_or_404(Course, id=request.data.get("course"))

    certificate = Certificate.objects.filter(student=student, course=course).first()
    if certificate is None:
        certificate = Certificate.objects.create(
            student=student,
            course=course,
            certificate_id=str(uuid.uuid4())[:10],
        )

    serializer = CertificateSerializer(certificate)
    return Response(serializer.data)
