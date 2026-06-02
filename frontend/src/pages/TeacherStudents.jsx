import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

export default function TeacherStudents() {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [panel, setPanel] = useState("message");
  const [messageText, setMessageText] = useState("");
  const [grade, setGrade] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadStudents() {
      try {
        const response = await api.get("/courses/teacher-students/");
        if (!mounted) return;

        const records = Array.isArray(response.data) ? response.data : [];
        setStudents(records);
        setSelectedStudent(records[0] || null);
        setError("");
      } catch {
        if (!mounted) return;
        setStudents([]);
        setSelectedStudent(null);
        setError("Unable to load enrolled students right now.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadStudents();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredStudents = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return students;
    }

    return students.filter((student) =>
      [student.name, student.email, student.course, student.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [query, students]);

  const stats = useMemo(() => {
    const courseCount = new Set(students.map((student) => student.course_id || student.course)).size;
    const averageProgress = students.length
      ? Math.round(students.reduce((sum, student) => sum + Number(student.progress || 0), 0) / students.length)
      : 0;
    const needsReview = students.filter((student) =>
      ["Needs Review", "At Risk"].includes(student.status)
    ).length;

    return { courseCount, averageProgress, needsReview };
  }, [students]);

  const hasStudents = students.length > 0;

  const exportReport = () => {
    if (!hasStudents) {
      setNotice("No enrolled students available to export.");
      return;
    }

    const header = "Name,Email,Course,Progress,Completed Lessons,Total Lessons,Status";
    const lines = students.map((student) =>
      [
        student.name || "",
        student.email || "",
        student.course || "",
        `${student.progress || 0}%`,
        student.completed_lessons || 0,
        student.total_lessons || 0,
        student.status || "",
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(",")
    );
    const blob = new Blob([[header, ...lines].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "enrolled-students-report.csv";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Enrolled students report downloaded.");
  };

  const openPanel = (type) => {
    setPanel(type);

    if (!selectedStudent) {
      setNotice("Select a student first.");
      return;
    }

    setNotice("");
  };

  const sendMessage = (event) => {
    event.preventDefault();

    if (!selectedStudent) {
      setNotice("Select a student first.");
      return;
    }

    if (!messageText.trim()) {
      setNotice("Enter a message before sending.");
      return;
    }

    setNotice(`Message prepared for ${selectedStudent.name}.`);
    setMessageText("");
  };

  const saveGrade = (event) => {
    event.preventDefault();

    if (!selectedStudent) {
      setNotice("Select a student first.");
      return;
    }

    if (!grade.trim()) {
      setNotice("Enter grading feedback before saving.");
      return;
    }

    setNotice(`Feedback saved for ${selectedStudent.name}.`);
    setGrade("");
  };

  return (
    <DashboardLayout>
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-slate-950">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Teacher Workspace</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Students</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportReport}
              className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={loading}
            >
              Export Report
            </button>
            <button
              onClick={() => openPanel("message")}
              className="rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={loading || !hasStudents}
            >
              Message Student
            </button>
            <button
              onClick={() => openPanel("grade")}
              className="rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={loading || !hasStudents}
            >
              Grade Assignments
            </button>
          </div>
        </div>
      </div>

      {(notice || error) && (
        <div className={`mb-8 rounded-xl border px-5 py-4 ${error ? "border-red-200 bg-red-50 text-red-800" : "border-blue-200 bg-blue-50 text-blue-900"}`}>
          {error || notice}
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-slate-950">
          <p className="text-sm font-medium text-slate-500">Students</p>
          <div className="mt-3 text-4xl font-bold text-blue-700">{students.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-slate-950">
          <p className="text-sm font-medium text-slate-500">Enrolled Courses</p>
          <div className="mt-3 text-4xl font-bold text-blue-700">{stats.courseCount}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-slate-950">
          <p className="text-sm font-medium text-slate-500">Average Progress</p>
          <div className="mt-3 text-4xl font-bold text-blue-700">{stats.averageProgress}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-slate-950">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Enrolled Students</h2>
              {hasStudents && (
                <p className="mt-1 text-sm text-slate-500">{stats.needsReview} student records need review.</p>
              )}
            </div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search students..."
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 md:w-80"
            />
          </div>

          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
              Loading enrolled students...
            </div>
          ) : !hasStudents ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <h3 className="text-xl font-semibold text-slate-900">No enrolled students yet.</h3>
              <p className="mt-2 text-slate-500">Students will appear here after they enroll in a course.</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
              No students match your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-200 text-sm text-slate-500">
                  <tr>
                    <th className="py-4 pr-4 font-medium">Student</th>
                    <th className="py-4 pr-4 font-medium">Course</th>
                    <th className="py-4 pr-4 font-medium">Progress</th>
                    <th className="py-4 pr-4 font-medium">Lessons</th>
                    <th className="py-4 pr-4 font-medium">Status</th>
                    <th className="py-4 pr-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-slate-100 last:border-0">
                      <td className="py-4 pr-4">
                        <div className="font-semibold">{student.name}</div>
                        <div className="text-sm text-slate-500">{student.email || "No email added"}</div>
                      </td>
                      <td className="py-4 pr-4 text-slate-600">{student.course}</td>
                      <td className="py-4 pr-4 text-slate-600">{student.progress || 0}%</td>
                      <td className="py-4 pr-4 text-slate-600">
                        {student.completed_lessons || 0}/{student.total_lessons || 0}
                      </td>
                      <td className="py-4 pr-4">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                          {student.status}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setNotice("");
                          }}
                          className="font-medium text-blue-700 hover:text-blue-900"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-slate-950">
          <h2 className="text-2xl font-bold">{panel === "message" ? "Message Student" : "Grade Assignment"}</h2>

          {!selectedStudent ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
              Select a student to message or grade.
            </div>
          ) : panel === "message" ? (
            <form onSubmit={sendMessage} className="mt-6">
              <p className="mb-4 text-sm text-slate-500">{selectedStudent.name}</p>
              <textarea
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                rows="7"
                placeholder="Write a message..."
                className="w-full rounded-lg border border-slate-300 bg-slate-50 p-4 outline-none focus:border-blue-500"
              />
              <button className="mt-4 w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700">
                Send Message
              </button>
            </form>
          ) : (
            <form onSubmit={saveGrade} className="mt-6">
              <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Student</div>
                <div className="mt-1 font-semibold">{selectedStudent.name}</div>
                <div className="mt-2 text-sm text-slate-500">{selectedStudent.course}</div>
              </div>
              <textarea
                value={grade}
                onChange={(event) => setGrade(event.target.value)}
                rows="7"
                placeholder="Enter grade and feedback..."
                className="w-full rounded-lg border border-slate-300 bg-slate-50 p-4 outline-none focus:border-blue-500"
              />
              <button className="mt-4 w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700">
                Save Feedback
              </button>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
