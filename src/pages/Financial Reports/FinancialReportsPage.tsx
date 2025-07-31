import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  getIncomeStatement,
  getCashFlow,
} from "../Financial Reports/financialSlice";
import {
  ChevronRight,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  TrendingDown,
  Wallet,
  Banknote,
} from "lucide-react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const FinancialReportsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { incomeStatement, cashFlow, loading, error } = useAppSelector(
    (state) => state.financial
  );

  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    dispatch(getIncomeStatement({ month, year }));
    dispatch(getCashFlow({ month, year }));
  }, [dispatch, month, year]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Financial Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Comprehensive overview of your financial performance
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="grid gap-1.5">
            <label
              htmlFor="month"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Month
            </label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 py-2 pl-3 pr-8 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
            >
              {months.map((monthName, index) => (
                <option key={index} value={index + 1}>
                  {monthName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-1.5">
            <label
              htmlFor="year"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Year
            </label>
            <input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(+e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 py-2 px-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
              min="2000"
              max="2100"
            />
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 mb-6 border border-red-200 dark:border-red-800/50">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error loading financial data
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Financial Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Income Statement Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-xl">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Income Statement
                </h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {months[month - 1]} {year}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
              Monthly
            </div>
          </div>

          {loading ? (
            <div className="space-y-5 py-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/5 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : incomeStatement ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">
                  Current Month Income
                </span>
                <span className="font-medium">
                  {formatCurrency(incomeStatement.currentIncome)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">
                  Previous Income
                </span>
                <span className="font-medium">
                  {formatCurrency(incomeStatement.previousIncome)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-300">
                  Advance Income
                </span>
                <span className="font-medium">
                  {formatCurrency(incomeStatement.advanceIncome)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">
                  Total Revenue
                </span>
                <span className="font-medium">
                  {formatCurrency(incomeStatement.totalRevenue)}
                </span>
              </div>
              <div
                className="flex justify-between items-center cursor-pointer group"
                onClick={() => navigate("/dashboard/DiscountList")}
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-300 group-hover:underline group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Discount
                  </span>
                  <ChevronRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="font-medium text-red-500 group-hover:text-red-700 dark:group-hover:text-red-400">
                  {formatCurrency(incomeStatement.totalDiscounts)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-300">
                  Net Revenue
                </span>
                <span className="font-medium">
                  {formatCurrency(incomeStatement.netRevenue)}
                </span>
              </div>
              <div
                className="flex justify-between items-center cursor-pointer group"
                onClick={() => navigate("/dashboard/ExpensesSummary")}
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-300 group-hover:underline group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Total Expenses & Advances
                  </span>
                  <ChevronRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="font-medium text-red-500 group-hover:text-red-700 dark:group-hover:text-red-400">
                  {formatCurrency(
                    incomeStatement.totalExpenses +
                      incomeStatement.totalEmployeeAdvances
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 mt-3 border-t border-gray-100 dark:border-gray-700">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Net Income
                </span>
                <span
                  className={`text-xl font-bold flex items-center ${
                    incomeStatement.netIncome >= 0
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {incomeStatement.netIncome >= 0 ? (
                    <ArrowUp className="mr-1" />
                  ) : (
                    <ArrowDown className="mr-1" />
                  )}
                  {formatCurrency(incomeStatement.netIncome)}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No income data available
              </p>
            </div>
          )}
        </div>

        {/* Cash Flow Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-xl">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                  <Banknote className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Cash Flow
                </h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {months[month - 1]} {year}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
              Monthly
            </div>
          </div>

          {loading ? (
            <div className="space-y-5 py-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/5 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : cashFlow ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-300">
                  Cash Inflow
                </span>
                <span className="font-medium text-green-500 flex items-center">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  {formatCurrency(cashFlow.cashInflow)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">
                  Cash Outflow
                </span>
                <span className="font-medium text-red-500 flex items-center">
                  <ArrowDown className="mr-1 h-4 w-4" />
                  {formatCurrency(
                    cashFlow.advanceOutflow + cashFlow.expenseOutflow
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 mt-3 border-t border-gray-100 dark:border-gray-700">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Net Cash Flow
                </span>
                <span
                  className={`text-xl font-bold flex items-center ${
                    cashFlow.netCashFlow >= 0
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {cashFlow.netCashFlow >= 0 ? (
                    <TrendingUp className="mr-1" />
                  ) : (
                    <TrendingDown className="mr-1" />
                  )}
                  {formatCurrency(cashFlow.netCashFlow)}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No cash flow data available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialReportsPage;


