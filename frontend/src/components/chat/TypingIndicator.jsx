// src/components/chat/TypingIndicator.jsx
export default function TypingIndicator({ typingUsers = [] }) {
  
  if (typingUsers.length === 0) {
    return <div className="typing-indicator"></div>;
  }
  
  // Format the list of names
  let message;
  if (typingUsers.length === 1) {
    message = `${typingUsers[0]} is typing...`;
  } else if (typingUsers.length === 2) {
    message = `${typingUsers.join(' and ')} are typing...`;
  } else {
    // If more than 2 users, show the first two names and count
    const names = typingUsers.slice(0, 2).join(', ');
    message = `${names} and ${typingUsers.length - 2} other(s) are typing...`;
  }

  return <div className="typing-indicator">{message}</div>;
}