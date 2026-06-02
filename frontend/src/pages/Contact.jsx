import { useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

const STORAGE_KEY = "edunova_contact_messages";

function readMessages() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveMessage(message) {
  const messages = readMessages();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([message, ...messages]));
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", role: "Student", subject: "", message: "" });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setError("Please complete all required fields.");
      setStatus("");
      return;
    }

    saveMessage({
      id: crypto.randomUUID(),
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      createdAt: new Date().toISOString(),
    });

    setForm({ name: "", email: "", role: "Student", subject: "", message: "" });
    setError("");
    setStatus("Your message has been saved. The EduNova team can review it from the local contact records.");
  };

  return (
    <div className="bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-400">Contact</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">Get support for your LMS workflow.</h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Send a message about courses, accounts, student access, teacher tools, or platform setup. The form stores submitted messages locally for this application.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <FaEnvelope className="mt-1 text-blue-400" />
                <div>
                  <div className="font-semibold">Email</div>
                  <div className="text-slate-400">support@edunova.ai</div>
                </div>
              </div>
              <div className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <FaPhoneAlt className="mt-1 text-blue-400" />
                <div>
                  <div className="font-semibold">Phone</div>
                  <div className="text-slate-400">+91 98765 43210</div>
                </div>
              </div>
              <div className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <FaMapMarkerAlt className="mt-1 text-blue-400" />
                <div>
                  <div className="font-semibold">Location</div>
                  <div className="text-slate-400">India</div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl md:p-8">
            <h2 className="text-2xl font-bold">Send Message</h2>

            {status && <div className="mt-5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-100">{status}</div>}
            {error && <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-100">{error}</div>}

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-300">Full Name</span>
                <input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Enter your name"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-300">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="name@example.com"
                />
              </label>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-300">Role</span>
                <select
                  value={form.role}
                  onChange={(event) => setForm({ ...form, role: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option>Student</option>
                  <option>Teacher</option>
                  <option>Admin</option>
                  <option>Visitor</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-300">Subject</span>
                <input
                  value={form.subject}
                  onChange={(event) => setForm({ ...form, subject: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="How can we help?"
                />
              </label>
            </div>

            <label className="mt-5 block">
              <span className="text-sm font-medium text-slate-300">Message</span>
              <textarea
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                rows="7"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="Write your message"
              />
            </label>

            <button className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700">
              Submit Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
