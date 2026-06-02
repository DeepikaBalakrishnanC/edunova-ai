import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import LMSModule from "./LMSModule";
import api from "../services/api";
import { deleteUserAccount, getUsers, ROLE_LABELS, updateUserAccount } from "../utils/auth";

const config = {
  teachers: {
    title: "Teachers Management",
    actions: [],
    tableTitle: "Teachers",
  },
  students: {
    title: "Students Management",
    actions: [],
    tableTitle: "Students",
  },
  courses: {
    title: "Course Management",
    actions: [],
    tableTitle: "All Courses",
  },
  lessons: {
    title: "Lesson Management",
    actions: [],
    tableTitle: "All Lessons",
  },
  analytics: {
    title: "Analytics Dashboard",
    actions: [],
    tableTitle: "Analytics Reports",
  },
  ai: {
    title: "AI Assistant Management",
    actions: [{ label: "AI Assistant", path: "/ai-chat" }],
    tableTitle: "AI Usage Logs",
  },
  settings: {
    title: "System Settings",
    actions: [{ label: "Manage Teachers", path: "/admin/teachers" }],
    tableTitle: "Configuration Items",
  },
};

export default function AdminModule({ type }) {
  const [users, setUsers] = useState(() => getUsers());
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [editingId, setEditingId] = useState("");
  const [accountForm, setAccountForm] = useState({ name: "", username: "", email: "", status: "active" });
  const [notice, setNotice] = useState("");
  const item = config[type] || config.analytics;
  const teacherUsers = users.filter((user) => user.role === "teacher");
  const studentUsers = users.filter((user) => user.role === "student");

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const coursesRes = await api.get("/courses/");
        const courseRecords = Array.isArray(coursesRes.data) ? coursesRes.data : [];
        setCourses(courseRecords);

        if (type === "lessons" || type === "analytics") {
          const lessonGroups = await Promise.all(
            courseRecords.map(async (course) => {
              try {
                const lessonsRes = await api.get(`/courses/${course.id}/lessons/`);
                const courseLessons = Array.isArray(lessonsRes.data) ? lessonsRes.data : [];
                return courseLessons.map((lesson) => ({ ...lesson, course }));
              } catch {
                return [];
              }
            })
          );

          setLessons(lessonGroups.flat());
        }
      } catch (error) {
        console.error(error);
        setCourses([]);
        setLessons([]);
      }
    };

    loadRecords();
  }, [type]);

  const startEditAccount = (account) => {
    setEditingId(account.id);
    setAccountForm({
      name: account.name || "",
      username: account.username || "",
      email: account.email || "",
      status: account.status || "active",
    });
    setNotice("");
  };

  const cancelEditAccount = () => {
    setEditingId("");
    setAccountForm({ name: "", username: "", email: "", status: "active" });
  };

  const saveAccount = (accountId, label) => {
    try {
      const updated = updateUserAccount(accountId, {
        name: accountForm.name.trim(),
        username: accountForm.username.trim(),
        email: accountForm.email.trim(),
        status: accountForm.status,
      });

      setUsers((currentUsers) => currentUsers.map((user) => (
        user.id === accountId ? updated : user
      )));
      cancelEditAccount();
      setNotice(`${label} updated.`);
    } catch (error) {
      setNotice(error.message || `Could not update ${label.toLowerCase()}.`);
    }
  };

  const deleteAccount = (accountId, label) => {
    const nextUsers = deleteUserAccount(accountId);
    setUsers(nextUsers);
    cancelEditAccount();
    setNotice(`${label} deleted.`);
  };

  const rows = useMemo(() => {
    if (type === "teachers") {
      return teacherUsers.map((user) => ({
        name: user.name || user.username,
        owner: user.email || "No email",
        status: user.status || "active",
        progress: ROLE_LABELS[user.role] || "Teacher",
        path: "/admin/teachers",
      }));
    }

    if (type === "students") {
      return studentUsers.map((user) => ({
        name: user.name || user.username,
        owner: user.email || "No email",
        status: user.status || "active",
        progress: ROLE_LABELS[user.role] || "Student",
        path: "/admin/students",
      }));
    }

    if (type === "courses") {
      return courses.map((course) => ({
        name: course.title,
        owner: course.instructor || "Not assigned",
        status: course.category || "Course",
        progress: course.created_at ? new Date(course.created_at).toLocaleDateString() : "Created",
        path: `/courses/${course.id}`,
      }));
    }

    if (type === "lessons") {
      return lessons.map((lesson) => ({
        name: lesson.title,
        owner: lesson.course?.title || "Course",
        status: "Lesson",
        progress: lesson.created_at ? new Date(lesson.created_at).toLocaleDateString() : "Created",
        path: `/course-player/${lesson.course?.id}`,
      }));
    }

    return [];
  }, [courses, lessons, studentUsers, teacherUsers, type]);

  const cards = [
    { label: "Users", value: users.length, note: "Stored accounts" },
    { label: "Teachers", value: teacherUsers.length, note: "Teacher accounts" },
    { label: "Students", value: studentUsers.length, note: "Student accounts" },
    { label: "Courses", value: courses.length, note: "Course records" },
  ];

  if (type === "teachers" || type === "students") {
    const managedAccounts = type === "teachers" ? teacherUsers : studentUsers;
    const accountLabel = type === "teachers" ? "Teacher" : "Student";
    const pageTitle = type === "teachers" ? "Teachers Management" : "Students Management";
    const tableTitle = type === "teachers" ? "Teachers" : "Students";

    return (
      <DashboardLayout>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-950 shadow-sm">
          <div>
            <p className="font-semibold text-blue-700">Admin Workspace</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">{pageTitle}</h1>
          </div>
        </div>

        {notice && (
          <div className="my-8 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-blue-900">
            {notice}
          </div>
        )}

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold">{tableTitle}</h2>

          {managedAccounts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
              No {accountLabel.toLowerCase()} accounts found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-200 text-sm text-slate-500">
                  <tr>
                    <th className="py-4 pr-4 font-medium">Name</th>
                    <th className="py-4 pr-4 font-medium">Username</th>
                    <th className="py-4 pr-4 font-medium">Email</th>
                    <th className="py-4 pr-4 font-medium">Status</th>
                    <th className="py-4 pr-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {managedAccounts.map((account) => {
                    const editing = editingId === account.id;

                    return (
                      <tr key={account.id} className="border-b border-slate-100 last:border-0">
                        <td className="py-4 pr-4">
                          {editing ? (
                            <input
                              value={accountForm.name}
                              onChange={(event) => setAccountForm({ ...accountForm, name: event.target.value })}
                              className="w-48 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-blue-500"
                            />
                          ) : (
                            <span className="font-semibold">{account.name || account.username}</span>
                          )}
                        </td>
                        <td className="py-4 pr-4">
                          {editing ? (
                            <input
                              value={accountForm.username}
                              onChange={(event) => setAccountForm({ ...accountForm, username: event.target.value })}
                              className="w-40 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-blue-500"
                            />
                          ) : (
                            <span className="text-slate-600">{account.username}</span>
                          )}
                        </td>
                        <td className="py-4 pr-4">
                          {editing ? (
                            <input
                              type="email"
                              value={accountForm.email}
                              onChange={(event) => setAccountForm({ ...accountForm, email: event.target.value })}
                              className="w-56 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-blue-500"
                            />
                          ) : (
                            <span className="text-slate-600">{account.email}</span>
                          )}
                        </td>
                        <td className="py-4 pr-4">
                          {editing ? (
                            <select
                              value={accountForm.status}
                              onChange={(event) => setAccountForm({ ...accountForm, status: event.target.value })}
                              className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-blue-500"
                            >
                              <option value="active">active</option>
                              <option value="pending-review">pending-review</option>
                              <option value="inactive">inactive</option>
                            </select>
                          ) : (
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">{account.status || "active"}</span>
                          )}
                        </td>
                        <td className="py-4 pr-4">
                          {editing ? (
                            <div className="flex flex-wrap gap-2">
                              <button type="button" onClick={() => saveAccount(account.id, accountLabel)} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700">
                                Update
                              </button>
                              <button type="button" onClick={cancelEditAccount} className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-800">
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              <button type="button" onClick={() => startEditAccount(account)} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700">
                                Edit
                              </button>
                              <button type="button" onClick={() => deleteAccount(account.id, accountLabel)} className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700">
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <LMSModule
      {...item}
      cards={cards}
      rows={rows}
    />
  );
}
