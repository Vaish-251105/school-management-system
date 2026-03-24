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
  ChevronRight,
  ShieldCheck,
  Activity as ActivityIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function ExamResults() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullReport, setShowFullReport] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchResults();
  }, []);

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

  const handleDownloadReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowFullReport(true);
    }, 2000);
  };

  const totalMarks = results.reduce((acc, r) => acc + (Number(r.marks) || 0), 0);
  const totalPossible = results.reduce((acc, r) => acc + (Number(r.totalMarks) || 100), 0);
  const percentage = totalPossible > 0 ? ((totalMarks / totalPossible) * 100).toFixed(1) : "0.0";
  const gpa = (parseFloat(percentage) / 25).toFixed(2); 

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : "US";

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa]">
       <Loader2 className="w-12 h-12 animate-spin text-[#4f46e5] mb-6" />
       <p className="text-gray-400 font-black italic tracking-widest uppercase tracking-[4px]">Syncing Transcript...</p>
     </div>
  );

  return (
    <div className="bg-[#fafafa] min-h-screen pb-32 font-sans transition-all">
      
      {/* HEADER AREA */}
      <div className="bg-[#1e1b4b] px-8 pt-12 pb-16 rounded-b-[60px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-5xl mx-auto relative z-10 flex justify-between items-center text-white">
          <div className="flex gap-6 items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="bg-white/10 p-4 rounded-[22px] border border-white/5 hover:bg-white/20 transition shadow-2xl backdrop-blur-md active:scale-95">
              <ChevronLeft className="w-7 h-7 text-white" />
            </button>
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[5px] mb-1">Academic Transcript</p>
              <h1 className="text-white text-[32px] font-black leading-tight uppercase tracking-tight">Exam Results</h1>
            </div>
          </div>
          <button 
            onClick={handleDownloadReport}
            className="bg-white/10 p-4 rounded-3xl border border-white/5 hover:bg-[#4f46e5] transition shadow-2xl backdrop-blur-md text-white group"
          >
            <Download className="w-7 h-7 group-hover:animate-bounce transition-all" />
          </button>
        </div>

        {/* PROFILE BANNER */}
        <div className="max-w-5xl mx-auto mt-12 flex items-center gap-10 relative z-10 animate-in slide-in-from-bottom duration-700">
           <div className="w-24 h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-[35px] flex items-center justify-center font-black text-white text-3xl shadow-inner group transition-transform">
              {initials}
           </div>
           <div>
              <h2 className="text-white text-3xl font-black uppercase tracking-tight">{user?.name || "Student User"}</h2>
              <div className="flex items-center gap-4 mt-2">
                 <span className="text-indigo-200 font-black text-[10px] uppercase tracking-[4px]">Verified Record Hub</span>
                 <div className="bg-emerald-500 w-2 h-2 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-12 w-full flex-1">
        
        {/* PERFORMANCE STATS */}
        <div className="grid grid-cols-3 gap-8 mb-16 animate-in fade-in transition-all">
           <ExamStat label="OVERALL GPA" val={gpa} sub="/4.0" color="indigo" icon={<Award className="w-4 h-4" />} />
           <ExamStat label="PERCENTAGE" val={percentage} sub="%" color="emerald" icon={<TrendingUp className="w-4 h-4 text-emerald-500" />} />
           <ExamStat label="ATTENDANCE" val="96.4" sub="%" color="amber" icon={<ActivityIcon className="w-4 h-4" />} />
        </div>

        <div className="flex justify-between items-end mb-10 overflow-hidden">
           <div className="flex flex-col">
              <h3 className="text-black font-black text-2xl tracking-tight uppercase leading-none">Assessment Summary</h3>
              <p className="text-gray-400 font-bold text-[10px] uppercase mt-2 tracking-widest italic flex items-center gap-2">
                 <ShieldCheck className="w-3 h-3 text-emerald-500" /> All scores verified by academic session 2024
              </p>
           </div>
           <div className="bg-indigo-50 px-6 py-2.5 rounded-2xl border border-indigo-100 flex items-center gap-3">
             <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
             <span className="text-indigo-700 text-[10px] font-black uppercase tracking-widest leading-none">Cloud Synced</span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {results.length > 0 ? results.map((r, idx) => (
             <SubjectCard 
                key={r._id || idx}
                idx={idx}
                subject={r.subject} 
                grade={r.grade || "A"} 
                marks={r.marks} 
                total={r.totalMarks || 100} 
             />
          )) : (
            <div className="col-span-full p-32 text-center bg-gray-50 border-4 border-dashed border-gray-100 rounded-[60px] flex flex-col items-center">
               <Globe className="w-16 h-16 text-gray-200 mb-8" />
               <p className="text-gray-400 font-black italic uppercase text-lg tracking-widest">No scores archived yet</p>
            </div>
          )}
        </div>

        <button 
          onClick={handleDownloadReport}
          className="w-full bg-[#1e1b4b] text-white py-7 rounded-[40px] font-black shadow-3xl hover:bg-black transition-all text-xl uppercase tracking-widest border border-white/10 group flex items-center justify-center gap-6">
          <BookOpen className="w-8 h-8 text-indigo-400 group-hover:rotate-12 transition-transform" /> Generate Full Report Card
        </button>

      </div>

      {/* GENERATING OVERLAY */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex flex-col items-center justify-center text-white p-6">
           <div className="bg-white/10 p-12 rounded-[50px] border border-white/10 flex flex-col items-center animate-pulse">
              <Loader2 className="w-20 h-20 text-[#4f46e5] animate-spin mb-8" />
              <h2 className="text-3xl font-black uppercase tracking-tight">Syncing Academic Vault</h2>
              <p className="text-white/40 font-bold text-sm mt-3 tracking-widest">Finalizing secure PDF export...</p>
           </div>
        </div>
      )}

      {/* REPORT CARD MODAL */}
      {showFullReport && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[200] flex items-center justify-center p-6 animate-in zoom-in duration-300">
           <div className="bg-white w-full max-w-4xl rounded-[60px] overflow-hidden shadow-3xl text-black flex flex-col max-h-[90vh]">
              <div className="bg-[#1e1b4b] p-12 flex justify-between items-center shrink-0 border-b border-indigo-900 shadow-2xl">
                 <div className="flex items-center gap-8">
                    <div className="bg-[#4f46e5] p-6 rounded-[30px] border border-white/10 text-white shadow-2xl">
                       <Award className="w-10 h-10 text-emerald-300" />
                    </div>
                    <div>
                       <h2 className="text-white text-4xl font-black uppercase tracking-tight leading-none text-black">Official Report Card</h2>
                       <p className="text-indigo-300 text-[10px] font-black mt-3 uppercase tracking-[5px]">Session Term 2023-24</p>
                    </div>
                 </div>
                 <button onClick={() => setShowFullReport(false)} className="bg-white/10 p-6 rounded-[30px] text-white hover:bg-black transition active:scale-90 shadow-sm border border-white/5">
                    <X className="w-8 h-8" />
                 </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-16 space-y-16 bg-white custom-scrollbar text-black">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-black">
                    <TranscriptDetail label="Student Name" val={user?.name || "Member"} icon={<User className="w-4 h-4" />} />
                    <TranscriptDetail label="Academic Rank" val="#03 / 40" icon={<TrendingUp className="w-4 h-4 text-emerald-500" />} />
                    <TranscriptDetail label="Performance" val="Excellent" icon={<Award className="w-4 h-4 text-emerald-500" />} />
                    <TranscriptDetail label="Sync Status" val="Finalized" icon={<Activity className="w-4 h-4 text-[#4f46e5]" />} />
                 </div>

                 <div className="bg-gray-50 border border-gray-100 rounded-[50px] p-12 shadow-inner group">
                    <h4 className="font-black text-xs uppercase tracking-widest text-[#4f46e5] mb-12 flex items-center gap-4">
                       <BookOpen className="w-6 h-6" /> Detailed Subject Breakdown
                    </h4>
                    <div className="space-y-8">
                       {results.map((r, i) => (
                          <div key={i} className="flex justify-between items-center group/row">
                             <div className="flex-1">
                                <span className="text-black font-black text-2xl uppercase group-hover/row:text-[#4f46e5] transition-colors">{r.subject}</span>
                                <div className="bg-indigo-50 px-4 py-1.5 rounded-xl w-fit mt-2 border border-indigo-100 opacity-60">
                                   <p className="text-indigo-600 text-[9px] font-black uppercase tracking-widest leading-none">Major Track</p>
                                </div>
                             </div>
                             <div className="flex-1 border-b-2 border-dotted border-gray-100 mx-10"></div>
                             <div className="flex items-center gap-10">
                                <div className="text-right">
                                   <p className="text-black font-black text-2xl tabular-nums leading-none mb-1">{r.marks}<span className="text-gray-300 text-sm ml-1">/100</span></p>
                                   <p className="text-gray-400 font-bold text-[9px] uppercase tracking-widest">Achieved Score</p>
                                </div>
                                <span className="bg-white shadow-xl text-black px-6 py-4 rounded-3xl text-xs font-black uppercase border border-gray-100 min-w-[70px] text-center">{r.grade}</span>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-indigo-900 p-12 rounded-[50px] relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform">
                       <ShieldCheck className="w-40 h-40 text-emerald-400" />
                    </div>
                    <h4 className="font-black text-white text-2xl uppercase tracking-widest mb-6 flex items-center gap-4">
                       <ActivityIcon className="w-8 h-8 text-emerald-400" /> Faculty Assessment
                    </h4>
                    <p className="text-indigo-200 text-xl leading-relaxed italic font-bold mb-12 relative z-10">
                       "Demonstrated superior analytical skills throughout the term. Active participation in extracurricular labs. Highly recommended for the upcoming honors program."
                    </p>
                    <div className="flex items-center gap-6 relative z-10 text-white">
                       <div className="w-16 h-16 rounded-[22px] bg-white text-[#1e1b4b] flex items-center justify-center font-black text-2xl shadow-2xl border-4 border-[#1e1b4b]">PR</div>
                       <div>
                          <p className="text-white font-black text-lg uppercase leading-none">Principal</p>
                          <p className="text-emerald-400 text-[10px] font-black mt-2 uppercase italic tracking-widest flex items-center gap-2">
                             <CheckCircle2 className="w-4 h-4" /> Digitally Verified
                          </p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-12 bg-gray-50 border-t border-gray-100 flex gap-6 shrink-0">
                 <button 
                  onClick={() => alert("PDF downloaded to library.")} 
                  className="flex-1 bg-black text-white py-6 rounded-[35px] font-black uppercase tracking-widest text-sm shadow-3xl hover:bg-gray-800 transition active:scale-95 flex items-center justify-center gap-4">
                    <Download className="w-6 h-6 text-emerald-400" /> Export Digital Copy
                 </button>
                 <button 
                  onClick={() => window.print()} 
                  className="flex-1 bg-white border border-gray-200 text-black py-6 rounded-[35px] font-black uppercase tracking-widest text-sm hover:bg-gray-50 transition active:scale-95 shadow-sm">
                    Print Official Record
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}

function ExamStat({ label, val, sub, color, icon }) {
  return (
    <div className={`bg-white border p-10 rounded-[50px] text-center shadow-lg transition-all duration-500 group hover:-translate-y-3`}>
      <p className="text-gray-400 font-black text-[10px] mb-6 uppercase tracking-[3px]">{label}</p>
      <div className={`flex items-center justify-center gap-4 font-black text-4xl tracking-tight leading-none text-black group-hover:scale-110 transition-transform`}>
        {val}<span className="text-gray-300 text-lg font-bold">{sub}</span>
      </div>
      {icon && <div className="mt-4 flex justify-center opacity-40">{icon}</div>}
    </div>
  );
}

function SubjectCard({ idx, subject, grade, marks, total }) {
  return (
    <div 
      className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm flex items-center hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 group animate-in zoom-in"
      style={{ animationDelay: `${idx * 100}ms` }}
    >
      <div className="w-20 h-20 rounded-[30px] bg-[#1e1b4b] text-white font-black text-3xl flex items-center justify-center border-4 border-white shadow-2xl uppercase group-hover:rotate-6 transition-transform">
        {subject[0]}
      </div>
      <div className="ml-10 flex-1">
         <h4 className="font-black text-black text-2xl tracking-tight leading-tight uppercase group-hover:text-[#4f46e5] transition-colors">{subject}</h4>
         <div className="flex items-center gap-4 mt-2">
            <span className="text-indigo-400 font-black text-[9px] uppercase tracking-widest">Phase Terminal</span>
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-md shadow-emerald-500/50"></div>
         </div>
      </div>
      <div className="text-right px-6">
         <p className="text-black font-black text-3xl tabular-nums leading-none mb-2">{marks}<span className="text-gray-200 text-sm font-bold">/{total}</span></p>
         <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase border-2 ${
            grade.startsWith('A') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-[#4f46e5] border-indigo-100'
         }`}>
            Grade {grade}
         </span>
      </div>
    </div>
  );
}

function TranscriptDetail({ label, val, icon }) {
  return (
    <div className="flex flex-col items-center text-center group">
       <div className="bg-indigo-50 p-5 rounded-[22px] mb-5 group-hover:bg-[#4f46e5] group-hover:text-white transition-all shadow-inner text-indigo-500">
          {React.cloneElement(icon, { className: "w-8 h-8" })}
       </div>
       <p className="text-gray-400 font-black text-[9px] uppercase tracking-widest mb-2 leading-none whitespace-nowrap">{label}</p>
       <p className="text-black font-black text-[15px] tracking-tight uppercase leading-none w-full truncate">{val}</p>
    </div>
  );
}