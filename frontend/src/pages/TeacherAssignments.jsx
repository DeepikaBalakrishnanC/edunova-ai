import { useMemo, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

const STORAGE_KEY = "edunova_assignments";

function loadAssignments() {
  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function saveAssignments(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const emptyForm = {
  title: "",
  course: "",
  dueDate: "",
  instructions: "",
};

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState(() => loadAssignments());
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [notice, setNotice] = useState("");

  const activeAssignment = useMemo(
    () => assignments.find((assignment) => assignment.id === editingId),
    [assignments, editingId]
  );

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleAdd = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.course.trim() || !form.dueDate) {
      setNotice("Add a title, course, and due date.");
      return;
    }

    const nextAssignment = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title: form.title.trim(),
      course: form.course.trim(),
      dueDate: form.dueDate,
      instructions: form.instructions.trim(),
      createdAt: new Date().toISOString(),
    };
    const nextAssignments = [nextAssignment, ...assignments];

    setAssignments(nextAssignments);
    saveAssignments(nextAssignments);
    setForm(emptyForm);
    setNotice("Assignment added.");
  };

  const startEdit = (assignment) => {
    setEditingId(assignment.id);
    setForm({
      title: assignment.title || "",
      course: assignment.course || "",
      dueDate: assignment.dueDate || "",
      instructions: assignment.instructions || "",
    });
    setNotice("");
  };

  const cancelEdit = () => {
    setEditingId("");
    setForm(emptyForm);
  };

  const handleUpdate = (event) => {
    event.preventDefault();

    if (!editingId) return;
    if (!form.title.trim() || !form.course.trim() || !form.dueDate) {
      setNotice("Add a title, course, and due date.");
      return;
    }

    const nextAssignments = assignments.map((assignment) => (
      assignment.id === editingId
        ? {
          ...assignment,
          title: form.title.trim(),
          course: form.course.trim(),
          dueDate: form.dueDate,
          instructions: form.instructions.trim(),
        }
        : assignment
    ));

    setAssignments(nextAssignments);
    saveAssignments(nextAssignments);
    cancelEdit();
    setNotice("Assignment updated.");
  };

  const handleDelete = (assignmentId) => {
    const nextAssignments = assignments.filter((assignment) => assignment.id !== assignmentId);

    setAssignments(nextAssignments);
    saveAssignments(nextAssignments);
    if (editingId === assignmentId) {
      cancelEdit();
    }
    setNotice("Assignment deleted.");
  };

  return (
    <DashboardLayout>
      <div className="mb-10">
        <p className="font-semibold text-blue-400">Teacher Workspace</p>
        <h1 className="mt-2 text-5xl font-bold">Assignments</h1>
      </div>

      {notice && (
        <div className="mb-8 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-100">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={editingId ? handleUpdate : handleAdd} className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-3xl font-bold">{editingId ? "Edit Assignment" : "Add Assignment"}</h2>
          {editingId && activeAssignment && (
            <p className="mt-2 text-gray-400">Editing {activeAssignment.title}</p>
          )}

          <div className="mt-6 space-y-5">
            <input
              value={form.title}
              onChange={(event) => updateForm("title", event.target.value)}
              placeholder="Assignment title"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 outline-none focus:border-blue-500"
            />
            <input
              value={form.course}
              onChange={(event) => updateForm("course", event.target.value)}
              placeholder="Course name"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 outline-none focus:border-blue-500"
            />
            <input
              type="date"
              value={form.dueDate}
              onChange={(event) => updateForm("dueDate", event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 outline-none focus:border-blue-500"
            />
            <textarea
              value={form.instructions}
              onChange={(event) => updateForm("instructions", event.target.value)}
              placeholder="Instructions"
              rows="5"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 outline-none focus:border-blue-500"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700">
              {editingId ? "Update Assignment" : "Add Assignment"}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="rounded-xl bg-slate-800 px-6 py-3 font-semibold transition hover:bg-slate-700">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-3xl font-bold">View Assignments</h2>

          {assignments.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-800 p-8 text-center text-gray-300">
              No assignments added yet.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{assignment.title}</h3>
                      <p className="mt-1 text-gray-400">{assignment.course}</p>
                      <p className="mt-3 text-sm text-gray-300">Due: {assignment.dueDate}</p>
                      {assignment.instructions && (
                        <p className="mt-4 leading-7 text-gray-300">{assignment.instructions}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => startEdit(assignment)} className="rounded-lg bg-blue-600 px-4 py-2 font-medium transition hover:bg-blue-700">
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDelete(assignment.id)} className="rounded-lg bg-red-600 px-4 py-2 font-medium transition hover:bg-red-700">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
