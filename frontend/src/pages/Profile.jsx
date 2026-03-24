import React, { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Shield, 
  Phone, 
  MapPin, 
  Calendar, 
  ChevronLeft, 
  LogOut,
  Camera,
  Edit3,
  CheckCircle,
  Clock,
  Briefcase,
  GraduationCap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const role = user?.role?.toLowerCase() || "student";

  const bannerGradients = {
    admin: "bg-[#1e1b4b]",
    teacher: "bg-[#4F46E5]",
    student: "bg-[#4338CA]",
    parent: "bg-rose-600",
    accountant: "bg-emerald-600"
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-[#fafafa] min-h-screen pb-40 font-sans animate-in fade-in transition-all">
      
      {/* HEADER BANNER - FULL VISIBILITY */}
      <div className={`${bannerGradients[role]} h-80 rounded-b-[80px] relative shadow-3xl overflow-hidden`}>
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
         <div className="absolute top-10 left-10 z-10">
            <button onClick={() => navigate(-1)} className="bg-white/10 p-4 rounded-3xl border border-white/5 hover:bg-white/20 transition backdrop-blur-md active:scale-95 group">
               <ChevronLeft className="w-8 h-8 text-white group-hover:-translate-x-1 transition-transform" />
            </button>
         </div>
         <div className="absolute bottom-10 left-10 right-10 flex flex-col items-center">
            <h1 className="text-white text-3xl font-black uppercase tracking-widest opacity-20">Identity Matrix</h1>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 -mt-24 relative z-50">
         
         {/* PROFILE CORE CARD */}
         <div className="bg-white rounded-[60px] shadow-3xl border border-gray-100 p-12 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-700">
               <Shield className="w-40 h-40 text-black" />
            </div>
            
            <div className="relative inline-block mb-10">
               <div className="w-48 h-48 rounded-[55px] bg-[#F9FAFB] border-8 border-white shadow-2xl flex items-center justify-center font-black text-[#1e1b4b] text-6xl group-hover:rotate-6 transition-transform">
                  {user?.name?.[0] || "U"}
               </div>
               <button className="absolute bottom-2 right-2 bg-[#4F46E5] p-5 rounded-3xl text-white shadow-2xl border-4 border-white hover:scale-110 active:scale-90 transition-all">
                  <Camera className="w-7 h-7" />
               </button>
            </div>

            <h2 className="text-4xl font-black text-black uppercase tracking-tight leading-none mb-3">{user?.name || "Member Name"}</h2>
            <div className={`mx-auto w-fit px-8 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[3px] shadow-sm border ${role === 'admin' ? 'bg-[#1e1b4b] text-white border-white/10' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
               {role} Node
            </div>
            
            <p className="text-gray-400 font-bold text-sm mt-8 leading-relaxed max-w-md mx-auto italic opacity-60">Verified institutional identification for Smart School ERP v2.0. All access logs are encrypted and monitored.</p>
         </div>

         {/* DETAILS GRID */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            
            <DetailCard icon={<Mail />} label="Email Destination" val={user?.email || "n/a"} />
            <DetailCard icon={<Shield />} label="Security Level" val={role.toUpperCase()} />
            <DetailCard icon={<Phone />} label="Communication Line" val="+91 98765-43210" />
            <DetailCard icon={<Calendar />} label="Registration Date" val="24 March 2024" />
            
            {role === 'student' && (
              <>
                <DetailCard icon={<GraduationCap />} label="Academic Node" val="Class 10-A" />
                <DetailCard icon={<CheckCircle />} label="Portal Status" val="Authorized" />
              </>
            )}

            {role === 'teacher' && (
              <>
                <DetailCard icon={<Briefcase />} label="Faculty Domain" val="Sr. Mathematics" />
                <DetailCard icon={<Clock />} label="Expertise Rank" val="8.5 Years" />
              </>
            )}
         </div>

         <div className="mt-16 flex flex-col sm:flex-row gap-6">
            <button className="flex-1 bg-black text-white p-8 rounded-[35px] font-black text-sm uppercase tracking-[4px] shadow-3xl hover:bg-[#1e1b4b] transition-all active:scale-95 flex items-center justify-center gap-4 group">
               <Edit3 className="w-6 h-6 group-hover:rotate-12 transition-transform" /> Modify Profile
            </button>
            <button 
               onClick={handleLogout}
               className="flex-1 bg-rose-50 text-rose-600 p-8 rounded-[35px] font-black text-sm uppercase tracking-[4px] border border-rose-100 hover:bg-rose-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-4 group shadow-xl shadow-rose-500/5">
               <LogOut className="w-6 h-6 group-hover:-translate-x-1 transition-transform" /> Exit Session
            </button>
         </div>

      </div>

      <div className="fixed top-0 left-0 w-full h-2 bg-[#4F46E5] z-[300]"></div>

    </div>
  );
}

function DetailCard({ icon, label, val }) {
  return (
    <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group flex items-center gap-8 text-black">
       <div className="bg-indigo-50 p-6 rounded-[30px] text-indigo-600 group-hover:bg-[#4F46E5] group-hover:text-white transition-all shadow-inner">
          {React.cloneElement(icon, { size: 28 })}
       </div>
       <div className="flex-1 truncate">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-60">{label}</p>
          <p className="text-xl font-black uppercase tracking-tight text-black truncate">{val}</p>
       </div>
    </div>
  );
}
