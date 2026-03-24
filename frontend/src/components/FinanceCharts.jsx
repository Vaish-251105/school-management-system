import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

export default function FinanceCharts({ expenses = [], fees = [] }) {
  // PROCESS DATA FOR MONTHLY VIEW
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentYear = new Date().getFullYear();

  const chartData = months.map((month, index) => {
    const monthFees = fees
      .filter(f => {
        const d = new Date(f.paidDate || f.createdAt);
        return d.getMonth() === index && d.getFullYear() === currentYear && (f.paid || f.status === 'paid');
      })
      .reduce((sum, f) => sum + (f.amount || 0), 0);

    const monthExpenses = expenses
      .filter(e => {
        const d = new Date(e.date || e.createdAt);
        return d.getMonth() === index && d.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    return {
      month,
      fees: monthFees,
      expense: monthExpenses
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* FEE COLLECTION CHART */}
      <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-[30px] border border-slate-100 shadow-sm group">
        <div className="flex items-center justify-between mb-8">
           <h3 className="font-extrabold text-[#111827] text-lg tracking-tight">Revenue Trend</h3>
           <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>
           </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
            />
            <Line 
              type="monotone" 
              dataKey="fees" 
              stroke="#4f46e5" 
              strokeWidth={4} 
              dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 8, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* EXPENSE CHART */}
      <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-[30px] border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <h3 className="font-extrabold text-[#111827] text-lg tracking-tight">Monthly Burn</h3>
           <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
              <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
           </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
            />
            <Bar dataKey="expense" fill="#f43f5e" radius={[8, 8, 8, 8]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}