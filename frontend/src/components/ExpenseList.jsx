export default function ExpenseList({ expenses, deleteExpense }) {

  if (expenses.length === 0) return null

  return (

    <div className="bg-white p-6 rounded shadow mb-6">

      <h2 className="font-bold mb-4">
        Expense List
      </h2>

      <table className="w-full">

        <thead>
          <tr className="bg-gray-100">
            <th>Title</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {expenses.map((e, i) => (

            <tr key={i} className="text-center border-t">

              <td>{e.title}</td>
              <td>₹{e.amount}</td>
              <td>{e.date}</td>

              <td>
                <button
                  onClick={() => deleteExpense(i)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  )
}