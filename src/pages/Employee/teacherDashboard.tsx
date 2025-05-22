// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchTeacherDashboard,
//   clearTeacherDashboardState,
// } from "../../Redux/Exam/teacherDashboardSlice";
// import { RootState, AppDispatch } from "../../Redux/store";
// import { FiBook, FiUser, FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi";

// const TeacherDashboard: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   const {
//     teacherName,
//     correctionLimit,
//     correctionsUsed,
//     remainingCorrections,
//     assignments,
//     loading,
//     error,
//     success,
//   } = useSelector((state: RootState) => state.teacherDashboard);

//   useEffect(() => {
//     dispatch(fetchTeacherDashboard());

//     return () => {
//       dispatch(clearTeacherDashboardState());
//     };
//   }, [dispatch]);

//   // Calculate correction progress percentage
//   const correctionProgress = Math.min(
//     Math.round((correctionsUsed / correctionLimit) * 100),
//     100
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 flex items-center">
//             <FiBook className="mr-3 text-indigo-600" />
//             Teacher Dashboard
//           </h1>
//           {teacherName && (
//             <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
//               <FiUser className="mr-2 text-gray-500" />
//               <span className="font-medium text-gray-700">{teacherName}</span>
//             </div>
//           )}
//         </div>

//         {/* Loading and Error States */}
//         {loading && (
//           <div className="flex justify-center items-center p-12 bg-white rounded-xl shadow-sm">
//             <FiLoader className="animate-spin text-indigo-600 text-2xl mr-3" />
//             <span className="text-gray-600">Loading dashboard data...</span>
//           </div>
//         )}

//         {error && (
//           <div className="p-4 mb-6 bg-red-50 rounded-lg flex items-start">
//             <FiAlertCircle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
//             <div>
//               <h3 className="font-medium text-red-800">Error loading dashboard</h3>
//               <p className="text-red-600">{error}</p>
//             </div>
//           </div>
//         )}

//         {/* Main Content */}
//         {!loading && !error && (
//           <div className="space-y-6">
//             {/* Correction Stats Card */}
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">
//                 Correction Status
//               </h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="bg-indigo-50 p-4 rounded-lg">
//                   <p className="text-sm font-medium text-indigo-700 mb-1">Total Limit</p>
//                   <p className="text-2xl font-bold text-indigo-900">{correctionLimit}</p>
//                 </div>
                
//                 <div className="bg-amber-50 p-4 rounded-lg">
//                   <p className="text-sm font-medium text-amber-700 mb-1">Used</p>
//                   <p className="text-2xl font-bold text-amber-900">{correctionsUsed}</p>
//                 </div>
                
//                 <div className="bg-green-50 p-4 rounded-lg">
//                   <p className="text-sm font-medium text-green-700 mb-1">Remaining</p>
//                   <p className="text-2xl font-bold text-green-900">{remainingCorrections}</p>
//                 </div>
//               </div>
              
//               {/* Progress Bar */}
//               <div className="mt-6">
//                 <div className="flex justify-between mb-1">
//                   <span className="text-sm font-medium text-gray-700">Progress</span>
//                   <span className="text-sm font-medium text-gray-500">
//                     {correctionProgress}%
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2.5">
//                   <div
//                     className="bg-indigo-600 h-2.5 rounded-full"
//                     style={{ width: `${correctionProgress}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>

//             {/* Assignments Section */}
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//                   <FiBook className="mr-2 text-indigo-600" />
//                   Your Assignments
//                 </h2>
//                 <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
//                   {assignments.length} classes
//                 </span>
//               </div>

//               {assignments.length === 0 ? (
//                 <div className="text-center py-8">
//                   <p className="text-gray-500">No assignments found.</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {assignments.map((a) => (
//                     <div
//                       key={a.id}
//                       className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
//                     >
//                       <h3 className="font-bold text-gray-800 mb-1">{a.className}</h3>
//                       <p className="text-indigo-600 font-medium">{a.subjectName}</p>
//                       <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-sm text-gray-500">
//                         <span>Class ID: {a.id}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Success Message */}
//             {success && (
//               <div className="p-4 bg-green-50 rounded-lg flex items-start">
//                 <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
//                 <div>
//                   <h3 className="font-medium text-green-800">Success</h3>
//                   <p className="text-green-600">{success}</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TeacherDashboard;
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTeacherDashboard,
  clearTeacherDashboardState,
} from "../../Redux/Exam/teacherDashboardSlice";
import { RootState, AppDispatch } from "../../Redux/store";
import { FiBook, FiUser, FiCheckCircle, FiAlertCircle, FiLoader, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const TeacherDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    teacherName,
    correctionLimit,
    correctionsUsed,
    remainingCorrections,
    assignments,
    loading,
    error,
    success,
  } = useSelector((state: RootState) => state.teacherDashboard);

  // Calculate correction progress percentage
  const correctionProgress = Math.min(
    Math.round((correctionsUsed / correctionLimit) * 100),
    100
  );

  useEffect(() => {
    dispatch(fetchTeacherDashboard());

    return () => {
      dispatch(clearTeacherDashboardState());
    };
  }, [dispatch]);

  const handleViewPermissions = () => {
    navigate("/dashboard/Permissions");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FiBook className="mr-3 text-indigo-600" />
            Teacher Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            {teacherName && (
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <FiUser className="mr-2 text-gray-500" />
                <span className="font-medium text-gray-700">{teacherName}</span>
              </div>
            )}
            <button
              onClick={handleViewPermissions}
              className="flex items-center bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-full shadow-sm transition-colors"
            >
              <FiLock className="mr-2" />
              <span>View Permissions</span>
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center p-12 bg-white rounded-xl shadow-sm">
            <FiLoader className="animate-spin text-indigo-600 text-2xl mr-3" />
            <span className="text-gray-600">Loading dashboard data...</span>
          </div>
        )}

        {error && (
          <div className="p-4 mb-6 bg-red-50 rounded-lg flex items-start">
            <FiAlertCircle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800">Error loading dashboard</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <div className="space-y-6">
            {/* Correction Stats Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Correction Status
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-indigo-700 mb-1">Total Limit</p>
                  <p className="text-2xl font-bold text-indigo-900">{correctionLimit}</p>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-amber-700 mb-1">Used</p>
                  <p className="text-2xl font-bold text-amber-900">{correctionsUsed}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-700 mb-1">Remaining</p>
                  <p className="text-2xl font-bold text-green-900">{remainingCorrections}</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-medium text-gray-500">
                    {correctionProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${correctionProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Assignments Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FiBook className="mr-2 text-indigo-600" />
                  Your Assignments
                </h2>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {assignments.length} classes
                </span>
              </div>

              {assignments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No assignments found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {assignments.map((a) => (
                    <div
                      key={a.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-bold text-gray-800 mb-1">{a.className}</h3>
                      <p className="text-indigo-600 font-medium">{a.subjectName}</p>
                      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                        <span>Class ID: {a.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-50 rounded-lg flex items-start">
                <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-green-800">Success</h3>
                  <p className="text-green-600">{success}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;