import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-white">TourTube</Link>

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-sm">Welcome, {user.name}</span>
            <button onClick={logout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">Logout</button>
          </>
        ) : (
          <Link to="/login" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">Login</Link>
        )}
      </div>
    </nav>
  );
}
