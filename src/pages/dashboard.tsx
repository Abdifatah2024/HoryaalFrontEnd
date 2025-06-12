import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  FiUsers,
  FiCalendar,
  FiBook,
  FiUser,
  FiBarChart2,
  FiBell,
  FiMail,
  FiPieChart,
  FiPlus,
   FiSettings,
  FiUpload,
  FiAlertCircle, // Added for potential error messages
} from 'react-icons/fi';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import { motion } from 'framer-motion'; // Import motion for animations

// Define Interfaces for better type checking (if using TypeScript)
interface JwtPayload {
  role: string;
  exp: number;
}

interface ClassPaymentSummary {
  className: string;
  totalStudents: number;
  totalRequired: number;
  totalPaid: number;
  totalCarryForward: number; // Ensure this is provided by backend
  totalPastUnpaid: number;
  totalBalanceDue: number;
  percentagePaid: number;
}

interface StudentPaymentDetail {
  studentId: number;
  name: string;
  className: string;
  currentMonthDue: number;
  currentMonthPaid: number;
  pastUnpaidBalance: number;
  carryForward: number; // Ensure this is provided by backend
  balanceDue: number;
}

interface ClassPaymentResponse {
  month: number;
  year: number;
  count: number; // Number of students in the details array
  students: StudentPaymentDetail[];
  summary: ClassPaymentSummary[];
}

// StatCard Component - Reusable UI for displaying statistics
// This component should ideally be in its own file (e.g., components/StatCard.jsx)
const StatCard = ({
  title,
  value,
  description,
  icon,
  bgColor,
  borderColor,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  bgColor?: string; // Added for background gradient
  borderColor?: string; // Added for border color
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`bg-white border ${
      borderColor || 'border-gray-200'
    } rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${
      bgColor || 'bg-gradient-to-br from-white to-gray-50'
    }`}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
      {icon && (
        <div className="bg-indigo-50 p-3 rounded-lg shadow-sm text-indigo-600">
          {icon}
        </div>
      )}
    </div>
  </motion.div>
);

// Main Dashboard Component
const Dashboard = () => {
  const navigate = useNavigate();
  const now = new Date(); // Current date for initial month/year selection

  // State variables for loading indicators
  const [loading, setLoading] = useState({
    stats: true,
    absents: true,
    classPayment: true,
    monthlyIncome: true,
  });

  // State variables for dashboard data
  const [absents, setAbsents] = useState<{ className: string; count: number }[]>([]);
  const [totalAbsent, setTotalAbsent] = useState<number>(0);
  const [totalStudents, setTotalStudents] = useState<number | null>(null);
  const [maleCount, setMaleCount] = useState<number | null>(null);
  const [femaleCount, setFemaleCount] = useState<number | null>(null);
  const [busCount, setBusCount] = useState<number | null>(null);
  const [nonBusCount, setNonBusCount] = useState<number | null>(null);
  const [totalEmployees, setTotalEmployees] = useState<number | null>(null);
  const [incomeToday, setIncomeToday] = useState<any>(null); // Consider defining a more specific interface for incomeToday
  const [error, setError] = useState<string | null>(null);

  // State for monthly data filters
  const [month, setMonth] = useState(now.getMonth() + 1); // dayjs uses 0-indexed months, Date uses 1-indexed
  const [year, setYear] = useState(now.getFullYear());

  // State for monthly income and class payment data
  const [monthlyIncome, setMonthlyIncome] = useState<any>(null); // Consider defining a more specific interface
  const [classPaymentData, setClassPaymentData] = useState<ClassPaymentResponse | null>(null);
  const [showDetails, setShowDetails] = useState(false); // State to toggle student payment details

  // --- Authentication and Authorization Check ---
  // This logic runs on every render. If token is invalid/missing, it prevents rendering dashboard content.
  const token = localStorage.getItem('Access_token');
  if (!token) {
    // If no token, navigate to login or show an error
    // navigate('/login'); // Uncomment if you want to redirect
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-blue-500 to-green-300 p-4 font-sans relative overflow-hidden text-center text-red-600 font-bold">
        <FiAlertCircle size={32} className="mx-auto mb-4" />
        Unauthorized: Please login
      </div>
    );
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    // Check token expiry
    if (decoded.exp * 1000 < Date.now()) {
      // Token expired, clear storage and redirect
      localStorage.removeItem('Access_token');
      // navigate('/login'); // Uncomment if you want to redirect
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-blue-500 to-green-300 p-4 font-sans relative overflow-hidden text-center text-red-600 font-bold">
          <FiAlertCircle size={32} className="mx-auto mb-4" />
          Session expired. Please login again.
        </div>
      );
    }

    // Check user role (Assuming this dashboard is for ADMIN only based on original code)
    if (decoded.role !== 'ADMIN') {
      // Not an admin, redirect or show access denied message
      // navigate('/unauthorized'); // Uncomment if you want to redirect
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-blue-500 to-green-300 p-4 font-sans relative overflow-hidden text-center text-red-600 font-bold">
          <FiAlertCircle size={32} className="mx-auto mb-4" />
          Access Denied: Admins only
        </div>
      );
    }
  } catch (err) {
    // Invalid token format
    localStorage.removeItem('Access_token'); // Clear potentially corrupted token
    // navigate('/login'); // Uncomment if you want to redirect
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-blue-500 to-green-300 p-4 font-sans relative overflow-hidden text-center text-red-600 font-bold">
        <FiAlertCircle size={32} className="mx-auto mb-4" />
        Invalid token format. Please re-login.
      </div>
    );
  }
  // --- End Authentication Check ---

  // --- Data Fetching Logic ---
  useEffect(() => {
    // Function to fetch daily/general statistics
    const fetchData = async () => {
      try {
        setError(null); // Clear previous errors
        // Use Promise.all to fetch multiple endpoints concurrently for efficiency
        const [studentsRes, employeesRes, absentRes, incomeRes, withBusRes, withoutBusRes] =
          await Promise.all([
            axios.get('http://localhost:4000/student/studentList', {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get('http://localhost:4000/user/employees', {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get('http://localhost:4000/student/attendance/absent-today', {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get('http://localhost:4000/fee/income/today', {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get('http://localhost:4000/student/students/with-bus', {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get('http://localhost:4000/student/students/without-bus', {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        const students = studentsRes.data;
        setTotalStudents(students.length);
        setMaleCount(students.filter((s: any) => s.gender === 'Male').length);
        setFemaleCount(students.filter((s: any) => s.gender === 'Female').length);
        setBusCount(withBusRes.data.students?.length || 0); // Safely access .students
        setNonBusCount(withoutBusRes.data.students?.length || 0); // Safely access .students
        setTotalEmployees(employeesRes.data.employees.length);

        const absentStudents = absentRes.data.students || [];
        const classAbsents: Record<string, number> = {};
        absentStudents.forEach((s: any) => {
          classAbsents[s.className] = (classAbsents[s.className] || 0) + 1;
        });
        setAbsents(Object.entries(classAbsents).map(([className, count]) => ({ className, count })));
        setTotalAbsent(absentRes.data.totalAbsent || 0);

        setIncomeToday(incomeRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard main data:', err);
        setError('Failed to load core dashboard data. Please check the server.');
      } finally {
        setLoading((prev) => ({ ...prev, stats: false, absents: false }));
      }
    };

    // Function to fetch monthly data (income and class payments)
    const fetchMonthlyData = async () => {
      try {
        setLoading((prev) => ({ ...prev, monthlyIncome: true, classPayment: true }));
        const [monthlyIncomeRes, classPaymentRes] = await Promise.all([
          axios.get(`http://localhost:4000/fee/income-required?month=${month}&year=${year}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:4000/fee/Classfee/status?month=${month}&year=${year}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setMonthlyIncome(monthlyIncomeRes.data);
        setClassPaymentData(classPaymentRes.data);
      } catch (err) {
        console.error('Failed to fetch monthly data:', err);
        setError('Failed to load monthly data. Please check the server and selected period.');
      } finally {
        setLoading((prev) => ({ ...prev, monthlyIncome: false, classPayment: false }));
      }
    };

    // Call data fetching functions on component mount and when month/year changes
    fetchData();
    fetchMonthlyData();
  }, [month, year, token]); // Add token to dependency array to re-fetch if token changes

  // --- Dashboard Data for StatCards ---
  // This array defines the content for your main statistics cards
  const stats = [
    {
      title: 'Student Summary',
      value: totalStudents ?? '--',
      details: [
        {
          label: 'Male',
          value:
            maleCount !== null && totalStudents !== null && totalStudents > 0
              ? `${maleCount} (${((maleCount / totalStudents) * 100).toFixed(1)}%)`
              : '--',
          color: 'text-blue-600',
          icon: <FiUser className="text-blue-600" size={14} />,
        },
        {
          label: 'Female',
          value:
            femaleCount !== null && totalStudents !== null && totalStudents > 0
              ? `${femaleCount} (${((femaleCount / totalStudents) * 100).toFixed(1)}%)`
              : '--',
          color: 'text-pink-600',
          icon: <FiUser className="text-pink-600" size={14} />,
        },
        {
          label: 'With Bus',
          value: busCount !== null ? `${busCount}` : '--',
          color: 'text-green-600',
          icon: <span className="text-green-600">🚌</span>,
        },
        {
          label: 'Without Bus',
          value: nonBusCount !== null ? `${nonBusCount}` : '--',
          color: 'text-red-600',
          icon: <span className="text-red-600">🚫</span>,
        },
      ],
      icon: <FiUsers className="text-blue-600" size={24} />,
      bgColor: 'bg-gradient-to-br from-blue-100 via-white to-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Staff Summary',
      value: totalEmployees ?? '--',
      details: [],
      icon: <HiOutlineAcademicCap className="text-orange-600" size={24} />,
      bgColor: 'bg-gradient-to-br from-orange-100 via-white to-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      title: 'Attendance Today',
      value: `${totalAbsent} Absent`,
      details: [],
      icon: <FiCalendar className="text-red-600" size={24} />,
      bgColor: 'bg-gradient-to-br from-red-100 via-white to-red-50',
      borderColor: 'border-red-200',
    },
    {
      title: 'Income for Today',
      value: incomeToday ? `$${incomeToday.amountPaidToday?.toFixed(2) || '0.00'}` : '--',
      details: [
        {
          label: 'Discounts',
          value: incomeToday ? `$${incomeToday.totalDiscountToday?.toFixed(2) || '0.00'}` : '--',
          color: 'text-amber-600',
        },
        {
          label: 'Balance',
          value: incomeToday ? `$${incomeToday.unpaidBalance?.toFixed(2) || '0.00'}` : '--',
          color: 'text-red-600',
        },
      ],
      icon: <FiPieChart className="text-green-600" size={24} />,
      bgColor: 'bg-gradient-to-br from-green-100 via-white to-green-50',
      borderColor: 'border-green-200',
    },
  ];

  // --- Quick Actions Data ---
  // This array defines the content and actions for your quick access buttons
  const quickActions = [
    { title: 'Today Absent', icon: <FiCalendar size={18} />, action: () => navigate('/dashboard/TodayAbsent') },
    { title: 'Register Exam', icon: <FiBook size={18} />, action: () => navigate('/dashboard/ExamRoute') },
    { title: 'Add Student', icon: <FiPlus size={18} />, action: () => navigate('/dashboard/regstd') },
    { title: 'View Reports', icon: <FiBarChart2 size={18} />, action: () => navigate('/dashboard/ExamPerformance') },
  ];

  // --- Button Action Handlers ---
  const toggleDetails = () => setShowDetails(!showDetails); // Toggle for class payment details

  const handlePrimaryAction = () => {
    alert('Primary Action Clicked! (e.g., Navigate to Add New Admission)');
    // Example: navigate('/new-admission'); // Uncomment and replace with your actual route
  };

  const handleSecondaryAction = () => {
    alert('Secondary Action Clicked! (e.g., Open Settings)');
    // Example: navigate('/settings'); // Uncomment and replace with your actual route
  };

  const handleImportData = () => {
    alert('Import Data Clicked! (e.g., Trigger file upload modal or API call)');
    // Example: This could trigger a file input dialog or open a dedicated import page
    // document.getElementById('file-upload-input').click();
  };

  // --- Component Render ---
  return (
    // Main container with the vibrant background and overflow hidden
    <div className="p-6 min-h-screen bg-gradient-to-br from-purple-400 via-blue-500 to-green-300 font-sans relative overflow-hidden">
      {/* More dynamic and beautiful background elements with Framer Motion animations */}
      {/* Large, slow pulsating gradient from top-left */}
      <motion.div
        initial={{ scale: 0, opacity: 0, x: '-50%', y: '-50%' }}
        animate={{ scale: 1.2, opacity: 0.3, x: '-20%', y: '-20%' }}
        transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
        className="absolute top-0 left-0 w-3/4 h-3/4 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 blur-2xl opacity-20 rounded-full"
      ></motion.div>
      {/* Large, slow pulsating gradient from top-left with a delay */}
      <motion.div
        initial={{ scale: 0, opacity: 0, x: '50%', y: '50%' }}
        animate={{ scale: 1.1, opacity: 0.3, x: '20%', y: '20%' }}
        transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror', delay: 0.5 }}
        className="absolute bottom-0 right-0 w-3/5 h-3/5 bg-gradient-to-bl from-yellow-400 via-orange-400 to-red-400 blur-3xl opacity-20 rounded-full"
      ></motion.div>
      {/* Small, floating circular blob moving from top-left to bottom-right */}
      <motion.div
        initial={{ x: -50, y: -50, opacity: 0.1 }}
        animate={{ x: 'calc(100vw - 100px)', y: 'calc(100vh - 100px)', opacity: 0.2 }}
        transition={{ duration: 15, ease: 'linear', repeat: Infinity, repeatType: 'loop' }}
        className="absolute w-48 h-48 bg-blue-300 rounded-full blur-xl opacity-15"
      ></motion.div>
      {/* Another small, floating circular blob moving from bottom-right to top-left with a delay */}
      <motion.div
        initial={{ x: 'calc(100vw - 100px)', y: 'calc(100vh - 100px)', opacity: 0.1 }}
        animate={{ x: -50, y: -50, opacity: 0.2 }}
        transition={{ duration: 18, ease: 'linear', repeat: Infinity, repeatType: 'loop', delay: 2 }}
        className="absolute w-64 h-64 bg-green-300 rounded-full blur-xl opacity-15"
      ></motion.div>

      {/* Content wrapper to ensure it stays above the background animations */}
      <div className="relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
            {/* Using dayjs for date formatting */}
            <p className="text-indigo-600 mt-1">{dayjs().format('dddd, MMMM D, YYYY')}</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            {/* Notification Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 rounded-lg bg-white shadow-sm hover:shadow-md text-indigo-600 transition-all"
            >
              <FiBell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>{' '}
              {/* Notification dot */}
            </motion.button>
            {/* Mail Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md text-indigo-600 transition-all"
            >
              <FiMail size={20} />
            </motion.button>

            {/* Primary Action Button (New Admission) */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 8px 25px -5px rgba(99, 102, 241, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrimaryAction}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
            >
              <FiPlus size={18} />
              New Admission
            </motion.button>

            {/* Secondary Action Button (Settings) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSecondaryAction}
              className="flex items-center gap-2 bg-white text-indigo-600 border border-indigo-300 px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-50 transition-colors duration-200"
            >
              <FiSettings size={18} />
              Settings
            </motion.button>
          </div>
        </motion.div>

        {/* Error Message Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm flex items-center gap-2"
          >
            <FiAlertCircle className="h-5 w-5" />
            {error}
          </motion.div>
        )}

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading.stats ? (
            // Skeleton loader for stats
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse shadow-md" />
            ))
          ) : (
            stats.map((stat, i) => (
              <StatCard
                key={i}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                bgColor={stat.bgColor}
                borderColor={stat.borderColor}
                description={
                  stat.details && stat.details.length > 0 ? (
                    <div className="mt-2 text-gray-700">
                      {stat.details.map((d, j) => (
                        <div key={j} className="flex justify-between items-center text-sm mb-1">
                          <div className="flex items-center">
                            {d.icon && <span className="mr-1">{d.icon}</span>}
                            <span>{d.label}:</span>
                          </div>
                          <span className={`font-semibold ${d.color}`}>{d.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : undefined
                }
              />
            ))
          )}
        </div>

        {/* Quick Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Dynamic Quick Actions from the 'quickActions' array */}
            {quickActions.map((action, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={action.action}
                className="group bg-white hover:bg-indigo-600 p-4 rounded-lg border border-indigo-100 shadow-sm transition-all flex flex-col items-center justify-center text-center hover:shadow-md"
              >
                <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 group-hover:bg-white group-hover:text-indigo-600 transition-colors mb-2">
                  {action.icon}
                </div>
                <span className="font-medium text-gray-700 group-hover:text-white text-sm">
                  {action.title}
                </span>
              </motion.button>
            ))}

            {/* Static "Import Data" Button within Quick Actions */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleImportData}
              className="group bg-white hover:bg-green-600 p-4 rounded-lg border border-green-100 shadow-sm transition-all flex flex-col items-center justify-center text-center hover:shadow-md"
            >
              <div className="bg-green-100 p-3 rounded-full text-green-600 group-hover:bg-white group-hover:text-green-600 transition-colors mb-2">
                <FiUpload size={18} />
              </div>
              <span className="font-medium text-gray-700 group-hover:text-white text-sm">
                Import Data
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content Grid (Absent Breakdown & Monthly Income) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Absent Breakdown Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Absent Breakdown by Class</h3>
                <p className="text-sm text-indigo-600">{dayjs().format('MMMM D, YYYY')}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard/TodayAbsent')}
                className="text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                View All
              </motion.button>
            </div>

            {loading.absents ? (
              // Skeleton loader for absents
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : absents.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {absents.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="bg-gradient-to-br from-red-50 to-white p-4 rounded-lg border border-red-100 hover:border-red-200 transition-all hover:shadow-sm"
                  >
                    <p className="text-xs font-medium text-gray-500 mb-1">Class</p>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold text-gray-800">{a.className}</p>
                      <p className="text-xl font-bold text-red-600">{a.count}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                No absences recorded today
              </div>
            )}
          </motion.div>

          {/* Monthly Income Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Monthly Income Overview</h3>
                <p className="text-sm text-indigo-600">
                  {dayjs().month(month - 1).format('MMMM YYYY')}
                </p>
              </div>
              <div className="flex gap-2">
                {/* Month Selector */}
                <select
                  value={month}
                  onChange={(e) => setMonth(+e.target.value)}
                  className="border border-indigo-100 bg-white px-3 py-1.5 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {dayjs().month(i).format('MMMM')}
                    </option>
                  ))}
                </select>
                {/* Year Selector */}
                <select
                  value={year}
                  onChange={(e) => setYear(+e.target.value)}
                  className="border border-indigo-100 bg-white px-3 py-1.5 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                >
                  {Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading.monthlyIncome ? (
              // Skeleton loader for monthly income
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : monthlyIncome ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard
                  title="Total Students"
                  value={monthlyIncome.totalStudents}
                  icon={<FiUsers className="text-blue-600" />}
                />
                <StatCard
                  title="Required Income"
                  value={`$${monthlyIncome.requiredIncome?.total?.toFixed(2) || '0.00'}`}
                  description={`Prev: $${
                    monthlyIncome.requiredIncome?.expectedFromPreviousMonths?.toFixed(2) || '0.00'
                  }, Curr: $${monthlyIncome.requiredIncome?.expectedFromCurrentMonth?.toFixed(2) || '0.00'}`}
                  icon={<FiPieChart className="text-purple-600" />}
                />
                <StatCard
                  title="Total Paid"
                  value={`$${monthlyIncome.actualPaid?.toFixed(2) || '0.00'}`}
                  icon={<FiPieChart className="text-green-600" />}
                />
                <StatCard
                  title="Total Discounts"
                  value={`$${monthlyIncome.totalDiscount?.toFixed(2) || '0.00'}`}
                  icon={<FiPieChart className="text-amber-600" />}
                />
                <StatCard
                  title="Total Income"
                  value={`$${monthlyIncome.totalIncome?.toFixed(2) || '0.00'}`}
                  icon={<FiPieChart className="text-indigo-600" />}
                />
                <StatCard
                  title="Current Month Balance"
                  value={`$${monthlyIncome.balance?.toFixed(2) || '0.00'}`}
                  icon={<FiPieChart className="text-red-600" />}
                />
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                No income data available for {dayjs().month(month - 1).format('MMMM YYYY')}.
              </div>
            )}
          </motion.div>
        </div>

        {/* Class Payment Summary Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Class Payment Summary</h1>
            <div className="flex gap-4">
              {/* Month Selector for Class Payment Summary */}
              <select
                value={month}
                onChange={(e) => setMonth(+e.target.value)}
                className="border border-indigo-100 bg-white px-3 py-2 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {dayjs().month(i).format('MMMM')}
                  </option>
                ))}
              </select>
              {/* Year Selector for Class Payment Summary */}
              <select
                value={year}
                onChange={(e) => setYear(+e.target.value)}
                className="border border-indigo-100 bg-white px-3 py-2 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
              >
                {Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDetails}
                className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </motion.button>
            </div>
          </div>

          {loading.classPayment ? (
            // Skeleton loader for table
            <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
          ) : classPaymentData && classPaymentData.summary.length > 0 ? (
            <>
              <div className="overflow-x-auto rounded-lg shadow border mb-6">
                <table className="min-w-full text-sm text-left text-gray-700">
                  <thead className="bg-gradient-to-r from-indigo-50 to-blue-50">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-gray-700">Class</th>
                      <th className="px-4 py-3 text-gray-700">Students</th>
                      <th className="px-4 py-3 text-gray-700">Required</th>
                      <th className="px-4 py-3 text-gray-700">Paid</th>
                      <th className="px-4 py-3 text-gray-700">Unpaid</th>
                      <th className="px-4 py-3 text-gray-700">Balance</th>
                      <th className="px-4 py-3 text-gray-700">Paid %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classPaymentData.summary.map((item, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="border-t hover:bg-indigo-50"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">{item.className}</td>
                        <td className="px-4 py-3">{item.totalStudents}</td>
                        <td className="px-4 py-3">${item.totalRequired.toFixed(2)}</td>
                        <td className="px-4 py-3 text-green-600 font-medium">
                          ${item.totalPaid.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-orange-600">
                          ${item.totalPastUnpaid.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-red-600 font-medium">
                          ${item.totalBalanceDue.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-indigo-600 h-2.5 rounded-full"
                              style={{ width: `${item.percentagePaid}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">
                            {item.percentagePaid.toFixed(1)}%
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Student Payment Details Section (Conditional Rendering) */}
              {showDetails && classPaymentData.students.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-inner"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Student Payment Details</h2>
                  <div className="overflow-x-auto rounded-lg shadow border">
                    <table className="min-w-full text-sm text-left text-gray-700">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 font-semibold text-gray-700">Student ID</th>
                          <th className="px-4 py-3 text-gray-700">Name</th>
                          <th className="px-4 py-3 text-gray-700">Class</th>
                          <th className="px-4 py-3 text-gray-700">Current Due</th>
                          <th className="px-4 py-3 text-gray-700">Current Paid</th>
                          <th className="px-4 py-3 text-gray-700">Past Unpaid</th>
                          <th className="px-4 py-3 text-gray-700">Carry Forward</th>
                          <th className="px-4 py-3 text-gray-700">Balance Due</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classPaymentData.students.map((student, sIdx) => (
                          <motion.tr
                            key={sIdx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: sIdx * 0.03 }}
                            className="border-t hover:bg-gray-100"
                          >
                            <td className="px-4 py-3">{student.studentId}</td>
                            <td className="px-4 py-3 font-medium text-gray-900">
                              {student.name}
                            </td>
                            <td className="px-4 py-3">{student.className}</td>
                            <td className="px-4 py-3">${student.currentMonthDue.toFixed(2)}</td>
                            <td className="px-4 py-3 text-green-600">
                              ${student.currentMonthPaid.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-orange-600">
                              ${student.pastUnpaidBalance.toFixed(2)}
                            </td>
                            <td className="px-4 py-3">
                              ${student.carryForward?.toFixed(2) || '0.00'}
                            </td>
                            <td className="px-4 py-3 text-red-600">
                              ${student.balanceDue.toFixed(2)}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              No class payment data available for {dayjs().month(month - 1).format('MMMM YYYY')}.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
