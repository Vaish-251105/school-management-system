import React from "react";
import AnalyticsCards from "../components/AnalyticsCards"
import AnalyticsCharts from "../components/AnalyticsCharts"
import ReportsTable from "../components/ReportsTable"
import { ChevronLeft, BarChart2, FileText, Activity, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Reports() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#fafafa] min-h-screen pb-32 font-sans transition-all animate-in fade-in text-black">
      
      {/* HEADER AREA */}
      <div className="bg-[#1e1b4b] px-8 pt-12 pb-14 rounded-b-[60px] shadow-2xl relative overflow-hidden text-black">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center text-white text-center md:text-left text-black">
          <div className="flex gap-6 items-center animate-in slide-in-from-bottom duration-700">
            <button 
              onClick={() => navigate(-1)} 
              className="bg-white/10 p-3.5 rounded-[22px] border border-white/5 hover:bg-white/20 transition shadow-2xl backdrop-blur-md active:scale-95 group">
              <ChevronLeft className="w-7 h-7 text-white" />
            </button>
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-1">Analytical Terminal</p>
              <h1 className="text-white text-[32px] font-black leading-tight uppercase tracking-tight">Reports</h1>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
             <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
                <Activity className="text-emerald-400 w-5 h-5 animate-pulse" />
                <span className="text-white text-[10px] font-black uppercase tracking-widest">Real-time Data</span>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-12 w-full flex-1 space-y-10 text-black">
        
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <AnalyticsCards />
        </div>

        {/* CHARTS */}
        <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-2xl relative overflow-hidden group text-black">
           <div className="flex justify-between items-end mb-10">
              <div>
                <h3 className="text-2xl font-black text-black tracking-tight uppercase">Performance Analytics</h3>
                <p className="text-gray-400 font-bold text-xs uppercase mt-1">Institutional Growth & Metrics</p>
              </div>
              <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600 border border-indigo-100"><Layers className="w-6 h-6" /></div>
           </div>
           <div className="p-4 bg-gray-50 rounded-[40px] border border-white">
             <AnalyticsCharts />
           </div>
        </div>

        {/* TABLE */}
        <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-2xl relative overflow-hidden text-black">
           <div className="flex justify-between items-end mb-10">
              <div>
                <h3 className="text-2xl font-black text-black tracking-tight uppercase">Detailed Archive</h3>
                <p className="text-gray-400 font-bold text-xs uppercase mt-1">Exportable historical data</p>
              </div>
              <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600 border border-emerald-100"><FileText className="w-6 h-6" /></div>
           </div>
           <ReportsTable />
        </div>

      </div>

    </div>
  );
}