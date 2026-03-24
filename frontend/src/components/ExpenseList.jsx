import { Trash2, AlertCircle } from "lucide-react"

export default function ExpenseList({ expenses = [], deleteExpense }) {
  if (expenses.length === 0) return (
    <div className="flex flex-col items-center justify-center p-20 text-slate-400 font-bold bg-white rounded-[35px] border border-gray-100 shadow-xl">
       <AlertCircle className="w-12 h-12 mb-4 opacity-10" />
       <p className="uppercase tracking-widest text-xs">Expense Ledger is Clear</p>
    </div>
  );

  return (
    <div className="overflow-x-auto min-h-[300px]">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="px-8 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[2px]">Transactional Title</th>
            <th className="px-8 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[2px] text-center">Amount</th>
            <th className="px-8 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[2px] text-center">Date</th>
            <th className="px-8 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[2px] text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {expenses.map((e, i) => (
            <tr key={e._id || i} className="group hover:bg-rose-50/50 transition-all border-b border-slate-50">
              <td className="px-8 py-6">
                <div className="flex flex-col">
                  <span className="font-extrabold text-[#111827] text-[15px] group-hover:text-rose-600 transition-colors uppercase tracking-tight">
                    {e.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">General Operational Spend</span>
                </div>
              </td>
              <td className="px-8 py-6 text-center">
                <span className="font-black text-slate-900 text-[16px]">₹{e.amount?.toLocaleString()}</span>
              </td>
              <td className="px-8 py-6 text-center">
                <span className="text-slate-500 font-bold text-[13px]">{new Date(e.date || e.createdAt).toLocaleDateString()}</span>
              </td>
              <td className="px-8 py-6 text-right">
                <button
                  onClick={() => deleteExpense(e._id)}
                  className="p-3 bg-rose-100 rounded-2xl text-rose-600 hover:bg-rose-600 hover:text-white transition-all transform hover:rotate-6 active:scale-95 shadow-md flex items-center justify-center ml-auto"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}