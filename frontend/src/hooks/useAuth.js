// frontend/src/hooks/useAuth.js
import { useEffect, useState } from "react";
import api from "../services/api";

export default function useAuth() {
  const [user, setUser] = useState(null);      // { username } or null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/accounts/api/me/");
        if (res.data.authenticated) {
          setUser({ username: res.data.username });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("auth check failed", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const login = async (username, password) => {
    const res = await api.post("/accounts/api/login/", { username, password });
    setUser({ username: res.data.username });
  };

  const logout = async () => {
    await api.post("/accounts/api/logout/");
    setUser(null);
  };

  return { user, loading, login, logout };
}
