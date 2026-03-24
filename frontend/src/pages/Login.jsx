import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock, HelpCircle, ChevronRight, Loader2, User, UserCheck, Shield, BookOpen, Landmark } from "lucide-react";
import { FaApple, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("student@school.com");
  const [password, setPassword] = useState("123");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: "student", label: "Student", icon: <User className="w-4 h-4" /> },
    { id: "teacher", label: "Teacher", icon: <BookOpen className="w-4 h-4" /> },
    { id: "parent", label: "Parent", icon: <UserCheck className="w-4 h-4" /> },
    { id: "admin", label: "Admin", icon: <Shield className="w-4 h-4" /> },
    { id: "accountant", label: "Accountant", icon: <Landmark className="w-4 h-4" /> },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password, role });
      const data = response.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data));
      
      // Sync with AuthContext
      login(data);

      const r = data.role?.toLowerCase();
      if (r === "admin") navigate("/admin-dashboard");
      else if (r === "teacher") navigate("/dashboard"); 
      else if (r === "parent") navigate("/dashboard");  
      else if (r === "accountant") navigate("/accountant");
      else navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] p-6 text-black font-sans relative overflow-hidden transition-all animate-in fade-in">
      
      {/* DECORATIVE ELEMENTS - MATCHING MOBILE BLUR */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full translate-y-1/3 -translate-x-1/3 blur-[100px] opacity-10"></div>

      {/* BRANDING SECTION - MATCHING MOBILE LOGO */}
      <div className="flex flex-col items-center mb-8 relative z-10 animate-in slide-in-from-top duration-700">
        <div className="bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] p-4 rounded-[24px] shadow-3xl mb-6 flex items-center justify-center hover:scale-110 transition-transform duration-500 ring-4 ring-white/50">
           <GraduationCap className="text-white w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-[#000000] tracking-tight text-center uppercase">Smart School ERP</h1>
        <p className="text-[#555555] font-bold text-[9px] uppercase tracking-[3px] mt-2 italic opacity-60 text-center">Modern Education Framework</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-[32px] shadow-3xl border border-gray-100 p-8 md:p-10 relative z-10 animate-in slide-in-from-bottom duration-700">
        
        {/* ROLE SELECTOR GRID - MATCHING MOBILE CHIPS */}
        <div className="bg-[#F9FAFB] p-2 rounded-[24px] mb-8 border border-gray-100">
          <div className="grid grid-cols-3 gap-2">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setRole(r.id);
                  setEmail(`${r.id === 'accountant' ? 'accountant' : r.id}@school.com`);
                  setPassword("123");
                }}
                className={`flex items-center justify-center gap-2 py-3.5 px-2 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 ${
                  role === r.id
                    ? "bg-[#4F46E5] text-white shadow-2xl scale-105"
                    : "text-[#555555] hover:text-black hover:bg-white"
                }`}
              >
                {r.icon}
                <span className="truncate">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-2.5 px-2">
            <label className="text-[10px] font-bold uppercase tracking-[1.5px] text-blue-600 flex items-center gap-2">
               <Mail className="w-3 h-3" /> Email Destination
            </label>
            <input
              type="email"
              required
              placeholder="e.g. faculty@school.edu"
              className="w-full px-6 py-4 bg-[#F9FAFB] border border-gray-100 rounded-[18px] outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 focus:bg-white transition-all font-bold text-base text-black placeholder-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2 px-2">
            <label className="text-[10px] font-bold uppercase tracking-[1.5px] text-blue-600 flex items-center gap-2">
               <Lock className="w-3 h-3" /> Secure Key
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-[#F9FAFB] border border-gray-100 rounded-[18px] outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 focus:bg-white transition-all font-bold text-base text-black placeholder-gray-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-end pr-2 text-black">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[1.5px] cursor-pointer hover:underline opacity-60">Forgot Recovery?</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group w-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white font-black py-5 rounded-[24px] shadow-xl hover:opacity-90 transition-all duration-500 flex items-center justify-center gap-4 active:scale-95 uppercase tracking-[2px] text-xs"
          >
            {loading ? <Loader2 className="animate-spin w-6 h-6" /> : (
              <>
                Initialize Access <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>

          <div className="relative flex items-center justify-center py-4">
            <div className="w-full border-t border-gray-50"></div>
            <span className="absolute bg-white px-4 text-[9px] font-bold text-gray-300 uppercase tracking-[4px]">External Nodes</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
             <SocialBtn icon={<FcGoogle className="w-6 h-6" />} />
             <SocialBtn icon={<FaFacebook className="w-6 h-6 text-[#1877F2]" />} />
             <SocialBtn icon={<FaApple className="w-6 h-6 text-black" />} />
          </div>
        </form>

      </div>

      <div className="mt-12 text-center relative z-10 animate-in slide-in-from-bottom duration-1000">
        <p className="text-[#555555] font-bold text-[13px]">
          New to the portal? 
          <span 
            onClick={() => navigate('/signup')} 
            className="text-blue-600 font-bold cursor-pointer hover:underline uppercase tracking-[1px] ml-2"
          >
            Establish Account
          </span>
        </p>
      </div>

    </div>
  );
}

function SocialBtn({ icon }) {
  return (
    <button className="flex items-center justify-center p-5 border border-[#E5E7EB] rounded-[24px] hover:bg-[#F9FAFB] transition-all active:scale-90 shadow-sm bg-white hover:shadow-xl">
       {icon}
    </button>
  );
}