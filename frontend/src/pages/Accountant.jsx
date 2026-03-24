import React, { useState, useEffect } from "react"
import api from "../utils/api"
import ExpenseForm from "../components/ExpenseForm"
import ExpenseList from "../components/ExpenseList"
import TransactionTable from "../components/TransactionTable"
import FinanceCharts from "../components/FinanceCharts"
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Landmark, 
  FileText, 
  Plus, 
  RefreshCw, 
  ChevronLeft, 
  MoreVertical,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Search,
  ChevronRight,
  Loader2
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Accountant() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([])
  const [fees, setFees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expRes, feeRes] = await Promise.all([
        api.get("/expenses"),
        api.get("/fees")
      ]);
      setExpenses(Array.isArray(expRes.data) ? expRes.data : []);
      setFees(Array.isArray(feeRes.data) ? feeRes.data : []);
    } catch (err) {
      console.error("Finance fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  const addExpense = async (data) => {
    try {
      await api.post("/expenses", data);
      setShowExpenseForm(false);
      fetchData();
    } catch (err) { alert("Failed to add expense. Try again."); }
  }

  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense record?")) return;
    try {
      await api.delete(`/expenses/${id}`);
      fetchData();
    } catch (err) { alert("Delete failed"); }
  }

  const totalExpenses = expenses.reduce((a, b) => a + (Number(b.amount) || 0), 0)
  const totalCollectedFees = fees.filter(f => f.paid || f.status === 'paid').reduce((a, b) => a + (Number(b.amount) || 0), 0)
  const totalPendingFees = fees.filter(f => !f.paid && f.status !== 'paid').reduce((a, b) => a + (Number(b.amount) || 0), 0)
  const netBalance = totalCollectedFees - totalExpenses;

  const generateReport = () => {
    const reportData = [
      ["Type", "Title", "Amount", "Date"],
      ...fees.map(f => ["Fee Receipt", f.type || "School Fee", f.amount, new Date(f.createdAt).toLocaleDateString()]),
      ...expenses.map(e => ["Expense", e.title, e.amount, new Date(e.date || e.createdAt).toLocaleDateString()])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + reportData.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Finance_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa]">
      <Loader2 className="w-12 h-12 animate-spin text-teal-600 mb-6" />
      <p className="text-gray-400 font-black italic tracking-widest uppercase text-black">Syncing Ledger...</p>
    </div>
  )

  return (
    <div className="bg-[#fafafa] min-h-screen pb-40 font-sans animate-in fade-in transition-all text-black">
      
      {/* HEADER AREA */}
      <div className="bg-[#0d9488] px-8 pt-12 pb-14 rounded-b-[60px] shadow-2xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center text-white text-center md:text-left text-black">
          <div className="flex gap-6 items-center animate-in slide-in-from-bottom duration-700">
            <button 
              onClick={() => navigate(-1)} 
              className="bg-white/10 p-3.5 rounded-[22px] border border-white/5 hover:bg-white/20 transition shadow-2xl backdrop-blur-md active:scale-95 group">
              <ChevronLeft className="w-7 h-7 text-white" />
            </button>
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-1">Financial Portal</p>
              <h1 className="text-white text-[32px] font-black leading-tight uppercase tracking-tight">Accountant Dashboard</h1>
            </div>
          </div>
          <div className="flex gap-4 mt-6 md:mt-0">
             <button onClick={fetchData} className="bg-white/10 p-4 rounded-3xl border border-white/5 hover:bg-white/20 transition group shadow-2xl backdrop-blur-md text-white">
               <RefreshCw className="w-7 h-7" />
             </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-10 relative z-10 animate-in slide-in-from-bottom duration-1000">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
             <FinanceStat title="FEES COLLECTED" val={totalCollectedFees} color="teal" icon={<TrendingUp />} />
             <FinanceStat title="PENDING FEES" val={totalPendingFees} color="amber" icon={<Landmark />} />
             <FinanceStat title="TOTAL EXPENSES" val={totalExpenses} color="rose" icon={<TrendingDown />} />
             <FinanceStat title="NET BALANCE" val={netBalance} color="emerald" icon={<Wallet />} />
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-12 w-full flex-1">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            
            {/* ACTIONS */}
            <div className="bg-white p-6 rounded-[40px] border border-gray-100 shadow-xl flex items-center justify-between text-black">
               <div className="flex gap-4">
                  <button
                    onClick={() => setShowExpenseForm(!showExpenseForm)}
                    className="flex items-center gap-3 bg-black text-white px-8 py-5 rounded-[28px] font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95">
                    <Plus className="w-5 h-5 text-teal-400" /> 
                    {showExpenseForm ? "Close Form" : "Add Expense"}
                  </button>
                  <button 
                    onClick={generateReport}
                    className="flex items-center gap-3 bg-white border border-gray-100 text-black px-8 py-5 rounded-[28px] font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition shadow-sm active:scale-95">
                    <FileText className="w-5 h-5 text-teal-500" /> Export CSV
                  </button>
               </div>
               <div className="hidden lg:flex items-center gap-3 bg-teal-50 px-6 py-3 rounded-2xl border border-teal-100">
                  <Activity className="text-teal-500 w-5 h-5 animate-pulse" />
                  <span className="text-teal-700 text-[10px] font-black uppercase tracking-widest leading-none">Live Sync</span>
               </div>
            </div>

            {showExpenseForm && (
              <div className="animate-in slide-in-from-top duration-500">
                <ExpenseForm addExpense={addExpense} />
              </div>
            )}

            <div className="bg-white rounded-[50px] border border-gray-100 shadow-2xl overflow-hidden p-3 text-black">
               <div className="p-8 pb-4 flex justify-between items-center bg-gray-50 rounded-t-[45px]">
                  <h3 className="text-2xl font-black text-black tracking-tight uppercase">Recent Expenses</h3>
                  <div className="bg-rose-50 px-4 py-2 rounded-xl text-rose-500 text-[10px] font-black uppercase border border-rose-100">Outflow</div>
               </div>
               <div className="p-3">
                 <ExpenseList expenses={expenses} deleteExpense={deleteExpense} />
               </div>
            </div>

            <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-2xl overflow-hidden text-black">
               <div className="flex justify-between items-end mb-10">
                  <div>
                    <h3 className="text-2xl font-black text-black tracking-tight uppercase">Finance Analytics</h3>
                    <p className="text-gray-400 font-bold text-xs uppercase mt-1">Cashflow visualization</p>
                  </div>
                  <div className="bg-indigo-50 p-2 rounded-xl text-[#4f46e5] border border-indigo-100 shadow-sm"><Activity className="w-6 h-6" /></div>
               </div>
               <FinanceCharts expenses={expenses} fees={fees} />
            </div>
          </div>

          <div className="lg:col-span-1 space-y-10">
             <div className="bg-white rounded-[50px] border border-gray-100 shadow-3xl p-4 sticky top-10 flex flex-col text-black">
                <div className="p-8 flex items-center gap-6 mb-4 bg-gray-50 rounded-[40px] border border-white">
                   <div className="w-16 h-16 bg-teal-50 rounded-[28px] flex items-center justify-center border border-teal-100 shadow-inner">
                      <Landmark className="text-teal-600 w-8 h-8" />
                   </div>
                   <div>
                      <h4 className="font-black text-xl text-black uppercase tracking-tight leading-none">Latest Fees</h4>
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2">Verified Receipts</p>
                   </div>
                </div>
                <div className="p-4 flex-1">
                   <TransactionTable data={fees.slice(0, 8)} />
                </div>
                <button 
                  onClick={() => navigate('/fees')}
                  className="m-6 bg-black text-white py-5 rounded-[28px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gray-800 transition active:scale-95 shadow-xl">
                  See All Fees <ArrowUpRight className="w-5 h-5 text-teal-400" />
                </button>
             </div>
          </div>
        </div>
      </div>

    </div>
  )
}

function FinanceStat({ title, val, color, icon }) {
  const configs = {
    teal: "bg-[#0d9488]",
    amber: "bg-amber-600",
    rose: "bg-rose-600",
    emerald: "bg-emerald-700"
  };

  return (
    <div className={`${configs[color]} p-8 rounded-[40px] shadow-2xl flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 border border-white/10 text-white`}>
      <div className="bg-white/10 p-4 rounded-3xl text-white mb-4">
        {React.cloneElement(icon, { className: "w-7 h-7" })}
      </div>
      <p className="text-white/60 font-black text-[9px] uppercase tracking-[2px] mb-2">{title}</p>
      <h3 className="text-white text-3xl font-black tracking-tight leading-none tabular-nums">
        ₹{Math.abs(val).toLocaleString()}
      </h3>
    </div>
  );
}