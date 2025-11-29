import { useState } from "react";
import { useNavigate , Link} from "react-router-dom";
import api from "../services/api";
import "../styles/LoginPage.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();           // stop page reload
    setError("");

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {
      const res = await api.post("/accounts/api/login/", {
        username,
        password,
      });

      console.log("Login success:", res.data);

      // mark as logged in for frontend
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", res.data.username);

      // go to chat list
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="page-center">
      <div className="card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
          )}

          <button type="submit" className="send-btn">
            Login
          </button>
        </form>
       <p style={{ marginTop: "15px", fontSize: "14px", color: "var(--text-secondary)" }}>
          you Don't have account register here <Link to="/register" style={{ color: "var(--whatsapp-green)", textDecoration: 'none' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}



