import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  FiUsers, FiCalendar, FiBook, FiUser,
  FiBarChart2, FiBell, FiMail,
  FiPieChart, FiPlus, FiChevronRight
} from 'react-icons/fi';
import { HiOutlineAcademicCap } from 'react-icons/hi';

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

const Dashboard = () => {
  const navigate = useNavigate();
  const now = new Date();

  const [loading, setLoading] = useState({
    stats: true,
    absents: true,
    classPayment: true,
    monthlyIncome: true
  });

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
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [monthlyIncome, setMonthlyIncome] = useState<any>(null);
  const [classPaymentData, setClassPaymentData] = useState<ClassPaymentResponse | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const token = localStorage.getItem("Access_token");
  if (!token) {
    return <div className="text-center text-red-600 font-bold p-10">Unauthorized: Please login</div>;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.exp * 1000 < Date.now()) {
      return <div className="text-center text-red-600 font-bold p-10">Session expired. Please login again.</div>;
    }

    if (decoded.role !== "ADMIN") {
      return <div className="text-center text-red-600 font-bold p-10">Access Denied: Admins only</div>;
    }
  } catch (err) {
    return <div className="text-center text-red-600 font-bold p-10">Invalid token</div>;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [studentsRes, employeesRes, absentRes, incomeRes, withBusRes, withoutBusRes] = await Promise.all([
          axios.get("http://localhost:4000/student/studentList"),
          axios.get("http://localhost:4000/user/employees"),
          axios.get("http://localhost:4000/student/attendance/absent-today"),
          axios.get("http://localhost:4000/fee/income/today"),
          axios.get("http://localhost:4000/student/students/with-bus"),
          axios.get("http://localhost:4000/student/students/without-bus")
        ]);

        const students = studentsRes.data;
        setTotalStudents(students.length);
        setMaleCount(students.filter((s: any) => s.gender === "Male").length);
        setFemaleCount(students.filter((s: any) => s.gender === "Female").length);
        setBusCount(withBusRes.data.students?.length || 0);
        setNonBusCount(withoutBusRes.data.students?.length || 0);
        setTotalEmployees(employeesRes.data.employees.length);

        const absentStudents = absentRes.data.students || [];
        const classAbsents: Record<string, number> = {};
        absentStudents.forEach((s: any) => {
          classAbsents[s.className] = (classAbsents[s.className] || 0) + 1;
        });
        setAbsents(Object.entries(classAbsents).map(([className, count]) => ({ className, count })));
        setTotalAbsent(absentRes.data.totalAbsent || 0);

        setIncomeToday(incomeRes.data);
        setLoading(prev => ({ ...prev, stats: false, absents: false }));
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.");
        setLoading(prev => ({ ...prev, stats: false, absents: false }));
      }
    };

    const fetchMonthlyData = async () => {
      try {
        setLoading(prev => ({ ...prev, monthlyIncome: true, classPayment: true }));
        const [monthlyIncomeRes, classPaymentRes] = await Promise.all([
          axios.get(`http://localhost:4000/fee/income-required?month=${month}&year=${year}`),
          axios.get(`http://localhost:4000/fee/Classfee/status?month=${month}&year=${year}`)
        ]);

        setMonthlyIncome(monthlyIncomeRes.data);
        setClassPaymentData(classPaymentRes.data);
        setLoading(prev => ({ ...prev, monthlyIncome: false, classPayment: false }));
      } catch (err) {
        setError("Failed to load monthly data. Please try again.");
        setLoading(prev => ({ ...prev, monthlyIncome: false, classPayment: false }));
      }
    };

    fetchData();
    fetchMonthlyData();
  }, [month, year]);
  // Dashboard statistics
  const stats = [
    {
      title: "Student Summary",
      value: totalStudents ?? "--",
      details: [
        {
          label: "Male",
          value: maleCount && totalStudents ? `${maleCount} (${((maleCount / totalStudents) * 100).toFixed(1)}%)` : "--",
          color: "text-blue-600",
          icon: <FiUser className="text-blue-600" size={14} />
        },
        {
          label: "Female",
          value: femaleCount && totalStudents ? `${femaleCount} (${((femaleCount / totalStudents) * 100).toFixed(1)}%)` : "--",
          color: "text-pink-600",
          icon: <FiUser className="text-pink-600" size={14} />
        },
        {
          label: "With Bus",
          value: busCount !== null ? `${busCount}` : "--",
          color: "text-green-600",
          icon: <span className="text-green-600">🚌</span>
        },
        {
          label: "Without Bus",
          value: nonBusCount !== null ? `${nonBusCount}` : "--",
          color: "text-red-600",
          icon: <span className="text-red-600">🚫</span>
        }
      ],
      icon: <FiUsers className="text-blue-600" size={24} />,
      bgColor: "bg-gradient-to-br from-blue-100 via-white to-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Staff Summary",
      value: totalEmployees ?? "--",
      details: [],
      icon: <HiOutlineAcademicCap className="text-orange-600" size={24} />,
      bgColor: "bg-gradient-to-br from-orange-100 via-white to-orange-50",
      borderColor: "border-orange-200"
    },
    {
      title: "Attendance Today",
      value: `${totalAbsent} Absent`,
      details: [],
      icon: <FiCalendar className="text-red-600" size={24} />,
      bgColor: "bg-gradient-to-br from-red-100 via-white to-red-50",
      borderColor: "border-red-200"
    },
    {
      title: "Income for Today",
      value: incomeToday ? `$${incomeToday.amountPaidToday.toFixed(2)}` : "--",
      details: [
        {
          label: "Discounts",
          value: incomeToday ? `$${incomeToday.totalDiscountToday.toFixed(2)}` : "--",
          color: "text-amber-600"
        },
        {
          label: "Balance",
          value: incomeToday ? `$${incomeToday.unpaidBalance.toFixed(2)}` : "--",
          color: "text-red-600"
        }
      ],
      icon: <FiPieChart className="text-green-600" size={24} />,
      bgColor: "bg-gradient-to-br from-green-100 via-white to-green-50",
      borderColor: "border-green-200"
    }
  ];

  // Quick Actions
  const quickActions = [
    { title: "Today Absent", icon: <FiCalendar size={18} />, action: () => navigate("/dashboard/TodayAbsent") },
    { title: "Register Exam", icon: <FiBook size={18} />, action: () => navigate("/dashboard/ExamRoute") },
    { title: "Add Student", icon: <FiPlus size={18} />, action: () => navigate("/dashboard/regstd") },
    { title: "View Reports", icon: <FiBarChart2 size={18} />, action: () => navigate("/dashboard/ExamPerformance") }
  ];

  const toggleDetails = () => setShowDetails(!showDetails);
const StatCard = ({
  title,
  value,
  description,
  icon
}: {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
}) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:scale-105 transition-all duration-200">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
      {icon && (
        <div className="bg-white p-2 rounded-lg shadow-sm">
          {icon}
        </div>
      )}
    </div>
  </div>
);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-indigo-600 mt-1">{dayjs().format("dddd, MMMM D, YYYY")}</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="relative p-2 rounded-lg bg-white shadow-sm hover:shadow-md text-indigo-600 transition-all">
            <FiBell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <button className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md text-indigo-600 transition-all">
            <FiMail size={20} />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`p-5 rounded-xl border ${stat.borderColor} bg-white shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] ${stat.bgColor}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mb-3">{stat.value}</p>
                {stat.details?.map((d, j) => (
                  <div key={j} className="flex justify-between text-sm mb-1">
                    <div className="flex items-center text-gray-500">
                      {d.icon && <span className="mr-1">{d.icon}</span>}
                      <span>{d.label}</span>
                    </div>
                    <span className={`font-medium ${d.color}`}>{d.value}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-lg bg-white shadow-sm">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={action.action}
              className="group bg-white hover:bg-indigo-600 p-4 rounded-lg border border-indigo-100 shadow-sm transition-all flex items-center justify-between hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                  {action.icon}
                </div>
                <span className="font-medium text-gray-700 group-hover:text-white">{action.title}</span>
              </div>
              <FiChevronRight className="text-gray-400 group-hover:text-white" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Absent Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Absent Breakdown by Class</h3>
              <p className="text-sm text-indigo-600">{dayjs().format("MMMM D, YYYY")}</p>
            </div>
            <button
              onClick={() => navigate("/dashboard/TodayAbsent")}
              className="text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-lg font-medium transition-colors"
            >
              View All
            </button>
          </div>

          {loading.absents ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : absents.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {absents.map((a, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-red-50 to-white p-4 rounded-lg border border-red-100 hover:border-red-200 transition-all hover:shadow-sm"
                >
                  <p className="text-xs font-medium text-gray-500 mb-1">Class</p>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-gray-800">{a.className}</p>
                    <p className="text-xl font-bold text-red-600">{a.count}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              No absences recorded today
            </div>
          )}
        </div>

        {/* Monthly Income Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Monthly Income Overview</h3>
              <p className="text-sm text-indigo-600">{dayjs().month(month - 1).format("MMMM YYYY")}</p>
            </div>
            <div className="flex gap-2">
              <select
                value={month}
                onChange={(e) => setMonth(+e.target.value)}
                className="border border-indigo-100 bg-white px-3 py-1.5 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{dayjs().month(i).format("MMMM")}</option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(+e.target.value)}
                className="border border-indigo-100 bg-white px-3 py-1.5 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
              >
                {Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i).map((y) => (
                  <option key={y} value={y}>{y}</option>
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
                description={`Prev: $${monthlyIncome.requiredIncome?.expectedFromPreviousMonths?.toFixed(2) || '0.00'}, Curr: $${monthlyIncome.requiredIncome?.expectedFromCurrentMonth?.toFixed(2) || '0.00'}`}
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
              No income data available
            </div>
          )}
        </div>
      </div>

      {/* Class Payment Summary */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Class Payment Summary</h1>
          <button
            onClick={toggleDetails}
            className="text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-lg font-medium transition-colors"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        <div className="mb-4 flex gap-4">
          <select
            value={month}
            onChange={(e) => setMonth(+e.target.value)}
            className="border border-indigo-100 bg-white px-3 py-2 rounded-lg shadow-sm text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {dayjs().month(i).format("MMMM")}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(+e.target.value)}
            className="border border-indigo-100 bg-white px-3 py-2 rounded-lg shadow-sm text-sm"
          >
            {Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {loading.classPayment ? (
          <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
        ) : classPaymentData ? (
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
                    <tr key={idx} className="border-t hover:bg-indigo-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{item.className}</td>
                      <td className="px-4 py-3">{item.totalStudents}</td>
                      <td className="px-4 py-3">${item.totalRequired.toFixed(2)}</td>
                      <td className="px-4 py-3 text-green-600 font-medium">${item.totalPaid.toFixed(2)}</td>
                      <td className="px-4 py-3 text-orange-600">${item.totalPastUnpaid.toFixed(2)}</td>
                      <td className="px-4 py-3 text-red-600 font-medium">${item.totalBalanceDue.toFixed(2)}</td>
                      <td className="px-4 py-3 font-semibold">{item.percentagePaid.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {showDetails && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Payment Details</h3>
                <div className="overflow-x-auto rounded-lg shadow border">
                  <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gradient-to-r from-indigo-50 to-blue-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-700">Student</th>
                        <th className="px-4 py-3 text-gray-700">Class</th>
                        <th className="px-4 py-3 text-gray-700">Current Due</th>
                        <th className="px-4 py-3 text-gray-700">Paid</th>
                        <th className="px-4 py-3 text-gray-700">Past Unpaid</th>
                        <th className="px-4 py-3 text-gray-700">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classPaymentData.students.map((student, idx) => (
                        <tr key={idx} className="border-t hover:bg-indigo-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{student.name}</td>
                          <td className="px-4 py-3">{student.className}</td>
                          <td className="px-4 py-3">${student.currentMonthDue.toFixed(2)}</td>
                          <td className="px-4 py-3 text-green-600 font-medium">${student.currentMonthPaid.toFixed(2)}</td>
                          <td className="px-4 py-3 text-orange-600">${student.pastUnpaidBalance.toFixed(2)}</td>
                          <td className="px-4 py-3 text-red-600 font-medium">${student.balanceDue.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
            No class payment summary available.
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  description,
  icon
}: {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-indigo-200">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
      {icon && (
        <div className="bg-indigo-50 p-2 rounded-lg shadow-sm text-indigo-600">
          {icon}
        </div>
      )}
    </div>
  </div>
);

export default Dashboard;
