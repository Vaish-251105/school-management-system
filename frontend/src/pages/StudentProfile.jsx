import { useState } from "react"
import { useStudent } from "../context/studentContext"
import { useClass } from "../context/ClassContext"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line
} from "recharts"

export default function StudentProfile() {

  const { students } = useStudent()
  const { classes } = useClass()

  const [selectedStudent, setSelectedStudent] = useState("")

  const attendance = JSON.parse(localStorage.getItem("attendance")) || {}
  const results = JSON.parse(localStorage.getItem("results")) || []
  const fees = JSON.parse(localStorage.getItem("fees")) || []

  const student = students.find(s => String(s.id) === selectedStudent)

  if (!student) {
    return (
      <div className="p-6">

        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          Student Profile Dashboard
        </h1>

        <select
          className="border p-2 rounded"
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">Select Student</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

      </div>
    )
  }

  const studentClass = classes.find(c => String(c.id) === String(student.classId))

  /* Attendance Calculation */
  let present = 0, absent = 0
  Object.values(attendance).forEach(classData => {
    Object.values(classData).forEach(day => {
      if (day[student.id] === "Present") present++
      if (day[student.id] === "Absent") absent++
    })
  })
  const attendancePercent = present + absent ? Math.round((present / (present + absent)) * 100) : 0
  const attendanceChart = [
    { name: "Present", value: present },
    { name: "Absent", value: absent }
  ]

  /* Exam Results */
  const studentResults = results.filter(r => String(r.studentId) === String(student.id))
  const avgMarks = studentResults.length
    ? Math.round(studentResults.reduce((a, b) => a + Number(b.marks), 0) / studentResults.length)
    : 0
  const marksChart = studentResults.map(r => ({
    exam: r.subject || r.exam || "Exam",
    marks: Number(r.marks)
  }))

  /* Fees */
  const studentFees = fees.filter(f => String(f.studentId) === String(student.id))
  const paid = studentFees.filter(f => f.status === "Paid").reduce((a, b) => a + Number(b.amount), 0)
  const pending = studentFees.filter(f => f.status === "Pending").reduce((a, b) => a + Number(b.amount), 0)

  return (
    <div className="p-6 space-y-8">

      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Student Profile Dashboard
      </h1>

      {/* Student Selector */}
      <select
        className="border p-2 rounded"
        value={selectedStudent}
        onChange={(e) => setSelectedStudent(e.target.value)}
      >
        {students.map(s => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {/* Student Info */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 max-w-xl">
        <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
          Student Information
        </h2>
        <p><b>Name:</b> {student.name}</p>
        <p><b>Class:</b> {studentClass?.className}</p>
        <p><b>Roll No:</b> {student.rollNo}</p>
        <p><b>Contact:</b> {student.contact}</p>
        <p><b>Address:</b> {student.address}</p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-xl shadow hover:scale-105 transition">
          <p className="text-gray-600 dark:text-gray-300">Attendance %</p>
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {attendancePercent}%
          </h2>
        </div>

        <div className="bg-green-100 dark:bg-green-900 p-6 rounded-xl shadow hover:scale-105 transition">
          <p className="text-gray-600 dark:text-gray-300">Fees Paid</p>
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-300">
            ₹{paid}
          </h2>
        </div>

        <div className="bg-yellow-100 dark:bg-yellow-900 p-6 rounded-xl shadow hover:scale-105 transition">
          <p className="text-gray-600 dark:text-gray-300">Pending Fees</p>
          <h2 className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
            ₹{pending}
          </h2>
        </div>

        <div className="bg-purple-100 dark:bg-purple-900 p-6 rounded-xl shadow hover:scale-105 transition">
          <p className="text-gray-600 dark:text-gray-300">Exam Average</p>
          <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {avgMarks}
          </h2>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Attendance Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-3 text-gray-800 dark:text-white">
            Attendance Summary
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attendanceChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Exam Performance */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-3 text-gray-800 dark:text-white">
            Exam Performance
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={marksChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="exam" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="marks" stroke="#8b5cf6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  )
}