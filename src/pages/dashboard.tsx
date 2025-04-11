import { FaChalkboardTeacher, FaUserGraduate, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { useState } from 'react';

const SchoolDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const stats = [
    { title: 'Total Students', value: '1,240', icon: <FaUserGraduate />, trend: '+12%' },
    { title: 'Total Teachers', value: '48', icon: <FaChalkboardTeacher />, trend: '+2' },
    { title: 'Attendance Rate', value: '94%', icon: <FaChartLine />, trend: '+3%' },
    { title: 'Upcoming Events', value: '5', icon: <FaCalendarAlt />, trend: '2 New' },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="p-8 space-y-8">
    
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div className={`p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900`}>
                  {stat.icon}
                </div>
                <span className="text-sm text-green-500 font-medium">{stat.trend}</span>
              </div>
              <h3 className="mt-4 text-gray-500 dark:text-gray-300 text-sm">{stat.title}</h3>
              <p className="text-2xl font-bold dark:text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold dark:text-white">Recent Activities</h3>
              <button className="text-indigo-500 text-sm font-medium">View All →</button>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <FaUserGraduate className="text-indigo-500" />
                  </div>
                  <div>
                    <p className="font-medium dark:text-white">New Student Enrollment</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Sarah Johnson joined Grade 10
                    </p>
                    <span className="text-xs text-gray-400 mt-2 block">45 mins ago</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Overview */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold mb-6 dark:text-white">Quick Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50 dark:bg-gray-700 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400">Pending Requests</p>
                <p className="text-2xl font-bold dark:text-white mt-1">14</p>
              </div>
              <div className="p-4 bg-indigo-50 dark:bg-gray-700 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400">Unread Messages</p>
                <p className="text-2xl font-bold dark:text-white mt-1">23</p>
              </div>
              <div className="p-4 bg-indigo-50 dark:bg-gray-700 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Classes</p>
                <p className="text-2xl font-bold dark:text-white mt-1">18</p>
              </div>
              <div className="p-4 bg-indigo-50 dark:bg-gray-700 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400">Staff Online</p>
                <p className="text-2xl font-bold dark:text-white mt-1">9</p>
              </div>
            </div>
          </div>
        </div>

          </div>
    </div>
  );
};

export default SchoolDashboard;