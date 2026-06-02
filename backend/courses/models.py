from django.db import models
from django.contrib.auth.models import User

# Course FIRST
class Course(models.Model):
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    description = models.TextField()

    instructor = models.CharField(
        max_length=255,
        default="Instructor"
    )

    thumbnail = models.ImageField(
        upload_to="course_thumbnails/",
        blank=True,
        null=True
    )

    demo_video = models.FileField(
        upload_to="course_demo_videos/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title


# Enrollment AFTER Course
class Enrollment(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE
    )

    enrolled_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        unique_together = (
            "student",
            "course"
        )


# Lesson AFTER Course
class Lesson(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="lessons"
    )

    title = models.CharField(max_length=255)

    video = models.FileField(
        upload_to="lesson_videos/"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title


# LessonProgress AFTER Lesson
class LessonProgress(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE
    )

    completed = models.BooleanField(
        default=False
    )

    completed_at = models.DateTimeField(
        auto_now=True
    )
class Certificate(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE
    )

    issued_at = models.DateTimeField(
        auto_now_add=True
    )

    certificate_id = models.CharField(
        max_length=100,
        unique=True
    )

    def __str__(self):
        return self.certificate_id