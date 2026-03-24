import React from "react";
import { 
  ChevronLeft, 
  MoreVertical,
  Verified,
  Mail,
  Phone,
  GraduationCap,
  BadgeInfo,
  Bell,
  Moon,
  Fingerprint,
  QrCode,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Briefcase,
  Layers,
  Star,
  Globe,
  Activity,
  Award,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const logout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getRoleBadge = () => {
    const r = user.role?.toLowerCase() || 'student';
    const roles = {
      admin: { color: "bg-red-50 text-red-600 border-red-100", icon: <ShieldCheck className="w-4 h-4" />, label: "Administrator" },
      teacher: { color: "bg-indigo-50 text-indigo-600 border-indigo-100", icon: <GraduationCap className="w-4 h-4" />, label: "Teacher" },
      student: { color: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: <UserIcon className="w-4 h-4" />, label: "Student" },
      accountant: { color: "bg-amber-50 text-amber-600 border-amber-100", icon: <Briefcase className="w-4 h-4" />, label: "Accountant" },
      parent: { color: "bg-purple-50 text-purple-600 border-purple-100", icon: <Layers className="w-4 h-4" />, label: "Parent" }
    };
    return roles[r] || { color: "bg-gray-50 text-gray-600 border-gray-100", icon: <UserIcon className="w-4 h-4" />, label: user.role };
  };

  const badge = getRoleBadge();

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans animate-in fade-in transition-all pb-24">
      
      {/* HEADER BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-[#1e1b4b] z-0 rounded-b-[60px] shadow-2xl overflow-hidden">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]"></div>
      </div>

      {/* HEADER BAR */}
      <div className="relative z-10 px-8 pt-12 pb-6 max-w-5xl mx-auto flex justify-between items-center text-white">
        <button 
          onClick={() => navigate(-1)}
          className="bg-white/10 p-3.5 rounded-[22px] border border-white/5 hover:bg-white/20 transition shadow-2xl backdrop-blur-md active:scale-95 group">
          <ChevronLeft className="w-7 h-7 text-white" />
        </button>
        <h1 className="text-white text-xl font-black uppercase tracking-[3px]">My Profile</h1>
        <button 
          onClick={() => alert("Profile editing is currently locked.")}
          className="bg-white/10 p-3.5 rounded-[22px] border border-white/5 hover:bg-white/20 transition shadow-2xl">
          <MoreVertical className="w-7 h-7 text-white" />
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-12 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT: IDENTITY CARD */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-[50px] p-10 shadow-3xl flex flex-col items-center text-center border border-gray-100 animate-in slide-in-from-bottom duration-700">
                <div className="relative mb-10">
                  <div className="w-40 h-40 bg-[#1e1b4b] rounded-[45px] border-[6px] border-white shadow-2xl overflow-hidden p-1">
                     <img 
                       src={`https://ui-avatars.com/api/?name=${user.name || "UN"}&background=1e1b4b&color=ffffff&size=256&bold=true`} 
                       alt="Avatar" 
                       className="w-full h-full object-cover rounded-[35px]"
                     />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-emerald-500 p-4 rounded-2xl shadow-2xl border-4 border-white">
                     <Verified className="w-7 h-7 text-white" />
                  </div>
                </div>

                <h2 className="text-3xl font-black text-black tracking-tight leading-tight uppercase">{user.name || "User"}</h2>
                <div className={`mt-6 inline-flex items-center gap-2 border-2 px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest ${badge.color}`}>
                   {badge.icon}
                   {badge.label}
                </div>

                <div className="w-full grid grid-cols-2 gap-4 mt-12 pt-8 border-t border-gray-50">
                   <div className="text-center">
                      <p className="text-black font-black text-xl mb-0.5 tracking-tight">1,240</p>
                      <p className="text-gray-400 font-bold text-[9px] uppercase tracking-widest">Points</p>
                   </div>
                   <div className="text-center">
                      <p className="text-black font-black text-xl mb-0.5 tracking-tight">98%</p>
                      <p className="text-gray-400 font-bold text-[9px] uppercase tracking-widest">Attendance</p>
                   </div>
                </div>

                <button 
                  onClick={logout}
                  className="mt-10 w-full bg-red-50 text-red-500 py-6 rounded-3xl font-black flex items-center justify-center gap-3 transition-all hover:bg-red-500 hover:text-white active:scale-95 shadow-sm uppercase tracking-widest text-[12px]">
                  <LogOut className="w-5 h-5" /> Logout Session
                </button>
             </div>
          </div>

          {/* RIGHT: DETAILS & SECURITY */}
          <div className="lg:col-span-2 space-y-8 animate-in slide-in-from-bottom duration-1000">
             
             {/* QUICK STATS */}
             <div className="bg-white/10 backdrop-blur-md rounded-[50px] p-8 border border-white/10 grid grid-cols-3 gap-6 shadow-2xl">
                <ProfileStat icon={<Award className="w-6 h-6" />} val="Gold" label="Status" color="text-amber-400" />
                <ProfileStat icon={<Globe className="w-6 h-6" />} val="Active" label="Network" color="text-teal-400" />
                <ProfileStat icon={<Activity className="w-6 h-6" />} val="Live" label="Cloud" color="text-emerald-400" />
             </div>

             <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-3xl text-black">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-black font-black text-2xl tracking-tight uppercase tracking-widest leading-none">Profile Details</h3>
                   <div className="bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 flex items-center gap-2">
                     <div className="w-2.5 h-2.5 bg-[#4f46e5] rounded-full animate-pulse"></div>
                     <span className="text-[#4f46e5] text-[10px] font-black uppercase tracking-widest leading-none">Synced</span>
                   </div>
                </div>

                <div className="grid gap-6">
                   <InfoField icon={<Mail className="w-5 h-5" />} title="Email Address" val={user.email || "node@school.edu"} />
                   <InfoField icon={<ShieldCheck className="w-5 h-5" />} title="Student ID" val={user._id || "SMS-000"} />
                   <InfoField icon={<BadgeInfo className="w-5 h-5" />} title="Assigned Role" val={user.role?.toUpperCase() || "USER"} />
                </div>
             </div>

             {/* SECURITY BLOCK */}
             <div className="bg-black p-10 rounded-[50px] shadow-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition duration-700">
                   <ShieldCheck className="w-32 h-32 text-indigo-400" />
                </div>
                <h4 className="text-white text-2xl font-black tracking-tight uppercase mb-4 relative z-10">Security Center</h4>
                <p className="text-white/40 font-bold text-sm leading-relaxed mb-10 relative z-10">Your account is secured with 256-bit encryption. Contact the administrator hub for any changes to your core identity data.</p>
                <div className="flex flex-wrap gap-4 relative z-10">
                   <button 
                     onClick={() => alert("Digital Identity Key is being generated...")}
                     className="bg-[#4f46e5] text-white px-8 py-4 rounded-[22px] font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-indigo-700 transition active:scale-95 flex items-center gap-3">
                      <QrCode className="w-5 h-5" /> Identity Key
                   </button>
                   <button 
                     onClick={() => alert("Redirecting to password reset flow...")}
                     className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-[22px] font-black text-[11px] uppercase tracking-widest hover:bg-white/10 transition active:scale-95">
                      Reset Password
                   </button>
                </div>
             </div>

          </div>

        </div>

      </div>

    </div>
  );
}

function ProfileStat({ icon, val, label, color }) {
  return (
    <div className="flex flex-col items-center text-center group">
       <div className={`${color} bg-white/5 p-4 rounded-3xl mb-4 group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-inner`}>
         {icon}
       </div>
       <p className="text-white font-black text-lg tracking-tight leading-none mb-1 uppercase">{val}</p>
       <p className="text-white/40 font-black text-[9px] uppercase tracking-widest">{label}</p>
    </div>
  );
}

function InfoField({ icon, title, val }) {
  return (
    <div className="flex items-center p-6 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-all rounded-[30px] group">
       <div className="w-14 h-14 bg-indigo-50 text-[#4f46e5] rounded-[24px] flex items-center justify-center shrink-0 border border-indigo-100 group-hover:bg-[#4f46e5] group-hover:text-white transition-all shadow-sm">
          {icon}
       </div>
       <div className="ml-8 flex-1">
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">{title}</p>
          <p className="text-black font-black text-lg tracking-tight leading-none group-hover:text-[#4f46e5] transition-colors">{val}</p>
       </div>
       <ChevronRight className="w-8 h-8 text-gray-100 group-hover:text-black transition-colors" />
    </div>
  );
}
