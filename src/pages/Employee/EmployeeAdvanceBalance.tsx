// import  { useState } from "react";
// import { useAppDispatch, useAppSelector } from "../../Redux/store";
// import { fetchEmployeeAdvanceBalance } from "../../Redux/Epmloyee/employeeAdvanceSlice";
// import {
//   FiSearch,
//   FiUser,
//   FiCalendar,
//   FiDollarSign,
//   FiPercent,
  
// } from "react-icons/fi"; // Importing icons from react-icons/fi

// const EmployeeAdvanceBalance = () => {
//   const dispatch = useAppDispatch();
//   const { advanceBalance, loading, error } = useAppSelector(
//     (state) => state.employeeAdvance
//   );

//   const [employeeId, setEmployeeId] = useState<number | undefined>(undefined);
//   const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
//   const [year, setYear] = useState<number>(new Date().getFullYear());

//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i); // 2 years back, current, 2 years forward

//   const handleFetch = () => {
//     if (employeeId && month && year) {
//       dispatch(fetchEmployeeAdvanceBalance({ employeeId, month, year }));
//     } else {
//       // Basic validation feedback
//       alert("Please enter Employee ID, Month, and Year."); // Using alert for simplicity, would replace with toast in a real app
//     }
//   };

//   // Helper to format currency
//   const formatCurrency = (value: number) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//     }).format(value);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 sm:p-8 font-inter">
//       <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-10 border border-gray-100">
//         {/* Header Section */}
//         <div className="mb-8 text-center">
//           <h2 className="text-4xl font-extrabold text-gray-900 flex items-center justify-center gap-4">
//             <FiDollarSign className="text-green-600 text-5xl" /> Employee Advance Balance
//           </h2>
//           <p className="text-gray-600 mt-2 text-lg">
//             Track employee advance payments and remaining balances.
//           </p>
//         </div>

//         {/* Input and Fetch Section */}
//         <div className="bg-blue-50 p-6 rounded-lg shadow-inner border border-blue-200 mb-8">
//           <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
//             <FiSearch className="text-blue-600" /> Find Balance
//           </h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
//             {/* Employee ID Input */}
//             <div>
//               <label
//                 htmlFor="employeeId"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 <FiUser className="inline-block mr-1 text-gray-500" /> Employee ID
//               </label>
//               <input
//                 id="employeeId"
//                 type="number"
//                 placeholder="e.g., 101"
//                 onChange={(e) => setEmployeeId(Number(e.target.value))}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200 shadow-sm"
//               />
//             </div>

//             {/* Month Select */}
//             <div>
//               <label
//                 htmlFor="month-select"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 <FiCalendar className="inline-block mr-1 text-gray-500" /> Month
//               </label>
//               <select
//                 id="month-select"
//                 value={month}
//                 onChange={(e) => setMonth(Number(e.target.value))}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200 shadow-sm appearance-none bg-white pr-8"
//               >
//                 {[...Array(12)].map((_, i) => (
//                   <option key={i + 1} value={i + 1}>
//                     {new Date(0, i).toLocaleString("default", { month: "long" })}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Year Select */}
//             <div>
//               <label
//                 htmlFor="year-select"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 <FiCalendar className="inline-block mr-1 text-gray-500" /> Year
//               </label>
//               <select
//                 id="year-select"
//                 value={year}
//                 onChange={(e) => setYear(Number(e.target.value))}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200 shadow-sm appearance-none bg-white pr-8"
//               >
//                 {years.map((y) => (
//                   <option key={y} value={y}>
//                     {y}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Fetch Button */}
//             <button
//               onClick={handleFetch}
//               className="col-span-full lg:col-span-1 bg-blue-600 text-white px-6 py-3 rounded-md font-bold hover:bg-blue-700 transition duration-300 ease-in-out flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={loading || !employeeId || !month || !year}
//             >
//               {loading ? (
//                 <>
//                   <svg
//                     className="animate-spin h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Fetching...
//                 </>
//               ) : (
//                 "Fetch Balance"
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Loading, Error, and Results Display */}
//         {loading && (
//           <div className="flex items-center justify-center py-8">
//             <svg
//               className="animate-spin h-8 w-8 text-blue-500 mr-3"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               ></circle>
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//               ></path>
//             </svg>
//             <p className="text-lg text-gray-700">Loading balance details...</p>
//           </div>
//         )}

//         {error && (
//           <div
//             className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative shadow-md"
//             role="alert"
//           >
//             <strong className="font-bold">Error!</strong>
//             <span className="block sm:inline ml-2">{error}</span>
//           </div>
//         )}

//         {advanceBalance && (
//           <div className="mt-8 bg-white p-8 rounded-lg shadow-xl border border-green-100 animate-fadeIn">
//             <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-3">
//               <FiUser className="text-purple-600 text-3xl" />{" "}
//               {advanceBalance.name}'s Advance Summary
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div className="flex items-center p-4 bg-gray-50 rounded-md shadow-sm">
//                 <FiDollarSign className="text-blue-500 text-3xl mr-4" />
//                 <div>
//                   <p className="text-sm text-gray-600">Monthly Salary</p>
//                   <p className="text-xl font-bold text-gray-900">
//                     {formatCurrency(advanceBalance.salary)}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center p-4 bg-gray-50 rounded-md shadow-sm">
//                 <FiDollarSign className="text-green-500 text-3xl mr-4" />
//                 <div>
//                   <p className="text-sm text-gray-600">Total Advance Taken</p>
//                   <p className="text-xl font-bold text-gray-900">
//                     {formatCurrency(advanceBalance.totalAdvance)}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Highlighted Remaining Balance */}
//             <div className="p-6 bg-green-50 rounded-lg border border-green-200 shadow-lg text-center mb-6">
//               <div className="flex items-center justify-center gap-4 mb-2">
//                 <FiDollarSign className="text-green-700 text-4xl" />
//                 <p className="text-2xl font-semibold text-green-800">Remaining Balance:</p>
//               </div>
//               <p className="text-5xl font-extrabold text-green-900">
//                 {formatCurrency(advanceBalance.remainingBalance)}
//               </p>
//             </div>

//             {/* Percentage Used Progress Bar */}
//             <div className="mb-4">
//               <div className="flex justify-between items-center mb-2">
//                 <p className="text-sm font-medium text-gray-700 flex items-center">
//                   <FiPercent className="inline-block mr-2" />
//                   Advance Used
//                 </p>
//                 <span className="text-lg font-bold text-blue-700">
//                   {advanceBalance.percentUsed}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-3">
//                 <div
//                   className="bg-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
//                   style={{ width: `${advanceBalance.percentUsed}%` }}
//                 ></div>
//               </div>
//             </div>

//             <div className="text-right text-gray-500 text-sm mt-8 pt-4 border-t border-gray-100">
//               <p>
//                 Data for {new Date(year, month - 1).toLocaleString("default", { month: "long" })}{" "}
//                 {year}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmployeeAdvanceBalance;
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { fetchEmployeeAdvanceBalance } from "../../Redux/Epmloyee/employeeAdvanceSlice";
import axios from "axios";
import {
  FiSearch,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiPercent,
} from "react-icons/fi";
import { BASE_API_URL } from "../../Constant";

interface EmployeeOption {
  id: number;
  fullName: string;
}

const EmployeeAdvanceBalance = () => {
  const dispatch = useAppDispatch();
  const { advanceBalance, loading, error } = useAppSelector(
    (state) => state.employeeAdvance
  );

  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [employeeId, setEmployeeId] = useState<number | undefined>();
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  useEffect(() => {
    axios
      .get(`${BASE_API_URL}/user/employees`)
      .then((res) => {
        setEmployees(res.data.employees || []);
      })
      .catch((err) => {
        console.error("Failed to fetch employees", err);
      });
  }, []);

  const handleFetch = () => {
    if (employeeId && month && year) {
      dispatch(fetchEmployeeAdvanceBalance({ employeeId, month, year }));
    } else {
      alert("Please select Employee, Month, and Year.");
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 sm:p-8 font-inter">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-10 border border-gray-100">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 flex items-center justify-center gap-4">
            <FiDollarSign className="text-green-600 text-5xl" />
            Employee Advance Balance
          </h2>
          <p className="text-gray-600 mt-2 text-lg">
            Track employee advance payments and remaining balances.
          </p>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg shadow-inner border border-blue-200 mb-8">
          <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
            <FiSearch className="text-blue-600" /> Find Balance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FiUser className="inline-block mr-1 text-gray-500" /> Select
                Employee
              </label>
              <select
                value={employeeId ?? ""}
                onChange={(e) =>
                  setEmployeeId(e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              >
                <option value="">-- Select Employee --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FiCalendar className="inline-block mr-1 text-gray-500" /> Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FiCalendar className="inline-block mr-1 text-gray-500" /> Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleFetch}
              disabled={loading || !employeeId}
              className="col-span-full lg:col-span-1 bg-blue-600 text-white px-6 py-3 rounded-md font-bold hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Fetching...
                </>
              ) : (
                "Fetch Balance"
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <strong className="font-bold">Error!</strong>
            <span className="ml-2">{error}</span>
          </div>
        )}

        {advanceBalance && (
          <div className="mt-8 bg-white p-8 rounded-lg shadow-xl border border-green-100 animate-fadeIn">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-3">
              <FiUser className="text-purple-600 text-3xl" />{" "}
              {advanceBalance.name}'s Advance Summary
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center p-4 bg-gray-50 rounded-md shadow-sm">
                <FiDollarSign className="text-blue-500 text-3xl mr-4" />
                <div>
                  <p className="text-sm text-gray-600">Monthly Salary</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(advanceBalance.salary)}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-md shadow-sm">
                <FiDollarSign className="text-green-500 text-3xl mr-4" />
                <div>
                  <p className="text-sm text-gray-600">Total Advance Taken</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(advanceBalance.totalAdvance)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-green-50 rounded-lg border border-green-200 shadow-lg text-center mb-6">
              <div className="flex items-center justify-center gap-4 mb-2">
                <FiDollarSign className="text-green-700 text-4xl" />
                <p className="text-2xl font-semibold text-green-800">Remaining Balance:</p>
              </div>
              <p className="text-5xl font-extrabold text-green-900">
                {formatCurrency(advanceBalance.remainingBalance)}
              </p>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700 flex items-center">
                  <FiPercent className="inline-block mr-2" />
                  Advance Used
                </p>
                <span className="text-lg font-bold text-blue-700">
                  {advanceBalance.percentUsed}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${advanceBalance.percentUsed}` }}
                ></div>
              </div>
            </div>

            <div className="text-right text-gray-500 text-sm mt-8 pt-4 border-t border-gray-100">
              <p>
                Data for{" "}
                {new Date(year, month - 1).toLocaleString("default", { month: "long" })}{" "}
                {year}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeAdvanceBalance;
