import { Routes, Route } from "react-router-dom";
import RoomListPage from "./pages/RoomListPage";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/common/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage/>} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <RoomListPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/chat/:roomName"
        element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
