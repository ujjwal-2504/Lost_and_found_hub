import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// Import auth components
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Import all page components from pages folder
import Home from "./pages/Home";
import Lost from "./pages/Lost"; // For reporting lost items
import Found from "./pages/Found"; // For submitting found items
import BrowseFound from "./pages/BrowseFound"; // For browsing found items
import Claim from "./pages/Claim";
import Leaderboard from "./pages/Leaderboard";
import About from "./pages/About";

const App = () => {
  const { user, logout, loading } = useAuth(); // ✅ Add loading

  const handleLogout = () => {
    logout();
  };

  // ✅ Show loading state in navigation
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-7 items-center py-2">
            {/* Logo/Brand */}
            <div className="flex-shrink-0 mr-1">
              <Link
                to="/"
                className="text-3xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-300"
              >
                X Coders
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex gap-3 items-center text-center">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-md font-medium transition-all duration-200"
              >
                Home
              </Link>

              {/* Browse Found - Public for everyone */}
              <Link
                to="/found"
                className="text-gray-700 hover:text-green-600 hover:bg-green-50 px-4  py-2 rounded-lg  text-md font-medium transition-all duration-200"
              >
                Browse Found
              </Link>

              {user ? (
                // Authenticated user navigation
                <>
                  <Link
                    to="/report-lost"
                    className="text-gray-700 hover:text-red-600 hover:bg-red-50 px-4  py-2 rounded-lg  text-md font-medium transition-all duration-200"
                  >
                    Report Lost
                  </Link>
                  <Link
                    to="/submit-found"
                    className="text-gray-700 hover:text-green-600 hover:bg-green-50 px-4  py-2 rounded-lg  text-md font-medium transition-all duration-200"
                  >
                    Submit Found
                  </Link>
                  <Link
                    to="/claim"
                    className="text-gray-700 hover:text-blue-600 hover:bg-blue-50  px-4 py-2 rounded-lg  text-md font-medium transition-all duration-200"
                  >
                    Claim
                  </Link>
                  <Link
                    to="/leaderboard"
                    className="text-gray-700 hover:text-purple-600 hover:bg-purple-50  px-4 py-2 rounded-lg  text-md font-medium transition-all duration-200"
                  >
                    Leaderboard
                  </Link>
                  <Link
                    to="/about"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-50  px-4 py-2 rounded-lg  text-md font-medium transition-all duration-200"
                  >
                    About
                  </Link>

                  {/* User Info & Logout */}
                  <div className="flex items-center  pl-3 border-l border-gray-200">
                    <div className="flex items-center  bg-gray-50 px-4 py-2 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {user.name}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 hover:shadow-md transition-all duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                // Non-authenticated user navigation
                <>
                  <Link
                    to="/about"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    About
                  </Link>

                  <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-200">
                    <Link
                      to="/login"
                      className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 hover:shadow-md transition-all duration-200"
                    >
                      Sign Up
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-screen">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/found" element={<BrowseFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/report-lost"
            element={
              <ProtectedRoute>
                <Lost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submit-found"
            element={
              <ProtectedRoute>
                <Found />
              </ProtectedRoute>
            }
          />
          <Route
            path="/claim"
            element={
              <ProtectedRoute>
                <Claim />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
