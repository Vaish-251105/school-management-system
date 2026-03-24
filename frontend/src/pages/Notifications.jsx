import React, { useState, useEffect } from "react";
import { Bell, ChevronLeft, Clock, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Notifications() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notices");
        setNotices(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans pb-32 text-black transition-all animate-in fade-in">
      
      {/* HEADER AREA */}
      <div className="bg-[#1e1b4b] px-8 pt-12 pb-14 rounded-b-[60px] shadow-2xl relative overflow-hidden text-black">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center text-white text-center md:text-left">
          <div className="flex gap-6 items-center animate-in slide-in-from-bottom duration-700">
            <button 
              onClick={() => navigate(-1)} 
              className="bg-white/10 p-3.5 rounded-[22px] border border-white/5 hover:bg-white/20 transition shadow-2xl backdrop-blur-md active:scale-95 group">
              <ChevronLeft className="w-7 h-7 text-white" />
            </button>
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-1">Communication Hub</p>
              <h1 className="text-white text-[32px] font-black leading-tight uppercase tracking-tight">Notices</h1>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
             <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
                <Bell className="text-white w-5 h-5 animate-pulse" />
                <span className="text-white text-[10px] font-black uppercase tracking-widest">Global Feed</span>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 mt-12 w-full flex-1 space-y-8 text-black">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
             <Loader2 className="w-12 h-12 animate-spin text-[#4f46e5] mb-6" />
             <p className="text-gray-400 font-black italic tracking-widest uppercase">Checking Inbox...</p>
          </div>
        ) : notices.length > 0 ? (
          <div className="grid gap-6">
            {notices.map((n, idx) => (
              <div 
                key={n._id || idx} 
                className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group animate-in slide-in-from-bottom"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start gap-6 text-black">
                  <div className="bg-indigo-50 p-5 rounded-[25px] border border-indigo-100 group-hover:bg-[#4f46e5] group-hover:text-white transition shadow-sm">
                    <Bell className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-black text-2xl tracking-tight leading-tight uppercase group-hover:text-[#4f46e5] transition-colors">{n.title}</h4>
                    <p className="text-gray-500 text-[15px] font-bold mt-2 leading-relaxed italic">{n.content}</p>
                    <div className="flex items-center gap-2 text-gray-400 mt-6 font-black text-[10px] uppercase tracking-widest tabular-nums">
                      <Clock className="w-4 h-4 text-indigo-400" /> {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-32 rounded-[50px] border-4 border-dashed border-gray-100 shadow-sm text-center flex flex-col items-center animate-in zoom-in duration-500">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mb-10 shadow-inner">
              <Bell className="text-gray-200 w-12 h-12" />
            </div>
            <h3 className="text-black font-black text-3xl tracking-tight uppercase">Inbox Empty</h3>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-4">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
