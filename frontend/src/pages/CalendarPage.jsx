import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Plus, 
  Bell, 
  MoreVertical,
  Activity,
  Award,
  Globe,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  CalendarDays,
  Clock,
  MapPin,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function CalendarPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notices");
      setNotices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Events fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const startDay = (month, year) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const totalDays = daysInMonth(month, year);
  const offset = startDay(month, year);

  const daysArr = Array.from({ length: totalDays }, (_, i) => i + 1);
  const offsetArr = Array.from({ length: offset }, (_, i) => null);

  const allDays = [...offsetArr, ...daysArr];

  // Helper to check if a day has an event
  const hasEvent = (day) => {
    if (!day) return false;
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return notices.some(n => new Date(n.createdAt).toDateString() === new Date(year, month, day).toDateString());
  };

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa]">
       <Loader2 className="w-12 h-12 animate-spin text-[#4f46e5] mb-6" />
       <p className="text-gray-400 font-black italic tracking-widest uppercase tracking-[4px]">Syncing Timeline...</p>
     </div>
  );

  return (
    <div className="bg-[#fafafa] min-h-screen pb-40 font-sans transition-all">
      
      {/* HEADER AREA */}
      <div className="bg-[#1e1b4b] px-8 pt-12 pb-14 rounded-b-[70px] shadow-3xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center text-white">
          <div className="flex gap-6 items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="bg-white/10 p-4 rounded-[28px] border border-white/5 hover:bg-white/20 transition shadow-2xl backdrop-blur-md active:scale-95 group">
              <ChevronLeft className="w-7 h-7 text-white" />
            </button>
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[5px] mb-1">Temporal Map</p>
              <h1 className="text-white text-[32px] font-black leading-tight uppercase tracking-tight">Institutional Cycle</h1>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
             <div className="bg-emerald-500/20 px-8 py-3 rounded-2xl border border-emerald-500/20 flex items-center gap-4">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                <span className="text-white text-[10px] font-black uppercase tracking-widest leading-none">Global Atomic Sync</span>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-12 w-full flex-1">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* CALENDAR BODY */}
          <div className="lg:col-span-8 flex flex-col gap-12">
             <div className="bg-white rounded-[60px] shadow-3xl border border-gray-100 p-12 overflow-hidden relative group">
                
                <div className="flex justify-between items-center mb-16 relative z-10">
                   <div className="flex items-center gap-8">
                      <div className="bg-indigo-50 p-6 rounded-[30px] shadow-inner text-indigo-500">
                         <CalendarDays className="w-10 h-10" />
                      </div>
                      <div>
                         <h2 className="text-4xl font-black text-black uppercase tracking-tighter leading-none tabular-nums">{monthNames[month]}</h2>
                         <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[5px] mt-2 italic opacity-60">Session {year}</p>
                      </div>
                   </div>
                   <div className="flex gap-5">
                      <button 
                        onClick={handlePrevMonth}
                        className="bg-gray-50 text-black p-5 rounded-[28px] border border-gray-100 hover:bg-black hover:text-white transition shadow-sm active:scale-90">
                        <ChevronLeft className="w-7 h-7" />
                      </button>
                      <button 
                        onClick={handleNextMonth}
                        className="bg-gray-50 text-black p-5 rounded-[28px] border border-gray-100 hover:bg-black hover:text-white transition shadow-sm active:scale-90">
                        <ChevronRight className="w-7 h-7" />
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-7 gap-y-12 mb-8 relative z-10">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="text-center text-gray-300 font-black text-[12px] uppercase tracking-widest">{day}</div>
                  ))}
                  
                  {allDays.map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center group/day">
                      <div className={`w-16 h-16 rounded-[28px] flex items-center justify-center font-black text-[20px] transition-all cursor-pointer tabular-nums 
                        ${day === null ? 'invisible' : 
                        (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) 
                        ? 'bg-[#1e1b4b] text-white shadow-3xl scale-110 border-4 border-white' : 
                        'text-black hover:bg-gray-50 border border-transparent'}`}>
                        {day}
                      </div>
                      {hasEvent(day) && (
                         <div className="w-2.5 h-2.5 bg-[#4f46e5] rounded-full mt-3 shadow-lg shadow-indigo-500/50 animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>
             </div>
          </div>

          {/* SIDEBAR: EVENTS */}
          <div className="lg:col-span-4 space-y-12">
             
             <div className="flex justify-between items-center px-4">
                <h3 className="text-black font-black text-2xl tracking-tight uppercase leading-none">Event Stream</h3>
                <div className="bg-rose-50 px-4 py-2 rounded-xl border border-rose-100 flex items-center gap-2">
                   <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse"></div>
                   <span className="text-rose-600 text-[10px] font-black uppercase tracking-widest leading-none">Live</span>
                </div>
             </div>

             <div className="space-y-8 max-h-[600px] overflow-y-auto px-2 custom-scrollbar">
                {notices.map((n, i) => (
                   <EventTile 
                      key={n._id || i}
                      date={new Date(n.createdAt).getDate().toString()} 
                      month={monthNames[new Date(n.createdAt).getMonth()].substring(0,3).toUpperCase()} 
                      title={n.title} 
                      type={n.priority === 'urgent' ? 'Critical' : 'Session'} 
                      color={n.priority === 'urgent' ? 'bg-rose-600' : 'bg-[#1e1b4b]'} 
                   />
                ))}
                {notices.length === 0 && (
                   <div className="bg-gray-50 p-20 rounded-[50px] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center opacity-40">
                      <Zap className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest">No Events Archived</p>
                   </div>
                )}
             </div>

             {/* STATS */}
             <div className="bg-black p-10 rounded-[60px] shadow-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <h4 className="text-white text-2xl font-black tracking-tight uppercase mb-8 relative z-10">Monthly Metrics</h4>
                <div className="space-y-6 relative z-10">
                   <MetricRow label="Working Days" val="22" icon={<Clock className="w-4 h-4" />} />
                   <MetricRow label="Assignments" val="14" icon={<Award className="w-4 h-4" />} />
                   <MetricRow label="Holidays" val="02" icon={<Globe className="w-4 h-4" />} />
                </div>
             </div>
          </div>

        </div>
      </div>

    </div>
  );
}

function EventTile({ date, month, title, type, color }) {
  return (
    <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm flex items-center gap-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer animate-in zoom-in border-l-[12px] border-l-[#1e1b4b]">
       <div className={`${color} w-16 h-20 rounded-[28px] flex flex-col items-center justify-center text-white shrink-0 shadow-2xl group-hover:rotate-6 transition-transform`}>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60 tabular-nums">{month}</span>
          <span className="text-3xl font-black leading-none mt-1 tabular-nums tracking-tighter">{date}</span>
       </div>
       <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
             <p className="text-[#4f46e5] font-black text-[10px] uppercase tracking-[2px] leading-none italic">{type}</p>
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
          </div>
          <h4 className="text-black font-black text-xl tracking-tight uppercase leading-tight truncate group-hover:text-indigo-600 transition-colors">{title}</h4>
       </div>
       <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-black group-hover:text-white transition shadow-sm border border-gray-100">
          <ChevronRight className="w-6 h-6" />
       </div>
    </div>
  );
}

function MetricRow({ label, val, icon }) {
   return (
      <div className="flex justify-between items-center group/metric">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-xl text-white/40 group-hover/metric:text-white transition-colors">
               {icon}
            </div>
            <span className="text-white/40 font-black text-[10px] uppercase tracking-widest">{label}</span>
         </div>
         <span className="text-white font-black text-xl tabular-nums tracking-tighter">{val}</span>
      </div>
   );
}
