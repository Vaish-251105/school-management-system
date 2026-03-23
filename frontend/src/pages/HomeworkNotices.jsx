import { useState } from "react"
import NoticeForm from "../components/NoticeForm"
import NoticeList from "../components/NoticeList"
import HomeworkForm from "../components/HomeworkForm"
import HomeworkList from "../components/HomeworkList"

export default function HomeworkNotices() {

const [notices,setNotices] = useState([])
const [homeworks,setHomeworks] = useState([])

const addNotice = (notice)=>{
setNotices([...notices,notice])
}

const addHomework = (hw)=>{
setHomeworks([...homeworks,hw])
}

return(

<div className="p-6 space-y-8">

{/* Page Header */}

<div>

<h1 className="text-3xl font-bold text-gray-800 dark:text-white">
Homework & Notices
</h1>

<p className="text-gray-500 dark:text-gray-400 mt-1">
Manage school notices and student homework
</p>

</div>


{/* Main Grid */}

<div className="grid md:grid-cols-2 gap-6">

{/* Notices Section */}

<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">

<h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
Add Notice
</h2>

<NoticeForm addNotice={addNotice} />

<div className="mt-6">

<h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
Recent Notices
</h3>

<NoticeList notices={notices} />

</div>

</div>


{/* Homework Section */}

<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">

<h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
Assign Homework
</h2>

<HomeworkForm addHomework={addHomework} />

<div className="mt-6">

<h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
Homework List
</h3>

<HomeworkList homeworks={homeworks} />

</div>

</div>

</div>

</div>

)

}