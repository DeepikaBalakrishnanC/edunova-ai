import { useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import { getStoredUser, ROLE_LABELS } from "../utils/auth";

export default function Profile() {
  const user = getStoredUser();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    username: user?.username || "",
  });
  const [message, setMessage] = useState("");

  const saveProfile = (event) => {
    event.preventDefault();
    const updated = { ...user, ...form };
    localStorage.setItem("user", JSON.stringify(updated));
    setMessage("Profile updated successfully.");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <p className="text-blue-400 font-semibold">Account</p>
        <h1 className="text-5xl font-bold mt-2">Profile</h1>

        <form onSubmit={saveProfile} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block"><span className="text-gray-300">Full Name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-xl p-4 outline-none focus:border-blue-500" /></label>
            <label className="block"><span className="text-gray-300">Email</span><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-xl p-4 outline-none focus:border-blue-500" /></label>
            <label className="block"><span className="text-gray-300">Username</span><input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-xl p-4 outline-none focus:border-blue-500" /></label>
            <label className="block"><span className="text-gray-300">Role</span><input value={ROLE_LABELS[user?.role] || "User"} disabled className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-gray-400" /></label>
          </div>
          {message && <div className="mt-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-100">{message}</div>}
          <button className="mt-8 bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-xl">Save Profile</button>
        </form>
      </div>
    </DashboardLayout>
  );
}
