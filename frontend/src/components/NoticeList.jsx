export default function NoticeList({ notices }) {

  if (notices.length === 0) return null

  return (

    <div className="bg-white p-5 rounded shadow">

      <h2 className="font-bold mb-4">
        Notices
      </h2>

      {notices.map((n, i) => (

        <div
          key={i}
          className="border-b py-3"
        >

          <h3 className="font-bold">
            {n.title}
          </h3>

          <p>{n.message}</p>

          <span className="text-sm text-gray-500">
            {n.date}
          </span>

        </div>

      ))}

    </div>
  )
}