import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  MoreVertical,
  TrendingUp,
  Check,
  Bell,
  CheckCircle2,
  Download,
  Banknote,
  BarChart,
  ArrowRight,
  Plus,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Fees() {
  const navigate = useNavigate();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        setLoading(true);
        const response = await api.get("/fees");
        setFees(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  const handlePay = async (id) => {
    try {
      const transactionId = "TXN" + Math.random().toString(36).substr(2, 9).toUpperCase();
      const response = await api.post(`/fees/pay/${id}`, { transactionId });
      if (response.data) {
        alert(`Payment successful! Transaction ID: ${transactionId}`);
        const refreshRes = await api.get("/fees");
        setFees(Array.isArray(refreshRes.data) ? refreshRes.data : []);
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Please try again.");
    }
  };

  const totalReceived = fees.filter(f => f.paid).reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalPending = fees.filter(f => !f.paid).reduce((acc, curr) => acc + (curr.amount || 0), 0);

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa]">
       <Loader2 className="w-12 h-12 animate-spin text-[#4f46e5] mb-6" />
       <p className="text-gray-400 font-black italic tracking-widest uppercase">Syncing Records...</p>
     </div>
  );

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans flex flex-col pb-32 transition-all animate-in fade-in">
      
      {/* HEADER AREA */}
      <div className="bg-[#1e1b4b] px-6 pt-12 pb-12 rounded-b-[60px] shadow-2xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-5xl mx-auto relative z-10 text-white">
          <div className="flex justify-between items-center mb-10 text-center md:text-left">
            <div className="flex gap-4 items-center">
              <button 
                onClick={() => navigate(-1)} 
                className="bg-white/10 p-3.5 rounded-[22px] border border-white/5 hover:bg-white/20 transition shadow-2xl backdrop-blur-md active:scale-95 group">
                <ChevronLeft className="w-7 h-7 text-white" />
              </button>
              <div>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-1">Financial Ledger</p>
                <h1 className="text-white text-[32px] font-black leading-tight uppercase tracking-tight">Finance</h1>
              </div>
            </div>
            <div className="hidden md:flex gap-4">
               <button className="bg-white/10 p-4 rounded-3xl border border-white/5 hover:bg-white/20 transition group shadow-2xl backdrop-blur-md text-white">
                 <Bell className="w-7 h-7" />
               </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[40px] p-10 shadow-inner grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[20px] mb-2">Total Collection</p>
              <h2 className="text-white text-[32px] font-black tracking-tight leading-none uppercase">₹{(totalReceived + totalPending).toLocaleString('en-IN')}</h2>
            </div>
            <div className="border-l border-white/10 pl-8">
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">Received</p>
              <h3 className="text-white text-2xl font-black tracking-tight leading-none tabular-nums">₹{totalReceived.toLocaleString('en-IN')}</h3>
            </div>
            <div className="border-l border-white/10 pl-8">
              <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest mb-1">Pending</p>
              <h3 className="text-white text-2xl font-black tracking-tight leading-none tabular-nums">₹{totalPending.toLocaleString('en-IN')}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-12 w-full flex-1 text-black font-sans">
        
        <div className="flex justify-between items-end mb-8 px-2">
           <h3 className="text-black font-black text-2xl tracking-tight uppercase leading-none">Transactions</h3>
           <div className="bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 flex items-center gap-2">
             <div className="w-2.5 h-2.5 bg-[#4f46e5] rounded-full animate-pulse"></div>
             <span className="text-[#4f46e5] text-[10px] font-black uppercase tracking-widest leading-none">Synced</span>
           </div>
        </div>

        <div className="grid gap-8 mb-16">
          {fees.length > 0 ? (
            fees.map((f, idx) => (
              <FeeCard 
                key={f._id || idx} idx={idx} id={f._id} title={`${f.type} Fee`} subtitle={`Student ID: ${f.studentId}`}
                date={new Date(f.dueDate).toLocaleDateString()} amount={`₹${f.amount.toLocaleString('en-IN')}`}
                status={f.paid ? "Paid" : "Pending"} hasPay={!f.paid} onPay={handlePay}
              />
            ))
          ) : (
            <div className="p-32 text-center bg-gray-50 border-4 border-dashed border-gray-100 rounded-[50px] flex flex-col items-center">
               <Banknote className="w-16 h-16 text-gray-200 mb-6" />
               <p className="text-gray-400 font-black italic uppercase text-lg">No records found</p>
            </div>
          )}
        </div>

        {/* FINANCIAL SUMMARY */}
        <div className="bg-black p-10 rounded-[50px] shadow-3xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
             <BarChart className="w-32 h-32 text-emerald-400" />
           </div>
           <h4 className="text-white text-2xl font-black tracking-tight uppercase mb-4 relative z-10">Financial Summary</h4>
           <p className="text-white/40 font-bold text-sm leading-relaxed mb-10 relative z-10 w-full max-w-lg">Your monthly institution financial report is generated in real-time. Review pending collections and audit logs for the current session.</p>
           <button 
             onClick={() => alert("Redirecting to audit reports...")}
             className="bg-emerald-500 text-white px-10 py-5 rounded-[30px] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-emerald-600 transition active:scale-95 flex items-center gap-4 relative z-10">
              <Download className="w-6 h-6 text-emerald-900/50" /> View Audit Report
           </button>
        </div>

      </div>

      <div className="fixed bottom-10 right-10 z-[100]">
        <button 
          onClick={() => alert("Opening Fee Collection Form...")}
          className="bg-[#4f46e5] text-white px-10 py-5 rounded-[30px] font-black shadow-3xl shadow-indigo-500/20 flex items-center gap-4 hover:scale-110 active:scale-95 transition-all text-[15px] uppercase tracking-widest border border-white/10">
          <Plus className="w-7 h-7 text-indigo-300" /> Collect Fee
        </button>
      </div>

    </div>
  );
}

function FeeCard({ idx, id, title, subtitle, date, amount, status, hasPay, onPay }) {
  
  const isPaid = status === "Paid";

  return (
    <div 
      className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group animate-in slide-in-from-bottom"
      style={{ animationDelay: `${idx * 100}ms` }}
    >
      
      <div className="flex justify-between items-start mb-6 text-black">
        <div>
           <div className="bg-indigo-50 text-indigo-600 font-black text-[10px] uppercase tracking-[2px] px-3 py-1 rounded-xl w-fit mb-4">Official Receipt</div>
           <h4 className="font-black text-black text-2xl tracking-tight leading-tight uppercase group-hover:text-[#4f46e5] transition-colors">{title}</h4>
           <p className="text-gray-400 text-xs font-black uppercase mt-1 italic">{subtitle}</p>
        </div>
        <div className={`font-black text-[11px] px-5 py-2 rounded-2xl uppercase tracking-widest border-2 ${
          isPaid ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
        }`}>
          {status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10 py-8 border-y border-gray-50 text-black">
        <div>
           <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Payment Deadline</p>
           <p className="text-black font-black text-xl tabular-nums italic uppercase">{date}</p>
        </div>
        <div className="text-right">
           <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Fee Amount</p>
           <p className="text-[#4f46e5] text-3xl font-black tracking-tight leading-none uppercase">{amount}</p>
        </div>
      </div>

      <div className="flex gap-4">
        {hasPay && (
          <button 
            onClick={() => onPay(id)}
            className="flex-1 bg-black text-white py-5 rounded-[28px] font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition active:scale-95 shadow-xl flex items-center justify-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Mark As Paid
          </button>
        )}
        <button 
          onClick={() => alert("Digital receipt generated.")}
          className="flex-1 bg-white border border-gray-100 text-black py-5 rounded-[28px] font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition active:scale-95 shadow-sm flex items-center justify-center gap-3">
          <Download className="w-5 h-5 text-indigo-500" /> Digital Receipt
        </button>
      </div>

    </div>
  );
}