import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getPendingFoundItems,
  getPendingClaims,
} from "../../services/adminService";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pendingFoundCount, setPendingFoundCount] = useState(0);
  const [pendingClaimCount, setPendingClaimCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Admin access check
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [foundItems, claims] = await Promise.all([
          getPendingFoundItems(),
          getPendingClaims(),
        ]);
        setPendingFoundCount(foundItems.length);
        setPendingClaimCount(claims.length);
      } catch (err) {
        setError("Error loading dashboard data");
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage lost and found items, verify claims, and view statistics
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Pending Found Items
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {pendingFoundCount}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/admin/found"
                className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Approve Items
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Pending Claims
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {pendingClaimCount}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/admin/claims"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Verify Claims
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Top Helpers
                </h3>
                <p className="text-sm text-gray-600">View community leaders</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/admin/leaderboard"
                className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
              >
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/found"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors duration-200 text-center"
            >
              <div className="text-green-600 font-medium">
                Approve Found Items
              </div>
              <div className="text-sm text-gray-600">
                Review and approve submitted found items
              </div>
            </Link>
            <Link
              to="/admin/claims"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 text-center"
            >
              <div className="text-blue-600 font-medium">Verify Claims</div>
              <div className="text-sm text-gray-600">
                Review ownership claims and award items
              </div>
            </Link>
            <Link
              to="/admin/leaderboard"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors duration-200 text-center"
            >
              <div className="text-purple-600 font-medium">View Statistics</div>
              <div className="text-sm text-gray-600">
                Check community helper rankings
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
