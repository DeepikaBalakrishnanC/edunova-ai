import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import fallbackCourses from "../data/courses";
import api, { mediaUrl } from "../services/api";
import { getUser } from "../utils/auth";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = getUser();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const fallbackCourse = fallbackCourses.find(
      (item) => item.id === Number(id)
    );

    const loadCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}/`);

        setCourse(res.data);
        setNotice("");
      } catch (error) {
        console.error("Failed to fetch course:", error);

        setCourse(fallbackCourse || null);

        if (fallbackCourse) {
          setNotice(
            "Course details are currently loading from saved catalog information."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      setNotice("");

      if (!user) {
        setNotice("Please login first.");
        return;
      }

      await api.post("/courses/enroll/", {
        student: user.id,
        course: Number(id),
      });

      navigate(`/course-player/${id}`);
    } catch (error) {
      console.error(error);

      const detail =
        error.response?.data?.detail ||
        "Unable to enroll. Please try again.";

      setNotice(detail);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex justify-center items-center text-2xl">
        Loading Course...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex justify-center items-center text-2xl">
        Course Not Found
      </div>
    );
  }

  const progress = Number(course.progress || 0);

  const thumbnailSrc = mediaUrl(course.thumbnail);
  const previewVideoSrc = mediaUrl(course.demo_video);

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-7xl mx-auto">
        {/* NOTICE */}
        {notice && (
          <div className="mb-8 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 text-blue-100">
            {notice}
          </div>
        )}

        {/* HERO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* LEFT */}
          <div>
            <span className="bg-blue-600 px-4 py-2 rounded-full">
              {course.category}
            </span>

            <h1 className="text-5xl md:text-6xl font-bold mt-8">
              {course.title}
            </h1>

            <p className="text-gray-400 mt-8 text-lg leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-6 mt-10 text-gray-300">
              <span>
                Instructor: {course.instructor || "Instructor"}
              </span>

              {course.students && (
                <span>{course.students}</span>
              )}

              {course.duration && (
                <span>{course.duration}</span>
              )}

              {course.created_at && (
                <span>
                  Created:{" "}
                  {new Date(
                    course.created_at
                  ).toLocaleDateString()}
                </span>
              )}
            </div>

            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="mt-10 bg-blue-600 hover:bg-blue-700 transition px-10 py-5 rounded-2xl text-xl disabled:opacity-50"
            >
              {enrolling
                ? "Enrolling..."
                : "Enroll Now"}
            </button>
          </div>

          {/* RIGHT */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center">
              {previewVideoSrc ? (
                <video
                  controls
                  poster={thumbnailSrc || undefined}
                  className="w-full h-full object-cover"
                >
                  <source
                    src={previewVideoSrc}
                    type="video/mp4"
                  />
                </video>
              ) : thumbnailSrc ? (
                <img
                  src={thumbnailSrc}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <h2 className="text-2xl text-gray-400">
                  Course Preview
                </h2>
              )}
            </div>

            {/* PROGRESS */}
            <div className="mt-10">
              <div className="flex justify-between mb-3">
                <span>Course Progress</span>

                <span>{progress}%</span>
              </div>

              <div className="w-full h-4 bg-slate-700 rounded-full">
                <div
                  className="h-4 bg-blue-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      progress,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* COURSE CONTENT */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold">
            Course Content
          </h2>

          <div className="mt-10 space-y-5">
            <div className="bg-slate-900 p-6 rounded-2xl">
              Module 1: Introduction
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl">
              Module 2: Core Concepts
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl">
              Module 3: Hands-on Projects
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl">
              Module 4: Final Assessment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}