export default function TransactionTable({ data = [] }) {
  if (data.length === 0) return <div className="text-center py-10 text-slate-400 font-medium italic">No ledger activity recorded yet.</div>;

  return (
    <div className="overflow-x-auto min-h-[400px]">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="px-4 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[2px]">Entity / Description</th>
            <th className="px-4 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[2px] text-center">Reference</th>
            <th className="px-4 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[2px] text-right">Value</th>
            <th className="px-4 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[2px] text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((item, i) => {
            const isFee = !!item.studentId;
            const name = isFee ? (item.studentId?.name || "Student Balance") : (item.title || "Miscellaneous");
            const type = isFee ? (item.type || "School Fee") : "Account Expense";
            const amount = item.amount || 0;
            const status = isFee ? (item.paid || item.status === 'paid' ? "Paid" : "Unpaid") : "Verified";
            const date = new Date(item.createdAt || item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

            return (
              <tr key={item._id || i} className="hover:bg-teal-50/10 transition-all group">
                <td className="px-4 py-6">
                  <div className="flex flex-col">
                    <span className="font-extrabold text-[#111827] text-[15px] group-hover:text-teal-700 transition-colors">{name}</span>
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{type} • {date}</span>
                  </div>
                </td>
                <td className="px-4 py-6 text-center">
                  <span className="text-[10px] font-black text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded border border-slate-200 uppercase">
                    {(item._id || "TXN").slice(-6)}
                  </span>
                </td>
                <td className="px-4 py-6 text-right">
                  <span className={`font-black text-[16px] tabular-nums ${isFee ? 'text-teal-600' : 'text-rose-500'}`}>
                    {isFee ? "+" : "-"}₹{amount.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-6 text-center">
                  <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                    status === "Paid" || status === "Verified" 
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                    : "bg-amber-50 text-amber-600 border border-amber-100"
                  }`}>
                    {status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}