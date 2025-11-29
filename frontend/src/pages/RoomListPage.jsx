// src/pages/RoomListPage.jsx
import { Link } from "react-router-dom";
import useRooms from "../hooks/useRooms";
import TopBar from "../components/layout/TopBar";
import "../styles/RoomList.css"

export default function RoomListPage() {
  
  // FIX: This ensures you get the array, not the object.
  // If the hook only returns an object, we use the property name 'rooms'.
  const { rooms } = useRooms(); 

  // Make sure 'rooms' is an array before using map
  const roomsArray = Array.isArray(rooms) ? rooms : [];

  return (
    <>
      <TopBar />

      <div className="page-center">
        <div className="card">
          <h2>Chats</h2>
          
          <ul className="room-list">
            {roomsArray.map((room) => (
              <li key={room.name}>
                <Link to={`/chat/${room.name}`} className="room-link">
                    
                  {/* 1. Avatar */}
                  <div 
                    className="room-avatar"
                  >
                    {room.name.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* 2. Content (Title & Last Message) */}
                  <div className="room-content">
                    <div className="room-title">
                      {room.name}
                    </div>

                    {room.last_message ? (
                      <div className="room-last">
                        <span style={{ fontWeight: 600 }}>{room.last_sender}:</span> {room.last_message}
                      </div>
                    ) : (
                       <div className="room-last" style={{ fontStyle: 'italic' }}>
                         No messages yet
                       </div>
                    )}
                  </div>
                  
                  {/* 3. Badge (only show if unread count > 0) */}
                  {room.unread > 0 && (
                      <div className="room-badge">{room.unread}</div>
                  )}

                </Link>
              </li>
            ))}

            {roomsArray.length === 0 && (
              <li
                style={{ padding: "12px 16px", fontSize: "14px", color: "var(--text-secondary)" }}
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