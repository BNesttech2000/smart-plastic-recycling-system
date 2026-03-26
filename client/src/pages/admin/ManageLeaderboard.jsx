import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaSpinner, FaTrophy, FaMedal, FaSync, FaCalendarAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ManageLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [period, setPeriod] = useState('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    try {
      // Replace with actual API call
      // const response = await api.get(`/admin/leaderboard?period=${period}`);
      // setLeaderboard(response.data);
      
      setLeaderboard([
        { rank: 1, name: 'Sean', points: 177, contributions: 4, weight: 18, userId: 1 },
        { rank: 2, name: 'Nestony Biamungu', points: 0, contributions: 0, weight: 0, userId: 2 },
        { rank: 3, name: 'Super Admin', points: 1000, contributions: 0, weight: 0, userId: 3 }
      ]);
    } catch (error) {
      toast.error('Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const handleResetLeaderboard = async () => {
    if (window.confirm('Are you sure you want to reset the leaderboard? This action cannot be undone.')) {
      setResetting(true);
      try {
        // Replace with actual API call
        // await api.post('/admin/leaderboard/reset', { period });
        toast.success('Leaderboard reset successfully');
        fetchLeaderboard();
      } catch (error) {
        toast.error('Failed to reset leaderboard');
      } finally {
        setResetting(false);
      }
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
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-primary-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Leaderboard</h1>
          <p className="text-gray-600">View and manage the top recyclers</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="input-field w-40"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
          <button
            onClick={handleResetLeaderboard}
            disabled={resetting}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2 disabled:opacity-50"
          >
            <FaSync className={resetting ? 'animate-spin' : ''} />
            <span>Reset {period === 'week' ? 'Weekly' : period === 'month' ? 'Monthly' : 'All-Time'}</span>
          </button>
        </div>
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="order-2 md:order-1 text-center">
            <div className="bg-gray-100 rounded-lg p-6">
              <FaMedal className={`text-4xl mx-auto mb-3 ${getMedalColor(2)}`} />
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">{leaderboard[1]?.name}</h3>
              <p className="text-2xl font-bold text-primary-600">{leaderboard[1]?.points} pts</p>
            </div>
          </div>
          <div className="order-1 md:order-2 text-center transform md:scale-110">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg p-6 text-white">
              <FaTrophy className="text-5xl mx-auto mb-3" />
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl font-bold text-yellow-600">1</span>
              </div>
              <h3 className="text-xl font-bold">{leaderboard[0]?.name}</h3>
              <p className="text-3xl font-bold">{leaderboard[0]?.points} pts</p>
            </div>
          </div>
          <div className="order-3 text-center">
            <div className="bg-gray-100 rounded-lg p-6">
              <FaMedal className={`text-4xl mx-auto mb-3 ${getMedalColor(3)}`} />
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">{leaderboard[2]?.name}</h3>
              <p className="text-2xl font-bold text-primary-600">{leaderboard[2]?.points} pts</p>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500">Rank</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500">User</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500">Points</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500">Contributions</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500">Weight (kg)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leaderboard.map((user) => (
              <tr key={user.rank} className="hover:bg-gray-50">
                <td className="py-3 px-6">
                  <div className="flex items-center space-x-2">
                    <FaMedal className={getMedalColor(user.rank)} />
                    <span className="font-medium">#{user.rank}</span>
                  </div>
                </td>
                <td className="py-3 px-6 font-medium text-gray-800">{user.name}</td>
                <td className="py-3 px-6 font-bold text-primary-600">{user.points}</td>
                <td className="py-3 px-6 text-gray-600">{user.contributions}</td>
                <td className="py-3 px-6 text-gray-600">{user.weight} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ManageLeaderboard;