import { useMemo, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import { getStoredUser, ROLES } from "../utils/auth";

const STORAGE_KEY = "edunova_support_requests";

function readRequests() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveRequests(requests) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export default function Complaints() {
  const user = getStoredUser();
  const [items, setItems] = useState(() => readRequests());
  const [form, setForm] = useState({ type: "Doubt", subject: "", message: "" });
  const [replyingTo, setReplyingTo] = useState(null);
  const [reply, setReply] = useState("");
  const [notice, setNotice] = useState("");


  const visibleItems = useMemo(() => {
    if (user?.role === ROLES.STUDENT) {
      return items.filter((item) => item.senderEmail === user?.email || item.sender === user?.name);
    }

    return items;
  }, [items, user?.email, user?.name, user?.role]);

  const submit = (event) => {
    event.preventDefault();

    const request = {
      id: crypto.randomUUID(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      sender: user?.name || "Student",
      senderEmail: user?.email || "",
      status: "Open",
      type: form.type,
      reply: "",
      createdAt: new Date().toISOString(),
    };

    const nextItems = [request, ...items];
    setItems(nextItems);
    saveRequests(nextItems);
    setForm({ type: "Doubt", subject: "", message: "" });
    setNotice("Request submitted.");
  };

  const saveReply = (event) => {
    event.preventDefault();

    if (!reply.trim() || !replyingTo) {
      setNotice("Enter a reply before saving.");
      return;
    }

    const nextItems = items.map((item) =>
      item.id === replyingTo.id
        ? { ...item, reply: reply.trim(), status: "Resolved", repliedAt: new Date().toISOString() }
        : item
    );

    setItems(nextItems);
    saveRequests(nextItems);
    setReplyingTo(null);
    setReply("");
    setNotice("Reply saved.");
  };

  const canReply = user?.role === ROLES.TEACHER || user?.role === ROLES.ADMIN;

  return (
    <DashboardLayout>
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-semibold text-blue-400">Support Center</p>
          <h1 className="mt-2 text-5xl font-bold">Complaints & Doubts</h1>
        </div>
      </div>

      {notice && (
        <div className="mb-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-100">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {user?.role === ROLES.STUDENT && (
          <form onSubmit={submit} className="rounded-3xl border border-slate-800 bg-slate-900 p-8 xl:col-span-1">
            <h2 className="mb-6 text-2xl font-bold">Raise Request</h2>
            <select
              value={form.type}
              onChange={(event) => setForm({ ...form, type: event.target.value })}
              className="mb-4 w-full rounded-xl border border-slate-700 bg-slate-800 p-4"
            >
              <option>Doubt</option>
              <option>Complaint</option>
            </select>
            <input
              value={form.subject}
              onChange={(event) => setForm({ ...form, subject: event.target.value })}
              placeholder="Subject"
              required
              className="mb-4 w-full rounded-xl border border-slate-700 bg-slate-800 p-4"
            />
            <textarea
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              placeholder="Describe your issue"
              rows="6"
              required
              className="mb-4 w-full rounded-xl border border-slate-700 bg-slate-800 p-4"
            />
            <button className="rounded-xl bg-blue-600 px-6 py-3 hover:bg-blue-700">Submit Request</button>
          </form>
        )}

        <div className={(user?.role === ROLES.STUDENT ? "xl:col-span-2" : "xl:col-span-3") + " rounded-3xl border border-slate-800 bg-slate-900 p-8"}>
          <h2 className="mb-6 text-2xl font-bold">Request Tracker</h2>

          {visibleItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-800/70 p-8 text-center text-gray-300">
              No complaints or doubts have been submitted yet.
            </div>
          ) : (
            <div className="space-y-4">
              {visibleItems.map((item) => (
                <div key={item.id} className="rounded-2xl bg-slate-800 p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-semibold">{item.subject}</div>
                      <div className="mt-1 text-sm text-gray-400">{item.type} from {item.sender}</div>
                      {item.message && <div className="mt-3 text-sm text-gray-300">{item.message}</div>}
                      {item.reply && (
                        <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-100">
                          {item.reply}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300">{item.status}</span>
                      {canReply && (
                        <button
                          onClick={() => {
                            setReplyingTo(item);
                            setReply(item.reply || "");
                            setNotice("");
                          }}
                          className="rounded-xl bg-slate-700 px-4 py-2 hover:bg-slate-600"
                        >
                          Reply
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {replyingTo && (
        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-2xl font-bold">Reply to Request</h2>
          <p className="mt-2 text-gray-400">{replyingTo.subject}</p>
          <form onSubmit={saveReply} className="mt-6">
            <textarea
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              rows="5"
              placeholder="Write your reply..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 outline-none focus:border-blue-500"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="rounded-xl bg-blue-600 px-6 py-3 hover:bg-blue-700">Save Reply</button>
              <button
                type="button"
                onClick={() => {
                  setReplyingTo(null);
                  setReply("");
                }}
                className="rounded-xl bg-slate-700 px-6 py-3 hover:bg-slate-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}
