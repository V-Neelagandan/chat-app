// src/hooks/useRooms.js
import { useEffect, useState,useCallback} from "react";
import api from "../services/api"; // <-- Import api

export default function useRooms() {
  const [rooms, setRooms] = useState([]);

  // Get username from localStorage for a quick check
  const username = localStorage.getItem("username"); 

  const refreshRooms = useCallback(async () => {
    // Skip API call if the user doesn't seem logged in locally
    if (!username) { 
        console.warn("Skipping room fetch: User not logged in.");
        setRooms([]);
        return;
    }
    
    try {
      const res = await api.get("/chat/api/rooms/"); // <-- Use api (axios)
      setRooms(res.data.rooms || []);
    } catch (err) {
      console.error("Failed to load rooms:", err);
    }
  }, [username]); // <-- Re-run when username changes

  useEffect(() => {
    refreshRooms();
  }, [refreshRooms]);

  // CORRECT: Returns an object { rooms: [...] }
  return { rooms, refreshRooms };
}