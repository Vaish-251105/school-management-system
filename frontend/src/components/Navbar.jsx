import { User, LogIn, LogOut, Search, Bell, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      setUser(currentUser);
    };
    
    checkUser();
    // Listen for storage changes in case of multi-tab login/logout
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    const r = user.role?.toLowerCase();
    if (r === "admin") return "/admin-dashboard";
    if (r === "teacher") return "/teacher-dashboard";
    if (r === "parent") return "/parent-dashboard";
    if (r === "accountant") return "/accountant";
    return "/dashboard";
  };

  return (
    <div className="bg-white/80 backdrop-blur-md text-black flex items-center justify-between px-8 py-4 border-b border-gray-100 sticky top-0 z-[1000] shadow-sm">

      {/* Title */}
      <h1 
        onClick={() => navigate(getDashboardPath())}
        className="text-[15px] font-black uppercase tracking-[3px] cursor-pointer hover:text-indigo-600 transition truncate max-w-[150px] md:max-w-none"
      >
        School ERP
      </h1>

      <div className="flex items-center gap-4">

        {/* 🔍 Search */}
        <div className="hidden md:flex items-center bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 group focus-within:bg-white focus-within:border-indigo-200 transition-all">
          <Search size={16} className="text-gray-400 group-focus-within:text-indigo-600" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none ml-3 text-xs font-bold w-40"
          />
        </div>

        {/* Action Buttons */}
        {user && (
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition border border-gray-100">
               <Bell size={18} />
            </button>
            <button className="hidden sm:flex p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition border border-gray-100">
               <Settings size={18} />
            </button>
            <div className="w-px h-6 bg-gray-100 mx-2 hidden sm:block"></div>
            
            {/* 👤 Profile Link */}
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 hover:bg-indigo-600 group transition-all"
            >
              <div className="flex flex-col items-end text-right">
                <span className="text-[10px] font-black text-indigo-600 group-hover:text-white uppercase tracking-widest">{user.role || 'Member'}</span>
                <span className="text-[12px] font-bold text-black group-hover:text-white leading-none truncate max-w-[80px]">{user.name?.split(' ')[0] || 'User'}</span>
              </div>
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-indigo-100 shadow-sm group-hover:scale-110 transition shrink-0 uppercase font-black text-indigo-600 text-xs">
                 {user.name?.[0] || 'U'}
              </div>
            </button>
          </div>
        )}

        {/* Auth Buttons */}
        {!user ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-[#1e1b4b] hover:bg-gray-50 rounded-xl transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-[#1e1b4b] text-white px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition shadow-xl"
            >
              Register
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="p-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl hover:bg-rose-600 hover:text-white transition shadow-sm active:scale-90"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        )}

      </div>
    </div>
  );
}