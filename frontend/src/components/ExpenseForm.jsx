import { useState } from "react"
import { Calendar, DollarSign, Tag, Send } from "lucide-react"

export default function ExpenseForm({ addExpense }) {
  const [data, setData] = useState({
    title: "",
    amount: "",
    date: new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!data.title || !data.amount) return alert("Please fill all mandatory fields");
    setLoading(true)
    await addExpense({
      ...data,
      amount: Number(data.amount)
    })
    setLoading(false)
    setData({ title: "", amount: "", date: new Date().toISOString().split('T')[0] })
  }

  return (
    <div className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-2xl mb-8 group overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full -mr-16 -mt-16 opacity-40 group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="flex items-center gap-3 mb-8">
         <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
            <Tag className="text-teal-700 w-5 h-5" />
         </div>
         <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Financial Record Entry</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="space-y-2">
           <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Description / Title</label>
           <div className="relative">
              <input
                name="title"
                placeholder="e.g. Electricity Bill"
                value={data.title}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3.5 focus:bg-white focus:border-teal-500 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300"
              />
           </div>
        </div>

        <div className="space-y-2">
           <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Monetary Value (₹)</label>
           <div className="relative">
              <input
                name="amount"
                type="number"
                placeholder="Amount"
                value={data.amount}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3.5 focus:bg-white focus:border-teal-500 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300"
              />
           </div>
        </div>

        <div className="space-y-2">
           <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Billing / Transaction Date</label>
           <div className="relative">
              <input
                name="date"
                type="date"
                value={data.date}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3.5 focus:bg-white focus:border-teal-500 transition-all outline-none font-bold text-slate-700 uppercase"
              />
           </div>
        </div>

        <div className="md:col-span-3 pt-4 flex justify-end">
           <button 
             disabled={loading}
             className="bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all transform hover:-translate-y-1 shadow-xl active:scale-95 disabled:opacity-50"
           >
             {loading ? "Processing..." : <><Send className="w-4 h-4" /> Finalize Record</>}
           </button>
        </div>
      </form>
    </div>
  )
}