import { NavLink, Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

const AppLayout = () => {
  const linkBase = "px-4 py-2 rounded-lg transition text-sm font-medium";

  const active = "bg-blue-600 text-white";

  const inactive = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      {/* Navbar */}
      <nav className="border-b border-gray-700 sticky top-0 z-50 backdrop-blur bg-gray-800/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-lg font-bold text-white hover:text-blue-400 transition"
          >
            AI Career Toolkit
          </Link>

          <div className="flex space-x-3">
            <NavLink
              to="/cover-letter"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : inactive}`
              }
            >
              Cover Letter
            </NavLink>

            <NavLink
              to="/resume-optimize"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : inactive}`
              }
            >
              Resume
            </NavLink>

            <NavLink
              to="/interview-helper"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : inactive}`
              }
            >
              Interview
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-6xl mx-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
