// frontend/src/hooks/useWebSocketChat.js
import { useEffect, useRef, useState, useCallback } from "react";
import { buildWsUrl } from "../services/websocket";
import api from "../services/api"; // axios instance for REST

export default function useWebSocketChat(roomName, username) {
  const [messages, setMessages] = useState([]);
  // --- NEW STATE: Track users currently typing ---
  const [typingUsers, setTypingUsers] = useState({}); // { username: true/false }
  const wsRef = useRef(null);

  // Load old messages from REST
  useEffect(() => {
    if (!roomName) return;

    async function loadHistory() {
      try {
        const res = await api.get(`/chat/api/messages/${roomName}/`);
        const data = res.data?.messages || [];

        const mapped = data.map((m) => ({
          id: m.id,
          sender: m.sender || m.username || "Unknown",
          message: m.message,
        }));

        setMessages(mapped);
      } catch (err) {
        console.error("Failed to load history", err);
      }
    }

    loadHistory();
  }, [roomName]);

  // Open WebSocket
  useEffect(() => {
    if (!roomName) return;

    const url = buildWsUrl(`/ws/chat/${roomName}/`);
    console.log("Opening WS:", url);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WS OPEN", url);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // --- NEW LOGIC: Handle typing indicator event ---
        if (data.type === "typing") {
            const typingUsername = data.username;
            if (typingUsername === username) {
                // Ignore self typing event
                return;
            }
            
            setTypingUsers((prev) => {
                const newTypingUsers = { ...prev };
                if (data.typing) {
                    newTypingUsers[typingUsername] = true;
                } else {
                    delete newTypingUsers[typingUsername];
                }
                return newTypingUsers;
            });
            return; 
        }
        // ----------------------------------------------
        if (!data.message) return;

        const sender = data.username || data.sender || "Unknown";

        // --- FIX: Prevent duplicate display for the sender ---
        if (sender === username) {
            // If the message was sent by me, I already added it optimistically
            // in the sendMessage function. Ignore this broadcast.
            return; 
        }
        // ---------------------------------------------------

        setMessages((prev) => [
          ...prev,
          {
            id: data.id || Date.now(),
            sender,
            message: data.message,
          },
        ]);
      } catch (e) {
        console.error("WS message parse error", e);
      }
    };

    ws.onclose = (e) => {
      console.log("WS CLOSED", e.code, e.reason || "");
    };

    ws.onerror = (e) => {
      console.error("WS ERROR", e);
    };

    return () => {
      console.log("Closing WS:", url);
      ws.close();
    };
  }, [roomName,username]);

  // --- NEW FUNCTION: Send raw typing status ---
  const sendTypingStatus = useCallback((isTyping) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN || !username || username === "unknown user") {
      return;
    }
    
    ws.send(JSON.stringify({
      typing: isTyping,
      username: username,
    }));
  }, [username]);
  
  // --- NEW FUNCTION: Handle debounced typing status ---
  const handleUserTyping = useCallback(() => {
    // We use a debounce system inside the hook to prevent excessive WebSocket messages
    // and rely on a ref to manage the timeout.
    // NOTE: This logic needs to be attached to a persistent ref outside of this hook
    // for true debouncing, but for simplicity, we pass the raw function to the component
    // and let the component call it on every input.
    // Since we can't manage the persistent ref easily here, we will adapt MessageInput.jsx
    // to handle the timeout, and this hook just exposes the raw send/stop functions.
    // However, looking at the code, we can define the timer logic in the component itself.
    
    // Let's modify the return values to simplify the component logic:
    // We will let MessageInput handle the timer and call the raw sendTypingStatus function.
    sendTypingStatus(true);
  }, [sendTypingStatus]);

  // Send message **with real username**
  const sendMessage = useCallback(
    (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.warn("WS not open, cannot send");
        return;
      }

      const senderName = username || "unknown";

      const payload = {
        message: trimmed,
        username: senderName, // <--- IMPORTANT: real username
      };

      ws.send(JSON.stringify(payload));

      // Optimistic update on UI
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: senderName,
          message: trimmed,
        },
      ]);
      // Stop typing after sending message
    sendTypingStatus(false);
    },
    [username,sendTypingStatus]
  );

  return {
    messages,
    sendMessage,
    typingUsers: Object.keys(typingUsers), // Export as a simple list of usernames
    sendTypingStatus, // Export the raw function for the component to use
  };
}
