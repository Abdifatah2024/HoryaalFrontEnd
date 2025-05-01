import { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
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
  AiOutlineDelete,
  AiOutlineSearch,
} from "react-icons/ai";

const SidebarLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState<boolean[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 1024);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && window.innerWidth < 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  type MenuItem = {
    title: string;
    icon: JSX.Element;
    path?: string;
    subItems?: MenuItem[];
  };

  const menuItems: MenuItem[] = [
    { 
      title: "DASHBOARD",
      icon: <AiOutlineDashboard className="text-lg" />,
      path: "/dashboard"
    },
    { 
      title: "STUDENTS",
      icon: <AiOutlineUser className="text-lg" />,
      subItems: [
        { title: "Register And Edit Student", icon: <AiOutlineSetting />, path: "/dashboard/regstd" },
        { title: "Register Multiple Students", icon: <AiOutlineSetting />, path: "/dashboard/RegisterMulti" },           
        { title: "upload Excel To Register Multiple", icon: <AiOutlineSetting />, path: "/dashboard/UploadStudents" },           
        { title: "Student List", icon: <AiOutlineUser />, path: "/dashboard/ListStd" },
        { title: "Get One Student", icon: <AiOutlineSearch />, path: "/dashboard/GetOneStudent" },
        { title: "Update Student Class", icon: <AiOutlineUser />, path: "/dashboard/UpdateClass" },
        { title: "Delete Student", icon: <AiOutlineDelete />, path: "/dashboard/DeleteStd" }
      ]
    },
    { 
      title: "CLASSES",
      icon: <AiOutlineMail className="text-lg" />,
      subItems: [
        { title: "Class List per Student", icon: <AiOutlineMail />, path: "/dashboard/ClassListStd" },
        { title: "Create Class", icon: <AiOutlineMail />, path: "/dashboard/CeateClass" }
      ]
    },
    { 
      title: "Exam",
      icon: <AiOutlineMail className="text-lg" />,
      subItems: [
        { title: "Regiter Ten Subject", icon: <AiOutlineMail />, path: "/dashboard/RegisterTenSubjects" },
        { title: "Regiter Exam  per subject", icon: <AiOutlineMail />, path: "/dashboard/ExamRoute" },
        { title: "Get Student Result", icon: <AiOutlineMail />, path: "/dashboard/getExam" },
        { title: "Midterm Report", icon: <AiOutlineMail />, path: "/dashboard/GetReportMidterm" },
        { title: "Final Exam Report", icon: <AiOutlineMail />, path: "/dashboard/FinalReport" },
        
      ]
    },
    
    { 
      title: "ATTENDANCE",
      icon: <AiOutlineSetting className="text-lg" />,
      subItems: [
        { 
          title: "Record Attendence by Class List",
          icon: <AiOutlineUser />, 
          path: "/dashboard/AttendceList" 
        },
        { 
          title: "View Records", 
          icon: <AiOutlineSearch />, 
          path: "/dashboard/Attedence" 
        },
        { 
          title: "Dalete & Update", 
          icon: <AiOutlineSearch />, 
          path: "/dashboard/DeleteAttendace" 
        },
        { 
          title: " Five Top Absent Students", 
          icon: <AiOutlineSearch />, 
          path: "/dashboard/GetTobAbsent" 
        }
      ]
    },
    { 
      title: "Decipline",
      icon: <AiOutlineUser className="text-lg" />,
      subItems: [
        { title: "Register, List and Edit", icon: <AiOutlineSetting />, path: "/dashboard/Decipline" },
        { title: "Get One Student", icon: <AiOutlineSetting />, path: "/dashboard/GetOneStudentDecipline" },
       
      ]
    },
    { 
      title: "USERS",
      icon: <AiOutlineHome className="text-lg" />,
      subItems: [
        { title: "Create User", icon: <AiOutlineHome />, path: "register" },
        { title: "User List", icon: <AiOutlineHome />, path: "/dashboard/user/list" }
      ]
    },
    { 
      title: "PROFILE",
      icon: <AiOutlineUser className="text-lg" />,
      path: "/dashboard/userinfo"
    },
  ];

  const bottomMenuItems: MenuItem[] = [
    { 
      title: "LOGOUT",
      icon: <AiOutlineLock className="text-lg" />,
      path: "logout"
    }
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
  const isChildActive = (subItems?: MenuItem[]) => subItems?.some(subItem => isActive(subItem.path));

  return (
    <div className="flex min-h-screen bg-violet-50">
      {/* Sidebar - Maintaining original gradient */}
      <div 
        ref={sidebarRef}
        className={`bg-gradient-to-b from-violet-900 to-indigo-900 text-slate-100 p-5 pt-8 duration-300 
          ${isOpen ? "w-64" : "w-20"} fixed h-full shadow-2xl z-50 transition-all`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-end items-center mb-8">
          <button 
            onClick={toggleSidebar} 
            className="text-xl p-2 hover:bg-violet-800/20 rounded-lg transition-all"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col h-[calc(100%-180px)]">
          <ul className="space-y-1 flex-1 overflow-y-auto">
            {menuItems.map((item, index) => (
              <li key={item.title}>
                {item.subItems ? (
                  <div className="relative">
                    <div
                      onClick={() => toggleDropdown(index)}
                      onMouseEnter={() => !isOpen && setHoveredItem(item.title)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`flex items-center justify-between p-3 text-slate-200 hover:bg-violet-800/40 rounded-xl
                        transition-all text-sm font-medium ${isActive(item.path) || isChildActive(item.subItems) ? 
                        "bg-violet-600/90 text-white" : ""}`}
                    >
                      <div className="flex items-center gap-3">
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

                    {/* Hover Tooltip */}
                    {!isOpen && hoveredItem === item.title && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-violet-800 text-white text-sm rounded-lg shadow-lg z-50">
                        {item.title}
                      </div>
                    )}

                    {/* Submenu */}
                    {isOpen && openDropdowns[index] && (
                      <ul className="ml-6 mt-1 space-y-1 border-l-2 border-violet-500/30 pl-3">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.title}>
                            <Link
                              to={subItem.path || "#"}
                              className={`flex items-center gap-3 p-2 text-slate-300 hover:bg-violet-700/30 rounded-lg
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
                  <div 
                    className="relative"
                    onMouseEnter={() => !isOpen && setHoveredItem(item.title)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Link
                      to={item.path || "#"}
                      className={`flex items-center gap-3 p-3 text-slate-200 hover:bg-violet-800/40 rounded-xl
                        transition-all text-sm font-medium ${isActive(item.path) ? "bg-violet-600/90 text-white" : ""}`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className={`${!isOpen && "hidden"} origin-left duration-200 uppercase tracking-wide`}>
                        {item.title}
                      </span>
                    </Link>

                    {!isOpen && hoveredItem === item.title && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-violet-800 text-white text-sm rounded-lg shadow-lg z-50">
                        {item.title}
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Bottom Menu */}
          <ul className="space-y-1 border-t border-violet-700/30 pt-2">
            {bottomMenuItems.map((item) => (
              <li key={item.title}>
                <div 
                  className="relative"
                  onMouseEnter={() => !isOpen && setHoveredItem(item.title)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    to={item.path || "#"}
                    className={`flex items-center gap-3 p-3 text-slate-200 hover:bg-violet-800/40 rounded-xl
                      transition-all text-sm font-medium ${isActive(item.path) ? "bg-violet-600/90 text-white" : ""}`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className={`${!isOpen && "hidden"} origin-left duration-200 uppercase tracking-wide`}>
                      {item.title}
                    </span>
                  </Link>

                  {!isOpen && hoveredItem === item.title && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-violet-800 text-white text-sm rounded-lg shadow-lg z-50">
                      {item.title}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all ${isOpen ? "ml-64" : "ml-20"}`}>
        <main className="p-6">
          <div className="bg-white rounded-2xl shadow-sm border border-violet-100 p-6">
                  <Outlet />
                    </div>
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;

