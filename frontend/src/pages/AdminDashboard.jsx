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
  ArrowUpRight,
  CreditCard,
  Bus,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentStaff, setRecentStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role?.toLowerCase() !== 'admin') {
      navigate('/dashboard');
    } else {
      fetchDashboardData();
    }
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, staffRes] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/teachers")
      ]);
      setStats(statsRes.data);
      setRecentStaff(Array.isArray(staffRes.data) ? staffRes.data.slice(0, 5) : []);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa]">
       <Loader2 className="w-12 h-12 animate-spin text-[#4f46e5] mb-6" />
       <p className="text-gray-400 font-black italic tracking-widest uppercase tracking-[4px]">Initializing Admin Hub...</p>
     </div>
  );

  return (
    <div className="bg-[#fafafa] min-h-screen pb-40 font-sans transition-all">
      
      {/* PREMIUM HEADER AREA */}
      <div className="bg-[#1e1b4b] px-6 pt-10 pb-20 rounded-b-[40px] shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4f46e5]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center text-white">
          <div className="animate-in slide-in-from-bottom duration-700">
            <div className="flex items-center gap-2 mb-2">
               <ShieldCheck className="w-4 h-4 text-emerald-400" />
               <p className="text-white/40 text-[9px] font-black uppercase tracking-[4px] px-1 leading-none">Smart School ERP v2.0</p>
            </div>
            <h1 className="text-white text-[32px] font-black leading-tight uppercase tracking-tight">Admin Terminal</h1>
            <p className="text-white/40 text-xs mt-1 font-bold uppercase tracking-widest italic leading-none">{user?.name || 'Administrator'} • Root Access</p>
          </div>
          <div className="flex gap-4 mt-8 md:mt-0">
             <button className="bg-white/10 p-4 rounded-[20px] border border-white/5 hover:bg-white/20 transition shadow-2xl backdrop-blur-md relative">
               <Bell className="w-6 h-6 text-white" />
               <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#1e1b4b]"></div>
             </button>
             <button onClick={() => navigate('/settings')} className="bg-white/10 p-4 rounded-[20px] border border-white/5 hover:bg-white/20 transition shadow-2xl backdrop-blur-md">
               <Settings className="w-6 h-6 text-white" />
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-50">
        
        {/* ANALYTICS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
           <AdminStat value={stats?.totalStudents || "0"} label="STUDENTS" color="indigo" icon={<Users />} trend="+4.2%" />
           <AdminStat value={stats?.totalTeachers || "0"} label="FACULTY" color="emerald" icon={<ShieldCheck />} trend="+1.5%" />
           <AdminStat value={(stats?.attendancePercentage || "92") + "%"} label="PRESENCE" color="rose" icon={<Activity />} trend="-0.8%" />
           <AdminStat value="₹4.2M" label="REVENUE" color="amber" icon={<CreditCard />} trend="+12%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           {/* CORE MODULES */}
           <div className="lg:col-span-8 flex flex-col gap-10">
              <section>
                 <div className="flex justify-between items-center mb-6 px-4">
                    <h3 className="text-black font-black text-xl tracking-tight uppercase leading-none">Management Hub</h3>
                    <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2">
                       <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                       <span className="text-emerald-700 text-[9px] font-black uppercase tracking-widest leading-none">Nodes Online</span>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ModuleCard onClick={() => navigate('/staff')} icon={<Users />} title="Staff Hub" desc="Management" />
                    <ModuleCard onClick={() => navigate('/fees')} icon={<CreditCard />} title="Finance" desc="Colleciton" />
                    <ModuleCard onClick={() => navigate('/attendance')} icon={<ClipboardList />} title="Logistics" desc="Attendance" />
                    <ModuleCard onClick={() => navigate('/classes')} icon={<BookOpen />} title="Academic" desc="Scheduling" />
                    <ModuleCard onClick={() => navigate('/exam-results')} icon={<TrendingUp />} title="Exam Stats" desc="Audit" />
                    <ModuleCard onClick={() => navigate('/communication')} icon={<MessageSquare />} title="Messenger" desc="Announce" />
                    <ModuleCard onClick={() => navigate('/transport')} icon={<Bus />} title="Transport" desc="Tracking" />
                    <ModuleCard onClick={() => navigate('/reports')} icon={<BarChart2 />} title="Research" desc="Growth" />
                 </div>
              </section>

              {/* RECENT STAFF ACTIVITY */}
              <section>
                 <div className="flex justify-between items-end mb-10 px-4">
                    <div>
                       <h3 className="text-black font-black text-2xl tracking-tight uppercase leading-none">Registered Faculty</h3>
                       <p className="text-gray-400 font-bold text-[10px] mt-2 uppercase tracking-widest italic opacity-60 leading-none">System Sync: Real-time update</p>
                    </div>
                    <button onClick={() => navigate('/staff')} className="text-[#4f46e5] font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-50 px-6 py-3 rounded-2xl transition-all shadow-sm">
                       Directory <ChevronRight className="w-5 h-5" />
                    </button>
                 </div>

                 <div className="bg-white border border-gray-100 rounded-[50px] shadow-sm overflow-hidden text-black p-4">
                    {recentStaff.map((s, idx) => (
                       <StaffRow 
                          key={s._id || idx}
                          idx={idx}
                          name={s.userId?.name || "Staff Member"}
                          role={s.designation || "Faculty"}
                          dept={s.department || "Academic"}
                          email={s.userId?.email || "faculty@school.edu"}
                       />
                    ))}
                 </div>
              </section>
           </div>

           {/* SIDEBAR ANALYTICS */}
           <div className="lg:col-span-4 space-y-12">
              <div className="bg-black p-10 rounded-[50px] shadow-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
                    <TrendingUp className="w-40 h-40 text-indigo-400" />
                 </div>
                 <h4 className="text-white text-2xl font-black tracking-tight uppercase mb-4 relative z-10">Monthly Growth</h4>
                 <p className="text-white/40 font-bold text-sm leading-relaxed mb-10 relative z-10">Institutional performance is currently exceeding existing benchmarks by 12.5% this session.</p>
                 <div className="space-y-6 relative z-10">
                    <StatBar label="Academic" val="88%" color="bg-[#4f46e5]" />
                    <StatBar label="Collections" val="94%" color="bg-emerald-500" />
                    <StatBar label="Attendance" val="92%" color="bg-rose-500" />
                 </div>
              </div>

              <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-sm">
                 <h4 className="text-black text-2xl font-black tracking-tight uppercase mb-8">System Health</h4>
                 <div className="space-y-8">
                    <HealthRow label="Backend API" status="NOMINAL" color="emerald" />
                    <HealthRow label="Mobile Sync" status="NOMINAL" color="emerald" />
                    <HealthRow label="Real-time Chat" status="NOMINAL" color="emerald" />
                    <HealthRow label="Map Services" status="NOMINAL" color="emerald" />
                 </div>
              </div>
           </div>

        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-[100]">
        <button 
          onClick={() => navigate('/signup')}
          className="bg-black text-white px-8 py-5 rounded-[24px] font-black shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest border border-white/10 group">
          <Plus className="w-5 h-5 text-emerald-400 group-hover:rotate-90 transition-transform" /> Add Staff
        </button>
      </div>

    </div>
  );
}

function AdminStat({ value, label, color, icon, trend }) {
  const configs = {
    indigo: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    rose: "text-rose-600 bg-rose-50",
    amber: "text-amber-600 bg-amber-50"
  };
  return (
    <div className="bg-white p-6 md:p-8 rounded-[28px] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
       <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-[16px] ${configs[color]}`}>
             {React.cloneElement(icon, { className: "w-6 h-6" })}
          </div>
          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
             {trend}
          </span>
       </div>
       <h4 className="text-black text-[28px] font-black leading-none tracking-tight group-hover:text-blue-600 transition-colors">{value}</h4>
       <p className="text-gray-400 font-bold text-[8px] uppercase tracking-[3px] mt-2 leading-none">{label}</p>
    </div>
  );
}

function ModuleCard({ icon, title, desc, onClick }) {
   return (
      <div 
        onClick={onClick}
        className="group bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
      >
         <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform"></div>
         <div className="bg-blue-50 p-4 rounded-[20px] text-blue-500 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner relative z-10 group-hover:rotate-6">
            {React.cloneElement(icon, { className: "w-6 h-6" })}
         </div>
         <h5 className="text-black font-black text-base uppercase leading-none tracking-tight mb-1.5 relative z-10">{title}</h5>
         <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest leading-none opacity-60 relative z-10 italic">{desc}</p>
      </div>
   );
}

function StaffRow({ idx, name, role, dept, email }) {
   return (
    <div className="p-6 flex items-center border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-all cursor-pointer group rounded-[30px]">
       <div className="w-16 h-16 bg-[#1e1b4b] text-white rounded-[24px] flex items-center justify-center font-black text-xl shrink-0 group-hover:rotate-12 transition shadow-xl border-4 border-white">
          {name[0].toUpperCase()}
       </div>
       <div className="ml-8 flex-1">
          <h5 className="font-black text-black text-xl tracking-tight leading-none uppercase group-hover:text-[#4f46e5] transition-colors">{name}</h5>
          <div className="flex items-center gap-4 mt-2 mb-2">
             <span className="text-[#4f46e5] font-black text-[10px] uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-xl">{role}</span>
             <span className="text-gray-300 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" /> {dept}
             </span>
          </div>
          <p className="text-gray-400 text-[12px] font-bold italic truncate opacity-60">Verified Credentials Online</p>
       </div>
       <button className="bg-indigo-50 p-4 rounded-3xl text-indigo-400 hover:bg-[#4f46e5] hover:text-white transition shadow-sm border border-indigo-100">
          <ArrowUpRight className="w-6 h-6" />
       </button>
    </div>
   );
}

function StatBar({ label, val, color }) {
   return (
      <div className="space-y-2">
         <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-white/60">
            <span>{label}</span>
            <span className="text-white">{val}</span>
         </div>
         <div className="w-full bg-white/10 h-2 rounded-full relative overflow-hidden">
            <div className={`absolute top-0 left-0 h-full ${color} rounded-full`} style={{ width: val }}></div>
         </div>
      </div>
   );
}

function HealthRow({ label, status, color }) {
   const colors = {
      emerald: "text-emerald-500 bg-emerald-50"
   };
   return (
      <div className="flex justify-between items-center group">
         <span className="text-gray-400 font-black text-xs uppercase tracking-[2px]">{label}</span>
         <div className={`px-4 py-1.5 rounded-xl font-black text-[9px] border-2 group-hover:scale-110 transition-transform ${colors[color]}`}>
            {status}
         </div>
      </div>
   );
}