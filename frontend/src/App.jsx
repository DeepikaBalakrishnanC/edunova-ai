import { BrowserRouter, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AIChat from "./pages/AIChat";
import Quiz from "./pages/Quiz";
import Certificate from "./pages/Certificate";
import TeacherDashboard from "./pages/TeacherDashboard";
import CreateCourse from "./pages/CreateCourse";
import AddLesson from "./pages/AddLesson";
import CoursePlayer from "./pages/CoursePlayer";
import MyCourses from "./pages/MyCourses";
import StudyMaterials from "./pages/StudyMaterials";
import AdminDashboard from "./pages/AdminDashboard";
import LMSModule from "./pages/LMSModule";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import Complaints from "./pages/Complaints";
import TeacherCourses from "./pages/TeacherCourses";
import TeacherStudents from "./pages/TeacherStudents";
import TeacherAssignments from "./pages/TeacherAssignments";
import TeacherStudyMaterials from "./pages/TeacherStudyMaterials";
import AdminModule from "./pages/AdminModule";
import { ROLES } from "./utils/auth";

function ProtectedPage({ roles, children }) {
  return <ProtectedRoute roles={roles}>{children}</ProtectedRoute>;
}

const studentOnly = [ROLES.STUDENT];
const teacherOnly = [ROLES.TEACHER];
const adminOnly = [ROLES.ADMIN];
const learningRoles = [ROLES.STUDENT, ROLES.TEACHER];

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/courses" element={<MainLayout><Courses /></MainLayout>} />
        <Route path="/courses/:id" element={<MainLayout><CourseDetails /></MainLayout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<ProtectedPage roles={studentOnly}><Dashboard /></ProtectedPage>} />
        <Route path="/my-courses" element={<ProtectedPage roles={studentOnly}><MyCourses /></ProtectedPage>} />
        <Route path="/course-player/:id" element={<ProtectedPage roles={learningRoles}><CoursePlayer /></ProtectedPage>} />
        <Route path="/quiz" element={<ProtectedPage roles={learningRoles}><Quiz /></ProtectedPage>} />
        <Route path="/certificate" element={<ProtectedPage roles={studentOnly}><Certificate /></ProtectedPage>} />
        <Route path="/certificates" element={<ProtectedPage roles={studentOnly}><Certificate /></ProtectedPage>} />
        <Route path="/ai-chat" element={<ProtectedPage roles={learningRoles}><AIChat /></ProtectedPage>} />
        <Route path="/complaints" element={<ProtectedPage roles={learningRoles}><Complaints /></ProtectedPage>} />
        <Route path="/profile" element={<ProtectedPage roles={[ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN]}><Profile /></ProtectedPage>} />
        <Route path="/change-password" element={<ProtectedPage roles={[ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN]}><ChangePassword /></ProtectedPage>} />
        <Route path="/assignments" element={<ProtectedPage roles={studentOnly}><LMSModule title="Assignments" subtitle="Complete activities, upload assignment files, and track teacher feedback." actions={["Submit Assignment"]} tableTitle="Assigned Work" /></ProtectedPage>} />
        <Route path="/materials" element={<ProtectedPage roles={studentOnly}><StudyMaterials /></ProtectedPage>} />

        <Route path="/teacher" element={<ProtectedPage roles={teacherOnly}><TeacherDashboard /></ProtectedPage>} />
        <Route path="/teacher/courses" element={<ProtectedPage roles={teacherOnly}><TeacherCourses /></ProtectedPage>} />
        <Route path="/teacher/create-course" element={<ProtectedPage roles={teacherOnly}><CreateCourse /></ProtectedPage>} />
        <Route path="/teacher/add-lesson" element={<ProtectedPage roles={teacherOnly}><AddLesson /></ProtectedPage>} />
        <Route path="/teacher/materials" element={<ProtectedPage roles={teacherOnly}><TeacherStudyMaterials /></ProtectedPage>} />
        <Route path="/teacher/assignments" element={<ProtectedPage roles={teacherOnly}><TeacherAssignments /></ProtectedPage>} />
        <Route path="/teacher/students" element={<ProtectedPage roles={teacherOnly}><TeacherStudents /></ProtectedPage>} />
        <Route path="/teacher/complaints" element={<ProtectedPage roles={teacherOnly}><Complaints /></ProtectedPage>} />

        <Route path="/admin-dashboard" element={<ProtectedPage roles={adminOnly}><AdminDashboard /></ProtectedPage>} />
        <Route path="/admin/teachers" element={<ProtectedPage roles={adminOnly}><AdminModule type="teachers" /></ProtectedPage>} />
        <Route path="/admin/students" element={<ProtectedPage roles={adminOnly}><AdminModule type="students" /></ProtectedPage>} />
        <Route path="/admin/courses" element={<ProtectedPage roles={adminOnly}><AdminModule type="courses" /></ProtectedPage>} />
        <Route path="/admin/lessons" element={<ProtectedPage roles={adminOnly}><AdminModule type="lessons" /></ProtectedPage>} />
        <Route path="/admin/complaints" element={<ProtectedPage roles={adminOnly}><Complaints /></ProtectedPage>} />
        <Route path="/admin/analytics" element={<ProtectedPage roles={adminOnly}><AdminModule type="analytics" /></ProtectedPage>} />
        <Route path="/admin/ai" element={<ProtectedPage roles={adminOnly}><AdminModule type="ai" /></ProtectedPage>} />
        <Route path="/admin/settings" element={<ProtectedPage roles={adminOnly}><AdminModule type="settings" /></ProtectedPage>} />

        <Route path="*" element={<MainLayout><Home /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
