// src/hooks/useRooms.js
import { useEffect, useState, useCallback } from "react";
import api from "../services/api";

export default function useRooms() {
  const [rooms, setRooms] = useState([]);

  const username = localStorage.getItem("username");

  const refreshRooms = useCallback(async () => {
    if (!username) {
      console.warn("Skipping room fetch: User not logged in.");
      setRooms([]);
      return;
    }

    try {
      const res = await api.get("/chat/api/rooms/");
      setRooms(res.data.rooms || []);
    } catch (err) {
      console.error("Failed to load rooms:", err);
    }
  }, [username]);

  useEffect(() => {
    refreshRooms();
  }, [refreshRooms]);

  // ⭐ Return both names so any component can use either
  return { 
    rooms, 
    refreshRooms, 
    reloadRooms: refreshRooms   // <--- Add this line
  };
}
