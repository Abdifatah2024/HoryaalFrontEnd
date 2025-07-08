import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  fetchClassAttendanceSummary,
  clearAttendanceState,
} from "../../Redux/Attedence/AttendancePeClassSlice";


interface ClassSummaryItem {
  classId: number
  className: string;
  totalAbsentDays: number;
}


export const ClassAbsentDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { classSummary, loading, errorMessage } = useAppSelector(
    (state) => state.attendance
  );

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState<number>(currentMonth);
  const [year, setYear] = useState<number>(currentYear);

  const handleFetch = () => {
    dispatch(fetchClassAttendanceSummary({ month, year }));
  };

useEffect(() => {

  const handleFetch = () => {
    dispatch(fetchClassAttendanceSummary({ month, year }));
  };

  handleFetch();
  return () => {
    dispatch(clearAttendanceState());
  };
}, [dispatch, month, year]); 

  // Group by Form
  const grouped: { [key: string]: ClassSummaryItem[] } = {
    FormOne: classSummary
      ? classSummary.filter((c) => c.className.startsWith("1"))
      : [],
    FormTwo: classSummary
      ? classSummary.filter((c) => c.className.startsWith("2"))
      : [],
    FormThree: classSummary
      ? classSummary.filter((c) => c.className.startsWith("3"))
      : [],
    FormFour: classSummary
      ? classSummary.filter((c) => c.className.startsWith("4"))
      : [],
  };

  const formTitles = ["Form One", "Form Two", "Form Three", "Form Four"];

  return (
    <div className="min-h-screen bg-gray-50 p-8 md:p-12">
      {/* Dashboard Header */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-8">
        Class Absence Dashboard
      </h1>

      {/* Controls Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 bg-white p-6 rounded-lg mb-8 shadow-sm border border-gray-200">
        <label htmlFor="month-select" className="text-lg font-medium text-gray-700">Select Month:</label>
        <select
          id="month-select"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 md:min-w-[120px]"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("en-US", { month: "long" })}
            </option>
          ))}
        </select>

        <label htmlFor="year-select" className="text-lg font-medium text-gray-700 md:ml-4">Select Year:</label>
        <select
          id="year-select"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 md:min-w-[100px]"
        >
          {[2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <button
          onClick={handleFetch}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300 ease-in-out md:ml-6"
        >
          Load Report
        </button>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center items-center my-8">
          {/* Simple loading spinner - Tailwind doesn't provide one directly */}
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="ml-4 text-xl text-gray-600">Loading data...</p>
        </div>
      )}
      {errorMessage && (
        <p className="text-red-600 text-center text-xl font-medium my-8">
          {errorMessage}
        </p>
      )}

      {/* Cards Grid */}
      {!loading && !errorMessage && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(grouped).map(([formKey, classes], index) => (
            <div
              key={formKey}
              className="flex flex-col bg-white p-6 rounded-lg border border-gray-200 hover:scale-[1.01] transition-transform duration-200 ease-out"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
                {formTitles[index]}
              </h2>
              <div className="flex-grow overflow-y-auto max-h-96"> {/* max-h-96 for fixed height with scroll */}
                {classes.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No absence data for this form.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {classes
                      .sort((a, b) => b.totalAbsentDays - a.totalAbsentDays)
                      .map((cls) => (
                        <li
                          key={cls.classId}
                          className="bg-blue-50 p-3 rounded-md flex justify-between items-center"
                        >
                          <span className="text-gray-800 font-medium">
                            {cls.className}
                          </span>
                          <span className="text-red-600 font-bold text-lg">
                            {cls.totalAbsentDays}
                          </span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};