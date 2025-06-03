import React, { useEffect, useState } from "react";
import {
  FiUsers, FiCalendar, FiMessageSquare, FiDollarSign, FiBell,
  FiUser, FiChevronDown, FiClock, FiCheckCircle, FiXCircle, FiInfo
} from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  fetchMyStudents,
  fetchStudentAttendance
} from "../../Redux/Parent/ParentstudentSlice";

// interface Student {
//   id: number;
//   fullname: string;
//   gender: string;
//   phone: string;
//   Age: string;
//   address: string;
//   classes?: { name: string };
//   attendance?: Array<{
//     id: number;
//     date: string;
//     present: boolean;
//     remark?: string;
//   }>;
// }

const ParentDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { students, loading, error, attendanceLoading, attendanceError } = useAppSelector((state) => state.students);

  useEffect(() => {
    dispatch(fetchMyStudents());
    dispatch(fetchStudentAttendance());
  }, [dispatch]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Parent Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-4 items-center">
          <button className="relative p-3 bg-white rounded-full shadow-md hover:shadow-lg">
            <FiBell className="text-gray-600 text-lg" />
            <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="flex items-center gap-3 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-md">
            <div className="bg-indigo-500 p-2 rounded-full">
              <FiUser />
            </div>
            <span className="font-medium">Parent</span>
          </div>
        </div>
      </div>

      {loading || attendanceLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error || attendanceError ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <FiInfo className="text-red-500 mr-2" />
            <p className="text-red-700 font-medium">
              {error || attendanceError}
            </p>
          </div>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FiInfo className="mx-auto text-4xl text-gray-300 mb-3" />
          <p className="text-gray-500">No students registered yet</p>
        </div>
      ) : (
        students.map((student) => (
          <div key={student.id} className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {student.fullname} ({student.classes?.name || "Unassigned"})
              </h2>
              <span className="text-sm text-gray-500">
                Gender: {student.gender}, Age: {student.Age}
              </span>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-md font-semibold text-gray-800 mb-3">
                <FiClock className="text-indigo-500" />
                Attendance
              </h3>
              {student.attendance?.length ? (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {student.attendance.slice(0, 5).map((a) => (
                        <tr key={a.id}>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {new Date(a.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              a.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {a.present ? (
                                <>
                                  <FiCheckCircle className="mr-1" /> Present
                                </>
                              ) : (
                                <>
                                  <FiXCircle className="mr-1" /> Absent{a.remark ? ` (${a.remark})` : ''}
                                </>
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No attendance records found</p>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ParentDashboard;
