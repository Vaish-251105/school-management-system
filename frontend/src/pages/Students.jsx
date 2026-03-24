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
  Edit
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // FORM STATE
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
      const studentList = Array.isArray(response.data) ? response.data : (response.data.students || []);
      setStudents(studentList);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load students");
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
      alert("Error adding student: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student record?")) return;
    try {
      await api.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) { alert("Delete failed"); }
  };

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans flex flex-col relative pb-32 text-gray-900">
      
      {/* HEADER AREA */}
      <div className="bg-gradient-to-br from-[#4338ca] to-[#4f46e5] px-6 pt-12 pb-8 rounded-b-[40px] shadow-lg shrink-0">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex justify-between items-center mb-8">
            <button onClick={() => navigate(-1)} className="text-white hover:bg-white/10 p-2 rounded-full transition">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-white text-xl font-bold">Student Directory</h1>
            <div className="flex gap-2">
              <button onClick={() => alert("All alerts cleared.")} className="text-white p-2 hover:bg-white/10 rounded-full transition"><Bell className="w-5 h-5" /></button>
              <button 
                onClick={() => alert("Filter Options: \n• Grade\n• Performance")}
                className="text-white p-2 hover:bg-white/10 rounded-full transition">
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center bg-white/15 border border-white/20 rounded-2xl px-4 py-3 shadow-inner">
            <Search className="text-white/70 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search directory..." 
              className="bg-transparent border-none text-white placeholder-white/70 outline-none w-full ml-3 text-sm"
            />
          </div>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="max-w-4xl mx-auto px-6 mt-8 w-full flex-1 mb-20">
        
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-gray-900 font-bold text-[17px]">Student Overview</h3>
            <p className="text-gray-500 text-xs mt-1">{students.length} Total Enrolled</p>
          </div>
          <button className="bg-gray-100 border border-gray-200 px-3 py-2 rounded-full flex items-center gap-2 text-[13px] font-bold text-gray-800 shadow-sm">
            <ArrowDownAZ className="w-4 h-4 text-[#4f46e5]" /> Name (A-Z)
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
              <Loader2 className="w-10 h-10 animate-spin text-[#4f46e5] mb-4" />
              <p className="text-gray-500 font-medium">Fetching Records...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 text-gray-400">
               No students found. Add one below.
            </div>
          ) : (
            students.map((student) => (
              <StudentCard 
                key={student._id}
                id={student._id}
                initials={student.userId?.name?.split(' ').map(n=>n[0]).join('').toUpperCase() || "ST"}
                name={student.userId?.name || "Student"}
                grade={`Class ${student.class}`}
                section={`Section ${student.section}`}
                roll={student.rollNumber || "#"}
                onDelete={() => handleDelete(student._id)}
              />
            ))
          )}
        </div>
      </div>

      {/* FIXED BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-100 p-6 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button 
             onClick={() => setShowModal(true)}
            className="bg-[#4f46e5] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 transition">
            <UserPlus className="w-5 h-5" /> Enrollment
          </button>
          <button className="bg-gray-50 text-gray-600 px-6 py-4 rounded-2xl font-bold border border-gray-100 flex items-center gap-2 hover:bg-gray-100 transition">
            <FileText className="w-5 h-5" /> Export
          </button>
        </div>
      </div>

      {/* REGISTRATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-bold text-gray-900">Student Enrollment</h2>
               <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleAddStudent} className="space-y-4">
              <input 
                 required
                 placeholder="Full Name" 
                 className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:border-indigo-200 transition"
                 value={formData.name}
                 onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <input 
                 required
                 type="email"
                 placeholder="Email Address" 
                 className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:border-indigo-200 transition"
                 value={formData.email}
                 onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                   required
                   placeholder="Class (e.g. 10)" 
                   className="bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:border-indigo-200 transition"
                   value={formData.class}
                   onChange={e => setFormData({...formData, class: e.target.value})}
                />
                <input 
                   required
                   placeholder="Section (e.g. A)" 
                   className="bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:border-indigo-200 transition"
                   value={formData.section}
                   onChange={e => setFormData({...formData, section: e.target.value})}
                />
              </div>
              <input 
                 required
                 placeholder="Roll Number" 
                 className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:border-indigo-200 transition"
                 value={formData.rollNumber}
                 onChange={e => setFormData({...formData, rollNumber: e.target.value})}
              />
              
              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-[#4f46e5] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2 hover:bg-indigo-700 transition disabled:opacity-50">
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                Register Student
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function StudentCard({ initials, name, grade, section, roll, onDelete }) {
  return (
    <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center hover:shadow-md transition group">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-[#4f46e5] font-bold text-lg flex items-center justify-center border border-indigo-100 group-hover:scale-110 transition">
        {initials}
      </div>
      
      <div className="ml-5 flex-1">
        <h4 className="font-bold text-gray-900 text-[16px] group-hover:text-[#4f46e5] transition cursor-pointer">{name}</h4>
        <div className="flex items-center gap-4 mt-1">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{grade}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{section}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-gray-50 px-3 py-1.5 rounded-xl text-[#4f46e5] text-[11px] font-bold">
           ID: {roll}
        </div>
        <button 
          onClick={onDelete}
          className="p-2 text-gray-300 hover:text-rose-500 transition rounded-xl hover:bg-rose-50 opacity-0 group-hover:opacity-100">
          <Trash2 className="w-4 h-4" />
        </button>
        <ChevronRight className="text-gray-300 w-5 h-5" />
      </div>
    </div>
  );
}