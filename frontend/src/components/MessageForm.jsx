import { useState } from "react"

export default function MessageForm({ sendMessage }) {

  const [data, setData] = useState({
    to: "",
    subject: "",
    message: ""
  })

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    sendMessage({
      ...data,
      date: new Date().toLocaleDateString()
    })

    setData({ to: "", subject: "", message: "" })
  }

  return (

    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow"
    >

      <h2 className="font-bold mb-4">
        Send Message
      </h2>

      <input
        name="to"
        placeholder="Send To (Student/Teacher/Admin)"
        value={data.to}
        onChange={handleChange}
        className="border p-2 w-full mb-3"
      />

      <input
        name="subject"
        placeholder="Subject"
        value={data.subject}
        onChange={handleChange}
        className="border p-2 w-full mb-3"
      />

      <textarea
        name="message"
        placeholder="Write Message..."
        value={data.message}
        onChange={handleChange}
        className="border p-2 w-full mb-3"
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Send
      </button>

    </form>
  )
}