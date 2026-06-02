import { useEffect, useState } from "react";

import CourseCard from "../components/CourseCard";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses/my-courses/?student_id=1");
        setCourses(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error(error);
        setMessage("Could not load enrolled courses. Please refresh or try again shortly.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-5xl font-bold mb-10">My Courses</h1>

      {message && (
        <div className="mb-8 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-100">
          {message}
        </div>
      )}

      {loading ? (
        <div className="bg-slate-900 p-8 rounded-2xl">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="bg-slate-900 p-8 rounded-2xl">
          No enrolled courses found. Open a course and click Enroll Now.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              actionLabel="Start Learning"
              actionPath={"/course-player/" + course.id}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
