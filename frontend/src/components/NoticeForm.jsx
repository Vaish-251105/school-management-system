import { useState } from "react"

export default function NoticeForm({ addNotice }) {

  const [data, setData] = useState({
    title: "",
    message: "",
    date: ""
  })

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addNotice(data)
    setData({ title: "", message: "", date: "" })
  }

  return (

    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded shadow mb-6"
    >

      <h2 className="font-bold mb-4">
        Add Notice
      </h2>

      <input
        name="title"
        placeholder="Notice Title"
        value={data.title}
        onChange={handleChange}
        className="border p-2 w-full mb-3"
      />

      <textarea
        name="message"
        placeholder="Notice Message"
        value={data.message}
        onChange={handleChange}
        className="border p-2 w-full mb-3"
      />

      <input
        name="date"
        type="date"
        value={data.date}
        onChange={handleChange}
        className="border p-2 w-full mb-3"
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Notice
      </button>

    </form>
  )
}