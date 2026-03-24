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
  Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Homework() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [homeworks, setHomeworks] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHw, setNewHw] = useState({ title: '', subject: '', dueDate: '', description: '', class: '' });

  const isTeacher = user.role === 'teacher' || user.role === 'admin';

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
      // Backend requires 'class', 'title', 'subject', 'dueDate', 'description'
      await api.post("/homework", { ...newHw, teacherId: user._id || user.id });
      setShowAddForm(false);
      setNewHw({ title: '', subject: '', dueDate: '', description: '', class: '' });
      fetchData();
    } catch (err) { 
      alert(err.response?.data?.message || "Error adding homework. Please try again."); 
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

      <div className="max-w-5xl mx-auto px-8 mt-12 w-full flex-1 text-black font-sans">
        
        {/* ASSIGNMENTS */}
        <div className="flex justify-between items-end mb-8 px-2">
           <div>
              <h3 className="text-black font-black text-2xl tracking-tight uppercase leading-none">Assignments</h3>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">{homeworks.length} Active Tasks</p>
           </div>
           {isTeacher && (
             <button 
               onClick={() => setShowAddForm(true)}
               className="bg-[#4f46e5] text-white px-8 py-4 rounded-[22px] font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all">
               <Plus className="w-5 h-5 text-indigo-200" /> Add New
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
              />
            ))
          ) : (
            <div className="p-32 text-center bg-gray-50 border-4 border-dashed border-gray-100 rounded-[50px] flex flex-col items-center animate-in zoom-in duration-500">
               <BookMarked className="w-16 h-16 text-gray-200 mb-6" />
               <p className="text-gray-400 font-black italic uppercase text-lg">No assignments registered</p>
               <button onClick={fetchData} className="mt-8 text-[#4f46e5] font-black uppercase text-xs tracking-widest hover:underline active:scale-90 transition">Sync Manual</button>
            </div>
          )}
        </div>

        {/* NOTICES */}
        <div className="flex justify-between items-end mb-8 px-2">
           <div>
              <h3 className="text-black font-black text-2xl tracking-tight uppercase leading-none">Latest Notices</h3>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">Verified Updates</p>
           </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-[50px] overflow-hidden shadow-sm mb-20 text-black">
          {notices.length > 0 ? (
            notices.slice(0, 5).map((notice, idx) => (
              <NoticeRow 
                 key={notice._id || idx}
                 idx={idx}
                 icon={notice.priority === 'urgent' ? <AlertTriangle className="w-7 h-7 text-rose-500" /> : <Megaphone className="w-7 h-7 text-indigo-500" />} 
                 tag={notice.priority || "General"} 
                 tagColor={notice.priority === 'urgent' ? "text-rose-600 bg-rose-50 border-rose-100" : "text-indigo-600 bg-indigo-50 border-indigo-100"} 
                 time={new Date(notice.createdAt).toLocaleDateString()} 
                 title={notice.title} 
                 desc={notice.content} 
              />
            ))
          ) : (
             <div className="p-20 text-center text-gray-400 font-black italic uppercase tracking-widest text-xs">Inbox clear.</div>
          )}
        </div>
      </div>

      {/* ADD MODAL */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-6 transition-all animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[50px] p-12 shadow-3xl relative animate-in zoom-in duration-300 overflow-hidden text-black">
            <button onClick={() => setShowAddForm(false)} className="absolute top-10 right-10 bg-gray-50 p-3 rounded-2xl hover:bg-black hover:text-white transition active:scale-95 shadow-sm">
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

      {/* FLOAT BUTTON */}
      {!isTeacher && (
        <div className="fixed bottom-10 right-10 z-[100]">
          <button 
            onClick={() => alert("Upload functionality active within Student Portal...")}
            className="bg-black text-white px-10 py-5 rounded-[30px] font-black shadow-3xl shadow-indigo-500/10 flex items-center gap-4 hover:scale-110 active:scale-95 transition-all text-sm uppercase tracking-widest border border-white/10 group">
            <Plus className="w-7 h-7 text-emerald-400" /> Submit Work
          </button>
        </div>
      )}

    </div>
  );
}

function HomeworkCard({ idx, sub, classNameLabel, due, title, desc, teacher, onDelete }) {
  return (
    <div 
      className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative group animate-in slide-in-from-bottom text-black"
      style={{ animationDelay: `${idx * 80}ms` }}
    >
      {onDelete && (
        <button onClick={onDelete} className="absolute top-10 right-10 p-3.5 bg-rose-50 text-rose-300 hover:text-rose-600 border border-rose-50 rounded-2xl transition opacity-0 group-hover:opacity-100 active:scale-90">
          <Trash2 className="w-6 h-6" />
        </button>
      )}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-3">
          <span className="text-[#4f46e5] font-black text-[10px] bg-indigo-50 px-4 py-1.5 rounded-xl uppercase tracking-widest border border-indigo-100">{sub}</span>
          <span className="text-emerald-600 font-black text-[10px] bg-emerald-50 px-4 py-1.5 rounded-xl uppercase tracking-widest border border-emerald-100">{classNameLabel}</span>
        </div>
        <div className="flex items-center gap-2.5 text-gray-400 font-black text-[10px] uppercase tracking-widest tabular-nums italic">
           <Clock className="w-4 h-4 text-emerald-400" /> Due {due}
        </div>
      </div>
      <h4 className="font-black text-black text-[25px] tracking-tight leading-tight uppercase group-hover:text-indigo-600 transition-colors">{title}</h4>
      <p className="text-gray-400 font-bold text-[15px] mt-4 leading-relaxed line-clamp-2 italic">{desc}</p>
      
      <div className="mt-8 pt-8 border-t border-gray-50 flex justify-between items-center">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-50 rounded-[22px] flex items-center justify-center border border-indigo-100 shadow-inner group-hover:rotate-6 transition-transform">
             <User className="text-indigo-600 w-7 h-7" />
          </div>
          <div>
             <p className="text-black font-black text-[15px] uppercase leading-none">{teacher}</p>
             <p className="text-gray-400 font-black text-[9px] uppercase tracking-widest mt-1.5">Authorized Faculty</p>
          </div>
        </div>
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 group-hover:bg-black group-hover:text-white transition shadow-sm">
           <ChevronRight className="w-7 h-7" />
        </div>
      </div>
    </div>
  );
}

function NoticeRow({ idx, icon, tag, tagColor, time, title, desc }) {
  return (
    <div 
      className="bg-white p-10 flex gap-10 hover:bg-gray-50 transition-all cursor-pointer group border-b border-gray-50 last:border-0 text-black"
      style={{ animationDelay: `${idx * 100}ms` }}
    >
      <div className="bg-gray-50 p-6 rounded-[35px] h-fit shrink-0 group-hover:bg-white transition-all border border-gray-100 group-hover:shadow-2xl shadow-inner">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl border ${tagColor}`}>{tag}</span>
          <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest tabular-nums">{time}</span>
        </div>
        <h4 className="text-black font-black text-2xl tracking-tight uppercase group-hover:text-[#4f46e5] transition-colors">{title}</h4>
        <p className="text-gray-400 font-bold text-[15px] mt-3 leading-relaxed line-clamp-2 italic">{desc}</p>
      </div>
      <div className="flex items-center">
         <div className="w-12 h-12 rounded-full border-2 border-gray-50 flex items-center justify-center text-gray-100 group-hover:border-black group-hover:text-black transition-all">
           <ChevronRight className="w-8 h-8" />
         </div>
      </div>
    </div>
  );
}
