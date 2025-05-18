// import React from "react";
// import { 
//   FaUsers, 
//   FaClipboardCheck, 
//   FaChartLine, 
//   FaBook, 
//   FaUserTie, 
//   FaBell,
//   FaCalendarAlt,
//   FaFileAlt
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const DashboardHome = () => {
//   const navigate = useNavigate();
  
//   const stats = [
//     { title: "Total Students", value: "1,245", icon: <FaUsers className="text-blue-500" />, color: "blue" },
//     { title: "Today's Attendance", value: "89%", icon: <FaClipboardCheck className="text-green-500" />, color: "green" },
//     { title: "Exam Performance", value: "78%", icon: <FaChartLine className="text-purple-500" />, color: "purple" },
//     { title: "Staff Members", value: "85", icon: <FaUserTie className="text-orange-500" />, color: "orange" }
//   ];

//   const quickActions = [
//     { 
//       title: "Take Attendance", 
//       icon: <FaClipboardCheck className="text-white" />, 
//       bgColor: "bg-blue-600 hover:bg-blue-700",
//       action: () => navigate("/dashboard/MarkAtetendenceClass")
//     },
//     { 
//       title: "Register Exam", 
//       icon: <FaFileAlt className="text-white" />, 
//       bgColor: "bg-green-600 hover:bg-green-700",
//       action: () => navigate("/dashboard/ExamRoute")
//     },
//     { 
//       title: "Add Student", 
//       icon: <FaUsers className="text-white" />, 
//       bgColor: "bg-purple-600 hover:bg-purple-700",
//       action: () => navigate("/dashboard/regstd")
//     },
//     { 
//       title: "View Calendar", 
//       icon: <FaCalendarAlt className="text-white" />, 
//       bgColor: "bg-orange-600 hover:bg-orange-700",
//       action: () => navigate("/dashboard/academic-calendar")
//     }
//   ];

//   const announcements = [
//     { 
//       title: "Midterm Exams", 
//       date: "May 15-20, 2023", 
//       icon: <FaBell className="text-yellow-500" />,
//       description: "Midterm examinations will begin next week for all classes."
//     },
//     { 
//       title: "Parent-Teacher Meeting", 
//       date: "June 5, 2023", 
//       icon: <FaUserTie className="text-blue-500" />,
//       description: "Schedule for parent-teacher meetings has been published."
//     },
//     { 
//       title: "New Curriculum", 
//       date: "Starting September", 
//       icon: <FaBook className="text-green-500" />,
//       description: "The school will implement the new national curriculum."
//     }
//   ];

//   return (
//     <div className="space-y-8">
//       {/* Welcome Header */}
//       <div className="bg-white p-6 rounded-xl shadow-sm">
//         <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
//           Welcome to Greenwood High School Management System
//         </h2>
//         <p className="text-gray-600 mt-2">
//           This dashboard gives you access to all school modules: student records, attendance tracking, 
//           exam performance, employee management, and more.
//         </p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, index) => (
//           <div 
//             key={index} 
//             className={`bg-white p-6 rounded-xl shadow-sm border-l-4 border-${stat.color}-500`}
//           >
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">{stat.title}</p>
//                 <p className="text-2xl font-bold mt-1 text-gray-800">{stat.value}</p>
//               </div>
//               <div className="p-3 rounded-lg bg-gray-100">
//                 {stat.icon}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Quick Actions */}
//       <div className="bg-white p-6 rounded-xl shadow-sm">
//         <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {quickActions.map((action, index) => (
//             <button
//               key={index}
//               onClick={action.action}
//               className={`${action.bgColor} p-4 rounded-lg text-white flex items-center justify-center space-x-2 transition-colors`}
//             >
//               {action.icon}
//               <span>{action.title}</span>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Main Features */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Features */}
//         <div className="bg-white p-6 rounded-xl shadow-sm">
//           <h3 className="text-xl font-semibold text-gray-800 mb-4">System Features</h3>
//           <div className="space-y-4">
//             <div className="flex items-start space-x-4">
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <FaUsers className="text-blue-600" />
//               </div>
//               <div>
//                 <h4 className="font-medium text-gray-800">Student Management</h4>
//                 <p className="text-sm text-gray-600">
//                   Register, view, and manage student details across all grades and classes.
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-start space-x-4">
//               <div className="p-2 bg-green-100 rounded-lg">
//                 <FaClipboardCheck className="text-green-600" />
//               </div>
//               <div>
//                 <h4 className="font-medium text-gray-800">Attendance Tracking</h4>
//                 <p className="text-sm text-gray-600">
//                   Daily attendance recording with analytics and reporting tools.
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-start space-x-4">
//               <div className="p-2 bg-purple-100 rounded-lg">
//                 <FaChartLine className="text-purple-600" />
//               </div>
//               <div>
//                 <h4 className="font-medium text-gray-800">Exam Management</h4>
//                 <p className="text-sm text-gray-600">
//                   Register exams, record results, and generate performance reports.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Announcements */}
//         <div className="bg-white p-6 rounded-xl shadow-sm">
//           <h3 className="text-xl font-semibold text-gray-800 mb-4">Announcements</h3>
//           <div className="space-y-4">
//             {announcements.map((announcement, index) => (
//               <div key={index} className="border-l-4 border-blue-200 pl-4">
//                 <div className="flex items-center space-x-3">
//                   {announcement.icon}
//                   <div>
//                     <h4 className="font-medium text-gray-800">{announcement.title}</h4>
//                     <p className="text-xs text-gray-500">{announcement.date}</p>
//                   </div>
//                 </div>
//                 <p className="text-sm text-gray-600 mt-2 ml-8">{announcement.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardHome;
// Dashboard.tsx
import React from 'react';
import { 
  FiUsers, FiCalendar, FiBook, FiBarChart2, 
  FiBell, FiMail, FiClock, FiPieChart 
} from 'react-icons/fi';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const stats = [
    { title: "Total Students", value: "1,245", change: "+12%", icon: <FiUsers className="text-blue-600" size={24} />, color: "blue" },
    { title: "Attendance Today", value: "89%", change: "+2%", icon: <FiCalendar className="text-green-600" size={24} />, color: "green" },
    { title: "Exams Completed", value: "24", change: "+5", icon: <FiBook className="text-purple-600" size={24} />, color: "purple" },
    { title: "Staff Members", value: "85", change: "+3", icon: <HiOutlineAcademicCap className="text-orange-600" size={24} />, color: "orange" }
  ];

  const quickActions = [
    { 
      title: "Take Attendance", 
      icon: <FiCalendar className="text-white" size={18} />, 
      bgColor: "bg-blue-600 hover:bg-blue-700",
      action: () => navigate("/dashboard/MarkAtetendenceClass")
    },
    { 
      title: "Register Exam", 
      icon: <FiBook className="text-white" size={18} />, 
      bgColor: "bg-green-600 hover:bg-green-700",
      action: () => navigate("/dashboard/ExamRoute")
    },
    { 
      title: "Add Student", 
      icon: <FiUsers className="text-white" size={18} />, 
      bgColor: "bg-purple-600 hover:bg-purple-700",
      action: () => navigate("/dashboard/regstd")
    },
    { 
      title: "View Reports", 
      icon: <FiBarChart2 className="text-white" size={18} />, 
      bgColor: "bg-orange-600 hover:bg-orange-700",
      action: () => navigate("/dashboard/ExamPerformance")
    }
  ];

  const announcements = [
    { 
      title: "Midterm Exams", 
      date: "May 15-20, 2023", 
      icon: <FiBell className="text-yellow-500" />,
      description: "Midterm examinations will begin next week for all classes."
    },
    { 
      title: "Parent-Teacher Meeting", 
      date: "June 5, 2023", 
      icon: <FiUsers className="text-blue-500" />,
      description: "Schedule for parent-teacher meetings has been published."
    },
    { 
      title: "New Curriculum", 
      date: "Starting September", 
      icon: <FiBook className="text-green-500" />,
      description: "The school will implement the new national curriculum."
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
            <FiBell size={20} />
          </button>
          <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
            <FiMail size={20} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1 text-gray-800">{stat.value}</p>
                <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`${action.bgColor} p-4 rounded-lg text-white flex items-center justify-center space-x-2 transition-colors`}
            >
              {action.icon}
              <span>{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <FiClock className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">New student registration</h4>
                  <p className="text-sm text-gray-600">John Doe was added to Class 10A</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Announcements</h3>
          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <div key={index} className="border-l-2 border-blue-200 pl-4 py-2">
                <div className="flex items-center space-x-3">
                  {announcement.icon}
                  <div>
                    <h4 className="font-medium text-gray-800">{announcement.title}</h4>
                    <p className="text-xs text-gray-500">{announcement.date}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2 ml-8">{announcement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Overview</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            <FiPieChart size={48} className="mx-auto mb-2" />
            <p>Performance charts will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;