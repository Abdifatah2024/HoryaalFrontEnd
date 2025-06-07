// // import React, { useEffect } from "react";
// // import {
// //   FiBell, FiUser, FiClock, FiCheckCircle, FiXCircle,
// //   FiInfo, FiAlertTriangle, FiDollarSign
// // } from "react-icons/fi";
// // import { useAppDispatch, useAppSelector } from "../../Redux/store";
// // import {
// //   fetchMyStudents,
// //   fetchStudentAttendance,
// //   fetchStudentDiscipline,
// //   fetchStudentBalance,
// // } from "../../Redux/Parent/ParentstudentSlice";

// // const ParentDashboard: React.FC = () => {
// //   const dispatch = useAppDispatch();
// //   const {
// //     students,
// //     loading,
// //     error,
// //     attendanceLoading,
// //     attendanceError,
// //     disciplineLoading,
// //     disciplineError,
// //     balanceLoading,
// //     balanceError,
// //   } = useAppSelector((state) => state.students);

// //   useEffect(() => {
// //     dispatch(fetchMyStudents());
// //     dispatch(fetchStudentAttendance());
// //     dispatch(fetchStudentDiscipline());
// //     dispatch(fetchStudentBalance());
// //   }, [dispatch]);

// //   const isLoading =
// //     loading || attendanceLoading || disciplineLoading || balanceLoading;
// //   const hasError =
// //     error || attendanceError || disciplineError || balanceError;

// //   const totalBalance = students.reduce(
// //     (acc, curr) => acc + (curr.balance ?? 0),
// //     0
// //   );

// //   return (
// //     <div className="p-6 bg-gray-50 min-h-screen space-y-8">
// //       {/* Header */}
// //       <div className="flex justify-between items-center mb-8">
// //         <div>
// //           <h1 className="text-3xl font-bold text-gray-800">Parent Dashboard</h1>
// //           <p className="text-gray-500">
// //             Welcome back! Here's what's happening today.
// //           </p>
// //         </div>
// //         <div className="flex gap-4 items-center">
// //           <button className="relative p-3 bg-white rounded-full shadow-md hover:shadow-lg">
// //             <FiBell className="text-gray-600 text-lg" />
// //             <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
// //           </button>
// //           <div className="flex items-center gap-3 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-md">
// //             <div className="bg-indigo-500 p-2 rounded-full">
// //               <FiUser />
// //             </div>
// //             <span className="font-medium">Parent</span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Parent Balance Summary */}
// //       {!isLoading && students.length > 0 && (
// //         <div className="text-center py-4 bg-white rounded-xl shadow-md">
// //           <h2 className="text-2xl font-bold text-gray-800 flex justify-center items-center gap-2">
// //             <FiDollarSign className="text-green-500" />
// //             Total Balance Due:{" "}
// //             <span
// //               className={`ml-2 ${
// //                 totalBalance > 0 ? "text-red-600" : "text-green-600"
// //               }`}
// //             >
// //               {totalBalance} Dollars
// //             </span>
// //           </h2>
// //         </div>
// //       )}

// //       {/* States */}
// //       {isLoading ? (
// //         <div className="flex justify-center items-center py-12">
// //           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
// //         </div>
// //       ) : hasError ? (
// //         <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
// //           <div className="flex items-center">
// //             <FiInfo className="text-red-500 mr-2" />
// //             <p className="text-red-700 font-medium">
// //               {error || attendanceError || disciplineError || balanceError}
// //             </p>
// //           </div>
// //         </div>
// //       ) : students.length === 0 ? (
// //         <div className="text-center py-12 bg-gray-50 rounded-lg">
// //           <FiInfo className="mx-auto text-4xl text-gray-300 mb-3" />
// //           <p className="text-gray-500">No students registered yet</p>
// //         </div>
// //       ) : (
// //         students.map((student) => (
// //           <div
// //             key={student.id}
// //             className="bg-white p-6 rounded-xl shadow-md space-y-4"
// //           >
// //             {/* Student Info */}
// //             <div className="flex justify-between items-center mb-4">
// //               <h2 className="text-xl font-semibold text-gray-800">
// //                 {student.fullname} ({student.classes?.name || "Unassigned"})
// //               </h2>
// //               <span className="text-sm text-gray-500">
// //                 Gender: {student.gender}, Age: {student.Age}
// //               </span>
// //             </div>

// //             {/* Data Sections */}
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //               {/* Attendance */}
// //               <div>
// //                 <h3 className="flex items-center gap-2 text-md font-semibold text-gray-800 mb-3">
// //                   <FiClock className="text-indigo-500" />
// //                   Attendance
// //                 </h3>
// //                 {student.attendance?.length ? (
// //                   <div className="overflow-hidden rounded-lg border border-gray-200">
// //                     <table className="min-w-full divide-y divide-gray-200">
// //                       <thead className="bg-gray-100">
// //                         <tr>
// //                           <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
// //                             Date
// //                           </th>
// //                           <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
// //                             Status
// //                           </th>
// //                         </tr>
// //                       </thead>
// //                       <tbody className="bg-white divide-y divide-gray-200">
// //                         {student.attendance.slice(0, 5).map((a) => (
// //                           <tr key={a.id}>
// //                             <td className="px-4 py-3 text-sm text-gray-700">
// //                               {new Date(a.date).toLocaleDateString("en-US", {
// //                                 year: "numeric",
// //                                 month: "short",
// //                                 day: "numeric",
// //                               })}
// //                             </td>
// //                             <td className="px-4 py-3">
// //                               <span
// //                                 className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
// //                                   a.present
// //                                     ? "bg-green-100 text-green-800"
// //                                     : "bg-red-100 text-red-800"
// //                                 }`}
// //                               >
// //                                 {a.present ? (
// //                                   <>
// //                                     <FiCheckCircle className="mr-1" /> Present
// //                                   </>
// //                                 ) : (
// //                                   <>
// //                                     <FiXCircle className="mr-1" /> Absent
// //                                     {a.remark ? ` (${a.remark})` : ""}
// //                                   </>
// //                                 )}
// //                               </span>
// //                             </td>
// //                           </tr>
// //                         ))}
// //                       </tbody>
// //                     </table>
// //                   </div>
// //                 ) : (
// //                   <p className="text-gray-500">No attendance records found</p>
// //                 )}
// //               </div>

// //               {/* Discipline */}
// //               <div>
// //                 <h3 className="flex items-center gap-2 text-md font-semibold text-gray-800 mb-3">
// //                   <FiAlertTriangle className="text-red-500" />
// //                   Discipline
// //                 </h3>
// //                 {student.discipline?.length ? (
// //                   <div className="overflow-hidden rounded-lg border border-gray-200">
// //                     <table className="min-w-full divide-y divide-gray-200">
// //                       <thead className="bg-gray-100">
// //                         <tr>
// //                           <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
// //                             Date
// //                           </th>
// //                           <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
// //                             Type
// //                           </th>
// //                           <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
// //                             Action
// //                           </th>
// //                         </tr>
// //                       </thead>
// //                       <tbody className="bg-white divide-y divide-gray-200">
// //                         {student.discipline.slice(0, 5).map((d) => (
// //                           <tr key={d.id}>
// //                             <td className="px-4 py-3 text-sm text-gray-700">
// //                               {new Date(d.recordedAt).toLocaleDateString(
// //                                 "en-US",
// //                                 {
// //                                   year: "numeric",
// //                                   month: "short",
// //                                   day: "numeric",
// //                                 }
// //                               )}
// //                             </td>
// //                             <td className="px-4 py-3 text-sm text-gray-800">
// //                               {d.type}
// //                             </td>
// //                             <td className="px-4 py-3 text-sm text-gray-600">
// //                               {d.actionTaken}
// //                             </td>
// //                           </tr>
// //                         ))}
// //                       </tbody>
// //                     </table>
// //                   </div>
// //                 ) : (
// //                   <p className="text-gray-500">No discipline records found</p>
// //                 )}
// //               </div>

// //               {/* Balance */}
// //               <div>
// //                 <h3 className="flex items-center gap-2 text-md font-semibold text-gray-800 mb-3">
// //                   <FiDollarSign className="text-green-500" />
// //                   Balance
// //                 </h3>
// //                 <div className="space-y-2 text-sm text-gray-700">
// //                   <p>
// //                     <strong>Monthly Fee:</strong> {student.monthlyFee ?? "N/A"}
// //                   </p>
// //                   <p>
// //                     <strong>Total Months:</strong> {student.totalMonths ?? "N/A"}
// //                   </p>
// //                   <p>
// //                     <strong>Total Paid:</strong>{" "}
// //                     <span className="text-green-700 font-medium">
// //                       {student.totalPaid ?? "0"}
// //                     </span>
// //                   </p>
// //                   <p>
// //                     <strong>Total Fees:</strong>{" "}
// //                     <span className="text-blue-700 font-medium">
// //                       {student.totalFees ?? "0"}
// //                     </span>
// //                   </p>
// //                   <p>
// //                     <strong>Balance:</strong>{" "}
// //                     <span
// //                       className={`font-bold ${
// //                         student.balance && student.balance > 0
// //                           ? "text-red-600"
// //                           : "text-green-600"
// //                       }`}
// //                     >
// //                       {student.balance ?? 0}
// //                     </span>
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         ))
// //       )}
// //     </div>
// //   );
// // };

// // export default ParentDashboard;
// import React, { useEffect } from "react";
// import {
//   FiBell, FiUser, FiClock, FiCheckCircle, FiXCircle,
//   FiInfo, FiAlertTriangle, FiDollarSign, FiMinusCircle
// } from "react-icons/fi";
// import { useAppDispatch, useAppSelector } from "../../Redux/store";
// import {
//   fetchMyStudents,
//   fetchStudentAttendance,
//   fetchStudentDiscipline,
//   fetchStudentBalance,
// } from "../../Redux/Parent/ParentstudentSlice";

// const ParentDashboard: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const {
//     students,
//     loading,
//     error,
//     attendanceLoading,
//     attendanceError,
//     disciplineLoading,
//     disciplineError,
//     balanceLoading,
//     balanceError,
//   } = useAppSelector((state) => state.students);

//   useEffect(() => {
//     dispatch(fetchMyStudents());
//     dispatch(fetchStudentAttendance());
//     dispatch(fetchStudentDiscipline());
//     dispatch(fetchStudentBalance());
//   }, [dispatch]);

//   const isLoading =
//     loading || attendanceLoading || disciplineLoading || balanceLoading;
//   const hasError =
//     error || attendanceError || disciplineError || balanceError;

//   const totalBalance = students.reduce(
//     (acc, curr) => acc + (curr.balance ?? 0),
//     0
//   );

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen space-y-8">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">Parent Dashboard</h1>
//           <p className="text-gray-500">Welcome back! Here's an overview of your children.</p>
//         </div>
//         <div className="flex gap-4 items-center">
//           <button className="relative p-3 bg-white rounded-full shadow hover:shadow-lg">
//             <FiBell className="text-gray-600 text-lg" />
//             <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white" />
//           </button>
//           <div className="flex items-center gap-3 bg-indigo-600 text-white px-4 py-2 rounded-full shadow">
//             <div className="bg-indigo-500 p-2 rounded-full">
//               <FiUser />
//             </div>
//             <span className="font-medium">Parent</span>
//           </div>
//         </div>
//       </div>

//       {/* Total Balance */}
//       {!isLoading && students.length > 0 && (
//         <div className="text-center bg-white py-6 rounded-lg shadow">
//           <h2 className="text-2xl font-bold text-gray-700 flex justify-center items-center gap-2">
//             <FiDollarSign className="text-green-500" />
//             Total Outstanding Balance:
//             <span
//               className={`ml-2 ${
//                 totalBalance > 0 ? "text-red-600" : "text-green-600"
//               }`}
//             >
//               {totalBalance.toLocaleString()} ETB
//             </span>
//           </h2>
//         </div>
//       )}

//       {/* Content */}
//       {isLoading ? (
//         <div className="flex justify-center items-center py-12">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//         </div>
//       ) : hasError ? (
//         <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 rounded">
//           <div className="flex items-center">
//             <FiInfo className="text-red-500 mr-2" />
//             <p className="text-red-700 font-medium">
//               {error || attendanceError || disciplineError || balanceError}
//             </p>
//           </div>
//         </div>
//       ) : students.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-lg shadow">
//           <FiInfo className="mx-auto text-4xl text-gray-300 mb-3" />
//           <p className="text-gray-500">No students registered yet.</p>
//         </div>
//       ) : (
//         students.map((student) => (
//           <div
//             key={student.id}
//             className="bg-white p-6 rounded-xl shadow space-y-6"
//           >
//             {/* Student Header */}
//             <div className="flex justify-between items-center border-b pb-4">
//               <h2 className="text-xl font-semibold text-gray-800">
//                 {student.fullname} ({student.classes?.name || "Unassigned"})
//               </h2>
//               <div className="text-sm text-gray-500">
//                 Gender: {student.gender}, Age: {student.Age}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {/* Attendance Section */}
//               <div>
//                 <h3 className="flex items-center gap-2 text-md font-semibold text-indigo-700 mb-3">
//                   <FiClock />
//                   Attendance
//                 </h3>
//                 <div className="text-sm text-gray-600 mb-2">
//                   <FiMinusCircle className="inline-block text-yellow-500 mr-1" />
//                   Total Absent:{" "}
//                   <span className="font-bold text-red-500">
//                     {student.totalAbsent ?? 0}
//                   </span>
//                 </div>
//                 {student.attendance?.length ? (
//                   <div className="overflow-hidden rounded-lg border border-gray-200">
//                     <table className="min-w-full divide-y divide-gray-200 text-sm">
//                       <thead className="bg-gray-100 text-gray-600">
//                         <tr>
//                           <th className="px-4 py-2 text-left">Date</th>
//                           <th className="px-4 py-2 text-left">Status</th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {student.attendance.slice(0, 5).map((a) => (
//                           <tr key={a.id}>
//                             <td className="px-4 py-3">
//                               {new Date(a.date).toLocaleDateString("en-US", {
//                                 year: "numeric",
//                                 month: "short",
//                                 day: "numeric",
//                               })}
//                             </td>
//                             <td className="px-4 py-3">
//                               <span
//                                 className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                                   a.present
//                                     ? "bg-green-100 text-green-700"
//                                     : "bg-red-100 text-red-700"
//                                 }`}
//                               >
//                                 {a.present ? (
//                                   <>
//                                     <FiCheckCircle className="mr-1" /> Present
//                                   </>
//                                 ) : (
//                                   <>
//                                     <FiXCircle className="mr-1" /> Absent
//                                     {a.remark ? ` (${a.remark})` : ""}
//                                   </>
//                                 )}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <p className="text-gray-500">No attendance data found.</p>
//                 )}
//               </div>

//               {/* Discipline Section */}
//               <div>
//                 <h3 className="flex items-center gap-2 text-md font-semibold text-red-600 mb-3">
//                   <FiAlertTriangle />
//                   Discipline
//                 </h3>
//                 {student.discipline?.length ? (
//                   <div className="overflow-hidden rounded-lg border border-gray-200">
//                     <table className="min-w-full divide-y divide-gray-200 text-sm">
//                       <thead className="bg-gray-100 text-gray-600">
//                         <tr>
//                           <th className="px-4 py-2 text-left">Date</th>
//                           <th className="px-4 py-2 text-left">Type</th>
//                           <th className="px-4 py-2 text-left">Action</th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {student.discipline.slice(0, 5).map((d) => (
//                           <tr key={d.id}>
//                             <td className="px-4 py-3">
//                               {new Date(d.recordedAt).toLocaleDateString(
//                                 "en-US",
//                                 {
//                                   year: "numeric",
//                                   month: "short",
//                                   day: "numeric",
//                                 }
//                               )}
//                             </td>
//                             <td className="px-4 py-3">{d.type}</td>
//                             <td className="px-4 py-3">{d.actionTaken}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <p className="text-gray-500">No discipline records found.</p>
//                 )}
//               </div>

//               {/* Balance Section */}
//               <div>
//                 <h3 className="flex items-center gap-2 text-md font-semibold text-green-700 mb-3">
//                   <FiDollarSign />
//                   Balance
//                 </h3>
//                 <div className="space-y-1 text-sm text-gray-700">
//                   <p>
//                     <strong>Monthly Fee:</strong>{" "}
//                     {student.monthlyFee ?? "N/A"} ETB
//                   </p>
//                   <p>
//                     <strong>Total Months:</strong>{" "}
//                     {student.totalMonths ?? "N/A"}
//                   </p>
//                   <p>
//                     <strong>Total Paid:</strong>{" "}
//                     <span className="text-green-600 font-medium">
//                       {student.totalPaid ?? 0} ETB
//                     </span>
//                   </p>
//                   <p>
//                     <strong>Total Fee:</strong>{" "}
//                     <span className="text-blue-600 font-medium">
//                       {student.totalFees ?? 0} ETB
//                     </span>
//                   </p>
//                   <p>
//                     <strong>Balance:</strong>{" "}
//                     <span
//                       className={`font-bold ${
//                         student.balance && student.balance > 0
//                           ? "text-red-600"
//                           : "text-green-600"
//                       }`}
//                     >
//                       {student.balance ?? 0} ETB
//                     </span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default ParentDashboard;
import React, { useEffect } from "react";
import {
  FiBell, FiUser, FiClock, FiCheckCircle, FiXCircle,
  FiInfo, FiAlertTriangle, FiDollarSign, FiMinusCircle
} from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  fetchMyStudents,
  fetchStudentAttendance,
  fetchStudentDiscipline,
  fetchStudentBalance,
} from "../../Redux/Parent/ParentstudentSlice";

const ParentDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    students,
    loading,
    error,
    attendanceLoading,
    attendanceError,
    disciplineLoading,
    disciplineError,
    balanceLoading,
    balanceError,
  } = useAppSelector((state) => state.students);

  useEffect(() => {
    dispatch(fetchMyStudents());
    dispatch(fetchStudentAttendance());
    dispatch(fetchStudentDiscipline());
    dispatch(fetchStudentBalance());
  }, [dispatch]);

  const isLoading =
    loading || attendanceLoading || disciplineLoading || balanceLoading;
  const hasError =
    error || attendanceError || disciplineError || balanceError;

  const totalBalance = students.reduce(
    (acc, curr) => acc + (curr.balance ?? 0),
    0
  );

  // Format currency as USD
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Parent Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's an overview of your children.</p>
        </div>
        <div className="flex gap-3 items-center w-full sm:w-auto">
          <button className="relative p-2.5 bg-white rounded-full shadow hover:shadow-md transition-shadow">
            <FiBell className="text-gray-600 text-lg" />
            <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <div className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-full shadow flex-1 sm:flex-none justify-center">
            <div className="bg-indigo-500 p-1.5 rounded-full">
              <FiUser size={16} />
            </div>
            <span className="font-medium text-sm">Parent Account</span>
          </div>
        </div>
      </div>

      {/* Total Balance */}
      {!isLoading && students.length > 0 && (
        <div className="text-center bg-gradient-to-r from-indigo-50 to-white py-5 rounded-xl shadow-sm border border-indigo-100">
          <h2 className="text-xl md:text-2xl font-bold text-gray-700 flex flex-col md:flex-row justify-center items-center gap-1 md:gap-2">
            <div className="flex items-center gap-2">
              <FiDollarSign className="text-green-500" />
              Total Outstanding Balance:
            </div>
            <span
              className={`font-mono mt-1 md:mt-0 ${
                totalBalance > 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {formatCurrency(totalBalance)}
            </span>
          </h2>
          {totalBalance > 0 && (
            <p className="text-sm text-red-500 mt-2">
              Please settle outstanding balances at your earliest convenience
            </p>
          )}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="animate-pulse">
                <div className="h-48 bg-gray-200 border-b" />
                <div className="p-4 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : hasError ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3">
          <FiInfo className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Data loading error</p>
            <p className="text-red-600 text-sm mt-1">
              {error || attendanceError || disciplineError || balanceError}
            </p>
            <button 
              className="mt-3 text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded transition-colors"
              onClick={() => {
                dispatch(fetchMyStudents());
                dispatch(fetchStudentAttendance());
                dispatch(fetchStudentDiscipline());
                dispatch(fetchStudentBalance());
              }}
            >
              Retry
            </button>
          </div>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm max-w-md mx-auto">
          <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiInfo className="text-3xl text-indigo-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No students registered</h3>
          <p className="text-gray-500">Please register your children to view their information</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-transform hover:translate-y-[-2px] hover:shadow-md"
            >
              {/* Student Header */}
              <div className="bg-indigo-50 px-5 py-4 border-b border-indigo-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <h2 className="text-lg font-semibold text-indigo-800">
                    {student.fullname} 
                    <span className="text-indigo-500 font-normal ml-2">
                      ({student.classes?.name || "Unassigned"})
                    </span>
                  </h2>
                  <div className="flex gap-3 text-xs text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-full">
                    <span>Gender: {student.gender}</span>
                    <span className="hidden sm:inline">|</span>
                    <span>Age: {student.Age}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Attendance Section */}
                <div className="border border-gray-100 rounded-lg p-4">
                  <h3 className="flex items-center gap-2 text-md font-semibold text-indigo-700 mb-3">
                    <FiClock className="text-indigo-500" />
                    Attendance
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-4 p-2 bg-yellow-50 rounded">
                    <FiMinusCircle className="text-yellow-500 mr-2 flex-shrink-0" />
                    Total Absent:{" "}
                    <span className="font-bold text-red-500 ml-1">
                      {student.totalAbsent ?? 0}
                    </span>
                  </div>
                  {student.attendance?.length ? (
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <div className="max-h-60 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {student.attendance.slice(0, 5).map((a) => (
                              <tr key={a.id}>
                                <td className="px-3 py-3 whitespace-nowrap text-gray-600 text-xs">
                                  {new Date(a.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </td>
                                <td className="px-3 py-3">
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      a.present
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    {a.present ? (
                                      <>
                                        <FiCheckCircle className="mr-1" /> Present
                                      </>
                                    ) : (
                                      <>
                                        <FiXCircle className="mr-1" /> Absent
                                        {a.remark ? ` (${a.remark})` : ""}
                                      </>
                                    )}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm p-2 bg-gray-50 rounded text-center">
                      No attendance data found
                    </p>
                  )}
                </div>

                {/* Discipline Section */}
                <div className="border border-gray-100 rounded-lg p-4">
                  <h3 className="flex items-center gap-2 text-md font-semibold text-red-600 mb-3">
                    <FiAlertTriangle className="text-red-500" />
                    Discipline
                  </h3>
                  {student.discipline?.length ? (
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <div className="max-h-60 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {student.discipline.slice(0, 5).map((d) => (
                              <tr key={d.id}>
                                <td className="px-3 py-3 whitespace-nowrap text-gray-600 text-xs">
                                  {new Date(d.recordedAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </td>
                                <td className="px-3 py-3 text-gray-600 text-xs">{d.type}</td>
                                <td className="px-3 py-3 text-gray-600 text-xs">{d.actionTaken}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm p-2 bg-gray-50 rounded text-center">
                      No discipline records found
                    </p>
                  )}
                </div>

                {/* Balance Section */}
                <div className="border border-gray-100 rounded-lg p-4">
                  <h3 className="flex items-center gap-2 text-md font-semibold text-green-700 mb-3">
                    <FiDollarSign className="text-green-500" />
                    Balance
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Fee:</span>
                      <span className="font-medium">
                        {student.monthlyFee !== undefined 
                          ? formatCurrency(student.monthlyFee) 
                          : "N/A"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Months:</span>
                      <span className="font-medium">{student.totalMonths ?? "N/A"}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Paid:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(student.totalPaid)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Fee:</span>
                      <span className="font-medium text-blue-600">
                        {formatCurrency(student.totalFees)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between font-semibold pt-2 border-t border-gray-100">
                      <span className="text-gray-700">Balance:</span>
                      <span
                        className={`${
                          student.balance && student.balance > 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {formatCurrency(student.balance)}
                      </span>
                    </div>

                    {/* Payment Progress Bar */}
                    {student.totalFees && student.totalFees > 0 && (
                      <div className="pt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min(100, ((student.totalPaid || 0) / student.totalFees) * 100)}%` 
                            }} 
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{Math.round(((student.totalPaid || 0) / student.totalFees) * 100)}% Paid</span>
                          <span>Due: {formatCurrency(student.balance)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;