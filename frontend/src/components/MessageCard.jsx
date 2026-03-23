export default function MessageCard({ msg }) {

  return (

    <div className="border-b py-3">

      <h3 className="font-bold">
        {msg.subject}
      </h3>

      <p className="text-sm text-gray-600">
        To: {msg.to}
      </p>

      <p>{msg.message}</p>

      <span className="text-xs text-gray-400">
        {msg.date}
      </span>

    </div>

  )
}