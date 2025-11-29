// // frontend/src/pages/ChatPage.jsx
// import { useParams } from "react-router-dom";
// import ChatLayout from "../components/layout/ChatLayout";
// import MessageList from "../components/chat/MessageList";
// import MessageInput from "../components/chat/MessageInput";
// import TypingIndicator from "../components/chat/TypingIndicator";
// import useWebSocketChat from "../hooks/useWebSocketChat";
// import useAuth from "../hooks/useAuth";

// export default function ChatPage() {
//   const { roomName } = useParams();

//   // 1) Always run hooks – no returns before this
//   const { user, loading } = useAuth();
//   const username = user?.username || "unknown user";

//   const { messages, sendMessage } = useWebSocketChat(roomName, username);

//   // 2) Now decide what to show
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <ChatLayout roomName={roomName}>
//       <div style={{ fontSize: "14px", marginBottom: "8px", color: "#555" }}>
//         Logged in as <strong>{username}</strong>
//       </div>

//       <MessageList messages={messages} currentUser={username} />

//       <TypingIndicator />

//       <MessageInput onSend={sendMessage} />
//     </ChatLayout>
//   );
// }


// src/pages/ChatPage.jsx

// frontend/src/pages/ChatPage.jsx
import { useParams } from "react-router-dom";
import ChatLayout from "../components/layout/ChatLayout";
import useWebSocketChat from "../hooks/useWebSocketChat";
import useAuth from "../hooks/useAuth";
import "../styles/chat.css"

export default function ChatPage() {
  const { roomName } = useParams();

  // 1) Always run hooks – no returns before this
  const { user, loading } = useAuth();
  
  // Use localStorage as a reliable fallback for the username
  const fallbackUsername = localStorage.getItem("username");
  const username = user?.username || fallbackUsername || "unknown user";
  
  // --- NEW: Destructure typingUsers and sendTypingStatus ---
  const { messages, sendMessage, typingUsers, sendTypingStatus } = useWebSocketChat(roomName, username);

  // 2) Now decide what to show
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ChatLayout
      roomName={username}
      messages={messages} 
      onSend={sendMessage} 
      currentUser={username} 
      // --- NEW PROPS ---
      typingUsers={typingUsers}
      sendTypingStatus={sendTypingStatus}
    />
  );
}