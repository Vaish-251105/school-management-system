import React, { useState, useEffect } from "react"
import api from "../utils/api"
import ExpenseForm from "../components/ExpenseForm"
import ExpenseList from "../components/ExpenseList"
import TransactionTable from "../components/TransactionTable"
import FinanceCharts from "../components/FinanceCharts"
import { Wallet, TrendingUp, TrendingDown, Landmark, FileText, Plus, RefreshCw, ChevronLeft, MoreVertical } from "lucide-react"

export default function Accountant() {
  const [expenses, setExpenses] = useState([])
  const [fees, setFees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [userName, setUserName] = useState("Accountant")

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (user.name) setUserName(user.name);
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
      setError(null);
    } catch (err) {
      console.error("Data fetch error:", err);
      setError("Failed to sync financial records. Reconnecting...");
    } finally {
      setLoading(false);
    }
  }

  const addExpense = async (data) => {
    try {
      await api.post("/expenses", data);
      alert("Expense recorded successfully!");
      setShowExpenseForm(false);
      fetchData();
    } catch (err) {
      console.error("Expense post error:", err);
      alert("Failed to record expense. Please try again.");
    }
  }

  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense record?")) return;
    try {
      await api.delete(`/expenses/${id}`);
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete record.");
    }
  }

  const totalExpenses = expenses.reduce((a, b) => a + (Number(b.amount) || 0), 0)
  const totalCollectedFees = fees.filter(f => f.paid || f.status === 'paid').reduce((a, b) => a + (Number(b.amount) || 0), 0)
  const totalPendingFees = fees.filter(f => !f.paid && f.status !== 'paid').reduce((a, b) => a + (Number(b.amount) || 0), 0)
  const netBalance = totalCollectedFees - totalExpenses;

  const generateReport = () => {
    const reportData = [
      ["Type", "Title", "Amount", "Date"],
      ...fees.map(f => ["Fee Receipt", f.type || "School Fee", f.amount, new Date(f.createdAt).toLocaleDateString()]),
      ...expenses.map(e => ["Operational Expense", e.title, e.amount, new Date(e.date || e.createdAt).toLocaleDateString()])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + reportData.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `School_Finance_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600 mb-4"></div>
      <p className="text-gray-500 font-medium">Syncing Ledger...</p>
    </div>
  )

  return (
    <div className="bg-[#f0f2f5] min-h-screen font-sans pb-20">
      {/* PROFESSIONAL HEADER AREA */}
      <div className="bg-gradient-to-r from-[#0d9488] to-[#0f766e] px-8 pt-12 pb-16 rounded-b-[50px] shadow-2xl relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <p className="text-teal-100 text-[13px] font-bold tracking-[2px] uppercase mb-1">Accounts & Finance Hub</p>
              <h1 className="text-white text-3xl font-extrabold tracking-tight">Hello, {userName}</h1>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={fetchData} className="bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-all transform hover:rotate-180 duration-500 shadow-lg border border-white/10">
                 <RefreshCw className="w-5 h-5" />
               </button>
               <button onClick={() => window.location.reload()} className="bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-all shadow-lg border border-white/10">
                 <MoreVertical className="w-5 h-5" />
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <SummaryCard title="Total Collected" value={totalCollectedFees} color="blue" icon={<TrendingUp />} />
            <SummaryCard title="Pending Dues" value={totalPendingFees} color="amber" icon={<Landmark />} />
            <SummaryCard title="Operational Spend" value={totalExpenses} color="rose" icon={<TrendingDown />} />
            <SummaryCard title="Vault Balance" value={netBalance} color="emerald" icon={<Wallet />} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* QUICK ACTIONS */}
            <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-xl flex items-center justify-between">
              <div className="flex gap-4">
                <button
                  onClick={() => setShowExpenseForm(!showExpenseForm)}
                  className="flex items-center gap-2.5 bg-[#0d9488] text-white px-6 py-3.5 rounded-2xl font-bold text-[14px] hover:bg-[#0f766e] transition-all transform hover:-translate-y-1 shadow-lg active:scale-95"
                >
                  <Plus className="w-5 h-5" /> {showExpenseForm ? "Cancel Entry" : "Record Expense"}
                </button>
                <button 
                  onClick={generateReport}
                  className="flex items-center gap-2.5 bg-white border-2 border-slate-200 text-slate-700 px-6 py-3.5 rounded-2xl font-bold text-[14px] hover:bg-slate-50 transition-all shadow-md active:scale-95"
                >
                  <FileText className="w-5 h-5" /> Audit Report
                </button>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[12px] font-bold uppercase tracking-wider">Live System Connected</span>
              </div>
            </div>

            {showExpenseForm && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                <ExpenseForm addExpense={addExpense} />
              </div>
            )}

            <div className="bg-white rounded-[35px] border border-gray-100 shadow-xl overflow-hidden">
               <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="text-xl font-extrabold text-[#1e293b]">Expense Ledger</h3>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{expenses.length} Records found</span>
               </div>
               <ExpenseList expenses={expenses} deleteExpense={deleteExpense} />
            </div>

            <div className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-xl overflow-hidden">
               <h3 className="text-xl font-extrabold text-[#1e293b] mb-8">Transaction Analytics</h3>
               <FinanceCharts expenses={expenses} fees={fees} />
            </div>
          </div>

          <div className="lg:col-span-1">
             <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl p-8 sticky top-8">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center">
                      <Landmark className="text-teal-600 w-7 h-7" />
                   </div>
                   <div>
                      <h4 className="font-extrabold text-lg text-slate-800 leading-tight">Recent Fee Activity</h4>
                      <p className="text-slate-400 text-sm">Last 24 hours logs</p>
                   </div>
                </div>
                <TransactionTable data={fees.slice(0, 10)} />
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ title, value, color, icon }) {
  const configs = {
    blue: { bg: "bg-blue-600", light: "bg-blue-50", text: "text-blue-600", label: "text-blue-100" },
    amber: { bg: "bg-amber-500", light: "bg-amber-50", text: "text-amber-600", label: "text-amber-100" },
    rose: { bg: "bg-rose-500", light: "bg-rose-50", text: "text-rose-600", label: "text-rose-100" },
    emerald: { bg: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-700", label: "text-emerald-100" }
  };
  const config = configs[color];

  return (
    <div className={`${config.bg} p-7 rounded-[35px] shadow-xl hover:scale-105 transition-all duration-300 border border-white/20 group relative overflow-hidden`}>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
         {icon}
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-white/20 p-2 rounded-xl text-white">
          {icon}
        </div>
        <h3 className={`${config.label} text-[13px] font-bold uppercase tracking-widest`}>{title}</h3>
      </div>
      <p className="text-white text-[28px] font-black tracking-tight leading-none group-hover:translate-x-1 transition-transform">
        ₹{Math.abs(value).toLocaleString()}
      </p>
    </div>
  );
}