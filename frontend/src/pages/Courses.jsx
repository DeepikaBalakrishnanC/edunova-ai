import { useEffect, useMemo, useState } from "react";

import CourseCard from "../components/CourseCard";
import api from "../services/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await api.get("/courses/");
        const apiCourses = Array.isArray(res.data) ? res.data : [];

        setCourses(apiCourses);
        setNotice("");
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setCourses([]);
        setNotice("Course catalog is temporarily unavailable.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(courses.map((course) => course.category).filter(Boolean))],
    [courses]
  );

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const title = course.title || "";
      const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || course.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [category, courses, search]);

  return (
    <div className="page-shell min-h-screen text-white px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <p className="section-eyebrow">Course Catalog</p>
          <h1 className="text-5xl md:text-6xl font-bold">
            Explore Courses
          </h1>

          <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
            Browse available courses, filter by category, and open the learning path that matches your goals.
          </p>
        </div>

        <div className="glass-panel flex flex-col md:flex-row gap-5 justify-between mt-14 rounded-3xl p-5">
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-field md:w-1/2"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-field md:w-64"
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        {notice && (
          <div className="mt-8 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-100">
            {notice}
          </div>
        )}

        {loading ? (
          <div className="soft-panel mt-16 rounded-3xl p-10 text-center text-xl text-gray-300">
            Loading courses...
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mt-16">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-10 text-center text-gray-300">
            No courses available yet.
          </div>
        ) : (
          <div className="mt-16 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-gray-300">
            No courses match your search.
          </div>
        )}
      </div>
    </div>
  );
}
