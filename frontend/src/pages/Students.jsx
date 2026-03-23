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
  Bell
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/students", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        const studentList = Array.isArray(data) ? data : (data.students || []);
        setStudents(studentList);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

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
              <button 
                onClick={() => alert("No new student notifications")}
                className="text-white p-2 hover:bg-white/10 rounded-full transition">
                <Bell className="w-5 h-5" />
              </button>
              <button 
                onClick={() => alert("Student Filter Options: \n• By Class\n• By Performance\n• By Attendance")}
                className="text-white p-2 hover:bg-white/10 rounded-full transition">
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="flex items-center bg-white/15 border border-white/20 rounded-2xl px-4 py-3 shadow-inner">
            <Search className="text-white/70 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name, roll no, or class..." 
              className="bg-transparent border-none text-white placeholder-white/70 outline-none w-full ml-3 text-sm"
            />
          </div>

        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="max-w-4xl mx-auto px-6 mt-8 w-full flex-1 mb-20">
        
        {/* LIST CONTROLS */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-gray-900 font-bold text-[17px]">Student Overview</h3>
            <p className="text-gray-500 text-xs mt-1">{students.length} Total Enrolled</p>
          </div>
          <button 
            onClick={() => alert("Sorting by Name (A-Z)")}
            className="bg-gray-100 border border-gray-200 px-3 py-2 rounded-full flex items-center gap-2 text-[13px] font-bold text-gray-800 shadow-sm hover:bg-gray-200 transition">
            <ArrowDownAZ className="w-4 h-4 text-[#4f46e5]" /> Name (A-Z)
          </button>
        </div>

        {/* CHIPS */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button className="border-2 border-[#4f46e5] text-[#4f46e5] font-bold px-5 py-2.5 rounded-full text-sm shrink-0 shadow-sm bg-indigo-50/50">
            All Students
          </button>
          <button className="bg-white border border-gray-200 text-gray-500 font-medium px-5 py-2.5 rounded-full text-sm shrink-0 hover:bg-gray-50 transition">
            Class 10-A
          </button>
          <button className="bg-white border border-gray-100 text-gray-500 font-medium px-5 py-2.5 rounded-full text-sm shrink-0 hover:bg-gray-50 transition">
            Class 10-B
          </button>
        </div>

        {/* STUDENT LIST */}
        <div className="space-y-3 pb-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
              <Loader2 className="w-10 h-10 animate-spin text-[#4f46e5] mb-4" />
              <p className="text-gray-500 font-medium tracking-wide">Fetching Students...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 font-bold">{error}</p>
              <button onClick={() => window.location.reload()} className="text-[#4f46e5] font-bold mt-2">Retry</button>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No students found.</div>
          ) : (
            students.map((student) => (
              <StudentCard 
                key={student._id}
                initials={student.userId?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || "ST"}
                name={student.userId?.name || "Unknown Student"}
                grade={`Class ${student.class}`}
                section={`Section ${student.section}`}
                roll={student.rollNumber || "#000"}
              />
            ))
          )}
        </div>

      </div>

      {/* FIXED BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-2">
          
          <button 
             onClick={() => {
                alert("Redirecting to Student Registration Form...");
                navigate('/signup');
             }}
            className="bg-indigo-50 border border-indigo-100 text-[#4f46e5] px-4 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-100 transition">
            <UserPlus className="w-5 h-5" /> Add Student
          </button>

          <button 
             onClick={() => alert("Generating full class report...")}
            className="bg-[#4f46e5] text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition">
            <FileText className="w-4 h-4" /> Generate Report
          </button>

        </div>
      </div>

    </div>
  );
}

function StudentCard({ initials, name, grade, section, roll }) {
  return (
    <div 
       onClick={() => alert(`Showing full profile for ${name}...`)}
      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center hover:shadow-md transition cursor-pointer">
      <div className="w-[50px] h-[50px] rounded-[14px] bg-[#4f46e5] text-white font-bold text-lg flex items-center justify-center shrink-0">
        {initials}
      </div>
      
      <div className="ml-4 flex-1">
        <h4 className="font-bold text-gray-900 text-[16px]">{name}</h4>
        <div className="flex items-center gap-4 mt-1">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{grade}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{section}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="bg-indigo-50 text-[#4f46e5] text-[11px] font-bold px-3 py-1.5 rounded-full">
          {roll}
        </span>
        <ChevronRight className="text-gray-400 w-5 h-5" />
      </div>
    </div>
  );
}