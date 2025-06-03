import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  getIncomeStatement,
  getBalanceSheet,
  getCashFlow,
} from "../Financial Reports/financialSlice";
import { AlertCircle } from "lucide-react";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const FinancialReportsPage = () => {
  const dispatch = useAppDispatch();
  const { incomeStatement, balanceSheet, cashFlow, loading, error } =
    useAppSelector((state) => state.financial);

  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    dispatch(getIncomeStatement({ month, year }));
    dispatch(getBalanceSheet());
    dispatch(getCashFlow({ month, year }));
  }, [dispatch, month, year]);

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">📊 Financial Reports</h1>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="grid gap-1.5">
            <label htmlFor="month" className="text-sm font-medium text-gray-700">Month</label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-8 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {months.map((monthName, index) => (
                <option key={index} value={index + 1}>
                  {monthName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid gap-1.5">
            <label htmlFor="year" className="text-sm font-medium text-gray-700">Year</label>
            <input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(+e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 px-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="2000"
              max="2100"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Income Statement */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Income Statement</h2>
          {loading ? (
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
          ) : incomeStatement ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Income:</span>
                <span className="font-medium">${incomeStatement.netRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Expense:</span>
                <span className="font-medium">${incomeStatement.totalExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Advance:</span>
                <span className="font-medium">${incomeStatement.totalAdvances.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                <span className="text-gray-800 font-semibold">Net Income:</span>
                <span className={`font-bold ${
                  incomeStatement.netIncome >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${incomeStatement.netIncome.toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>

        {/* Balance Sheet */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Balance Sheet</h2>
          {loading ? (
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
          ) : balanceSheet ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Assets:</span>
                <span className="font-medium">${balanceSheet.totalAssets.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Liabilities:</span>
                <span className="font-medium">${balanceSheet.totalLiabilities.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                <span className="text-gray-800 font-semibold">Equity:</span>
                <span className={`font-bold ${
                  balanceSheet.equity >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${balanceSheet.equity.toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>

        {/* Cash Flow */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Cash Flow</h2>
          {loading ? (
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
          ) : cashFlow ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Cash In:</span>
                <span className="font-medium text-green-600">+${cashFlow.cashInflow.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cash Out:</span>
                <span className="font-medium text-red-600">
                  -${(cashFlow.advanceOutflow + cashFlow.expenseOutflow).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                <span className="text-gray-800 font-semibold">Net Cash Flow:</span>
                <span className={`font-bold ${
                  cashFlow.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${cashFlow.netCashFlow.toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialReportsPage;