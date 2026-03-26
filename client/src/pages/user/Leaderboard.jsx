import React, { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaUser, FaSpinner, FaCalendarWeek, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all'); // all, week, month

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    try {
      // Replace with actual API call
      // const response = await fetch(`/api/leaderboard?period=${period}`);
      // const data = await response.json();
      
      // Mock data for now - replace with real API
      setLeaderboard([
        { rank: 1, name: 'Sean', points: 177, contributions: 4, weight: 18 },
        { rank: 2, name: 'Nestony Biamungu', points: 0, contributions: 0, weight: 0 },
        { rank: 3, name: 'Super Admin', points: 1000, contributions: 0, weight: 0 }
      ]);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalColor = (rank) => {
    switch(rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-600';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTrophy className="text-yellow-600 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Leaderboard</h1>
          <p className="text-gray-600">Top recyclers making a difference</p>
        </div>

        {/* Period Selector */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setPeriod('week')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              period === 'week'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaCalendarWeek />
            <span>This Week</span>
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              period === 'month'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaCalendarAlt />
            <span>This Month</span>
          </button>
          <button
            onClick={() => setPeriod('all')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              period === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaTrophy />
            <span>All Time</span>
          </button>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {/* 2nd Place */}
            <div className="order-2 md:order-1 text-center">
              <div className="bg-gray-100 rounded-lg p-6 h-full">
                <FaMedal className={`text-4xl mx-auto mb-3 ${getMedalColor(2)}`} />
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaUser className="text-gray-600 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{leaderboard[1]?.name}</h3>
                <p className="text-2xl font-bold text-primary-600">{leaderboard[1]?.points} pts</p>
                <p className="text-sm text-gray-500">{leaderboard[1]?.contributions} contributions</p>
              </div>
            </div>

            {/* 1st Place */}
            <div className="order-1 md:order-2 text-center transform md:scale-110">
              <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg p-6 text-white h-full">
                <FaTrophy className="text-5xl mx-auto mb-3" />
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaUser className="text-yellow-600 text-4xl" />
                </div>
                <h3 className="text-xl font-bold">{leaderboard[0]?.name}</h3>
                <p className="text-3xl font-bold">{leaderboard[0]?.points} pts</p>
                <p className="text-sm opacity-90">{leaderboard[0]?.contributions} contributions</p>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="order-3 text-center">
              <div className="bg-gray-100 rounded-lg p-6 h-full">
                <FaMedal className={`text-4xl mx-auto mb-3 ${getMedalColor(3)}`} />
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaUser className="text-gray-600 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{leaderboard[2]?.name}</h3>
                <p className="text-2xl font-bold text-primary-600">{leaderboard[2]?.points} pts</p>
                <p className="text-sm text-gray-500">{leaderboard[2]?.contributions} contributions</p>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Rank</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">User</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Points</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Contributions</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Weight (kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaderboard.map((user, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <FaMedal className={getMedalColor(user.rank)} />
                      <span className="font-medium text-gray-800">#{user.rank}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-primary-600 text-sm" />
                      </div>
                      <span className="font-medium text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-primary-600">{user.points}</span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{user.contributions}</td>
                  <td className="py-4 px-6 text-gray-600">{user.weight} kg</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;