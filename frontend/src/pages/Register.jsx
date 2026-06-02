import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { loginSuccess } from "../redux/authSlice";
import api from "../services/api";
import { dashboardForRole, ROLE_LABELS, ROLES } from "../utils/auth";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: "", username: "", email: "", password: "", confirmPassword: "", role: ROLES.STUDENT });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.role === ROLES.ADMIN) {
      toast.error("Admin registration is disabled.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password and confirm password do not match.");
      return;
    }

    try {
      const response = await api.post("/accounts/register/", {
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });
      const { access, refresh, user } = response.data;

      localStorage.setItem("token", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(loginSuccess({ token: access, user }));

      toast.success("Account created as " + ROLE_LABELS[user.role] + ".");
      navigate(dashboardForRole(user.role), { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to create account.");
    }
  };

  const roles = [
    { value: ROLES.STUDENT, title: "Student", text: "Learn courses, take quizzes, track progress." },
    { value: ROLES.TEACHER, title: "Teacher", text: "Create courses, lessons, quizzes, and view learners." },
  ];

  return (
    <div className="page-shell min-h-screen text-white px-4 py-10 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="glass-panel p-8 lg:p-10 rounded-3xl w-full max-w-3xl">
        <p className="section-eyebrow">EduNova AI LMS</p>
        <h1 className="text-4xl font-bold mt-3">Create Account</h1>
        <p className="text-gray-400 mt-3">Choose the workspace that matches how you use the platform.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {roles.map((role) => {
            const selected = formData.role === role.value;
            return (
              <label key={role.value} className={(selected ? "border-blue-500 bg-blue-500/10" : "border-slate-700 bg-slate-800 hover:bg-slate-700") + " lift-card cursor-pointer rounded-2xl border p-5 transition"}>
                <input type="radio" name="role" value={role.value} checked={selected} onChange={handleChange} className="sr-only" />
                <div className="text-xl font-bold">{role.title}</div>
                <p className="text-sm text-gray-400 mt-2">{role.text}</p>
              </label>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Full name" required className="form-field" />
          <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" required className="form-field" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="form-field" />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" minLength="6" required className="form-field" />
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" minLength="6" required className="form-field" />
        </div>

        <button className="btn-primary w-full p-4 text-lg mt-8">
          Create {ROLE_LABELS[formData.role]} Account
        </button>

        <p className="text-center text-gray-400 mt-6">
          Already registered? <Link to="/login" className="text-blue-400 hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
