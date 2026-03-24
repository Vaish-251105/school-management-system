import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  UserCheck, 
  UserX, 
  CalendarDays, 
  Loader2, 
  CheckCircle,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function StaffAttendance() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [staffRes, logsRes] = await Promise.all([
        api.get("/teachers/staff/all"),
        api.get(`/staff-attendance?date=${selectedDate}`)
      ]);
      
      setStaff(staffRes.data);
      
      const initial = {};
      staffRes.data.forEach(s => {
        const log = logsRes.data.find(l => l.staffId._id === s.userId._id);
        initial[s.userId._id] = log ? log.status : 'Present';
      });
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

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const attendanceData = Object.entries(attendance).map(([staffId, status]) => ({
        staffId,
        status
      }));
      await api.post("/staff-attendance", { attendanceData, date: selectedDate });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      alert("Error saving attendance");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fafafa] min-h-screen pb-40 font-sans text-black">
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-white border border-emerald-100 shadow-2xl p-8 rounded-[40px] flex items-center gap-6 animate-in slide-in-from-top duration-700 w-full max-w-sm">
           <div className="bg-emerald-500 p-4 rounded-[22px] text-white"><CheckCircle className="w-8 h-8" /></div>
           <div>
              <h4 className="font-black text-xl tracking-tight leading-none">Saved Successfully</h4>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2">Staff attendance for {selectedDate}</p>
           </div>
        </div>
      )}

      <div className="bg-[#1e1b4b] px-8 pt-12 pb-14 rounded-b-[60px] shadow-2xl text-white relative">
        <div className="max-w-5xl mx-auto flex justify-between items-center relative z-10">
          <div className="flex gap-6 items-center">
            <button onClick={() => navigate(-1)} className="bg-white/10 p-4 rounded-[22px] hover:bg-white/20 transition backdrop-blur-md">
              <ChevronLeft className="w-7 h-7" />
            </button>
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-1">Admin Control</p>
              <h1 className="text-[32px] font-black uppercase tracking-tight">Staff Attendance</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-12">
        <div className="flex justify-between items-center mb-10 gap-6">
           <h4 className="font-black text-black text-xs uppercase tracking-widest leading-none">Select Date:</h4>
           <div className="relative group shrink-0">
             <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
             <button className="flex items-center gap-3 text-[#4f46e5] text-sm font-black bg-indigo-50 px-8 py-4 rounded-3xl hover:bg-indigo-600 hover:text-white transition">
               <CalendarDays className="w-5 h-5" /> {new Date(selectedDate).toLocaleDateString()}
             </button>
           </div>
        </div>

        <div className="grid gap-6">
          {loading ? (
             <div className="flex justify-center py-24"><Loader2 className="animate-spin text-[#4f46e5] w-12 h-12" /></div>
          ) : staff.length > 0 ? (
            staff.map((s, idx) => (
              <div key={s._id} className="bg-white p-6 rounded-[45px] border border-gray-100 shadow-sm flex items-center hover:shadow-2xl transition-all group">
                <div className="w-16 h-16 rounded-[24px] bg-[#1e1b4b] text-white font-black text-[18px] flex items-center justify-center border-4 border-white shadow-xl">
                  {s.userId?.name?.[0] || "S"}
                </div>
                <div className="ml-8 flex-1">
                  <h4 className="font-black text-xl uppercase tracking-tight">{s.userId?.name}</h4>
                  <p className="text-indigo-600 text-[10px] font-black uppercase tracking-widest italic">{s.designation}</p>
                </div>
                <div className="flex bg-gray-50 p-2 rounded-[28px] border border-gray-100">
                  <button onClick={() => handleMark(s.userId._id, 'Present')} className={`px-6 py-3 rounded-[22px] font-black text-[13px] transition-all uppercase ${attendance[s.userId._id] === 'Present' ? 'bg-emerald-500 text-white shadow-xl' : 'text-gray-300 hover:text-emerald-500'}`}>P</button>
                  <button onClick={() => handleMark(s.userId._id, 'Absent')} className={`px-6 py-3 rounded-[22px] font-black text-[13px] transition-all uppercase ${attendance[s.userId._id] === 'Absent' ? 'bg-rose-500 text-white shadow-xl' : 'text-gray-300 hover:text-rose-500'}`}>A</button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-32 text-center bg-gray-50 border-4 border-dashed border-gray-100 rounded-[50px] flex flex-col items-center">
               <Activity className="w-16 h-16 text-gray-200 mb-6" />
               <p className="text-gray-400 font-black italic uppercase text-lg leading-none">No staff found</p>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-100 p-8 z-[100]">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#4f46e5] uppercase tracking-widest mb-1">Action Status</span>
            <span className="font-black text-black text-2xl uppercase tracking-tight">Save Records</span>
          </div>
          <button onClick={handleSubmit} disabled={submitting || staff.length === 0} className="bg-black text-white px-10 py-5 rounded-[30px] font-black flex items-center gap-4 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest disabled:opacity-50">
            {submitting ? <Loader2 className="animate-spin w-6 h-6" /> : <UserCheck className="w-6 h-6 text-emerald-400" />}
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
}
