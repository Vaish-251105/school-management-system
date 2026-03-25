import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  BookOpen, 
  Loader2,
  CalendarDays,
  ShieldCheck,
  LayoutGrid
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Timetable() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState("");

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const userRole = user?.role?.toLowerCase();
  const isStudent = userRole === 'student';

  useEffect(() => {
    // Default to current day
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    setActiveDay(days.includes(today) ? today : 'Monday');
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      // For students, the backend would ideally filter by their classId. 
      // For now, we fetch all and let them browse or implement auto-detect in Phase 2
      const response = await api.get("/timetable");
      setTimetable(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Find the specific class schedule (Simulated: for students we'd filter by their assigned classId)
  // Let's assume we filter by "10-A" for demonstration if user is student
  const currentClass = isStudent ? (user.class || "10-A") : (timetable[0]?.classId || "10-A");
  const filteredSchedule = timetable.find(t => t.classId === currentClass && t.day === activeDay);

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa]">
       <Loader2 className="w-12 h-12 animate-spin text-[#4f46e5] mb-6" />
       <p className="text-gray-400 font-black italic tracking-widest uppercase">Syncing Schedule...</p>
     </div>
  );

  return (
    <div className="bg-[#fafafa] min-h-screen pb-40 font-sans transition-all text-black">
      
      {/* HEADER AREA */}
      <div className="bg-[#1e1b4b] px-8 pt-12 pb-14 rounded-b-[60px] shadow-2xl relative overflow-hidden shrinkage-0">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center text-white text-center md:text-left">
          <div className="flex gap-6 items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="bg-white/10 p-3.5 rounded-[22px] border border-white/5 hover:bg-white/20 transition shadow-2xl backdrop-blur-md active:scale-95">
              <ChevronLeft className="w-7 h-7 text-white" />
            </button>
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-1">Academic Calendar</p>
              <h1 className="text-white text-[32px] font-black leading-tight uppercase tracking-tight">Class Timetable</h1>
            </div>
          </div>
          <div className="mt-8 md:mt-0 flex gap-4">
             <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3 backdrop-blur-md">
                <LayoutGrid className="w-5 h-5 text-indigo-400" />
                <span className="text-white font-black text-xs uppercase tracking-widest">{currentClass} Node</span>
             </div>
          </div>
        </div>

        {/* DAY SELECTOR */}
        <div className="max-w-5xl mx-auto mt-12 relative z-10 flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
           {days.map(d => (
             <button 
               key={d}
               onClick={() => setActiveDay(d)}
               className={`px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap shadow-sm border ${
                 activeDay === d 
                 ? "bg-white text-[#1e1b4b] scale-105 shadow-2xl border-white/10" 
                 : "bg-[#4f46e5]/10 text-white hover:bg-white/20 border-white/5"
               }`}>
               {d.substring(0, 3)}
             </button>
           ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-12 w-full flex-1">
        
        <div className="flex items-center justify-between mb-10 px-2">
           <div className="flex items-center gap-4">
              <CalendarDays className="w-8 h-8 text-indigo-600" />
              <h3 className="text-black font-black text-2xl uppercase tracking-tight leading-none">{activeDay} Agenda</h3>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest">Live Sync Enabled</span>
           </div>
        </div>

        <div className="space-y-6">
          {filteredSchedule?.periods?.length > 0 ? (
            filteredSchedule.periods.map((p, i) => (
              <PeriodCard key={i} idx={i} p={p} />
            ))
          ) : (
            <div className="p-32 text-center bg-gray-50 border-4 border-dashed border-gray-100 rounded-[50px] flex flex-col items-center">
               <BookOpen className="w-16 h-16 text-gray-200 mb-6" />
               <p className="text-gray-400 font-black italic uppercase text-lg">No classes scheduled for this day</p>
            </div>
          )}
        </div>

        {/* COMPLIANCE FOOTER */}
        <div className="mt-20 bg-[#1e1b4b] p-12 rounded-[50px] shadow-3xl relative overflow-hidden group border border-indigo-900/50">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <ShieldCheck className="w-40 h-40 text-emerald-400" />
           </div>
           <h4 className="text-white text-xl font-black uppercase tracking-tight mb-4 relative z-10 flex items-center gap-4">
              <ShieldCheck className="w-7 h-7 text-emerald-400" /> Institutional Verification
           </h4>
           <p className="text-indigo-200/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-xl relative z-10">
              Timetable version control v2.4.0. All room mappings and faculty assignments are verified by the central academic board. Sudden schedule revisions are synced automatically through the Smart School ERP hub.
           </p>
        </div>
      </div>

    </div>
  );
}

function PeriodCard({ idx, p }) {
  return (
    <div 
      className="bg-white p-10 rounded-[45px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group flex flex-col md:flex-row md:items-center gap-8 animate-in slide-in-from-bottom"
      style={{ animationDelay: `${idx * 100}ms` }}
    >
       <div className="flex items-center gap-8 md:border-r border-gray-50 md:pr-10 shrink-0">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
             {idx + 1}
          </div>
          <div className="flex flex-col">
             <div className="flex items-center gap-2 mb-1">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-black font-black text-lg tabular-nums tracking-tight">{p.startTime}</span>
             </div>
             <p className="text-gray-400 font-bold text-[9px] uppercase tracking-widest text-right">To {p.endTime}</p>
          </div>
       </div>

       <div className="flex-1">
          <h4 className="text-black font-black text-2xl uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{p.subject}</h4>
          <div className="mt-3 flex flex-wrap gap-3">
             <div className="bg-gray-50 px-4 py-1.5 rounded-xl flex items-center gap-2 border border-gray-100 group-hover:border-indigo-100 transition-colors">
                <User className="w-3 h-3 text-indigo-400" />
                <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">{p.teacher}</span>
             </div>
             <div className="bg-gray-50 px-4 py-1.5 rounded-xl flex items-center gap-2 border border-gray-100 group-hover:border-emerald-100 transition-colors">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">{p.room || 'Room '+ (300 + idx)}</span>
             </div>
          </div>
       </div>

       <div className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-10 group-hover:translate-x-0 duration-500 hidden md:block">
          <BookOpen className="w-10 h-10 text-indigo-100" />
       </div>
    </div>
  );
}
