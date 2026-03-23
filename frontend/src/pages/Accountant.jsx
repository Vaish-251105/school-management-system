import { useState } from "react"
import ExpenseForm from "../components/ExpenseForm"
import ExpenseList from "../components/ExpenseList"
import TransactionTable from "../components/TransactionTable"
import FinanceCharts from "../components/FinanceCharts"

export default function Accountant() {

  const [expenses, setExpenses] = useState([])
  const [showExpense, setShowExpense] = useState(false)

  const addExpense = (expense) => {
    setExpenses([...expenses, expense])
  }

  const deleteExpense = (index) => {
    const updated = expenses.filter((_, i) => i !== index)
    setExpenses(updated)
  }

  const totalExpenses = expenses.reduce((a, b) => a + Number(b.amount), 0)

  const summary = {
    collected: 150000,
    pending: 25000,
    expenses: totalExpenses,
    balance: 150000 - totalExpenses
  }

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Accountant Dashboard
      </h1>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

        {/* Fees Collected */}

        <div className="bg-blue-100 p-6 rounded-xl shadow hover:scale-105 transition">
          <h3 className="text-gray-600">Fees Collected</h3>
          <p className="text-2xl font-bold text-blue-700">
            ₹{summary.collected}
          </p>
        </div>

        {/* Pending Fees */}

        <div className="bg-green-100 p-6 rounded-xl shadow hover:scale-105 transition">
          <h3 className="text-gray-600">Pending Fees</h3>
          <p className="text-2xl font-bold text-green-700">
            ₹{summary.pending}
          </p>
        </div>

        {/* Total Expenses */}

        <div className="bg-yellow-100 p-6 rounded-xl shadow hover:scale-105 transition">
          <h3 className="text-gray-600">Total Expenses</h3>
          <p className="text-2xl font-bold text-yellow-700">
            ₹{summary.expenses}
          </p>
        </div>

        {/* Net Balance */}

        <div className="bg-purple-100 p-6 rounded-xl shadow hover:scale-105 transition">
          <h3 className="text-gray-600">Net Balance</h3>
          <p className="text-2xl font-bold text-purple-700">
            ₹{summary.balance}
          </p>
        </div>

      </div>


      {/* Quick Actions */}

      <div className="flex gap-4 mb-6">

        <button
          onClick={() => setShowExpense(!showExpense)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add Expense
        </button>

        <button 
          onClick={() => alert("Generating monthly financial report... Check back in a moment!")}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition">
          Generate Report
        </button>

      </div>


      {/* Expense Form */}

      {showExpense &&
        <ExpenseForm addExpense={addExpense} />
      }


      {/* Expense List */}

      <ExpenseList
        expenses={expenses}
        deleteExpense={deleteExpense}
      />


      {/* Charts */}

      <FinanceCharts />


      {/* Transactions */}

      <TransactionTable />

    </div>

  )
}