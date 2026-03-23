import React from "react";
import { 
  ChevronLeft, 
  MoreVertical,
  Search,
  SlidersHorizontal,
  User,
  Calculator,
  Lightbulb,
  BookOpen,
  Terminal,
  Plus
} from "lucide-react";

export default function Classes() {
  return (
    <div className="bg-[#fafafa] min-h-screen font-sans flex flex-col relative pb-28">
      
      {/* HEADER AREA */}
      <div className="bg-[#4f46e5] overflow-hidden relative">
        <div className="absolute -top-[50%] -right-[20%] w-[120%] h-[200%] bg-gradient-radial from-[#8b5cf6]/30 to-transparent rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 pt-12 pb-0 relative z-10">
          
          <div className="flex justify-between items-center mb-8">
            <button className="text-white hover:bg-white/10 p-2 rounded-full transition">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-white text-lg font-bold">Classes & Subjects</h1>
            <button className="border border-white/30 p-1.5 rounded-lg hover:bg-white/10 transition">
              <MoreVertical className="w-5 h-5 text-white" />
            </button>
          </div>

          <p className="text-white/80 text-[13px] font-semibold">Academic Year 2024</p>
          <h2 className="text-white text-[28px] font-bold mt-1 mb-6">Manage Your Schedule</h2>

          {/* SEARCH BAR */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 flex items-center bg-white/15 border border-white/20 rounded-2xl px-4 py-3 shadow-inner">
              <Search className="text-white/70 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search classes..." 
                className="bg-transparent border-none text-white placeholder-white/70 outline-none w-full ml-3 text-sm"
              />
            </div>
            <button className="bg-white/15 border border-white/20 p-3.5 rounded-2xl hover:bg-white/20 transition">
              <SlidersHorizontal className="text-white w-5 h-5" />
            </button>
          </div>

          {/* TABS (White surface bottom chunk) */}
          <div className="bg-[#fafafa] rounded-t-[30px] pt-5 px-5 flex justify-between">
            <Tab title="Active Classes" active={true} />
            <Tab title="Subject List" active={false} />
            <Tab title="Time Table" active={false} />
          </div>

        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="max-w-4xl mx-auto px-6 mt-6 w-full flex-1">
        
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-gray-900 font-bold text-[18px]">Current Classes</h3>
          <p className="text-gray-400 text-xs font-bold">Sort by Grade</p>
        </div>

        <div className="space-y-4 mb-8">
          <ClassCard 
            grade="Grade 10" section="Section A" room="Room 402" color="blue"
            students="32" subjects="8" teacher="Dr. Sarah Jenkins"
          />
          <ClassCard 
            grade="Grade 11" section="Section B" room="Lab 02" color="orange"
            students="28" subjects="6" teacher="Prof. Michael Chen"
          />
        </div>

        {/* CORE SUBJECTS */}
        <div className="flex justify-between items-end mb-3">
          <h3 className="text-gray-900 font-bold text-[18px]">Core Subjects</h3>
          <button className="text-[#4f46e5] font-medium text-sm">View All</button>
        </div>

        <div className="space-y-3">
          <SubjectCard 
            icon={<Calculator className="w-6 h-6 text-blue-500" />} color="bg-blue-50"
            title="Advanced Mathematics" code="MATH-101" days="Mon, Wed, Fri" credits="4 Credits"
          />
          <SubjectCard 
            icon={<Lightbulb className="w-6 h-6 text-orange-500" />} color="bg-orange-50"
            title="Quantum Physics" code="PHYS-202" days="Tue, Thu" credits="3 Credits"
          />
          <SubjectCard 
            icon={<BookOpen className="w-6 h-6 text-green-500" />} color="bg-green-50"
            title="English Literature" code="ENG-105" days="Mon, Tue, Thu" credits="3 Credits"
          />
          <SubjectCard 
            icon={<Terminal className="w-6 h-6 text-gray-800" />} color="bg-gray-100"
            title="Computer Science" code="CS-301" days="Friday" credits="2 Credits"
          />
        </div>

      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-[#4f46e5] text-white px-6 py-3.5 rounded-full font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 hover:bg-indigo-600 transition">
          <Plus className="w-5 h-5" /> New Class
        </button>
      </div>

    </div>
  );
}

function Tab({ title, active }) {
  return (
    <div className="flex flex-col items-center cursor-pointer">
      <span className={`text-[13px] font-bold ${active ? 'text-[#4f46e5]' : 'text-gray-400 hover:text-gray-600'}`}>
        {title}
      </span>
      <div className={`h-[3px] w-10 mt-2 rounded-full ${active ? 'bg-[#4f46e5]' : 'bg-transparent'}`}></div>
    </div>
  );
}

function ClassCard({ grade, section, room, students, subjects, teacher, color }) {
  
  const accentText = color === 'blue' ? 'text-blue-500' : 'text-orange-500';
  const accentBg = color === 'blue' ? 'bg-blue-50' : 'bg-orange-50';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 py-5 hover:shadow-md transition">
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-[20px]">{grade}</h3>
          <p className="text-gray-400 text-[13px]">{section}</p>
        </div>
        <div className={`${accentBg} ${accentText} font-bold text-xs px-3 py-1.5 rounded-full`}>
          {room}
        </div>
      </div>

      <hr className="border-gray-100 mb-4" />

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-8">
          <div>
            <p className="text-gray-400 text-[11px] font-bold">Students</p>
            <h4 className="font-bold text-gray-900 text-[18px] leading-tight">{students}</h4>
          </div>
          <div>
            <p className="text-gray-400 text-[11px] font-bold">Subjects</p>
            <h4 className="font-bold text-gray-900 text-[18px] leading-tight">{subjects}</h4>
          </div>
        </div>
        
        {/* Avatars overlaps */}
        <div className="flex -space-x-3">
          <img className="w-8 h-8 rounded-full border-2 border-white relative z-10" src="https://randomuser.me/api/portraits/women/10.jpg" alt=""/>
          <img className="w-8 h-8 rounded-full border-2 border-white relative z-20" src="https://randomuser.me/api/portraits/men/15.jpg" alt=""/>
          <img className="w-8 h-8 rounded-full border-2 border-white relative z-30" src="https://randomuser.me/api/portraits/women/11.jpg" alt=""/>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[#4f46e5] text-[13px] font-bold">
        <User className="w-4 h-4" />
        <span>Class Teacher: {teacher}</span>
      </div>

    </div>
  );
}

function SubjectCard({ icon, color, title, code, days, credits }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center hover:shadow-md transition">
      <div className={`${color} p-3 rounded-xl flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="ml-4 flex-1">
        <h4 className="font-bold text-gray-900 text-[15px]">{title}</h4>
        <p className="text-gray-500 text-[12px]">{code}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-900 text-[10px]">{days}</p>
        <p className="text-[#4f46e5] font-bold text-[10px] mt-1">{credits}</p>
      </div>
    </div>
  );
}