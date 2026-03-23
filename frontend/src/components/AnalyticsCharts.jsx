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

export default function AnalyticsCharts() {

const data = [
{ month:"Jan", fees:20000, attendance:90 },
{ month:"Feb", fees:25000, attendance:92 },
{ month:"Mar", fees:30000, attendance:95 },
{ month:"Apr", fees:28000, attendance:91 }
]

return(

<div className="grid md:grid-cols-2 gap-6">

{/* Fees Chart */}

<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">

<h3 className="font-bold mb-4 text-gray-800 dark:text-white">
Monthly Fee Collection
</h3>

<ResponsiveContainer width="100%" height={250}>

<LineChart data={data}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="month"/>
<YAxis/>
<Tooltip/>

<Line
type="monotone"
dataKey="fees"
stroke="#6366f1"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>


{/* Attendance Chart */}

<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">

<h3 className="font-bold mb-4 text-gray-800 dark:text-white">
Attendance Trend
</h3>

<ResponsiveContainer width="100%" height={250}>

<BarChart data={data}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="month"/>
<YAxis/>
<Tooltip/>

<Bar
dataKey="attendance"
fill="#22c55e"
radius={[6,6,0,0]}
/>

</BarChart>

</ResponsiveContainer>

</div>

</div>

)

}