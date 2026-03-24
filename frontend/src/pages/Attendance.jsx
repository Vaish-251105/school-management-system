import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Bell, 
  GraduationCap, 
  ChevronDown, 
  Check, 
  X, 
  CheckCircle2,
  Loader2,
  SlidersHorizontal,
  CalendarDays,
  CheckCircle,
  Activity,
  UserCheck,
  UserX,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Attendance() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); 
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
      const list = Array.isArray(response.data) ? response.data : (response.data.students || []);
      setStudents(list);
      
      const initial = {};
      list.forEach(s => { initial[s._id] = 'present'; });
      setAttendance(initial);
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
      await api.post("/attendance/bulk", { attendanceData, date: selectedDate });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      alert("Error saving attendance. Please check network.");
    } finally {
      setSubmitting(false);
    }
  };

  const presentCount = Object.values(attendance).filter(v => v === 'present').length;
  const absentCount = Object.values(attendance).filter(v => v === 'absent').length;

  return (
    <div className="bg-[#fafafa] min-h-screen pb-40 font-sans animate-in fade-in transition-all">
      
      {/* SUCCESS NOTIFICATION */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-white border border-emerald-100 shadow-2xl p-8 rounded-[40px] flex items-center gap-6 animate-in slide-in-from-top duration-700 w-full max-w-sm">
           <div className="bg-emerald-500 p-4 rounded-[22px] shadow-lg shadow-emerald-500/20 text-white">
             <CheckCircle className="w-8 h-8" />
           </div>
           <div>
              <h4 className="font-black text-black text-xl tracking-tight">Saved Successfully</h4>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Attendance saved for {selectedDate}</p>
           </div>
        </div>
      )}

      {/* HEADER AREA */}
      <div className="bg-[#1e1b4b] px-8 pt-12 pb-14 rounded-b-[60px] shadow-2xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center text-white text-center md:text-left">
          <div className="flex gap-6 items-center animate-in slide-in-from-bottom duration-700">
            <button 
              onClick={() => navigate(-1)} 
              className="bg-white/10 p-3.5 rounded-[22px] border border-white/5 hover:bg-white/20 transition shadow-2xl backdrop-blur-md active:scale-95 group">
              <ChevronLeft className="w-7 h-7 text-white" />
            </button>
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-1">Student Record</p>
              <h1 className="text-white text-[32px] font-black leading-tight uppercase tracking-tight">Attendance</h1>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
             <button className="bg-white/10 p-4 rounded-3xl border border-white/5 hover:bg-white/20 transition group shadow-2xl backdrop-blur-md text-white">
               <Bell className="w-7 h-7" />
             </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-10 relative z-10 animate-in slide-in-from-bottom duration-1000">
           <div 
            onClick={() => {
              const classes = ["Grade 10-A", "Grade 11-B", "Grade 12-C"];
              const next = classes[(classes.indexOf(selectedClass.replace(' - Section A', '').replace('Grade ', 'Grade ')) + 1) % classes.length];
              setSelectedClass(next + " - Section A");
            }}
            className="flex items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-[32px] px-8 py-6 shadow-inner cursor-pointer hover:bg-white transition-all group">
            <div className="bg-white text-[#4f46e5] p-3 rounded-2xl group-hover:rotate-12 transition shadow-xl">
               <GraduationCap className="w-8 h-8" />
            </div>
            <div className="ml-6 flex-1 text-white group-hover:text-black transition">
              <p className="group-hover:text-indigo-600 text-[10px] font-black tracking-widest uppercase mb-1">Select Class</p>
              <h2 className="font-black text-2xl tracking-tight leading-none uppercase">{selectedClass}</h2>
            </div>
            <ChevronDown className="text-white group-hover:text-black w-7 h-7 transition" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-12 w-full flex-1">
        
        {/* STATS ANALYTICS */}
        <div className="grid grid-cols-3 gap-6 mb-12 animate-in fade-in">
           <AttendanceStat label="TOTAL" val={students.length} color="indigo" />
           <AttendanceStat label="PRESENT" val={presentCount} color="emerald" icon={<UserCheck className="w-4 h-4" />} />
           <AttendanceStat label="ABSENT" val={absentCount} color="rose" icon={<UserX className="w-4 h-4" />} />
        </div>

        {/* DATE SELECTOR */}
        <div className="flex justify-between items-center mb-10 overflow-x-auto gap-6 px-2">
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#4f46e5] rounded-full animate-pulse shrink-0"></div>
              <h4 className="text-black font-black text-xs uppercase tracking-widest whitespace-nowrap leading-none">Attendance Date</h4>
           </div>
           <div className="relative group shrink-0">
            <input 
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer z-20"
            />
            <button className="flex items-center gap-3 text-[#4f46e5] text-sm font-black bg-indigo-50 px-8 py-4 rounded-3xl hover:bg-indigo-600 hover:text-white transition group-hover:shadow-2xl active:scale-95 whitespace-nowrap">
              <CalendarDays className="w-5 h-5" /> {new Date(selectedDate).toLocaleDateString()}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
           <h3 className="text-black font-black text-2xl tracking-tight uppercase leading-none">Students List</h3>
           <button 
             onClick={markAllPresent}
             className="bg-emerald-50 text-emerald-600 flex items-center gap-2.5 px-6 py-2.5 rounded-[20px] text-[11px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition shadow-sm border border-emerald-100 whitespace-nowrap"
           >
             <CheckCircle className="w-5 h-5" /> Mark All Present
           </button>
        </div>

        {/* STUDENT ROSTER */}
        <div className="grid gap-6">
          {loading ? (
             <div className="flex justify-center py-24"><Loader2 className="animate-spin text-[#4f46e5] w-12 h-12" /></div>
          ) : students.length > 0 ? (
            students.map((s, idx) => (
              <AttendanceRow 
                key={s._id || idx}
                idx={idx}
                init={s.userId?.name?.split(' ').map(n=>n[0]).join('') || "ST"} 
                name={s.userId?.name || "Student"} 
                roll={s.rollNumber || "ID-10" + (idx+1)} 
                status={attendance[s._id]} 
                onMark={handleMark}
                id={s._id}
              />
            ))
          ) : (
            <div className="p-32 text-center bg-gray-50 border-4 border-dashed border-gray-100 rounded-[50px] flex flex-col items-center">
               <Activity className="w-16 h-16 text-gray-200 mb-6" />
               <p className="text-gray-400 font-black italic uppercase text-lg">No students found</p>
            </div>
          )}
        </div>
      </div>

      {/* SUBMIT BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-100 p-8 z-[100] animate-in slide-in-from-bottom">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-6">
          <div className="flex flex-col text-center md:text-left">
            <span className="text-[10px] font-black text-[#4f46e5] uppercase tracking-widest mb-1">Submitting Attendance For</span>
            <span className="font-black text-black text-2xl uppercase tracking-tight">{selectedClass}</span>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={submitting || students.length === 0}
            className="w-full md:w-auto bg-black text-white px-10 py-5 rounded-[30px] font-black flex items-center justify-center gap-4 shadow-3xl hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest disabled:opacity-50">
            {submitting ? <Loader2 className="animate-spin w-6 h-6" /> : <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
            Save Attendance
          </button>
        </div>
      </div>

    </div>
  );
}

function AttendanceStat({ label, val, color, icon }) {
  return (
    <div className={`bg-white border p-8 rounded-[45px] text-center shadow-lg transition-all duration-300 group hover:-translate-y-2 text-black`}>
      <p className={`text-[10px] font-black tracking-widest mb-4 uppercase text-gray-400`}>{label}</p>
      <div className="flex items-center justify-center gap-3">
         {icon && <div className={`p-1.5 rounded-lg bg-gray-50`}>{icon}</div>}
         <h4 className={`text-3xl font-black leading-none tracking-tight`}>{val}</h4>
      </div>
    </div>
  );
}

function AttendanceRow({ idx, init, name, roll, status, onMark, id }) {
  return (
    <div 
      className="bg-white p-6 rounded-[45px] border border-gray-100 shadow-sm flex items-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group animate-in fade-in"
      style={{ animationDelay: `${idx * 80}ms` }}
    >
      <div className="w-16 h-16 rounded-[24px] bg-[#1e1b4b] text-white font-black text-[18px] flex items-center justify-center border-4 border-white shadow-xl">
        {init}
      </div>
      
      <div className="ml-8 flex-1">
        <h4 className="font-black text-black text-xl tracking-tight uppercase leading-tight">{name}</h4>
        <div className="bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100 w-fit mt-1.5">
           <p className="text-[#4f46e5] text-[10px] font-black uppercase tracking-widest italic">Roll: {roll}</p>
        </div>
      </div>

      <div className="flex bg-gray-50 p-2 rounded-[28px] border border-gray-100 shadow-inner group-hover:bg-white transition-colors duration-300 ml-4">
        <button 
          onClick={() => onMark(id, 'present')}
          className={`px-6 py-3 rounded-[22px] font-black text-[13px] transition-all duration-300 uppercase
          ${status === 'present' ? 'bg-emerald-500 text-white shadow-xl' : 'text-gray-300 hover:text-emerald-500'}`}>
          P
        </button>
        <button 
          onClick={() => onMark(id, 'absent')}
          className={`px-6 py-3 rounded-[22px] font-black text-[13px] transition-all duration-300 uppercase
          ${status === 'absent' ? 'bg-rose-500 text-white shadow-xl' : 'text-gray-300 hover:text-rose-500'}`}>
          A
        </button>
      </div>
    </div>
  );
}