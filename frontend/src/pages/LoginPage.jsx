import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/client";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/login", { email, password });
      const res = await axios.get("/users/me");
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Login to TourTube</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full border p-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
