import React, { useState, useEffect } from "react";
import { 
  Check, 
  MessageSquare, 
  User,
  Megaphone,
  MessageCircle,
  Clock,
  Paperclip,
  Plus,
  ChevronLeft,
  Loader2,
  GraduationCap,
  Activity,
  ChevronRight,
  Globe,
  Award,
  Bell
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Communication() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [notices, setNotices] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHubData = async () => {
      try {
        setLoading(true);
        const [nRes, tRes, hRes] = await Promise.all([
          api.get("/notices"),
          api.get("/teachers"),
          api.get("/homework")
        ]);
        setNotices(nRes.data || []);
        setTeachers(tRes.data || []);
        setHomeworks(hRes.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHubData();
  }, []);

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa]">
       <Loader2 className="w-12 h-12 animate-spin text-[#4f46e5] mb-6" />
       <p className="text-gray-400 font-black italic tracking-widest uppercase">Syncing...</p>
     </div>
  );

  return (
    <div className="bg-[#fafafa] min-h-screen pb-32 font-sans animate-in fade-in transition-all">
      
      {/* HEADER AREA */}
      <div className="bg-[#1e1b4b] px-8 pt-12 pb-14 rounded-b-[60px] shadow-2xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-5xl mx-auto relative z-10 flex justify-between items-center text-white text-center md:text-left">
          <div className="flex gap-6 items-center animate-in slide-in-from-bottom duration-700">
            <button 
              onClick={() => navigate(-1)} 
              className="bg-white/10 p-3.5 rounded-[22px] border border-white/5 hover:bg-white/20 transition shadow-2xl backdrop-blur-md active:scale-95 group">
              <ChevronLeft className="w-7 h-7 text-white" />
            </button>
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-1">Notice Board</p>
              <h1 className="text-white text-[32px] font-black leading-tight uppercase tracking-tight">Communication</h1>
            </div>
          </div>
          <div className="flex items-center gap-4 hidden md:flex">
             <button onClick={() => navigate('/notifications')} className="bg-white/10 p-4 rounded-3xl border border-white/5 hover:bg-white/20 transition group shadow-2xl backdrop-blur-md text-white">
               <Bell className="w-7 h-7" />
             </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-10 relative z-10 animate-in slide-in-from-bottom duration-1000">
           <div className="grid grid-cols-3 gap-6 bg-white/10 backdrop-blur-md border border-white/10 rounded-[40px] p-8 shadow-inner">
             <HubStat label="NOTICES" val={notices.length} />
             <HubStat label="TEACHERS" val={teachers.length} />
             <HubStat label="SECTION" val="10-A" />
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-12 w-full flex-1 text-black font-sans">
        
        {/* NOTICES TIMELINE */}
        <div className="flex justify-between items-end mb-8">
           <h3 className="text-black font-black text-2xl tracking-tight uppercase leading-none">Announcements</h3>
           <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2">
             <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-emerald-700 text-[10px] font-black uppercase tracking-widest leading-none">Online</span>
           </div>
        </div>

        <div className="space-y-6 mb-16">
          {notices.length > 0 ? notices.map((n, idx) => (
             <NoticeItem 
                key={n._id || idx}
                idx={idx}
                title={n.title} 
                content={n.content} 
                date={new Date(n.createdAt).toLocaleDateString()} 
             />
          )) : (
            <div className="p-32 text-center bg-gray-50 border-4 border-dashed border-gray-100 rounded-[50px] flex flex-col items-center">
               <Globe className="w-16 h-16 text-gray-200 mb-6" />
               <p className="text-gray-400 font-black italic uppercase text-lg">No alerts found</p>
            </div>
          )}
        </div>

        {/* TEACHERS SECTION */}
        <div className="flex justify-between items-end mb-8">
           <h3 className="text-black font-black text-2xl tracking-tight uppercase leading-none">Teachers</h3>
           <button onClick={() => navigate('/staff')} className="text-[#4f46e5] font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-50 px-4 py-2 rounded-xl transition">
              See All <ChevronRight className="w-4 h-4" />
           </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {teachers.length > 0 ? teachers.map((t, idx) => (
            <FacultyCard 
              key={t._id || idx}
              idx={idx}
              name={t.userId?.name || "Teacher"} 
              dept={t.department || "Educational Staff"} 
              init={t.userId?.name?.split(' ').map(n=>n[0]).join('') || "TS"} 
            />
          )) : (
            <FacultyCard name="Support Staff" dept="School Administration" init="AD" idx={0} />
          )}
        </div>

        {/* HOMEWORK SUMMARY */}
        <div className="flex justify-between items-end mb-8">
           <h3 className="text-black font-black text-2xl tracking-tight uppercase leading-none">Homework Summary</h3>
           <div className="bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100">
             <span className="text-orange-700 text-[10px] font-black uppercase tracking-widest leading-none">
                {homeworks.length} Pending
             </span>
           </div>
        </div>

        <div className="grid gap-6">
          {homeworks.slice(0, 4).map((hw, idx) => (
             <MandateCard 
                key={hw._id || idx}
                idx={idx}
                subject={hw.subject?.toUpperCase() || "CORE"} 
                title={hw.title} 
                due={`Due: ${new Date(hw.dueDate).toLocaleDateString()}`} 
             />
          ))}
        </div>

      </div>

      <div className="fixed bottom-10 right-10 z-[100] animate-in slide-in-from-bottom">
        <button 
          onClick={() => alert("Chat functionality coming soon...")}
          className="bg-black text-white px-10 py-5 rounded-[30px] font-black shadow-3xl flex items-center gap-4 hover:scale-110 active:scale-95 transition-all text-[15px] uppercase tracking-widest">
          <MessageCircle className="w-7 h-7 text-teal-400" /> Start Chat
        </button>
      </div>

    </div>
  );
}

function HubStat({ label, val }) {
  return (
    <div className="text-center group">
       <p className="text-white/40 text-[9px] font-black uppercase tracking-[2px] mb-1">{label}</p>
       <h4 className="text-white text-2xl font-black tracking-tight leading-none">{val}</h4>
    </div>
  );
}

function NoticeItem({ idx, title, content, date }) {
  return (
    <div 
      className="bg-white p-7 rounded-[45px] border border-gray-100 shadow-sm flex items-start gap-8 hover:shadow-2xl transition-all duration-300 group animate-in fade-in"
      style={{ animationDelay: `${idx * 100}ms` }}
    >
      <div className="bg-indigo-50 p-6 rounded-[30px] shrink-0 group-hover:bg-indigo-600 transition-all border border-indigo-50">
         <Megaphone className="text-[#4f46e5] group-hover:text-white w-7 h-7" />
      </div>
      <div>
         <div className="flex justify-between items-center mb-2">
            <span className="bg-indigo-100 text-[#4f46e5] font-black text-[10px] uppercase tracking-[2px] px-3 py-1 rounded-xl">Notice</span>
            <span className="text-gray-300 font-bold text-[11px] uppercase italic">{date}</span>
         </div>
         <h4 className="text-black font-black text-2xl tracking-tight leading-tight uppercase group-hover:text-[#4f46e5] transition-colors">{title}</h4>
         <p className="text-gray-400 font-bold text-[15px] mt-3 leading-relaxed italic">{content}</p>
      </div>
    </div>
  );
}

function FacultyCard({ name, dept, init, idx }) {
  return (
    <div 
      className="bg-white p-6 rounded-[40px] border border-gray-100 shadow-sm flex items-center hover:shadow-2xl transition-all duration-300 group animate-in fade-in"
      style={{ animationDelay: `${idx * 80}ms` }}
    >
      <div className="w-16 h-16 rounded-[24px] bg-[#1e1b4b] text-white font-black text-[18px] flex items-center justify-center border-4 border-white shadow-xl">
        {init}
      </div>
      <div className="ml-6 flex-1">
         <h4 className="text-black font-black text-[17px] tracking-tight leading-tight uppercase group-hover:text-[#4f46e5] transition-colors">{name}</h4>
         <p className="text-gray-400 font-bold text-[10px] uppercase mt-1 italic">{dept}</p>
      </div>
      <button className="bg-gray-50 p-3 rounded-full text-gray-300 hover:bg-black hover:text-white transition shadow-sm">
         <MessageSquare className="w-5 h-5" />
      </button>
    </div>
  );
}

function MandateCard({ subject, title, due, idx }) {
  return (
    <div 
      className="bg-white p-6 rounded-[40px] border border-gray-100 shadow-sm flex items-center group hover:shadow-2xl transition-all duration-300 animate-in fade-in cursor-pointer"
      style={{ animationDelay: `${idx * 80}ms` }}
    >
       <div className="bg-orange-50 p-4 rounded-2xl group-hover:bg-orange-500 transition-colors shadow-inner shrink-0 border border-orange-50">
         <Activity className="text-orange-600 group-hover:text-white w-6 h-6" />
       </div>
       <div className="ml-6 flex-1">
          <div className="flex items-center gap-3 mb-1">
             <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{subject}</span>
             <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
             <span className="text-[10px] font-black text-gray-400 uppercase italic">{due}</span>
          </div>
          <h4 className="text-black font-black text-[16px] tracking-tight uppercase group-hover:text-[#4f46e5] transition-colors">{title}</h4>
       </div>
       <ChevronRight className="w-8 h-8 text-gray-100 group-hover:text-black transition-colors" />
    </div>
  );
}