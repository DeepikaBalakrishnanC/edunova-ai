import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { loginSuccess } from "../redux/authSlice";
import api from "../services/api";
import { dashboardForRole } from "../utils/auth";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
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

  return (
    <div className="page-shell min-h-screen text-white px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <form onSubmit={handleSubmit} className="glass-panel p-8 lg:p-10 rounded-3xl">
          <p className="section-eyebrow">EduNova AI LMS</p>
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
