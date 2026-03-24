import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  UserPlus, 
  Search, 
  SlidersHorizontal,
  ArrowDownAZ,
  GraduationCap,
  LayoutGrid,
  ChevronRight,
  FileText,
  Loader2,
  Bell,
  X,
  CheckCircle2,
  Trash2,
  Edit,
  Globe,
  Award,
  BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "123",
    class: "10",
    section: "A",
    rollNumber: ""
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/students");
      const list = Array.isArray(response.data) ? response.data : (response.data.students || []);
      setStudents(list);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/students", formData);
      setShowModal(false);
      setFormData({ name: "", email: "", password: "123", class: "10", section: "A", rollNumber: "" });
      fetchStudents();
    } catch (err) {
      alert("Registration failed: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await api.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) { alert("Delete failed"); }
  };

  const filtered = students.filter(s => 
    s.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber?.includes(searchTerm)
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
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-1 px-1">Institutional Records</p>
              <h1 className="text-white text-[32px] font-black leading-tight uppercase tracking-tight">Students List</h1>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
             <button className="bg-white/10 p-4 rounded-3xl border border-white/5 hover:bg-white/20 transition group shadow-2xl backdrop-blur-md text-white">
               <Bell className="w-7 h-7" />
             </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-10 relative z-10 animate-in slide-in-from-bottom duration-1000">
           <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-[28px] px-6 py-5 shadow-inner group focus-within:bg-white transition-all text-black">
              <Search className="text-white/50 group-focus-within:text-[#4f46e5] w-6 h-6 transition" />
              <input 
                type="text" 
                placeholder="Search by name or roll number..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-transparent border-none text-white placeholder-white/30 group-focus-within:text-black group-focus-within:placeholder-gray-400 outline-none w-full ml-4 text-[16px] font-bold"
              />
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-12 w-full flex-1 text-black font-sans">
        
        <div className="flex justify-between items-end mb-8 px-2">
           <h3 className="text-black font-black text-2xl tracking-tight uppercase leading-none">Registered Students</h3>
           <button 
              onClick={fetchStudents}
              className="bg-indigo-50 text-indigo-600 font-black px-6 py-2.5 rounded-2xl text-[11px] uppercase tracking-widest hover:bg-[#4f46e5] hover:text-white transition shadow-sm border border-indigo-100">
              Refresh List
           </button>
        </div>

        <div className="grid gap-6">
          {loading ? (
             <div className="flex justify-center py-24"><Loader2 className="animate-spin text-[#4f46e5] w-12 h-12" /></div>
          ) : filtered.length === 0 ? (
             <div className="p-32 text-center bg-gray-50 border-4 border-dashed border-gray-100 rounded-[50px] flex flex-col items-center">
                <Globe className="w-16 h-16 text-gray-200 mb-6" />
                <p className="text-gray-400 font-black italic uppercase text-lg">No students found</p>
             </div>
          ) : (
             filtered.map((s, idx) => (
               <StudentRow 
                 key={s._id || idx}
                 idx={idx}
                 init={s.userId?.name?.split(' ').map(n=>n[0]).join('') || "ST"} 
                 name={s.userId?.name || "Student"} 
                 grade={`Class ${s.class}`}
                 section={`Section ${s.section}`}
                 roll={s.rollNumber || "#"}
                 onDelete={() => handleDelete(s._id)}
               />
             ))
          )}
        </div>
      </div>

      {/* FIXED FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-100 p-8 z-[100] animate-in slide-in-from-bottom">
         <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-6">
            <button 
               onClick={() => setShowModal(true)}
               className="w-full md:w-auto bg-black text-white px-10 py-5 rounded-[30px] font-black shadow-3xl shadow-indigo-500/10 flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest border border-white/10">
               <UserPlus className="w-7 h-7 text-emerald-400" /> Register Student
            </button>
            <div className="hidden md:flex flex-col items-end">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Session</span>
               <span className="text-black font-black text-lg uppercase tracking-tight tabular-nums">{new Date().toLocaleTimeString()}</span>
            </div>
         </div>
      </div>

      {/* ENROLLMENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-in fade-in transition-all">
          <div className="bg-white w-full max-w-lg rounded-[50px] p-10 shadow-3xl relative animate-in zoom-in duration-300 overflow-hidden text-black">
            <div className="flex justify-between items-center mb-10">
               <h2 className="text-3xl font-black text-black uppercase tracking-tight">Add New Student</h2>
               <button onClick={() => setShowModal(false)} className="bg-gray-50 p-4 rounded-3xl hover:bg-black hover:text-white transition shadow-sm active:scale-95"><X className="w-7 h-7" /></button>
            </div>
            
            <form onSubmit={handleAddStudent} className="space-y-6">
              <div className="space-y-1.5 px-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Full Name</label>
                 <input 
                    required autoFocus
                    placeholder="e.g. Rahul Kumar" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 focus:bg-white transition-all font-bold text-lg text-black"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                 />
              </div>
              <div className="space-y-1.5 px-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Email Address</label>
                 <input 
                    required type="email"
                    placeholder="student@school.edu" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-8 py-5 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 focus:bg-white transition-all font-bold text-lg text-black"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                 />
              </div>
              <div className="grid grid-cols-3 gap-6 pt-2 px-1 text-black">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Class</label>
                   <input required value={formData.class} onChange={e=>setFormData({...formData, class: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none font-bold text-black" placeholder="10" />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Section</label>
                   <input required value={formData.section} onChange={e=>setFormData({...formData, section: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none font-bold text-black" placeholder="A" />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Roll No.</label>
                   <input required value={formData.rollNumber} onChange={e=>setFormData({...formData, rollNumber: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none font-bold text-black" placeholder="101" />
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-[#1e1b4b] text-white py-6 rounded-3xl font-black text-xl shadow-2xl flex items-center justify-center gap-4 hover:bg-black transition-all mt-8 uppercase tracking-widest disabled:opacity-50">
                {submitting ? <Loader2 className="w-7 h-7 animate-spin" /> : <CheckCircle2 className="w-7 h-7 text-emerald-400" />}
                Register Student
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function StudentRow({ idx, init, name, grade, section, roll, onDelete }) {
  return (
    <div 
       className="bg-white p-6 rounded-[45px] border border-gray-100 shadow-sm flex items-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
       style={{ animationDelay: `${idx * 80}ms` }}
    >
      <div className="w-20 h-20 rounded-[30px] bg-[#1e1b4b] text-white font-black text-2xl flex items-center justify-center border-4 border-white shadow-xl">
        {init}
      </div>
      
      <div className="ml-8 flex-1 text-black">
        <h4 className="font-black text-black text-2xl tracking-tight group-hover:text-[#4f46e5] transition-colors leading-tight uppercase">{name}</h4>
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5 text-black/40 text-[11px] font-black uppercase tracking-widest">
            <GraduationCap className="w-4 h-4 text-indigo-500" />
            <span>{grade}</span>
          </div>
          <div className="flex items-center gap-1.5 text-black/40 text-[11px] font-black uppercase tracking-widest">
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span>{section}</span>
          </div>
          <div className="bg-indigo-50 px-4 py-1.5 rounded-full text-indigo-600 text-[10px] font-black uppercase border border-indigo-100">
             Roll: {roll}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 px-2">
        <button 
           onClick={() => alert(`Opening ${name}'s Performance...`)}
           className="w-12 h-12 rounded-[22px] bg-gray-50 text-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition shadow-sm">
           <Award className="w-6 h-6" />
        </button>
        <button 
          onClick={onDelete}
          className="w-12 h-12 rounded-[22px] bg-red-50 text-red-300 flex items-center justify-center hover:bg-red-500 hover:text-white transition shadow-sm opacity-0 group-hover:opacity-100">
          <Trash2 className="w-6 h-6" />
        </button>
        <ChevronRight className="text-gray-200 w-8 h-8 group-hover:text-black transition-colors" />
      </div>
    </div>
  );
}