// src/pages/RoomListPage.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import useRooms from "../hooks/useRooms";
import TopBar from "../components/layout/TopBar";
import api from "../services/api";
import "../styles/RoomList.css";

export default function RoomListPage() {
  const { rooms, reloadRooms } = useRooms(); // <--- ensure reloadRooms exists in the hook
  const roomsArray = Array.isArray(rooms) ? rooms : [];

  const [newRoom, setNewRoom] = useState("");
  const [creating, setCreating] = useState(false);

  // -----------------------------
  // CREATE ROOM HANDLER
  // -----------------------------
  const createRoom = async () => {
    if (!newRoom.trim()) {
      alert("Enter room name");
      return;
    }

    setCreating(true);

    try {
      // Call backend API
      await api.post("/chat/api/rooms/create/", {
        room_name: newRoom.trim(),
      });

      // Refresh the list from backend
      if (reloadRooms) reloadRooms();

      setNewRoom("");
    } catch (err) {
      alert("Room already exists or invalid.");
    }

    setCreating(false);
  };

  return (
    <>
      <TopBar />

      <div className="page-center">
        <div className="card">
          <h2>Chats</h2>

          {/* ---------------------------
               CREATE ROOM UI
          -------------------------------- */}
          <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
            <input
              value={newRoom}
              onChange={(e) => setNewRoom(e.target.value)}
              placeholder="Create new room..."
              className="input"
              style={{ padding: "8px", flex: 1 }}
            />
            <button
              onClick={createRoom}
              disabled={creating}
              className="btn"
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </div>

          {/* ---------------------------
                ROOM LIST
          -------------------------------- */}
          <ul className="room-list">
            {roomsArray.map((room) => (
              <li key={room.name}>
                <Link to={`/chat/${room.name}`} className="room-link">
                  {/* Avatar */}
                  <div className="room-avatar">
                    {room.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Content */}
                  <div className="room-content">
                    <div className="room-title">{room.name}</div>

                    {room.last_message ? (
                      <div className="room-last">
                        <span style={{ fontWeight: 600 }}>
                          {room.last_sender}:
                        </span>{" "}
                        {room.last_message}
                      </div>
                    ) : (
                      <div
                        className="room-last"
                        style={{ fontStyle: "italic" }}
                      >
                        No messages yet
                      </div>
                    )}
                  </div>

                  {/* Badge */}
                  {room.unread > 0 && (
                    <div className="room-badge">{room.unread}</div>
                  )}
                </Link>
              </li>
            ))}

            {roomsArray.length === 0 && (
              <li
                style={{
                  padding: "12px 16px",
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                }}
              >
                No rooms found.
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
