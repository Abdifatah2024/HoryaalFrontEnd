import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { getExpenseSummary } from "../../Redux/Expense/ExpenseSlice";
import { FiLoader, FiAlertCircle, FiPieChart, FiDollarSign, FiChevronDown, FiCalendar } from "react-icons/fi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4"];

const ExpenseSummaryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { expenseCategorySummary, loading, error } = useAppSelector((state) => state.expenses);
  
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  useEffect(() => {
    dispatch(getExpenseSummary({
      month: selectedMonth,
      year: selectedYear
    }));
  }, [dispatch, selectedMonth, selectedYear]);

  // Prepare chart data
  const chartData = expenseCategorySummary?.categorySummary.map(item => ({
    name: item.category,
    value: item.amount
  })) || [];

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{payload[0].name}</p>
          <p className="text-indigo-600 dark:text-indigo-400 font-semibold">
            ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Month names for dropdown
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Generate years (current year - 5 to current year + 1)
  const currentYear = currentDate.getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Monthly Expense Summary</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Overview of your spending patterns</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-6 sm:mt-0">
          {/* Month Selector */}
          <div className="relative">
            <button
              onClick={() => setIsMonthOpen(!isMonthOpen)}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 shadow-sm hover:border-indigo-500 transition-colors min-w-[180px]"
            >
              <FiCalendar className="text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {months[selectedMonth - 1]}
              </span>
              <FiChevronDown className={`text-gray-500 dark:text-gray-400 ml-auto transition-transform ${isMonthOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isMonthOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => {
                      setSelectedMonth(index + 1);
                      setIsMonthOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors ${
                      selectedMonth === index + 1 
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Year Selector */}
          <div className="relative">
            <button
              onClick={() => setIsYearOpen(!isYearOpen)}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 shadow-sm hover:border-indigo-500 transition-colors min-w-[120px]"
            >
              <FiCalendar className="text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">{selectedYear}</span>
              <FiChevronDown className={`text-gray-500 dark:text-gray-400 ml-auto transition-transform ${isYearOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isYearOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setIsYearOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors ${
                      selectedYear === year 
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FiLoader className="animate-spin text-4xl text-indigo-600 dark:text-indigo-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading expense data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 text-red-800 dark:text-red-200">
            <FiAlertCircle className="text-xl flex-shrink-0" />
            <div>
              <h3 className="font-medium text-lg">Error loading expenses</h3>
              <p className="mt-1 text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      ) : expenseCategorySummary ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
              <FiPieChart className="mr-2 text-indigo-600 dark:text-indigo-400" />
              {months[selectedMonth - 1]} {selectedYear}
            </h2>
            
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 rounded-2xl shadow-lg">
              <p className="text-white text-sm font-medium">TOTAL EXPENSES</p>
              <div className="flex items-center mt-1">
                <FiDollarSign className="text-white text-xl" />
                <span className="text-white text-3xl font-bold ml-1">
                  {expenseCategorySummary.totalExpenses.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Expense Breakdown</h3>
              <ul className="space-y-4">
                {expenseCategorySummary.categorySummary.map((item, index) => (
                  <li key={item.category} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-gray-700 dark:text-gray-300">{item.category}</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${item.amount.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-col">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Visual Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">No expense data available for this period</p>
          <button 
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            onClick={() => dispatch(getExpenseSummary({
              month: selectedMonth,
              year: selectedYear
            }))}
          >
            Refresh Data
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseSummaryPage;