import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

export default function FinanceCharts() {

  const data = [
    { month: "Jan", fees: 20000, expense: 5000 },
    { month: "Feb", fees: 25000, expense: 6000 },
    { month: "Mar", fees: 30000, expense: 7000 },
    { month: "Apr", fees: 28000, expense: 4000 },
  ]

  return (

    <div className="grid md:grid-cols-2 gap-6 mb-6">

      <div className="bg-white p-5 rounded shadow">

        <h3 className="mb-3 font-bold">
          Fee Collection
        </h3>

        <ResponsiveContainer width="100%" height={250}>

          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="fees" stroke="#4f46e5" />
          </LineChart>

        </ResponsiveContainer>

      </div>


      <div className="bg-white p-5 rounded shadow">

        <h3 className="mb-3 font-bold">
          Expenses
        </h3>

        <ResponsiveContainer width="100%" height={250}>

          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="expense" fill="#ef4444" />
          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  )
}