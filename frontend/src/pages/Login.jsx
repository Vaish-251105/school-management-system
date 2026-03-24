import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock, HelpCircle, ChevronRight, Loader2 } from "lucide-react";
import { FaApple, FaFacebook, FaQuestionCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import api from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: "student", label: "Student" },
    { id: "teacher", label: "Teacher" },
    { id: "parent", label: "Parent" },
    { id: "admin", label: "Admin" },
    { id: "accountant", label: "Accounts" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const data = response.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data));
      
      const r = data.role?.toLowerCase();
      if (r === "admin") navigate("/admin-dashboard");
      else if (r === "teacher") navigate("/teacher-dashboard");
      else if (r === "parent") navigate("/parent-dashboard");
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
      
      {/* DECORATIVE ELEMENTS */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-100 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl opacity-20"></div>

      {/* BRANDING SECTION */}
      <div className="flex flex-col items-center mb-10 relative z-10">
        <div className="bg-[#1e1b4b] p-5 rounded-[28px] shadow-2xl mb-6 flex items-center justify-center hover:scale-105 transition-transform duration-500">
           <GraduationCap className="text-white w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black text-black tracking-tight text-center uppercase">Smart School ERP</h1>
        <p className="text-gray-400 font-black text-[10px] uppercase tracking-[4px] mt-2 italic">Institutional Portal</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-[40px] shadow-3xl border border-gray-100 p-10 relative z-10 animate-in slide-in-from-bottom duration-700">
        
        {/* HELP TOOLTIP */}
        <div className="absolute -top-4 -right-4">
           <button 
              onClick={() => alert("MASTER ACCESS ACTIVATED\n\nPassword: 123 (All Roles)\n\n• Admin: admin@school.com\n• Staff: staff@school.com\n• Student: user@school.com")}
              className="bg-white text-indigo-600 p-3.5 rounded-2xl shadow-xl border border-gray-100 hover:bg-indigo-50 transition active:scale-90"
           >
              <HelpCircle className="w-6 h-6" />
           </button>
        </div>

        {/* ROLE SELECTOR */}
        <div className="bg-gray-50 p-2 rounded-3xl mb-8 flex flex-wrap gap-2 justify-center border border-gray-100">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setRole(r.id);
                setEmail(r.id === 'student' ? 'user@school.com' : `${r.id}@school.com`);
                setPassword("123");
              }}
              className={`flex-1 min-w-[30%] py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                role === r.id
                  ? "bg-[#1e1b4b] text-white shadow-xl"
                  : "text-gray-400 hover:text-black hover:bg-white"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5 px-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-indigo-600 transition" />
              <input
                type="email"
                required
                placeholder="user@school.edu"
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 focus:bg-white transition-all font-bold text-lg text-black placeholder-gray-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5 px-1">
             <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Password</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-indigo-600 transition" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 focus:bg-white transition-all font-bold text-lg text-black placeholder-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end pr-1">
            <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest cursor-pointer hover:underline">Forgot Password?</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1e1b4b] text-white font-black py-6 rounded-3xl shadow-2xl hover:bg-black transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 uppercase tracking-widest text-sm"
          >
            {loading ? <Loader2 className="animate-spin w-6 h-6" /> : (
              <>
                Login Now <ChevronRight className="w-6 h-6" />
              </>
            )}
          </button>

          <div className="relative flex items-center justify-center py-4">
            <div className="w-full border-t border-gray-50"></div>
            <span className="absolute bg-white px-4 text-[9px] font-black text-gray-300 uppercase tracking-[4px]">Social Connect</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
             <SocialBtn icon={<FcGoogle className="w-6 h-6" />} />
             <SocialBtn icon={<FaFacebook className="w-6 h-6 text-[#1877F2]" />} />
             <SocialBtn icon={<FaApple className="w-6 h-6 text-black" />} />
          </div>
        </form>

      </div>

      <div className="mt-12 text-center relative z-10">
        <p className="text-gray-400 font-bold text-[13px]">
          Don't have an account? 
          <span 
            onClick={() => navigate('/signup')} 
            className="text-indigo-600 font-black cursor-pointer hover:underline uppercase tracking-widest ml-2"
          >
            Register Here
          </span>
        </p>
      </div>

    </div>
  );
}

function SocialBtn({ icon }) {
  return (
    <button className="flex items-center justify-center p-4.5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition active:scale-95 shadow-sm">
       {icon}
    </button>
  );
}