import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Download,
  Check,
  MessageSquare,
  Receipt
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function ExamResults() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
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

  const totalMarks = results.reduce((acc, r) => acc + r.marks, 0);
  const totalPossible = results.reduce((acc, r) => acc + r.totalMarks, 0);
  const percentage = totalPossible > 0 ? ((totalMarks / totalPossible) * 100).toFixed(1) : "0.0";
  const gpa = (parseFloat(percentage) / 25).toFixed(2); // Rough conversion for demo

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('') : "JD";


  return (
    <div className="bg-[#f9fafb] min-h-screen font-sans flex flex-col pb-10 text-gray-900">
      
      {/* HEADER AREA */}
      <div className="bg-[#f9fafb] px-6 pt-12 pb-4 flex justify-between items-center z-10 sticky top-0">
        <button 
          onClick={() => navigate(-1)}
          className="text-gray-900 p-2 -ml-2 hover:bg-gray-100 rounded-full transition">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-gray-900 text-lg font-bold">Exam Results</h1>
        <button 
          onClick={() => alert("Downloading digital report card...")}
          className="text-[#4f46e5] p-2 -mr-2 hover:bg-indigo-50 rounded-full transition">
          <Download className="w-6 h-6" />
        </button>
      </div>

      {/* BODY CONTENT */}
      <div className="max-w-4xl mx-auto px-6 mt-2 w-full flex-1">
        
        {/* BANNER */}
        <div className="bg-[#4f46e5] rounded-3xl p-6 shadow-[0_8px_15px_rgba(79,70,229,0.3)] flex items-center mb-6">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0">
            <span className="text-[#4f46e5] font-bold text-[20px]">{initials}</span>
          </div>
          <div className="ml-5 flex-1">
            <h2 className="text-white text-[20px] font-bold">{user.name || "John Doe"}</h2>
            <p className="text-white/80 text-[12px] mt-1 tracking-wide">ID: #{user._id?.slice(-6).toUpperCase() || "STU90210"} • Class 10-B</p>
            <div className="inline-block bg-white/20 px-3 py-1.5 rounded-full mt-3">
              <span className="text-white font-bold text-[10px]">Final Term Examination 2023-24</span>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="flex gap-2 mb-6">
          <StatBox label="GPA" val="3.85" sub="/ 4.0" />
          <StatBox label="Percentage" val="89.4" sub="%" />
          <StatBox label="Rank" val="4th" sub="/ 45" />
        </div>

        {/* BAR CHART MOCK */}
        <div className="bg-white border border-gray-100 rounded-[20px] p-5 mb-6 shadow-sm">
          <h3 className="font-bold text-gray-900 text-[16px] mb-8">Subject Wise Analysis</h3>
          <div className="flex justify-around items-end h-[140px] px-2 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-gray-100"></div>
            <Bar label="Math" ht="85%" />
            <Bar label="Sci" ht="95%" />
            <Bar label="Eng" ht="70%" />
            <Bar label="His" ht="80%" />
            <Bar label="CS" ht="100%" />
            <Bar label="Art" ht="75%" />
          </div>
        </div>

        {/* DETAILED MARKS HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-900 font-bold text-[18px]">Detailed Marks</h3>
          <button 
            onClick={() => alert("Showing marks for Term 2. Click to toggle Term 1.")}
            className="bg-[#4f46e5] text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-indigo-600 transition">
            <Check className="w-3.5 h-3.5" /> Term 2
          </button>
        </div>

        {/* DETAILED MARKS LIST */}
        <div className="bg-white border border-gray-100 rounded-[20px] shadow-sm mb-6 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center">Loading results...</div>
          ) : results.length > 0 ? (
            results.map((r, idx) => (
              <React.Fragment key={r._id}>
                <MarkRow 
                  init={r.subject[0]} 
                  sub={r.subject} 
                  grade={r.grade} 
                  marks={r.marks} 
                  status={r.marks >= (r.totalMarks * 0.4) ? "Pass" : "Fail"} 
                />
                {idx < results.length - 1 && <div className="h-px w-full bg-gray-100"></div>}
              </React.Fragment>
            ))
          ) : (
            <>
              <MarkRow init="M" sub="Mathematics" grade="A" marks="85" status="Pass" />
              <div className="h-px w-full bg-gray-100"></div>
              <MarkRow init="S" sub="Science" grade="A+" marks="92" status="Pass" />
            </>
          )}
        </div>

        {/* REMARKS */}
        <div className="bg-indigo-50/50 border border-indigo-100/60 rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-[#4f46e5]" />
            <h4 className="text-[#4f46e5] font-bold text-[14px]">Teacher's Remarks</h4>
          </div>
          <p className="text-gray-800 text-[13px] leading-relaxed">
            {user.name?.split(' ')[0] || "Student"} has shown exceptional growth in logical reasoning and computer sciences. Encouraged to participate more in English literary activities to improve verbal communication.
          </p>
        </div>

        {/* FULL BUTTON */}
        <button 
          onClick={() => alert("Opening Full Screen Report Card View...")}
          className="w-full bg-[#4f46e5] text-white py-4 rounded-full font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 hover:bg-indigo-600 transition tracking-wide">
          <Receipt className="w-5 h-5" /> View Full Report Card
        </button>

      </div>
    </div>
  );
}

function StatBox({ label, val, sub }) {
  return (
    <div className="flex-1 bg-white border border-gray-100 p-4 rounded-2xl text-center shadow-sm">
      <p className="text-gray-400 font-bold text-[11px] mb-2">{label}</p>
      <p className="text-gray-900 font-bold text-[18px]">{val} <span className="font-medium text-[14px]">{sub}</span></p>
    </div>
  );
}

function Bar({ label, ht }) {
  return (
    <div className="flex flex-col items-center z-10 relative group cursor-pointer hover:-translate-y-1 transition-transform">
      <div 
        className="w-8 bg-[#4f46e5] rounded-[6px] transition-all group-hover:bg-indigo-500"
        style={{ height: ht }}
      ></div>
      <span className="text-gray-400 font-bold text-[10px] mt-2">{label}</span>
    </div>
  );
}

function MarkRow({ init, sub, grade, marks, status }) {
  return (
    <div className="p-4 flex items-center hover:bg-gray-50 transition">
      <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-sm text-[#4f46e5] font-bold text-[16px]">
        {init}
      </div>
      <div className="ml-4 flex-1">
        <h4 className="font-bold text-gray-900 text-[15px]">{sub}</h4>
        <p className="text-gray-500 text-[12px] mt-0.5">Grade: {grade}</p>
      </div>
      <div className="text-right">
        <p className="text-gray-900 font-bold text-[15px]">{marks}<span className="text-[12px] font-bold">/100</span></p>
        <p className="text-[#3e6840] font-bold text-[9px] mt-1 font-mono tracking-tighter opacity-80 uppercase">{status}</p>
      </div>
    </div>
  );
}