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
  X,
  Edit,
  Trash2,
  UserCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Staff() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const isAdmin = user?.role?.toLowerCase() === 'admin';

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      // Admin should see ALL staff, not just teachers
      const endpoint = isAdmin ? "/teachers/staff/all" : "/teachers";
      const response = await api.get(endpoint);
      setTeachers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Fetch staff error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this staff member?")) return;
    try {
      await api.delete(`/teachers/${id}`);
      fetchTeachers();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const filtered = teachers.filter(t => 
    t.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#fafafa] min-h-screen pb-32 font-sans transition-all">
      
      {/* HEADER AREA */}
      <div className="bg-[#1e1b4b] px-8 pt-12 pb-14 rounded-b-[60px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center text-white text-center md:text-left text-black">
          <div className="flex gap-6 items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="bg-white/10 p-3.5 rounded-[22px] border border-white/5 hover:bg-white/20 transition shadow-2xl backdrop-blur-md active:scale-95">
              <ChevronLeft className="w-7 h-7 text-white" />
            </button>
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-1 px-1">Institutional Portal</p>
              <h1 className="text-white text-[32px] font-black leading-tight uppercase tracking-tight">Staff Directory</h1>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-10 relative z-10">
           <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-[28px] px-6 py-5 shadow-inner group focus-within:bg-white transition-all">
              <Search className="text-white/50 group-focus-within:text-[#4f46e5] w-6 h-6 transition" />
              <input 
                type="text" 
                placeholder="Search by name, department or email..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-transparent border-none text-white placeholder-white/30 group-focus-within:text-black group-focus-within:placeholder-gray-400 outline-none w-full ml-4 text-[16px] font-bold"
              />
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-12 w-full flex-1">
        
        <div className="flex justify-between items-end mb-8 px-2">
           <h3 className="text-black font-black text-2xl tracking-tight uppercase leading-none">Faculty Members</h3>
           <div className="bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 flex items-center gap-2">
             <div className="w-2.5 h-2.5 bg-[#4f46e5] rounded-full animate-pulse"></div>
             <span className="text-[#4f46e5] text-[10px] font-black uppercase tracking-widest leading-none">Cloud Sync Active</span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
             <div className="col-span-full flex justify-center py-24"><Loader2 className="animate-spin text-[#4f46e5] w-12 h-12" /></div>
          ) : filtered.length === 0 ? (
             <div className="col-span-full p-32 text-center bg-gray-50 border-4 border-dashed border-gray-100 rounded-[50px] flex flex-col items-center">
                <Globe className="w-16 h-16 text-gray-200 mb-6" />
                <p className="text-gray-400 font-black italic uppercase text-lg">No staff found</p>
             </div>
          ) : (
             filtered.map((t, idx) => (
               <StaffCard 
                 key={t._id || idx}
                 idx={idx}
                 teacher={t}
                 isAdmin={isAdmin}
                 onDelete={handleDelete}
               />
             ))
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="fixed bottom-10 right-10 z-[100]">
          <button 
             onClick={() => navigate('/signup')}
             className="bg-[#4f46e5] text-white px-10 py-5 rounded-[30px] font-black shadow-3xl shadow-indigo-500/20 flex items-center gap-4 hover:scale-110 active:scale-95 transition-all text-[15px] uppercase tracking-widest border border-white/10">
            <Plus className="w-7 h-7 text-indigo-200" /> Onboard Staff
          </button>
        </div>
      )}

    </div>
  );
}

function StaffCard({ idx, teacher, isAdmin, onDelete }) {
  const name = teacher.userId?.name || "Faculty Member";
  const email = teacher.userId?.email || "n/a";
  const role = teacher.designation || "Staff";
  const dept = teacher.department || "Admin";
  const img = `https://ui-avatars.com/api/?name=${name}&background=EEF2FF&color=4f46e5&bold=true`;

  return (
    <div 
      className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 group flex flex-col animate-in slide-in-from-bottom"
      style={{ animationDelay: `${idx * 60}ms` }}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-6">
           <img src={img} alt={name} className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-lg group-hover:rotate-6 transition-transform" />
           <div>
              <h4 className="font-black text-black text-xl tracking-tight uppercase group-hover:text-[#4f46e5] transition-colors">{name}</h4>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest italic">{role}</p>
           </div>
        </div>
        <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl border border-emerald-100">
           <UserCheck className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-3 mb-8 px-2 flex-1">
         <div className="flex items-center gap-3 text-gray-500">
            <Landmark className="w-4 h-4 text-indigo-400" />
            <span className="text-[12px] font-bold uppercase tracking-tight">{dept} Department</span>
         </div>
         <div className="flex items-center gap-3 text-gray-500">
            <Mail className="w-4 h-4 text-indigo-400" />
            <span className="text-[12px] font-bold italic truncate">{email}</span>
         </div>
      </div>

      <div className="flex gap-3 mt-auto">
        <button className="flex-1 bg-indigo-50 text-indigo-600 py-4 rounded-[22px] font-black text-[10px] uppercase tracking-[2px] transition hover:bg-[#4f46e5] hover:text-white flex items-center justify-center gap-2">
           <MessageSquare className="w-4 h-4" /> Message
        </button>
        {isAdmin && (
           <button 
             onClick={() => onDelete(teacher._id)}
             className="w-14 bg-rose-50 text-rose-500 rounded-[22px] flex items-center justify-center hover:bg-rose-500 hover:text-white transition border border-rose-100">
              <Trash2 className="w-5 h-5" />
           </button>
        )}
      </div>
    </div>
  );
}
