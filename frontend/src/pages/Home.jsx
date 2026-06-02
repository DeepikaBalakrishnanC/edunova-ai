import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaBookOpen,
  FaCertificate,
  FaChalkboardTeacher,
  FaClipboardCheck,
  FaLock,
  FaRobot,
  FaUserGraduate,
} from "react-icons/fa";

import api, { mediaUrl } from "../services/api";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadCourses() {
      try {
        const response = await api.get("/courses/");
        if (!mounted) return;
        setCourses(Array.isArray(response.data) ? response.data : []);
      } catch {
        if (!mounted) return;
        setCourses([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadCourses();

    return () => {
      mounted = false;
    };
  }, []);

  const featuredCourses = useMemo(() => courses.slice(0, 3), [courses]);
  const categoryCount = useMemo(
    () => new Set(courses.map((course) => course.category).filter(Boolean)).size,
    [courses]
  );

  const platformStats = [
    { label: "Available Courses", value: courses.length },
    { label: "Course Categories", value: categoryCount },
    { label: "Workspaces", value: 3 },
  ];

  const features = [
    {
      title: "Student learning workspace",
      description: "Students can continue courses, open materials, complete quizzes, raise doubts, and generate certificates.",
      icon: <FaUserGraduate />,
    },
    {
      title: "Teacher course tools",
      description: "Teachers can create courses, upload lessons, publish study materials, manage assignments, and review students.",
      icon: <FaChalkboardTeacher />,
    },
    {
      title: "Platform oversight",
      description: "Admins keep user records, courses, lessons, support requests, and platform settings organized.",
      icon: <FaLock />,
    },
    {
      title: "AI learning assistant",
      description: "The assistant supports course questions, lesson explanations, and guided study from inside the LMS.",
      icon: <FaRobot />,
    },
  ];

  const workflow = [
    "Create and organize course content",
    "Enroll students into structured learning paths",
    "Track lesson completion and course progress",
    "Review support requests and learner outcomes",
  ];

  return (
    <div className="page-shell overflow-hidden text-white">
      <section className="relative border-b border-slate-800 px-6 py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(245,158,11,0.18),transparent_30%),radial-gradient(circle_at_82%_10%,rgba(20,184,166,0.16),transparent_28%)]"></div>
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <p className="section-eyebrow">EduNova AI LMS</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Modern learning management for real classrooms.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              EduNova AI brings course creation, lessons, assignments, study materials, certificates, doubts, and AI assistance into one focused workspace.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/courses" className="btn-primary gap-2 px-6 py-3">
                Explore Courses <FaArrowRight />
              </Link>
              <Link to="/register" className="btn-secondary px-6 py-3">
                Create Account
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {platformStats.map((item) => (
                <div key={item.label} className="glass-panel rounded-2xl p-5">
                  <div className="text-3xl font-bold text-blue-200">{item.value}</div>
                  <div className="mt-2 text-sm text-slate-300">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="glass-panel relative rounded-3xl p-5"
          >
            <div className="rounded-2xl border border-slate-700 bg-slate-950/80 p-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <p className="text-sm text-slate-400">Platform Overview</p>
                  <h2 className="mt-1 text-2xl font-bold">Learning Operations</h2>
                </div>
                <FaBookOpen className="text-3xl text-blue-400" />
              </div>

              <div className="mt-5 space-y-3">
                {workflow.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3">
                    <FaClipboardCheck className="text-green-400" />
                    <span className="text-slate-200">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                <div className="flex items-center gap-3 text-blue-100">
                  <FaRobot />
                  <span className="font-semibold">AI Assistant available inside protected learning dashboards</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="section-eyebrow">Core Modules</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">Designed around real LMS responsibilities.</h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="soft-panel lift-card rounded-2xl p-6">
              <div className="text-3xl text-blue-400">{feature.icon}</div>
              <h3 className="mt-5 text-xl font-bold">{feature.title}</h3>
              <p className="mt-3 leading-7 text-slate-400">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-eyebrow">Course Catalog</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">Available Courses</h2>
            </div>
            <Link to="/courses" className="btn-primary w-fit px-5 py-3">
              View All Courses
            </Link>
          </div>

          {loading ? (
            <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center text-slate-300">
              Loading courses...
            </div>
          ) : featuredCourses.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-10 text-center text-slate-300">
              No courses are available yet.
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredCourses.map((course) => {
                const image = mediaUrl(course.thumbnail);
                return (
                  <article key={course.id} className="soft-panel lift-card overflow-hidden rounded-2xl">
                    <div className="flex h-48 items-center justify-center bg-slate-800">
                      {image ? (
                        <img src={image} alt={course.title} className="h-full w-full object-cover" />
                      ) : (
                        <FaBookOpen className="text-5xl text-blue-400" />
                      )}
                    </div>
                    <div className="p-6">
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300">
                        {course.category || "Course"}
                      </span>
                      <h3 className="mt-4 text-2xl font-bold">{course.title}</h3>
                      <p className="mt-3 line-clamp-3 text-slate-400">{course.description}</p>
                      <div className="mt-4 text-sm text-slate-300">Instructor: {course.instructor || "Not assigned"}</div>
                      <Link to={`/courses/${course.id}`} className="btn-primary mt-6 px-5 py-3">
                        View Course
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="section-eyebrow">Why It Works</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">Clear access for each workspace.</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              { role: "Student", text: "Learn from enrolled courses, complete lessons, take quizzes, and request support." },
              { role: "Teacher", text: "Manage courses, lessons, materials, students, progress, and replies." },
              { role: "Platform", text: "Keep users, courses, support activity, and configuration organized from one place." },
            ].map((item) => (
              <div key={item.role} className="soft-panel lift-card rounded-2xl p-6">
                <h3 className="text-xl font-bold text-blue-200">{item.role}</h3>
                <p className="mt-3 leading-7 text-slate-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="glass-panel mx-auto max-w-7xl rounded-3xl p-8 text-center md:p-12">
          <FaCertificate className="mx-auto text-4xl text-blue-400" />
          <h2 className="mt-5 text-3xl font-bold md:text-5xl">Start with a secure LMS account.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Register as a student or teacher and continue from the dashboard that matches your role.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary px-6 py-3">
              Register
            </Link>
            <Link to="/login" className="btn-secondary px-6 py-3">
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
