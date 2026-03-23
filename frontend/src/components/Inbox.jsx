import MessageCard from "./MessageCard"

export default function Inbox({ messages }) {

  return (

    <div className="bg-white p-6 rounded shadow">

      <h2 className="font-bold mb-4">
        Inbox
      </h2>

      {messages.length === 0 && <p>No messages</p>}

      {messages.map((m, i) => (
        <MessageCard key={i} msg={m} />
      ))}

    </div>

  )
}