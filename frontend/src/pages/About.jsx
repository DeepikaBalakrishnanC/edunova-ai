import { Link } from "react-router-dom";
import { FaChalkboardTeacher, FaLock, FaRobot, FaUserGraduate } from "react-icons/fa";

export default function About() {
  const pillars = [
    {
      title: "Role-based learning",
      description: "Separate dashboards keep students, teachers, and admins focused on the work they are allowed to manage.",
      icon: <FaLock />,
    },
    {
      title: "Course delivery",
      description: "Teachers can organize courses, lessons, materials, and learner progress from one workspace.",
      icon: <FaChalkboardTeacher />,
    },
    {
      title: "Student support",
      description: "Students can access enrolled courses, track progress, raise doubts, and continue learning with guided support.",
      icon: <FaUserGraduate />,
    },
    {
      title: "AI assistance",
      description: "Built-in AI tools help learners ask questions and help teachers prepare learning content faster.",
      icon: <FaRobot />,
    },
  ];

  return (
    <div className="bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-400">About EduNova AI</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">A focused LMS for structured digital learning.</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              EduNova AI brings courses, lessons, student progress, certificates, support requests, and AI assistance into a single learning platform. The system is designed around clear permissions so each role sees the tools that match their responsibility.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/courses" className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
                Explore Courses
              </Link>
              <Link to="/contact" className="rounded-xl border border-slate-600 px-6 py-3 font-semibold text-white transition hover:border-blue-400 hover:text-blue-300">
                Contact Team
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="rounded-2xl border border-slate-700 bg-slate-950 p-6">
              <div className="text-sm font-medium text-slate-400">Platform Structure</div>
              <div className="mt-6 space-y-4">
                {["Admin control", "Teacher course management", "Student learning workspace", "AI learning support"].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3">
                    <span className="font-medium text-slate-100">{item}</span>
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300">Active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/60">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-16 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <div className="text-3xl text-blue-400">{pillar.icon}</div>
              <h2 className="mt-5 text-xl font-bold">{pillar.title}</h2>
              <p className="mt-3 leading-7 text-slate-400">{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-bold">Built for daily academic operations</h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-slate-300 lg:col-span-2">
            <p>
              The platform keeps course creation, lesson delivery, student enrollment, progress tracking, and support workflows connected. Teachers can manage learning content while students get a clean path to study, complete lessons, ask questions, and view their progress.
            </p>
            <p>
              Admin tools provide oversight for users, courses, reports, and platform settings, while route protection keeps restricted areas away from unauthorized roles.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
