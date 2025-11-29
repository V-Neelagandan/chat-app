// src/components/chat/MessageInput.jsx

import { useState, useRef, useCallback } from "react";

// NEW PROP: sendTypingStatus
export default function MessageInput({ onSend, sendTypingStatus }) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (typeof onSend !== "function") {
      console.warn("MessageInput: onSend is not a function", onSend);
      return;
    }

    const trimmed = text.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setText("");
    setShowEmojiPicker(false);
    
    // Ensure typing status is stopped after sending message
    if (sendTypingStatus) {
        clearTimeout(typingTimeoutRef.current);
        sendTypingStatus(false);
    }
  };
  
  // --- TYPING INDICATOR LOGIC (local debounce) ---
  const handleInput = useCallback((value) => {
    setText(value);

    if (!sendTypingStatus) return;

    // Send START typing status immediately
    if (!typingTimeoutRef.current) {
      sendTypingStatus(true);
    }

    // Reset timeout on every input
    clearTimeout(typingTimeoutRef.current);

    // Send STOP typing status after 1.5 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(false);
      typingTimeoutRef.current = null;
    }, 1500); 
  }, [sendTypingStatus]);
  
  // --- EMOJI LOGIC ---
  const EMOJIS = ["😀", "👍", "❤️", "😂", "😢", "🎉", "🔥", "🤔", "😊", "😎", "😜"];

  const handleEmojiClick = (emoji) => {
    setText((prev) => prev + emoji);
    handleInput(text + emoji); // Also trigger typing status
  };
  // -----------------------

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* --- EMOJI PICKER UI --- */}
      {showEmojiPicker && (
        <div 
          style={{ 
            position: 'absolute', 
            bottom: '50px', 
            left: '12px', 
            background: 'var(--bg-header)', 
            padding: '10px', 
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
            zIndex: 10,
            maxWidth: '90%',
            display: 'flex',
            flexWrap: 'wrap'
          }}
        >
          {EMOJIS.map((emoji) => (
            <span 
              key={emoji} 
              onClick={() => handleEmojiClick(emoji)} 
              style={{ fontSize: '24px', cursor: 'pointer', margin: '4px' }}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
      {/* --------------------------- */}
      
      <form className="chat-input-row" onSubmit={handleSubmit}>
        {/* --- Emoji Button --- */}
        <button 
          type="button" 
          onClick={() => setShowEmojiPicker(prev => !prev)}
          className="chat-send-btn"
          style={{ padding: '10px 14px', borderRadius: '50%', width: '40px', height: '40px', background: 'var(--input-bg)' }}
        >
          {showEmojiPicker ? '❌' : '😊'}
        </button>
        {/* ------------------------- */}
        
        <input
          className="chat-input"
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => handleInput(e.target.value)} // Use new handler
        />
        <button className="chat-send-btn" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}