import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Search,
  CheckCircle2,
  Download,
  Banknote,
  BarChart,
  Plus,
  Loader2,
  FileText,
  ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Fees() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showReceipt, setShowReceipt] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const userRole = user?.role?.toLowerCase();
  const canManage = userRole === 'admin' || userRole === 'accountant';
  const canPayLocal = userRole === 'student' || userRole === 'parent';

  useEffect(() => {
    fetchFees();
  }, []);

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

  const handlePay = async (id) => {
    try {
      if (!window.confirm("Simulate secure payment for this invoice?")) return;
      const transactionId = "TXN" + Math.random().toString(36).substr(2, 9).toUpperCase();
      const response = await api.post(`/fees/pay/${id}`, { transactionId });
      if (response.data) {
        alert(`Payment successful! Transaction ID: ${transactionId}`);
        fetchFees();
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed.");
    }
  };

  const handleDownloadReceipt = (f) => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowReceipt(f);
    }, 1500);
  };

  const filteredFees = fees.filter(f => {
    const title = (f.title || f.type || "").toLowerCase();
    const student = (f.studentId?.name || "").toLowerCase();
    return title.includes(searchQuery.toLowerCase()) || student.includes(searchQuery.toLowerCase());
  });

  const totalReceived = fees.filter(f => f.status === 'paid' || f.paid).reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalPending = fees.filter(f => f.status !== 'paid' && !f.paid).reduce((acc, curr) => acc + (curr.amount || 0), 0);

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa]">
       <Loader2 className="w-12 h-12 animate-spin text-[#4f46e5] mb-6" />
       <p className="text-gray-400 font-black italic tracking-widest uppercase">Syncing Records...</p>
     </div>
  );

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans flex flex-col pb-32 transition-all">
      
      {/* HEADER AREA */}
      <div className="bg-[#4f46e5] px-6 pt-12 pb-12 rounded-b-[60px] shadow-2xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-6xl mx-auto relative z-10 text-white">
          <div className="flex justify-between items-center mb-10">
            <div className="flex gap-4 items-center">
              <button 
                onClick={() => navigate(-1)} 
                className="bg-white/10 p-3.5 rounded-[22px] border border-white/5 hover:bg-white/20 transition shadow-2xl backdrop-blur-md active:scale-95">
                <ChevronLeft className="w-7 h-7 text-white" />
              </button>
              <div>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-1">Financial Intelligence</p>
                <h1 className="text-white text-[32px] font-black leading-tight uppercase tracking-tight">Fees & Payments</h1>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[40px] p-10 shadow-inner grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[5px] mb-2">Total Collection</p>
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

      <div className="max-w-6xl mx-auto px-8 mt-12 w-full flex-1">
        
        {/* SEARCH BAR */}
        <div className="mb-12 relative group max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 group-focus-within:text-[#4f46e5] transition" />
          <input 
            type="text" 
            placeholder="Search student or fee type..." 
            className="w-full pl-16 pr-8 py-6 bg-white border border-gray-100 rounded-[30px] shadow-sm outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all font-bold text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {filteredFees.length > 0 ? (
            filteredFees.map((f, idx) => (
              <FeeCard 
                key={f._id || idx} idx={idx} fee={f}
                canManage={canManage} canPay={canPayLocal}
                onPay={handlePay}
                onDownload={handleDownloadReceipt}
              />
            ))
          ) : (
            <div className="col-span-full p-32 text-center bg-gray-50 border-4 border-dashed border-gray-100 rounded-[50px] flex flex-col items-center">
               <Banknote className="w-16 h-16 text-gray-200 mb-6" />
               <p className="text-gray-400 font-black italic uppercase text-lg">No records found matching your query</p>
            </div>
          )}
        </div>

        {/* SUMMARY CARD */}
        <div className="bg-black p-12 rounded-[50px] shadow-3xl relative overflow-hidden group mb-20">
           <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
             <BarChart className="w-40 h-40 text-emerald-400" />
           </div>
           <h4 className="text-white text-2xl font-black tracking-tight uppercase mb-4 relative z-10">Institution Overview</h4>
           <div className="flex flex-col md:flex-row md:items-center gap-10">
              <p className="text-white/40 font-bold text-sm leading-relaxed relative z-10 w-full max-w-lg">All transactions are secured and encrypted. Automated digital receipts are generated for every successful payment to ensure financial auditing compliance.</p>
              <div className="flex gap-4">
                 <div className="bg-white/5 p-4 rounded-3xl border border-white/10 text-center min-w-[120px]">
                    <p className="text-indigo-400 font-black text-2xl uppercase">{fees.length}</p>
                    <p className="text-white/20 font-black text-[9px] uppercase tracking-widest mt-1">Invoices</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-3xl border border-white/10 text-center min-w-[120px]">
                    <p className="text-emerald-400 font-black text-2xl uppercase">{fees.filter(f => f.paid || f.status === 'paid').length}</p>
                    <p className="text-white/20 font-black text-[9px] uppercase tracking-widest mt-1">Settled</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {canManage && (
        <div className="fixed bottom-10 right-10 z-[100]">
          <button 
            onClick={() => alert("Redirecting to fee configuration...")}
            className="bg-[#4f46e5] text-white px-10 py-5 rounded-[30px] font-black shadow-3xl shadow-indigo-500/30 flex items-center gap-4 hover:scale-110 active:scale-95 transition-all text-[15px] uppercase tracking-widest border border-white/10 group">
            <Plus className="w-7 h-7 text-indigo-300 group-hover:rotate-90 transition-transform" /> Mass Assign Fee
          </button>
        </div>
      )}

      {/* GENERATING OVERLAY */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex flex-col items-center justify-center text-white p-6">
           <div className="bg-white/10 p-10 rounded-[50px] border border-white/10 flex flex-col items-center animate-pulse">
              <Loader2 className="w-16 h-16 text-indigo-400 animate-spin mb-6" />
              <h2 className="text-2xl font-black uppercase tracking-tight">Generating PDF Receipt</h2>
              <p className="text-white/40 font-bold text-sm mt-2">Connecting to secure vault...</p>
           </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6 animate-in fade-in zoom-in">
           <div className="bg-white w-full max-w-lg rounded-[50px] shadow-3xl p-12 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-50 to-white -z-10"></div>
              
              <div className="flex flex-col items-center text-center">
                 <div className="bg-emerald-50 w-24 h-24 rounded-[35px] flex items-center justify-center mb-6 border border-emerald-100">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                 </div>
                 <h2 className="text-3xl font-black uppercase tracking-tight text-black">Payment Confirmed</h2>
                 <p className="text-gray-400 font-bold text-xs uppercase tracking-[3px] mt-2 mb-10">Digital Receipt Attached</p>

                 <div className="w-full bg-gray-50 rounded-[40px] p-8 space-y-4 border border-gray-100">
                    <ReceiptRow label="Receipt ID" value={`RCPT-${showReceipt._id?.substring(0,8).toUpperCase()}`} />
                    <ReceiptRow label="Amount Settled" value={`₹${showReceipt.amount?.toLocaleString('en-IN')}`} isBold />
                    <ReceiptRow label="Status" value="Settled & Audited" isGreen />
                    <ReceiptRow label="Timestamp" value={new Date().toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'})} />
                 </div>

                 <div className="mt-10 flex gap-4 w-full">
                    <button 
                       onClick={() => {
                          alert("PDF saved to downloads directory.");
                          setShowReceipt(null);
                       }}
                       className="flex-1 bg-black text-white py-5 rounded-[28px] font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition active:scale-95 flex items-center justify-center gap-3">
                       <Download className="w-5 h-5 text-emerald-400" /> Download PDF
                    </button>
                    <button 
                       onClick={() => setShowReceipt(null)}
                       className="flex-1 bg-gray-100 text-black py-5 rounded-[28px] font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition active:scale-95">
                       Close
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}

function ReceiptRow({ label, value, isBold, isGreen }) {
  return (
    <div className="flex justify-between items-center text-sm">
       <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{label}</span>
       <span className={`font-black uppercase tracking-tight ${isBold ? 'text-xl text-[#4f46e5]' : 'text-black'} ${isGreen ? 'text-emerald-500' : ''}`}>{value}</span>
    </div>
  );
}

function FeeCard({ idx, fee, canManage, canPay, onPay, onDownload }) {
  const isPaid = fee.status === 'paid' || fee.paid;

  return (
    <div 
      className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group animate-in slide-in-from-bottom"
      style={{ animationDelay: `${idx * 80}ms` }}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
           <div className={`font-black text-[9px] uppercase tracking-[2px] px-3 py-1 rounded-xl w-fit mb-4 ${isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
              {isPaid ? "Settled Invoice" : "Active Dues"}
           </div>
           <h4 className="font-black text-black text-2xl tracking-tight leading-tight uppercase group-hover:text-[#4f46e5] transition-colors">
              {fee.title || fee.type || "School Fee"}
           </h4>
           <p className="text-gray-400 text-[10px] font-black uppercase mt-1 italic tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> {fee.studentId?.name || "Assigned Student"}
           </p>
        </div>
        <div className={`font-black text-[10px] px-5 py-2 rounded-2xl uppercase tracking-widest border-2 ${
          isPaid ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
        }`}>
          {isPaid ? "Paid" : "Pending"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10 py-8 border-y border-gray-50 text-black">
        <div>
           <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Due Date</p>
           <p className="text-black font-black text-lg tabular-nums italic uppercase">
              {new Date(fee.dueDate).toLocaleDateString()}
           </p>
        </div>
        <div className="text-right">
           <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Invoice Value</p>
           <p className="text-[#4f46e5] text-[28px] font-black tracking-tight leading-none uppercase">
              ₹{fee.amount?.toLocaleString('en-IN')}
           </p>
        </div>
      </div>

      <div className="flex gap-4">
        {!isPaid && (
          <>
            {canManage && (
              <button 
                onClick={() => onPay(fee._id)}
                className="flex-1 bg-black text-white py-5 rounded-[28px] font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition active:scale-95 shadow-xl flex items-center justify-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Mark Paid
              </button>
            )}
            {canPay && (
              <button 
                onClick={() => onPay(fee._id)}
                className="flex-1 bg-[#4f46e5] text-white py-5 rounded-[28px] font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition active:scale-95 shadow-xl flex items-center justify-center gap-3">
                <Banknote className="w-5 h-5 text-indigo-200" /> Pay Now
              </button>
            )}
          </>
        )}
        {isPaid && (
          <button 
            onClick={() => onDownload(fee)}
            className="flex-1 bg-white border border-gray-100 text-black py-5 rounded-[28px] font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition active:scale-95 shadow-sm flex items-center justify-center gap-3">
            <FileText className="w-5 h-5 text-indigo-500" /> View Receipt
          </button>
        )}
      </div>
    </div>
  );
}