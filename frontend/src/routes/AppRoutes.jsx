import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import HomePage from "../pages/HomePage";
import VideoPage from "../pages/VideoPage";
import LoginPage from "../pages/LoginPage";
import Navbar from "../components/Navbar";

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/videos/:id" element={<VideoPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
