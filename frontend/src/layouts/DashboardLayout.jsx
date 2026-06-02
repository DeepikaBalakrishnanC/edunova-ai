import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  FaBars,
  FaBook,
  FaCertificate,
  FaChalkboardTeacher,
  FaChartLine,
  FaClipboardList,
  FaCog,
  FaComments,
  FaFileAlt,
  FaHome,
  FaKey,
  FaPlayCircle,
  FaRobot,
  FaTimes,
  FaUser,
  FaUserGraduate,
  FaUsers,
} from "react-icons/fa";

import { getStoredUser, ROLE_LABELS, ROLES } from "../utils/auth";

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const user = getStoredUser();
  const role = user?.role || ROLES.STUDENT;

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard", roles: [ROLES.STUDENT] },
    { name: "Courses", icon: <FaBook />, path: "/courses", roles: [ROLES.STUDENT] },
    { name: "My Courses", icon: <FaPlayCircle />, path: "/my-courses", roles: [ROLES.STUDENT] },
    { name: "Study Materials", icon: <FaFileAlt />, path: "/materials", roles: [ROLES.STUDENT] },
    { name: "Assignments", icon: <FaClipboardList />, path: "/assignments", roles: [ROLES.STUDENT] },
    { name: "AI Assistant", icon: <FaRobot />, path: "/ai-chat", roles: [ROLES.STUDENT, ROLES.TEACHER] },
    { name: "Quiz", icon: <FaClipboardList />, path: "/quiz", roles: [ROLES.STUDENT] },
    { name: "Certificates", icon: <FaCertificate />, path: "/certificate", roles: [ROLES.STUDENT] },
    { name: "Complaints / Doubts", icon: <FaComments />, path: "/complaints", roles: [ROLES.STUDENT] },

    { name: "Dashboard", icon: <FaChalkboardTeacher />, path: "/teacher", roles: [ROLES.TEACHER] },
    { name: "Courses", icon: <FaBook />, path: "/teacher/courses", roles: [ROLES.TEACHER] },
    { name: "Create Course", icon: <FaBook />, path: "/teacher/create-course", roles: [ROLES.TEACHER] },
    { name: "Add Lesson", icon: <FaPlayCircle />, path: "/teacher/add-lesson", roles: [ROLES.TEACHER] },
    { name: "Study Materials", icon: <FaFileAlt />, path: "/teacher/materials", roles: [ROLES.TEACHER] },
    { name: "Assignments", icon: <FaClipboardList />, path: "/teacher/assignments", roles: [ROLES.TEACHER] },
    { name: "Students", icon: <FaUserGraduate />, path: "/teacher/students", roles: [ROLES.TEACHER] },
    { name: "Complaints & Doubts", icon: <FaComments />, path: "/teacher/complaints", roles: [ROLES.TEACHER] },

    { name: "Dashboard", icon: <FaChartLine />, path: "/admin-dashboard", roles: [ROLES.ADMIN] },
    { name: "Teachers", icon: <FaChalkboardTeacher />, path: "/admin/teachers", roles: [ROLES.ADMIN] },
    { name: "Students", icon: <FaUsers />, path: "/admin/students", roles: [ROLES.ADMIN] },
    { name: "Courses", icon: <FaBook />, path: "/admin/courses", roles: [ROLES.ADMIN] },
    { name: "Lessons", icon: <FaPlayCircle />, path: "/admin/lessons", roles: [ROLES.ADMIN] },
    { name: "Complaints", icon: <FaComments />, path: "/admin/complaints", roles: [ROLES.ADMIN] },
    { name: "Analytics", icon: <FaChartLine />, path: "/admin/analytics", roles: [ROLES.ADMIN] },
    { name: "AI Management", icon: <FaRobot />, path: "/admin/ai", roles: [ROLES.ADMIN] },
    { name: "System Settings", icon: <FaCog />, path: "/admin/settings", roles: [ROLES.ADMIN] },

    { name: "Profile", icon: <FaUser />, path: "/profile", roles: [ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN] },
    { name: "Change Password", icon: <FaKey />, path: "/change-password", roles: [ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN] },
  ].filter((item) => item.roles.includes(role));

  return (
    <div className="min-h-screen text-white flex">
      <button className="lg:hidden fixed top-5 left-5 z-50 bg-blue-600 p-3 rounded-xl shadow-lg" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <FaTimes /> : <FaBars />}
      </button>

      <aside className={(open ? "translate-x-0" : "-translate-x-full lg:translate-x-0") + " fixed lg:static top-0 left-0 h-full w-80 bg-slate-900 border-r border-slate-800 p-5 transform transition-transform duration-300 z-40 overflow-y-auto"}>
        <Link to="/" className="block text-3xl font-bold text-white tracking-tight">EduNova <span className="text-blue-400">AI</span></Link>
        <div className="mt-5 mb-8 rounded-2xl bg-slate-950 border border-slate-800 p-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">Signed in as</div>
          <div className="font-semibold mt-2">{user?.name || "EduNova User"}</div>
          <div className="inline-block rounded-full bg-blue-500/10 text-blue-300 text-sm mt-3 px-3 py-1">{ROLE_LABELS[role]}</div>
        </div>

        <ul className="space-y-2">
          {menuItems.map((item) => {
            const active = location.pathname === item.path || (
              item.path !== "/" && location.pathname.startsWith(item.path + "/")
            );
            return (
              <li key={item.name + item.path}>
                <Link
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={(active ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30" : "text-gray-300 hover:bg-slate-800 hover:text-white") + " flex items-center gap-4 transition p-3.5 rounded-xl"}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      <main className="flex-1 p-6 pt-20 lg:pt-10 lg:p-10 overflow-x-hidden">{children}</main>
    </div>
  );
}
