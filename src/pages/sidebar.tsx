// components/SidebarLayout.tsx
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineSetting,
  AiOutlineLock,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";

const SidebarLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { title: "Students", icon: <AiOutlineUser />, path: "/dashboard/ListStd" },
    { title: "Classes", icon: <AiOutlineMail />, path: "/dashboard/ClassList" },
    { title: "Registration", icon: <AiOutlineSetting />, path: "/dashboard/regstd" },
    { title: "Users", icon: <AiOutlineHome />, path: "/dashboard/user/list" },
    { title: "Profile", icon: <AiOutlineUser />, path: "/dashboard/userinfo" },
    { title: "Logout", icon: <AiOutlineLock />, path: "/logout" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white p-5 pt-8 duration-300 ${isOpen ? "w-64" : "w-20"}`}>
        <div className="flex justify-between items-center">
          <h1 className={`text-2xl font-bold duration-300 ${!isOpen && "hidden"}`}>
            Logo
          </h1>
          <button onClick={toggleSidebar} className="text-2xl">
            {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
        </div>

        <ul className="pt-6">
          {menuItems.map((item) => (
            <li key={item.path} className="mt-2">
              <Link
                to={item.path}
                className={`flex items-center gap-x-4 p-2 text-gray-300 hover:bg-gray-700 rounded-md ${
                  location.pathname === item.path ? "bg-gray-700" : ""
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className={`${!isOpen && "hidden"} origin-left duration-200`}>
                  {item.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-sm p-6 min-h-[calc(100vh-4rem)]">
          <Outlet /> {/* This will render the nested dashboard routes */}
        


        </div>

      </div>
    </div>
  );
};

export default SidebarLayout;
// // components/SidebarLayout.tsx
// import { useState } from "react";
// import { Link, Outlet, useLocation } from "react-router-dom";
// import {
//   AiOutlineHome,
//   AiOutlineUser,
//   AiOutlineMail,
//   AiOutlineSetting,
//   AiOutlineLock,
//   AiOutlineMenu,
//   AiOutlineClose,
//   AiOutlineTeam,
//   AiOutlineBook,
//   AiOutlinePlusCircle,
//   AiOutlineCalendar
// } from "react-icons/ai";

// const SidebarLayout = () => {
//   const [isOpen, setIsOpen] = useState(true);
//   const location = useLocation();

//   const toggleSidebar = () => setIsOpen(!isOpen);

//   const menuItems = [
//     { title: "Students", icon: <AiOutlineUser />, path: "/dashboard/ListStd" },
//     { title: "Classes", icon: <AiOutlineBook />, path: "/dashboard/ClassList" },
//     { title: "Registration", icon: <AiOutlinePlusCircle />, path: "/dashboard/regstd" },
//     { title: "Users", icon: <AiOutlineTeam />, path: "/dashboard/user/list" },
//     { title: "Profile", icon: <AiOutlineUser />, path: "/dashboard/userinfo" },
//     { title: "Logout", icon: <AiOutlineLock />, path: "/logout" },
//   ];

//   // Dummy data for dashboard cards
//   const dashboardCards = [
//     { title: "Total Students", value: "2,845", icon: <AiOutlineUser className="w-6 h-6" />, color: "bg-blue-100" },
//     { title: "Active Classes", value: "18", icon: <AiOutlineBook className="w-6 h-6" />, color: "bg-green-100" },
//     { title: "Staff Members", value: "45", icon: <AiOutlineTeam className="w-6 h-6" />, color: "bg-purple-100" },
//     { title: "Upcoming Events", value: "5", icon: <AiOutlineCalendar className="w-6 h-6" />, color: "bg-orange-100" },
//   ];

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className={`bg-gray-800 text-white p-5 pt-8 duration-300 ${isOpen ? "w-64" : "w-20"}`}>
//         <div className="flex justify-between items-center">
//           <h1 className={`text-2xl font-bold duration-300 ${!isOpen && "hidden"}`}>
//             EduManage
//           </h1>
//           <button onClick={toggleSidebar} className="text-2xl hover:bg-gray-700 p-1 rounded">
//             {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
//           </button>
//         </div>

//         <ul className="pt-6">
//           {menuItems.map((item) => (
//             <li key={item.path} className="mt-2">
//               <Link
//                 to={item.path}
//                 className={`flex items-center gap-x-4 p-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-all ${
//                   location.pathname === item.path ? "bg-gray-700" : ""
//                 }`}
//               >
//                 <span className="text-2xl">{item.icon}</span>
//                 <span className={`${!isOpen && "hidden"} origin-left duration-200 text-sm font-medium`}>
//                   {item.title}
//                 </span>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1 p-8">
//         <div className="bg-white rounded-xl shadow-lg p-6 min-h-[calc(100vh-4rem)]">
//           {/* Dashboard Header */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
//             <p className="text-gray-600 mt-2">Welcome back! Here's your daily summary</p>
//           </div>

//           {/* Quick Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             {dashboardCards.map((card, index) => (
//               <div key={index} className={`${card.color} p-6 rounded-xl transition-transform hover:scale-105`}>
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p className="text-gray-600 text-sm">{card.title}</p>
//                     <p className="text-2xl font-bold text-gray-800 mt-2">{card.value}</p>
//                   </div>
//                   <span className="text-gray-700 p-3 rounded-full bg-white/50">
//                     {card.icon}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Quick Actions */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//             <div className="bg-blue-50 p-6 rounded-xl">
//               <h2 className="text-xl font-semibold mb-4 text-blue-800">Quick Actions</h2>
//               <div className="flex flex-wrap gap-4">
//                 <button className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all">
//                   <AiOutlinePlusCircle className="w-5 h-5 mr-2 text-blue-600" />
//                   <span>Add New Student</span>
//                 </button>
//                 <button className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all">
//                   <AiOutlineBook className="w-5 h-5 mr-2 text-green-600" />
//                   <span>Create Class</span>
//                 </button>
//                 <button className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all">
//                   <AiOutlineTeam className="w-5 h-5 mr-2 text-purple-600" />
//                   <span>Manage Users</span>
//                 </button>
//               </div>
//             </div>

//             {/* Recent Activity */}
//             <div className="bg-white p-6 rounded-xl border border-gray-100">
//               <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
//               <div className="space-y-4">
//                 <div className="flex items-center p-3 bg-gray-50 rounded-lg">
//                   <AiOutlineUser className="w-5 h-5 mr-3 text-green-500" />
//                   <div>
//                     <p className="text-sm font-medium">New student registered</p>
//                     <p className="text-xs text-gray-500">2 hours ago</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center p-3 bg-gray-50 rounded-lg">
//                   <AiOutlineBook className="w-5 h-5 mr-3 text-blue-500" />
//                   <div>
//                     <p className="text-sm font-medium">Math 101 class updated</p>
//                     <p className="text-xs text-gray-500">5 hours ago</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="border-t border-gray-100 pt-6">
//             <Outlet />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SidebarLayout;