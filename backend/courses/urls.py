from django.urls import path
from .views import course_progress, create_lesson, enroll_course, generate_certificate, mark_complete, my_courses, teacher_students
from .views import course_lessons

from .views import (
    course_list,
    create_course,
    course_detail,
    delete_course,
)

urlpatterns = [
    path("", course_list),

    path("create/", create_course),

    path("<int:pk>/", course_detail),

    path(
        "delete/<int:pk>/",
        delete_course
    ),
    path(
    "lesson/create/",
    create_lesson
),
path(
    "<int:course_id>/lessons/",
    course_lessons
),
path(
    "enroll/",
    enroll_course
),

path(
    "my-courses/",
    my_courses
),
path(
    "lesson/complete/",
    mark_complete
),
path(
    "<int:course_id>/progress/",
    course_progress
),
path(
    "certificate/generate/",
    generate_certificate
),
path(
    "teacher-students/",
    teacher_students
),
]