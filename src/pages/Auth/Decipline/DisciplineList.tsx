// import  { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useFormik } from "formik";
// import * as yup from "yup";
// import {
//   fetchDisciplines,
//   createDiscipline,
//   updateDiscipline,
//   deleteDiscipline,
//   verifyStudent,
//   clearStudentVerification,
//   Discipline,
// } from "../../../Redux/Auth/Decipline/disciplineSlice";
// import { RootState, AppDispatch } from "../../../Redux/store";
// import { toast } from "react-toastify";
// import { FiEdit2, FiTrash2, FiUserCheck, FiAlertTriangle, FiCheckCircle, FiUser, FiCalendar, FiBarChart2, FiPieChart, FiUserPlus } from "react-icons/fi";
// import { motion } from "framer-motion";
// import { Bar, Pie } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// const DisciplinePage = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { disciplines, studentVerification, loading, error } = useSelector(
//     (state: RootState) => state.discipline
//   );
//   const [editId, setEditId] = useState<number | null>(null);
//   const [activeTab, setActiveTab] = useState<"form" | "records" | "analytics">("form");
//   const [analyticsView, setAnalyticsView] = useState<"gender" | "class" | "type">("type");

//   const formik = useFormik({
//     initialValues: {
//       studentId: "",
//       gender: "",
//       type: "",
//       description: "",
//       actionTaken: "",
//     },
//     validationSchema: yup.object({
//       studentId: yup.number().required("Student ID is required"),
//       gender: yup.string().required("Gender is required"),
//       type: yup.string().required("Type is required"),
//       description: yup.string().required("Description is required"),
//     }),
//     onSubmit: async (values, { resetForm }) => {
//       try {
//         if (!studentVerification && !editId) {
//           toast.error("Please verify student before submitting.");
//           return;
//         }

//         const disciplineData = {
//           studentId: +values.studentId,
//           gender: values.gender,
//           type: values.type,
//           description: values.description,
//           actionTaken: values.actionTaken,
//         };

//         if (editId) {
//           await dispatch(updateDiscipline({ id: editId, updatedData: disciplineData })).unwrap();
//           toast.success("Discipline updated successfully!");
//         } else {
//           await dispatch(createDiscipline(disciplineData)).unwrap();
//           toast.success("Discipline created successfully!");
//         }
        
//         resetForm();
//         setEditId(null);
//         dispatch(clearStudentVerification());
//         dispatch(fetchDisciplines());
//         setActiveTab("records");
//       } catch (error: any) {
//         toast.error(error || "Action failed");
//       }
//     },
//   });

//   useEffect(() => {
//     dispatch(fetchDisciplines());
//   }, [dispatch]);

//   useEffect(() => {
//     const id = Number(formik.values.studentId);
//     if (id && !editId) {
//       dispatch(verifyStudent(id));
//     } else {
//       dispatch(clearStudentVerification());
//     }
//   }, [formik.values.studentId, dispatch, editId]);

//   const handleEdit = (discipline: Discipline) => {
//     setEditId(discipline.id);
//     formik.setValues({
//       studentId: discipline.studentId.toString(),
//       gender: discipline.student?.gender || "",
//       type: discipline.type,
//       description: discipline.description,
//       actionTaken: discipline.actionTaken || "",
//     });
//     setActiveTab("form");
//   };

//   const handleDelete = (id: number) => {
//     if (window.confirm("Are you sure you want to delete this discipline record?")) {
//       dispatch(deleteDiscipline(id))
//         .unwrap()
//         .then(() => {
//           toast.success("Discipline deleted!");
//           dispatch(fetchDisciplines());
//         })
//         .catch((error) => toast.error(error));
//     }
//   };

//   // Analytics data processing
//   const getAnalyticsData = () => {
//     const genderData = {
//       Male: disciplines.filter(d => d.student?.gender === 'Male').length,
//       Female: disciplines.filter(d => d.student?.gender === 'Female').length,
//       Other: disciplines.filter(d => !['Male', 'Female'].includes(d.student?.gender || '')).length,
//     };

//     const typeData = disciplines.reduce((acc, curr) => {
//       acc[curr.type] = (acc[curr.type] || 0) + 1;
//       return acc;
//     }, {} as Record<string, number>);

//     return { genderData, typeData };
//   };

//   const { genderData, typeData } = getAnalyticsData();

//   // Chart configurations
//   const genderChartData = {
//     labels: Object.keys(genderData),
//     datasets: [
//       {
//         label: 'Cases by Gender',
//         data: Object.values(genderData),
//         backgroundColor: ['#3b82f6', '#ec4899', '#8b5cf6'],
//       }
//     ]
//   };

//   const typeChartData = {
//     labels: Object.keys(typeData),
//     datasets: [
//       {
//         label: 'Cases by Type',
//         data: Object.values(typeData),
//         backgroundColor: [
//           '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6',
//           '#ec4899', '#f97316', '#14b8a6', '#64748b'
//         ],
//       }
//     ]
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-6">
//       {/* Header */}
//       <motion.div 
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-center mb-8"
//       >
//         <h1 className="text-2xl font-bold text-gray-800 mb-2">
//           Student Discipline Portal
//         </h1>
//         <p className="text-gray-600">
//           Manage student disciplinary records and analytics
//         </p>
//       </motion.div>

//       {/* Tabs */}
//       <div className="flex border-b border-gray-200 mb-6">
//         <button
//           onClick={() => setActiveTab("form")}
//           className={`py-3 px-4 text-sm font-medium ${
//             activeTab === "form"
//               ? "border-b-2 border-indigo-500 text-indigo-600"
//               : "text-gray-500 hover:text-gray-700"
//           }`}
//         >
//           {editId ? "Edit Record" : "New Record"}
//         </button>
//         <button
//           onClick={() => setActiveTab("records")}
//           className={`py-3 px-4 text-sm font-medium ${
//             activeTab === "records"
//               ? "border-b-2 border-indigo-500 text-indigo-600"
//               : "text-gray-500 hover:text-gray-700"
//           }`}
//         >
//           View Records
//         </button>
//         <button
//           onClick={() => setActiveTab("analytics")}
//           className={`py-3 px-4 text-sm font-medium ${
//             activeTab === "analytics"
//               ? "border-b-2 border-indigo-500 text-indigo-600"
//               : "text-gray-500 hover:text-gray-700"
//           }`}
//         >
//           Analytics
//         </button>
//       </div>

//       {/* Form Panel */}
//       {activeTab === "form" && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="bg-white rounded-lg shadow-sm p-5 mb-6"
//         >
//           <div className="flex items-center mb-4">
//             <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 mr-3">
//               <FiAlertTriangle size={20} />
//             </div>
//             <h2 className="text-lg font-semibold">
//               {editId ? "Update Record" : "New Incident"}
//             </h2>
//           </div>

//           <form onSubmit={formik.handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Student ID */}
//               {!editId && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Student ID
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="number"
//                       name="studentId"
//                       value={formik.values.studentId}
//                       onChange={formik.handleChange}
//                       placeholder="Enter Student ID"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500"
//                     />
//                     {formik.values.studentId && !formik.errors.studentId && (
//                       <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
//                         <FiUserCheck className="h-4 w-4 text-green-500" />
//                       </div>
//                     )}
//                   </div>
//                   {formik.errors.studentId && (
//                     <p className="mt-1 text-xs text-red-600">{formik.errors.studentId}</p>
//                   )}
//                 </div>
//               )}

//               {/* Gender */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Gender
//                 </label>
//                 <select
//                   name="gender"
//                   value={formik.values.gender}
//                   onChange={formik.handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500"
//                 >
//                   <option value="">Select gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//                 {formik.errors.gender && (
//                   <p className="mt-1 text-xs text-red-600">{formik.errors.gender}</p>
//                 )}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Type */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Incident Type
//                 </label>
//                 <select
//                   name="type"
//                   value={formik.values.type}
//                   onChange={formik.handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500"
//                 >
//                   <option value="">Select type</option>
//                   <option value="Late Arrival">Late Arrival</option>
//                   <option value="Classroom Disruption">Classroom Disruption</option>
//                   <option value="Academic Dishonesty">Academic Dishonesty</option>
//                   <option value="Behavioral Issue">Behavioral Issue</option>
//                   <option value="Other">Other</option>
//                 </select>
//                 {formik.errors.type && (
//                   <p className="mt-1 text-xs text-red-600">{formik.errors.type}</p>
//                 )}
//               </div>

//               {/* Action Taken */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Action Taken
//                 </label>
//                 <input
//                   type="text"
//                   name="actionTaken"
//                   value={formik.values.actionTaken}
//                   onChange={formik.handleChange}
//                   placeholder="Warning, Suspension..."
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500"
//                 />
//               </div>
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={formik.values.description}
//                 onChange={formik.handleChange}
//                 placeholder="Incident details..."
//                 rows={3}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500"
//               />
//               {formik.errors.description && (
//                 <p className="mt-1 text-xs text-red-600">{formik.errors.description}</p>
//               )}
//             </div>

//             {/* Verified Student Info */}
//             {studentVerification && !editId && (
//               <div className="p-3 rounded-md bg-green-50 border border-green-200 flex items-start">
//                 <FiUser className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
//                 <div>
//                   <p className="text-xs font-medium text-green-800">Verified Student</p>
//                   <p className="text-xs text-green-700">
//                     {studentVerification.fullname} (ID: {formik.values.studentId})
//                     {studentVerification.gender && ` • ${studentVerification.gender}`}
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Buttons */}
//             <div className="flex justify-end space-x-3 pt-2">
//               <button
//                 type="button"
//                 onClick={() => {
//                   formik.resetForm();
//                   setEditId(null);
//                   dispatch(clearStudentVerification());
//                   setActiveTab("records");
//                 }}
//                 className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-4 py-2 text-sm bg-indigo-600 rounded-md text-white hover:bg-indigo-700 disabled:opacity-70"
//               >
//                 {loading ? "Processing..." : editId ? "Update" : "Submit"}
//               </button>
//             </div>
//           </form>
//         </motion.div>
//       )}

//       {/* Records Panel */}
//       {activeTab === "records" && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="bg-white rounded-lg shadow-sm p-5"
//         >
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center">
//               <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 mr-3">
//                 <FiAlertTriangle size={20} />
//               </div>
//               <h2 className="text-lg font-semibold">Disciplinary Records</h2>
//             </div>
//             <button
//               onClick={() => {
//                 setActiveTab("form");
//                 formik.resetForm();
//                 setEditId(null);
//               }}
//               className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//             >
//               New Record
//             </button>
//           </div>

//           {loading && (
//             <div className="flex justify-center py-4">
//               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
//             </div>
//           )}

//           {!loading && disciplines.length === 0 ? (
//             <div className="text-center py-6">
//               <p className="text-gray-500">No disciplinary records found</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Student
//                     </th>
//                     <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Gender
//                     </th>
//                     <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Incident
//                     </th>
//                     <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Recorded By
//                     </th>
//                     <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {disciplines.map((d) => (
//                     <tr key={d.id} className="hover:bg-gray-50">
//                       <td className="px-3 py-3 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
//                             <FiUser className="h-4 w-4 text-indigo-500" />
//                           </div>
//                           <div className="ml-2">
//                             <div className="text-sm font-medium text-gray-900">
//                               {d.student?.fullname || 'N/A'}
//                             </div>
//                             <div className="text-xs text-gray-500">ID: {d.studentId}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
//                         {d.student?.gender || 'N/A'}
//                       </td>
//                       <td className="px-3 py-3">
//                         <div>
//                           <span className={`px-2 py-0.5 inline-flex text-xs leading-4 font-medium rounded-full ${
//                             d.type.includes('Late') ? 'bg-yellow-100 text-yellow-800' :
//                             d.type.includes('Disruption') ? 'bg-orange-100 text-orange-800' :
//                             d.type.includes('Dishonesty') ? 'bg-red-100 text-red-800' :
//                             'bg-blue-100 text-blue-800'
//                           }`}>
//                             {d.type}
//                           </span>
//                           <p className="text-xs text-gray-500 mt-1">{d.description}</p>
//                           {d.actionTaken && (
//                             <p className="text-xs text-gray-700 mt-1">
//                               <span className="font-medium">Action:</span> {d.actionTaken}
//                             </p>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-3 py-3 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
//                             <FiUserPlus className="h-4 w-4 text-purple-500" />
//                           </div>
//                           <div className="ml-2">
//                             <div className="text-xs font-medium text-gray-900">
//                               {d.user?.fullName || 'System'}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500">
//                         {formatDate(d.recordedAt)}
//                       </td>
//                       <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
//                         <button
//                           onClick={() => handleEdit(d)}
//                           className="text-indigo-600 hover:text-indigo-900 mr-3"
//                           title="Edit"
//                         >
//                           <FiEdit2 size={16} />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(d.id)}
//                           className="text-red-600 hover:text-red-900"
//                           title="Delete"
//                         >
//                           <FiTrash2 size={16} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </motion.div>
//       )}

//       {/* Analytics Panel */}
//       {activeTab === "analytics" && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="bg-white rounded-lg shadow-sm p-5"
//         >
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center">
//               <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 mr-3">
//                 <FiBarChart2 size={20} />
//               </div>
//               <h2 className="text-lg font-semibold">Discipline Analytics</h2>
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => setAnalyticsView("type")}
//                 className={`px-3 py-1 text-xs rounded-md ${
//                   analyticsView === "type" ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
//                 }`}
//               >
//                 By Type
//               </button>
//               <button
//                 onClick={() => setAnalyticsView("gender")}
//                 className={`px-3 py-1 text-xs rounded-md ${
//                   analyticsView === "gender" ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
//                 }`}
//               >
//                 By Gender
//               </button>
//             </div>
//           </div>

//           {loading ? (
//             <div className="flex justify-center py-4">
//               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
//             </div>
//           ) : disciplines.length === 0 ? (
//             <div className="text-center py-6">
//               <p className="text-gray-500">No data available for analytics</p>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
//                   <FiPieChart className="mr-1" />
//                   {analyticsView === 'gender' ? 'Cases by Gender' : 'Cases by Type'}
//                 </h3>
//                 <div className="h-64">
//                   {analyticsView === 'gender' ? (
//                     <Pie 
//                       data={genderChartData}
//                       options={{ maintainAspectRatio: false }}
//                     />
//                   ) : (
//                     <Pie 
//                       data={typeChartData}
//                       options={{ maintainAspectRatio: false }}
//                     />
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <div className="bg-white border rounded-lg p-3">
//                   <h4 className="text-xs font-medium text-gray-500">Total Cases</h4>
//                   <p className="text-2xl font-bold">{disciplines.length}</p>
//                 </div>
//                 <div className="bg-white border rounded-lg p-3">
//                   <h4 className="text-xs font-medium text-gray-500">Male Cases</h4>
//                   <p className="text-2xl font-bold">{genderData.Male}</p>
//                 </div>
//                 <div className="bg-white border rounded-lg p-3">
//                   <h4 className="text-xs font-medium text-gray-500">Female Cases</h4>
//                   <p className="text-2xl font-bold">{genderData.Female}</p>
//                 </div>
//               </div>

//               <div className="bg-white border rounded-lg p-3">
//                 <h4 className="text-xs font-medium text-gray-500 mb-2">Top 3 Incident Types</h4>
//                 <div className="space-y-2">
//                   {Object.entries(typeData)
//                     .sort((a, b) => b[1] - a[1])
//                     .slice(0, 3)
//                     .map(([type, count]) => (
//                       <div key={type} className="flex justify-between">
//                         <span className="text-sm">{type}</span>
//                         <span className="text-sm font-medium">{count}</span>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default DisciplinePage;
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useFormik } from "formik";
// import * as yup from "yup";
// import {
//   fetchDisciplines,
//   createDiscipline,
//   updateDiscipline,
//   deleteDiscipline,
//   verifyStudent,
//   clearStudentVerification,
//   Discipline,
// } from "../../../Redux/Auth/Decipline/disciplineSlice";
// import { fetchStudentList } from "../../../Redux/Auth/Decipline/studentDisciplineSlice";
// import { RootState, AppDispatch } from "../../../Redux/store";
// import { toast } from "react-toastify";
// import {
//   FiEdit2,
//   FiTrash2,
//   FiPieChart,
// } from "react-icons/fi";
// import { motion } from "framer-motion";
// import { Pie } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const DisciplinePage = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { disciplines, studentVerification, loading } = useSelector((state: RootState) => state.discipline);
//   const { students } = useSelector((state: RootState) => state.studentDiscipline);

//   const [editId, setEditId] = useState<number | null>(null);
//   const [activeTab, setActiveTab] = useState<"form" | "records" | "analytics">("form");

//   const formik = useFormik({
//     initialValues: {
//       studentId: "",
//       type: "",
//       description: "",
//       actionTaken: "",
//     },
//     validationSchema: yup.object({
//       studentId: yup.number().required("Student ID is required"),
//       type: yup.string().required("Type is required"),
//       description: yup.string().required("Description is required"),
//     }),
//     onSubmit: async (values, { resetForm }) => {
//       try {
//         const payload = {
//           studentId: +values.studentId,
//           type: values.type,
//           description: values.description,
//           actionTaken: values.actionTaken,
//         };

//         if (editId) {
//           await dispatch(updateDiscipline({ id: editId, updatedData: payload })).unwrap();
//           toast.success("Discipline updated!");
//         } else {
//           await dispatch(createDiscipline(payload)).unwrap();
//           toast.success("Discipline recorded!");
//         }

//         resetForm();
//         setEditId(null);
//         dispatch(clearStudentVerification());
//         dispatch(fetchDisciplines());
//         setActiveTab("records");
//       } catch (err: any) {
//         toast.error(err || "Failed to submit");
//       }
//     },
//   });

//   useEffect(() => {
//     dispatch(fetchDisciplines());
//     dispatch(fetchStudentList());
//   }, [dispatch]);

//   useEffect(() => {
//     const id = Number(formik.values.studentId);
//     if (id && !editId) {
//       dispatch(verifyStudent(id));
//     } else {
//       dispatch(clearStudentVerification());
//     }
//   }, [formik.values.studentId, dispatch, editId]);

//   const handleEdit = (d: Discipline) => {
//     setEditId(d.id);
//     formik.setValues({
//       studentId: d.studentId.toString(),
//       type: d.type,
//       description: d.description,
//       actionTaken: d.actionTaken || "",
//     });
//     setActiveTab("form");
//   };

//   const handleDelete = (id: number) => {
//     if (confirm("Are you sure you want to delete this record?")) {
//       dispatch(deleteDiscipline(id))
//         .unwrap()
//         .then(() => {
//           toast.success("Record deleted.");
//           dispatch(fetchDisciplines());
//         })
//         .catch((err) => toast.error(err));
//     }
//   };

//   const typeData = disciplines.reduce((acc, curr) => {
//     acc[curr.type] = (acc[curr.type] || 0) + 1;
//     return acc;
//   }, {} as Record<string, number>);

//   const typeChartData = {
//     labels: Object.keys(typeData),
//     datasets: [
//       {
//         label: "Incidents",
//         data: Object.values(typeData),
//         backgroundColor: ["#3b82f6", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6"],
//       },
//     ],
//   };

//   const formatDate = (d: string) =>
//     new Date(d).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Discipline Management</h1>
//       </motion.div>

//       {/* Tabs */}
//       <div className="flex space-x-6 border-b mb-6">
//         {["form", "records", "analytics"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab as any)}
//             className={`pb-2 text-sm font-medium ${
//               activeTab === tab ? "border-b-2 border-indigo-500 text-indigo-600" : "text-gray-500"
//             }`}
//           >
//             {tab === "form" ? (editId ? "Edit" : "New") : tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </div>

//       {/* Form */}
//       {activeTab === "form" && (
//         <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {/* Student ID */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-1 block">Student ID</label>
//               <input
//                 type="number"
//                 name="studentId"
//                 value={formik.values.studentId}
//                 onChange={formik.handleChange}
//                 placeholder="Enter ID"
//                 className="w-full border px-3 py-2 rounded"
//               />
//             </div>

//             {/* Dropdown */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-1 block">Select Student</label>
//               <select
//                 onChange={(e) => formik.setFieldValue("studentId", e.target.value)}
//                 className="w-full border px-3 py-2 rounded"
//                 value=""
//               >
//                 <option value="" disabled>
//                   Choose student
//                 </option>
//                 {students.map((s) => (
//                   <option key={s.id} value={s.id}>
//                     {s.fullname} (ID: {s.id})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Incident Type */}
//           <div>
//             <label className="text-sm font-medium text-gray-700 block mb-1">Incident Type</label>
//             <select
//               name="type"
//               value={formik.values.type}
//               onChange={formik.handleChange}
//               className="w-full border px-3 py-2 rounded"
//             >
//               <option value="">Select type</option>
//               <option value="Late Arrival">Late Arrival</option>
//               <option value="Disruption">Disruption</option>
//               <option value="Dishonesty">Dishonesty</option>
//               <option value="Behavior">Behavior</option>
//             </select>
//           </div>

//           {/* Description */}
//           <div>
//             <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
//             <textarea
//               name="description"
//               value={formik.values.description}
//               onChange={formik.handleChange}
//               rows={3}
//               className="w-full border px-3 py-2 rounded"
//             />
//           </div>

//           {/* Action Taken */}
//           <div>
//             <label className="text-sm font-medium text-gray-700 block mb-1">Action Taken</label>
//             <input
//               name="actionTaken"
//               value={formik.values.actionTaken}
//               onChange={formik.handleChange}
//               placeholder="e.g. Warning"
//               className="w-full border px-3 py-2 rounded"
//             />
//           </div>

//           {/* Verified Student */}
//           {studentVerification && (
//             <div className="bg-green-50 text-green-800 p-2 text-sm rounded border border-green-200">
//               ✅ Verified: {studentVerification.fullname}
//             </div>
//           )}

//           <div className="text-right">
//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
//             >
//               {editId ? "Update" : "Submit"}
//             </button>
//           </div>
//         </form>
//       )}

//       {/* Records */}
//       {activeTab === "records" && (
//         <div className="overflow-x-auto bg-white rounded shadow mt-4">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-2 text-left">Student</th>
//                 <th className="px-4 py-2 text-left">Type</th>
//                 <th className="px-4 py-2 text-left">Action</th>
//                 <th className="px-4 py-2 text-left">Date</th>
//                 <th className="px-4 py-2 text-right">Options</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {disciplines.map((d) => (
//                 <tr key={d.id}>
//                   <td className="px-4 py-2">{d.student?.fullname || "Unknown"}</td>
//                   <td className="px-4 py-2">{d.type}</td>
//                   <td className="px-4 py-2">{d.actionTaken || "—"}</td>
//                   <td className="px-4 py-2">{formatDate(d.recordedAt)}</td>
//                   <td className="px-4 py-2 text-right space-x-2">
//                     <button onClick={() => handleEdit(d)} className="text-indigo-600 hover:underline">
//                       <FiEdit2 />
//                     </button>
//                     <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:underline">
//                       <FiTrash2 />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Analytics */}
//       {activeTab === "analytics" && (
//         <div className="bg-white p-6 mt-6 rounded shadow">
//           <div className="flex items-center mb-4">
//             <FiPieChart className="mr-2 text-indigo-500" />
//             <h2 className="text-lg font-semibold text-gray-800">Analytics</h2>
//           </div>
//           <Pie data={typeChartData} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default DisciplinePage;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  fetchDisciplines,
  createDiscipline,
  updateDiscipline,
  deleteDiscipline,
  verifyStudent,
  clearStudentVerification,
  Discipline,
} from "../../../Redux/Auth/Decipline/disciplineSlice";
import { fetchStudentList } from "../../../Redux/Auth/Decipline/studentDisciplineSlice";
import { RootState, AppDispatch } from "../../../Redux/store";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2, FiPieChart } from "react-icons/fi";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DisciplinePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { disciplines, studentVerification, loading } = useSelector(
    (state: RootState) => state.discipline
  );
  const { students } = useSelector((state: RootState) => state.studentDiscipline);

  const [editId, setEditId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"form" | "records" | "analytics">("form");

  const formik = useFormik({
    initialValues: {
      studentId: "",
      type: "",
      description: "",
      actionTaken: "",
    },
    validationSchema: yup.object({
      studentId: yup.number().required("Student ID is required"),
      type: yup.string().required("Type is required"),
      description: yup.string().required("Description is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          studentId: +values.studentId,
          type: values.type,
          description: values.description,
          actionTaken: values.actionTaken,
        };

        if (editId) {
          await dispatch(updateDiscipline({ id: editId, updatedData: payload })).unwrap();
          toast.success("Discipline updated successfully");
        } else {
          await dispatch(createDiscipline(payload)).unwrap();
          toast.success("New discipline record created");
        }

        resetForm();
        setEditId(null);
        dispatch(clearStudentVerification());
        dispatch(fetchDisciplines());
        setActiveTab("records");
      } catch (err: any) {
        toast.error(err.message || "Failed to submit record");
      }
    },
  });

  useEffect(() => {
    dispatch(fetchDisciplines());
    dispatch(fetchStudentList());
  }, [dispatch]);

  useEffect(() => {
    const id = Number(formik.values.studentId);
    if (id && !editId) {
      dispatch(verifyStudent(id));
    } else {
      dispatch(clearStudentVerification());
    }
  }, [formik.values.studentId, dispatch, editId]);

  const handleEdit = (d: Discipline) => {
    setEditId(d.id);
    formik.setValues({
      studentId: d.studentId.toString(),
      type: d.type,
      description: d.description,
      actionTaken: d.actionTaken || "",
    });
    setActiveTab("form");
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      try {
        await dispatch(deleteDiscipline(id)).unwrap();
        toast.success("Record deleted successfully");
        dispatch(fetchDisciplines());
      } catch (err: any) {
        toast.error(err.message || "Failed to delete record");
      }
    }
  };

  const typeData = disciplines.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeChartData = {
    labels: Object.keys(typeData),
    datasets: [
      {
        label: "Incidents by Type",
        data: Object.values(typeData),
        backgroundColor: [
          "#3b82f6", // blue
          "#f59e0b", // amber
          "#ef4444", // red
          "#10b981", // emerald
          "#8b5cf6", // violet
        ],
        borderWidth: 0,
      },
    ],
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Discipline Management</h1>
        <p className="text-gray-500 mt-1">Track and manage student disciplinary records</p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b border-gray-200 mb-6">
        {[
          { id: "form", label: editId ? "Edit Record" : "New Record" },
          { id: "records", label: "Records" },
          { id: "analytics", label: "Analytics" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-1 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Section */}
      {activeTab === "form" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-lg font-semibold mb-4">
            {editId ? "Edit Discipline Record" : "Create New Record"}
          </h2>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Student ID Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID
                </label>
                <input
                  type="number"
                  name="studentId"
                  value={formik.values.studentId}
                  onChange={formik.handleChange}
                  placeholder="Enter student ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {formik.errors.studentId && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.studentId}</p>
                )}
              </div>

              {/* Student Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Or select student
                </label>
                <select
                  onChange={(e) => formik.setFieldValue("studentId", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value=""
                >
                  <option value="" disabled>
                    Select student
                  </option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullname} (ID: {s.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Incident Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Incident Type
              </label>
              <select
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select incident type</option>
                <option value="Late Arrival">Late Arrival</option>
                <option value="Disruption">Disruption</option>
                <option value="Dishonesty">Dishonesty</option>
                <option value="Behavior">Behavior</option>
              </select>
              {formik.errors.type && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.type}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe the incident..."
              />
              {formik.errors.description && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.description}</p>
              )}
            </div>

            {/* Action Taken */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Action Taken (Optional)
              </label>
              <input
                name="actionTaken"
                value={formik.values.actionTaken}
                onChange={formik.handleChange}
                placeholder="e.g. Verbal warning, detention, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Verification Status */}
            {studentVerification && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <span className="text-green-700 text-sm">
                  ✅ Verified: {studentVerification.fullname}
                </span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
              >
                {loading
                  ? "Processing..."
                  : editId
                  ? "Update Record"
                  : "Create Record"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Records Section */}
      {activeTab === "records" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Incident Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action Taken
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {disciplines.length > 0 ? (
                  disciplines.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {d.student?.fullname || "Unknown"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{d.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {d.actionTaken || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(d.recordedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleEdit(d)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <FiEdit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(d.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No discipline records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Analytics Section */}
      {activeTab === "analytics" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center mb-6">
            <FiPieChart className="h-5 w-5 text-indigo-500 mr-2" />
            <h2 className="text-lg font-semibold">Disciplinary Incidents by Type</h2>
          </div>
          <div className="h-64">
            <Pie
              data={typeChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DisciplinePage;