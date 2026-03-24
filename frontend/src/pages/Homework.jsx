import React, { useState, useEffect } from "react";
import { 
  Bell,
  GraduationCap,
  Download,
  Clock,
  FileText,
  Megaphone,
  CalendarDays,
  AlertTriangle,
  Banknote,
  BookMarked,
  Check,
  User,
  Plus,
  ChevronLeft,
  Trash2,
  X,
  Loader2
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
  const [newHw, setNewHw] = useState({ title: '', subject: '', dueDate: '', description: '' });

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
      await api.post("/homework", { ...newHw, teacherId: user._id });
      setShowAddForm(false);
      setNewHw({ title: '', subject: '', dueDate: '', description: '' });
      fetchData();
    } catch (err) {
      alert("Error adding homework");
    }
  };

  const handleDeleteHomework = async (id) => {
    if (!window.confirm("Delete this homework?")) return;
    try {
      await api.delete(`/homework/${id}`);
      fetchData();
    } catch (err) {
      alert("Error deleting homework");
    }
  };

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('') : "US";

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans flex flex-col pb-28">
      
      {/* HEADER AREA */}
      <div className="bg-gradient-to-br from-[#4338ca] to-[#4f46e5] px-6 pt-12 pb-10 rounded-b-[40px] shadow-lg shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center w-full mb-8">
            <button onClick={() => navigate(-1)} className="bg-white/15 p-2 rounded-xl border border-white/10 hover:bg-white/20 transition">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button onClick={() => navigate('/notifications')} className="bg-white/15 p-2 rounded-xl border border-white/10 hover:bg-white/20 transition">
                  <Bell className="w-6 h-6 text-white" />
                </button>
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-[#4840d6] animate-pulse">
                  {notices.length}
                </div>
              </div>
              <div onClick={() => navigate('/profile')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition">
                <span className="text-[#4f46e5] font-bold text-[14px]">{initials}</span>
              </div>
            </div>
          </div>

          <h1 className="text-white text-[26px] font-bold mb-2 tracking-tight">Academic Hub</h1>
          <div className="flex items-center gap-1.5 opacity-90">
            <GraduationCap className="text-white/80 w-4 h-4" />
            <span className="text-white/90 text-[13px] font-bold">{user.role ? user.role.toUpperCase() : "STUDENT"} PORTAL • {user.name}</span>
          </div>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="max-w-4xl mx-auto px-6 mt-6 w-full flex-1">
        
        {/* ACTIVE HOMEWORK */}
        <div className="flex justify-between items-end mb-4 pt-2">
          <h3 className="text-gray-900 font-bold text-[18px]">Course Assignments</h3>
          {isTeacher && (
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-[#4f46e5] text-white px-4 py-2 rounded-full font-bold text-[12px] flex items-center gap-1.5 shadow-md shadow-indigo-500/20 hover:scale-105 transition">
              <Plus className="w-4 h-4" /> Add Homework
            </button>
          )}
        </div>

        <div className="space-y-4 mb-8">
          {loading ? (
             <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-500 w-8 h-8" /></div>
          ) : homeworks.length > 0 ? (
            homeworks.map((hw) => (
              <HomeworkCard 
                key={hw._id}
                sub={hw.subject} 
                due={`Due: ${new Date(hw.dueDate).toLocaleDateString()}`}
                title={hw.title} 
                desc={hw.description}
                teacher={hw.teacherId?.name || "Faculty Member"} 
                status={hw.status || "Pending"} 
                onDelete={isTeacher ? () => handleDeleteHomework(hw._id) : null}
                color={hw.status === "Pending" ? "text-orange-600 bg-orange-50" : "text-[#4f46e5] bg-indigo-50"}
              />
            ))
          ) : (
            <div className="p-10 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-gray-400">
               No active homework found in the database.
            </div>
          )}
        </div>

        {/* QUICK LINKS */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <QuickLink onClick={() => alert("Downloading Syllabus...")} icon={<Download className="w-5 h-5 text-white" />} label="Syllabus" />
          <QuickLink onClick={() => navigate('/calendar')} icon={<Clock className="w-5 h-5 text-white" />} label="Timetable" />
          <QuickLink onClick={() => alert("Accessing Cloud Resources...")} icon={<FileText className="w-5 h-5 text-white" />} label="Resources" />
        </div>

        {/* RECENT NOTICES */}
        <h3 className="text-gray-900 font-bold text-[18px] mb-4">Institutional Notices</h3>
        <div className="bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm">
          {notices.length > 0 ? (
            notices.slice(0, 5).map((notice, idx) => (
              <React.Fragment key={notice._id || idx}>
                <NoticeRow 
                   icon={notice.priority === 'urgent' ? <AlertTriangle className="w-5 h-5 text-red-500" /> : <Megaphone className="w-5 h-5 text-[#4f46e5]" />} 
                   tag={notice.priority?.toUpperCase() || "GENERAL"} 
                   tagColor={notice.priority === 'urgent' ? "text-red-500" : "text-[#4f46e5]"} 
                   time={new Date(notice.createdAt).toLocaleDateString()} 
                   title={notice.title} 
                   desc={notice.content} 
                />
                {idx < notices.length - 1 && <div className="w-full h-px bg-gray-50"></div>}
              </React.Fragment>
            ))
          ) : (
             <div className="p-8 text-center text-gray-400 italic">No formal announcements at this time.</div>
          )}
        </div>
      </div>

      {/* ADD HOMEWORK MODAL */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowAddForm(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Assign New Homework</h2>
            <form onSubmit={handleAddHomework} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5 ml-1">Homework Title</label>
                <input required value={newHw.title} onChange={e=>setNewHw({...newHw, title: e.target.value})} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition outline-none" placeholder="e.g. Calculus Practice" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5 ml-1">Subject</label>
                <input required value={newHw.subject} onChange={e=>setNewHw({...newHw, subject: e.target.value})} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition outline-none" placeholder="e.g. Mathematics" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5 ml-1">Due Date</label>
                <input required value={newHw.dueDate} onChange={e=>setNewHw({...newHw, dueDate: e.target.value})} type="date" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5 ml-1">Instructions</label>
                <textarea required value={newHw.description} onChange={e=>setNewHw({...newHw, description: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition outline-none h-24 resize-none" placeholder="Enter task details..."></textarea>
              </div>
              <button type="submit" className="w-full bg-[#4f46e5] text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 transition mt-4">
                Post Assignment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FLOAT SUBMIT BUTTON FOR STUDENTS */}
      {!isTeacher && (
        <div className="fixed bottom-6 right-6">
          <button 
            onClick={() => alert("Opening Homework Upload Tool...")}
            className="bg-[#4f46e5] text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 hover:bg-indigo-600 transition">
            <Plus className="w-5 h-5" /> Submit Work
          </button>
        </div>
      )}

    </div>
  );
}

function HomeworkCard({ sub, due, title, desc, teacher, status, color, onDelete }) {
  return (
    <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm hover:shadow-md transition relative group">
      {onDelete && (
        <button onClick={onDelete} className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
          <Trash2 className="w-5 h-5" />
        </button>
      )}
      <div className="flex justify-between items-center mb-3">
        <span className="text-[#4f46e5] font-bold text-[11px] bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">{sub}</span>
        <span className="text-gray-400 font-bold text-[11px] flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> {due}
        </span>
      </div>
      <h4 className="font-bold text-gray-900 text-[17px] leading-tight">{title}</h4>
      <p className="text-gray-500 text-[13px] mt-2.5 leading-relaxed">{desc}</p>
      
      <div className="mt-5 pt-5 border-t border-gray-50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-gray-600">
          <div className="w-7 h-7 bg-indigo-50 rounded-full flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <span className="font-bold text-[13px]">{teacher}</span>
        </div>
        <div className={`${color} px-4 py-1.5 rounded-xl flex items-center gap-1.5 font-bold text-[12px]`}>
          <Check className="w-3.5 h-3.5" />
          {status}
        </div>
      </div>
    </div>
  );
}

function QuickLink({ icon, label, onClick }) {
  return (
    <div onClick={onClick} className="bg-white border border-gray-50 rounded-[24px] py-5 flex flex-col items-center hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer text-center group">
      <div className="bg-[#4f46e5] w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition">
        {icon}
      </div>
      <span className="font-bold text-gray-900 text-[12px] tracking-wide">{label}</span>
    </div>
  );
}

function NoticeRow({ icon, tag, tagColor, time, title, desc }) {
  return (
    <div className="bg-white p-5 flex gap-5 hover:bg-gray-50 transition cursor-pointer group">
      <div className="bg-gray-50 p-4 rounded-2xl h-fit shrink-0 group-hover:bg-white transition-colors border border-gray-100">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1.5">
          <span className={`text-[10px] font-bold uppercase tracking-widest ${tagColor}`}>{tag}</span>
          <span className="text-gray-400 text-[11px] font-medium">{time}</span>
        </div>
        <h4 className="text-gray-900 font-bold text-[16px] group-hover:text-[#4f46e5] transition-colors">{title}</h4>
        <p className="text-gray-500 text-[13px] mt-2 leading-relaxed line-clamp-2">{desc}</p>
      </div>
    </div>
  );
}
