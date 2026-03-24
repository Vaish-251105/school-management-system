import React, { useState } from "react";
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
  ArrowUpRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CalendarPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

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

  return (
    <div className="bg-[#fafafa] min-h-screen pb-32 font-sans animate-in fade-in transition-all text-black">
      
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
              <h1 className="text-white text-[32px] font-black leading-tight uppercase tracking-tight">School Calendar</h1>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
             <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
                <Calendar className="text-white w-5 h-5 animate-pulse" />
                <span className="text-white text-[10px] font-black uppercase tracking-widest leading-none">Global Sync</span>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-12 w-full flex-1 text-black font-sans">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* CALENDAR BODY */}
          <div className="lg:col-span-2 space-y-10">
             <div className="bg-white rounded-[50px] shadow-3xl border border-gray-100 p-10 overflow-hidden relative group text-black">
                
                <div className="flex justify-between items-center mb-12 relative z-10">
                   <div>
                      <h2 className="text-3xl font-black text-black uppercase tracking-tight leading-none tabular-nums">{monthNames[month]}</h2>
                      <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[4px] mt-2 italic">Institutional Cycle {year}</p>
                   </div>
                   <div className="flex gap-4">
                      <button 
                        onClick={handlePrevMonth}
                        className="bg-indigo-50 text-indigo-600 p-4 rounded-3xl border border-indigo-100 hover:bg-[#1e1b4b] hover:text-white transition shadow-sm active:scale-90">
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={handleNextMonth}
                        className="bg-indigo-50 text-indigo-600 p-4 rounded-3xl border border-indigo-100 hover:bg-[#1e1b4b] hover:text-white transition shadow-sm active:scale-90">
                        <ChevronRight className="w-6 h-6" />
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-7 gap-y-10 mb-6 relative z-10 transition-all text-black">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="text-center text-gray-400 font-black text-[11px] uppercase tracking-widest">{day}</div>
                  ))}
                  
                  {allDays.map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center font-black text-[18px] transition-all cursor-pointer tabular-nums 
                        ${day === null ? 'invisible' : 
                        (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) 
                        ? 'bg-[#1e1b4b] text-white shadow-2xl scale-110' : 
                        'text-black hover:bg-gray-50'}`}>
                        {day}
                      </div>
                      {day !== null && [3, 10, 24].includes(day) && (
                         <div className="w-2 h-2 bg-rose-500 rounded-full mt-2" />
                      )}
                      {day !== null && [15, 28].includes(day) && (
                         <div className="w-2 h-2 bg-[#4f46e5] rounded-full mt-2" />
                      )}
                    </div>
                  ))}
                </div>
             </div>
          </div>

          {/* SIDEBAR: EVENTS */}
          <div className="lg:col-span-1 space-y-10 text-black">
             
             <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="text-black font-black text-2xl tracking-tight uppercase leading-none">Events</h3>
                <div className="bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 flex items-center gap-2">
                   <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                   <span className="text-indigo-700 text-[10px] font-black uppercase tracking-widest leading-none">Live</span>
                </div>
             </div>

             <div className="space-y-6">
                <EventTile date="24" month="OCT" title="Maths Olympiad" type="Academic" color="bg-[#1e1b4b]" />
                <EventTile date="28" month="OCT" title="Sports Day" type="Athletic" color="bg-rose-600" />
                <EventTile date="15" month="OCT" title="Staff Meeting" type="Institutional" color="bg-emerald-600" />
             </div>

             {/* SYNC CARD */}
             <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-3xl text-center flex flex-col items-center relative overflow-hidden group">
                <div className="bg-indigo-50 p-6 rounded-[30px] mb-6 shadow-inner group-hover:scale-110 transition duration-500">
                   <Globe className="w-10 h-10 text-[#4f46e5]" />
                </div>
                <h4 className="text-black font-black text-xl tracking-tight uppercase mb-4">Cloud Sync</h4>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest leading-relaxed mb-8">Synchronize institutional events across all authenticated nodes.</p>
                <button className="w-full bg-black text-white px-8 py-5 rounded-[22px] font-black text-[12px] uppercase tracking-widest shadow-2xl hover:scale-105 transition active:scale-95 flex items-center justify-center gap-3">
                   Synchronize Now <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                </button>
             </div>
          </div>

        </div>

      </div>

      {/* FLOATING ACTION */}
      <div className="fixed bottom-10 right-10 z-[100]">
        <button 
          onClick={() => alert("Redirecting to event management...")}
          className="bg-black text-white px-10 py-5 rounded-[30px] font-black shadow-3xl shadow-indigo-500/10 flex items-center gap-4 hover:scale-110 active:scale-95 transition-all text-sm uppercase tracking-widest border border-white/10 group">
          <Plus className="w-7 h-7 text-emerald-400" /> Add Event
        </button>
      </div>

    </div>
  );
}

function EventTile({ date, month, title, type, color }) {
  return (
    <div className="bg-white p-7 rounded-[45px] border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer border-l-8 border-l-[#1e1b4b] text-black">
       <div className={`${color} w-16 h-16 rounded-[24px] flex flex-col items-center justify-center text-white shrink-0 shadow-lg group-hover:rotate-3 transition-transform`}>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60 tabular-nums">{month}</span>
          <span className="text-2xl font-black leading-none mt-1 tabular-nums">{date}</span>
       </div>
       <div className="flex-1">
          <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[3px] mb-1 italic">{type}</p>
          <h4 className="text-black font-black text-[18px] tracking-tight group-hover:text-indigo-600 transition-colors uppercase leading-tight">{title}</h4>
       </div>
       <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-black group-hover:text-white transition shadow-sm">
          <ChevronRight className="w-6 h-6" />
       </div>
    </div>
  );
}
