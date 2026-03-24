import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Plus, 
  CalendarClock, 
  Loader2, 
  CheckCircle,
  Activity,
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function ExamSchedule() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedClass, setSelectedClass] = useState("10-A");
  const [newExam, setNewExam] = useState({ name: "", subject: "", examDate: new Date().toISOString().split('T')[0], totalMarks: 100 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExams();
  }, [selectedClass]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/exams/schedule?className=${selectedClass}`);
      setExams(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newExam.name || !newExam.subject) return;
    setSubmitting(true);
    try {
      await api.post("/exams/schedule", { ...newExam, class: selectedClass });
      setShowAdd(false);
      setNewExam({ name: "", subject: "", examDate: new Date().toISOString().split('T')[0], totalMarks: 100 });
      fetchExams();
    } catch (err) {
      alert("Error creating exam");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fafafa] min-h-screen pb-40 font-sans text-black animate-in fade-in transition-all">
      <div className="bg-[#1e1b4b] px-8 pt-12 pb-14 rounded-b-[60px] shadow-2xl text-white relative">
        <div className="max-w-5xl mx-auto flex justify-between items-center relative z-10">
          <div className="flex gap-6 items-center">
            <button onClick={() => navigate(-1)} className="bg-white/10 p-4 rounded-[22px] hover:bg-white/20 transition backdrop-blur-md">
              <ChevronLeft className="w-7 h-7" />
            </button>
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-1">Teacher Control</p>
              <h1 className="text-[32px] font-black uppercase tracking-tight">Exam Scheduling</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-12">
        <div className="flex justify-between items-center mb-10 gap-6 overflow-x-auto">
           <div className="flex items-center gap-4">
              <h4 className="font-black text-black text-xs uppercase tracking-widest leading-none">Class:</h4>
              <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="bg-white p-3 rounded-xl border border-gray-100 font-bold text-sm shadow-sm">
                <option value="10-A">10-A</option>
                <option value="10-B">10-B</option>
                <option value="9-A">9-A</option>
                <option value="9-B">9-B</option>
              </select>
           </div>
           <button onClick={() => setShowAdd(true)} className="bg-black text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:indigo-600 transition shadow-xl">
             <Plus className="w-4 h-4" /> Schedule New
           </button>
        </div>

        <div className="grid gap-6">
          {loading ? (
             <div className="flex justify-center py-24"><Loader2 className="animate-spin text-[#4f46e5] w-12 h-12" /></div>
          ) : exams.length > 0 ? (
            exams.map((e, idx) => (
              <div key={e._id} className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm flex items-center hover:shadow-2xl transition-all group">
                <div className="w-16 h-16 rounded-[24px] bg-amber-50 text-amber-500 font-black text-[18px] flex items-center justify-center border-4 border-white shadow-xl">
                  <CalendarClock className="w-8 h-8" />
                </div>
                <div className="ml-8 flex-1">
                  <h4 className="font-black text-xl uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{e.name}</h4>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">{e.subject} • {new Date(e.examDate).toLocaleDateString()}</p>
                </div>
                <div className="bg-emerald-50 px-6 py-2 rounded-xl text-emerald-600 font-black text-[10px] uppercase tracking-widest border border-emerald-100">Scheduled</div>
              </div>
            ))
          ) : (
            <div className="p-32 text-center bg-gray-50 border-4 border-dashed border-gray-100 rounded-[50px] flex flex-col items-center">
               <Activity className="w-16 h-16 text-gray-200 mb-6" />
               <p className="text-gray-400 font-black italic uppercase text-lg leading-none">No exams scheduled for {selectedClass}</p>
            </div>
          )}
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in transition-all">
          <div className="bg-white w-full max-w-lg rounded-[60px] p-12 shadow-3xl border border-white/20 text-black">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Schedule Exam</h2>
            <div className="space-y-6">
              <input type="text" placeholder="Exam Name (e.g. Midterm)" value={newExam.name} onChange={e => setNewExam({...newExam, name: e.target.value})} className="w-full bg-gray-50 border-0 p-5 rounded-3xl font-black text-sm uppercase" />
              <input type="text" placeholder="Subject" value={newExam.subject} onChange={e => setNewExam({...newExam, subject: e.target.value})} className="w-full bg-gray-50 border-0 p-5 rounded-3xl font-black text-sm uppercase" />
              <div className="flex gap-6">
                <input type="date" value={newExam.examDate} onChange={e => setNewExam({...newExam, examDate: e.target.value})} className="flex-1 bg-gray-50 border-0 p-5 rounded-3xl font-black text-sm uppercase" />
                <input type="number" placeholder="Marks" value={newExam.totalMarks} onChange={e => setNewExam({...newExam, totalMarks: e.target.value})} className="w-32 bg-gray-50 border-0 p-5 rounded-3xl font-black text-sm text-center font-black" />
              </div>
            </div>
            <div className="flex gap-4 mt-12 font-black uppercase tracking-widest text-xs">
              <button onClick={() => setShowAdd(false)} className="flex-1 bg-gray-100 p-6 rounded-[30px] hover:bg-gray-200 transition-all">Cancel</button>
              <button onClick={handleCreate} disabled={submitting} className="flex-1 bg-indigo-600 text-white p-6 rounded-[30px] hover:bg-black transition-all shadow-xl shadow-indigo-500/10">
                 {submitting ? "Scheduling..." : "Create Exam"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
