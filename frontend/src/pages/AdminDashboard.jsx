import React, { useState, useEffect } from "react";
import { 
  Bell,
  Users,
  BookOpen,
  BarChart2,
  ClipboardList,
  ChevronRight,
  Plus,
  Loader2,
  Settings,
  MoreVertical,
  Activity,
  ArrowUpRight
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
        setLoading(true);
        const [statsRes, staffRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/teachers")
        ]);
        setStats(statsRes.data);
        setStaff(Array.isArray(staffRes.data) ? staffRes.data.slice(0, 4) : []);
      } catch (err) {
        console.error("Admin error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-[#fafafa] min-h-screen pb-32 font-sans animate-in fade-in transition-all">
      
      {/* HEADER AREA */}
      <div className="bg-[#1e1b4b] px-6 pt-12 pb-24 rounded-b-[60px] shadow-2xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center text-white text-center md:text-left">
          <div className="animate-in slide-in-from-bottom duration-700">
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-2 px-1">School ERP</p>
            <h1 className="text-white text-[32px] font-black leading-tight uppercase tracking-tight">Admin Dashboard</h1>
            <p className="text-white/80 text-sm mt-1 font-medium">System Administrator Hub</p>
          </div>
          <div className="flex gap-4 mt-6 md:mt-0">
             <button className="bg-white/10 p-4 rounded-3xl border border-white/5 hover:bg-white/20 transition group shadow-2xl backdrop-blur-md">
               <Bell className="w-7 h-7 text-white" />
             </button>
             <button className="bg-white/10 p-4 rounded-3xl border border-white/5 hover:bg-white/20 transition group shadow-2xl backdrop-blur-md">
               <Settings className="w-7 h-7 text-white" />
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-50">
        {/* STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
           <AdminStatCard label="STUDENTS" val={stats?.totalStudents || "..."} status="TOTAL" color="indigo" />
           <AdminStatCard label="STAFF" val={staff.length || "..."} status="ACTIVE" color="emerald" />
           <AdminStatCard label="ATTENDANCE" val={(stats?.attendancePercentage || "0") + "%"} status="TODAY" color="blue" />
           <AdminStatCard label="FEES" val="94%" status="PAID" color="rose" />
        </div>

        {/* OPERATIONS SECTION */}
        <div className="flex justify-between items-center mb-8 px-2">
          <h3 className="text-black font-black text-2xl tracking-tight uppercase">Management Hub</h3>
          <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2">
             <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-emerald-700 text-[10px] font-black uppercase tracking-widest">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <BoxLink onClick={() => navigate('/staff')} icon={<Users />} title="Staff List" color="bg-indigo-50 text-indigo-500" />
          <BoxLink onClick={() => navigate('/staff-attendance')} icon={<ClipboardList />} title="Attendance" color="bg-emerald-50 text-emerald-500" />
          <BoxLink onClick={() => navigate('/classes')} icon={<BookOpen />} title="Classes" color="bg-orange-50 text-orange-500" />
          <BoxLink onClick={() => navigate('/reports')} icon={<BarChart2 />} title="Reports" color="bg-rose-50 text-rose-500" />
        </div>

        {/* ACTIVITY LIST */}
        <div className="flex justify-between items-end mb-8 px-2">
           <div>
              <h3 className="text-black font-black text-2xl tracking-tight uppercase">Recent Staff</h3>
              <p className="text-gray-400 font-bold text-xs mt-1 uppercase">Recently added members</p>
           </div>
           <button onClick={() => navigate('/staff')} className="text-[#4f46e5] font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-50 px-4 py-2 rounded-xl transition">
              View All <ArrowUpRight className="w-4 h-4" />
           </button>
        </div>

        <div className="bg-white border border-gray-100 rounded-[40px] shadow-sm overflow-hidden mb-12 text-black">
          {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500 w-10 h-10" /></div>
          ) : staff.length === 0 ? (
             <div className="p-20 text-center text-gray-400 font-bold italic">No records found.</div>
          ) : (
             staff.map((s, idx) => (
               <StaffRow 
                 key={s._id || idx}
                 idx={idx}
                 init={s.userId?.name?.split(' ').map(n=>n[0]).join('') || "TS"} 
                 name={s.userId?.name || "Member"} 
                 sub={`${s.designation || "Staff"} • ${s.department || "Academic"}`} 
               />
             ))
          )}
        </div>

      </div>

      <div className="fixed bottom-10 right-10 z-[100]">
        <button 
          onClick={() => navigate('/signup')}
          className="bg-black text-white px-8 py-5 rounded-[28px] font-black shadow-3xl shadow-indigo-500/10 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all text-[15px] uppercase tracking-widest border border-white/10 group">
          <Plus className="w-6 h-6 text-emerald-400" /> Add Staff
        </button>
      </div>

    </div>
  );
}

function AdminStatCard({ label, val, status, color }) {
  const themes = {
    indigo: "text-indigo-600 bg-indigo-50",
    emerald: "text-emerald-600 bg-emerald-50",
    blue: "text-blue-600 bg-blue-50",
    rose: "text-rose-600 bg-rose-50"
  };
  return (
    <div className="bg-white p-7 rounded-[35px] shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-2xl hover:-translate-y-1 transition-all">
       <p className="text-gray-400 font-black text-[9px] uppercase tracking-[3px] mb-3">{label}</p>
       <h4 className="text-black text-3xl font-black leading-none tracking-tight">{val}</h4>
       <div className={`mt-4 px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest ${themes[color]}`}>
          {status}
       </div>
    </div>
  );
}

function BoxLink({ icon, title, color, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer p-8 rounded-[40px] border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all bg-white"
    >
      <div className={`${color} p-5 rounded-3xl mb-5 group-hover:scale-110 transition-transform shadow-sm`}>
        {React.cloneElement(icon, { className: "w-8 h-8" })}
      </div>
      <h4 className="text-black font-black text-[15px] tracking-tight uppercase leading-tight">{title}</h4>
      <div className="mt-4 flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 group-hover:bg-black group-hover:text-white transition-all shadow-sm">
         <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
}

function StaffRow({ init, name, sub, idx }) {
  return (
    <div 
      className="p-6 flex items-center border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-all cursor-pointer group"
    >
      <div className="w-14 h-14 bg-[#1e1b4b] text-white rounded-[20px] flex items-center justify-center font-black text-[17px] shrink-0 border border-white/10 group-hover:scale-110 transition shadow-lg">
        {init}
      </div>
      <div className="ml-6 flex-1 text-black">
        <h4 className="font-black text-[18px] tracking-tight leading-tight group-hover:text-[#4f46e5] transition-colors uppercase">{name}</h4>
        <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mt-1 italic">{sub}</p>
      </div>
      <div className="flex gap-2">
         <button className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600 hover:bg-[#4f46e5] hover:text-white transition">
            <Activity className="w-5 h-5" />
         </button>
         <button className="bg-gray-50 p-2.5 rounded-xl text-gray-400 hover:bg-black hover:text-white transition">
            <MoreVertical className="w-5 h-5" />
         </button>
      </div>
    </div>
  );
}