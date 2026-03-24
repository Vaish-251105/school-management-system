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
  Plus,
  History,
  ShieldAlert
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Attendance() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); 
  const [history, setHistory] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSuccess, setShowSuccess] = useState(false);

  const userRole = user?.role?.toLowerCase();
  const isStudent = userRole === 'student';

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedClass && !isStudent) {
      fetchStudentsByClass();
    }
  }, [selectedClass, isStudent]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      if (isStudent) {
        const response = await api.get("/attendance");
        setHistory(Array.isArray(response.data) ? response.data : []);
      } else {
        const classRes = await api.get("/classes");
        const classList = Array.isArray(classRes.data) ? classRes.data : [];
        setClasses(classList);
        if (classList.length > 0) {
          setSelectedClass(classList[0].name || classList[0]);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsByClass = async () => {
    try {
      setLoading(true);
      const response = await api.get("/students");
      const list = Array.isArray(response.data) ? response.data : (response.data.students || []);
      
      // Filter students by selected class (simulated client-side for now)
      const filtered = list.filter(s => (s.class || s.className || "").toString() === selectedClass || selectedClass === "");
      
      setStudents(filtered);
      
      const initial = {};
      filtered.forEach(s => { initial[s._id] = 'present'; });
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
      await api.post("/attendance/bulk", { attendanceData, date: selectedDate, className: selectedClass });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      alert("Error saving attendance.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa]">
       <Loader2 className="w-12 h-12 animate-spin text-[#4f46e5] mb-6" />
       <p className="text-gray-400 font-black italic tracking-widest uppercase">Fetching Records...</p>
     </div>
  );

  return (
    <div className="bg-[#fafafa] min-h-screen pb-40 font-sans transition-all">
      
      {/* SUCCESS NOTIFICATION */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-white border border-emerald-100 shadow-2xl p-8 rounded-[40px] flex items-center gap-6 animate-in slide-in-from-top duration-700 w-full max-w-sm">
           <div className="bg-emerald-500 p-4 rounded-[22px] shadow-lg shadow-emerald-500/20 text-white">
             <CheckCircle className="w-8 h-8" />
           </div>
           <div>
              <h4 className="font-black text-black text-xl tracking-tight">Saved</h4>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Status for {selectedDate} logged.</p>
           </div>
        </div>
      )}

      {/* HEADER AREA */}
      <div className="bg-[#1e1b4b] px-8 pt-12 pb-14 rounded-b-[60px] shadow-2xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center text-white text-center md:text-left">
          <div className="flex gap-6 items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="bg-white/10 p-3.5 rounded-[22px] border border-white/5 hover:bg-white/20 transition shadow-2xl backdrop-blur-md active:scale-95">
              <ChevronLeft className="w-7 h-7 text-white" />
            </button>
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-1">{isStudent ? 'Academic Record' : 'Student Roster'}</p>
              <h1 className="text-white text-[32px] font-black leading-tight uppercase tracking-tight">Attendance</h1>
            </div>
          </div>
        </div>

        {!isStudent && (
          <div className="max-w-5xl mx-auto mt-10 relative z-10">
            <div className="flex flex-wrap gap-4">
               {classes.map((c, i) => (
                  <button 
                    key={i}
                    onClick={() => setSelectedClass(c.name || c)}
                    className={`px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${
                      selectedClass === (c.name || c) 
                      ? "bg-white text-[#4f46e5] shadow-2xl scale-105" 
                      : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                     {c.name || c}
                  </button>
               ))}
               {classes.length === 0 && (
                  <div className="text-white/60 font-bold uppercase text-[10px] tracking-widest p-4 border border-white/10 rounded-3xl">No classes found in backend</div>
               )}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-12 w-full flex-1">
        
        {isStudent ? (
          <div className="animate-in fade-in zoom-in">
             <div className="flex items-center gap-4 mb-10">
                <History className="w-8 h-8 text-[#4f46e5]" />
                <h3 className="text-black font-black text-2xl uppercase tracking-tight">Your Session History</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {history.length > 0 ? history.map((h, i) => (
                   <div key={i} className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-2xl transition-all">
                      <div className="flex items-center gap-6">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black ${
                            h.status === 'present' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
                         }`}>
                            {h.status === 'present' ? 'P' : 'A'}
                         </div>
                         <div>
                            <p className="text-black font-black text-lg uppercase">{new Date(h.date).toLocaleDateString('en-IN', {day:'2-digit', month:'short'})}</p>
                            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{new Date(h.date).getFullYear()}</p>
                         </div>
                      </div>
                      <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                         h.status === 'present' ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'
                      }`}>
                         {h.status}
                      </div>
                   </div>
                )) : (
                  <div className="col-span-full p-32 text-center bg-gray-50 border-4 border-dashed border-gray-100 rounded-[50px] flex flex-col items-center">
                    <Activity className="w-16 h-16 text-gray-200 mb-6" />
                    <p className="text-gray-400 font-black italic uppercase text-lg">No logs found</p>
                  </div>
                )}
             </div>
          </div>
        ) : (
          <>
            {/* DATE SELECTOR */}
            <div className="flex justify-between items-center mb-10 overflow-x-auto gap-6 px-2">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#4f46e5] rounded-full animate-pulse shrink-0"></div>
                  <h4 className="text-black font-black text-xs uppercase tracking-widest whitespace-nowrap leading-none">Schedule Filter</h4>
               </div>
               <div className="relative shrink-0">
                <input 
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer z-20"
                />
                <button className="flex items-center gap-3 text-[#4f46e5] text-sm font-black bg-indigo-50 px-8 py-4 rounded-3xl hover:bg-indigo-600 hover:text-white transition whitespace-nowrap">
                  <CalendarDays className="w-5 h-5" /> {new Date(selectedDate).toLocaleDateString()}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
               <h3 className="text-black font-black text-2xl tracking-tight uppercase leading-none">Class Roster</h3>
               <button 
                 onClick={markAllPresent}
                 className="bg-emerald-50 text-emerald-600 flex items-center gap-2.5 px-6 py-2.5 rounded-[20px] text-[11px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition shadow-sm border border-emerald-100 whitespace-nowrap"
               >
                 <CheckCircle className="w-5 h-5" /> Mark All Present
               </button>
            </div>

            <div className="grid gap-6">
              {students.length > 0 ? students.map((s, idx) => (
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
              )) : (
                <div className="p-32 text-center bg-gray-50 border-4 border-dashed border-gray-100 rounded-[50px] flex flex-col items-center">
                   <ShieldAlert className="w-16 h-16 text-gray-200 mb-6" />
                   <p className="text-gray-400 font-black italic uppercase text-lg">No students found for this section</p>
                </div>
              )}
            </div>

            <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-100 p-8 z-[100]">
              <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-6">
                <div className="flex flex-col text-center md:text-left">
                  <span className="text-[10px] font-black text-[#4f46e5] uppercase tracking-widest mb-1">Logging Session For</span>
                  <span className="font-black text-black text-2xl uppercase tracking-tight">{selectedClass || 'No Class Selected'}</span>
                </div>
                <button 
                  onClick={handleSubmit}
                  disabled={submitting || students.length === 0}
                  className="w-full md:w-auto bg-black text-white px-10 py-5 rounded-[30px] font-black flex items-center justify-center gap-4 shadow-3xl hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest disabled:opacity-50">
                  {submitting ? <Loader2 className="animate-spin w-6 h-6" /> : <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
                  Finalize Session
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AttendanceRow({ idx, init, name, roll, status, onMark, id }) {
  return (
    <div className="bg-white p-6 rounded-[45px] border border-gray-100 shadow-sm flex items-center hover:shadow-2xl transition-all duration-300">
      <div className="w-16 h-16 rounded-[24px] bg-indigo-50 text-indigo-600 font-black text-[18px] flex items-center justify-center border-4 border-white shadow-xl">
        {init}
      </div>
      <div className="ml-8 flex-1">
        <h4 className="font-black text-black text-xl tracking-tight uppercase leading-tight">{name}</h4>
        <div className="bg-indigo-50 px-3 py-1 rounded-xl w-fit mt-1.5">
           <p className="text-[#4f46e5] text-[10px] font-black uppercase tracking-widest italic">Roll: {roll}</p>
        </div>
      </div>
      <div className="flex bg-gray-50 p-2 rounded-[28px] border border-gray-100 ml-4">
        <button 
          onClick={() => onMark(id, 'present')}
          className={`px-6 py-3 rounded-[22px] font-black text-[13px] transition-all duration-300 uppercase
          ${status === 'present' ? 'bg-emerald-500 text-white shadow-xl' : 'text-gray-300'}`}>
          P
        </button>
        <button 
          onClick={() => onMark(id, 'absent')}
          className={`px-6 py-3 rounded-[22px] font-black text-[13px] transition-all duration-300 uppercase
          ${status === 'absent' ? 'bg-rose-500 text-white shadow-xl' : 'text-gray-300'}`}>
          A
        </button>
      </div>
    </div>
  );
}