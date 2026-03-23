import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Wallet, 
  Book, 
  Award, 
  PenTool, 
  Bus, 
  MapPin, 
  Bell, 
  Flag, 
  Users, 
  Snowflake, 
  Lightbulb,
  ChevronRight,
  Plus,
  Loader2
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/dashboard/stats", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="bg-[#fafafa] min-h-screen pb-20 font-sans">
      
      {/* HEADER AREA */}
      <div className="bg-gradient-to-br from-[#4338ca] to-[#4f46e5] px-6 pt-12 pb-10 rounded-b-[40px] shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center text-gray-900">
            <div>
              <p className="text-white/80 text-sm font-semibold uppercase tracking-wider">Smart School ERP</p>
              <h1 className="text-white text-[28px] font-bold mt-1">Hello, {user.name ? user.name.split(' ')[0] : (user.role || "User")}</h1>
            </div>
            <img 
              onClick={() => navigate('/profile')}
              src={`https://ui-avatars.com/api/?name=${user.name || "User"}&background=ffffff&color=4f46e5`} 
              alt="Profile" 
              className="w-14 h-14 rounded-full border-2 border-white/20 object-cover bg-white/10 cursor-pointer hover:scale-105 transition"
            />
          </div>

          <div className="mt-8 bg-white/10 border border-white/20 rounded-3xl p-6 flex justify-between px-8 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-white/80 text-xs font-semibold">Attendance</p>
              <h2 className="text-white text-2xl font-bold mt-1">
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto mt-1" /> : (stats?.attendancePercentage || "0") + "%"}
              </h2>
            </div>
            <div className="text-center border-l border-white/10 pl-8 pr-8 border-r">
              <p className="text-white/80 text-xs font-semibold">GPA</p>
              <h2 className="text-white text-2xl font-bold mt-1">3.8</h2>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-xs font-semibold">Students</p>
              <h2 className="text-white text-2xl font-bold mt-1">
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto mt-1" /> : (stats?.totalStudents || "0")}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="max-w-4xl mx-auto px-6 mt-8">
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-900 font-bold text-xl">School Modules</h3>
          <div className="text-[#4f46e5] grid grid-cols-2 gap-1 w-5 h-5">
            <div className="bg-[#4f46e5] rounded-[2px]" />
            <div className="bg-[#4f46e5] rounded-[2px]" />
            <div className="bg-[#4f46e5] rounded-[2px]" />
            <div className="bg-[#4f46e5] rounded-[2px]" />
          </div>
        </div>
        
        {/* MODULES GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          
          <div onClick={() => navigate('/attendance')} className="cursor-pointer bg-white p-5 rounded-[20px] border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition">
            <div className="bg-blue-50 p-3 rounded-2xl mb-4">
              <Calendar className="text-blue-500 w-7 h-7" />
            </div>
            <h4 className="text-gray-900 font-bold text-[15px]">Attendance</h4>
            <p className="text-gray-500 text-[11px] mt-1">Check history</p>
          </div>
          
          <div onClick={() => navigate('/fees')} className="cursor-pointer bg-white p-5 rounded-[20px] border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition">
            <div className="bg-purple-50 p-3 rounded-2xl mb-4">
              <Wallet className="text-purple-500 w-7 h-7" />
            </div>
            <h4 className="text-gray-900 font-bold text-[15px]">Fees</h4>
            <p className="text-gray-500 text-[11px] mt-1">Pay invoices</p>
          </div>
          
          <div onClick={() => navigate('/classes')} className="cursor-pointer bg-white p-5 rounded-[20px] border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition">
            <div className="bg-orange-50 p-3 rounded-2xl mb-4">
              <Book className="text-orange-500 w-7 h-7" />
            </div>
            <h4 className="text-gray-900 font-bold text-[15px]">Classes</h4>
            <p className="text-gray-500 text-[11px] mt-1">View schedule</p>
          </div>
          
          <div onClick={() => navigate('/exams')} className="cursor-pointer bg-white p-5 rounded-[20px] border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition">
            <div className="bg-green-50 p-3 rounded-2xl mb-4">
              <Award className="text-green-500 w-7 h-7" />
            </div>
            <h4 className="text-gray-900 font-bold text-[15px]">Exams</h4>
            <p className="text-gray-500 text-[11px] mt-1">Grade reports</p>
          </div>

          <div onClick={() => navigate('/homework-notices')} className="cursor-pointer bg-white p-5 rounded-[20px] border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition">
            <div className="bg-pink-50 p-3 rounded-2xl mb-4">
              <PenTool className="text-pink-500 w-7 h-7" />
            </div>
            <h4 className="text-gray-900 font-bold text-[15px]">Homework</h4>
            <p className="text-gray-500 text-[11px] mt-1">3 pending</p>
          </div>

          <div onClick={() => navigate('/communication')} className="cursor-pointer bg-white p-5 rounded-[20px] border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition">
            <div className="bg-sky-50 p-3 rounded-2xl mb-4">
              <Bus className="text-sky-500 w-7 h-7" />
            </div>
            <h4 className="text-gray-900 font-bold text-[15px]">Academic Hub</h4>
            <p className="text-gray-500 text-[11px] mt-1">Live updates</p>
          </div>

        </div>

        {/* UPCOMING EVENT */}
        <div className="mt-8 bg-[#6d28d9] p-4 rounded-3xl shadow-lg flex items-center shadow-purple-900/20">
          <div className="bg-white/10 rounded-2xl px-4 py-3 text-center border border-white/10">
            <div className="text-white text-xl font-bold">24</div>
            <div className="text-white text-xs font-semibold uppercase tracking-wider">OCT</div>
          </div>
          <div className="ml-4 flex-1">
            <h4 className="text-white font-bold text-[16px]">Maths Olympiad</h4>
            <div className="flex items-center text-white/70 text-xs mt-1 font-semibold">
              <MapPin className="w-3 h-3 mr-1" /> Main Hall • 09:00 AM
            </div>
          </div>
          <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center relative shadow-sm transition hover:scale-110 cursor-pointer">
            <Bell className="w-5 h-5 text-[#4f46e5]" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
          </div>
        </div>

        {/* NOTICE BOARD */}
        <div className="mt-8 flex justify-between items-center mb-4">
          <h3 className="text-gray-900 font-bold text-xl">Notice Board</h3>
          <button className="text-[#4f46e5] text-sm font-semibold hover:underline">View All</button>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          
          <div className="flex items-center p-4 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <Flag className="w-5 h-5 text-red-500" />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="text-gray-900 font-bold text-[15px]">Annual Sports Meet 2024</h4>
              <p className="text-gray-500 text-[11px] mt-0.5">2 hours ago</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-center p-4 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-500" />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="text-gray-900 font-bold text-[15px]">Parent-Teacher Meeting</h4>
              <p className="text-gray-500 text-[11px] mt-0.5">Yesterday</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-center p-4 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Snowflake className="w-5 h-5 text-blue-500" />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="text-gray-900 font-bold text-[15px]">Winter Vacation Schedule</h4>
              <p className="text-gray-500 text-[11px] mt-0.5">2 days ago</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-center p-4 hover:bg-gray-50 transition cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-green-500" />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="text-gray-900 font-bold text-[15px]">Science Fair Registration</h4>
              <p className="text-gray-500 text-[11px] mt-0.5">1 week ago</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

        </div>
        
        {/* Floating Action Help Desk Button Mock */}
        <div className="fixed bottom-6 right-6">
           <button 
             onClick={() => alert("Connecting to Help Desk Support...")}
             className="bg-[#4f46e5] text-white px-6 py-3.5 rounded-full font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition">
             <Plus className="w-5 h-5" /> Help Desk
           </button>
        </div>

      </div>

    </div>
  );
}