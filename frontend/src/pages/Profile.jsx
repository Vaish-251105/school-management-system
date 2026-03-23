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
  LogOut
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

  return (
    <div className="bg-[#f9fafb] min-h-screen font-sans flex flex-col relative pb-10">
      
      {/* BACKGROUND GRADIENT */}
      <div className="absolute top-0 left-0 w-full h-[350px] bg-gradient-to-br from-[#4338ca] to-[#4f46e5] z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      </div>

      {/* HEADER BAR */}
      <div className="relative z-10 px-6 pt-12 pb-4 flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)}
          className="bg-white/10 border border-white/20 p-2 rounded-xl text-white hover:bg-white/20 transition">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-white text-lg font-bold">User Profile</h1>
        <button 
          onClick={() => alert("Profile settings coming soon")}
          className="bg-white/10 border border-white/20 p-2 rounded-xl text-white hover:bg-white/20 transition">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* BODY CONTENT */}
      <div className="max-w-4xl mx-auto px-6 mt-8 w-full relative z-10 flex-1">
        
        {/* MAIN PROFILE CARD */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] mb-8 flex flex-col items-center text-center">
          
          <div className="relative mb-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
               {/* Placeholder Avatar image - matching design placeholder logic */}
               <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                 <UserAvatarIcon className="w-12 h-12 text-gray-400" />
               </div>
            </div>
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-sm">
              <Verified className="w-6 h-6 text-green-600 fill-current bg-white rounded-full" />
            </div>
          </div>

          <h2 className="text-[22px] font-bold text-gray-900 mb-3">{user.name || "User Name"}</h2>
          
          <div className="flex gap-2 justify-center mb-6">
            <span className="bg-blue-50 text-blue-600 font-bold text-[12px] px-3 py-1.5 rounded-lg uppercase tracking-wider">{user.role || "Member"}</span>
            <span className="bg-gray-50 text-gray-700 border border-gray-100 font-bold text-[12px] px-3 py-1.5 rounded-lg">Active</span>
          </div>

          <hr className="w-full border-gray-100 mb-6" />

          <div className="flex justify-around w-full">
            <Stat val="6" label="Classes" />
            <Stat val="8+" label="Years Exp" />
            <Stat val="4.9" label="Rating" />
          </div>
          
        </div>

        {/* PERSONAL INFO */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[#4f46e5] font-bold text-[15px]">Personal Information</h3>
          <button className="bg-gray-100 text-gray-800 font-bold text-[10px] px-3 py-1.5 rounded-xl hover:bg-gray-200 transition">EDIT</button>
        </div>

        <div className="space-y-3 mb-8">
          <InfoTile icon={<Mail />} title="Institutional Email" val={user.email || "N/A"} />
          <InfoTile icon={<Phone />} title="Contact Number" val="+1 (555) 0123-4567" />
          <InfoTile icon={<GraduationCap />} title="Primary Role" val={user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Student"} />
          <InfoTile icon={<BadgeInfo />} title="User ID" val={user._id || "EMP-000-000"} />
        </div>

        {/* PREFERENCES */}
        <h3 className="text-[#4f46e5] font-bold text-[15px] mb-4">System Preferences</h3>

        <div className="space-y-3 mb-8">
          <ToggleTile icon={<Bell className="w-5 h-5" />} title="Push Notifications" defaultOn={true} />
          <ToggleTile icon={<Moon className="w-5 h-5" />} title="Dark Mode Interface" defaultOn={false} />
          <ToggleTile icon={<Fingerprint className="w-5 h-5" />} title="Biometric Authentication" defaultOn={true} />
        </div>

        {/* BUTTONS */}
        <div className="space-y-4">
          <button 
            onClick={() => alert("Generating Digital ID...")}
            className="w-full bg-[#4f46e5] text-white py-4 rounded-full font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 hover:bg-indigo-600 transition tracking-wide">
            <QrCode className="w-5 h-5" /> Generate Digital ID
          </button>
          
          <button 
            onClick={logout}
            className="w-full bg-white border border-red-200 text-red-500 hover:bg-red-50 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition tracking-wide shadow-sm">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}

function Stat({ val, label }) {
  return (
    <div className="text-center">
      <p className="text-gray-900 font-bold text-[18px] mb-0.5">{val}</p>
      <p className="text-gray-400 font-bold text-[11px]">{label}</p>
    </div>
  );
}

function InfoTile({ icon, title, val }) {
  return (
    <div className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center hover:shadow-sm transition cursor-default">
      <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center text-[#4f46e5]">
        {React.cloneElement(icon, { className: "w-4 h-4" })}
      </div>
      <div className="ml-4">
        <p className="text-gray-400 font-bold text-[11px] mb-0.5">{title}</p>
        <p className="text-gray-900 text-[14px]">{val}</p>
      </div>
    </div>
  );
}

function ToggleTile({ icon, title, defaultOn }) {
  return (
    <div className="bg-white border border-gray-100 p-3.5 px-4 rounded-2xl flex items-center justify-between hover:shadow-sm transition">
      <div className="flex items-center gap-4 text-gray-500">
        {icon}
        <span className="text-gray-900 text-[14px]">{title}</span>
      </div>
      {/* Simple toggle mock */}
      <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${defaultOn ? 'bg-[#4f46e5]' : 'bg-gray-200 border border-gray-300'}`}>
        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${defaultOn ? 'translate-x-6' : 'translate-x-0 shadow-sm'}`}></div>
      </div>
    </div>
  );
}

function UserAvatarIcon(props) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
