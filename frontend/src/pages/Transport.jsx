import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  MapPin, 
  Bus, 
  Loader2, 
  Phone,
  Activity,
  User,
  Navigation,
  ShieldCheck,
  Zap,
  Clock,
  Map as MapIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Transport() {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBus, setActiveBus] = useState(null);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bus");
      const list = Array.isArray(res.data) ? res.data : [];
      setBuses(list);
      if (list.length > 0) setActiveBus(list[0]);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans text-black transition-all">
      
      {/* HEADER */}
      <div className="bg-[#1e1b4b] px-8 pt-12 pb-14 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4f46e5]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">
          <div className="flex gap-6 items-center">
            <button onClick={() => navigate(-1)} className="bg-white/10 p-4 rounded-[22px] hover:bg-white/20 transition backdrop-blur-md active:scale-95 shadow-2xl border border-white/5">
              <ChevronLeft className="w-7 h-7" />
            </button>
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[5px] mb-1">Logistics & Fleet</p>
              <h1 className="text-[36px] font-black uppercase tracking-tight leading-none">Vehicle Tracking</h1>
            </div>
          </div>
          <div className="hidden md:flex gap-4">
             <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
                <span className="text-[10px] font-black uppercase tracking-[2px]">Systems Nominal</span>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-20 pb-32">
        
        {/* BUS LIST */}
        <div className="lg:col-span-4 space-y-6">
           <h3 className="text-black font-black text-xs uppercase tracking-[4px] px-4 mb-4 flex items-center gap-3">
              <Zap className="w-4 h-4 text-amber-500" /> Active Fleet ({buses.length})
           </h3>
           {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#4f46e5] w-12 h-12" /></div>
           ) : buses.length > 0 ? (
             buses.map((b, idx) => (
                <div 
                  key={b._id || idx}
                  onClick={() => setActiveBus(b)}
                  className={`p-8 rounded-[40px] border transition-all cursor-pointer group relative overflow-hidden ${
                     activeBus?._id === b._id 
                     ? "bg-white border-[#4f46e5] shadow-3xl scale-105" 
                     : "bg-white/50 border-gray-100 opacity-60 hover:opacity-100 hover:bg-white"
                  }`}
                >
                   <div className="flex items-center gap-6">
                      <div className={`p-4 rounded-2xl ${activeBus?._id === b._id ? 'bg-[#4f46e5] text-white' : 'bg-gray-100 text-gray-400 opacity-50'}`}>
                         <Bus className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                         <h4 className="font-black text-xl uppercase tracking-tight leading-none text-black">Bus {b.busNumber}</h4>
                         <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1.5">{b.route}</p>
                      </div>
                      {activeBus?._id === b._id && <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50"></div>}
                   </div>
                </div>
             ))
           ) : (
             <div className="bg-white p-12 rounded-[40px] border border-dashed border-gray-200 text-center flex flex-col items-center">
                <Activity className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-400 font-black uppercase text-[11px] tracking-widest">No assigned routes</p>
             </div>
           )}
        </div>

        {/* MAP & DETAILS SECTION */}
        <div className="lg:col-span-8 flex flex-col gap-10">
           {activeBus ? (
              <>
                {/* MOCK MAP COMPONENT */}
                <div className="bg-white border border-gray-100 rounded-[50px] shadow-3xl overflow-hidden h-[550px] relative animate-in zoom-in duration-500">
                   {/* MAP BACKGROUND MOCK */}
                   <div className="absolute inset-0 z-0">
                      <img 
                        src="https://media.wired.com/photos/59269e967034dc5f91bebabd/master/pass/GoogleMapTA.jpg" 
                        alt="Map" 
                        className="w-full h-full object-cover opacity-60 contrast-125"
                      />
                      <div className="absolute inset-0 bg-indigo-900/10 mix-blend-overlay"></div>
                   </div>

                   {/* BUS MARKER SIMULATION */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group">
                      <div className="bg-white px-5 py-2 rounded-2xl shadow-2xl border border-gray-100 mb-3 animate-bounce">
                         <p className="text-[#4f46e5] font-black text-[11px] uppercase tracking-widest leading-none">Bus {activeBus.busNumber}</p>
                      </div>
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-3xl border-4 border-indigo-500 animate-pulse relative">
                        <Bus className="w-8 h-8 text-indigo-600" />
                        <div className="absolute -inset-4 bg-indigo-500/20 rounded-full animate-ping -z-10"></div>
                      </div>
                   </div>

                   {/* MAP OVERLAYS */}
                   <div className="absolute top-10 left-10 p-6 bg-white/90 backdrop-blur-md rounded-[35px] shadow-2xl border border-white/20 z-20 flex items-center gap-6">
                      <div className="bg-emerald-500 p-4 rounded-2xl shadow-lg shadow-emerald-500/20 text-white">
                         <Navigation className="w-6 h-6 rotate-45" />
                      </div>
                      <div>
                         <p className="text-gray-400 font-black text-[9px] uppercase tracking-[3px] mb-1">Next Destination</p>
                         <h5 className="text-black font-black text-lg uppercase leading-none tracking-tight">{activeBus.route?.split('-')[1]?.trim() || "School Terminal"}</h5>
                      </div>
                   </div>

                   <button className="absolute bottom-10 right-10 bg-black text-white p-6 rounded-[30px] shadow-3xl hover:scale-110 active:scale-95 transition-all z-20 flex items-center gap-4">
                      <MapIcon className="w-6 h-6 text-indigo-400" />
                      <span className="font-black text-xs uppercase tracking-widest">Re-Center GPS</span>
                   </button>
                </div>

                {/* TRIP DETAILS TABLE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-white p-10 rounded-[45px] border border-gray-100 shadow-sm flex flex-col justify-between">
                      <div className="flex gap-6 items-center mb-10">
                         <div className="bg-rose-50 p-4 rounded-2xl text-rose-500"><User className="w-8 h-8" /></div>
                         <div>
                            <p className="text-gray-400 font-black text-[9px] uppercase tracking-[3px] mb-1">Crew Detail</p>
                            <h5 className="text-black font-black text-xl uppercase tracking-tighter leading-none">{activeBus.driverName}</h5>
                         </div>
                      </div>
                      <div className="bg-gray-50 border border-gray-100 p-6 rounded-3xl flex items-center justify-between">
                         <div className="flex items-center gap-4 text-gray-500">
                            <Phone className="w-5 h-5 text-indigo-400" />
                            <span className="font-black text-xs tracking-widest">{activeBus.driverPhone}</span>
                         </div>
                         <button className="bg-white text-emerald-600 p-3 rounded-xl shadow-lg border border-emerald-100 hover:scale-110 active:scale-95 transition">
                            <Phone className="w-4 h-4" />
                         </button>
                      </div>
                   </div>

                   <div className="bg-white p-10 rounded-[45px] border border-gray-100 shadow-sm flex flex-col">
                      <div className="flex justify-between items-start mb-10">
                         <div className="flex gap-6 items-center">
                            <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-500"><Clock className="w-8 h-8" /></div>
                            <div>
                               <p className="text-gray-400 font-black text-[9px] uppercase tracking-[3px] mb-1">Current Status</p>
                               <h5 className="text-indigo-600 font-black text-xl uppercase tracking-tighter leading-none">{activeBus.status}</h5>
                            </div>
                         </div>
                         <div className="bg-emerald-50 px-4 py-2 rounded-xl text-emerald-600 font-black text-[10px] uppercase border border-emerald-100 tracking-widest">Verified Trip</div>
                      </div>
                      <div className="mt-auto space-y-3">
                         <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                           <ShieldCheck className="w-4 h-4 text-emerald-500" /> Security Protocol Active
                         </p>
                         <div className="w-full bg-gray-100 h-2.5 rounded-full relative overflow-hidden">
                            <div className="absolute top-0 left-0 h-full bg-[#4f46e5] w-3/4 rounded-full"></div>
                         </div>
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-300">
                            <span>Origin</span>
                            <span>Destination</span>
                         </div>
                      </div>
                   </div>
                </div>
              </>
           ) : (
              <div className="bg-gray-50 rounded-[60px] border-4 border-dashed border-gray-100 h-full min-h-[500px] flex flex-col items-center justify-center p-20 text-center animate-pulse">
                 <Bus className="w-24 h-24 text-gray-200 mb-8" />
                 <h4 className="text-gray-400 font-black text-2xl uppercase tracking-widest leading-none mb-4">Select a Vehicle</h4>
                 <p className="text-gray-300 font-bold max-w-sm">Tap on an active bus from the fleet directory to synchronize live telemetry and GPS coordinates.</p>
              </div>
           )}
        </div>
      </div>

    </div>
  );
}
