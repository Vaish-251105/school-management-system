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
  Star
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
    const roles = {
      admin: { color: "bg-rose-50 text-rose-600 border-rose-100", icon: <ShieldCheck className="w-3 h-3" />, label: "Administrator" },
      teacher: { color: "bg-blue-50 text-blue-600 border-blue-100", icon: <GraduationCap className="w-3 h-3" />, label: "Faculty" },
      student: { color: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: <UserIcon className="w-3 h-3" />, label: "Student" },
      accountant: { color: "bg-amber-50 text-amber-600 border-amber-100", icon: <Briefcase className="w-3 h-3" />, label: "Finance Staff" },
      parent: { color: "bg-indigo-50 text-indigo-600 border-indigo-100", icon: <Layers className="w-3 h-3" />, label: "Guardian" }
    };
    return roles[user.role] || { color: "bg-gray-50 text-gray-600 border-gray-100", icon: <UserIcon className="w-3 h-3" />, label: user.role };
  };

  const badge = getRoleBadge();

  return (
    <div className="bg-[#f9fafb] min-h-screen font-sans flex flex-col relative pb-10 text-gray-900">
      
      {/* BACKGROUND GRADIENT */}
      <div className="absolute top-0 left-0 w-full h-[350px] bg-gradient-to-br from-[#4338ca] to-[#4f46e5] z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      </div>

      {/* HEADER BAR */}
      <div className="relative z-10 px-6 pt-12 pb-4 flex justify-between items-center max-w-4xl mx-auto w-full">
        <button 
          onClick={() => navigate(-1)}
          className="bg-white/10 border border-white/20 p-2 rounded-xl text-white hover:bg-white/20 transition backdrop-blur-md">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-white text-lg font-bold">Account Intelligence</h1>
        <button 
          onClick={() => alert("Profile settings are restricted for your role.")}
          className="bg-white/10 border border-white/20 p-2 rounded-xl text-white hover:bg-white/20 transition backdrop-blur-md">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* BODY CONTENT */}
      <div className="max-w-xl mx-auto px-6 mt-8 w-full relative z-10 flex-1">
        
        {/* MAIN PROFILE CARD */}
        <div className="bg-white rounded-[32px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] mb-8 flex flex-col items-center text-center border border-white">
          
          <div className="relative mb-6">
            <div className="w-28 h-28 bg-gradient-to-tr from-indigo-50 to-white rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
               <img 
                 src={`https://ui-avatars.com/api/?name=${user.name || "User"}&background=4f46e5&color=ffffff&size=128`} 
                 alt="Avatar" 
                 className="w-full h-full object-cover"
               />
            </div>
            <div className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-lg ring-4 ring-white">
              <Verified className="w-6 h-6 text-indigo-600 fill-current bg-white rounded-full" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-2">{user.name || "User Name"}</h2>
          
          <div className="flex gap-2 justify-center mb-6">
            <div className={`flex items-center gap-1.5 border px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest ${badge.color}`}>
               {badge.icon}
               {badge.label}
            </div>
            <div className="bg-gray-900 text-white font-black text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest">PRO</div>
          </div>

          <div className="w-full grid grid-cols-3 gap-4 border-t border-gray-50 pt-6">
             <Stat val="ACTIVE" label="Status" />
             <Stat val="OCT 24" label="Term" />
             <Stat val="4.9" label="Score" icon={<Star className="w-3 h-3 text-amber-400 inline mb-1" />} />
          </div>
          
        </div>

        {/* PERSONAL INFO */}
        <div className="flex justify-between items-center mb-6 px-2">
          <h3 className="text-indigo-600 font-black text-[14px] uppercase tracking-widest">Institutional Credentials</h3>
          <span className="text-gray-300 text-[10px] font-bold">SECURED PHASE 2</span>
        </div>

        <div className="space-y-4 mb-8">
          <InfoTile icon={<Mail />} title="Verified Email" val={user.email || "N/A"} />
          <InfoTile icon={<Phone />} title="System Phone" val="+1 (555) 0123-4567" />
          <InfoTile icon={<UserIcon />} title="User Metadata" val={`Access Token: ${Math.random().toString(36).substring(7).toUpperCase()}`} />
          <InfoTile icon={<BadgeInfo />} title="Database UID" val={user._id || "ERP-UID-MOCKED"} />
        </div>

        {/* BUTTONS */}
        <div className="space-y-4 mb-10">
          <button 
            onClick={() => alert("Synchronizing Digital ID to Wallet...")}
            className="w-full bg-[#4f46e5] text-white py-5 rounded-[24px] font-bold shadow-2xl shadow-indigo-500/40 flex items-center justify-center gap-3 hover:bg-indigo-700 transition active:scale-95 group">
            <QrCode className="w-6 h-6 group-hover:rotate-12 transition-transform" /> Sync to Digital Wallet
          </button>
          
          <button 
            onClick={logout}
            className="w-full bg-white border-2 border-rose-50 text-rose-500 hover:bg-rose-50/50 py-5 rounded-[24px] font-black flex items-center justify-center gap-3 transition active:scale-95 tracking-wide shadow-sm">
            <LogOut className="w-5 h-5" /> Terminate Session
          </button>
        </div>

      </div>
    </div>
  );
}

function Stat({ val, label, icon }) {
  return (
    <div className="text-center group cursor-default">
      <p className="text-gray-900 font-black text-[16px] mb-0.5 group-hover:text-indigo-600 transition tracking-tighter">{icon}{val}</p>
      <p className="text-gray-400 font-black text-[9px] uppercase tracking-widest">{label}</p>
    </div>
  );
}

function InfoTile({ icon, title, val }) {
  return (
    <div className="bg-white p-5 rounded-[24px] flex items-center border border-gray-50 shadow-sm hover:shadow-md transition group overflow-hidden relative">
      <div className="absolute inset-0 bg-indigo-50/0 group-hover:bg-indigo-50/30 transition-colors pointer-events-none" />
      <div className="w-12 h-12 bg-white shadow-xl shadow-indigo-500/5 border border-gray-100 rounded-2xl flex items-center justify-center text-indigo-600 z-10">
        {React.cloneElement(icon, { className: "w-5 h-5" })}
      </div>
      <div className="ml-5 z-10 flex-1">
        <p className="text-gray-300 font-black text-[9px] mb-0.5 uppercase tracking-[0.15em]">{title}</p>
        <p className="text-gray-800 text-[15px] font-bold truncate">{val}</p>
      </div>
    </div>
  );
}
