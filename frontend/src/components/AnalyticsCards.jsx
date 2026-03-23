export default function AnalyticsCards() {

const stats = [
{
title: "Total Students",
value: 320,
color: "from-blue-500 to-blue-600"
},
{
title: "Attendance %",
value: "92%",
color: "from-green-500 to-green-600"
},
{
title: "Fees Collected",
value: "₹4,50,000",
color: "from-yellow-500 to-yellow-600"
},
{
title: "Exam Pass %",
value: "88%",
color: "from-purple-500 to-purple-600"
}
]

return (

<>

{stats.map((s,i)=>(

<div
key={i}
className={`p-6 rounded-xl shadow-lg text-white bg-gradient-to-r ${s.color} hover:scale-105 transition`}
>

<h3 className="opacity-90 text-lg">
{s.title}
</h3>

<p className="text-3xl font-bold mt-2">
{s.value}
</p>

</div>

))}

</>

)

}