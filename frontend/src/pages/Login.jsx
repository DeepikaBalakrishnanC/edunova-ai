import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { toast } from "react-toastify";

import { loginSuccess } from "../redux/authSlice";
import api from "../services/api";
import { dashboardForRole } from "../utils/auth";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "student", password: "student123" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/accounts/login/", {
        username: formData.username.trim(),
        password: formData.password,
      });
      const { access, refresh, user } = response.data;

      localStorage.setItem("token", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch(loginSuccess({ token: access, user }));
      toast.success("Welcome back, " + user.name + ".");
      navigate(dashboardForRole(user.role), { replace: true });
    } catch (error) {
      const message = error.response?.data?.error || "Invalid username or password.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const quickAccessAccounts = [
    ["teacher", "teacher123", "Teacher", <FaChalkboardTeacher />],
    ["student", "student123", "Student", <FaUserGraduate />],
  ];

  return (
    <div className="page-shell min-h-screen text-white px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="glass-panel rounded-3xl p-8 lg:p-10">
          <p className="section-eyebrow">EduNova AI LMS</p>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">Sign in to your workspace</h1>
          <p className="text-gray-400 mt-5 leading-relaxed">
            Continue learning, manage courses, review assignments, and keep your LMS work in one focused place.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            <div className="text-sm font-semibold text-gray-300">Quick access</div>
            <p className="mt-1 text-sm text-gray-500">Student and teacher demo profiles are available for review.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
            {quickAccessAccounts.map(([username, password, role, icon]) => (
              <button
                key={role}
                type="button"
                onClick={() => setFormData({ username, password })}
                className="lift-card text-left bg-slate-800 hover:bg-slate-700 border border-slate-700 transition rounded-2xl p-4"
              >
                <div className="text-2xl text-blue-400">{icon}</div>
                <div className="font-semibold mt-3">{role}</div>
                <div className="text-sm text-gray-400 mt-1">{username}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="soft-panel p-8 lg:p-10 rounded-3xl">
          <h2 className="text-3xl font-bold">Login</h2>
          <p className="text-gray-400 mt-2">Use your LMS account credentials.</p>

          <div className="mt-8">
            <label className="block mb-2 text-sm text-gray-300">Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required className="form-field" />
          </div>

          <div className="mt-5">
            <label className="block mb-2 text-sm text-gray-300">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="form-field" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-8 p-4 text-lg disabled:opacity-50">
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-center text-gray-400 mt-6">
            New to EduNova? <Link to="/register" className="text-blue-400 hover:underline">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
