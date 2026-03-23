export default function HomeworkList({ homeworks }) {

  if (homeworks.length === 0) return null

  return (

    <div className="bg-white p-5 rounded shadow">

      <h2 className="font-bold mb-4">
        Homework List
      </h2>

      {homeworks.map((hw, i) => (

        <div
          key={i}
          className="border-b py-3"
        >

          <h3 className="font-bold">
            {hw.subject} ({hw.class})
          </h3>

          <p>{hw.task}</p>

          <span className="text-sm text-gray-500">
            Due: {hw.dueDate}
          </span>

        </div>

      ))}

    </div>
  )
}