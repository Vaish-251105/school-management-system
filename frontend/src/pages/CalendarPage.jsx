import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Plus } from "lucide-react";
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
    <div className="bg-[#fafafa] min-h-screen font-sans pb-10">
      <div className="bg-gradient-to-br from-[#4338ca] to-[#4f46e5] px-6 pt-12 pb-8 rounded-b-[40px] shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-white">
          <button 
            onClick={() => navigate(-1)}
            className="bg-white/10 p-2 rounded-xl border border-white/20 hover:bg-white/20 transition">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl font-bold">Academic Calendar</h1>
          <div className="bg-white/10 p-2 rounded-xl border border-white/20">
            <Plus className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">{monthNames[month]} {year}</h2>
            <div className="flex gap-4">
              <button 
                onClick={handlePrevMonth}
                className="bg-gray-50 p-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition shadow-sm">
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button 
                onClick={handleNextMonth}
                className="bg-gray-50 p-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition shadow-sm">
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-12 mb-6">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="text-center text-gray-400 font-bold text-[13px] uppercase tracking-wider">{day}</div>
            ))}
            
            {allDays.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-[16px] transition-all cursor-pointer ${
                  day === null ? 'invisible' : 
                  (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) 
                  ? 'bg-[#4f46e5] text-white shadow-xl shadow-indigo-500/30' : 
                  'text-gray-900 hover:bg-gray-50 hover:text-[#4f46e5]'
                }`}>
                  {day}
                </div>
                {/* Randomly mock an event dot for visual balance */}
                {day !== null && [3, 10, 24].includes(day) && (
                   <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1 animate-pulse" />
                )}
                {day !== null && [15, 28].includes(day) && (
                   <div className="w-1.5 h-1.5 bg-[#4f46e5] rounded-full mt-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-gray-900 font-bold text-lg mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-[#4f46e5] rounded-full" />
            Events in {monthNames[month]}
          </h3>
          <div className="space-y-4">
             <EventCard date="Oct 24" title="Maths Olympiad" time="09:00 AM" color="bg-[#4f46e5]" />
             <EventCard date="Oct 28" title="Annual Sports Meet" time="10:30 AM" color="bg-orange-500" />
             <EventCard date="Oct 15" title="Parent-Teacher Meeting" time="02:00 PM" color="bg-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCard({ date, title, time, color }) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition">
      <div className={`${color} w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white shrink-0`}>
         <span className="text-[10px] font-bold uppercase">{date.split(' ')[0]}</span>
         <span className="text-xl font-bold">{date.split(' ')[1]}</span>
      </div>
      <div>
        <h4 className="font-bold text-gray-900 text-[16px]">{title}</h4>
        <p className="text-gray-500 text-[13px] mt-1 flex items-center gap-1.5">
           <Calendar className="w-3.5 h-3.5" /> {time}
        </p>
      </div>
      <div className="ml-auto w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group hover:bg-[#4f46e5] hover:text-white transition">
         <ChevronRight className="w-5 h-5" />
      </div>
    </div>
  );
}
