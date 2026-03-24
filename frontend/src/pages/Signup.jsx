import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock, User, Briefcase, ArrowLeft } from "lucide-react";
import api from "../utils/api";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

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
      await api.post("/auth/register", { name, email, password, role });
      alert("Account created successfully! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] p-4 text-black font-sans transition-all animate-in fade-in">
      
      {/* Header / Logo */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="bg-[#1e1b4b] p-5 rounded-3xl shadow-2xl mb-6">
          <GraduationCap className="text-white w-12 h-12" />
        </div>
        <h1 className="text-4xl font-black text-black mb-2 uppercase tracking-tight">Create Account</h1>
        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest italic">Join the official school portal</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-[40px] shadow-3xl border border-gray-100 p-10 relative overflow-hidden">
        
        {/* Role Selector */}
        <div className="mb-8">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">
            SELECT YOUR ROLE
          </label>
          <div className="bg-gray-50 p-2 rounded-2xl flex flex-wrap gap-2 justify-center border border-gray-100">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`flex-1 min-w-[30%] py-2.5 text-[11px] font-black rounded-xl uppercase tracking-wider transition-all duration-300 ${
                  role === r.id
                    ? "bg-[#1e1b4b] text-white shadow-xl"
                    : "text-gray-400 hover:text-[#1e1b4b] hover:bg-white"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-1.5 px-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Full Name</label>
            <div className="relative">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type="text"
                required
                placeholder="Rahul Kumar"
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 focus:bg-white transition-all font-bold text-lg text-black"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5 px-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type="email"
                required
                placeholder="user@school.edu"
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 focus:bg-white transition-all font-bold text-lg text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5 px-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Password</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 focus:bg-white transition-all font-bold text-lg text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-black py-6 rounded-3xl hover:bg-gray-800 shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Confirm & Join"}
          </button>

          <div className="text-center pt-2">
            <p className="text-[13px] text-gray-400 font-bold">
              Already a member?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-black text-indigo-600 hover:underline px-2"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>

      </div>

      <button 
        onClick={() => navigate('/login')}
        className="mt-8 flex items-center gap-2 text-gray-400 font-black text-[11px] uppercase tracking-widest hover:text-black transition active:scale-95"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Workspace
      </button>

    </div>
  );
}
