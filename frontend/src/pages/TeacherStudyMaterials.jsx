import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import { getStudyMaterials, saveStudyMaterials } from "../utils/studyMaterials";

const emptyForm = {
  title: "",
  courseId: "",
  type: "PDF",
  link: "",
  notes: "",
};

export default function TeacherStudyMaterials() {
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState(() => getStudyMaterials());
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await api.get("/courses/");
        const records = Array.isArray(res.data) ? res.data : [];
        setCourses(records);
        setForm((current) => ({ ...current, courseId: current.courseId || String(records[0]?.id || "") }));
      } catch (error) {
        console.error(error);
        setNotice("Could not load courses.");
      }
    };

    loadCourses();
  }, []);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setEditingId("");
    setForm({ ...emptyForm, courseId: String(courses[0]?.id || "") });
  };

  const persist = (nextMaterials, message) => {
    setMaterials(nextMaterials);
    saveStudyMaterials(nextMaterials);
    setNotice(message);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.courseId) {
      setNotice("Add a title and select a course.");
      return;
    }

    const course = courses.find((item) => String(item.id) === String(form.courseId));
    const payload = {
      title: form.title.trim(),
      courseId: String(form.courseId),
      courseTitle: course?.title || "Course",
      type: form.type,
      link: form.link.trim(),
      notes: form.notes.trim(),
    };

    if (editingId) {
      const nextMaterials = materials.map((material) => (
        material.id === editingId ? { ...material, ...payload } : material
      ));
      persist(nextMaterials, "Study material updated.");
      resetForm();
      return;
    }

    const nextMaterials = [
      {
        ...payload,
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        createdAt: new Date().toISOString(),
      },
      ...materials,
    ];
    persist(nextMaterials, "Study material added.");
    resetForm();
  };

  const startEdit = (material) => {
    setEditingId(material.id);
    setForm({
      title: material.title || "",
      courseId: String(material.courseId || ""),
      type: material.type || "PDF",
      link: material.link || "",
      notes: material.notes || "",
    });
    setNotice("");
  };

  const deleteMaterial = (materialId) => {
    const nextMaterials = materials.filter((material) => material.id !== materialId);
    persist(nextMaterials, "Study material deleted.");
    if (editingId === materialId) {
      resetForm();
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-10">
        <p className="font-semibold text-blue-400">Teacher Workspace</p>
        <h1 className="mt-2 text-5xl font-bold">Study Materials</h1>
      </div>

      {notice && (
        <div className="mb-8 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-100">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-3xl font-bold">{editingId ? "Edit Study Material" : "Add Study Material"}</h2>

          <div className="mt-6 space-y-5">
            <input
              value={form.title}
              onChange={(event) => updateForm("title", event.target.value)}
              placeholder="Material title"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 outline-none focus:border-blue-500"
            />
            <select
              value={form.courseId}
              onChange={(event) => updateForm("courseId", event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 outline-none focus:border-blue-500"
            >
              <option value="">Select course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
            <select
              value={form.type}
              onChange={(event) => updateForm("type", event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 outline-none focus:border-blue-500"
            >
              <option>PDF</option>
              <option>Document</option>
              <option>Video</option>
              <option>Reference Link</option>
            </select>
            <input
              value={form.link}
              onChange={(event) => updateForm("link", event.target.value)}
              placeholder="Material link"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 outline-none focus:border-blue-500"
            />
            <textarea
              value={form.notes}
              onChange={(event) => updateForm("notes", event.target.value)}
              placeholder="Notes"
              rows="5"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 outline-none focus:border-blue-500"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700">
              {editingId ? "Update Material" : "Add Material"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="rounded-xl bg-slate-800 px-6 py-3 font-semibold transition hover:bg-slate-700">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-3xl font-bold">View Study Materials</h2>

          {materials.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-800 p-8 text-center text-gray-300">
              No study materials added yet.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {materials.map((material) => (
                <div key={material.id} className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{material.title}</h3>
                      <p className="mt-1 text-gray-400">{material.courseTitle}</p>
                      <p className="mt-3 text-sm text-blue-400">{material.type}</p>
                      {material.notes && <p className="mt-3 text-gray-300">{material.notes}</p>}
                      {material.link && <p className="mt-3 break-all text-sm text-gray-400">{material.link}</p>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => startEdit(material)} className="rounded-lg bg-blue-600 px-4 py-2 font-medium transition hover:bg-blue-700">
                        Edit
                      </button>
                      <button type="button" onClick={() => deleteMaterial(material.id)} className="rounded-lg bg-red-600 px-4 py-2 font-medium transition hover:bg-red-700">
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
