import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  SlidersHorizontal,
  Search,
  MessageSquare,
  Plus,
  Calculator,
  Landmark,
  Loader2,
  Bell,
  MoreVertical,
  Activity,
  Award,
  Globe,
  Mail,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Staff() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/teachers");
        setTeachers(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Fetch staff error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const filtered = teachers.filter(t => 
    t.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#fafafa] min-h-screen pb-32 font-sans animate-in fade-in transition-all">
      
      {/* HEADER AREA */}
      <div className="bg-[#1e1b4b] px-8 pt-12 pb-14 rounded-b-[60px] shadow-2xl relative overflow-hidden text-black">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center text-white text-center md:text-left">
          <div className="flex gap-6 items-center animate-in slide-in-from-bottom duration-700">
            <button 
              onClick={() => navigate(-1)} 
              className="bg-white/10 p-3.5 rounded-[22px] border border-white/5 hover:bg-white/20 transition shadow-2xl backdrop-blur-md active:scale-95 group">
              <ChevronLeft className="w-7 h-7 text-white" />
            </button>
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-1 px-1">Institutional Portal</p>
              <h1 className="text-white text-[32px] font-black leading-tight uppercase tracking-tight">Teachers List</h1>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-6 md:mt-0">
             <button className="bg-white/10 p-4 rounded-3xl border border-white/5 hover:bg-white/20 transition group shadow-2xl backdrop-blur-md text-white">
               <SlidersHorizontal className="w-7 h-7" />
             </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-10 relative z-10 animate-in slide-in-from-bottom duration-1000">
           <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-[28px] px-6 py-5 shadow-inner group focus-within:bg-white focus-within:border-white transition-all text-black">
              <Search className="text-white/50 group-focus-within:text-[#4f46e5] w-6 h-6 transition" />
              <input 
                type="text" 
                placeholder="Search by name or department..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-transparent border-none text-white placeholder-white/30 group-focus-within:text-black group-focus-within:placeholder-gray-400 outline-none w-full ml-4 text-[16px] font-bold"
              />
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-12 w-full flex-1 text-black font-sans">
        
        {/* LIST COMPONENT */}
        <div className="flex justify-between items-end mb-8 px-2">
           <h3 className="text-black font-black text-2xl tracking-tight uppercase leading-none">Registered Faculty</h3>
           <div className="bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 flex items-center gap-2">
             <div className="w-2.5 h-2.5 bg-[#4f46e5] rounded-full animate-pulse"></div>
             <span className="text-[#4f46e5] text-[10px] font-black uppercase tracking-widest leading-none">Online</span>
           </div>
        </div>

        <div className="grid gap-6">
          {loading ? (
             <div className="flex justify-center py-24"><Loader2 className="animate-spin text-[#4f46e5] w-12 h-12" /></div>
          ) : filtered.length === 0 ? (
             <div className="p-32 text-center bg-gray-50 border-4 border-dashed border-gray-100 rounded-[50px] flex flex-col items-center">
                <Globe className="w-16 h-16 text-gray-200 mb-6" />
                <p className="text-gray-400 font-black italic uppercase text-lg">No staff found</p>
             </div>
          ) : (
             filtered.map((t, idx) => (
               <StaffCard 
                 key={t._id || idx}
                 idx={idx}
                 img={`https://ui-avatars.com/api/?name=${t.userId?.name || "TS"}&background=ffffff&color=4f46e5`}
                 name={t.userId?.name || "Teacher"}
                 role={t.designation || "Faculty"}
                 dept={t.department || "Academic"}
                 email={t.userId?.email || "faculty@school.edu"}
               />
             ))
          )}
        </div>
      </div>

      <div className="fixed bottom-10 right-10 z-[100]">
        <button 
           onClick={() => navigate('/signup')}
           className="bg-black text-white px-8 py-5 rounded-[28px] font-black shadow-3xl shadow-indigo-500/10 flex items-center gap-4 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest border border-white/10 group">
          <Plus className="w-7 h-7 text-emerald-400" /> Register Teacher
        </button>
      </div>

    </div>
  );
}

function StaffCard({ idx, img, name, role, dept, email }) {
  return (
    <div 
      className="bg-white p-7 rounded-[45px] border border-gray-100 shadow-sm flex items-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer animate-in fade-in"
      style={{ animationDelay: `${idx * 80}ms` }}
    >
      <div className="relative shrink-0">
        <img src={img} alt={name} className="w-20 h-20 rounded-[30px] object-cover border-4 border-gray-50 group-hover:rotate-6 transition-transform shadow-lg" />
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-4 border-white shadow-lg flex items-center justify-center">
           <Activity className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
      
      <div className="ml-8 flex-1 text-black">
        <h4 className="font-black text-black text-2xl tracking-tight leading-tight group-hover:text-[#4f46e5] transition-colors uppercase">{name}</h4>
        <div className="flex flex-wrap items-center gap-4 mt-2 mb-3">
           <span className="text-[#4f46e5] font-black text-[11px] uppercase tracking-[2px] bg-indigo-50 px-3 py-1.5 rounded-xl">{role}</span>
           <span className="text-gray-400 font-bold text-[11px] uppercase tracking-widest flex items-center gap-1.5">
             <Landmark className="w-3.5 h-3.5" /> {dept}
           </span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-[13px] font-bold italic">
           <Mail className="w-4 h-4" /> {email}
        </div>
      </div>

      <div className="flex flex-col items-end gap-3 px-2">
        <div className="flex gap-2">
           <button className="w-12 h-12 rounded-[20px] bg-indigo-50 text-[#4f46e5] flex items-center justify-center hover:bg-[#4f46e5] hover:text-white transition shadow-sm border border-indigo-100">
              <MessageSquare className="w-6 h-6" />
           </button>
           <button className="w-12 h-12 rounded-[20px] bg-gray-50 text-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition shadow-sm border border-gray-100">
              <Award className="w-6 h-6" />
           </button>
        </div>
        <div className="bg-gray-50 p-1.5 rounded-full px-4 border border-gray-100">
           <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Verified Member</span>
        </div>
      </div>
    </div>
  );
}
