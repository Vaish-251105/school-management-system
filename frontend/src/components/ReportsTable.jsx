export default function ReportsTable() {

const reports = [
{ name:"Student Report", date:"10 Mar 2026", status:"Ready" },
{ name:"Attendance Report", date:"11 Mar 2026", status:"Ready" },
{ name:"Fee Collection Report", date:"12 Mar 2026", status:"Ready" },
{ name:"Exam Results Report", date:"13 Mar 2026", status:"Ready" }
]

return(

<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">

<h2 className="font-bold mb-4 text-gray-800 dark:text-white">
Generated Reports
</h2>

<div className="overflow-x-auto">

<table className="w-full text-left">

<thead>

<tr className="bg-gray-100 dark:bg-gray-700">

<th className="p-3">Report</th>
<th className="p-3">Date</th>
<th className="p-3">Status</th>
<th className="p-3">Action</th>

</tr>

</thead>

<tbody>

{reports.map((r,i)=>(

<tr
key={i}
className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 transition"
>

<td className="p-3">{r.name}</td>

<td className="p-3">{r.date}</td>

<td className="p-3">

<span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
{r.status}
</span>

</td>

<td className="p-3">

<button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
Download
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

)

}