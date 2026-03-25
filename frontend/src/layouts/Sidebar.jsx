import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  BookOpen, 
  ClipboardList, 
  CreditCard, 
  BarChart3, 
  FileText, 
  MessageSquare, 
  Briefcase, 
  Settings, 
  LogOut, 
  X, 
  Menu,
  GraduationCap,
  ShieldCheck,
  Bell,
  Bus,
  CalendarDays,
  Smartphone
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const role = user?.role?.toLowerCase() || "student";

  const menuItems = {
    admin: [
      { path: "/admin-dashboard", icon: <LayoutDashboard size={20} />, label: "Terminal Hub" },
      { path: "/staff", icon: <Users size={20} />, label: "Faculty Dir" },
      { path: "/students", icon: <UserSquare2 size={20} />, label: "Student Logs" },
      { path: "/classes", icon: <BookOpen size={20} />, label: "Class Nodes" },
      { path: "/attendance", icon: <ClipboardList size={20} />, label: "Live Presence" },
      { path: "/fees", icon: <CreditCard size={20} />, label: "Financials" },
      { path: "/exams", icon: <BarChart3 size={20} />, label: "Result Stats" },
      { path: "/timetable", icon: <CalendarDays size={20} />, label: "Class Agenda" },
      { path: "/reports", icon: <FileText size={20} />, label: "Reports" },
      { path: "/communication", icon: <MessageSquare size={20} />, label: "Global Sync" },
      { path: "/transport", icon: <Bus size={20} />, label: "Fleet Log" },
      { path: "/calendar", icon: <CalendarDays size={20} />, label: "Event Map" },
    ],
    teacher: [
      { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Faculty Hub" },
      { path: "/attendance", icon: <ClipboardList size={20} />, label: "Daily Log" },
      { path: "/homework", icon: <Briefcase size={20} />, label: "Assignments" },
      { path: "/exams", icon: <BarChart3 size={20} />, label: "Grading" },
      { path: "/timetable", icon: <CalendarDays size={20} />, label: "Agenda" },
      { path: "/communication", icon: <MessageSquare size={20} />, label: "Notices" },
      { path: "/calendar", icon: <CalendarDays size={20} />, label: "Schedule" },
    ],
    student: [
      { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Student Hub" },
      { path: "/profile", icon: <UserSquare2 size={20} />, label: "Identity" },
      { path: "/attendance", icon: <ClipboardList size={20} />, label: "Presence" },
      { path: "/homework", icon: <Briefcase size={20} />, label: "Assignments" },
      { path: "/exams", icon: <BarChart3 size={20} />, label: "Results" },
      { path: "/timetable", icon: <CalendarDays size={20} />, label: "Agenda" },
      { path: "/communication", icon: <MessageSquare size={20} />, label: "Faculty Chat" },
      { path: "/transport", icon: <Bus size={20} />, label: "Bus Route" },
    ],
    parent: [
      { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Parent Hub" },
      { path: "/fees", icon: <CreditCard size={20} />, label: "Fees Panel" },
      { path: "/exams", icon: <BarChart3 size={20} />, label: "Results" },
      { path: "/attendance", icon: <ClipboardList size={20} />, label: "Daily Log" },
      { path: "/calendar", icon: <CalendarDays size={20} />, label: "Events" },
    ],
    accountant: [
      { path: "/accountant", icon: <LayoutDashboard size={20} />, label: "Ledger Hub" },
      { path: "/fees", icon: <CreditCard size={20} />, label: "Transactions" },
      { path: "/reports", icon: <FileText size={20} />, label: "Audits" },
      { path: "/staff", icon: <Users size={20} />, label: "Payroll" },
    ]
  };

  const navClass = ({ isActive }) => 
    `flex items-center gap-4 p-4 rounded-[20px] transition-all duration-500 font-bold text-[10px] uppercase tracking-[2px] group relative overflow-hidden ${
      isActive 
      ? "bg-white text-[#1e1b4b] shadow-xl scale-105" 
      : "text-white/40 hover:bg-white/10 hover:text-white"
    }`;

  const currentItems = menuItems[role] || menuItems.student;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-[150] lg:hidden animate-in fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR PANEL */}
      <div className={`fixed lg:static z-[200] top-0 left-0 min-h-screen w-80 bg-[#1e1b4b] text-white p-10 transform transition-all duration-700 ease-in-out shadow-3xl border-r border-white/5
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col justify-between scrollbar-hide overflow-y-auto`}>
        
        <div className="flex flex-col">
           {/* LOGO */}
           <div className="flex items-center gap-4 mb-10 px-2 text-white">
              <div className="bg-blue-600 p-3 rounded-[18px] shadow-2xl border border-white/10 group-hover:rotate-12 transition-transform">
                 <GraduationCap className="text-white w-6 h-6" />
              </div>
              <div>
                 <h1 className="text-lg font-black text-white tracking-widest uppercase leading-none">Smart School</h1>
                 <p className="text-[8px] font-bold text-white/30 uppercase tracking-[4px] mt-1 italic">Institutional v2.0</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="lg:hidden ml-auto p-2 hover:bg-white/10 rounded-xl transition">
                 <X className="w-6 h-6" />
              </button>
           </div>

           {/* NAV LINKS */}
           <nav className="space-y-4">
              {currentItems.map((item) => (
                <NavLink 
                  key={item.path} 
                  to={item.path} 
                  className={navClass}
                  onClick={() => setIsOpen(false)}
                >
                  <div className={`p-1 transition-colors ${location.pathname === item.path ? 'text-[#4F46E5]' : 'group-hover:text-white'}`}>
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                  {location.pathname === item.path && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#4F46E5] rounded-l-full"></div>
                  )}
                </NavLink>
              ))}
           </nav>
        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-12 flex flex-col gap-6">
           <div className="bg-white/5 p-6 rounded-[24px] border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                 <ShieldCheck className="w-10 h-10 text-blue-400" />
              </div>
              <div className="flex items-center gap-4 relative z-10">
                 <div className="w-12 h-12 bg-blue-600 rounded-[16px] flex items-center justify-center font-black text-white text-lg border-4 border-[#1e1b4b] shadow-xl">
                    {user?.name?.[0] || "U"}
                 </div>
                 <div className="flex-1 truncate">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white leading-none truncate">{user?.name || "Member"}</p>
                    <p className="text-[8px] font-bold uppercase text-white/30 tracking-[3px] mt-1 italic">{role}</p>
                 </div>
              </div>
           </div>

           <button 
              onClick={handleLogout}
              className="flex items-center gap-4 p-5 rounded-[24px] bg-rose-500/10 text-rose-400 font-bold text-[10px] uppercase tracking-[3px] hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95 group overflow-hidden relative">
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Terminate Session</span>
              <div className="absolute top-0 right-0 w-12 h-full bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
           </button>
        </div>

      </div>
    </>
  );
}