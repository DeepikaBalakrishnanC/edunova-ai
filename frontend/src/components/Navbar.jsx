import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { FaGraduationCap } from "react-icons/fa";
import { useDispatch } from "react-redux";

import { logout } from "../redux/authSlice";
import { dashboardForRole, getStoredUser } from "../utils/auth";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = getStoredUser();
  const dashboardPath = dashboardForRole(user?.role);

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
    navigate("/login");
  };

  const links = [
    { label: "Home", path: "/" },
    { label: "Courses", path: "/courses" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/75 text-white shadow-lg backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 text-3xl font-bold tracking-tight text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-xl text-slate-950">
            <FaGraduationCap />
          </span>
          <span>EduNova <span className="text-blue-400">AI</span></span>
        </Link>

        <ul className="hidden md:flex gap-2 text-base items-center rounded-full border border-slate-800 bg-slate-950/70 p-1">
          {links.map((link) => (
            <li key={link.path}><Link to={link.path} className="block rounded-full px-4 py-2 text-gray-300 transition hover:bg-slate-800 hover:text-blue-400">{link.label}</Link></li>
          ))}
          {token && <li><Link to={dashboardPath} className="block rounded-full px-4 py-2 text-gray-300 transition hover:bg-slate-800 hover:text-blue-400">Dashboard</Link></li>}
        </ul>

        <div className="hidden md:flex gap-4 items-center">
          {!token ? (
            <>
              <Link to="/login" className="btn-secondary px-5 py-2">Login</Link>
              <Link to="/register" className="btn-primary px-5 py-2">Register</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="bg-red-600 px-5 py-2 rounded-xl hover:bg-red-700 transition">Logout</button>
          )}
        </div>

        <button className="md:hidden text-3xl" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-slate-900 px-6 pb-6 border-t border-slate-800">
          <ul className="flex flex-col gap-5 text-lg mt-5">
            {links.map((link) => (
              <li key={link.path}><Link to={link.path} onClick={() => setMenuOpen(false)} className="hover:text-blue-400 transition">{link.label}</Link></li>
            ))}
            {token && <li><Link to={dashboardPath} onClick={() => setMenuOpen(false)} className="hover:text-blue-400 transition">Dashboard</Link></li>}
            {!token ? (
              <>
                <li><Link to="/login" onClick={() => setMenuOpen(false)} className="block border border-slate-700 px-5 py-3 rounded-xl hover:border-blue-500 transition text-center">Login</Link></li>
                <li><Link to="/register" onClick={() => setMenuOpen(false)} className="block bg-blue-600 px-5 py-3 rounded-xl hover:bg-blue-700 transition text-center">Register</Link></li>
              </>
            ) : (
              <li><button onClick={handleLogout} className="w-full bg-red-600 px-5 py-3 rounded-xl hover:bg-red-700 transition">Logout</button></li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
