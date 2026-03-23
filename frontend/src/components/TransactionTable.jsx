export default function TransactionTable() {

  const transactions = [
    { name: "Rahul Sharma", type: "Fees", amount: 5000, date: "1 Mar", status: "Paid" },
    { name: "Aman Patel", type: "Fees", amount: 4000, date: "2 Mar", status: "Pending" },
    { name: "Books Purchase", type: "Expense", amount: 2000, date: "3 Mar", status: "Done" }
  ]

  return (

    <div className="bg-white p-6 rounded shadow">

      <h2 className="font-bold mb-4">
        Recent Transactions
      </h2>

      <table className="w-full">

        <thead>
          <tr className="bg-gray-100">
            <th>Name</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {transactions.map((t, i) => (

            <tr key={i} className="text-center border-t">

              <td>{t.name}</td>
              <td>{t.type}</td>
              <td>₹{t.amount}</td>
              <td>{t.date}</td>
              <td>{t.status}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  )
}