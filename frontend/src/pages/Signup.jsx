import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock, User, Briefcase } from "lucide-react";

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
      const response = await fetch(`http://localhost:5000/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully! Please login.");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Server error. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] dark:bg-gray-900 p-4 text-gray-900 dark:text-white font-sans transition-colors duration-300">
      
      {/* Header / Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="bg-[#4f46e5] p-4 rounded-2xl shadow-lg mb-4">
          <GraduationCap className="text-white w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold dark:text-white mb-2">Join Smart School</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm italic">Empowering the next generation of learners</p>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
        
        {/* Role Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            I am a...
          </label>
          <div className="bg-gray-50 dark:bg-gray-900 p-1.5 rounded-xl flex flex-wrap gap-1 justify-center border border-gray-100 dark:border-gray-700">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`flex-1 min-w-[30%] py-2 text-[11px] font-bold rounded-lg uppercase tracking-wider transition-all duration-200 ${
                  role === r.id
                    ? "bg-[#4f46e5] text-white shadow-md"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSignup}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent transition-all dark:text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                placeholder="johndoe@example.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent transition-all dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Create Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent transition-all dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Join Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4f46e5] text-white font-bold py-4 rounded-xl hover:bg-[#4338ca] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 mb-6 flex items-center justify-center gap-2"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-bold text-[#4f46e5] hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>

      </div>

      <div className="mt-8 text-sm text-gray-400 dark:text-gray-500 max-w-sm text-center bg-white/50 dark:bg-black/20 p-4 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
        By joining, you agree to our <a href="#" className="font-semibold text-[#4f46e5] hover:underline">Terms of Service</a> and <a href="#" className="font-semibold text-[#4f46e5] hover:underline">Privacy Policy</a>.
      </div>

    </div>
  );
}
