import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

export default function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await api.get("/courses/");
        setCourses(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error(error);
        setMessage("Course data could not be loaded. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const stats = useMemo(() => {
    return [
      { title: "Published Courses", value: String(courses.length) },
      { title: "Active Courses", value: String(courses.filter((course) => course.title).length) },
      { title: "Course Categories", value: String(new Set(courses.map((course) => course.category).filter(Boolean)).size) },
      { title: "Media Courses", value: String(courses.filter((course) => course.thumbnail || course.demo_video).length) },
    ];
  }, [courses]);

  const actions = [
    { title: "Create Course", description: "Add a course with overview, category, instructor, thumbnail, and preview video.", path: "/teacher/create-course" },
    { title: "Manage Lessons", description: "Upload course videos and learning resources for existing courses.", path: "/teacher/add-lesson" },
    { title: "Study Materials", description: "Add, view, and edit course study materials.", path: "/teacher/materials" },
    { title: "Assignments", description: "Add, view, edit, and delete assignment records for courses.", path: "/teacher/assignments" },
    { title: "View Students", description: "Review enrolled learners and course progress records.", path: "/teacher/students" },
    { title: "AI Assistant", description: "Prepare lesson explanations and learning support content.", path: "/ai-chat" },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
        <div>
          <p className="text-blue-400 font-semibold">Teacher Workspace</p>
          <h1 className="text-5xl font-bold mt-2">Teacher Dashboard</h1>
        </div>
      </div>

      {message && (
        <div className="mb-8 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-100">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div key={item.title} className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
            <h2 className="text-gray-400">{item.title}</h2>
            <p className="text-5xl font-bold mt-4 text-blue-500">{loading ? "..." : item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <h2 className="text-3xl font-bold mb-6">Course Operations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {actions.map((action) => (
              <Link key={action.path} to={action.path} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 transition p-6 rounded-2xl">
                <h3 className="text-xl font-bold">{action.title}</h3>
                <p className="text-gray-400 mt-3">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-3xl font-bold">Current Courses</h2>
            <Link to="/teacher/courses" className="text-blue-400 hover:text-blue-300">Manage</Link>
          </div>

          {loading ? (
            <div className="bg-slate-800 rounded-2xl p-5 text-gray-400">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="bg-slate-800 rounded-2xl p-5 text-gray-400">No courses have been created yet.</div>
          ) : (
            <div className="space-y-4">
              {courses.slice(0, 4).map((course) => (
                <Link key={course.id} to={`/courses/${course.id}`} className="block bg-slate-800 hover:bg-slate-700 rounded-2xl p-5 transition">
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-gray-400 text-sm mt-1">{course.category || "Course"}</p>
                    </div>
                    <span className="text-blue-400">Open</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
