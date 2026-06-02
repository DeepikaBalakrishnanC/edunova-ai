import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const coursesRes = await api.get("/courses/my-courses/?student_id=1");
        const enrolledCourses = Array.isArray(coursesRes.data) ? coursesRes.data : [];

        const coursesWithProgress = await Promise.all(
          enrolledCourses.map(async (course) => {
            try {
              const progressRes = await api.get(`/courses/${course.id}/progress/?student_id=1`);

              return {
                ...course,
                progress: Number(progressRes.data?.progress) || 0,
              };
            } catch {
              return {
                ...course,
                progress: 0,
              };
            }
          })
        );

        setCourses(coursesWithProgress);
      } catch (error) {
        console.error(error);
        setMessage("Could not load your learning dashboard. Please refresh or try again shortly.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = [
    { title: "Enrolled Courses", value: courses.length },
    { title: "Completed Courses", value: courses.filter((course) => course.progress >= 100).length },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
        <div>
          <p className="text-blue-400 font-semibold">Student Workspace</p>
          <h1 className="text-5xl font-bold mt-2">Learning Dashboard</h1>
        </div>
        <Link to="/my-courses" className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-xl text-center">Resume Learning</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div key={item.title} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
            <h2 className="text-gray-400 text-lg">{item.title}</h2>
            <p className="text-5xl font-bold mt-4 text-blue-500">{item.value}</p>
          </div>
        ))}
      </div>

      {message && (
        <div className="mt-8 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-100">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-10">
        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <h2 className="text-3xl font-bold mb-8">Continue Learning</h2>
          {loading ? (
            <div className="bg-slate-800 p-6 rounded-2xl">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="bg-slate-800 p-6 rounded-2xl text-gray-300">
              No enrolled courses found.
            </div>
          ) : (
            <div className="space-y-6">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  to={"/course-player/" + course.id}
                  className="block bg-slate-800 hover:bg-slate-700 p-6 rounded-2xl transition"
                >
                  <div className="flex justify-between items-center gap-4">
                    <h3 className="text-2xl font-semibold">{course.title}</h3>
                    <span className="text-blue-400">{course.progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-700 rounded-full mt-5">
                    <div
                      className="h-3 bg-blue-500 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <h2 className="text-3xl font-bold mb-6">Learning Tools</h2>
          <div className="space-y-4">
            <Link to="/ai-chat" className="block bg-slate-800 hover:bg-slate-700 p-5 rounded-2xl">AI Assistant</Link>
            <Link to="/quiz" className="block bg-slate-800 hover:bg-slate-700 p-5 rounded-2xl">Quizzes</Link>
            <Link to="/certificate" className="block bg-slate-800 hover:bg-slate-700 p-5 rounded-2xl">Certificates</Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
