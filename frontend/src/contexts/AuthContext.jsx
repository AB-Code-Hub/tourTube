import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "../api/client";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Axios response interceptor to handle 401 errors
  // useEffect(() => {
  //   const responseInterceptor = axios.interceptors.response.use(
  //     response => response,
  //     async error => {
  //       if (error.response?.status === 401 && !error.config._retry) {
  //         error.config._retry = true;
  //         try {
  //           await refreshToken();
  //           return axios(error.config);
  //         } catch (refreshError) {
  //           await logout();
  //           return Promise.reject(refreshError);
  //         }
  //       }
  //       return Promise.reject(error);
  //     }
  //   );

  //   return () => {
  //     axios.interceptors.response.eject(responseInterceptor);
  //   };
  // }, []);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/users/profile", {
        withCredentials: true // Ensure cookies are sent
      });

      const data = response.data?.data;
      setUser(data);
      setError(null);
      
      // Prevent redirect if already logged in
      if (location.pathname === '/login' || location.pathname === '/register') {
        navigate('/');
      }
    } catch (err) {
      setUser(null);
      setError(err.response?.data?.message || "Failed to fetch user");
      
      // Only redirect to login if not already on auth pages
      if (!['/login', '/register'].includes(location.pathname)) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [location.pathname, navigate]);

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      const response = await axios.post("/users/login", credentials, {
        withCredentials: true
      });
      const data = response.data?.data;
      setUser(data.user);
      setError(null);
      toast.success(`Welcome back, ${data.user.fullName}!`);
      
      // Redirect to previous page or home
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      toast.error(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [location.state?.from?.pathname, navigate]);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post("/users/register", userData, {
        withCredentials: true
      });
      const data = response.data?.data;
      setUser(data);
      setError(null);
      toast.success(`please login to TourTube, ${data.fullName}!`);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      toast.error(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await axios.post("/users/logout", {}, {
        withCredentials: true
      });
      setUser(null);
      toast.info("Logged out successfully");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Logout failed");
      toast.error("Failed to logout properly");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const updateUser = useCallback(async (updatedData) => {
    try {
      setLoading(true);
      const { data } = await axios.patch("/users/update-details", updatedData, {
        withCredentials: true
      });
      setUser(data.user);
      toast.success("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
      toast.error(err.response?.data?.message || "Failed to update profile");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      await axios.post("/users/refresh-token", {}, {
        withCredentials: true
      });
      await fetchUser();
    } catch (err) {
      throw err; // Let the interceptor handle this
    }
  }, [fetchUser]);

  useEffect(() => {
    // Set up token refresh interval (every 14 minutes)
    const interval = setInterval(() => {
      if (user) refreshToken();
    }, 14 * 60 * 1000); // Refresh before expiration (15 min)

    // Initial fetch
    fetchUser();

    return () => clearInterval(interval);
  }, [refreshToken, fetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        refreshToken,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};