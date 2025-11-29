// src/components/layout/ChatLayout.jsx

import MessageList from "../chat/MessageList";
import MessageInput from "../chat/MessageInput";
import TypingIndicator from "../chat/TypingIndicator"; 

// --- NEW PROPS: typingUsers, sendTypingStatus ---
function ChatLayout({ roomName, messages, onSend, currentUser, typingUsers, sendTypingStatus }) {
  // WhatsApp-style dummy avatar: first letter of room name
  const avatarLetter = roomName ? roomName.charAt(0).toUpperCase() : '?';

  return (
    <div className="chat-page">
      <header className="chat-header">
        {/* ... (Avatar and Title UI) ... */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'var(--whatsapp-green)',
          color: 'var(--text-primary)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontWeight: 'bold',
          fontSize: '18px',
        }}>
          {avatarLetter}
        </div>
        
        {/* Room Title and Status */}
        <div>
          <div className="chat-title">{roomName}</div>
          <div className="chat-status">online</div>
        </div>
      </header>

      {/* Main chat area, which is scrollable */}
      <main className="chat-main">
        <MessageList messages={messages} currentUser={currentUser} />
        {/* TypingIndicator is moved to the footer for better placement */}
      </main>

      {/* Input area */}
      <footer className="chat-footer">
        {/* --- NEW: TypingIndicator placed above input --- */}
        <TypingIndicator typingUsers={typingUsers} />
        {/* --- Pass raw function to MessageInput --- */}
        <MessageInput onSend={onSend} sendTypingStatus={sendTypingStatus} />
      </footer>
    </div>
  );
}

export default ChatLayout;