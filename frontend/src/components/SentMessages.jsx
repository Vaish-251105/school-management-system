import MessageCard from "./MessageCard"

export default function SentMessages({ messages }) {

  return (

    <div className="bg-white p-6 rounded shadow">

      <h2 className="font-bold mb-4">
        Sent Messages
      </h2>

      {messages.map((m, i) => (
        <MessageCard key={i} msg={m} />
      ))}

    </div>

  )
}