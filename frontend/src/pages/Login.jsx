import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock, HelpCircle } from "lucide-react";
import { FaApple, FaFacebook, FaQuestionCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import api from "../utils/api";


export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const roles = [
    { id: "student", label: "Student" },
    { id: "teacher", label: "Teacher" },
    { id: "parent", label: "Parent" },
    { id: "admin", label: "Admin" },
    { id: "accountant", label: "Accountant" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post("/auth/login", { email, password });
      const data = response.data;

      // Save user data & token
      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data));
      
      // Route to appropriate dashboard based on role
      if (data.role === "admin") {
        navigate("/admin-dashboard");
      } else if (data.role === "teacher") {
        navigate("/teacher-dashboard");
      } else if (data.role === "parent") {
        navigate("/parent-dashboard");
      } else if (data.role === "accountant") {
        navigate("/accountant");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] p-4 text-gray-900 font-sans">
      
      {/* Header / Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="bg-white/95 backdrop-blur-md rounded-[40px] p-10 pb-12 shadow-[0_22px_70px_rgba(0,0,0,0.15)] relative overflow-hidden">
          
          {/* HELPER MODAL TRIGGER */}
          <div className="absolute top-6 right-6">
             <button 
                onClick={() => alert("DEMO ACCOUNTS (Password: 123 for all)\n\n• Admin: admin@school.com\n• Teacher: teacher@school.com\n• Student: student@school.com\n• Accountant: accountant@school.com\n\nYou can also use ANY email with password '123' to test!")}
                className="bg-indigo-50 text-indigo-600 p-2.5 rounded-full hover:bg-indigo-100 transition shadow-sm border border-indigo-100 group"
             >
                <HelpCircle className="w-5 h-5 group-hover:scale-110 transition" />
             </button>
          </div>

          <div className="text-center mb-10">
            <div className="bg-[#4f46e5] p-4 rounded-2xl shadow-lg mb-4 inline-block">
              <GraduationCap className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart School ERP</h1>
            <p className="text-gray-500 text-sm">Management System for Modern Education</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        
        {/* Role Segmented Control */}
        <div className="bg-gray-50 p-1.5 rounded-xl mb-6 flex flex-wrap gap-1 justify-center">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setRole(r.id);
                setEmail(`${r.id}@school.com`);
                setPassword("123");
              }}
              className={`flex-1 min-w-[30%] py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                role === r.id
                  ? "bg-[#4f46e5] text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="text-center mb-4">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
             <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div> CLICK A ROLE FOR FAST LOGIN
          </p>
        </div>


        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <a href="#" className="text-sm font-medium text-[#4f46e5] hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-[#4f46e5] text-white font-semibold py-3.5 rounded-xl hover:bg-[#4338ca] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 mb-6"
          >
            Sign In
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <span className="relative bg-white px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
              OR
            </span>
          </div>
            {/* Register Button */}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="w-full bg-white dark:bg-gray-800 text-[#4f46e5] border-2 border-[#4f46e5] font-semibold py-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-all duration-200 mb-8"
            >
              Register New Account
            </button>

            {/* Social Logins */}
            <div className="text-center mb-4">
              <p className="text-sm text-gray-500 mb-4">Continue with social account</p>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => alert('Question Circle login not implemented')}
                  className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 hover:shadow-sm transition-all text-gray-600 dark:text-gray-300"
                >
                  <FaQuestionCircle className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => alert('Google login not implemented')}
                  className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 hover:shadow-sm transition-all text-gray-600 dark:text-gray-300"
                >
                  <FcGoogle className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => alert('Facebook login not implemented')}
                  className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 hover:shadow-sm transition-all text-[#1877F2] dark:text-[#1877F2]"
                >
                  <FaFacebook className="w-5 h-5" />
                </button>
              </div>
            </div>
        </form>

      </div>

      {/* Footer */}
      <div className="mt-8 text-sm text-gray-500">
        Need help? <a href="#" className="font-semibold text-[#4f46e5] hover:underline hover:text-[#4338ca]">Contact Support</a>
      </div>

    </div>
  );
}