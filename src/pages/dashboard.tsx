
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FiUsers, FiCalendar, FiBook,
  FiBarChart2, FiBell, FiMail,
  FiPieChart, FiPlus, FiChevronRight
} from 'react-icons/fi';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

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
  const [totalEmployees, setTotalEmployees] = useState<number | null>(null);
  const [incomeToday, setIncomeToday] = useState<{
    amountPaidToday: number;
    totalDiscountToday: number;
    unpaidBalance: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [monthlyIncome, setMonthlyIncome] = useState<any>(null);
  const [classPaymentData, setClassPaymentData] = useState<ClassPaymentResponse | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [studentsRes, employeesRes, absentRes, incomeRes] = await Promise.all([
          axios.get("http://localhost:4000/student/studentList"),
          axios.get("http://localhost:4000/user/employees"),
          axios.get("http://localhost:4000/student/attendance/absent-today"),
          axios.get("http://localhost:4000/fee/income/today")
        ]);

        // Process student data
        const students = studentsRes.data;
        setTotalStudents(students.length);
        setMaleCount(students.filter((s: any) => s.gender === "Male").length);
        setFemaleCount(students.filter((s: any) => s.gender === "Female").length);

        // Process employee data
        setTotalEmployees(employeesRes.data.employees.length);

        // Process absent data
        const absentStudents = absentRes.data.students || [];
        const classAbsents: Record<string, number> = {};
        absentStudents.forEach((s: any) => {
          classAbsents[s.className] = (classAbsents[s.className] || 0) + 1;
        });
        setAbsents(Object.entries(classAbsents).map(([className, count]) => ({ className, count })));
        setTotalAbsent(absentRes.data.totalAbsent || 0);

        // Process today's income
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
          axios.get<ClassPaymentResponse>(`http://localhost:4000/fee/Classfee/status?month=${month}&year=${year}`)
        ]);
        
        setMonthlyIncome(monthlyIncomeRes.data);
        setClassPaymentData(classPaymentRes.data);
        setLoading(prev => ({ 
          ...prev, 
          monthlyIncome: false, 
          classPayment: false 
        }));
      } catch (err) {
        setError("Failed to load monthly data. Please try again.");
        setLoading(prev => ({ 
          ...prev, 
          monthlyIncome: false, 
          classPayment: false 
        }));
      }
    };

    fetchData();
    fetchMonthlyData();
  }, []);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        setLoading(prev => ({ ...prev, monthlyIncome: true, classPayment: true }));
        const [monthlyIncomeRes, classPaymentRes] = await Promise.all([
          axios.get(`http://localhost:4000/fee/income-required?month=${month}&year=${year}`),
          axios.get<ClassPaymentResponse>(`http://localhost:4000/fee/Classfee/status?month=${month}&year=${year}`)
        ]);
        
        setMonthlyIncome(monthlyIncomeRes.data);
        setClassPaymentData(classPaymentRes.data);
        setLoading(prev => ({ 
          ...prev, 
          monthlyIncome: false, 
          classPayment: false 
        }));
      } catch (err) {
        setError("Failed to load monthly data. Please try again.");
        setLoading(prev => ({ 
          ...prev, 
          monthlyIncome: false, 
          classPayment: false 
        }));
      }
    };

    fetchMonthlyData();
  }, [month, year]);

  const stats = [
    {
      title: "Student Summary",
      value: totalStudents ?? "--",
      details: [
        {
          label: "Male",
          value: maleCount && totalStudents ? `${maleCount} (${((maleCount / totalStudents) * 100).toFixed(1)}%)` : "--",
          color: "text-blue-600"
        },
        {
          label: "Female",
          value: femaleCount && totalStudents ? `${femaleCount} (${((femaleCount / totalStudents) * 100).toFixed(1)}%)` : "--",
          color: "text-pink-600"
        }
      ],
      icon: <FiUsers className="text-blue-600" size={24} />,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100"
    },
    {
      title: "Staff Summary",
      value: totalEmployees ?? "--",
      details: [],
      icon: <HiOutlineAcademicCap className="text-orange-600" size={24} />,
      bgColor: "bg-orange-50",
      borderColor: "border-orange-100"
    },
    {
      title: "Attendance Today",
      value: `${totalAbsent} Absent`,
      details: [],
      icon: <FiCalendar className="text-red-600" size={24} />,
      bgColor: "bg-red-50",
      borderColor: "border-red-100"
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
      bgColor: "bg-green-50",
      borderColor: "border-green-100"
    }
  ];

  const quickActions = [
    { title: "Today Absent", icon: <FiCalendar size={18} />, action: () => navigate("/dashboard/TodayAbsent") },
    { title: "Register Exam", icon: <FiBook size={18} />, action: () => navigate("/dashboard/ExamRoute") },
    { title: "Add Student", icon: <FiPlus size={18} />, action: () => navigate("/dashboard/regstd") },
    { title: "View Reports", icon: <FiBarChart2 size={18} />, action: () => navigate("/dashboard/ExamPerformance") }
  ];

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">{dayjs().format("dddd, MMMM D, YYYY")}</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
            <FiBell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
            <FiMail size={20} />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className={`bg-white p-5 rounded-xl border ${stat.borderColor} shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mb-3">{stat.value}</p>
                {stat.details?.map((d, j) => (
                  <div key={j} className="flex justify-between text-sm mb-1 last:mb-0">
                    <span className="text-gray-500">{d.label}</span>
                    <span className={`font-medium ${d.color}`}>{d.value}</span>
                  </div>
                ))}
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((act, i) => (
            <button
              key={i}
              onClick={act.action}
              className="group bg-white hover:bg-indigo-50 p-4 rounded-lg border border-gray-200 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {act.icon}
                </div>
                <span className="font-medium text-gray-700 group-hover:text-indigo-700">{act.title}</span>
              </div>
              <FiChevronRight className="text-gray-400 group-hover:text-indigo-600" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Absent Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Absent Breakdown by Class</h3>
              <p className="text-sm text-gray-500">{dayjs().format("MMMM D, YYYY")}</p>
            </div>
            <button 
              onClick={() => navigate("/dashboard/TodayAbsent")}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              View All
            </button>
          </div>
          
          {loading.absents ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : absents.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {absents.map((a, i) => (
                <div 
                  key={i} 
                  className="bg-red-50 p-4 rounded-lg border border-red-100 hover:border-red-200 transition-colors"
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
            <div className="text-center py-8 text-gray-500">
              No absences recorded today
            </div>
          )}
        </div>

        {/* Monthly Income Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Monthly Income Overview</h3>
              <p className="text-sm text-gray-500">{dayjs().month(month-1).format("MMMM YYYY")}</p>
            </div>
            <div className="flex gap-2">
              <select 
                value={month} 
                onChange={(e) => setMonth(+e.target.value)} 
                className="border px-3 py-1.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{dayjs().month(i).format("MMMM")}</option>
                ))}
              </select>
              <select 
                value={year} 
                onChange={(e) => setYear(+e.target.value)} 
                className="border px-3 py-1.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
              >
                {Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {loading.monthlyIncome ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((_, i) => (
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
                title="Current month balance" 
                value={`$${monthlyIncome.balance?.toFixed(2) || '0.00'}`}
                icon={<FiPieChart className="text-red-600" />}
              />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No income data available
            </div>
          )}

          {monthlyIncome?.message && (
            <p className="text-sm text-gray-600 mt-4">{monthlyIncome.message}</p>
          )}
        </div>
      </div>

      {/* Class Payment Summary Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Class Payment Summary</h1>
          <button 
            onClick={toggleDetails}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
        
        <div className="mb-4 flex gap-4">
          <select 
            value={month} 
            onChange={(e) => setMonth(+e.target.value)} 
            className="border px-3 py-2 rounded-lg shadow-sm text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{dayjs().month(i).format("MMMM")}</option>
            ))}
          </select>
          <select 
            value={year} 
            onChange={(e) => setYear(+e.target.value)} 
            className="border px-3 py-2 rounded-lg shadow-sm text-sm"
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
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 font-semibold">Class</th>
                    <th className="px-4 py-2">Students</th>
                    <th className="px-4 py-2">Required</th>
                    <th className="px-4 py-2">Paid</th>
                    <th className="px-4 py-2">Unpaid</th>
                    <th className="px-4 py-2">Balance</th>
                    <th className="px-4 py-2">Paid %</th>
                  </tr>
                </thead>
                <tbody>
                  {classPaymentData.summary.map((item, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">{item.className}</td>
                      <td className="px-4 py-2">{item.totalStudents}</td>
                      <td className="px-4 py-2">${item.totalRequired.toFixed(2)}</td>
                      <td className="px-4 py-2 text-green-600">${item.totalPaid.toFixed(2)}</td>
                      <td className="px-4 py-2 text-orange-600">${item.totalPastUnpaid.toFixed(2)}</td>
                      <td className="px-4 py-2 text-red-600">${item.totalBalanceDue.toFixed(2)}</td>
                      <td className="px-4 py-2 font-semibold">{item.percentagePaid.toFixed(1)}%</td>
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
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 font-semibold">Student</th>
                        <th className="px-4 py-2">Class</th>
                        <th className="px-4 py-2">Current Due</th>
                        <th className="px-4 py-2">Paid</th>
                        <th className="px-4 py-2">Past Unpaid</th>
                        <th className="px-4 py-2">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classPaymentData.students.map((student, idx) => (
                        <tr key={idx} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2 font-medium text-gray-900">{student.name}</td>
                          <td className="px-4 py-2">{student.className}</td>
                          <td className="px-4 py-2">${student.currentMonthDue.toFixed(2)}</td>
                          <td className="px-4 py-2 text-green-600">${student.currentMonthPaid.toFixed(2)}</td>
                          <td className="px-4 py-2 text-orange-600">${student.pastUnpaidBalance.toFixed(2)}</td>
                          <td className="px-4 py-2 text-red-600">${student.balanceDue.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10 text-gray-500">No class payment summary available.</div>
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
  title: string, 
  value: string | number, 
  description?: string, 
  icon?: React.ReactNode 
}) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors">
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

export default Dashboard;
