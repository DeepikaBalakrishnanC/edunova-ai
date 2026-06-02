import { Link } from "react-router-dom";

import { mediaUrl } from "../services/api";

export default function CourseCard({ course, actionLabel = "View Course", actionPath }) {
  const thumbnailSrc = mediaUrl(course.thumbnail);

  return (
    <div className="soft-panel lift-card rounded-3xl overflow-hidden">
      <div className="h-56 overflow-hidden">
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600">
            <span className="text-white text-xl font-semibold">
              {course.category || "Course"}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-3 py-1 rounded-full text-sm">
          {course.category || "General"}
        </span>

        <h2 className="text-2xl font-bold mt-5 text-white">
          {course.title}
        </h2>

        <p className="text-gray-400 mt-4 line-clamp-3">
          {course.description}
        </p>

        <div className="mt-5 text-gray-300">
          <span className="font-medium">Instructor:</span> {course.instructor || "Instructor"}
        </div>

        {course.created_at && (
          <div className="mt-2 text-gray-500 text-sm">
            Created: {new Date(course.created_at).toLocaleDateString()}
          </div>
        )}

        <Link to={actionPath || "/courses/" + course.id}>
          <button className="btn-primary w-full mt-8 p-4">
            {actionLabel}
          </button>
        </Link>
      </div>
    </div>
  );
}
