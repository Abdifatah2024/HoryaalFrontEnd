import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../Redux/store";
import {
  fetchBusFeeExemptions,
  selectBusFeeStudents,
} from "../Redux/Auth/busFeeSlice";

const BusFeeExemptions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { students, loading, error } = useSelector(selectBusFeeStudents);

  useEffect(() => {
    dispatch(fetchBusFeeExemptions());
  }, [dispatch]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          🎓 Students with Free or Partial Bus Fee
        </h1>

        {loading && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-blue-600 font-medium">Loading students...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
            {error}
          </div>
        )}

        {!loading && students.length === 0 && (
          <p className="text-gray-600 text-center">No students found.</p>
        )}

        {!loading && students.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300 dark:border-gray-700 rounded-md shadow-sm">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
                <tr>
                  <th className="px-4 py-3 border">#</th>
                  <th className="px-4 py-3 border text-left">Full Name</th>
                  <th className="px-4 py-3 border text-left">Phone</th>
                  <th className="px-4 py-3 border text-left">Class</th>
                  <th className="px-4 py-3 border text-left">Bus</th>
                  <th className="px-4 py-3 border text-center">Fee</th>
                  <th className="px-4 py-3 border text-center">Bus Fee</th>
                  <th className="px-4 py-3 border text-left">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {students.map((student, index) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-4 py-3 border text-center text-sm font-medium">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 border">{student.fullname}</td>
                    <td className="px-4 py-3 border">{student.phone}</td>
                    <td className="px-4 py-3 border">{student.classes.name}</td>
                    <td className="px-4 py-3 border">{student.bus}</td>
                    <td className="px-4 py-3 border text-center">
                      {student.fee}
                    </td>
                    <td className="px-4 py-3 border text-center">
                      {student.busFee}
                    </td>
                    <td className="px-4 py-3 border text-sm text-gray-700 dark:text-gray-200">
                      {student.FreeReason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-sm text-gray-500 mt-4">
              Showing {students.length} student
              {students.length > 1 ? "s" : ""}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusFeeExemptions;
