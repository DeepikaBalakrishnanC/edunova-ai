import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

export default function CreateCourse() {
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    title: "",
    category: "Frontend",
    description: "",
    instructor: "Deepika",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [createdCourse, setCreatedCourse] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const thumbnailPreview = useMemo(
    () => (thumbnail ? URL.createObjectURL(thumbnail) : ""),
    [thumbnail]
  );

  const previewVideoPreview = useMemo(
    () => (previewVideo ? URL.createObjectURL(previewVideo) : ""),
    [previewVideo]
  );

  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  useEffect(() => {
    return () => {
      if (previewVideoPreview) {
        URL.revokeObjectURL(previewVideoPreview);
      }
    };
  }, [previewVideoPreview]);

  const handleChange = (e) => {
    setCourse({
      ...course,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setCreatedCourse(null);

    const formData = new FormData();
    formData.append("title", course.title.trim());
    formData.append("category", course.category.trim());
    formData.append("description", course.description.trim());
    formData.append("instructor", course.instructor.trim() || "Deepika");

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    if (previewVideo) {
      formData.append("demo_video", previewVideo);
    }

    try {
      setLoading(true);
      const res = await api.post("/courses/create/", formData);

      setCreatedCourse(res.data);
      setMessage("Course created successfully.");
      setCourse({
        title: "",
        category: "Frontend",
        description: "",
        instructor: "Deepika",
      });
      setThumbnail(null);
      setPreviewVideo(null);
    } catch (error) {
      console.error(error);
      const detail = error.response?.data
        ? JSON.stringify(error.response.data)
        : error.request
          ? "The course service is not reachable. Please check the backend connection."
          : error.message;
      setMessage("Failed to create course. " + detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10">
          <h1 className="text-5xl font-bold">Create Course</h1>

          <Link
            to="/teacher/add-lesson"
            className="bg-slate-800 hover:bg-slate-700 transition px-5 py-3 rounded-xl text-center"
          >
            Add Lesson
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 p-8 rounded-3xl border border-slate-800"
        >
          <div className="mb-6">
            <label className="block mb-2 text-gray-300">Course Title</label>
            <input
              type="text"
              name="title"
              value={course.title}
              onChange={handleChange}
              placeholder="React Development"
              required
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 text-gray-300">Category</label>
              <select
                name="category"
                value={course.category}
                onChange={handleChange}
                className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
              >
                <option>Frontend</option>
                <option>Backend</option>
                <option>AI</option>
                <option>Full Stack</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-gray-300">Instructor</label>
              <input
                type="text"
                name="instructor"
                value={course.instructor}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-gray-300">Description</label>
            <textarea
              name="description"
              value={course.description}
              onChange={handleChange}
              rows="6"
              placeholder="Enter course description..."
              required
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-8">
            <label className="block mb-2 text-gray-300">Course Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setThumbnail(file);
              }}
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700"
            />
          </div>

          {thumbnailPreview && (
            <div className="mb-8">
              <img
                src={thumbnailPreview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-2xl"
              />
            </div>
          )}

          <div className="mb-8">
            <label className="block mb-2 text-gray-300">Course Preview Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                if (file && !file.type.startsWith("video/")) {
                  setMessage("Please choose a valid video file.");
                  setPreviewVideo(null);
                  return;
                }
                setMessage("");
                setPreviewVideo(file);
              }}
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700"
            />
          </div>

          {previewVideoPreview && (
            <div className="mb-8">
              <video
                src={previewVideoPreview}
                controls
                className="w-full rounded-2xl bg-black"
              />
            </div>
          )}

          {message && (
            <div className="mb-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-100">
              {message}
            </div>
          )}

          {createdCourse && (
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/teacher/add-lesson?course=" + createdCourse.id)}
                className="bg-green-600 hover:bg-green-700 transition px-5 py-3 rounded-xl"
              >
                Add Lessons
              </button>

              <button
                type="button"
                onClick={() => navigate("/courses/" + createdCourse.id)}
                className="bg-slate-800 hover:bg-slate-700 transition px-5 py-3 rounded-xl"
              >
                View Course
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-4 rounded-xl font-semibold text-lg disabled:opacity-50"
          >
            {loading ? "Creating Course..." : "Create Course"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
