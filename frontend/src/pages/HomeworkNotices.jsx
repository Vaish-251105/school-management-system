import React, { useState, useEffect } from "react";
import NoticeForm from "../components/NoticeForm";
import NoticeList from "../components/NoticeList";
import HomeworkForm from "../components/HomeworkForm";
import HomeworkList from "../components/HomeworkList";
import api from "../utils/api";
import { Loader2, Megaphone, PenTool, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomeworkNotices() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [nRes, hRes] = await Promise.all([
        api.get("/notices"),
        api.get("/homework")
      ]);
      setNotices(Array.isArray(nRes.data) ? nRes.data : []);
      setHomeworks(Array.isArray(hRes.data) ? hRes.data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addNotice = async (noticeData) => {
    try {
      await api.post("/notices", noticeData);
      fetchData();
    } catch (err) {
      alert("Failed to post notice");
    }
  };

  const addHomework = async (hwData) => {
    try {
      await api.post("/homework", hwData);
      fetchData();
    } catch (err) {
      alert("Failed to assign homework");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
      <p className="text-gray-500 font-medium tracking-wide">Syncing Academic Hub...</p>
    </div>
  );

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans pb-20">
      
      {/* HEADER AREA */}
      <div className="bg-gradient-to-br from-[#1e1b4b] to-[#312e81] px-6 pt-12 pb-10 rounded-b-[40px] shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="bg-white/10 p-2 rounded-xl text-white hover:bg-white/20 transition">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-white text-2xl font-bold tracking-tight">Academic Management</h1>
            <p className="text-indigo-200/70 text-sm mt-0.5 font-medium">Broadcast notices and assign daily coursework</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* NOTICES SECTION */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-50 p-2.5 rounded-2xl">
                   <Megaphone className="text-orange-600 w-6 h-6" />
                </div>
                <h2 className="text-xl font-extrabold text-[#111827]">Post Announcement</h2>
              </div>
              <NoticeForm addNotice={addNotice} />
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl">
               <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
                 Recent Broadcasts
                 <span className="bg-gray-100 text-gray-500 text-[10px] px-3 py-1 rounded-full">{notices.length} Logs</span>
               </h3>
               <NoticeList notices={notices} />
            </div>
          </div>

          {/* HOMEWORK SECTION */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-50 p-2.5 rounded-2xl">
                   <PenTool className="text-blue-600 w-6 h-6" />
                </div>
                <h2 className="text-xl font-extrabold text-[#111827]">Assign Coursework</h2>
              </div>
              <HomeworkForm addHomework={addHomework} />
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl">
               <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
                 Assignment Ledger
                 <span className="bg-gray-100 text-gray-500 text-[10px] px-3 py-1 rounded-full">{homeworks.length} Active</span>
               </h3>
               <HomeworkList homeworks={homeworks} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}