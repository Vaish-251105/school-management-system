import React, { useState, useEffect } from "react";
import { 
  Bell,
  Users,
  BookOpen,
  BarChart2,
  ClipboardList,
  ChevronRight,
  Plus,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, staffRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/teachers")
        ]);
        
        setStats(statsRes.data);
        setStaff(Array.isArray(staffRes.data) ? staffRes.data.slice(0, 3) : []);
      } catch (err) {
        console.error("Admin dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans flex flex-col pb-28 text-gray-900">
      
      {/* HEADER AREA */}
      <div className="relative mb-12">
        <div className="bg-gradient-to-br from-[#4338ca] to-[#4f46e5] px-6 pt-12 pb-24 rounded-b-[40px] shadow-lg shrink-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="max-w-4xl mx-auto relative z-10 flex justify-between items-center text-gray-900">
            <div>
              <p className="text-white/80 text-[12px] font-bold tracking-wide uppercase">Smart School ERP</p>
              <h1 className="text-white text-[26px] font-bold leading-tight mt-1">Admin Dashboard</h1>
            </div>
            <button className="bg-white/10 p-2.5 rounded-xl border border-white/20 hover:bg-white/20 transition group">
              <Bell className="w-5 h-5 text-white fill-white/10 group-hover:scale-110" />
            </button>
          </div>
        </div>

        {/* OVERLAPPING STAT CARDS */}
        <div className="max-w-4xl mx-auto px-6 absolute bottom-0 left-0 w-full translate-y-1/2 flex gap-4">
          <div className="flex-1 bg-white p-5 rounded-3xl shadow-[0_10px_20px_rgba(0,0,0,0.05)] border border-gray-50">
            <p className="text-gray-400 font-bold text-[11px] mb-2 uppercase tracking-wide">Total Students</p>
            <div className="flex items-end gap-3">
              <h2 className="text-gray-900 text-[26px] font-bold leading-none">
                {loading ? <Loader2 className="w-6 h-6 animate-spin text-indigo-500" /> : (stats?.totalStudents || "0")}
              </h2>
              <span className="bg-green-50 text-green-600 font-bold text-[10px] px-2 py-0.5 rounded-md mb-1">+RealTime</span>
            </div>
          </div>
          <div className="flex-1 bg-white p-5 rounded-3xl shadow-[0_10px_20px_rgba(0,0,0,0.05)] border border-gray-50">
            <p className="text-gray-400 font-bold text-[11px] mb-2 uppercase tracking-wide">Daily Attendance</p>
            <div className="flex items-end gap-3">
              <h2 className="text-gray-900 text-[26px] font-bold leading-none">
                 {loading ? <Loader2 className="w-6 h-6 animate-spin text-indigo-500" /> : (stats?.attendancePercentage || "0") + "%"}
              </h2>
              <span className="bg-blue-50 text-blue-600 font-bold text-[10px] px-2 py-0.5 rounded-md mb-1">Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="max-w-4xl mx-auto px-6 mt-4 w-full flex-1">
        
        {/* ACADEMIC MANAGEMENT GRID */}
        <h3 className="text-gray-900 font-bold text-[18px] mb-4">Academic Management</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <GridBox onClick={() => navigate('/staff')} icon={<Users />} title="Staff & Teachers" sub={`${staff.length}+ Members`} />
          <GridBox onClick={() => navigate('/classes')} icon={<BookOpen />} title="Classes" sub="Manage Grades" />
          <GridBox onClick={() => alert('Detailed Analytics coming soon!')} icon={<BarChart2 />} title="Analytics" sub="Performance" />
          <GridBox onClick={() => navigate('/homework-notices')} icon={<ClipboardList />} title="Notices" sub="Announcements" />
        </div>

        {/* RECENTLY ADDED STAFF */}
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-gray-900 font-bold text-[18px]">Recently Added Staff</h3>
          <button onClick={() => navigate('/staff')} className="text-[#4f46e5] font-medium text-[13px] hover:underline transition">View All</button>
        </div>

        <div className="space-y-3 mb-4">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-500" /></div>
          ) : staff.length === 0 ? (
            <div className="text-center py-5 text-gray-400 text-sm">No staff records found.</div>
          ) : (
            staff.map((s) => (
              <StaffRow 
                key={s._id}
                init={s.userId?.name?.split(' ').map(n=>n[0]).join('') || "TS"} 
                name={s.userId?.name || "Staff Member"} 
                sub={`${s.designation || "Staff"} • ${s.department || "Academic"}`} 
              />
            ))
          )}
        </div>

      </div>

      <div className="fixed bottom-6 right-6">
        <button 
          onClick={() => alert('Opening Add Staff Form... (Redirecting to User Creation)') || navigate('/signup')}
          className="bg-[#4f46e5] text-white px-6 py-3.5 rounded-full font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition hover:scale-105 active:scale-95">
          <Plus className="w-5 h-5" /> Add Staff
        </button>
      </div>

    </div>
  );
}

function GridBox({ icon, title, sub, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-[#f9fafb] border border-gray-100 p-5 rounded-2xl flex flex-col items-center text-center hover:shadow-md transition cursor-pointer hover:bg-white"
    >
      <div className="w-12 h-12 bg-[#4f46e5] rounded-full flex items-center justify-center text-white mb-3 shadow-md">
        {React.cloneElement(icon, { className: "w-6 h-6" })}
      </div>
      <h4 className="font-bold text-gray-900 text-[15px]">{title}</h4>
      <p className="text-gray-400 text-[11px] mt-0.5">{sub}</p>
    </div>
  );
}

function Bar({ label, ht }) {
  return (
    <div className="flex flex-col items-center">
      {ht !== "0%" ? (
        <div className="w-7 bg-[#4f46e5] rounded-md transition-all hover:bg-indigo-500" style={{ height: ht }}></div>
      ) : (
        <div className="w-7 h-0 border-t-2 border-dashed border-gray-200"></div>
      )}
      <span className="text-gray-400 font-bold text-[10px] mt-3">{label}</span>
    </div>
  );
}

function StaffRow({ init, name, sub }) {
  return (
    <div className="bg-white p-4 rounded-2xl flex items-center border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group">
      <div className="w-11 h-11 bg-indigo-50 text-[#4f46e5] rounded-full flex items-center justify-center font-bold text-[15px] shrink-0 border border-indigo-100">
        {init}
      </div>
      <div className="ml-4 flex-1">
        <h4 className="font-bold text-gray-900 text-[15px]">{name}</h4>
        <p className="text-gray-400 text-[12px]">{sub}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
    </div>
  );
}