import { useState } from "react"

export default function ExpenseForm({ addExpense }) {

  const [data, setData] = useState({
    title: "",
    amount: "",
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
    addExpense(data)
    setData({ title: "", amount: "", date: "" })
  }

  return (

    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded shadow mb-6"
    >

      <h2 className="font-bold mb-4">
        Add Expense
      </h2>

      <input
        name="title"
        placeholder="Expense Title"
        value={data.title}
        onChange={handleChange}
        className="border p-2 w-full mb-3"
      />

      <input
        name="amount"
        type="number"
        placeholder="Amount"
        value={data.amount}
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
        Save
      </button>

    </form>
  )
}