import { useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

export default function ChangePassword() {
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (form.next.length < 6) {
      setMessage("New password must contain at least 6 characters.");
      return;
    }
    if (form.next !== form.confirm) {
      setMessage("New password and confirmation do not match.");
      return;
    }
    setMessage("Password update request accepted. Connect this screen to your production password API to persist it.");
    setForm({ current: "", next: "", confirm: "" });
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <p className="text-blue-400 font-semibold">Security</p>
        <h1 className="text-5xl font-bold mt-2">Change Password</h1>
        <p className="text-gray-400 mt-3">Keep LMS accounts secure with a strong password.</p>
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mt-10 space-y-5">
          <input type="password" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} placeholder="Current password" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 outline-none focus:border-blue-500" />
          <input type="password" value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} placeholder="New password" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 outline-none focus:border-blue-500" />
          <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="Confirm new password" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 outline-none focus:border-blue-500" />
          {message && <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-100">{message}</div>}
          <button className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-xl">Update Password</button>
        </form>
      </div>
    </DashboardLayout>
  );
}
