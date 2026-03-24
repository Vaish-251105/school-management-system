import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Banknote, 
  Loader2, 
  Activity,
  User,
  CheckCircle,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Salaries() {
  const navigate = useNavigate();
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const res = await api.get("/salaries");
      setSalaries(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (id) => {
    try {
      await api.put(`/salaries/${id}/pay`, {});
      fetchSalaries();
    } catch (err) {
      alert("Error processing payment");
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
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-1">Payroll Control</p>
              <h1 className="text-[32px] font-black uppercase tracking-tight">Staff Salaries</h1>
            </div>
          </div>
          <div className="flex flex-col items-end">
             <p className="text-white/40 text-[9px] font-black uppercase tracking-[3px]">Total Disbursements</p>
             <h4 className="text-2xl font-black uppercase tracking-tight text-emerald-400 leading-none">₹854,000</h4>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-12 grid gap-8">
        {loading ? (
             <div className="flex justify-center py-24 col-span-full"><Loader2 className="animate-spin text-[#4f46e5] w-12 h-12" /></div>
        ) : salaries.length > 0 ? (
          salaries.map((s, idx) => (
            <div key={s._id} className="bg-white p-8 rounded-[50px] border border-gray-100 shadow-sm flex items-center hover:shadow-3xl transition-all group overflow-hidden relative">
               <div className="w-20 h-20 rounded-[28px] bg-emerald-50 text-emerald-500 font-black text-[22px] flex items-center justify-center border-4 border-white shadow-xl shrink-0 group-hover:scale-110 transition-transform">
                  <Banknote className="w-10 h-10" />
               </div>
               <div className="ml-10 flex-1">
                  <div className="flex items-center gap-4">
                     <h4 className="text-black font-black text-2xl uppercase tracking-tight">{s.staffId?.name || "Member"}</h4>
                     <div className="h-0.5 w-12 bg-gray-50"></div>
                     <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">{s.staffId?.role || "Staff"} Staff</span>
                  </div>
                  <div className="flex gap-8 mt-2 items-center">
                     <div className="flex items-center gap-2 text-gray-400 font-black text-[11px] uppercase tracking-widest leading-none italic"><Clock size={12} className="text-[#4f46e5]/40" /> {s.month} {s.year}</div>
                     <div className="flex items-center gap-2 text-black font-black text-[15px] uppercase tracking-tighter leading-none"><Activity size={12} className="text-emerald-500" /> ₹{s.amount.toLocaleString()}</div>
                  </div>
               </div>

               <div className="text-right flex flex-col items-end gap-3">
                  {s.status === 'Paid' ? (
                    <div className="flex items-center gap-3 bg-emerald-50 px-6 py-3 rounded-2xl text-emerald-600 font-black text-[10px] uppercase tracking-widest border border-emerald-100 shadow-sm shadow-emerald-500/10">
                       <CheckCircle className="w-4 h-4" /> Disbursement Complete
                    </div>
                  ) : (
                    <button onClick={() => handlePay(s._id)} className="bg-black text-white px-8 py-4 rounded-[28px] font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all text-[11px] uppercase tracking-widest border border-white/10 group shadow-3xl shadow-indigo-500/10">
                       <ArrowUpRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Process Payment
                    </button>
                  )}
               </div>
            </div>
          ))
        ) : (
          <div className="p-32 text-center bg-gray-50 border-4 border-dashed border-gray-100 rounded-[60px] flex flex-col items-center col-span-full">
               <Activity className="w-16 h-16 text-gray-200 mb-8" />
               <p className="text-gray-400 font-black italic uppercase text-lg leading-none tracking-widest italic leading-relaxed">No payout records found for this period</p>
          </div>
        )}
      </div>
    </div>
  );
}
