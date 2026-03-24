import React, { useState, useEffect } from "react";
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  ChevronLeft, 
  CheckCircle,
  GraduationCap,
  Award,
  BookOpen,
  ClipboardList
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function StudentProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Data from backend login includes student details
  const name = user?.name || "Student Name";
  const email = user?.email || "n/a";
  const rollNo = user?.rollNumber || "2024-001";
  const className = user?.class || "10";
  const section = user?.section || "A";

  const bannerTheme = "bg-[#4338CA]";

  return (
    <div className="bg-[#fafafa] min-h-screen pb-40 font-sans animate-in fade-in transition-all">
      
      {/* PREMIUM HEADER - MOBILE STYLE */}
      <div className={`${bannerTheme} h-80 rounded-b-[80px] relative shadow-3xl overflow-hidden`}>
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
         <div className="absolute top-10 left-10 z-10">
            <button onClick={() => navigate(-1)} className="bg-white/10 p-4 rounded-3xl border border-white/5 hover:bg-white/20 transition backdrop-blur-md active:scale-95 group">
               <ChevronLeft className="w-8 h-8 text-white group-hover:-translate-x-1 transition-transform" />
            </button>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 -mt-24 relative z-50">
         
         {/* STUDENT CORE CARD */}
         <div className="bg-white rounded-[60px] shadow-3xl border border-gray-100 p-12 text-center relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
               <GraduationCap className="w-40 h-40 text-black" />
            </div>
            
            <div className="relative inline-block mb-10">
               <div className="w-48 h-48 rounded-[55px] bg-[#F9FAFB] border-8 border-white shadow-2xl flex items-center justify-center font-black text-[#1e1b4b] text-6xl group-hover:rotate-6 transition-transform">
                  {name[0].toUpperCase()}
               </div>
               <div className="absolute bottom-2 right-2 bg-emerald-500 p-3 rounded-2xl text-white shadow-2xl border-4 border-white">
                  <CheckCircle className="w-6 h-6" />
               </div>
            </div>

            <h2 className="text-4xl font-black text-black uppercase tracking-tight leading-none mb-3">{name}</h2>
            <div className={`mx-auto w-fit px-8 py-2.5 bg-indigo-50 text-indigo-600 rounded-2xl text-[11px] font-black uppercase tracking-[3px] shadow-sm border border-indigo-100`}>
               Class {className}-{section} • Roll {rollNo}
            </div>
         </div>

         {/* ACADEMIC STATS */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 animate-in slide-in-from-bottom duration-700">
            <StatCard label="Attendance" val="94%" color="indigo" icon={<ClipboardList />} />
            <StatCard label="Academic Rank" val="#04" color="emerald" icon={<Award />} />
            <StatCard label="Assignments" val="12/15" color="rose" icon={<BookOpen />} />
            <StatCard label="Portal Status" val="Active" color="amber" icon={<ShieldCheck />} />
         </div>

         {/* BIO DATA */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <InfoRow icon={<Mail />} label="Registered Email" val={email} />
            <InfoRow icon={<Phone />} label="Parent Contact" val="+91 91234 56789" />
            <InfoRow icon={<MapPin />} label="Residential Node" val="New Delhi, Sector 45" />
            <InfoRow icon={<Calendar />} label="Admission Date" val="20 Aug 2023" />
            <InfoRow icon={<User />} label="Father's Name" val="S. Kumar" />
            <InfoRow icon={<ShieldCheck />} label="Blood Group" val="O+ Positive" />
         </div>

      </div>
    </div>
  );
}

function StatCard({ label, val, color, icon }) {
   const variants = {
     indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
     emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
     rose: "bg-rose-50 text-rose-600 border-rose-100",
     amber: "bg-amber-50 text-amber-600 border-amber-100"
   };
   return (
      <div className={`p-8 rounded-[40px] border shadow-sm hover:shadow-xl transition-all ${variants[color]}`}>
         <div className="mb-4">{React.cloneElement(icon, { size: 24, className: "opacity-60" })}</div>
         <p className="text-[25px] font-black tracking-tight leading-none mb-2">{val}</p>
         <p className="text-[9px] font-black uppercase tracking-[3px] opacity-60 leading-none">{label}</p>
      </div>
   );
}

function InfoRow({ icon, label, val }) {
   return (
      <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-sm flex items-center gap-8 group hover:shadow-2xl transition-all">
         <div className="bg-gray-50 p-6 rounded-[30px] text-indigo-600 group-hover:bg-[#4338CA] group-hover:text-white transition-all shadow-inner">
            {React.cloneElement(icon, { size: 28 })}
         </div>
         <div className="flex-1 truncate">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-60">{label}</p>
            <p className="text-xl font-black uppercase tracking-tight text-black truncate">{val}</p>
         </div>
      </div>
   );
}