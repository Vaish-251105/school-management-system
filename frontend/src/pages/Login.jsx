import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock } from "lucide-react";
import { FaApple, FaFacebook, FaQuestionCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

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
      const response = await fetch(`http://localhost:5000/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
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
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error. Please check if backend is running.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] p-4 text-gray-900 font-sans">
      
      {/* Header / Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="bg-[#4f46e5] p-4 rounded-2xl shadow-lg mb-4">
          <GraduationCap className="text-white w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart School ERP</h1>
        <p className="text-gray-500 text-sm">Management System for Modern Education</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        
        {/* Role Segmented Control */}
        <div className="bg-gray-50 p-1.5 rounded-xl mb-6 flex flex-wrap gap-1 justify-center">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
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