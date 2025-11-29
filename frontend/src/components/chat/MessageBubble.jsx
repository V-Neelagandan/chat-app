// // frontend/src/components/chat/MessageBubble.jsx
// export default function MessageBubble({ sender, message, isOwn }) {
//   const bubbleClass = isOwn ? "bubble bubble-own" : "bubble";

//   // UI-only choice: if you *want* to show "Me" for your own messages:
//   // const displayName = isOwn ? "Me" : sender;
//   // If you want to always see real username on screen:
//   const displayName = sender || "Unknown";

//   return (
//     <div className={bubbleClass}>
//       <div className="bubble-sender">{displayName}:</div>
//       <div className="bubble-text">{message}</div>
//     </div>
//   );
// }

// src/components/chat/MessageBubble.jsx

export default function MessageBubble({ sender, message, isOwn }) {
  // FIX 1: Use the correct alignment class (msg-right/msg-left) on the outer container (.chat-msg)
  const alignmentClass = isOwn ? "msg-right" : "msg-left";
  const containerClass = `chat-msg ${alignmentClass}`;

  // FIX 2: The inner bubble remains just 'bubble'
  // Color/background is handled by CSS selectors like .msg-right .bubble
  const bubbleClass = "bubble";

  // Use the 'sender' class for the username text, as defined in chat.css
  const displayName = sender || "Unknown";

  return (
    <div className={containerClass}>
      <div className={bubbleClass}>
        {/* Note: changed to 'sender' class to match src/styles/chat.css */}
        <div className="sender">{displayName}</div> 
        <div className="bubble-text">{message}</div>
      </div>
    </div>
  );
}
