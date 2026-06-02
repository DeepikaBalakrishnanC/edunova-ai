import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import { getUser } from "../utils/auth";

export default function Certificate() {
  const user = getUser();
  const fullName = user?.name || user?.username || "Student";
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses/my-courses/?student_id=1");
        const enrolledCourses = Array.isArray(res.data) ? res.data : [];

        setCourses(enrolledCourses);
        setSelectedCourseId(enrolledCourses[0]?.id ? String(enrolledCourses[0].id) : "");
      } catch (error) {
        console.error(error);
        setMessage("Could not load enrolled courses for your certificate.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const selectedCourse = courses.find((course) => String(course.id) === selectedCourseId);

  return (
    <DashboardLayout>
      {message && (
        <div className="mb-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-100">
          {message}
        </div>
      )}

      {loading ? (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          Loading certificate...
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          No enrolled courses found for a certificate.
        </div>
      ) : (
        <>
          <div className="mb-6 max-w-xl">
            <label className="block text-sm font-semibold text-gray-300">
              Certificate Course
            </label>
            <select
              value={selectedCourseId}
              onChange={(event) => setSelectedCourseId(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 p-4 outline-none focus:border-blue-500"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white text-black p-12 rounded-3xl text-center">
        <h1 className="text-5xl font-bold">
          Certificate of Completion
        </h1>

        <p className="mt-10 text-2xl">
          This certifies that
        </p>

        <h2 className="text-4xl font-bold mt-6">
          {fullName}
        </h2>

        <p className="mt-6 text-xl">
          has successfully completed
        </p>

        <h3 className="text-3xl font-bold mt-4">
          {selectedCourse?.title || "Selected Course"}
        </h3>

        <p className="mt-8">
          EduNova AI LMS
        </p>
      </div>
        </>
      )}
    </DashboardLayout>
  );
}
