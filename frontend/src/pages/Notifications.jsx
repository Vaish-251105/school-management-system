import React, { useState, useEffect } from "react";
import { Bell, ChevronLeft, Clock, Trash2 } from "lucide-react";
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
    <div className="bg-[#fafafa] min-h-screen font-sans pb-10">
      <div className="bg-gradient-to-br from-[#4338ca] to-[#4f46e5] px-6 pt-12 pb-8 rounded-b-[40px] shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="bg-white/10 p-2 rounded-xl border border-white/20 hover:bg-white/20 transition">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white text-xl font-bold">Notifications</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8">
        {loading ? (
          <div className="text-center py-10 text-gray-500 italic">Checking for notifications...</div>
        ) : notices.length > 0 ? (
          <div className="space-y-4">
            {notices.map((n) => (
              <div key={n._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-50 p-3 rounded-xl">
                    <Bell className="text-[#4f46e5] w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-[16px]">{n.title}</h4>
                    <p className="text-gray-600 text-[14px] mt-1 leading-relaxed">{n.content}</p>
                    <div className="flex items-center gap-1.5 text-gray-400 mt-3 font-medium text-[11px]">
                      <Clock className="w-3.5 h-3.5" /> {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="text-gray-300 w-10 h-10" />
            </div>
            <h3 className="text-gray-900 font-bold text-xl">No Notifications</h3>
            <p className="text-gray-500 text-sm mt-2">You're all caught up! New updates will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
