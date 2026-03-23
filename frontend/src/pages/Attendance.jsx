import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Bell, 
  GraduationCap, 
  ChevronDown, 
  Calendar as CalendarIcon, 
  Check, 
  X, 
  CheckCircle2,
  Loader2,
  SlidersHorizontal,
  MoreVertical
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function Attendance() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: 'present' | 'absent' }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/students", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        const studentList = Array.isArray(data) ? data : (data.students || []);
        setStudents(studentList);
        
        // Initialize all as present by default
        const initialAttendance = {};
        studentList.forEach(s => {
          initialAttendance[s._id] = 'present';
        });
        setAttendance(initialAttendance);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleMark = (id, status) => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const markAllPresent = () => {
    const updated = {};
    students.forEach(s => { updated[s._id] = 'present'; });
    setAttendance(updated);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const attendanceData = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        status
      }));

      const response = await fetch("http://localhost:5000/api/attendance/bulk", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          attendanceData, 
          date: new Date().toISOString().split('T')[0] 
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Attendance submitted successfully! ✅");
      } else {
        alert(data.message || "Failed to submit attendance.");
      }
    } catch (err) {
      console.error("Attendance submission error:", err);
      alert("Error submitting attendance.");
    } finally {
      setSubmitting(false);
    }
  };

  const presentCount = Object.values(attendance).filter(v => v === 'present').length;
  const absentCount = Object.values(attendance).filter(v => v === 'absent').length;

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans flex flex-col pb-36 text-gray-900">
      
      {/* HEADER AREA */}
      <div className="bg-gradient-to-br from-[#4338ca] to-[#4f46e5] px-6 pt-12 pb-8 rounded-b-[40px] shadow-lg shrink-0">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/10 p-2 rounded-full transition">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-white text-lg font-bold">Attendance Manager</h1>
            <div className="flex gap-2">
              <button 
                onClick={() => alert("No new notifications")}
                className="text-white p-2 hover:bg-white/10 rounded-full transition">
                <Bell className="w-5 h-5" />
              </button>
              <button 
                onClick={() => alert("Filter Options: \n• By Roll No\n• By Name\n• By Status")}
                className="text-white p-2 hover:bg-white/10 rounded-full transition">
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center bg-white/15 border border-white/20 rounded-2xl px-5 py-3 shadow-inner">
            <GraduationCap className="text-white w-6 h-6" />
            <div className="ml-4 flex-1">
              <p className="text-white/80 text-[11px] font-semibold">Current Selection</p>
              <h2 className="text-white font-bold text-[16px]">Grade 10 - Section A</h2>
            </div>
            <ChevronDown className="text-white w-5 h-5" />
          </div>

        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="max-w-4xl mx-auto px-6 mt-6 w-full flex-1">
        
        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatBox title="Total" value={students.length} color="text-[#4f46e5]" />
          <StatBox title="Present" value={presentCount} color="text-green-500" />
          <StatBox title="Absent" value={absentCount} color="text-red-500" />
        </div>

        {/* CALENDAR */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-900 font-bold text-[16px]">
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <button 
            onClick={() => alert("Opening Date Picker...")}
            className="flex items-center gap-1.5 text-[#4f46e5] text-sm font-bold bg-indigo-50 px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition">
            <CalendarIcon className="w-4 h-4" /> Change Date
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide mb-6">
          <DayBox day="Today" date={new Date().getDate()} active={true} />
        </div>

        {/* LIST HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-900 font-bold text-[18px]">Student List</h3>
          <button 
            onClick={markAllPresent}
            className="bg-indigo-50 text-[#4f46e5] flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-100 transition"
          >
            <Check className="w-4 h-4" /> Mark All Present
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-3">
          {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#4f46e5]" /></div>
          ) : students.map((s, idx) => (
            <StudentRow 
              key={s._id}
              id={s._id}
              init={s.userId?.name?.split(' ').map(n=>n[0]).join('') || "ST"} 
              name={s.userId?.name || "Student"} 
              roll={s.rollNumber || "0" + (idx+1)} 
              status={attendance[s._id]} 
              onMark={handleMark}
            />
          ))}
        </div>

      </div>

      {/* FIXED BOTTOM FLOATING BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 py-5 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-50">
        <div className="max-w-4xl mx-auto flex justify-end px-2">
          <button 
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-[#4f46e5] text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {submitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            Submit Attendance
          </button>
        </div>
      </div>

    </div>
  );
}

function StatBox({ title, value, color }) {
  return (
    <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm text-left">
      <p className={`text-[11px] font-bold ${color}`}>{title}</p>
      <h3 className={`text-[22px] font-bold mt-1 ${color}`}>{value}</h3>
    </div>
  );
}

function DayBox({ day, date, active }) {
  return (
    <div className={`shrink-0 px-4 py-3 rounded-xl border ${active ? 'bg-indigo-50 border-[#4f46e5]' : 'bg-white border-gray-200'} text-center w-[100px]`}>
      <p className={`text-[12px] ${active ? 'text-[#4f46e5]' : 'text-gray-400'}`}>{day}</p>
      <p className={`text-[18px] font-bold mt-0.5 ${active ? 'text-[#4f46e5]' : 'text-gray-900'}`}>{date}</p>
    </div>
  );
}

function StudentRow({ id, init, name, roll, status, onMark }) {
  return (
    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center transition hover:shadow-md">
      <div className="w-12 h-12 rounded-full border border-indigo-100 text-[#4f46e5] font-bold text-[15px] flex items-center justify-center bg-indigo-50/50">
        {init}
      </div>
      
      <div className="ml-4 flex-1">
        <h4 className="font-bold text-gray-900 text-[15px]">{name}</h4>
        <p className="text-gray-400 text-[12px] mt-0.5">Roll No: {roll}</p>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => onMark(id, 'present')}
          className={`p-1.5 rounded-full flex items-center justify-center transition
          ${status === 'present' ? 'bg-green-100 text-green-600' : 'text-gray-300 hover:text-green-500 hover:bg-green-50'}`}>
          <CheckCircle2 className="w-7 h-7" />
        </button>
        <button 
          onClick={() => onMark(id, 'absent')}
          className={`p-1.5 rounded-full flex items-center justify-center transition
          ${status === 'absent' ? 'bg-red-100 text-red-600' : 'text-gray-300 hover:text-red-500 hover:bg-red-50'}`}>
          <X className="w-7 h-7 bg-current text-white rounded-full p-[3px] border-2 border-transparent" />
        </button>
      </div>
    </div>
  );
}