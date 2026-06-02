import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

export default function AddLesson() {
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState(searchParams.get("course") || "");
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await api.get("/courses/");
        const list = Array.isArray(res.data) ? res.data : [];
        setCourses(list);

        if (!courseId && list.length > 0) {
          setCourseId(String(list[0].id));
        }
      } catch (error) {
        console.error(error);
        setMessage("Could not load courses. Please refresh or try again shortly.");
      }
    };

    loadCourses();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!courseId || !title.trim() || !video) {
      setMessage("Choose a course, enter a lesson title, and select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("course", courseId);
    formData.append("title", title.trim());
    formData.append("video", video);

    try {
      setLoading(true);
      await api.post("/courses/lesson/create/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Lesson added successfully.");
      setTitle("");
      setVideo(null);
      e.target.reset();
    } catch (error) {
      console.error(error);
      const detail = error.response?.data
        ? JSON.stringify(error.response.data)
        : "Please check the course service and try again.";
      setMessage("Failed to add lesson. " + detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-10">Add Lesson</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 p-8 rounded-3xl border border-slate-800"
        >
          <label className="block mb-2 text-gray-300">Course</label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full p-4 mb-5 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
            required
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>

          <label className="block mb-2 text-gray-300">Lesson Title</label>
          <input
            type="text"
            placeholder="Introduction"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 mb-5 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
            required
          />

          <label className="block mb-2 text-gray-300">Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files?.[0] || null)}
            className="w-full p-4 mb-5 rounded-xl bg-slate-800 border border-slate-700"
            required
          />

          {message && (
            <div className="mb-5 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-100">
              {message}
            </div>
          )}

          <button
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-3 rounded-xl"
          >
            {loading ? "Uploading..." : "Upload Lesson"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
