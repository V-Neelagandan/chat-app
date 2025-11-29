// frontend/src/components/chat/MessageList.jsx
import MessageBubble from "./MessageBubble";

export default function MessageList({ messages = [], currentUser }) {
  // Ensure we always have an array
  const safeMessages = Array.isArray(messages) ? messages : [];

  if (safeMessages.length === 0) {
    return <div className="chat-empty">No messages yet…</div>;
  }

  return (
    <div className="chat-messages">
      {safeMessages.map((m) => (
        <MessageBubble
          key={m.id}
          sender={m.sender}
          message={m.message}
          isOwn={m.sender === currentUser}
        />
      ))}
    </div>
  );
}
