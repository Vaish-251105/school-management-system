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
  MoreVertical,
  CalendarDays,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Attendance() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: 'present' | 'absent' }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedClass, setSelectedClass] = useState("Grade 10 - Section A");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [selectedClass]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/students");
      const data = response.data;
      const studentList = Array.isArray(data) ? data : (data.students || []);
      setStudents(studentList);
      
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
      const attendanceData = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        status
      }));

      await api.post("/attendance/bulk", { 
        attendanceData, 
        date: selectedDate 
      });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Attendance submission error:", err);
      alert("Error submitting attendance. " + (err.response?.data?.message || ""));
    } finally {
      setSubmitting(false);
    }
  };

  const presentCount = Object.values(attendance).filter(v => v === 'present').length;
  const absentCount = Object.values(attendance).filter(v => v === 'absent').length;

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans flex flex-col pb-36 text-gray-900 relative">
      
      {/* SUCCESS NOTIFICATION */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-white border border-green-100 shadow-2xl p-6 rounded-[32px] flex items-center gap-4 animate-in slide-in-from-top duration-300">
           <div className="bg-green-100 p-3 rounded-2xl">
             <CheckCircle className="text-green-600 w-8 h-8" />
           </div>
           <div>
             <h4 className="font-bold text-gray-900">Successfully Recorded</h4>
             <p className="text-gray-500 text-sm italic">Institutional records updated for {selectedDate}</p>
           </div>
        </div>
      )}

      {/* HEADER AREA */}
      <div className="bg-gradient-to-br from-[#4338ca] to-[#4f46e5] px-6 pt-12 pb-8 rounded-b-[40px] shadow-lg shrink-0">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/10 p-2 rounded-full transition">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-white text-lg font-bold">Smart Attendance</h1>
            <div className="flex gap-2">
              <button onClick={() => navigate('/notifications')} className="text-white p-2 hover:bg-white/10 rounded-full transition relative">
                <Bell className="w-5 h-5" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full border border-[#4840d6]"></div>
              </button>
              <button 
                onClick={() => alert("Filter Options: \n• By Roll No\n• By Name\n• By Status")}
                className="text-white p-2 hover:bg-white/10 rounded-full transition">
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div 
            onClick={() => {
              const classes = ["Grade 10-A", "Grade 11-B", "Grade 12-C"];
              const next = classes[(classes.indexOf(selectedClass.replace('Section ', '')) + 1) % classes.length];
              setSelectedClass(next.replace('Grade ', 'Grade ') + " - Section A");
            }}
            className="flex items-center bg-white/15 border border-white/20 rounded-2xl px-5 py-4 shadow-inner cursor-pointer hover:bg-white/20 transition group">
            <GraduationCap className="text-white w-6 h-6 group-hover:scale-110 transition" />
            <div className="ml-4 flex-1">
              <p className="text-white/80 text-[10px] font-bold tracking-widest uppercase">Class Selector</p>
              <h2 className="text-white font-bold text-[16px]">{selectedClass}</h2>
            </div>
            <ChevronDown className="text-white w-5 h-5" />
          </div>

        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="max-w-4xl mx-auto px-6 mt-6 w-full flex-1">
        
        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatBox title="STRENGTH" value={students.length} color="text-[#4f46e5]" />
          <StatBox title="PRESENT" value={presentCount} color="text-emerald-500" />
          <StatBox title="ABSENT" value={absentCount} color="text-rose-500" />
        </div>

        {/* CALENDAR */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-gray-900 font-bold text-[18px]">
            Faculty Ledger
          </h3>
          <div className="relative">
            <input 
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <button 
              className="flex items-center gap-1.5 text-[#4f46e5] text-sm font-bold bg-indigo-50 px-4 py-2 rounded-2xl hover:bg-indigo-100 transition whitespace-nowrap">
              <CalendarDays className="w-4 h-4" /> {new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </button>
          </div>
        </div>

        {/* LIST HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-900 font-bold text-[16px]">Attendance Sheet</h3>
          <button 
            onClick={markAllPresent}
            className="bg-indigo-50 text-[#4f46e5] flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-indigo-100 transition"
          >
            <Check className="w-4 h-4" /> Mark All Present
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#4f46e5] w-8 h-8" /></div>
          ) : students.length > 0 ? (
            students.map((s, idx) => (
              <StudentRow 
                key={s._id}
                id={s._id}
                init={s.userId?.name?.split(' ').map(n=>n[0]).join('') || "ST"} 
                name={s.userId?.name || "Student"} 
                roll={s.rollNumber || "10" + (idx+1).toString().padStart(2,'0')} 
                status={attendance[s._id]} 
                onMark={handleMark}
              />
            ))
          ) : (
            <div className="p-12 text-center bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-100 text-gray-400">
               No student records found for this class.
            </div>
          )}
        </div>

      </div>

      {/* FIXED BOTTOM FLOATING BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-100 p-6 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Selected Unit</span>
            <span className="font-bold text-gray-900">{selectedClass}</span>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={submitting || students.length === 0}
            className="bg-[#4f46e5] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 transition disabled:opacity-50 disabled:shadow-none"
          >
            {submitting ? <Loader2 className="animate-spin w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            Confirm Log
          </button>
        </div>
      </div>

    </div>
  );
}

function StatBox({ title, value, color }) {
  return (
    <div className="bg-white border border-gray-50 p-5 rounded-[24px] shadow-sm text-center">
      <p className={`text-[10px] font-bold tracking-widest mb-1 ${color} opacity-60 uppercase`}>{title}</p>
      <h3 className={`text-[24px] font-bold leading-none ${color}`}>{value}</h3>
    </div>
  );
}

function StudentRow({ id, init, name, roll, status, onMark }) {
  return (
    <div className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm flex items-center transition hover:shadow-md group">
      <div className="w-12 h-12 rounded-2xl border border-indigo-50 text-[#4f46e5] font-bold text-[15px] flex items-center justify-center bg-indigo-50 group-hover:scale-110 transition-transform">
        {init}
      </div>
      
      <div className="ml-5 flex-1">
        <h4 className="font-bold text-gray-900 text-[15px] group-hover:text-[#4f46e5] transition-colors">{name}</h4>
        <p className="text-gray-400 text-[11px] font-medium tracking-wide">ID: {roll}</p>
      </div>

      <div className="flex gap-3">
        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
          <button 
            onClick={() => onMark(id, 'present')}
            className={`px-4 py-2 rounded-xl flex items-center justify-center transition font-bold text-[11px]
            ${status === 'present' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-emerald-500 hover:bg-emerald-50'}`}>
            P
          </button>
          <button 
            onClick={() => onMark(id, 'absent')}
            className={`px-4 py-2 rounded-xl flex items-center justify-center transition font-bold text-[11px]
            ${status === 'absent' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-rose-500 hover:bg-rose-50'}`}>
            A
          </button>
        </div>
      </div>
    </div>
  );
}