
// import React, { useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "../../Redux/store";
// import {
//   getIncomeStatement,
//   getQuarterlyIncomeStatement,
//   getYearlyIncomeStatement,
//   selectFinancialReports,
// } from "./financialSlice"; // Corrected import path for financialSlice
// import { Skeleton } from "@mui/material";
// import { toast } from "react-hot-toast";

// interface Props {
//   type: "month" | "quarter" | "year";
//   value: number; // month number or quarter number
//   year: number;
// }

// const IncomeStatementReport: React.FC<Props> = ({ type, value, year }) => {
//   const dispatch = useAppDispatch();
//   const { incomeStatement, loading, error } = useAppSelector(selectFinancialReports);

//   useEffect(() => {
//     if (type === "month") {
//       dispatch(getIncomeStatement({ month: value, year }));
//     } else if (type === "quarter") {
//       dispatch(getQuarterlyIncomeStatement({ quarter: value, year }));
//     } else if (type === "year") {
//       dispatch(getYearlyIncomeStatement({ year }));
//     }
//   }, [type, value, year, dispatch]);

//   useEffect(() => {
//     if (error) toast.error(error);
//   }, [error]);

//   return (
//     <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md w-full max-w-4xl mx-auto mt-6">
//       <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
//         Income Statement –{" "}
//         {type === "month"
//           ? `Month ${value}`
//           : type === "quarter"
//           ? `Quarter ${value}`
//           : `Year ${year}`}{" "}
//         {type !== "year" && `(${year})`}
//       </h2>

//       {loading || !incomeStatement ? (
//         <div className="space-y-3">
//           {[...Array(9)].map((_, i) => (
//             <Skeleton key={i} variant="rectangular" height={30} className="rounded-md" /> // Added rounded-md for better aesthetics
//           ))}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 text-[15px] leading-6">
//           <div><strong>Current Income:</strong> ${incomeStatement.currentIncome.toFixed(2)}</div>
//           <div><strong>Previous Income:</strong> ${incomeStatement.previousIncome.toFixed(2)}</div>
//           <div><strong>Advance Income:</strong> ${incomeStatement.advanceIncome.toFixed(2)}</div>
//           <div><strong>Total Revenue:</strong> ${incomeStatement.totalRevenue.toFixed(2)}</div>
//           <div><strong>Total Discounts:</strong> ${incomeStatement.totalDiscounts.toFixed(2)}</div>
//           <div><strong>Net Revenue:</strong> ${incomeStatement.netRevenue.toFixed(2)}</div>
//           <div><strong>Total Expenses:</strong> ${incomeStatement.totalExpenses.toFixed(2)}</div>
//           <div><strong>Employee Advances:</strong> ${incomeStatement.totalEmployeeAdvances.toFixed(2)}</div>
//           <div className="col-span-2 text-lg mt-4 text-green-600 dark:text-green-400 font-semibold">
//             <strong>Net Income:</strong> ${incomeStatement.netIncome.toFixed(2)}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default IncomeStatementReport;