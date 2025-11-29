// src/components/layout/TopBar.jsx
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function TopBar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Guest";

  const handleLogout = async () => {
    try {
      await api.post("/accounts/api/logout/");
    } catch (err) {
      console.error("Logout error (can ignore in dev):", err);
    }

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");

    navigate("/login");
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <span className="topbar-title">WhatsApp Clone</span>
        {/* Cleaner display of logged-in user */}
        <span className="topbar-user">| Logged in as: {username}</span> 
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}