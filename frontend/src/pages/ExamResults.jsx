import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Download,
  Check,
  MessageSquare,
  Receipt,
  X,
  Award,
  BookOpen,
  TrendingUp,
  Loader2,
  User,
  GraduationCap,
  Activity,
  Globe,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function ExamResults() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullReport, setShowFullReport] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await api.get("/exams/results");
        setResults(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const totalMarks = results.reduce((acc, r) => acc + (Number(r.marks) || 0), 0);
  const totalPossible = results.reduce((acc, r) => acc + (Number(r.totalMarks) || 100), 0);
  const percentage = totalPossible > 0 ? ((totalMarks / totalPossible) * 100).toFixed(1) : "0.0";
  const gpa = (parseFloat(percentage) / 25).toFixed(2); 

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : "US";

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa]">
       <Loader2 className="w-12 h-12 animate-spin text-[#4f46e5] mb-6" />
       <p className="text-gray-400 font-black italic tracking-widest uppercase">Loading Results...</p>
     </div>
  );

  return (
    <div className="bg-[#fafafa] min-h-screen pb-32 font-sans animate-in fade-in transition-all">
      
      {/* HEADER AREA */}
      <div className="bg-[#1e1b4b] px-8 pt-12 pb-16 rounded-b-[60px] shadow-2xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-5xl mx-auto relative z-10 flex justify-between items-center text-white">
          <div className="flex gap-6 items-center animate-in slide-in-from-bottom duration-700">
            <button 
              onClick={() => navigate(-1)} 
              className="bg-white/10 p-3.5 rounded-[22px] border border-white/5 hover:bg-white/20 transition shadow-2xl backdrop-blur-md active:scale-95 group">
              <ChevronLeft className="w-7 h-7 text-white" />
            </button>
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-1">Academic Records</p>
              <h1 className="text-white text-[32px] font-black leading-tight uppercase tracking-tight">Exam Results</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => alert("Downloading PDF...")} className="bg-white/10 p-4 rounded-3xl border border-white/5 hover:bg-white/20 transition group shadow-2xl backdrop-blur-md text-white">
               <Download className="w-7 h-7" />
             </button>
          </div>
        </div>

        {/* PROFILE BANNER */}
        <div className="max-w-5xl mx-auto mt-12 flex items-center gap-8 relative z-10 animate-in slide-in-from-bottom duration-1000">
           <div className="w-24 h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-[35px] flex items-center justify-center font-black text-white text-3xl shadow-inner group transition-transform">
              {initials}
           </div>
           <div>
              <h2 className="text-white text-3xl font-black uppercase tracking-tight">{user.name || "Student"}</h2>
              <div className="flex items-center gap-4 mt-2">
                 <span className="text-indigo-200 font-black text-[10px] uppercase tracking-[4px]">Verified Record</span>
                 <div className="bg-emerald-500 w-2 h-2 rounded-full animate-pulse"></div>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-12 w-full flex-1 text-black font-sans">
        
        {/* PERFORMANCE STATS */}
        <div className="grid grid-cols-3 gap-6 mb-12 animate-in fade-in transition-all">
           <ExamStat label="GPA" val={gpa} sub="/4.0" color="indigo" />
           <ExamStat label="PERCENTAGE" val={percentage} sub="%" color="teal" />
           <ExamStat label="ATTENDANCE" val="94.2" sub="%" color="amber" />
        </div>

        <div className="flex justify-between items-end mb-8">
           <h3 className="text-black font-black text-2xl tracking-tight uppercase leading-none">Subject Marks</h3>
           <div className="bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 flex items-center gap-2">
             <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse"></div>
             <span className="text-indigo-700 text-[10px] font-black uppercase tracking-widest leading-none">Synced</span>
           </div>
        </div>

        <div className="grid gap-6 mb-16">
          {results.length > 0 ? results.map((r, idx) => (
             <SubjectRow 
                key={r._id || idx}
                idx={idx}
                subject={r.subject} 
                grade={r.grade || "A"} 
                marks={r.marks} 
                total={r.totalMarks || 100} 
             />
          )) : (
            <div className="p-32 text-center bg-gray-50 border-4 border-dashed border-gray-100 rounded-[50px] flex flex-col items-center">
               <Globe className="w-16 h-16 text-gray-200 mb-6" />
               <p className="text-gray-400 font-black italic uppercase text-lg">No results found</p>
            </div>
          )}
        </div>

        <button 
          onClick={() => setShowFullReport(true)}
          className="w-full bg-black text-white py-6 rounded-[35px] font-black shadow-3xl hover:scale-105 active:scale-95 transition-all text-lg uppercase tracking-widest border border-white/10 group">
          <Receipt className="w-7 h-7 text-teal-400" /> View Full Report Card
        </button>

      </div>

      {/* REPORT CARD MODAL */}
      {showFullReport && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-3xl rounded-[60px] overflow-hidden shadow-3xl text-black flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
              <div className="bg-[#1e1b4b] p-10 flex justify-between items-center shrink-0 border-b border-indigo-900 shadow-2xl">
                 <div className="flex items-center gap-6">
                    <div className="bg-white/10 p-5 rounded-[28px] border border-white/10 text-white">
                       <Award className="w-10 h-10 text-emerald-400" />
                    </div>
                    <div>
                       <h2 className="text-white text-3xl font-black uppercase tracking-tight">Full Report Card</h2>
                       <p className="text-indigo-400 text-xs font-black mt-1 uppercase tracking-[3px]">Academic Session 2024</p>
                    </div>
                 </div>
                 <button onClick={() => setShowFullReport(false)} className="bg-white/10 p-5 rounded-3xl text-white hover:bg-black transition active:scale-90 shadow-sm border border-white/5">
                    <X className="w-8 h-8" />
                 </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar bg-white">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <TranscriptDetail label="Student Name" val={user.name || "N/A"} icon={<User className="w-4 h-4" />} />
                    <TranscriptDetail label="Grade" val="10-A" icon={<GraduationCap className="w-4 h-4" />} />
                    <TranscriptDetail label="Rank" val="#04 / 45" icon={<Award className="w-4 h-4 text-emerald-500" />} />
                    <TranscriptDetail label="Status" val="PASSED" icon={<Activity className="w-4 h-4 text-emerald-500" />} />
                 </div>

                 <div className="bg-gray-50 border border-gray-100 rounded-[45px] p-10 shadow-inner group">
                    <h4 className="font-black text-sm uppercase tracking-widest text-[#4f46e5] mb-8 flex items-center gap-3">
                       <BookOpen className="w-5 h-5" /> Detailed Assessment
                    </h4>
                    <div className="space-y-6">
                       {results.map((r, i) => (
                          <div key={i} className="flex justify-between items-center">
                             <span className="text-black font-black text-lg uppercase group-hover/row:text-[#4f46e5] transition-colors">{r.subject}</span>
                             <div className="flex-1 border-b-2 border-dotted border-gray-100 mx-6"></div>
                             <div className="flex items-center gap-6">
                                <span className="text-black font-black text-xl tabular-nums">{r.marks}<span className="text-gray-300 text-xs ml-1">/100</span></span>
                                <span className="bg-indigo-50 text-[#4f46e5] px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-indigo-100 min-w-[50px] text-center">{r.grade}</span>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-blue-50 p-10 rounded-[45px] relative overflow-hidden group border border-blue-100">
                    <h4 className="font-black text-blue-900 text-xl uppercase tracking-widest mb-4 flex items-center gap-3">
                       <Activity className="w-6 h-6 text-blue-600" /> Teacher Remarks
                    </h4>
                    <p className="text-blue-800/70 text-lg leading-relaxed italic font-bold mb-8">
                       "Consistently performed well in all subjects. Exceptional progress in logical thinking. Recommended for advanced workshops."
                    </p>
                    <div className="flex items-center gap-4 relative z-10">
                       <div className="w-12 h-12 rounded-2xl bg-blue-900 flex items-center justify-center font-black text-white">PR</div>
                       <div>
                          <p className="text-blue-900 font-black text-sm uppercase leading-none">Principal</p>
                          <p className="text-blue-400 text-[10px] font-black mt-1 uppercase italic">Verified</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-10 border-t border-gray-50 flex gap-4 shrink-0 bg-gray-50">
                 <button className="flex-1 bg-black text-white py-5 rounded-[28px] font-black uppercase tracking-widest text-[13px] shadow-2xl hover:bg-gray-800 transition active:scale-95 flex items-center justify-center gap-3">
                    <Download className="w-5 h-5" /> Download PDF
                 </button>
                 <button className="flex-1 bg-white border border-gray-100 text-black py-5 rounded-[28px] font-black uppercase tracking-widest text-[13px] hover:bg-gray-50 transition active:scale-95 shadow-sm">
                    Print Report
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}

function ExamStat({ label, val, sub, color }) {
  return (
    <div className={`bg-white border p-8 rounded-[45px] text-center shadow-lg transition-all duration-300 group hover:-translate-y-2`}>
      <p className="text-gray-400 font-black text-[9px] mb-4 uppercase tracking-widest">{label}</p>
      <div className={`font-black text-3xl tracking-tight leading-none tabular-nums text-black group-hover:scale-110 transition-transform`}>
        {val}<span className="text-gray-300 text-sm ml-1 font-bold">{sub}</span>
      </div>
    </div>
  );
}

function SubjectRow({ idx, subject, grade, marks, total }) {
  return (
    <div 
      className="bg-white p-7 rounded-[45px] border border-gray-100 shadow-sm flex items-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group animate-in fade-in"
      style={{ animationDelay: `${idx * 80}ms` }}
    >
      <div className="w-16 h-16 rounded-[24px] bg-[#1e1b4b] text-white font-black text-2xl flex items-center justify-center border-4 border-white shadow-xl uppercase">
        {subject[0]}
      </div>
      <div className="ml-8 flex-1">
         <h4 className="font-black text-black text-2xl tracking-tight leading-tight uppercase group-hover:text-[#4f46e5] transition-colors">{subject}</h4>
         <div className="flex items-center gap-3 mt-1 text-gray-400 font-bold text-[10px] uppercase">
            <span>Terminal Exam</span>
            <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
            <span className="text-emerald-500">Verified</span>
         </div>
      </div>
      <div className="text-right px-4">
         <p className="text-black font-black text-2xl tracking-tighter tabular-nums leading-none mb-1">{marks}<span className="text-gray-200 text-xs font-bold">/{total}</span></p>
         <span className="bg-indigo-50 text-[#4f46e5] px-3 py-1 rounded-xl text-[9px] font-black uppercase border border-indigo-100">Grade {grade}</span>
      </div>
      <ChevronRight className="w-8 h-8 text-gray-100 group-hover:text-black transition-colors" />
    </div>
  );
}

function TranscriptDetail({ label, val, icon }) {
  return (
    <div className="flex flex-col items-center text-center group">
       <div className="bg-gray-50 p-4 rounded-3xl mb-4 group-hover:bg-[#4f46e5] group-hover:text-white transition-all shadow-inner">
          {React.cloneElement(icon, { className: "w-6 h-6" })}
       </div>
       <p className="text-gray-400 font-black text-[9px] uppercase tracking-widest mb-1">{label}</p>
       <p className="text-black font-black text-[15px] tracking-tight truncate w-full uppercase leading-none">{val}</p>
    </div>
  );
}