import AnalyticsCards from "../components/AnalyticsCards"
import AnalyticsCharts from "../components/AnalyticsCharts"
import ReportsTable from "../components/ReportsTable"

export default function Reports() {

return (

<div className="p-6 space-y-8">

{/* Page Header */}

<div className="flex flex-col md:flex-row md:items-center md:justify-between">

<h1 className="text-3xl font-bold text-gray-800 dark:text-white">
Reports & Analytics
</h1>

<p className="text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
View performance insights, student analytics and reports
</p>

</div>


{/* Analytics Cards */}

<div className="grid grid-cols-1 md:grid-cols-4 gap-6">

<AnalyticsCards />

</div>


{/* Charts Section */}

<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">

<h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
Performance Analytics
</h2>

<AnalyticsCharts />

</div>


{/* Reports Table */}

<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">

<h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
Detailed Reports
</h2>

<ReportsTable />

</div>

</div>

)

}