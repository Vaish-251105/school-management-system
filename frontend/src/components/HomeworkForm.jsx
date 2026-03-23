import { useState } from "react"

export default function HomeworkForm({ addHomework }) {

  const [data, setData] = useState({
    subject: "",
    class: "",
    task: "",
    dueDate: ""
  })

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addHomework(data)
    setData({ subject: "", class: "", task: "", dueDate: "" })
  }

  return (

    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded shadow mb-6"
    >

      <h2 className="font-bold mb-4">
        Add Homework
      </h2>

      <input
        name="subject"
        placeholder="Subject"
        value={data.subject}
        onChange={handleChange}
        className="border p-2 w-full mb-3"
      />

      <input
        name="class"
        placeholder="Class"
        value={data.class}
        onChange={handleChange}
        className="border p-2 w-full mb-3"
      />

      <textarea
        name="task"
        placeholder="Homework Description"
        value={data.task}
        onChange={handleChange}
        className="border p-2 w-full mb-3"
      />

      <input
        name="dueDate"
        type="date"
        value={data.dueDate}
        onChange={handleChange}
        className="border p-2 w-full mb-3"
      />

      <button className="bg-green-500 text-white px-4 py-2 rounded">
        Add Homework
      </button>

    </form>
  )
}