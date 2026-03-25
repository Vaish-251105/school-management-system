import React, { useState, useEffect } from "react";
import { 
  Bell,
  GraduationCap,
  Download,
  Clock,
  FileText,
  Megaphone,
  AlertTriangle,
  Check,
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  X,
  Loader2,
  BookMarked,
  Activity,
  Globe,
  CalendarDays,
  Target,
  UploadCloud,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Homework() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [homeworks, setHomeworks] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [newHw, setNewHw] = useState({ title: '', subject: '', dueDate: '', description: '', class: '' });
  const [submission, setSubmission] = useState({ content: '', file: null });

  const userRole = user?.role?.toLowerCase();
  const isTeacher = userRole === 'teacher' || userRole === 'admin';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hwRes, noticeRes] = await Promise.all([
        api.get("/homework"),
        api.get("/notices")
      ]);
      setHomeworks(Array.isArray(hwRes.data) ? hwRes.data : []);
      setNotices(Array.isArray(noticeRes.data) ? noticeRes.data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHomework = async (e) => {
    e.preventDefault();
    try {
      await api.post("/homework", { ...newHw });
      setShowAddForm(false);
      setNewHw({ title: '', subject: '', dueDate: '', description: '', class: '' });
      fetchData();
    } catch (err) { 
      alert(err.response?.data?.message || "Error adding homework. Please try again."); 
    }
  };

  const handleHWSubmission = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Simulate submission to backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccessMsg("Assignment successfully uploaded to academic vault.");
      setTimeout(() => {
        setSuccessMsg("");
        setShowSubmitModal(null);
        setSubmission({ content: '', file: null });
      }, 3000);
    } catch (err) {
      alert("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteHomework = async (id) => {
    if (!window.confirm("Verify: Permanently delete this assignment?")) return;
    try {
      await api.delete(`/homework/${id}`);
      fetchData();
    } catch (err) { alert("Delete failed"); }
  };

  return (
    <div className="bg-[#fafafa] min-h-screen pb-40 font-sans transition-all text-black">
      
      {/* SUCCESS POPUP */}
      {successMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] bg-white border border-emerald-100 shadow-3xl p-8 rounded-[40px] flex items-center gap-6 animate-in slide-in-from-top duration-700 w-full max-w-sm">
           <div className="bg-emerald-500 p-4 rounded-[22px] shadow-lg shadow-emerald-500/20 text-white">
             <CheckCircle2 className="w-8 h-8" />
           </div>
           <div>
              <h4 className="font-black text-black text-xl tracking-tight leading-none uppercase">Synced</h4>
              <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mt-2">{successMsg}</p>
           </div>
        </div>
      )}

      {/* HEADER AREA */}
      <div className="bg-[#1e1b4b] px-8 pt-12 pb-14 rounded-b-[60px] shadow-2xl relative overflow-hidden shrinkage-0">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center text-white text-center md:text-left">
          <div className="flex gap-6 items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="bg-white/10 p-3.5 rounded-[22px] border border-white/5 hover:bg-white/20 transition shadow-2xl backdrop-blur-md active:scale-95">
              <ChevronLeft className="w-7 h-7 text-white" />
            </button>
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-1">Academic Repository</p>
              <h1 className="text-white text-[32px] font-black leading-tight uppercase tracking-tight">Homework</h1>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-6 md:mt-0">
             <div className="relative">
                <button onClick={() => navigate('/notifications')} className="bg-white/10 p-4 rounded-3xl border border-white/5 hover:bg-white/20 transition group shadow-2xl backdrop-blur-md">
                   <Bell className="w-7 h-7 text-white" />
                </button>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-12 w-full flex-1">
        
        {/* ASSIGNMENTS */}
        <div className="flex justify-between items-end mb-8 px-2">
           <div>
              <h3 className="text-black font-black text-2xl tracking-tight uppercase leading-none">Assignments</h3>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">{homeworks.length} Active Tasks</p>
           </div>
           {isTeacher && (
             <button 
               onClick={() => setShowAddForm(true)}
               className="bg-[#4f46e5] text-white px-8 py-4 rounded-[22px] font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all outline-none border border-white/10">
               <Plus className="w-5 h-5 text-indigo-200" /> Provision HW
             </button>
           )}
        </div>

        <div className="grid gap-8 mb-16">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="animate-spin text-[#4f46e5] w-12 h-12 mb-6" />
                <p className="text-gray-400 font-black italic tracking-widest uppercase">Fetching Records...</p>
             </div>
          ) : homeworks.length > 0 ? (
            homeworks.map((hw, idx) => (
              <HomeworkCard 
                key={hw._id || idx}
                idx={idx}
                sub={hw.subject} 
                classNameLabel={hw.class || 'General'}
                due={new Date(hw.dueDate).toLocaleDateString()}
                title={hw.title} 
                desc={hw.description}
                teacher={hw.teacherId?.name || "Faculty"} 
                onDelete={isTeacher ? () => handleDeleteHomework(hw._id) : null}
                onDownload={() => alert("Downloading encrypted assignment binary...")}
                onSubmit={!isTeacher ? () => setShowSubmitModal(hw) : null}
              />
            ))
          ) : (
            <div className="p-32 text-center bg-gray-50 border-4 border-dashed border-gray-100 rounded-[50px] flex flex-col items-center animate-in zoom-in duration-500 text-black">
               <BookMarked className="w-16 h-16 text-gray-200 mb-6" />
               <p className="text-gray-400 font-black italic uppercase text-lg">No assignments registered</p>
            </div>
          )}
        </div>
      </div>

      {/* ADD MODAL */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-6 transition-all animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[50px] p-12 shadow-3xl relative animate-in zoom-in duration-300 overflow-hidden text-black">
            <button onClick={() => setShowAddForm(false)} className="absolute top-10 right-10 bg-gray-50 p-3 rounded-2xl hover:bg-black hover:text-white transition active:scale-95 shadow-sm border border-gray-100">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-black text-black uppercase mb-10 tracking-tight">Provision Assignment</h2>
            <form onSubmit={handleAddHomework} className="space-y-6">
              <div className="space-y-2 px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600 ml-1">Title</label>
                <input required autoFocus value={newHw.title} onChange={e=>setNewHw({...newHw, title: e.target.value})} type="text" className="w-full px-8 py-4 bg-gray-50 border border-gray-100 rounded-[25px] focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none text-lg font-bold" placeholder="e.g. Physics Review" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2 px-1">
                   <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600 ml-1">Subject</label>
                   <input required value={newHw.subject} onChange={e=>setNewHw({...newHw, subject: e.target.value})} type="text" className="w-full px-8 py-4 bg-gray-50 border border-gray-100 rounded-[25px] outline-none font-bold" placeholder="Science" />
                 </div>
                 <div className="space-y-2 px-1">
                   <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600 ml-1">Target Class</label>
                   <input required value={newHw.class} onChange={e=>setNewHw({...newHw, class: e.target.value})} type="text" className="w-full px-8 py-4 bg-gray-50 border border-gray-100 rounded-[25px] outline-none font-bold" placeholder="10-A" />
                 </div>
              </div>
              <div className="space-y-2 px-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600 ml-1">Submission Deadline</label>
                 <input required value={newHw.dueDate} onChange={e=>setNewHw({...newHw, dueDate: e.target.value})} type="date" className="w-full px-8 py-4 bg-gray-50 border border-gray-100 rounded-[25px] outline-none font-bold" />
              </div>
              <div className="space-y-2 px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600 ml-1">Detailed Description</label>
                <textarea required value={newHw.description} onChange={e=>setNewHw({...newHw, description: e.target.value})} className="w-full px-8 py-4 bg-gray-50 border border-gray-100 rounded-[25px] outline-none h-32 resize-none font-bold placeholder:italic" placeholder="Specify requirements..."></textarea>
              </div>
              <button type="submit" className="w-full bg-[#1e1b4b] text-white py-6 rounded-[30px] font-black text-xl shadow-2xl hover:bg-black transition-all uppercase tracking-widest mt-4">
                Verify & Save
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUBMIT MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-6 animate-in fade-in overflow-y-auto">
           <div className="bg-white w-full max-w-lg rounded-[50px] p-12 shadow-3xl text-black relative animate-in zoom-in duration-300">
              <button onClick={() => setShowSubmitModal(null)} className="absolute top-10 right-10 bg-gray-50 p-3 rounded-2xl hover:bg-black hover:text-white transition active:scale-95 border border-gray-100">
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-6 mb-10">
                 <div className="bg-indigo-50 p-5 rounded-3xl border border-indigo-100 text-indigo-600">
                    <UploadCloud className="w-8 h-8" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight leading-none">Submit Response</h2>
                    <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mt-2 truncate max-w-[200px]">{showSubmitModal.title}</p>
                 </div>
              </div>

              <form onSubmit={handleHWSubmission} className="space-y-8">
                 <div className="space-y-2 px-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600 ml-1">Work Description / Source Code</label>
                    <textarea 
                      required
                      value={submission.content}
                      onChange={e=>setSubmission({...submission, content: e.target.value})}
                      className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-[35px] outline-none h-48 font-bold text-sm resize-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all" 
                      placeholder="Input text response or URLs here..."
                    />
                 </div>
                 
                 <div className="bg-gray-50 border border-gray-100 border-dashed border-2 rounded-[35px] p-8 text-center group hover:border-[#4f46e5] transition-colors cursor-pointer relative overflow-hidden">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-3 group-hover:text-indigo-400 transition-colors" />
                    <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Attach Digital binary</p>
                    <p className="text-gray-300 font-bold text-[8px] mt-1 italic uppercase">PDF, ZIP, DOCX (Max 10MB)</p>
                 </div>

                 <button 
                   disabled={submitting}
                   type="submit" 
                   className="w-full bg-black text-white py-6 rounded-[30px] font-black text-lg shadow-2xl hover:bg-[#1e1b4b] transition-all uppercase tracking-widest flex items-center justify-center gap-4">
                    {submitting ? <Loader2 className="w-7 h-7 animate-spin" /> : <ShieldCheck className="w-7 h-7 text-emerald-400" />}
                    {submitting ? "Uploading Node..." : "Transmit to Faculty"}
                 </button>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}

function HomeworkCard({ idx, sub, classNameLabel, due, title, desc, teacher, onDelete, onDownload, onSubmit }) {
  return (
    <div 
      className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative group animate-in slide-in-from-bottom text-black"
      style={{ animationDelay: `${idx * 80}ms` }}
    >
      {onDelete && (
        <button onClick={onDelete} className="absolute top-10 right-10 p-3.5 bg-rose-50 text-rose-300 hover:text-rose-600 border border-rose-50 rounded-2xl transition opacity-0 group-hover:opacity-100 active:scale-90 shadow-sm">
          <Trash2 className="w-6 h-6" />
        </button>
      )}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-3">
          <span className="text-[#4f46e5] font-black text-[10px] bg-indigo-50 px-4 py-1.5 rounded-xl uppercase tracking-widest border border-indigo-100 flex items-center gap-2">
             <BookMarked className="w-3 h-3" /> {sub}
          </span>
          <span className="text-emerald-600 font-black text-[10px] bg-emerald-50 px-4 py-1.5 rounded-xl uppercase tracking-widest border border-emerald-100">{classNameLabel}</span>
        </div>
        <div className="flex items-center gap-2.5 text-gray-400 font-black text-[10px] uppercase tracking-widest tabular-nums italic">
           <Clock className="w-4 h-4 text-emerald-400" /> {due}
        </div>
      </div>
      <h4 className="font-black text-black text-[25px] tracking-tight leading-tight uppercase group-hover:text-indigo-600 transition-colors">{title}</h4>
      <p className="text-gray-400 font-bold text-[15px] mt-4 leading-relaxed line-clamp-2 italic">{desc}</p>
      
      <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-50 rounded-[22px] flex items-center justify-center border border-indigo-100 shadow-inner group-hover:rotate-6 transition-transform">
             <User className="text-indigo-600 w-7 h-7" />
          </div>
          <div>
             <p className="text-black font-black text-[15px] uppercase leading-none">{teacher}</p>
             <p className="text-gray-400 font-black text-[9px] uppercase tracking-widest mt-1.5">Authorized Faculty</p>
          </div>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
           <button 
             onClick={onDownload}
             className="flex-1 bg-gray-50 p-4 rounded-2xl text-black hover:bg-black hover:text-white transition active:scale-95 border border-gray-100 flex items-center justify-center group/btn shadow-sm">
              <Download className="w-5 h-5 group-hover/btn:animate-bounce" />
           </button>
           {onSubmit && (
             <button 
               onClick={onSubmit}
               className="flex-[3] bg-black text-white px-8 py-4 rounded-[22px] font-black text-[11px] uppercase tracking-[2px] shadow-3xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-3">
               <UploadCloud className="w-4 h-4 text-emerald-400" /> Submit
             </button>
           )}
        </div>
      </div>
    </div>
  );
}

function ShieldCheck({ className }) {
  return <CheckCircle2 className={className} />;
}
