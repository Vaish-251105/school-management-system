import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  MapPin, 
  Bus, 
  Loader2, 
  Phone,
  Activity,
  User,
  Navigation
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Transport() {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bus");
      setBuses(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fafafa] min-h-screen pb-40 font-sans text-black animate-in fade-in transition-all">
      <div className="bg-[#1e1b4b] px-8 pt-12 pb-14 rounded-b-[60px] shadow-2xl text-white relative">
        <div className="max-w-5xl mx-auto flex justify-between items-center relative z-10">
          <div className="flex gap-6 items-center">
            <button onClick={() => navigate(-1)} className="bg-white/10 p-4 rounded-[22px] hover:bg-white/20 transition backdrop-blur-md">
              <ChevronLeft className="w-7 h-7" />
            </button>
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-1">Live Tracking</p>
              <h1 className="text-[32px] font-black uppercase tracking-tight">School Transport</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {loading ? (
           <div className="flex justify-center py-24 col-span-full"><Loader2 className="animate-spin text-[#4f46e5] w-12 h-12" /></div>
        ) : buses.length > 0 ? (
          buses.map((b, idx) => (
            <div key={b._id} className="bg-white p-12 rounded-[60px] border border-gray-100 shadow-sm flex flex-col hover:shadow-3xl transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
               <div className="flex items-center gap-8 mb-10">
                 <div className="bg-amber-100 p-6 rounded-[35px] text-amber-500 shadow-xl group-hover:rotate-12 transition-transform shadow-amber-500/10"><Bus className="w-10 h-10" /></div>
                 <div>
                    <h4 className="text-black font-black text-3xl uppercase tracking-tight tabular-nums">Bus {b.busNumber}</h4>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">{b.route}</p>
                 </div>
               </div>

               <div className="space-y-6 mb-12">
                 <div className="flex items-center gap-5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-black font-black text-sm uppercase tracking-widest leading-none italic">{b.status}</span>
                 </div>
                 <TransportDetail icon={<User />} label="DRIVER" val={b.driverName} />
                 <TransportDetail icon={<Phone />} label="PHONE" val={b.driverPhone} />
               </div>

               <div className="bg-gray-50 rounded-[45px] p-6 border-4 border-dashed border-gray-100 flex flex-col items-center justify-center relative overflow-hidden group/map cursor-pointer group-hover:bg-white transition-colors duration-500 h-64">
                  <div className="absolute inset-0 opacity-10 group-hover/map:opacity-20 transition-opacity">
                      <img src="https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-map-city-vector-set-isolated.jpg" alt="Map" className="w-full h-full object-cover grayscale" />
                  </div>
                  <Navigation className="w-12 h-12 text-indigo-500 animate-bounce mb-4 relative z-10" />
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-[4px] relative z-10">Live Tracking...</p>
                  <div className="absolute bottom-8 right-8 z-20">
                     <button className="bg-black text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all"><Navigation className="w-5 h-5 text-emerald-400" /></button>
                  </div>
               </div>
            </div>
          ))
        ) : (
          <div className="p-32 text-center bg-gray-50 border-4 border-dashed border-gray-100 rounded-[60px] flex flex-col items-center col-span-full">
               <Activity className="w-16 h-16 text-gray-200 mb-8" />
               <p className="text-gray-400 font-black italic uppercase text-lg leading-none tracking-widest">No transport records found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TransportDetail({ icon, label, val }) {
  return (
    <div className="flex items-center gap-6">
       <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">{React.cloneElement(icon, { size: 18 })}</div>
       <div>
          <p className="text-gray-300 font-black text-[9px] uppercase tracking-[3px]">{label}</p>
          <p className="text-black font-black text-sm uppercase mt-0.5">{val}</p>
       </div>
    </div>
  );
}
