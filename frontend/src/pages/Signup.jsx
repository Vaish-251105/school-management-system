import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock, User, UserPlus, ArrowLeft, Loader2, ChevronLeft } from "lucide-react";
import api from "../utils/api";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [loading, setLoading] = useState(false);
  const [selectedRoleIdx, setSelectedRoleIdx] = useState(0);

  const roles = [
    { id: "student", label: "Student" },
    { id: "teacher", label: "Teacher" },
    { id: "parent", label: "Parent" },
    { id: "admin", label: "Admin" },
    { id: "accountant", label: "Accountant" },
  ];

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await api.post("/auth/register", { 
        name, 
        email, 
        password, 
        role: roles[selectedRoleIdx].id 
      });
      if (res.data.message?.toLowerCase().includes('success') || res.status === 201) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        alert(res.data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] p-6 text-black font-sans relative overflow-hidden transition-all animate-in fade-in">
      
      {/* HEADER BAR - MATCHING MOBILE */}
      <div className="absolute top-0 left-0 w-full p-6 flex items-center z-50">
         <button 
           onClick={() => navigate('/login')}
           className="bg-white p-3 rounded-2xl shadow-lg border border-gray-100 hover:bg-gray-50 transition active:scale-90"
         >
            <ChevronLeft className="w-5 h-5 text-black" />
         </button>
      </div>

      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] opacity-10"></div>

      {/* BRANDING */}
      <div className="flex flex-col items-center mb-8 text-center relative z-10 animate-in slide-in-from-top duration-700">
        <div className="bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] p-4 rounded-[24px] shadow-3xl mb-6 flex items-center justify-center hover:rotate-6 transition-transform">
          <UserPlus className="text-white w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-black tracking-tighter uppercase leading-none mb-2">Create Account</h1>
        <p className="text-[#555555] text-[9px] font-bold uppercase tracking-[3px] italic opacity-60">Join our modern community</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-[32px] shadow-3xl border border-gray-100 p-8 md:p-10 relative z-10 animate-in slide-in-from-bottom duration-700 overflow-hidden">
        
        {/* ROLE SELECTOR CHIPS - EXACT FLUTTER MATCH */}
        <div className="mb-8">
          <label className="block text-[10px] font-bold text-blue-600 uppercase tracking-[2px] mb-4 px-2">
            I AM A...
          </label>
          <div className="bg-[#F9FAFB] p-2 rounded-[24px] border border-gray-100 grid grid-cols-3 gap-2">
            {roles.map((r, idx) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRoleIdx(idx)}
                className={`py-3 px-1 text-[9px] font-bold rounded-xl uppercase tracking-wider transition-all duration-300 ${
                  selectedRoleIdx === idx
                    ? "bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white shadow-xl scale-105"
                    : "text-[#555555] hover:text-black hover:bg-white"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-1.5 px-2">
            <label className="text-[10px] font-bold uppercase tracking-[1.5px] text-blue-600">Identity Label</label>
            <div className="relative group">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-500 transition" />
              <input
                type="text"
                required
                placeholder="Full Legal Name"
                className="w-full pl-12 pr-6 py-4 bg-[#F9FAFB] border border-gray-100 rounded-[18px] outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 focus:bg-white transition-all font-bold text-base text-black placeholder-gray-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5 px-2">
            <label className="text-[10px] font-bold uppercase tracking-[1.5px] text-blue-600">Email Destination</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-500 transition" />
              <input
                type="email"
                required
                placeholder="user@school.edu"
                className="w-full pl-12 pr-6 py-4 bg-[#F9FAFB] border border-gray-100 rounded-[18px] outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 focus:bg-white transition-all font-bold text-base text-black placeholder-gray-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5 px-2">
            <label className="text-[10px] font-bold uppercase tracking-[1.5px] text-blue-600">Security Key</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-500 transition" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-6 py-4 bg-[#F9FAFB] border border-gray-100 rounded-[18px] outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 focus:bg-white transition-all font-bold text-base text-black placeholder-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white font-black py-5 rounded-[24px] shadow-xl hover:opacity-90 transition-all duration-500 flex items-center justify-center gap-4 active:scale-95 uppercase tracking-[2px] text-xs"
          >
            {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "Establish Node"}
          </button>

          <div className="text-center pt-2">
            <p className="text-[13px] text-[#555555] font-bold">
              Existing Account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-black text-blue-600 hover:underline px-2 uppercase tracking-wide"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </div>

      <div className="absolute bottom-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full translate-y-1/2 translate-x-1/2 blur-[100px]"></div>

    </div>
  );
}
