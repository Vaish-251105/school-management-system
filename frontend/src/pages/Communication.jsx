import React, { useState, useEffect } from "react";
import { 
  Check, 
  MessageSquare, 
  User,
  Megaphone,
  MessageCircle,
  Clock,
  Paperclip,
  Plus,
  ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Communication() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await api.get("/notices");
        setNotices(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchNotices();
  }, []);

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('') : "US";


  return (
    <div className="bg-[#fafafa] min-h-screen font-sans flex flex-col pb-28 text-gray-900">
      
      {/* HEADER AREA */}
      <div className="bg-gradient-to-br from-[#4338ca] to-[#4f46e5] px-6 pt-12 pb-8 rounded-b-[40px] shadow-lg shrink-0 relative overflow-hidden">
        {/* Soft circle decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          
          <div className="flex justify-between items-center w-full mb-8">
            <div className="flex gap-3 items-center">
              <button 
                onClick={() => navigate(-1)}
                className="bg-white/15 p-2 rounded-xl border border-white/10 hover:bg-white/20 transition">
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-white text-[24px] font-bold leading-tight">Academic Hub</h1>
                <p className="text-white/80 text-[12px] mt-0.5">{user.role || "Student"} Hub • Term 1</p>
              </div>
            </div>
            <div 
              onClick={() => navigate('/profile')}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition">
              <span className="text-[#4f46e5] font-bold text-[16px]">{initials}</span>
            </div>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-2xl py-4 flex justify-around">
            <div className="text-center">
              <p className="text-white/70 text-[11px] font-bold mb-1">Attendance</p>
              <h3 className="text-white text-[16px] font-bold">94%</h3>
            </div>
            <div className="text-center">
              <p className="text-white/70 text-[11px] font-bold mb-1">GPA</p>
              <h3 className="text-white text-[16px] font-bold">3.82</h3>
            </div>
            <div className="text-center">
              <p className="text-white/70 text-[11px] font-bold mb-1">Rank</p>
              <h3 className="text-white text-[16px] font-bold">#04</h3>
            </div>
          </div>

        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="max-w-4xl mx-auto px-6 mt-6 w-full flex-1">
        
        {/* CHIPS */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button className="bg-[#4f46e5] border border-[#4f46e5] text-white font-bold px-4 py-2 rounded-xl text-[13px] shrink-0 shadow-sm flex items-center gap-1.5 hover:bg-indigo-600 transition">
            <Check className="w-4 h-4" /> All Updates
          </button>
          <button 
            onClick={() => alert("Loading messages...")}
            className="bg-white text-gray-700 font-medium px-4 py-2 rounded-xl text-[13px] shrink-0 border border-gray-200 hover:bg-gray-50 flex items-center gap-1.5 transition">
            <MessageSquare className="w-4 h-4" /> Messages
          </button>
          <button 
            onClick={() => alert("Loading teacher directory...")}
            className="bg-white text-gray-700 font-medium px-4 py-2 rounded-xl text-[13px] shrink-0 border border-gray-200 hover:bg-gray-50 flex items-center gap-1.5 transition">
            <User className="w-4 h-4" /> Teachers
          </button>
        </div>

        {/* NOTICES */}
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-gray-900 font-bold text-[18px]">Important Notices</h3>
          <button 
             onClick={() => alert("Opening Archive...")}
            className="text-[#4f46e5] font-medium text-[13px]">View Archive</button>
        </div>

        <div className="space-y-4 mb-8">
          {notices.length > 0 ? (
            notices.map((n) => (
              <div key={n._id} className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-2xl flex items-start gap-4">
                <div className="bg-[#4f46e5] w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <Megaphone className="text-white w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-[16px]">{n.title}</h4>
                  <p className="text-gray-800 text-[13px] mt-1.5 leading-relaxed">{n.content}</p>
                  <div className="flex items-center gap-1.5 text-gray-500 mt-3 font-medium text-[11px]">
                    <Clock className="w-3.5 h-3.5" /> Posted {new Date(n.createdAt).toLocaleDateString()} by {n.senderId?.name || "Admin"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-2xl mb-8 flex items-start gap-4">
              <div className="bg-[#4f46e5] w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                <Megaphone className="text-white w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-[16px]">Winter Break Schedule</h4>
                <p className="text-gray-800 text-[13px] mt-1.5 leading-relaxed">The school will remain closed from Dec 20 to Jan 5. Please ensure all library books are returned before the break.</p>
                <div className="flex items-center gap-1.5 text-gray-500 mt-3 font-medium text-[11px]">
                  <Clock className="w-3.5 h-3.5" /> Posted 2 hours ago
                </div>
              </div>
            </div>
          )}
        </div>


        {/* INSTRUCTORS */}
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-gray-900 font-bold text-[18px]">Your Instructors</h3>
          <button 
             onClick={() => alert("Searching instructors...")}
            className="text-[#4f46e5] font-medium text-[13px]">Directory</button>
        </div>

        <div className="space-y-3 mb-8">
          <InstructorCard init="SJ" name="Dr. Sarah Jenkins" sub="Advanced Mathematics" email="s.jenkins@school.edu" />
          <InstructorCard init="MC" name="Prof. Michael Chen" sub="Physics & Robotics" email="m.chen@school.edu" />
        </div>

        {/* TIMETABLE */}
        <h3 className="text-gray-900 font-bold text-[18px] mb-4">Today's Timetable</h3>
        <div className="space-y-3 mb-8">
          <TimetableCard color="bg-indigo-100" title="Mathematics" topic="Calculus & Algebra" time="08:30 AM" room="Lab 204" />
          <TimetableCard color="bg-teal-100" title="Physics" topic="Quantum Mechanics" time="10:15 AM" room="Hall A" />
        </div>

        {/* PENDING ASSIGNMENTS */}
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-gray-900 font-bold text-[18px]">Pending Assignments</h3>
          <span className="bg-red-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full">3 Active</span>
        </div>

        <div className="space-y-4 mb-4">
          <AssignmentCard 
            tag="MATH" tagColor="bg-blue-50 text-blue-600" 
            due="Due: Tomorrow" 
            title="Integrals Worksheet" 
            desc="Complete all exercises from Chapter 5.2. Show all working steps clearly." 
            files="2 PDF files" 
          />
          <AssignmentCard 
            tag="PHYSICS" tagColor="bg-green-50 text-green-600" 
            due="Due: Friday" 
            title="Lab Report: Pendulums" 
            desc="Submit the digital copy of your findings from Monday's lab session." 
            files="1 DOCX" 
          />
        </div>

      </div>

      <div className="fixed bottom-6 w-full flex justify-end z-50 pointer-events-none">
        <div className="max-w-4xl mx-auto w-full flex justify-end px-6 pointer-events-auto">
          <button 
            onClick={() => alert("Opening Chat with support...")}
            className="bg-[#4f46e5] text-white px-5 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 hover:bg-indigo-600 transition">
            <Plus className="w-5 h-5" /> New Message
          </button>
        </div>
      </div>

    </div>
  );
}

function InstructorCard({ init, name, sub, email }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition cursor-pointer">
      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-800 font-bold text-[15px] border border-gray-100">
        {init}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 text-[15px]">{name}</h4>
        <p className="text-[#4f46e5] font-bold text-[11px] mt-0.5">{sub}</p>
        <p className="text-gray-400 text-[11px] mt-1 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {email}</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-[#4f46e5]">
        <MessageCircle className="w-5 h-5 fill-current" />
      </div>
    </div>
  );
}

function TimetableCard({ color, title, topic, time, room }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${color}`}></div>
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 text-[15px]">{title}</h4>
        <p className="text-gray-500 text-[12px]">{topic}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-900 text-[12px]">{time}</p>
        <p className="text-gray-400 text-[11px]">{room}</p>
      </div>
    </div>
  );
}

function AssignmentCard({ tag, tagColor, due, title, desc, files }) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center mb-3">
        <span className={`font-bold text-[10px] px-2 py-0.5 rounded-lg tracking-wide ${tagColor}`}>{tag}</span>
        <div className="flex items-center gap-1 text-red-500 font-bold text-[11px]">
          <Clock className="w-3.5 h-3.5" /> {due}
        </div>
      </div>
      
      <h4 className="font-bold text-gray-900 text-[16px]">{title}</h4>
      <p className="text-gray-500 text-[13px] mt-1.5 leading-relaxed">{desc}</p>
      
      <hr className="border-gray-100 my-4" />
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-gray-500 font-bold text-[11px]">
          <Paperclip className="w-3.5 h-3.5" /> {files}
        </div>
        <button 
           onClick={() => alert("Uploading assignment files...")}
          className="bg-[#4f46e5] text-white px-4 py-2 rounded-full font-bold text-[12px] hover:bg-indigo-600 transition">
          Submit Task
        </button>
      </div>
    </div>
  );
}