import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { FiMenu, FiX, FiUser, FiUpload, FiLogOut,  FiSun, FiMoon,  } from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md border-b ${
      theme === 'dark' 
        ? 'bg-gray-900/80 border-gray-700 text-white' 
        : 'bg-white/80 border-gray-200 text-gray-900'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold flex items-center">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              TourTube
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-yellow-300' 
                  : 'bg-gray-200 text-gray-700'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {user ? (
              <div className="relative dropdown-container">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <FiUser className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
                    )}
                  </div>
                  <span className="hidden lg:inline font-medium">
                    {user.fullName.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border border-gray-700' 
                      : 'bg-white border border-gray-200'
                  }`}>
                   
                    <Link
                      to="/upload"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm hover:bg-blue-500 hover:text-white"
                    >
                      <FiUpload className="mr-2" /> Upload Video
                    </Link>
                    <Link
                      to={`/profile/${user?.username}`}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm hover:bg-blue-500 hover:text-white"
                    >
                      <FiUser className="mr-2" /> Your Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-red-500 hover:text-white"
                    >
                      <FiLogOut className="mr-2" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  theme === 'dark' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors`}
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-full ${
                theme === 'dark' 
                  ? 'text-white hover:bg-gray-700' 
                  : 'text-gray-900 hover:bg-gray-200'
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} pb-4 px-4`}>
          <div className="pt-2 space-y-2">
            {user ? (
              <>
               
                <Link
                  to="/upload"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500 hover:text-white"
                >
                  <FiUpload className="mr-2" /> Upload Video
                </Link>
                <Link
                  to={`/profile/${user?.username}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500 hover:text-white"
                >
                  <FiUser className="mr-2" /> Your Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium hover:bg-red-500 hover:text-white"
                >
                  <FiLogOut className="mr-2" /> Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  theme === 'dark' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white text-center`}
              >
                Sign In
              </Link>
            )}

            {/* Theme Toggle for Mobile */}
            <button
              onClick={toggleTheme}
              className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium ${
                theme === 'dark' 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-200'
              }`}
            >
              {theme === 'dark' ? (
                <>
                  <FiSun className="mr-2" /> Light Mode
                </>
              ) : (
                <>
                  <FiMoon className="mr-2" /> Dark Mode
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}