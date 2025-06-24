import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';



// Extend dayjs with plugins
dayjs.extend(duration);
dayjs.extend(relativeTime);

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
  FiAlertCircle,
  FiSpeaker,
  FiClock,
  FiZap,
  FiTarget
} from 'react-icons/fi';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

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
  totalCarryForward: number;
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
  carryForward: number;
  balanceDue: number;
}

interface ClassPaymentResponse {
  month: number;
  year: number;
  count: number;
  students: StudentPaymentDetail[];
  summary: ClassPaymentSummary[];
}

interface Announcement {
  id: number; // Based on your provided JSON
  title: string;
  message: string; // Changed from 'content' to 'message'
  createdAt: string;
  startDate: string;
  endDate?: string; // Changed from 'expiresAt' to 'endDate' and made optional for consistency
  createdById: number;
  targetRole: string; // New: Add targetRole
  createdBy: {
    id: number;
    fullName: string; // New: Add createdBy fullName
    email: string;
    role: string;
  };
  // Properties calculated on frontend
  timeRemaining: string;
  daysLeft: number;
  hoursLeft: number;
  minutesLeft: number;
  isExpired: boolean;
  isUrgent?: boolean; // Keep for now, though not in your sample data
}

// StatCard Component - Reusable UI for displaying statistics
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
  bgColor?: string;
  borderColor?: string;
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
  const now = dayjs(); // Use dayjs for current time

  // State variables for loading indicators
  const [loading, setLoading] = useState({
    stats: true,
    absents: true,
    classPayment: true,
    monthlyIncome: true,
    announcements: true,
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
  const [incomeToday, setIncomeToday] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // State for monthly data filters
  const [month, setMonth] = useState(now.month() + 1); // dayjs.month() is 0-indexed
  const [year, setYear] = useState(now.year());

  // State for monthly income and class payment data
  const [monthlyIncome, setMonthlyIncome] = useState<any>(null);
  const [classPaymentData, setClassPaymentData] = useState<ClassPaymentResponse | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // --- Authentication and Authorization Check ---
  const token = localStorage.getItem('Access_token');
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-blue-500 to-green-300 p-4 font-sans relative overflow-hidden text-center text-red-600 font-bold">
        <FiAlertCircle size={32} className="mx-auto mb-4" />
        Unauthorized: Please login
      </div>
    );
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('Access_token');
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-blue-500 to-green-300 p-4 font-sans relative overflow-hidden text-center text-red-600 font-bold">
          <FiAlertCircle size={32} className="mx-auto mb-4" />
          Session expired. Please login again.
        </div>
      );
    }

    if (decoded.role !== 'ADMIN') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-blue-500 to-green-300 p-4 font-sans relative overflow-hidden text-center text-red-600 font-bold">
          <FiAlertCircle size={32} className="mx-auto mb-4" />
          Access Denied: Admins only
        </div>
      );
    }
  } catch (err) {
    localStorage.removeItem('Access_token');
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
    const fetchDashboardData = async () => {
      try {
        setError(null);
        setLoading((prev) => ({
          ...prev,
          stats: true,
          absents: true,
          announcements: true,
          monthlyIncome: true,
          classPayment: true,
        }));

        const [
          studentsRes,
          employeesRes,
          absentRes,
          incomeRes,
          withBusRes,
          withoutBusRes,
          announcementsRes, // This will return your new announcement structure
          monthlyIncomeRes,
          classPaymentRes,
        ] = await Promise.all([
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
          axios.get('http://localhost:4000/user/announcements/all', { // Ensure this endpoint returns the new format
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:4000/fee/income-required?month=${month}&year=${year}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:4000/fee/Classfee/status?month=${month}&year=${year}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Process Students Data
        const students = studentsRes.data;
        setTotalStudents(students.length);
        setMaleCount(students.filter((s: any) => s.gender === 'Male').length);
        setFemaleCount(students.filter((s: any) => s.gender === 'Female').length);
        setBusCount(withBusRes.data.students?.length || 0);
        setNonBusCount(withoutBusRes.data.students?.length || 0);

        // Process Employees Data
        setTotalEmployees(employeesRes.data.employees.length);

        // Process Absent Data
        const absentStudents = absentRes.data.students || [];
        const classAbsents: Record<string, number> = {};
        absentStudents.forEach((s: any) => {
          classAbsents[s.className] = (classAbsents[s.className] || 0) + 1;
        });
        setAbsents(Object.entries(classAbsents).map(([className, count]) => ({ className, count })));
        setTotalAbsent(absentRes.data.totalAbsent || 0);

        // Process Income Today Data
        setIncomeToday(incomeRes.data);

        // Process Announcements Data and calculate time remaining based on 'endDate'
        const processedAnnouncements = announcementsRes.data.map((ann: any) => { // Use 'any' temporarily if types conflict
          const nowTime = dayjs();
          const expiresTime = ann.endDate ? dayjs(ann.endDate) : null;

          let timeRemaining = 'N/A';
          let daysLeft = 0;
          let hoursLeft = 0;
          let minutesLeft = 0;
          let isExpired = true;

          if (expiresTime && expiresTime.isValid()) {
            const diff = expiresTime.diff(nowTime); // Difference in milliseconds

            if (diff > 0) {
              isExpired = false;
              const durationObj = dayjs.duration(diff);
              daysLeft = Math.floor(durationObj.asDays());
              hoursLeft = durationObj.hours();
              minutesLeft = durationObj.minutes();

              if (daysLeft > 0) {
                timeRemaining = `${daysLeft}d ${hoursLeft}h`;
              } else if (hoursLeft > 0) {
                timeRemaining = `${hoursLeft}h ${minutesLeft}m`;
              } else if (minutesLeft > 0) {
                timeRemaining = `${minutesLeft}m`;
              } else {
                timeRemaining = 'Less than a minute';
              }
            } else {
              timeRemaining = 'Expired';
              isExpired = true;
            }
          } else {
            timeRemaining = 'No Expiration'; // For announcements without endDate
            isExpired = false; // Treat as never expiring if no date
          }

          return {
            ...ann,
            content: ann.message, // Map message to content for existing UI if needed, or directly use message
            expiresAt: ann.endDate, // Map endDate to expiresAt for existing UI if needed
            timeRemaining,
            daysLeft,
            hoursLeft,
            minutesLeft,
            isExpired,
            isUrgent: ann.isUrgent || false, // Assuming 'isUrgent' might come from backend
          };
        }).filter((ann: Announcement) => !ann.isExpired); // Filter out truly expired ones

        setAnnouncements(processedAnnouncements);

        // Process Monthly Income Data
        setMonthlyIncome(monthlyIncomeRes.data);

        // Process Class Payment Data
        setClassPaymentData(classPaymentRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please check the server connection and try again.');
      } finally {
        setLoading({
          stats: false,
          absents: false,
          announcements: false,
          monthlyIncome: false,
          classPayment: false,
        });
      }
    };

    fetchDashboardData();
  }, [month, year, token]); // Re-run when month/year or token changes

  // --- Dashboard Data for StatCards ---
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
  const quickActions = [
    { title: 'Today Absent', icon: <FiCalendar size={18} />, action: () => navigate('/dashboard/TodayAbsent') },
    { title: 'Register Exam', icon: <FiBook size={18} />, action: () => navigate('/dashboard/ExamRoute') },
    { title: 'Add Student', icon: <FiPlus size={18} />, action: () => navigate('/dashboard/regstd') },
    { title: 'View Reports', icon: <FiBarChart2 size={18} />, action: () => navigate('/dashboard/ExamPerformance') },
  ];

  // --- Button Action Handlers ---
  const toggleDetails = () => setShowDetails(!showDetails);

  // const handlePrimaryAction = () => {
  //   alert('Primary Action Clicked! (e.g., Navigate to Add New Admission)');
  // };
  const handlePrimaryAction = () => {
  navigate('/dashboard/Announcements');
};

  const handleSecondaryAction = () => {
    alert('Secondary Action Clicked! (e.g., Open Settings)');
  };

  const handleImportData = () => {
    alert('Import Data Clicked! (e.g., Trigger file upload modal or API call)');
  };

  // --- Component Render ---
  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-purple-400 via-blue-500 to-green-300 font-sans relative overflow-hidden">
      {/* Background animations */}
      <motion.div
        initial={{ scale: 0, opacity: 0, x: '-50%', y: '-50%' }}
        animate={{ scale: 1.2, opacity: 0.3, x: '-20%', y: '-20%' }}
        transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
        className="absolute top-0 left-0 w-3/4 h-3/4 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 blur-2xl opacity-20 rounded-full"
      ></motion.div>
      <motion.div
        initial={{ scale: 0, opacity: 0, x: '50%', y: '50%' }}
        animate={{ scale: 1.1, opacity: 0.3, x: '20%', y: '20%' }}
        transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror', delay: 0.5 }}
        className="absolute bottom-0 right-0 w-3/5 h-3/5 bg-gradient-to-bl from-yellow-400 via-orange-400 to-red-400 blur-3xl opacity-20 rounded-full"
      ></motion.div>
      <motion.div
        initial={{ x: -50, y: -50, opacity: 0.1 }}
        animate={{ x: 'calc(100vw - 100px)', y: 'calc(100vh - 100px)', opacity: 0.2 }}
        transition={{ duration: 15, ease: 'linear', repeat: Infinity, repeatType: 'loop' }}
        className="absolute w-48 h-48 bg-blue-300 rounded-full blur-xl opacity-15"
      ></motion.div>
      <motion.div
        initial={{ x: 'calc(100vw - 100px)', y: 'calc(100vh - 100px)', opacity: 0.1 }}
        animate={{ x: -50, y: -50, opacity: 0.2 }}
        transition={{ duration: 18, ease: 'linear', repeat: Infinity, repeatType: 'loop', delay: 2 }}
        className="absolute w-64 h-64 bg-green-300 rounded-full blur-xl opacity-15"
      ></motion.div>

      {/* Content wrapper */}
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
            <p className="text-indigo-600 mt-1">{dayjs().format('dddd, MMMM D,YYYY')}</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/dashboard/AnnouncementsList')}
              className="relative p-2 rounded-lg bg-white shadow-sm hover:shadow-md text-indigo-600 transition-all"
            >
              <FiBell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/dashboard/WorkPlanAndComment')}
              className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md text-indigo-600 transition-all"
            >
              <FiMail size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 8px 25px -5px rgba(99, 102, 241, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrimaryAction}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
            >
              <FiPlus size={18} />
              New Announcement
            </motion.button>

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

        {/* Announcements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-red-500 mb-5 flex items-center gap-2">
            <FiSpeaker className="text-purple-600" /> Recent Announcements
          </h2>
          {loading.announcements ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-36 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : announcements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {announcements.slice(0, 3).map((announcement, i) => (
                <motion.div
                  key={announcement.id} // Use announcement.id as key
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`relative p-5 rounded-lg border shadow-sm transition-all hover:shadow-md
                    ${announcement.isUrgent ? 'bg-red-50 border-red-200' : 'bg-purple-50 border-purple-100'}
                  `}
                >
                  {announcement.isUrgent && (
                    <span className="absolute top-2 right-2 text-red-500">
                      <FiZap size={20} className="animate-pulse" />
                    </span>
                  )}
                  <h4 className="font-semibold text-red-500 text-lg mb-1 flex items-center gap-2">
                    {announcement.title}
                  </h4>
                  <p className="text-gray-600  text-sm line-clamp-3 mb-2 font-bold">
                    {announcement.message}
                  </p>
                  <div className="text-xs text-gray-500 flex flex-col gap-1 mb-2">
                    <span className="flex items-center">
                      <FiUser className="inline-block mr-1" size={12} />
                      By: <span className="font-medium text-gray-700 ml-1">{announcement.createdBy.fullName}</span>
                    </span>
                    <span className="flex items-center">
                      <FiTarget className="inline-block mr-1" size={12} /> {/* Using FiTarget for targetRole */}
                      Target: <span className="font-medium text-gray-700 ml-1">{announcement.targetRole}</span>
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="flex items-center">
                      <FiCalendar className="inline-block mr-1" size={12} />
                      Published: {dayjs(announcement.createdAt).format('MMM D,YYYY')}
                    </span>
                    {announcement.endDate && (
                      <span className="flex items-center ml-0 sm:ml-2">
                        <FiClock className="inline-block mr-1" size={12} />
                        Expires: {announcement.isExpired ? (
                            <span className="font-bold text-red-600">Expired</span>
                        ) : (
                            <span className="font-medium text-purple-700">
                                {announcement.timeRemaining}
                            </span>
                        )}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
              {announcements.length > 3 && (
                <div className="lg:col-span-3 text-center mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/user/announcements/all')}
                    className="text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    View All Announcements
                  </motion.button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              No announcements available.
            </div>
          )}
        </motion.div>


        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading.stats ? (
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
                <p className="text-sm text-indigo-600">{dayjs().format('MMMM D,YYYY')}</p>
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
                <select
                  value={year}
                  onChange={(e) => setYear(+e.target.value)}
                  className="border border-indigo-100 bg-white px-3 py-1.5 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                >
                  {Array.from({ length: 5 }, (_, i) => dayjs().year() - 2 + i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading.monthlyIncome ? (
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
                  title="Total Discount"
                  value={`$${monthlyIncome.totalDiscount?.toFixed(2) || '0.00'}`}
                  icon={<FiPieChart className="text-orange-600" />}
                />
                <StatCard
                  title="Unpaid Balance"
                  value={`$${monthlyIncome.unpaidBalance?.toFixed(2) || '0.00'}`}
                  icon={<FiPieChart className="text-red-600" />}
                />
                <StatCard
                  title="Total Due"
                  value={`$${monthlyIncome.totalDue?.toFixed(2) || '0.00'}`}
                  icon={<FiPieChart className="text-yellow-600" />}
                />
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                No monthly income data available for this period.
              </div>
            )}
          </motion.div>
        </div>

        {/* Class Payment Status Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow mb-8"
        >
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Class Payment Status</h3>
              <p className="text-sm text-indigo-600">
                Summary for {dayjs().month(month - 1).format('MMMM YYYY')}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDetails}
              className="text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {showDetails ? 'Hide Student Details' : 'Show Student Details'}
            </motion.button>
          </div>

          {loading.classPayment ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : classPaymentData?.summary && classPaymentData.summary.length > 0 ? (
            <>
              {/* Class Summary Table */}
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Class Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total Students
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Required
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Paid
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Carry Forward
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Past Unpaid
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Balance Due
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        % Paid
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {classPaymentData.summary.map((summary, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {summary.className}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {summary.totalStudents}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          ${summary.totalRequired?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                          ${summary.totalPaid?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          ${summary.totalCarryForward?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                          ${summary.totalPastUnpaid?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                          ${summary.totalBalanceDue?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              summary.percentagePaid >= 75
                                ? 'bg-green-100 text-green-800'
                                : summary.percentagePaid >= 50
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {summary.percentagePaid.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Student Details Section (conditionally rendered) */}
              {showDetails && classPaymentData.students && classPaymentData.students.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.5 }}
                  className="mt-8 pt-6 border-t border-gray-200"
                >
                  <h4 className="text-xl font-bold text-gray-800 mb-4">Student Payment Details</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Student Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Class
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Current Month Due
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Current Month Paid
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Past Unpaid Balance
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Carry Forward
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Balance Due
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {classPaymentData.students.map((student, i) => (
                          <tr key={i}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {student.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {student.className}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              ${student.currentMonthDue?.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                              ${student.currentMonthPaid?.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                              ${student.pastUnpaidBalance?.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              ${student.carryForward?.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                              ${student.balanceDue?.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              No class payment data available for this period.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;


