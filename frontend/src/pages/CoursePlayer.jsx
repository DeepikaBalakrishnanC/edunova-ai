import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api, { mediaUrl } from "../services/api";

export default function CoursePlayer() {
  const { id } = useParams();

  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        // LOAD LESSONS
        const lessonRes = await api.get(
          `/courses/${id}/lessons/`
        );

        setLessons(lessonRes.data);

        if (lessonRes.data.length > 0) {
          setSelectedLesson(
            lessonRes.data[0]
          );
        }

        // LOAD PROGRESS
        const progressRes = await api.get(
          `/courses/${id}/progress/?student_id=1`
        );

        setProgress(
          progressRes.data.progress
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleComplete = async () => {
    if (!selectedLesson) return;

    try {
      setCompleting(true);

      await api.post(
        "/courses/lesson/complete/",
        {
          student: 1,
          lesson: selectedLesson.id,
          completed: true,
        }
      );

      // REFRESH PROGRESS
      const progressRes = await api.get(
        `/courses/${id}/progress/?student_id=1`
      );

      setProgress(
        progressRes.data.progress
      );

      setMessage("Lesson marked as completed.");
    } catch (error) {
      console.error(error);

      setMessage("Failed to mark lesson complete. Please try again.");
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <h2 className="text-2xl">
            Loading Lessons...
          </h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {message && (
        <div className="mb-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-100">
          {message}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* VIDEO SECTION */}
        <div className="lg:col-span-3">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            {selectedLesson ? (
              <>
                {/* VIDEO PLAYER */}
                <video
                  controls
                  className="w-full rounded-2xl"
                >
                  <source
                    src={mediaUrl(selectedLesson.video)}
                    type="video/mp4"
                  />

                  Your browser does not support video playback.
                </video>

                {/* TITLE */}
                <h2 className="text-3xl font-bold mt-6">
                  {selectedLesson.title}
                </h2>

                {/* PROGRESS */}
                <div className="mt-8">
                  <div className="flex justify-between mb-2">
                    <span>
                      Course Progress
                    </span>

                    <span>
                      {progress}%
                    </span>
                  </div>

                  <div className="w-full h-4 bg-slate-700 rounded-full">
                    <div
                      className="h-4 bg-blue-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* COMPLETE BUTTON */}
                <button
                  onClick={handleComplete}
                  disabled={completing}
                  className="mt-8 bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded-xl disabled:opacity-50"
                >
                  {completing
                    ? "Saving..."
                    : "Mark Complete"}
                </button>
              </>
            ) : (
              <div className="flex justify-center items-center h-64">
                <h2 className="text-xl text-gray-400">
                  No Lessons Available
                </h2>
              </div>
            )}
          </div>
        </div>

        {/* CURRICULUM */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-6">
            Course Curriculum
          </h2>

          {lessons.length === 0 ? (
            <p className="text-gray-400">
              No lessons found.
            </p>
          ) : (
            <div className="space-y-3">
              {lessons.map(
                (lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() =>
                      setSelectedLesson(
                        lesson
                      )
                    }
                    className={`w-full text-left p-4 rounded-xl transition ${
                      selectedLesson?.id ===
                      lesson.id
                        ? "bg-blue-600"
                        : "bg-slate-800 hover:bg-slate-700"
                    }`}
                  >
                    <div className="font-semibold">
                      Lesson {index + 1}
                    </div>

                    <div className="text-sm text-gray-300 mt-1">
                      {lesson.title}
                    </div>
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}