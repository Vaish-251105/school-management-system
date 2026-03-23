import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  SlidersHorizontal,
  Search,
  MessageSquare,
  Plus,
  Calculator,
  Landmark,
  Loader2,
  Bell
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Staff() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/teachers", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        setTeachers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch staff error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans flex flex-col relative pb-28 text-gray-900">
      
      {/* HEADER AREA */}
      <div className="bg-gradient-to-br from-[#4338ca] to-[#4f46e5] px-6 pt-12 pb-8 rounded-b-[40px] shadow-lg shrink-0">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex justify-between items-center mb-8">
            <button onClick={() => navigate(-1)} className="text-white hover:bg-white/10 p-2 rounded-full transition">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-white text-xl font-bold">Staff Directory</h1>
            <div className="flex gap-2">
               <button 
                onClick={() => alert("No new staff notifications")}
                className="text-white p-2 hover:bg-white/10 rounded-full transition">
                <Bell className="w-5 h-5" />
              </button>
              <button 
                onClick={() => alert("Filter Options: \n• By Department\n• By Role\n• By Experience")}
                className="text-white p-2 hover:bg-white/10 rounded-full transition">
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center bg-white/15 border border-white/20 rounded-2xl px-4 py-3 shadow-inner">
            <Search className="text-white/70 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search staff, departments..." 
              className="bg-transparent border-none text-white placeholder-white/70 outline-none w-full ml-3 text-sm"
            />
          </div>

        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="max-w-4xl mx-auto px-6 mt-6 w-full flex-1">
        
        {/* CHIPS */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button className="bg-[#4f46e5] border border-[#4f46e5] text-white font-bold px-5 py-2.5 rounded-full text-[13px] shrink-0 shadow-sm">
            All Staff
          </button>
          <button className="bg-transparent text-gray-500 font-medium px-5 py-2.5 rounded-full text-[13px] shrink-0 border border-gray-200 hover:bg-gray-50 transition">
            Teachers
          </button>
          <button className="bg-transparent text-gray-500 font-medium px-5 py-2.5 rounded-full text-[13px] shrink-0 border border-gray-200 hover:bg-gray-50 transition">
            Admin
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          
          <SectionHeader title="Academic Department" subtitle={`${teachers.length} Members`} />
          
          {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#4f46e5]" /></div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No staff members found.</div>
          ) : (
            teachers.map((t) => (
              <StaffCard 
                key={t._id}
                img={`https://ui-avatars.com/api/?name=${t.userId?.name || "TS"}&background=f3f4f6&color=4f46e5`}
                name={t.userId?.name || "Staff Member"}
                role={t.designation || t.userId?.role || "Educationist"}
                dept={t.department || "Academic"}
                icon={<Calculator className="w-3.5 h-3.5" />}
                isOnline={true}
              />
            ))
          )}

          <div className="pt-2"></div>
          <SectionHeader title="Administration" subtitle="Mock Data" />
          
          <StaffCard 
            img="https://randomuser.me/api/portraits/men/90.jpg"
            name="James Wilson"
            role="Principal"
            dept="Management"
            icon={<Landmark className="w-3.5 h-3.5" />}
            isOnline={true}
          />

        </div>

      </div>

      <div className="fixed bottom-6 right-6">
        <button 
           onClick={() => {
             alert("Redirecting to Staff Registration...");
             navigate('/signup');
           }}
          className="bg-[#4f46e5] text-white px-6 py-3.5 rounded-full font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition hover:scale-105 active:scale-95">
          <Plus className="w-5 h-5" /> Add Staff
        </button>
      </div>

    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="flex justify-between items-end pb-1">
      <h3 className="text-[#4f46e5] font-bold text-[15px]">{title}</h3>
      <p className="text-gray-500 text-[11px] font-bold">{subtitle}</p>
    </div>
  );
}

function StaffCard({ img, name, role, dept, icon, isOnline }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center hover:shadow-md transition cursor-pointer">
      
      <div className="relative">
        <img src={img} alt={name} className="w-12 h-12 rounded-full object-cover border border-gray-50" />
        <div className={`absolute top-0 left-0 w-3.5 h-3.5 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
      </div>
      
      <div className="ml-4 flex-1">
        <h4 className="font-bold text-gray-900 text-[15px] leading-tight">{name}</h4>
        <p className="text-gray-500 text-[12px] mt-1">{role}</p>
        <div className="flex items-center gap-1.5 mt-1 text-[#4f46e5] font-semibold text-[11px]">
          {icon}
          <span>{dept}</span>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div 
          onClick={(e) => {
            e.stopPropagation();
            alert(`Opening chat with ${name}...`);
          }}
          className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center cursor-pointer hover:bg-indigo-100 transition shadow-sm border border-indigo-100/50">
          <MessageSquare className="text-[#4f46e5] w-5 h-5" />
        </div>
        <span className={`text-[10px] font-bold mt-1.5 ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

    </div>
  );
}
