import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Wallet, 
  Book, 
  Award, 
  PenTool, 
  Bus, 
  MapPin, 
  Bell, 
  Flag, 
  Users, 
  Loader2,
  ChevronRight,
  Plus,
  Landmark,
  ClipboardList,
  CalendarClock
} from "lucide-react";
import api from "../utils/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const role = user.role?.toLowerCase() || "student";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, noticesRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/notices")
        ]);
        setStats(statsRes.data);
        setNotices(noticesRes.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // ROLE-SPECIFIC MODULES
  const modules = [
    { id: 'calendar', title: 'Calendar', sub: 'School Events', icon: <Calendar className="text-blue-500 w-7 h-7" />, color: 'bg-blue-50', path: '/calendar' },
    { id: 'fees', title: 'Fees', sub: 'Payments', icon: <Wallet className="text-purple-500 w-7 h-7" />, color: 'bg-purple-50', path: '/fees', roles: ['student', 'parent', 'admin', 'accountant'] },
    { id: 'classes', title: 'Classes', sub: 'Schedule', icon: <Book className="text-orange-500 w-7 h-7" />, color: 'bg-orange-50', path: '/classes' },
    { id: 'exams', title: 'Exams', sub: 'Results', icon: <Award className="text-green-500 w-7 h-7" />, color: 'bg-green-50', path: '/exams', roles: ['student', 'parent'] },
    { id: 'exams-schedule', title: 'Exam Schedule', sub: 'Planning', icon: <CalendarClock className="text-amber-500 w-7 h-7" />, color: 'bg-amber-50', path: '/exams-schedule', roles: ['teacher', 'admin'] },
    { id: 'homework', title: 'Homework', sub: `${stats?.homeworkCount || 0} Records`, icon: <PenTool className="text-pink-500 w-7 h-7" />, color: 'bg-pink-50', path: '/homework-notices' },
    { id: 'transport', title: 'Transport', sub: 'Bus Route', icon: <Bus className="text-sky-500 w-7 h-7" />, color: 'bg-sky-50', path: '/transport' },
    { id: 'hub', title: 'Notice Board', sub: 'Broadcasts', icon: <Bell className="text-red-500 w-7 h-7" />, color: 'bg-rose-50', path: '/communication' },
  ];

  if (role === 'admin') {
    modules.push({ id: 'staff', title: 'Staff', sub: 'Management', icon: <Users className="text-indigo-500 w-7 h-7" />, color: 'bg-indigo-50', path: '/staff' });
    modules.push({ id: 'staff-attendance', title: 'Staff Atten.', sub: 'Records', icon: <ClipboardList className="text-emerald-500 w-7 h-7" />, color: 'bg-emerald-50', path: '/staff-attendance' });
  }
  if (role === 'accountant') {
    modules.push({ id: 'salaries', title: 'Salaries', sub: 'Payroll', icon: <Landmark className="text-emerald-500 w-7 h-7" />, color: 'bg-emerald-50', path: '/salaries' });
    modules.push({ id: 'staff-attendance', title: 'Attendance', sub: 'Staff Logs', icon: <ClipboardList className="text-orange-500 w-7 h-7" />, color: 'bg-orange-50', path: '/staff-attendance' });
  }

  const filteredModules = modules.filter(m => !m.roles || m.roles.includes(role));

  return (
    <div className="bg-[#fafafa] min-h-screen pb-20 font-sans animate-in fade-in transition-all">
      
      {/* HEADER AREA */}
      <div className="bg-gradient-to-br from-[#1e1b4b] to-[#1e1b4b] px-6 pt-12 pb-14 rounded-b-[60px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center text-white">
            <div className="text-center md:text-left mb-6 md:mb-0 animate-in slide-in-from-bottom duration-700">
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-2">School ERP</p>
              <h1 className="text-white text-[32px] font-black leading-tight uppercase">Dashboard</h1>
              <p className="text-white/80 text-sm mt-1 font-medium">Welcome back, {user.name || "User"}</p>
            </div>
            <div className="flex items-center gap-6">
              <div 
                onClick={() => navigate('/notifications')}
                className="bg-white/10 p-4 rounded-3xl border border-white/5 relative cursor-pointer hover:bg-white/20 transition group">
                <Bell className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
                <div className="absolute top-3 right-3 w-3 h-3 bg-rose-500 rounded-full border-4 border-[#1e1b4b]"></div>
              </div>
              <div
                onClick={() => navigate('/profile')} 
                className="w-20 h-20 rounded-[30px] border-4 border-white/10 p-1 cursor-pointer hover:scale-105 transition shadow-2xl group overflow-hidden bg-white/5"
              >
                  <img 
                    src={`https://ui-avatars.com/api/?name=${user.name || "User"}&background=1e1b4b&color=ffffff&size=128&bold=true`} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-[20px] bg-[#1e1b4b]"
                  />
              </div>
            </div>
        </div>

        <div className="max-w-5xl mx-auto mt-12 grid grid-cols-3 gap-6 bg-white/10 backdrop-blur-md rounded-[50px] p-8 border border-white/10 shadow-inner">
          <StatItem label="ATTENDANCE" val={loading ? "..." : (stats?.attendancePercentage || "0") + "%"} />
          <StatItem label="GPA" val="3.95" />
          <StatItem label="STUDENTS" val={loading ? "..." : (stats?.studentsCount || "0")} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-12">
        
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-black font-black text-2xl tracking-tight uppercase tracking-widest leading-none">Modules</h3>
          <div className="h-0.5 flex-1 mx-8 bg-gray-50"></div>
          <div className="flex gap-2 opacity-10">
             <div className="w-2 h-2 bg-black rounded-full"></div>
             <div className="w-2 h-2 bg-black rounded-full"></div>
             <div className="w-2 h-2 bg-black rounded-full"></div>
          </div>
        </div>
        
        {/* MODULES GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {filteredModules.map((m, idx) => (
            <div 
              key={m.id} 
              onClick={() => navigate(m.path)} 
              className="group cursor-pointer bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-in fade-in"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className={`${m.color} w-20 h-20 rounded-[30px] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-white shadow-sm`}>
                {m.icon}
              </div>
              <h4 className="text-black font-black text-[17px] tracking-tight uppercase">{m.title}</h4>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[2px] mt-2 italic">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* RECENT NOTICE */}
        <div 
          onClick={() => navigate('/communication')}
          className="mt-16 bg-black p-8 rounded-[50px] shadow-3xl flex flex-col md:flex-row items-center relative overflow-hidden cursor-pointer group hover:-translate-y-1 transition-all"
        >
          <div className="absolute right-0 bottom-0 w-48 h-48 bg-[#4f46e5]/10 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
          <div className="bg-white/10 backdrop-blur-md rounded-[35px] px-8 py-6 text-center border border-white/10 shrink-0 mb-6 md:mb-0 shadow-inner group-hover:rotate-3 transition-transform">
            <div className="text-white text-3xl font-black tabular-nums">24</div>
            <div className="text-white/40 text-[10px] font-black uppercase tracking-[3px]">OCT</div>
          </div>
          <div className="md:ml-10 flex-1 text-center md:text-left">
            <p className="text-teal-400 font-black text-[10px] uppercase tracking-[4px] mb-2">Upcoming Event</p>
            <h4 className="text-white font-black text-2xl tracking-tight uppercase group-hover:text-emerald-400 transition-colors">Maths Olympiad</h4>
            <div className="flex flex-wrap justify-center md:justify-start items-center text-white/40 text-[11px] mt-3 font-bold uppercase tracking-widest gap-6">
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-rose-500" /> School Hall</span>
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-400" /> 09:00 AM</span>
            </div>
          </div>
          <div className="bg-white/5 border border-white/5 p-4 rounded-full ml-8 hidden md:flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
             <ChevronRight className="w-8 h-8" />
          </div>
        </div>

        {/* NOTICES LIST */}
        <div className="mt-16 flex justify-between items-center mb-8 px-2">
          <h3 className="text-black font-black text-2xl tracking-tight uppercase tracking-widest leading-none">Announcements</h3>
          <button onClick={() => navigate('/communication')} className="text-black font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 px-4 py-2 rounded-xl transition">View All <ChevronRight className="w-4 h-4" /></button>
        </div>

        <div className="bg-white border border-gray-100 rounded-[50px] overflow-hidden shadow-sm mb-16">
          {notices.length > 0 ? (
            notices.slice(0, 4).map((notice, idx) => (
              <div 
                key={notice._id || idx} 
                onClick={() => navigate('/communication')}
                className="flex items-center p-8 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer group last:border-0"
              >
                <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center shrink-0 border shadow-sm ${
                  notice.priority === 'urgent' ? 'bg-rose-50 border-rose-100' : 
                  notice.priority === 'high' ? 'bg-orange-50 border-orange-100' : 'bg-indigo-50 border-indigo-100'
                }`}>
                  <Flag className={`w-7 h-7 ${
                    notice.priority === 'urgent' ? 'text-rose-500' : 
                    notice.priority === 'high' ? 'text-orange-500' : 'text-[#4f46e5]'
                  }`} />
                </div>
                <div className="ml-8 flex-1">
                  <h4 className="text-black font-black text-[18px] tracking-tight uppercase group-hover:text-[#4f46e5] transition-colors">{notice.title}</h4>
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest italic">{new Date(notice.createdAt).toLocaleDateString()}</span>
                    <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                    <span className={`font-black text-[9px] uppercase tracking-widest ${
                      notice.priority === 'urgent' ? 'text-rose-600' : 'text-indigo-400'
                    }`}>{notice.priority || 'Standard'} Directive</span>
                  </div>
                </div>
                <ChevronRight className="w-8 h-8 text-gray-100 group-hover:text-black transition-colors" />
              </div>
            ))
          ) : (
            <div className="p-24 text-center text-gray-400 font-black italic uppercase tracking-widest text-lg opacity-20 flex flex-col items-center">
               <Bell className="w-12 h-12 mb-4" /> No Active Broadcasts
            </div>
          )}
        </div>
        
      </div>

    </div>
  );
}

function StatItem({ label, val }) {
  return (
    <div className="text-center group overflow-hidden">
      <p className="text-white/40 text-[9px] font-black uppercase tracking-[2px] mb-2 group-hover:text-white transition-colors">{label}</p>
      <h2 className="text-white text-2xl font-black tracking-tight leading-none uppercase tabular-nums">{val}</h2>
    </div>
  );
}