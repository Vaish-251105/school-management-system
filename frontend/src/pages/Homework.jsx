import React from "react";
import { 
  Bell,
  GraduationCap,
  Download,
  Clock,
  FileText,
  Megaphone,
  CalendarDays,
  AlertTriangle,
  Banknote,
  BookMarked,
  Check,
  User,
  Plus,
  ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Homework() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('') : "US";

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans flex flex-col pb-28">
      
      {/* HEADER AREA */}
      <div className="bg-gradient-to-br from-[#4338ca] to-[#4f46e5] px-6 pt-12 pb-10 rounded-b-[40px] shadow-lg shrink-0">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex justify-between items-center w-full mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="bg-white/15 p-2 rounded-xl border border-white/10 hover:bg-white/20 transition">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={() => alert("No new notifications")}
                  className="bg-white/15 p-2 rounded-xl border border-white/10 hover:bg-white/20 transition">
                  <Bell className="w-6 h-6 text-white" />
                </button>
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-[#4840d6]">
                  3
                </div>
              </div>
              <div 
                onClick={() => navigate('/profile')}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition">
                <span className="text-[#4f46e5] font-bold text-[14px]">{initials}</span>
              </div>
            </div>
          </div>

          <h1 className="text-white text-[26px] font-bold mb-2 tracking-tight">Academic Updates</h1>
          <div className="flex items-center gap-1.5 opacity-90">
            <GraduationCap className="text-white/80 w-4 h-4" />
            <span className="text-white/90 text-[13px] font-bold">{user.role ? user.role.toUpperCase() : "STUDENT"} PORTAL • Class 10-A</span>
          </div>

        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="max-w-4xl mx-auto px-6 mt-6 w-full flex-1">
        
        {/* ACTIVE HOMEWORK */}
        <div className="flex justify-between items-end mb-4 pt-2">
          <h3 className="text-gray-900 font-bold text-[18px]">Active Homework</h3>
          <button 
            onClick={() => alert("Showing all homework...")}
            className="text-[#4f46e5] font-medium text-[13px]">View All</button>
        </div>

        <div className="space-y-4 mb-6">
          <HomeworkCard 
            sub="Mathematics" due="Due: Oct 28" 
            title="Quadratic Equations" 
            desc="Complete exercises 4.2 to 4.5 from the NCERT textbook. Focus on the factorization method."
            teacher="Dr. Smith" status="Pending" color="text-orange-600 bg-orange-50"
          />
          <HomeworkCard 
            sub="Physics" due="Due: Oct 29" 
            title="Refraction Lab Report" 
            desc="Submit the lab observations for the glass slab experiment performed on Tuesday."
            teacher="Prof. Wilson" status="Submitted" color="text-white bg-[#3e6840]"
          />
          <HomeworkCard 
            sub="History" due="Due: Nov 02" 
            title="The French Revolution" 
            desc="Write a 500-word essay on the impact of the Storming of the Bastille on the common folk."
            teacher="Ms. Garcia" status="Pending" color="text-orange-600 bg-orange-50"
          />
        </div>

        {/* QUICK LINKS */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <QuickLink onClick={() => alert("Downloading Syllabus...")} icon={<Download className="w-5 h-5 text-white" />} label="Syllabus" />
          <QuickLink onClick={() => alert("Showing Timetable...")} icon={<Clock className="w-5 h-5 text-white" />} label="Timetable" />
          <QuickLink onClick={() => alert("Accessing Resources...")} icon={<FileText className="w-5 h-5 text-white" />} label="Resources" />
        </div>

        {/* RECENT NOTICES */}
        <h3 className="text-gray-900 font-bold text-[18px] mb-4">Recent Notices</h3>

        <div className="bg-indigo-50/40 border border-indigo-100 rounded-[20px] overflow-hidden">
          
          <div className="p-4 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#4f46e5]" />
            <h4 className="text-[#4f46e5] font-bold text-[15px]">School Announcements</h4>
          </div>
          <div className="w-full h-px bg-indigo-100"></div>

          <NoticeRow icon={<CalendarDays className="w-5 h-5 text-blue-500" />} tag="Event" tagColor="text-blue-500" time="2h ago" title="Annual Sports Meet 2024" desc="Registrations for the annual sports track events are now open. Visit the PE depart..." />
          <div className="w-full h-px bg-indigo-50"></div>
          <NoticeRow icon={<AlertTriangle className="w-5 h-5 text-red-500" />} tag="Urgent" tagColor="text-red-500" time="5h ago" title="Winter Uniform Update" desc="Starting next Monday, all students must wear the full winter uniform including the..." />
          <div className="w-full h-px bg-indigo-50"></div>
          <NoticeRow icon={<Banknote className="w-5 h-5 text-green-600" />} tag="Fees" tagColor="text-green-600" time="1d ago" title="Quarterly Fee Reminder" desc="The deadline for Q3 fee payment is Nov 5th. Please ignore if already paid." />
          <div className="w-full h-px bg-indigo-50"></div>
          <NoticeRow icon={<BookMarked className="w-5 h-5 text-[#4f46e5]" />} tag="Academic" tagColor="text-[#4f46e5]" time="2d ago" title="Parent-Teacher Meeting" desc="The monthly PTM is scheduled for Saturday, Nov 4th from 9:00 AM to 1:00 ..." />
          
        </div>

      </div>

      <div className="fixed bottom-6 w-full flex justify-center z-50">
        <button 
          onClick={() => alert("Proceeding to Homework Submission Screen...")}
          className="bg-[#4f46e5] text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 hover:bg-indigo-600 transition">
          <Plus className="w-5 h-5" /> Submit Homework
        </button>
      </div>

    </div>
  );
}

function HomeworkCard({ sub, due, title, desc, teacher, status, color }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[#4f46e5] font-bold text-[11px] bg-indigo-50 px-2 py-0.5 rounded-full">{sub}</span>
        <span className="text-gray-400 font-bold text-[11px]">{due}</span>
      </div>
      <h4 className="font-bold text-gray-900 text-[16px]">{title}</h4>
      <p className="text-gray-500 text-[13px] mt-2 leading-snug">{desc}</p>
      
      <hr className="border-gray-100 my-4" />
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-gray-500">
          <User className="w-4 h-4" />
          <span className="font-bold text-[12px]">{teacher}</span>
        </div>
        <div className={`${color} px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold text-[12px]`}>
          {status === "Pending" && <Check className="w-3.5 h-3.5" />}
          {status}
        </div>
      </div>
    </div>
  );
}

function QuickLink({ icon, label, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-[16px] py-4 flex flex-col items-center hover:shadow-sm transition cursor-pointer text-center">
      <div className="bg-[#4f46e5] w-12 h-12 rounded-full flex items-center justify-center mb-3">
        {icon}
      </div>
      <span className="font-bold text-gray-900 text-[12px]">{label}</span>
    </div>
  );
}

function NoticeRow({ icon, tag, tagColor, time, title, desc }) {
  return (
    <div className="bg-white p-4 flex gap-4">
      <div className="border border-gray-100 bg-white p-3 rounded-xl h-fit shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className={`text-[10px] font-bold ${tagColor}`}>{tag}</span>
          <span className="text-gray-400 text-[10px] font-bold">{time}</span>
        </div>
        <h4 className="text-gray-900 font-bold text-[15px]">{title}</h4>
        <p className="text-gray-500 text-[13px] mt-1.5 leading-snug">{desc}</p>
      </div>
    </div>
  );
}
