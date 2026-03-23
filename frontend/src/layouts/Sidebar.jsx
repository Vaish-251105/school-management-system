import { NavLink } from "react-router-dom"

export default function Sidebar({ isOpen, setIsOpen }) {

  const linkClass = ({ isActive }) =>
    isActive
      ? "block bg-blue-600 p-2 rounded"
      : "block p-2 rounded hover:bg-gray-700 transition"

  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const role = currentUser?.role

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed lg:static z-50 top-0 left-0 min-h-screen w-64 bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900 text-white p-5 transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <h1 className="text-2xl font-bold mb-8">School ERP</h1>

        <ul className="space-y-3 text-sm">

          {/* Admin Dashboard */}

          {role === "admin" && (
            <NavLink to="/admin-dashboard" className={linkClass}>
              Admin Dashboard
            </NavLink>
          )}

          {/* Dashboard */}
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>

          {/* ADMIN MODULES */}

          {role === "admin" && (
            <>
              <NavLink to="/students" className={linkClass}>
                Students
              </NavLink>

              <NavLink to="/teachers" className={linkClass}>
                Teachers & Staff
              </NavLink>

              <NavLink to="/classes" className={linkClass}>
                Classes & Subjects
              </NavLink>

              <NavLink to="/attendance" className={linkClass}>
                Attendance
              </NavLink>

              <NavLink to="/fees" className={linkClass}>
                Fees & Finance
              </NavLink>

              <NavLink to="/exams" className={linkClass}>
                Exams & Results
              </NavLink>

              <NavLink to="/reports" className={linkClass}>
                Reports & Analytics
              </NavLink>

              <NavLink to="/communication" className={linkClass}>
                Communication
              </NavLink>
            </>
          )}

          {/* TEACHER MODULES */}

          {role === "teacher" && (
            <>
              <NavLink to="/attendance" className={linkClass}>
                Attendance
              </NavLink>

              <NavLink to="/homework-notices" className={linkClass}>
                Homework & Notices
              </NavLink>

              <NavLink to="/communication" className={linkClass}>
                Communication
              </NavLink>

              <NavLink to="/exams" className={linkClass}>
                Exams & Results
              </NavLink>
            </>
          )}

          {/* STUDENT MODULES */}

          {role === "student" && (
            <>
              <NavLink to="/student-profile" className={linkClass}>
                Student Profile
              </NavLink>

              <NavLink to="/homework-notices" className={linkClass}>
                Homework
              </NavLink>

              <NavLink to="/communication" className={linkClass}>
                Communication
              </NavLink>

              <NavLink to="/exams" className={linkClass}>
                Results
              </NavLink>
            </>
          )}

          {/* ACCOUNTANT MODULES */}

          {role === "accountant" && (
            <>
              <NavLink to="/fees" className={linkClass}>
                Fees & Finance
              </NavLink>

              <NavLink to="/accountant" className={linkClass}>
                Accountant Panel
              </NavLink>

              <NavLink to="/reports" className={linkClass}>
                Financial Reports
              </NavLink>
            </>
          )}

        </ul>
      </div>
    </>
  )
}