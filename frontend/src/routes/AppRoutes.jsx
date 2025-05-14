import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { ToastContainer } from "react-toastify";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import UploadPage from "../pages/UploadPage";
import NotFoundPage from "../pages/NotFoundPage";
import Navbar from "../components/Navbar";
import PrivateRoute from "../components/PrivateRoute";
import GuestRoute from "../components/GuestRoute";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import EditProfilePage from "../pages/EditProfilePage";
const VideoPage = lazy(() => import("../pages/VideoPage"))
const HomePage = lazy(() => import("../pages/HomePage"));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Public Routes */}
                  <Route
                    path="/"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <HomePage />
                      </Suspense>
                    }
                  />
                  <Route path="/videos/:id" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <VideoPage />
                  </Suspense>} />

                  {/* Guest-only Routes */}
                  <Route element={<GuestRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                  </Route>

                  {/* Protected Routes */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/upload" element={<UploadPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/profile/edit" element={<EditProfilePage />} />
                  </Route>

                  {/* Error Handling */}
                  <Route path="/404" element={<NotFoundPage />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </AnimatePresence>
            </main>

            {/* Footer can be added here */}
          </div>

          {/* Toast Notifications */}
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
