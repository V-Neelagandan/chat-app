// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate} from "react-router-dom"; 
import api from "../services/api";
import "../styles/LoginPage.css"; // Reuse login page styles

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {
      const res = await api.post("/accounts/api/register/", {
        username,
        password,
      });

      console.log("Registration success:", res.data);

      // Mark as logged in for frontend
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", res.data.username);

      // Go to chat list
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
      // Use the detail message if available, otherwise a generic error
      const detail = err.response?.data?.detail || "Registration failed. Please try again.";
      setError(detail);
    }
  };

  return (
    <div className="page-center">
      <div className="card">
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="error">{error}</div>
          )}

          <button type="submit" className="send-btn" >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}