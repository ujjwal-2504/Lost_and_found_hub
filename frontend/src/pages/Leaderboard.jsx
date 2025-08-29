import React from "react";

const Leaderboard = () => {
  // Dummy data for the leaderboard
  const leaderboardData = [
    {
      rank: 1,
      name: "Tanusri",
      points: 850,
      badge: "🏆 Gold Helper",
    },
    {
      rank: 2,
      name: "Mike Chen",
      points: 720,
      badge: "🥈 Silver Helper",
    },
    {
      rank: 3,
      name: "Emily Davis",
      points: 650,
      badge: "🥉 Bronze Helper",
    },
    {
      rank: 4,
      name: "Alex Rodriguez",
      points: 480,
      badge: "⭐ Star Helper",
    },
    {
      rank: 5,
      name: "Jessica Kim",
      points: 320,
      badge: "🌟 Rising Helper",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
          Top Helpers - Leaderboard
        </h1>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  Good Samaritan Points
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  Badge
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200">
              {leaderboardData.map((user, index) => (
                <tr
                  key={user.rank}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition-colors duration-200`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                          user.rank === 1
                            ? "bg-yellow-100 text-yellow-800"
                            : user.rank === 2
                            ? "bg-gray-100 text-gray-800"
                            : user.rank === 3
                            ? "bg-orange-100 text-orange-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        #{user.rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      {user.points.toLocaleString()} pts
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                      {user.badge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Keep helping others to climb the leaderboard! 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
