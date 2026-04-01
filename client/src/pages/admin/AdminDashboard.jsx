// import React, { useState, useEffect } from 'react';
// import { adminService } from '../../services/adminService';
// import AdminLayout from '../../components/admin/AdminLayout';
// import {
//   FaUsers,
//   FaRecycle,
//   FaTrophy,
//   FaWeightHanging,
//   FaArrowUp,
//   FaArrowDown,
//   FaDownload,
//   FaCalendarAlt,
// } from 'react-icons/fa';
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   AreaChart,
//   Area,
// } from 'recharts';
// import { motion } from 'framer-motion';
// import { format, subDays } from 'date-fns';

// const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

// const AdminDashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState(null);
//   const [dateRange, setDateRange] = useState('week');

//   useEffect(() => {
//     fetchDashboardData();
//   }, [dateRange]);

//   const fetchDashboardData = async () => {
//     try {
//       const response = await adminService.getDashboard();
//       setStats(response.data);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <AdminLayout>
//         <div className="flex items-center justify-center h-64">
//           <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       </AdminLayout>
//     );
//   }

//   const summaryCards = [
//     {
//       title: 'Total Users',
//       value: stats?.total?.toLocaleString() || '0',
//       change: '+12.5%',
//       trend: 'up',
//       icon: FaUsers,
//       color: 'bg-blue-500',
//     },
//     {
//       title: 'Total Contributions',
//       value: stats?.totalApproved?.toLocaleString() || '0',
//       change: '+8.2%',
//       trend: 'up',
//       icon: FaRecycle,
//       color: 'bg-green-500',
//     },
//     {
//       title: 'Total Weight',
//       value: `${(stats?.totalWeight / 1000)?.toFixed(1) || '0'}T`,
//       change: '+15.3%',
//       trend: 'up',
//       icon: FaWeightHanging,
//       color: 'bg-purple-500',
//     },
//     {
//       title: 'Total Points',
//       value: stats?.totalPoints?.toLocaleString() || '0',
//       change: '-2.1%',
//       trend: 'down',
//       icon: FaTrophy,
//       color: 'bg-yellow-500',
//     },
//   ];

//   return (
//     <AdminLayout>
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
//           <p className="text-gray-600">Welcome back, Administrator</p>
//         </div>
//         <div className="flex items-center space-x-4 mt-4 md:mt-0">
//           <div className="flex items-center space-x-2 bg-gray-100 rounded-lg shadow-sm p-1">
//             {['week', 'month', 'year'].map((range) => (
//               <button
//                 key={range}
//                 onClick={() => setDateRange(range)}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                   dateRange === range
//                     ? 'bg-primary-600 text-white'
//                     : 'text-gray-600 hover:bg-gray-200'
//                 }`}
//               >
//                 {range.charAt(0).toUpperCase() + range.slice(1)}
//               </button>
//             ))}
//           </div>
//           <button className="flex items-center space-x-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition-colors">
//             <FaDownload />
//             <span>Export</span>
//           </button>
//         </div>
//       </div>

//       {/* Summary Cards - Changed bg-white to bg-gray-100 */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {summaryCards.map((card, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//             className="bg-gray-100 rounded-lg shadow-lg p-6"
//           >
//             <div className="flex items-center justify-between mb-4">
//               <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
//                 <card.icon className="text-white text-xl" />
//               </div>
//               <div className={`flex items-center space-x-1 text-sm ${
//                 card.trend === 'up' ? 'text-green-600' : 'text-red-600'
//               }`}>
//                 {card.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
//                 <span>{card.change}</span>
//               </div>
//             </div>
//             <div className="text-2xl font-bold text-gray-800 mb-1">{card.value}</div>
//             <div className="text-sm text-gray-500">{card.title}</div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Charts Grid - Changed bg-white to bg-gray-100 */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//         {/* Contributions Over Time */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.4 }}
//           className="bg-gray-100 rounded-lg shadow-lg p-6"
//         >
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Contributions Over Time</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <AreaChart data={stats?.timeline || []}>
//               <defs>
//                 <linearGradient id="colorContributions" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
//                   <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
//                 </linearGradient>
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis 
//                 dataKey="_id" 
//                 tickFormatter={(value) => {
//                   if (dateRange === 'week') return `Day ${value}`;
//                   if (dateRange === 'month') return `Week ${value}`;
//                   return `Month ${value}`;
//                 }}
//               />
//               <YAxis />
//               <Tooltip />
//               <Area
//                 type="monotone"
//                 dataKey="count"
//                 stroke="#0ea5e9"
//                 fillOpacity={1}
//                 fill="url(#colorContributions)"
//                 name="Contributions"
//               />
//               <Area
//                 type="monotone"
//                 dataKey="totalWeight"
//                 stroke="#10b981"
//                 fillOpacity={1}
//                 fill="url(#colorWeight)"
//                 name="Weight (kg)"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </motion.div>

//         {/* Status Breakdown */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.5 }}
//           className="bg-gray-100 rounded-lg shadow-lg p-6"
//         >
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Contribution Status</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={stats?.statusBreakdown || []}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={false}
//                 label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 outerRadius={100}
//                 fill="#8884d8"
//                 dataKey="count"
//                 nameKey="_id"
//               >
//                 {(stats?.statusBreakdown || []).map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </motion.div>

//         {/* Plastic Type Distribution */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.6 }}
//           className="bg-gray-100 rounded-lg shadow-lg p-6"
//         >
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Plastic Type Distribution</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={stats?.typeBreakdown || []}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="_id" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="totalWeight" fill="#0ea5e9" name="Weight (kg)" />
//               <Bar dataKey="count" fill="#10b981" name="Count" />
//             </BarChart>
//           </ResponsiveContainer>
//         </motion.div>

//         {/* Recent Activity */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.7 }}
//           className="bg-gray-100 rounded-lg shadow-lg p-6"
//         >
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
//           <div className="space-y-4">
//             {[1, 2, 3, 4, 5].map((_, index) => (
//               <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
//                     <FaRecycle className="text-gray-600 text-sm" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-800">New contribution submitted</p>
//                     <p className="text-xs text-gray-500">5kg PET • 2 minutes ago</p>
//                   </div>
//                 </div>
//                 <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
//                   Pending
//                 </span>
//               </div>
//             ))}
//           </div>
//         </motion.div>
//       </div>

//       {/* Top Contributors */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.8 }}
//         className="bg-gray-100 rounded-lg shadow-lg p-6"
//       >
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Contributors</h3>
//         <div className="overflow-x-auto">
//           <table className="min-w-full">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">User</th>
//                 <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Contributions</th>
//                 <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total Weight</th>
//                 <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Points</th>
//                 <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Last Active</th>
//                </tr>
//             </thead>
//             <tbody>
//               {stats?.userEngagement?.topContributors?.map((contributor, index) => (
//                 <tr key={index} className="border-b border-gray-200 hover:bg-gray-200">
//                   <td className="py-3 px-4">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
//                         <span className="text-white text-xs font-medium">
//                           {contributor.name?.split(' ').map(n => n[0]).join('')}
//                         </span>
//                       </div>
//                       <span className="font-medium text-gray-800">{contributor.name}</span>
//                     </div>
//                    </td>
//                   <td className="py-3 px-4 text-gray-600">{contributor.count || 0}</td>
//                   <td className="py-3 px-4 text-gray-600">{contributor.totalWeight?.toFixed(1)} kg</td>
//                   <td className="py-3 px-4">
//                     <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-sm">
//                       {contributor.totalPoints}
//                     </span>
//                   </td>
//                   <td className="py-3 px-4 text-gray-600">
//                     {format(subDays(new Date(), Math.floor(Math.random() * 5)), 'MMM dd, yyyy')}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </motion.div>
//     </AdminLayout>
//   );
// };

// export default AdminDashboard;









import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
// REMOVE THIS LINE: import AdminLayout from '../../components/admin/AdminLayout';
import {
  FaUsers,
  FaRecycle,
  FaTrophy,
  FaWeightHanging,
  FaArrowUp,
  FaArrowDown,
  FaDownload,
  FaCalendarAlt,
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [dateRange, setDateRange] = useState('week');

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      const response = await adminService.getDashboard();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      // REMOVE AdminLayout wrapper - just return the spinner
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const summaryCards = [
    {
      title: 'Total Users',
      value: stats?.total?.toLocaleString() || '0',
      change: '+12.5%',
      trend: 'up',
      icon: FaUsers,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Contributions',
      value: stats?.totalApproved?.toLocaleString() || '0',
      change: '+8.2%',
      trend: 'up',
      icon: FaRecycle,
      color: 'bg-green-500',
    },
    {
      title: 'Total Weight',
      value: `${(stats?.totalWeight / 1000)?.toFixed(1) || '0'}T`,
      change: '+15.3%',
      trend: 'up',
      icon: FaWeightHanging,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Points',
      value: stats?.totalPoints?.toLocaleString() || '0',
      change: '-2.1%',
      trend: 'down',
      icon: FaTrophy,
      color: 'bg-yellow-500',
    },
  ];

  return (
    // REMOVE AdminLayout wrapper - just return the content
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back, Administrator</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg shadow-sm p-1">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dateRange === range
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          <button className="flex items-center space-x-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition-colors">
            <FaDownload />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-100 rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <card.icon className="text-white text-xl" />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                card.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                <span>{card.change}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{card.value}</div>
            <div className="text-sm text-gray-500">{card.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Contributions Over Time */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-100 rounded-lg shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contributions Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats?.timeline || []}>
              <defs>
                <linearGradient id="colorContributions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="_id" 
                tickFormatter={(value) => {
                  if (dateRange === 'week') return `Day ${value}`;
                  if (dateRange === 'month') return `Week ${value}`;
                  return `Month ${value}`;
                }}
              />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#0ea5e9"
                fillOpacity={1}
                fill="url(#colorContributions)"
                name="Contributions"
              />
              <Area
                type="monotone"
                dataKey="totalWeight"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorWeight)"
                name="Weight (kg)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-100 rounded-lg shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contribution Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats?.statusBreakdown || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="_id"
              >
                {(stats?.statusBreakdown || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Plastic Type Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-100 rounded-lg shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Plastic Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.typeBreakdown || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalWeight" fill="#0ea5e9" name="Weight (kg)" />
              <Bar dataKey="count" fill="#10b981" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-100 rounded-lg shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <FaRecycle className="text-gray-600 text-sm" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">New contribution submitted</p>
                    <p className="text-xs text-gray-500">5kg PET • 2 minutes ago</p>
                  </div>
                </div>
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Contributors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-100 rounded-lg shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Contributors</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Contributions</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total Weight</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Points</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Last Active</th>
               </tr>
            </thead>
            <tbody>
              {stats?.userEngagement?.topContributors?.map((contributor, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-200">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {contributor.name?.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-gray-800">{contributor.name}</span>
                    </div>
                   </td>
                  <td className="py-3 px-4 text-gray-600">{contributor.count || 0}</td>
                  <td className="py-3 px-4 text-gray-600">{contributor.totalWeight?.toFixed(1)} kg</td>
                  <td className="py-3 px-4">
                    <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-sm">
                      {contributor.totalPoints}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {format(subDays(new Date(), Math.floor(Math.random() * 5)), 'MMM dd, yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
};

export default AdminDashboard;