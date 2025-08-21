import { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { jwtDecode } from "jwt-decode";
import { Role } from "../types/Login";

import {
  AiOutlineDashboard,
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlineDown,
  AiOutlineUp,
  AiOutlineDelete,
  AiOutlineSearch,
  AiOutlineFileText,
  AiOutlineBarChart,
  AiOutlineCalendar,
  AiOutlineTeam,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineSafety,
  AiOutlineMail,
} from "react-icons/ai";

interface JwtPayload {
  role: string;
}

type MenuItem = {
  title: string;
    path?: string;
  subItems?: MenuItem[];
   icon: React.ReactNode; // ✅ Correct type for JSX elements
};

const SidebarLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState<boolean[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const accessToken = useSelector((state: RootState) => state.loginSlice.data.Access_token);

  let roleEnumValue: Role | null = null;
  try {
    const decoded = jwtDecode<JwtPayload>(accessToken);
    if (Object.values(Role).includes(decoded.role as Role)) {
      roleEnumValue = decoded.role as Role;
    }
  } catch {
    roleEnumValue = null;
  }

  const isAdmin = roleEnumValue === Role.ADMIN;
  const isTeacher = roleEnumValue === Role.Teacher;
  const isUser = roleEnumValue === Role.USER;
  const isAcademy = roleEnumValue === Role.ACADEMY;
  const isAttendance = roleEnumValue === Role.ATTENDANCE
  


  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth >= 1024);
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth < 1024
      ) {
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

  const buildMenuItems = (): MenuItem[] => {
    const items: MenuItem[] = [
      {
        title: "Dashboard",
        icon: <AiOutlineDashboard className="text-lg" />,
        path: "/dashboard",
      },
    ];

    if (isAdmin || isTeacher || isUser) {
  const rulesSubItems: MenuItem[] = [
    ...(isAdmin
      ? [{ title: "Upload And Delete Files", icon: <AiOutlineSetting />, path: "/dashboard/UploadPdf" },
         { title: "Announcementst", icon: <AiOutlineSearch />, path: "/dashboard/Announcements" },
         { title: "Announcement List", icon: <AiOutlineSearch />, path: "/dashboard/AnnouncementsList" },
            { title: "Work Plan", icon: <AiOutlineSetting />, path: "/dashboard/WorkPlan" },
    { title: "Work Plan And Comment", icon: <AiOutlineSetting />, path: "/dashboard/WorkPlanAndComment" },
      ]
      : []),
    { title: "Rules", icon: <AiOutlineSetting />, path: "/dashboard/Rules" },
      { title: "Upload Scheme", icon: <AiOutlineUser />, path: "/dashboard/UploadScheme" },
 
  ];

  items.push({
    title: "Rules And Announcements",
    icon: <AiOutlineUser className="text-lg" />,
    subItems: rulesSubItems,
  });
}
    
    if (isAdmin || isTeacher || isUser||isAcademy) {
      items.push({
        title: "Students",
        icon: <AiOutlineUser className="text-lg" />,
        subItems: [
        
          ...(isAcademy
                       

            ? [
                { title: "Student List", icon: <AiOutlineUser />, path: "/dashboard/ListStd" },
                  
                   
             
                { title: "Get One Student", icon: <AiOutlineSearch />, path: "/dashboard/GetOneStudent" },
                 { title: "Check Transfer", icon: <AiOutlineSetting />, path: "/dashboard/CheckTransfer" },
                             ]                     

            : [
                { title: "Register Student", icon: <AiOutlineSetting />, path: "/dashboard/regstd" },
                { title: "New Students", icon: <AiOutlineSetting />, path: "/dashboard/Newstudent" },
                  { title: "Student Search", icon: <AiOutlineSearch />, path: "/dashboard/GetOneStudent" },
                { title: "Check Transfer", icon: <AiOutlineSetting />, path: "/dashboard/CheckTransfer" },
                { title: "Register Multiple", icon: <AiOutlineSetting />, path: "/dashboard/RegisterMulti" },
                { title: "Upload Excel", icon: <AiOutlineSetting />, path: "/dashboard/UploadStudents" },
                { title: "All Students", icon: <AiOutlineUser />, path: "/dashboard/ListStd" },
              
                { title: "Update Parent User", icon: <AiOutlineSearch />, path: "/dashboard/UpdateStudentParent" },
                   { title: "Dropout Students", icon: <AiOutlineUser />, path: "/dashboard/DropOut" },
                         { title: "Update Class", icon: <AiOutlineUser />, path: "/dashboard/UpdateClass" },

                ...(isAdmin
                  ? [
                 
                      { title: "Restored Students", icon: <AiOutlineUser />, path: "/dashboard/Restored" },
                      { title: "Delete Student", icon: <AiOutlineDelete />, path: "/dashboard/DeleteStd" },
                    ]
                  : []),
              ]),
        ],
      });
    }
     if (isAdmin ||isUser) {
      items.push({
        title: "Student Fee",
        icon: <AiOutlineTeam className="text-lg" />,
        subItems: [
              { title: "Family Payment", icon: <AiOutlineTeam />, path: "/dashboard/FamilyPaypayment" },
    { title: "Paid and Histiry", icon: <AiOutlineTeam />, path: "/dashboard/PaidFee" },
    { title: "Unpaid-family-summary", icon: <AiOutlineTeam />, path: "/dashboard/UnpaidFamilySummary" },
    { title: "Unpaid Family Report", icon: <AiOutlineTeam />, path: "/dashboard/UnpaidFamily" },

    { title: "Free Students", icon: <AiOutlineTeam />, path: "/dashboard/free" },
    { title: "Last Payment Voucher", icon: <AiOutlineTeam />, path: "/dashboard/LastPayment" },
    { title: "Voucher Management", icon: <AiOutlineTeam />, path: "/dashboard/VoucherList" },
          { title: "Student With Balance", icon: <AiOutlineTeam />, path: "/dashboard/BalancePerMonth" },
          { title: "Update Payment", icon: <AiOutlineTeam />, path: "/dashboard/UpdatedPayment" },
    { title: "Discount List", icon: <AiOutlineTeam />, path: "/dashboard/DiscountList" },
        ]
      });
    }
  
    if (isAdmin ||isAcademy) {
      items.push({
        title: "Classes",
        icon: <AiOutlineTeam className="text-lg" />,
        subItems: [
          { title: "Class List", icon: <AiOutlineTeam />, path: "/dashboard/GetStudentInclass" },
          ...(isAdmin ? [{ title: "Create Class", icon: <AiOutlineTeam />, path: "/dashboard/CeateClass" }] : []),
        ],
      });
    }

    if (isAdmin ||isAcademy) {
  items.push({
    title: "Reports",
    icon: <AiOutlineBarChart className="text-lg" />,
    subItems: [
      { title: "Reg Student List Exam", icon: <AiOutlineFileText />, path: "/dashboard/RegiterExam" },
      { title: "View Results", icon: <AiOutlineFileText />, path: "/dashboard/getExam" },
      { title: "Midterm Report", icon: <AiOutlineBarChart />, path: "/dashboard/GetReportMidterm" },
      { title: "Final Report", icon: <AiOutlineBarChart />, path: "/dashboard/FinalReport" },
      { title: "Yearly Progress", icon: <AiOutlineBarChart />, path: "/dashboard/FinalStudent" },
          { title: "Attendance Reports By Date", icon: <AiOutlineCalendar />, path: "/dashboard/AbsentByDate" },
      { title: "Disciplinary Reports", icon: <AiOutlineUser />, path: "/dashboard/DisciplinaryReports" },
      { title: "Exam Performance", icon: <AiOutlineFileText />, path: "/dashboard/ExamPerformance" },
          { title: "Search Usuer", icon: <AiOutlineSearch />, path: "/dashboard/CustomReports" },
    ],
  });
}


     if (isAdmin || isUser) {
  const subItems = [


    { title: "Advance", icon: <AiOutlineTeam />, path: "/dashboard/EmolpoyeeAdvacne" },
    { title: "Advance Remainder", icon: <AiOutlineTeam />, path: "/dashboard/EmployeeAvanceRemainder" },
    { title: "All Advance Remainder", icon: <AiOutlineTeam />, path: "/dashboard/AllEmployeeAdvance" },
    { title: "Advance Management", icon: <AiOutlineTeam />, path: "/dashboard/AdvanceDetail" },
    { title: "Expenses", icon: <AiOutlineTeam />, path: "/dashboard/ExpensesManagement" },
    { title: "Financial Report", icon: <AiOutlineTeam />, path: "/dashboard/FinancialReport" },
    { title: "Expenses Summary", icon: <AiOutlineTeam />, path: "/dashboard/ExpensesSummary" },
    { title: "Student With Balance", icon: <AiOutlineTeam />, path: "/dashboard/StudentWithBalance" },
    
    { title: "Casheir Collection", icon: <AiOutlineTeam />, path: "/dashboard/UserCollection" },
  ];

  // ✅ Admin-only menu item
  if (isAdmin) {
    subItems.push({
      title: "Discount Management",
      icon: <AiOutlineTeam />,
      path: "/dashboard/DiscountManagement",
    });
  }

  items.push({
    title: "Payments",
    icon: <AiOutlineTeam className="text-lg" />,
    subItems,
  });
}



if (isAdmin || isAcademy || isUser) {
  const employeeSubItems = [
    { title: "Attendence", icon: <AiOutlineTeam />, path: "/dashboard/EmployeeAttendance" },
    { title: "Attendence Report By Month", icon: <AiOutlineTeam />, path: "/dashboard/EmployeAttReport" },
     { title: "Employee List", icon: <AiOutlineTeam />, path: "/dashboard/AllEmployeesList" },
       { title: "Teacher Exam Management", icon: <AiOutlineTeam />, path: "/dashboard/TeacherManagement" }
  ];

  // 🔒 Only ADMIN can see these
  if (isAdmin) {
    employeeSubItems.push(
      { title: "Create Employee", icon: <AiOutlineTeam />, path: "/dashboard/CreateEmployee" },
      { title: "Register Teacher", icon: <AiOutlineTeam />, path: "/dashboard/RegisterTeacher" },
      { title: "Employee List", icon: <AiOutlineTeam />, path: "/dashboard/AllEmployeesList" },
      { title: "Pay Salary", icon: <AiOutlineTeam />, path: "/dashboard/PayRemainSalary" },
    
    );
  }

  items.push({
    title: "Employee",
    icon: <AiOutlineTeam className="text-lg" />,
    subItems: employeeSubItems,
  });
}
    if (isTeacher) {
      items.push({
        title: "Exams",
        icon: <AiOutlineFileText className="text-lg" />,
        subItems: [
          { title: "Reg Student For Teacher Only", icon: <AiOutlineFileText />, path: "/dashboard/RegiterExamForTeacher" },
          { title: "Update Result", icon: <AiOutlineFileText />, path: "/dashboard/updateScore" },
        ],
      });
    }

    if (isAdmin) {
      items.push({
        title: "Exams",
        icon: <AiOutlineFileText className="text-lg" />,
        subItems: [
          { title: "Register Subjects", icon: <AiOutlineMail />, path: "/dashboard/RegiterExam" },
          { title: "Register Ten Subjects", icon: <AiOutlineMail />, path: "/dashboard/RegisterTenSubjects" },
          { title: "Register Exam per Subject", icon: <AiOutlineMail />, path: "/dashboard/ExamRoute" },
          { title: "Get Student Result", icon: <AiOutlineMail />, path: "/dashboard/getExam" },
          { title: "Midterm Report", icon: <AiOutlineMail />, path: "/dashboard/GetReportMidterm" },
          { title: "Final Exam Report", icon: <AiOutlineMail />, path: "/dashboard/FinalReport" },
        ],
      });
    }

    if (isAdmin || isUser||isAcademy||isAttendance) {
      items.push({
        title: "Attendance",
        icon: <AiOutlineCalendar className="text-lg" />,
        subItems: [
          { title: "Attendance Per Class", icon: <AiOutlineUser />, path: "/dashboard/MarkAtetendenceClass" },
          { title: "View Records", icon: <AiOutlineSearch />, path: "/dashboard/Attedence" },
           { title: "Today Absent", icon: <AiOutlineSearch />, path: "/dashboard/TodayAbsent" },
                { title: "Parent Absent Call", icon: <AiOutlineSearch />, path: "/dashboard/AbsentReport" },
                { title: "Class Attendance Summary", icon: <AiOutlineSearch />, path: "/dashboard/MonthAttendceReport" },
                { title: "Class Attendance All Months", icon: <AiOutlineSearch />, path: "/dashboard/ClassAttendenceReport" },
                { title: "Delete & Update", icon: <AiOutlineSearch />, path: "/dashboard/DeleteAttendace" },
                { title: "Top Absentees", icon: <AiOutlineSearch />, path: "/dashboard/GetTobAbsent" },
          ...(isAdmin
            ? [
               
              ]
            : []),
        ],
      });
    }

    if (isAdmin || isUser||isAcademy) {
      items.push({
        title: "Discipline",
        icon: <AiOutlineUser className="text-lg" />,
        subItems: [
          { title: "Manage Discipline", icon: <AiOutlineSetting />, path: "/dashboard/Decipline" },
          { title: "Get One Student", icon: <AiOutlineSetting />, path: "/dashboard/GetOneStudentDecipline" },
        ],
      });
    }
       if (isAdmin || isUser||isAcademy) {
      items.push({
        title: "School Bus Reports",
        icon: <AiOutlineUser className="text-lg" />,
        subItems: [
          { title: "Student With Bus zero Payment", icon: <AiOutlineSetting />, path: "/dashboard/busfeeWithNoPayment" },
            { title: "Student With Same Bus", icon: <AiOutlineSearch />, path: "/dashboard/StudentWithSameBus" },
            { title: "Student With Bus", icon: <AiOutlineSearch />, path: "/dashboard/StudentBusses" },
            { title: "Bus income Summary", icon: <AiOutlineSearch />, path: "/dashboard/BusIncomeSummary" },
            { title: "Bus Management", icon: <AiOutlineSearch />, path: "/dashboard/BusCrud" },
            { title: "Assign Student Bus", icon: <AiOutlineSearch />, path: "/dashboard/AssignStudentBus" },
        ],
      });
    }
      if (isAdmin || isUser) {
      items.push({
        title: "Asset Manager",
        icon: <AiOutlineUser className="text-lg" />,
        subItems: [
          { title: "Asset Manager", icon: <AiOutlineSetting />, path: "/dashboard/AssetManager" },
          { title: "Asset Summary Report", icon: <AiOutlineSetting />, path: "/dashboard/AssetReport" },
               ],
      });
    }
if (isAdmin) {
  items.push({
    title: "Financial Report",
    icon: <AiOutlineBarChart className="text-lg" />,
    subItems: [
      {
        title: "Monthyly Profit Manager",
        icon: <AiOutlineFileText />,
        path: "/dashboard/ProfitManager",
      },
      {
        title: "Monthly Income statements",
        icon: <AiOutlineFileText />,
        path: "/dashboard/FinancialReport",
      },
      {
        title: "Ledger",
        icon: <AiOutlineFileText />,
        path: "/dashboard/Ledger",
      },
      {
        title: "Balance Sheet",
        icon: <AiOutlineFileText />,
        path: "/dashboard/balance-sheet",
      },
    ],
  });
}

    if (isAdmin) {
      items.push({
        title: "Users",
        icon: <AiOutlineUser className="text-lg" />,
        subItems: [
          { title: "Create User", icon: <AiOutlineUser />, path: "register" },
          { title: "User List", icon: <AiOutlineUser />, path: "/dashboard/user/list" },
        ],
      });
    }

    if (isTeacher) {
      items.push({
        title: "Permissions",
        icon: <AiOutlineSafety className="text-lg" />,
        path: "/dashboard/Permissions",
      });
    }

    return items;
  };

  const menuItems = buildMenuItems();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleDropdown = (index: number) => {
    setOpenDropdowns((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const isActive = (path?: string) => path && location.pathname === path;
  const isChildActive = (subItems?: MenuItem[]) =>
    subItems?.some((subItem) => isActive(subItem.path));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div
        ref={sidebarRef}
        className={`bg-blue-700 text-white p-5 pt-8 duration-300 
          ${isOpen ? "w-64" : "w-20"} fixed h-full shadow-lg z-50 transition-all`}
      >
        <div className="flex justify-end items-center mb-8">
          <button
            onClick={toggleSidebar}
            className="text-xl p-2 hover:bg-blue-600 rounded-lg text-white"
          >
            {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
        </div>

        <nav className="flex flex-col h-[calc(100%-100px)]">
          <ul className="space-y-2 flex-1 overflow-y-auto">
            {menuItems.map((item, index) => (
              <li key={item.title}>
                {item.subItems ? (
                  <div className="relative">
                    <div
                      onClick={() => toggleDropdown(index)}
                      onMouseEnter={() => !isOpen && setHoveredItem(item.title)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`flex items-center justify-between p-3 text-white hover:bg-blue-600 rounded-xl
                        transition-all text-sm font-medium ${isActive(item.path) || isChildActive(item.subItems)
                          ? "bg-blue-800"
                          : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{item.icon}</span>
                        <span className={`${!isOpen && "hidden"} origin-left duration-200 font-medium`}>
                          {item.title}
                        </span>
                      </div>
                      {isOpen && (
                        <span className="text-sm">
                          {openDropdowns[index] ? <AiOutlineUp /> : <AiOutlineDown />}
                        </span>
                      )}
                    </div>

                    {!isOpen && hoveredItem === item.title && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-blue-700 text-white text-sm rounded-lg shadow-lg z-50">
                        {item.title}
                      </div>
                    )}

                    {isOpen && openDropdowns[index] && (
                      <ul className="ml-6 mt-1 space-y-1 border-l-2 border-blue-600 pl-3">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.title}>
                            <Link
                              to={subItem.path || "#"}
                              className={`flex items-center gap-3 p-2 text-white hover:bg-blue-600 rounded-lg
                                transition-all text-sm ${isActive(subItem.path) ? "bg-blue-800" : ""}`}
                            >
                              <span className="text-lg">{subItem.icon}</span>
                              <span className="origin-left duration-200">{subItem.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path || "#"}
                    className={`flex items-center gap-3 p-3 text-white hover:bg-blue-600 rounded-xl
                      transition-all text-sm font-medium ${isActive(item.path) ? "bg-blue-800" : ""}`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className={`${!isOpen && "hidden"} origin-left duration-200 font-medium`}>
                      {item.title}
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={`flex-1 transition-all ${isOpen ? "ml-64" : "ml-20"}`}>
        <main className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
