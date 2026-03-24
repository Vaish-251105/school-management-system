import { NavLink } from "react-router-dom"
import { 
  BarChart3, 
  Users, 
  UserSquare2, 
  GraduationCap, 
  Calendar, 
  FileText, 
  Briefcase, 
  CreditCard,
  MessageSquare,
  ClipboardList,
  BookOpen,
  Settings,
  LayoutDashboard,
  Bell
} from "lucide-react"

export default function Sidebar({ isOpen, setIsOpen }) {

  const linkClass = ({ isActive }) =>
    `flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-black text-[13px] uppercase tracking-widest ${
      isActive
        ? "bg-white text-[#1e1b4b] shadow-2xl scale-105"
        : "text-white/60 hover:bg-white/10 hover:text-white"
    }`

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
  const role = currentUser?.role?.toLowerCase()

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-[60]"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed lg:static z-[70] top-0 left-0 min-h-screen w-72 bg-[#1e1b4b] text-white p-8 transform transition-transform duration-500 shadow-2xl
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 border-r border-white/5`}
      >
        <div className="flex items-center gap-4 mb-14">
           <div className="bg-white/10 p-3.5 rounded-[22px] shadow-inner group-hover:rotate-12 transition-transform">
              <GraduationCap className="text-white w-7 h-7" />
           </div>
           <div>
              <h1 className="text-lg font-black tracking-widest uppercase leading-none">Smart School</h1>
              <p className="text-[9px] font-black text-white/30 tracking-[4px] mt-1.5 uppercase italic">Enterprise ERP</p>
           </div>
        </div>

        <nav className="space-y-2">

          {/* DASHBOARD LINK */}
          <NavLink to={role === 'admin' ? '/admin-dashboard' : '/dashboard'} className={linkClass}>
             <LayoutDashboard size={18} /> Dashboard
          </NavLink>

          <div className="w-full h-px bg-white/5 my-8"></div>

          {/* ADMIN MODULES */}
          {role === "admin" && (
            <>
              <NavLink to="/students" className={linkClass}>
                <Users size={18} /> Students
              </NavLink>

              <NavLink to="/staff" className={linkClass}>
                <UserSquare2 size={18} /> Teachers
              </NavLink>

              <NavLink to="/classes" className={linkClass}>
                <BookOpen size={18} /> Classes
              </NavLink>

              <NavLink to="/attendance" className={linkClass}>
                <ClipboardList size={18} /> Attendance
              </NavLink>

              <NavLink to="/fees" className={linkClass}>
                <CreditCard size={18} /> Finance
              </NavLink>

              <NavLink to="/exams" className={linkClass}>
                <BarChart3 size={18} /> Results
              </NavLink>

              <NavLink to="/reports" className={linkClass}>
                <FileText size={18} /> Reports
              </NavLink>

              <NavLink to="/communication" className={linkClass}>
                <MessageSquare size={18} /> Communication
              </NavLink>
            </>
          )}

          {/* TEACHER MODULES */}
          {role === "teacher" && (
            <>
              <NavLink to="/attendance" className={linkClass}>
                <ClipboardList size={18} /> Attendance
              </NavLink>

              <NavLink to="/homework" className={linkClass}>
                <Briefcase size={18} /> Homework
              </NavLink>

              <NavLink to="/communication" className={linkClass}>
                <MessageSquare size={18} /> Notices
              </NavLink>

              <NavLink to="/exams" className={linkClass}>
                <BarChart3 size={18} /> Results
              </NavLink>
            </>
          )}

          {/* STUDENT MODULES */}
          {role === "student" && (
            <>
              <NavLink to="/profile" className={linkClass}>
                <UserSquare2 size={18} /> Profile
              </NavLink>

              <NavLink to="/homework" className={linkClass}>
                <Briefcase size={18} /> Homework
              </NavLink>

              <NavLink to="/communication" className={linkClass}>
                <MessageSquare size={18} /> Messages
              </NavLink>

              <NavLink to="/exams" className={linkClass}>
                <BarChart3 size={18} /> Results
              </NavLink>
            </>
          )}

          {/* ACCOUNTANT MODULES */}
          {role === "accountant" && (
            <>
              <NavLink to="/fees" className={linkClass}>
                <CreditCard size={18} /> Fees
              </NavLink>

              <NavLink to="/accountant" className={linkClass}>
                <LayoutDashboard size={18} /> Ledger
              </NavLink>

              <NavLink to="/reports" className={linkClass}>
                <FileText size={18} /> Audit
              </NavLink>
            </>
          )}

          <div className="w-full h-px bg-white/5 my-8"></div>
          
          <NavLink to="/profile" className={linkClass}>
             <Settings size={18} /> Settings
          </NavLink>

        </nav>

        {/* LOGOUT HINT */}
        <div className="absolute bottom-10 left-8 right-8 bg-white/5 p-6 rounded-[30px] border border-white/5">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center font-black text-white text-xs">
                 {currentUser?.name?.[0] || 'U'}
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest leading-none truncate w-24">{currentUser?.name || 'User'}</p>
                 <p className="text-[8px] font-black uppercase tracking-[2px] text-white/30 mt-1">{role || 'Member'}</p>
              </div>
           </div>
        </div>

      </div>
    </>
  )
}