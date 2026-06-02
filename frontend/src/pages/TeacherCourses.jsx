import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

export default function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const [lessonCounts, setLessonCounts] = useState({});
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadCourses() {
      try {
        const response = await api.get("/courses/");
        const records = Array.isArray(response.data) ? response.data : [];

        const lessonResponses = await Promise.all(
          records.map(async (course) => {
            try {
              const lessons = await api.get(`/courses/${course.id}/lessons/`);
              return [course.id, Array.isArray(lessons.data) ? lessons.data.length : 0];
            } catch {
              return [course.id, 0];
            }
          })
        );

        if (!mounted) return;
        setCourses(records);
        setLessonCounts(Object.fromEntries(lessonResponses));
        setError("");
      } catch {
        if (!mounted) return;
        setCourses([]);
        setLessonCounts({});
        setError("Unable to load courses right now.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadCourses();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredCourses = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return courses;
    }

    return courses.filter((course) =>
      [course.title, course.category, course.instructor]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [courses, query]);

  const stats = useMemo(() => {
    const categories = new Set(courses.map((course) => course.category).filter(Boolean));
    const totalLessons = Object.values(lessonCounts).reduce((sum, count) => sum + Number(count || 0), 0);

    return {
      totalCourses: courses.length,
      totalLessons,
      categories: categories.size,
    };
  }, [courses, lessonCounts]);

  return (
    <DashboardLayout>
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Teacher Workspace</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Course Management</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/teacher/create-course"
              className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
            >
              Create Course
            </Link>
            <Link
              to="/teacher/add-lesson"
              className="rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white transition hover:bg-slate-800"
            >
              Add Lesson
            </Link>
            <Link
              to="/teacher/students"
              className="rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white transition hover:bg-slate-800"
            >
              View Students
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-800">
          {error}
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Courses</p>
          <div className="mt-3 text-4xl font-bold text-blue-700">{stats.totalCourses}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Lessons</p>
          <div className="mt-3 text-4xl font-bold text-blue-700">{stats.totalLessons}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Categories</p>
          <div className="mt-3 text-4xl font-bold text-blue-700">{stats.categories}</div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold">Managed Courses</h2>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 md:w-80"
          />
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
            Loading courses...
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <h3 className="text-xl font-semibold text-slate-900">No courses available.</h3>
            <p className="mt-2 text-slate-500">Courses will appear here after they are created.</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
            No courses match your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-200 text-sm text-slate-500">
                <tr>
                  <th className="py-4 pr-4 font-medium">Course</th>
                  <th className="py-4 pr-4 font-medium">Instructor</th>
                  <th className="py-4 pr-4 font-medium">Category</th>
                  <th className="py-4 pr-4 font-medium">Lessons</th>
                  <th className="py-4 pr-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-4 pr-4 font-semibold">{course.title}</td>
                    <td className="py-4 pr-4 text-slate-600">{course.instructor || "Not assigned"}</td>
                    <td className="py-4 pr-4 text-slate-600">{course.category || "Uncategorized"}</td>
                    <td className="py-4 pr-4 text-slate-600">{lessonCounts[course.id] || 0}</td>
                    <td className="py-4 pr-4">
                      <Link to={`/courses/${course.id}`} className="font-medium text-blue-700 hover:text-blue-900">
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
