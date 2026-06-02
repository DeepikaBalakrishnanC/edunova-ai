from django.contrib import admin

from .models import Certificate, Course, Enrollment, Lesson, LessonProgress


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "instructor", "created_at")
    search_fields = ("title", "category", "instructor")


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "created_at")
    search_fields = ("title", "course__title")


admin.site.register(Enrollment)
admin.site.register(LessonProgress)
admin.site.register(Certificate)
