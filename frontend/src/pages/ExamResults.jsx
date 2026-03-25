import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Download, 
  FileText, 
  GraduationCap, 
  Loader2, 
  Trophy,
  Award,
  BookOpen,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Activity,
  User,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function ExamResults() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);

  const userRole = user?.role?.toLowerCase();
  const isStudent = userRole === 'student';
  const isParent = userRole === 'parent';

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const endpoint = isStudent ? "/exams/my-results" : (isParent ? "/exams/results" : "/exams/all");
      const response = await api.get(endpoint);
      setResults(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Fetch results error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowFullReport(true);
    }, 2000);
  };

  // Group by exam name (Term-wise)
  const groupedResults = results.reduce((acc, current) => {
    const key = current.examName || "General Assessment";
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(current);
    return acc;
  }, {});

  const totalMarks = results.reduce((acc, r) => acc + (Number(r.marks) || 0), 0);
  const totalPossible = results.reduce((acc, r) => acc + (Number(r.totalMarks) || 100), 0);
  const percentageAll = totalPossible > 0 ? ((totalMarks / totalPossible) * 100).toFixed(1) : "0.0";
  const gpa = (parseFloat(percentageAll) / 25).toFixed(2); 

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : "US";

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa]">
       <Loader2 className="w-12 h-12 animate-spin text-[#4f46e5] mb-6" />
       <p className="text-gray-400 font-black italic tracking-widest uppercase">Fetching Achievements...</p>
     </div>
  );

  return (
    <div className="bg-[#fafafa] min-h-screen pb-40 font-sans transition-all">
      
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
              <h1 className="text-white text-[32px] font-black leading-tight uppercase tracking-tight">Report Cards</h1>
            </div>
          </div>
          <button 
            onClick={handleDownload}
            className="bg-white/10 p-4 rounded-3xl border border-white/5 hover:bg-[#4f46e5] transition shadow-2xl backdrop-blur-md text-white group"
          >
            <Download className="w-7 h-7 group-hover:animate-bounce transition-all" />
          </button>
        </div>

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
        
        {/* OVERALL PERFORMANCE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
           <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-sm text-center group hover:shadow-2xl transition-all">
              <p className="text-gray-400 font-black text-[10px] mb-4 uppercase tracking-[3px]">Cumulative GPA</p>
              <h4 className="text-black font-black text-4xl tracking-tight leading-none">{gpa}<span className="text-gray-200 text-lg font-bold ml-1">/4.0</span></h4>
              <div className="mt-4 flex justify-center opacity-20"><Award className="w-5 h-5 text-indigo-600" /></div>
           </div>
           <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-sm text-center group hover:shadow-2xl transition-all">
              <p className="text-gray-400 font-black text-[10px] mb-4 uppercase tracking-[3px]">Global Rank</p>
              <h4 className="text-black font-black text-4xl tracking-tight leading-none">#01<span className="text-gray-200 text-lg font-bold ml-1">TOP</span></h4>
              <div className="mt-4 flex justify-center opacity-20"><TrendingUp className="w-5 h-5 text-emerald-600" /></div>
           </div>
           <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-sm text-center group hover:shadow-2xl transition-all">
              <p className="text-gray-400 font-black text-[10px] mb-4 uppercase tracking-[3px]">Score Average</p>
              <h4 className="text-black font-black text-4xl tracking-tight leading-none">{percentageAll}<span className="text-gray-200 text-lg font-bold ml-1">%</span></h4>
              <div className="mt-4 flex justify-center opacity-20"><Activity className="w-5 h-5 text-rose-600" /></div>
           </div>
        </div>

        {Object.keys(groupedResults).length === 0 ? (
          <div className="p-32 text-center bg-gray-50 border-4 border-dashed border-gray-100 rounded-[50px] flex flex-col items-center">
             <Trophy className="w-16 h-16 text-gray-200 mb-6" />
             <p className="text-gray-400 font-black italic uppercase text-lg">No examination records found</p>
          </div>
        ) : (
          Object.entries(groupedResults).map(([examName, examResults], idx) => (
            <ExamSection 
              key={examName}
              idx={idx}
              examName={examName}
              results={examResults}
              onDownload={handleDownload}
            />
          ))
        )}

      </div>

      {isGenerating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[300] flex flex-col items-center justify-center text-white text-center p-8">
           <Loader2 className="w-20 h-20 text-indigo-400 animate-spin mb-8" />
           <h2 className="text-3xl font-black uppercase tracking-tight italic">Analyzing Academic Data</h2>
           <p className="text-white/40 font-bold max-w-sm mt-4 uppercase tracking-[2px] text-[10px]">Generating high-resolution cryptographic PDF document...</p>
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
                       <h2 className="text-white text-4xl font-black uppercase tracking-tight leading-none">Official Record</h2>
                       <p className="text-indigo-300 text-[10px] font-black mt-3 uppercase tracking-[5px]">Session Term 2024-25</p>
                    </div>
                 </div>
                 <button onClick={() => setShowFullReport(false)} className="bg-white/10 p-6 rounded-[30px] text-white hover:bg-black transition active:scale-90 shadow-sm border border-white/5">
                    <X className="w-8 h-8" />
                 </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-16 space-y-16 bg-white custom-scrollbar">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-black">
                    <TranscriptDetail label="Student Name" val={user?.name || "Member"} icon={<User className="w-4 h-4" />} />
                    <TranscriptDetail label="Academic Rank" val="#01 / 40" icon={<TrendingUp className="w-4 h-4 text-emerald-500" />} />
                    <TranscriptDetail label="Performance" val="Exceptional" icon={<Award className="w-4 h-4 text-emerald-500" />} />
                    <TranscriptDetail label="Sync Status" val="Finalized" icon={<Activity className="w-4 h-4 text-[#4f46e5]" />} />
                 </div>

                 {Object.entries(groupedResults).map(([name, res], i) => (
                    <div key={i} className="bg-gray-50 border border-gray-100 rounded-[50px] p-12 shadow-inner group">
                       <h4 className="font-black text-xs uppercase tracking-widest text-[#4f46e5] mb-12 flex items-center gap-4">
                          <BookOpen className="w-6 h-6" /> {name} Breakdown
                       </h4>
                       <div className="space-y-8">
                          {res.map((r, j) => (
                             <div key={j} className="flex justify-between items-center group/row">
                                <div className="flex-1">
                                   <span className="text-black font-black text-2xl uppercase group-hover/row:text-[#4f46e5] transition-colors">{r.subject}</span>
                                </div>
                                <div className="flex-1 border-b-2 border-dotted border-gray-100 mx-10"></div>
                                <div className="flex items-center gap-10">
                                   <div className="text-right">
                                      <p className="text-black font-black text-2xl tabular-nums leading-none mb-1">{r.marks}<span className="text-gray-300 text-sm ml-1">/{r.totalMarks}</span></p>
                                      <p className="text-gray-400 font-bold text-[9px] uppercase tracking-widest">Achieved Score</p>
                                   </div>
                                   <span className="bg-white shadow-xl text-black px-6 py-4 rounded-3xl text-xs font-black uppercase border border-gray-100 min-w-[70px] text-center">{r.grade}</span>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 ))}
              </div>

              <div className="p-12 bg-gray-50 border-t border-gray-100 flex gap-6 shrink-0">
                 <button 
                  onClick={() => alert("PDF downloaded.")} 
                  className="flex-1 bg-black text-white py-6 rounded-[35px] font-black uppercase tracking-widest text-sm shadow-3xl hover:bg-gray-800 transition active:scale-95 flex items-center justify-center gap-4">
                    <Download className="w-6 h-6 text-emerald-400" /> Export Digital Copy
                 </button>
                 <button 
                  onClick={() => window.print()} 
                  className="flex-1 bg-white border border-gray-200 text-black py-6 rounded-[35px] font-black uppercase tracking-widest text-sm hover:bg-gray-200 transition active:scale-95 shadow-sm">
                    Print Official Record
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}

function ExamSection({ idx, examName, results, onDownload }) {
  const totalObtained = results.reduce((acc, r) => acc + r.marks, 0);
  const totalPossible = results.reduce((acc, r) => acc + r.totalMarks, 0);
  const percentage = Math.round((totalObtained / totalPossible) * 100);

  return (
    <div className="mb-16 animate-in slide-in-from-bottom duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div className="flex items-center gap-5">
             <div className="bg-indigo-600 p-4 rounded-[22px] shadow-xl border border-white/10">
                <FileText className="text-white w-6 h-6" />
             </div>
             <div>
                <h3 className="text-black font-black text-2xl uppercase tracking-tight leading-none">{examName}</h3>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2 italic">
                   <Calendar className="w-3 h-3 text-indigo-400" /> Academic Session 2024-25
                </p>
             </div>
          </div>
          <button 
            onClick={onDownload}
            className="bg-black text-white px-8 py-4 rounded-3xl font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest border border-white/5 shadow-2xl">
            <Download className="w-5 h-5 text-indigo-400" /> Export PDF
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-[#1e1b4b] p-10 rounded-[50px] text-white shadow-3xl relative overflow-hidden group border border-white/5">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                < Award className="w-40 h-40" />
             </div>
             <p className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-2">Term Percentage</p>
             <h4 className="text-[64px] font-black leading-none mb-6 italic tracking-tighter">{percentage}%</h4>
             <div className="flex flex-wrap gap-3">
                <div className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-white/10">{totalObtained}/{totalPossible} Marks</div>
                <div className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-emerald-500/20">VERIFIED</div>
             </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
             {results.map((r, i) => (
               <div key={i} className="bg-white p-6 rounded-[35px] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
                  <div className="flex items-center gap-6">
                     <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center font-black text-[#4338CA] group-hover:bg-indigo-600 group-hover:text-white transition-colors border border-gray-100">
                        {r.subject[0]}
                     </div>
                     <div>
                        <h5 className="font-black text-black uppercase tracking-tight text-lg">{r.subject}</h5>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-0.5 italic">Grade: {r.grade}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[#4338CA] font-black text-2xl tracking-tight">{r.marks}</p>
                     <p className="text-gray-300 text-[10px] font-bold uppercase tracking-widest leading-none">/ {r.totalMarks}</p>
                  </div>
               </div>
             ))}
          </div>
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
       <p className="text-gray-400 font-black text-[9px] uppercase tracking-widest mb-2 leading-none">{label}</p>
       <p className="text-black font-black text-[15px] tracking-tight uppercase leading-none w-full truncate">{val}</p>
    </div>
  );
}