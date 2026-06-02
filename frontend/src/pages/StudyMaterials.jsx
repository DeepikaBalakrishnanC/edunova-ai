import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import { getStudyMaterials } from "../utils/studyMaterials";

function pdfText(value) {
  return String(value || "")
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

function downloadPdf(filename, lines) {
  const pageLines = lines.slice(0, 32);
  const textCommands = pageLines.map((line, index) => {
    const y = 760 - index * 22;
    return `BT /F1 12 Tf 52 ${y} Td (${pdfText(line)}) Tj ET`;
  }).join("\n");
  const stream = textCommands;
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    `5 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += object + "\n";
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += String(offset).padStart(10, "0") + " 00000 n \n";
  });
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function StudyMaterials() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [lessonsByCourse, setLessonsByCourse] = useState({});
  const [teacherMaterials, setTeacherMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const coursesRes = await api.get("/courses/my-courses/?student_id=1");
        const enrolledCourses = Array.isArray(coursesRes.data) ? coursesRes.data : [];
        setCourses(enrolledCourses);
        setSelectedCourseId(enrolledCourses[0]?.id ? String(enrolledCourses[0].id) : "");
        setTeacherMaterials(getStudyMaterials());

        const lessonEntries = await Promise.all(
          enrolledCourses.map(async (course) => {
            try {
              const lessonsRes = await api.get(`/courses/${course.id}/lessons/`);
              return [course.id, Array.isArray(lessonsRes.data) ? lessonsRes.data : []];
            } catch {
              return [course.id, []];
            }
          })
        );

        setLessonsByCourse(Object.fromEntries(lessonEntries));
      } catch (error) {
        console.error(error);
        setMessage("Could not load course materials.");
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, []);

  const selectedCourse = courses.find((course) => String(course.id) === selectedCourseId);
  const selectedLessons = useMemo(
    () => lessonsByCourse[selectedCourse?.id] || [],
    [lessonsByCourse, selectedCourse?.id]
  );
  const selectedTeacherMaterials = useMemo(
    () => teacherMaterials.filter((material) => String(material.courseId) === selectedCourseId),
    [selectedCourseId, teacherMaterials]
  );

  const handleDownloadPdf = () => {
    if (!selectedCourse) return;

    const lines = [
      "EduNova AI Course Materials",
      "",
      `Course: ${selectedCourse.title}`,
      `Instructor: ${selectedCourse.instructor || "Not assigned"}`,
      `Category: ${selectedCourse.category || "Course"}`,
      "",
      "Study Materials:",
      ...(selectedTeacherMaterials.length
        ? selectedTeacherMaterials.map((material, index) => `${index + 1}. ${material.title} (${material.type})`)
        : ["No teacher-added materials available."]),
      "",
      "Course Lessons:",
      ...(selectedLessons.length
        ? selectedLessons.map((lesson, index) => `${index + 1}. ${lesson.title}`)
        : ["No lessons available."]),
    ];

    downloadPdf(`${selectedCourse.title || "course"}-materials.pdf`, lines);
  };

  return (
    <DashboardLayout>
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-semibold text-blue-400">Student Workspace</p>
          <h1 className="mt-2 text-5xl font-bold">Study Materials</h1>
        </div>
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={!selectedCourse}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Download as PDF
        </button>
      </div>

      {message && (
        <div className="mb-8 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-4 text-blue-100">
          {message}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">Loading materials...</div>
      ) : courses.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
          No course materials found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[0.75fr_1.25fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">View Course Materials</h2>
            <div className="mt-5 space-y-3">
              {courses.map((course) => (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => setSelectedCourseId(String(course.id))}
                  className={(String(course.id) === selectedCourseId ? "bg-blue-600 text-white" : "bg-slate-800 hover:bg-slate-700") + " w-full rounded-xl p-4 text-left transition"}
                >
                  <div className="font-semibold">{course.title}</div>
                  <div className="mt-1 text-sm text-gray-300">{course.category || "Course"}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-3xl font-bold">{selectedCourse?.title}</h2>
                <p className="mt-2 text-gray-400">{selectedCourse?.instructor || "Instructor not assigned"}</p>
              </div>
              {selectedCourse && (
                <Link to={`/course-player/${selectedCourse.id}`} className="rounded-xl bg-slate-800 px-5 py-3 font-semibold transition hover:bg-slate-700">
                  Open Course
                </Link>
              )}
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-bold">Course Materials</h3>
              {selectedTeacherMaterials.length === 0 && selectedLessons.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-700 bg-slate-800 p-8 text-center text-gray-300">
                  No materials available for this course.
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {selectedTeacherMaterials.map((material) => (
                    <div key={material.id} className="rounded-2xl bg-slate-800 p-5">
                      <div className="text-sm text-blue-400">{material.type}</div>
                      <h4 className="mt-2 text-xl font-semibold">{material.title}</h4>
                      {material.notes && <p className="mt-3 text-gray-300">{material.notes}</p>}
                      {material.link && (
                        <a href={material.link} target="_blank" rel="noreferrer" className="mt-3 inline-block break-all text-sm text-blue-400 hover:text-blue-300">
                          Open material
                        </a>
                      )}
                    </div>
                  ))}
                  {selectedLessons.map((lesson, index) => (
                    <div key={lesson.id} className="rounded-2xl bg-slate-800 p-5">
                      <div className="text-sm text-blue-400">Lesson {index + 1}</div>
                      <h4 className="mt-2 text-xl font-semibold">{lesson.title}</h4>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
