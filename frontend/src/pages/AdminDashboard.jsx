import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBook, FaRobot, FaUsers, FaUserGraduate, FaUserTie } from "react-icons/fa";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import { getUsers, ROLE_LABELS } from "../utils/auth";

export default function AdminDashboard() {
  const users = getUsers();
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await api.get("/courses/");
        setCourses(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error(error);
        setMessage("Could not load course records.");
      }
    };

    loadCourses();
  }, []);

  const stats = [
    { title: "Total Users", value: String(users.length), icon: <FaUsers /> },
    { title: "Teachers", value: String(users.filter((user) => user.role === "teacher").length), icon: <FaUserTie /> },
    { title: "Students", value: String(users.filter((user) => user.role === "student").length), icon: <FaUserGraduate /> },
    { title: "Courses", value: String(courses.length), icon: <FaBook /> },
  ];

  const controls = [
    { title: "Teachers", path: "/admin/teachers", icon: <FaUserTie /> },
    { title: "Students", path: "/admin/students", icon: <FaUserGraduate /> },
    { title: "Courses", path: "/admin/courses", icon: <FaBook /> },
    { title: "AI", path: "/admin/ai", icon: <FaRobot /> },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
        <div>
          <p className="text-blue-400 font-semibold">Administration</p>
          <h1 className="text-5xl font-bold mt-2">Admin Dashboard</h1>
        </div>
      </div>

      {message && (
        <div className="mb-8 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-100">
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div key={item.title} className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
            <div className="text-4xl text-blue-500 mb-4">{item.icon}</div>
            <h2 className="text-gray-400">{item.title}</h2>
            <p className="text-4xl font-bold mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <h2 className="text-3xl font-bold mb-6">Platform Controls</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {controls.map((control) => (
              <Link key={control.title} to={control.path} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 transition hover:bg-slate-700">
                <div className="text-blue-400 text-2xl">{control.icon}</div>
                <h3 className="text-xl font-bold mt-4">{control.title}</h3>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <h2 className="text-3xl font-bold mb-6">User Directory</h2>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="bg-slate-800 rounded-2xl p-5 flex items-center justify-between gap-4">
                <div><h3 className="font-semibold">{user.name}</h3><p className="text-gray-400 text-sm mt-1">{user.email}</p></div>
                <div className="text-right"><span className="text-blue-400">{ROLE_LABELS[user.role]}</span><p className="text-gray-500 text-sm mt-1">{user.status}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
