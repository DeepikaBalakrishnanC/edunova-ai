export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-gray-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr_1fr] gap-10">
        <div>
          <h2 className="text-2xl font-bold text-white">EduNova <span className="text-blue-400">AI</span></h2>

          <p className="mt-4 max-w-sm leading-7">
            A role-based learning platform for courses, lessons, assignments, certificates, materials, and guided support.
          </p>
        </div>

        <div>
          <h3 className="text-xl text-white font-semibold mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2">
            <li>Home</li>
            <li>Courses</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl text-white font-semibold mb-4">
            Contact
          </h3>

          <p>Email: support@edunova.ai</p>
          <p className="mt-2">Phone: +91 9876543210</p>
          <p className="mt-2">Kerala, India</p>
        </div>
      </div>

      <div className="text-center mt-10 border-t border-slate-800 pt-6 text-sm">
        © 2026 EduNova AI. All rights reserved.
      </div>
    </footer>
  );
}
