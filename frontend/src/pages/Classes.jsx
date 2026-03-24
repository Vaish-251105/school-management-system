import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Search, 
  MapPin, 
  Clock, 
  Calendar as CalendarIcon, 
  Bell, 
  User,
  GraduationCap,
  Loader2,
  RefreshCw,
  Plus,
  X,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Classes() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  const [showAddClass, setShowAddClass] = useState(false);
  const [newClassName, setNewClassName] = useState("");

  const isAdmin = user.role === 'admin' || user.role === 'teacher';

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const res = await api.get("/timetable");
      setTimetables(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Timetable fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      await api.post("/timetable", {
        classId: newClassName,
        day: "Monday",
        periods: [
          { subject: "Introductory Class", time: "08:30", teacher: user.name, room: "Room 101" }
        ]
      });
      setShowAddClass(false);
      setNewClassName("");
      fetchTimetable();
    } catch (err) {
      alert("Failed to add class. Try again.");
    }
  };

  const currentDaySchedule = timetables.find(t => t.day === selectedDay);
  const uniqueClasses = [...new Set(timetables.map(t => t.classId))];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa]">
       <Loader2 className="w-12 h-12 animate-spin text-[#4f46e5] mb-6" />
       <p className="text-gray-400 font-black italic tracking-widest uppercase">Syncing Schedule...</p>
     </div>
  );

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans flex flex-col pb-32 text-black transition-all animate-in fade-in">
      
      {/* HEADER AREA */}
      <div className="bg-[#1e1b4b] px-8 pt-12 pb-14 rounded-b-[60px] shadow-2xl relative overflow-hidden shrinkage-0 text-black">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center text-white text-center md:text-left">
          <div className="flex gap-6 items-center animate-in slide-in-from-bottom duration-700">
            <button 
              onClick={() => navigate(-1)} 
              className="bg-white/10 p-3.5 rounded-[22px] border border-white/5 hover:bg-white/20 transition shadow-2xl backdrop-blur-md active:scale-95 group">
              <ChevronLeft className="w-7 h-7 text-white" />
            </button>
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-1">Institutional Schedule</p>
              <h1 className="text-white text-[32px] font-black leading-tight uppercase tracking-tight">Classes</h1>
            </div>
          </div>
          <div className="flex gap-4 mt-6 md:mt-0">
             {isAdmin && (
               <button 
                 onClick={() => setShowAddClass(true)}
                 className="bg-emerald-500 text-white text-[13px] font-black px-8 py-4 rounded-[22px] flex items-center gap-3 hover:scale-105 active:scale-95 transition shadow-2xl border border-white/10 uppercase tracking-widest">
                 <Plus className="w-5 h-5 text-emerald-900/50" /> Add Class
               </button>
             )}
             <button 
               onClick={fetchTimetable}
               className="bg-white/10 p-4 rounded-3xl border border-white/5 text-white hover:bg-white/20 transition shadow-lg">
               <RefreshCw className="w-6 h-6" />
             </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-10 relative z-10 flex gap-3 overflow-x-auto pb-6 scrollbar-hide px-2">
          {days.map((day) => (
            <button 
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-8 py-4 rounded-[22px] font-black text-[13px] uppercase tracking-widest transition-all shrink-0 border-2 ${
                selectedDay === day 
                ? "bg-white text-[#1e1b4b] border-white shadow-2xl -translate-y-1" 
                : "bg-white/10 text-white border-white/10 hover:bg-white/20"
              }`}>
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-12 w-full flex-1 text-black font-sans">
        
        <div className="flex justify-between items-end mb-8 px-2">
           <div>
             <h3 className="text-black font-black text-2xl tracking-tight uppercase leading-none">Schedule for {selectedDay}</h3>
             <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2 italic">{uniqueClasses.length} Registered Courses</p>
           </div>
           <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 flex items-center gap-2">
             <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
             <span className="text-indigo-700 text-[10px] font-black uppercase tracking-widest leading-none">Live Sync</span>
           </div>
        </div>

        <div className="grid gap-8 mb-16">
          {currentDaySchedule && currentDaySchedule.periods?.length > 0 ? (
            currentDaySchedule.periods.map((period, idx) => (
              <PeriodCard 
                key={idx}
                idx={idx}
                classTitle={currentDaySchedule.classId}
                sub={period.subject} 
                time={period.time} 
                teacher={period.teacher || "Faculty Member"} 
                room={period.room || "Room 101"} 
                active={idx === 0}
              />
            ))
          ) : (
            <div className="p-32 text-center bg-gray-50 rounded-[50px] border-4 border-dashed border-gray-100 flex flex-col items-center animate-in zoom-in duration-500">
               <CalendarIcon className="w-16 h-16 text-gray-200 mb-6" />
               <p className="text-gray-400 font-black italic uppercase text-lg">No classes scheduled</p>
            </div>
          )}
        </div>
      </div>

      {/* ADD CLASS MODAL */}
      {showAddClass && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-6 animate-in fade-in transition-all">
          <div className="bg-white w-full max-w-lg rounded-[50px] p-12 shadow-3xl relative animate-in zoom-in duration-300 overflow-hidden text-black">
            <button onClick={() => setShowAddClass(false)} className="absolute top-8 right-8 bg-gray-50 p-3 rounded-2xl hover:bg-black hover:text-white transition active:scale-95 shadow-sm">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-black text-black mb-10 uppercase tracking-tight">Register New Class</h2>
            <form onSubmit={handleAddClass} className="space-y-8">
               <div className="space-y-2 px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600 block mb-2">Internal Identifier (e.g. 10th-A)</label>
                  <input 
                    required 
                    autoFocus
                    placeholder="Enter unique class name" 
                    value={newClassName} 
                    onChange={e => setNewClassName(e.target.value)}
                    className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[30px] outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 focus:bg-white transition-all font-bold text-lg text-black"
                  />
               </div>
               <button type="submit" className="w-full bg-[#1e1b4b] text-white py-6 rounded-[30px] font-black text-xl shadow-2xl hover:bg-black transition-all uppercase tracking-widest border border-white/10">
                 Authorize Class
               </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function PeriodCard({ idx, classTitle, sub, time, teacher, room, active }) {
  return (
    <div 
      className={`p-8 rounded-[45px] border transition-all duration-300 flex items-center shadow-sm group animate-in slide-in-from-bottom ${
        active 
        ? "bg-[#1e1b4b] text-white border-transparent shadow-2xl -translate-y-1" 
        : "bg-white border-gray-100 text-black hover:shadow-2xl hover:-translate-y-1"
      }`}
      style={{ animationDelay: `${idx * 100}ms` }}
    >
      <div className={`w-20 h-20 rounded-[30px] flex items-center justify-center font-black text-2xl mr-8 shrink-0 transition-transform group-hover:rotate-6 ${
        active 
        ? "bg-white/10 text-white border border-white/10" 
        : "bg-indigo-50 text-[#1e1b4b] border border-indigo-100"
      }`}>
        <Clock className="w-8 h-8" />
      </div>
      
      <div className="flex-1 text-black">
        <div className="flex items-center gap-4 mb-3">
          <span className={`text-[10px] font-black uppercase tracking-[2px] px-4 py-1.5 rounded-xl ${
            active ? "bg-white/10 text-white" : "bg-indigo-50 text-indigo-600 border border-indigo-100"
          }`}>{classTitle}</span>
          <span className={`text-[11px] font-black uppercase tracking-widest ${active ? "text-white/40" : "text-gray-400"}`}>{room} • {time}</span>
        </div>
        <h4 className={`font-black text-2xl tracking-tight uppercase leading-tight ${active ? "text-white" : "text-black group-hover:text-indigo-600"} transition-colors`}>{sub}</h4>
        <div className="flex items-center gap-4 mt-4 opacity-60">
           <div className="flex items-center gap-2 truncate">
              <User className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-indigo-500'}`} />
              <span className={`text-[13px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-black'}`}>{teacher}</span>
           </div>
        </div>
      </div>

      <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center shrink-0 transition-all ${
        active ? "bg-white/10 text-white" : "bg-gray-50 text-gray-200 group-hover:bg-black group-hover:text-white"
      }`}>
        <ArrowRight className="w-7 h-7" />
      </div>
    </div>
  );
}