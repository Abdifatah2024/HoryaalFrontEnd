import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineSetting,
  AiOutlineLock,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineDashboard,
  AiOutlineDown,
  AiOutlineUp,
} from "react-icons/ai";
import SchoolDashboard from "./dashboard";

const SidebarLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState<boolean[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  type MenuItem = {
    title: string;
    icon: JSX.Element;
    path?: string;
    subItems?: MenuItem[];
  };

  const menuItems: MenuItem[] = [
    { 
      title: "DASHBOARD",
      icon: <AiOutlineDashboard className="text-xl" />,
      path: "/dashboard"
    },
    { 
      title: "STUDENTS",
      icon: <AiOutlineUser className="text-xl" />,
      subItems: [
        { title: "Registration", icon: <AiOutlineSetting />, path: "/dashboard/regstd" },
        { title: "Student List", icon: <AiOutlineUser />, path: "/dashboard/ListStd" },
        { title: "Get One Student", icon: <AiOutlineUser />, path: "/dashboard/GetOneStudent" }
      ]
    },
    { 
      title: "CLASSES",
      icon: <AiOutlineMail className="text-xl" />,
      subItems: [
        { title: "Class List", icon: <AiOutlineMail />, path: "/dashboard/ClassList" },
        { title: "Create Class", icon: <AiOutlineMail />, path: "/dashboard/CeateClass" }
      ]
    },
    { 
      title: "USERS",
      icon: <AiOutlineHome className="text-xl" />,
      subItems: [
        { title: "Create User", icon: <AiOutlineHome />, path: "register" },
        { title: "User List", icon: <AiOutlineHome />, path: "/dashboard/user/list" }
      ]
    },
    { 
      title: "PROFILE",
      icon: <AiOutlineUser className="text-xl" />,
      path: "/dashboard/userinfo"
    },
    { 
      title: "LOGOUT",
      icon: <AiOutlineLock className="text-xl" />,
      path: "logout"
    },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleDropdown = (index: number) => {
    setOpenDropdowns(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const isActive = (path?: string) => path && location.pathname === path;

  return (
    <div className="flex min-h-screen bg-violet-50">
      {/* Modern Sidebar */}
      <div className={`bg-gradient-to-b from-violet-900 to-indigo-900 text-slate-100 p-5 pt-8 duration-300 
        ${isOpen ? "w-64" : "w-20"} fixed h-full shadow-2xl z-50`}>
        
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-2xl font-bold tracking-tight duration-300 ${!isOpen && "hidden"}`}>
            <span className="bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
              Irshad
            </span>
          </h1>
          <button 
            onClick={toggleSidebar} 
            className="text-2xl p-2 hover:bg-violet-800/20 rounded-lg transition-all hover:scale-105"
          >
            {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
        </div>

        <nav className="pt-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={item.title}>
                {item.subItems ? (
                  <div className="cursor-pointer">
                    <div
                      onClick={() => toggleDropdown(index)}
                      className={`flex items-center justify-between p-3 text-slate-200 hover:bg-violet-800/40 rounded-xl
                        transition-all text-sm font-medium ${isActive(item.path) ? "bg-violet-600/90 text-white" : ""}`}
                    >
                      <div className="flex items-center gap-x-3">
                        <span className="text-lg">{item.icon}</span>
                        <span className={`${!isOpen && "hidden"} origin-left duration-200 uppercase tracking-wide`}>
                          {item.title}
                        </span>
                      </div>
                      {isOpen && (
                        <span className="text-sm">
                          {openDropdowns[index] ? <AiOutlineUp /> : <AiOutlineDown />}
                        </span>
                      )}
                    </div>

                    {isOpen && openDropdowns[index] && (
                      <ul className="ml-6 mt-1 space-y-1 border-l-2 border-violet-500/30 pl-3">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.title}>
                            <Link
                              to={subItem.path || "#"}
                              className={`flex items-center gap-x-3 p-2 text-slate-300 hover:bg-violet-700/30 rounded-lg
                                transition-all text-sm ${isActive(subItem.path) ? "text-white bg-violet-600/20" : ""}`}
                            >
                              <span className="text-lg">{subItem.icon}</span>
                              <span className="origin-left duration-200 normal-case">
                                {subItem.title}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path || "#"}
                    className={`flex items-center gap-x-3 p-3 text-slate-200 hover:bg-violet-800/40 rounded-xl
                      transition-all text-sm font-medium ${isActive(item.path) ? "bg-violet-600/90 text-white" : ""}`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className={`${!isOpen && "hidden"} origin-left duration-200 uppercase tracking-wide`}>
                      {item.title}
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 p-8 transition-all ${isOpen ? "ml-64" : "ml-20"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-violet-100 p-8">
            <Outlet />
            <SchoolDashboard/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;