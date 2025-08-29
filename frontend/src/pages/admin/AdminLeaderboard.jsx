import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLeaderboard } from "../../services/adminService";

const AdminLeaderboard = () => {
  const [allLeaders, setAllLeaders] = useState([]);
  const [displayLeaders, setDisplayLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [topN, setTopN] = useState(10);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard();
        setAllLeaders(data);
      } catch (err) {
        setError("Failed to load leaderboard");
        console.error("Fetch leaderboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  useEffect(() => {
    setDisplayLeaders(allLeaders.slice(0, topN));
  }, [allLeaders, topN]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Community Helpers Leaderboard
              </h1>
              <p className="text-gray-600">
                Top contributors helping reunite lost items with their owners
              </p>
            </div>
            <Link
              to="/admin"
              className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <label htmlFor="topN" className="text-sm font-medium text-gray-700">
              Show Top:
            </label>
            <select
              id="topN"
              value={topN}
              onChange={(e) => setTopN(parseInt(e.target.value, 10))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={5}>5 Users</option>
              <option value={10}>10 Users</option>
              <option value={20}>20 Users</option>
            </select>
            <div className="text-sm text-gray-600">
              Showing {displayLeaders.length} of {allLeaders.length} users
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        {displayLeaders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Data Available
            </h3>
            <p className="text-gray-600">No community helpers found yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Badges
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayLeaders.map((leader, index) => (
                    <tr
                      key={leader._id}
                      className={index < 3 ? "bg-yellow-50" : ""}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span
                            className={`text-2xl mr-2 ${
                              index === 0
                                ? "text-yellow-500"
                                : index === 1
                                ? "text-gray-400"
                                : index === 2
                                ? "text-yellow-600"
                                : ""
                            }`}
                          >
                            {index === 0
                              ? "🥇"
                              : index === 1
                              ? "🥈"
                              : index === 2
                              ? "🥉"
                              : ""}
                          </span>
                          <span className="text-lg font-semibold text-gray-900">
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {leader.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {leader.department || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {leader.year || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-purple-600">
                            {leader.points || 0}
                          </span>
                          <span className="ml-1 text-sm text-gray-500">
                            pts
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {leader.badges && leader.badges.length > 0 ? (
                            leader.badges.map((badge, idx) => (
                              <span
                                key={idx}
                                className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium"
                              >
                                {badge}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400">
                              No badges
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLeaderboard;
