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
  CalendarClock,
  MessageSquare,
  Activity,
  ShieldCheck,
  TrendingUp,
  Clock,
  Navigation,
  Download,
  GraduationCap
} from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [notices, setNotices] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("10");
  
  const role = user?.role?.toLowerCase() || "student";

  // COLOR SCHEMES - MATCHING FLUTTER DASHBOARDS
  // COLOR SCHEMES - RESTORED BLUE/PURPLE GRADIENT
  const schemes = {
    admin: "from-[#1e1b4b] to-[#4338ca]",
    teacher: "from-[#3b82f6] to-[#8b5cf6]",
    student: "from-[#3b82f6] to-[#8b5cf6]",
    parent: "from-[#ec4899] to-[#8b5cf6]",
    accountant: "from-[#0d9488] to-[#0b6e65]"
  };

  const portalThemes = {
    admin: "Institutional Root",
    teacher: "Faculty Portal",
    student: "Smart School ERP",
    parent: "Parent Hub",
    accountant: "Finance Node"
  };

  useEffect(() => {
    fetchDashboardData();
    if (role === 'teacher') fetchTimetable(selectedClass);
    if (role === 'parent') fetchChildren();
  }, [role, selectedClass]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, noticesRes] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/notices")
      ]);
      setStats(statsRes.data);
      setNotices(Array.isArray(noticesRes.data) ? noticesRes.data : []);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimetable = async (grade) => {
    try {
      const res = await api.get(`/timetable/class/${grade}`);
      setTimetable(res.data.length > 0 ? res.data[0].periods : []);
    } catch (err) { console.error("Timetable error:", err); }
  };

  const fetchChildren = async () => {
    try {
      const res = await api.get("/students"); // Mocking children as top 2 students
      setChildren(res.data.slice(0, 2));
    } catch (err) { console.error("Children fetch error:", err); }
  };

  const modules = [
    { id: 'attendance', title: 'Attendance', sub: 'Daily Logs', icon: <ClipboardList className="w-7 h-7" />, color: 'emerald', path: '/attendance', roles: ['admin', 'teacher', 'student', 'parent'] },
    { id: 'fees', title: 'Fees Panel', sub: 'Payments', icon: <Wallet className="w-7 h-7" />, color: 'indigo', path: '/fees', roles: ['admin', 'parent', 'accountant'] },
    { id: 'timetable', title: 'Timetable', sub: 'Class Agenda', icon: <CalendarClock className="w-7 h-7" />, color: 'blue', path: '/timetable', roles: ['admin', 'teacher', 'student'] },
    { id: 'homework', title: role === 'teacher' ? 'Assignments' : 'Homework', sub: role === 'teacher' ? 'Upload' : 'Records', icon: <PenTool className="w-7 h-7" />, color: 'rose', path: '/homework', roles: ['admin', 'teacher', 'student'] },
    { id: 'exams', title: 'Exam Results', sub: 'Transcripts', icon: <Award className="w-7 h-7" />, color: 'amber', path: '/exams', roles: ['admin', 'teacher', 'student', 'parent'] },
    { id: 'communication', title: 'Messaging', sub: 'Direct Inmate', icon: <MessageSquare className="w-7 h-7" />, color: 'sky', path: '/communication', roles: ['admin', 'teacher', 'student'] },
    { id: 'transport', title: 'Fleet Tracking', sub: 'Live Transit', icon: <Navigation className="w-7 h-7" />, color: 'teal', path: '/transport', roles: ['admin', 'student', 'parent'] },
    { id: 'calendar', title: 'School Calendar', sub: 'Events', icon: <Calendar className="w-7 h-7" />, color: 'blue', path: '/calendar', roles: ['admin', 'teacher', 'student', 'parent'] },
    { id: 'staff', title: 'Faculty', sub: 'Management', icon: <Users className="w-7 h-7" />, color: 'indigo', path: '/staff', roles: ['admin', 'accountant'] },
  ];

  const filteredModules = modules.filter(m => !m.roles || m.roles.includes(role));

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa]">
       <Loader2 className="w-12 h-12 animate-spin text-[#4f46e5] mb-6" />
       <p className="text-[#555555] font-black italic tracking-widest uppercase tracking-[4px]">Syncing Terminal...</p>
    </div>
  );

  return (
    <div className="bg-[#fafafa] min-h-screen pb-40 font-sans transition-all">
      
      {/* HEADER SECTION - EXACT FLUTTER MATCH */}
      <div className={`bg-gradient-to-br ${schemes[role] || schemes.admin} px-6 pt-12 pb-16 rounded-b-[40px] shadow-3xl relative overflow-hidden transition-colors duration-1000`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center text-white">
            <div className="text-center md:text-left animate-in slide-in-from-left duration-700">
               <p className="text-white/60 text-[9px] font-black uppercase tracking-[4px] mb-2 px-1 italic">{portalThemes[role] || "Dashboard"}</p>
               <h1 className="text-white text-[32px] font-black leading-tight uppercase tracking-tight">Hello, {user?.name?.split(' ')[0] || "User"}</h1>
            </div>
            
            <div className="flex items-center gap-4 mt-6 md:mt-0">
               <div 
                 onClick={() => navigate('/notifications')}
                 className="bg-white/10 p-4 rounded-[20px] border border-white/5 relative cursor-pointer hover:bg-white/20 transition shadow-2xl backdrop-blur-md">
                 <Bell className="w-6 h-6 text-white" />
                 <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#8b5cf6] rounded-full border-2 border-white/20"></div>
               </div>
               <div
                 onClick={() => navigate('/profile')} 
                 className="w-16 h-16 rounded-[24px] border-4 border-white/20 p-1 cursor-pointer hover:scale-110 transition-all shadow-2xl overflow-hidden bg-white/10 group"
               >
                   <div className="w-full h-full bg-white/20 rounded-[16px] flex items-center justify-center font-black text-xl text-white group-hover:bg-white group-hover:text-black transition-colors">
                      {user?.name?.[0] || "U"}
                   </div>
               </div>
            </div>
        </div>

        {/* DYNAMIC STATS BAR - EXACT FLUTTER MATCH */}
        <div className="max-w-7xl mx-auto mt-10 grid grid-cols-3 gap-6 bg-white/10 backdrop-blur-md rounded-[28px] p-6 border border-white/10 shadow-inner">
          {role === 'parent' ? (
             <>
                <StatItem label="Dues" val={`₹${(stats?.totalDues || 4200).toLocaleString()}`} />
                <StatLine />
                <StatItem label="Children" val={children.length.toString().padStart(2, '0')} />
                <StatLine />
                <StatItem label="Status" val="Active" />
             </>
          ) : (
             <>
                <StatItem label="Attendance" val={(stats?.attendancePercentage || "94") + "%"} />
                <StatLine />
                <StatItem label="GPA Scale" val="3.85" />
                <StatLine />
                <StatItem label="Assignments" val={(stats?.homeworkCount || "12").toString().padStart(2, '0')} />
             </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10 relative z-50">
        
        {/* MODULES GRID - EXACT FLUTTER MATCH */}
        <div className="mb-8">
           <h3 className="text-[#000000] font-black text-xl tracking-tight uppercase leading-none mb-6 px-4">Institutional Hub</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {filteredModules.map((m, idx) => (
                <ModuleCard key={m.id} m={m} idx={idx} onClick={() => navigate(m.path)} />
             ))}
           </div>
        </div>

        {/* ROLE SPECIFIC SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-20">
           
           {/* LEFT CONTENT */}
           <div className="lg:col-span-8 flex flex-col gap-12">
              
              {role === 'teacher' && (
                <section className="animate-in slide-in-from-bottom duration-700">
                   <div className="flex justify-between items-center mb-10 px-4">
                      <h3 className="text-[#000000] font-black text-2xl tracking-tight uppercase leading-none">Class Schedule</h3>
                      <select 
                        value={selectedClass} 
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-2.5 font-black text-[11px] uppercase tracking-widest text-[#4F46E5] outline-none cursor-pointer"
                      >
                         <option value="8">Grade 8</option>
                         <option value="9">Grade 9</option>
                         <option value="10">Grade 10</option>
                         <option value="11">Grade 11</option>
                         <option value="12">Grade 12</option>
                      </select>
                   </div>
                   
                   <div className="space-y-6">
                      {timetable.length > 0 ? timetable.map((p, i) => (
                         <SessionRow key={i} p={p} />
                      )) : (
                         <div className="p-20 text-center bg-gray-50 border-4 border-dashed border-gray-100 rounded-[50px] italic font-bold text-gray-300">No active sessions for this grade node</div>
                      )}
                   </div>
                </section>
              )}

              {role === 'parent' && (
                <section className="animate-in slide-in-from-bottom duration-700">
                   <h3 className="text-[#000000] font-black text-2xl tracking-tight uppercase leading-none mb-10 px-4">Student Profiles</h3>
                   <div className="space-y-6">
                      {children.map((c, i) => (
                         <ChildCard key={i} c={c} />
                      ))}
                   </div>
                </section>
              )}

              {/* NOTICE BOARD - COMMON FOR ALL */}
              <section className="animate-in slide-in-from-bottom duration-700">
                 <div className="flex justify-between items-center mb-6 px-4">
                    <h3 className="text-[#000000] font-black text-xl tracking-tight uppercase leading-none text-black">Notice Board</h3>
                    <button onClick={() => navigate('/communication')} className="text-blue-600 font-bold text-[10px] uppercase tracking-[2px] px-4 py-2 rounded-xl transition">Archives</button>
                 </div>
                 <div className="bg-white border border-gray-100 rounded-[28px] shadow-sm overflow-hidden p-2">
                    {notices.length > 0 ? notices.slice(0, 4).map((n, i) => (
                       <NoticeRow key={i} n={n} idx={i} />
                    )) : (
                       <div className="p-12 text-center text-[#555555] opacity-20 whitespace-normal font-bold"><Bell className="inline w-10 h-10 mb-2" /><br/>Syncing...</div>
                    )}
                 </div>
              </section>
           </div>

           {/* RIGHT CONTENT - SIDEBARS */}
           <div className="lg:col-span-4 flex flex-col gap-12">
              <div className="bg-[#1e1b4b] p-10 rounded-[60px] shadow-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                 <h4 className="text-white text-2xl font-black tracking-tight uppercase mb-6 relative z-10 flex items-center gap-4">
                    <Calendar className="w-6 h-6 text-[#4F46E5]" /> Events Node
                 </h4>
                 <div className="bg-white/5 border border-white/5 rounded-[40px] p-8 space-y-8 relative z-10 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => navigate('/calendar')}>
                    <div className="flex items-center gap-6">
                       <div className="bg-white/10 p-5 rounded-[28px] text-white">
                          <Clock className="w-8 h-8" />
                       </div>
                       <div>
                          <p className="text-white font-black text-lg uppercase tracking-tight leading-none">Olympiad</p>
                          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-2 italic">Oct 24, 09:00 AM</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="bg-rose-500/10 p-5 rounded-[28px] text-rose-400">
                          <Activity className="w-8 h-8" />
                       </div>
                       <div>
                          <p className="text-white font-black text-lg uppercase tracking-tight leading-none">Sports Day</p>
                          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-2 italic">Oct 28, All Day</p>
                       </div>
                    </div>
                 </div>
              </div>

              {role === 'teacher' && (
                 <button className="bg-indigo-900 text-white p-10 rounded-[60px] shadow-3xl flex flex-col items-center gap-6 hover:bg-black transition-all border border-indigo-950 active:scale-95">
                    <Download className="w-10 h-10 text-emerald-400" />
                    <span className="font-black text-xl uppercase tracking-widest">Download Full Schedule</span>
                 </button>
              )}
           </div>

        </div>
      </div>

    </div>
  );
}

function StatItem({ label, val }) {
   return (
      <div className="text-center">
         <p className="text-white font-black text-2xl tracking-tighter leading-none mb-2 uppercase tabular-nums">{val}</p>
         <p className="text-white/40 text-[11px] font-black uppercase tracking-[2px] leading-none italic">{label}</p>
      </div>
   )
}

function StatLine() { return <div className="h-10 w-px bg-white/20 my-auto" /> }

function ModuleCard({ m, idx, onClick }) {
   const colors = {
      emerald: "bg-emerald-50 text-emerald-500 border-emerald-100",
      indigo: "bg-[#3b82f6]/10 text-blue-500 border-blue-100",
      rose: "bg-rose-50 text-rose-500 border-rose-100",
      amber: "bg-amber-50 text-amber-500 border-amber-100",
      sky: "bg-sky-50 text-sky-500 border-sky-100",
      teal: "bg-teal-50 text-teal-500 border-teal-100",
      blue: "bg-blue-50 text-blue-500 border-blue-100",
   };
   return (
      <div 
        onClick={onClick}
        className="group cursor-pointer bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm flex flex-col items-start hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 animate-in zoom-in"
        style={{ animationDelay: `${idx * 50}ms` }}
      >
        <div className={`p-4 rounded-[18px] mb-4 group-hover:rotate-12 transition-all duration-500 shadow-inner ${colors[m.color]}`}>
          {m.icon}
        </div>
        <h4 className="text-[#000000] font-black text-lg tracking-tight uppercase leading-none mb-1">{m.title}</h4>
        <p className="text-[#555555] font-bold text-[9px] uppercase tracking-[1.5px] italic opacity-60 leading-none">{m.sub}</p>
      </div>
   );
}

function SessionRow({ p }) {
   return (
      <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm flex items-center gap-10 hover:shadow-2xl transition-all group cursor-pointer overflow-hidden relative">
         <div className="absolute top-0 right-0 w-24 h-full bg-[#4F46E5]/5 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
         <div className="bg-[#F9FAFB] px-8 py-5 rounded-[28px] shrink-0 font-black text-lg text-[#555555] shadow-inner group-hover:bg-[#4F46E5] group-hover:text-white transition-all">
            {p.startTime || "09:00"}
         </div>
         <div className="flex-1">
            <h4 className="text-[#000000] font-black text-2xl tracking-tight uppercase group-hover:text-[#4F46E5] transition-colors leading-none">{p.subject || "Session"}</h4>
            <div className="flex items-center gap-4 mt-3">
               <span className="text-indigo-600 font-black text-[11px] uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-xl">Location: {p.room || "Lab A"}</span>
            </div>
         </div>
         <ChevronRight className="w-8 h-8 text-gray-100 group-hover:text-black transition-colors" />
      </div>
   );
}

function ChildCard({ c }) {
   return (
      <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm flex items-center gap-10 hover:shadow-2xl transition-all group cursor-pointer relative overflow-hidden">
         <div className="w-16 h-16 bg-[#1e1b4b] rounded-[24px] flex items-center justify-center font-black text-white text-xl shadow-xl border-4 border-white group-hover:rotate-6 transition-all">
            {c.userId?.name?.[0] || "S"}
         </div>
         <div className="flex-1">
            <h4 className="text-[#000000] font-black text-2xl tracking-tight leading-none uppercase group-hover:text-[#E11D48] transition-colors">{c.userId?.name || "Student"}</h4>
            <div className="flex items-center gap-4 mt-3">
               <span className="text-gray-400 font-black text-[11px] uppercase tracking-widest italic opacity-60">Grade {c.class}-{c.section}</span>
               <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
               <span className="text-rose-600 font-bold text-[10px] uppercase tracking-widest tracking-[3px]">Authorized Access</span>
            </div>
         </div>
         <div className="bg-rose-50 p-4 rounded-3xl text-rose-300 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
            <ChevronRight className="w-6 h-6" />
         </div>
      </div>
   );
}

function NoticeRow({ n, idx }) {
   return (
      <div className="flex items-center p-8 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition cursor-pointer group">
         <div className="bg-indigo-50 p-4 rounded-3xl shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
            <Bell className="w-7 h-7 text-[#4F46E5] group-hover:text-white" />
         </div>
         <div className="ml-10 flex-1">
            <h4 className="text-[#000000] font-black text-xl tracking-tight uppercase group-hover:text-[#4F46E5] transition-colors leading-none">{n.title}</h4>
            <p className="text-gray-400 font-bold text-[11px] uppercase tracking-widest mt-2">{new Date(n.createdAt).toLocaleDateString()} • Global Broadcast</p>
         </div>
         <ChevronRight className="w-8 h-8 text-gray-100 group-hover:text-black transition-colors" />
      </div>
   );
}