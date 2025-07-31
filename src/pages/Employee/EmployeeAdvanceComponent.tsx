// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createAdvance,
//   fetchEmployeeAdvances,
//   deleteAdvance,
//   updateAdvance,
//   clearAdvanceState,
//   clearAdvancesData,
// } from "../../Redux/Epmloyee/employeeAdvanceSlice";
// import { RootState, AppDispatch } from "../../Redux/store";
// import dayjs from "dayjs";
// import { FiDollarSign, FiCalendar, FiUser, FiTrash2, FiPlusCircle, FiXCircle, FiBookOpen, FiEdit, FiSave, FiX, FiPrinter } from "react-icons/fi";
// import { motion, AnimatePresence } from "framer-motion";
// import toast from "react-hot-toast";

// const EmployeeAdvanceComponent: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const {
//     advances,
//     totalAdvance,
//     loading,
//     error,
//     success,
//   } = useSelector((state: RootState) => state.employeeAdvance);

//   // Form states
//   const [searchQuery, setSearchQuery] = useState<string | number>('');
//   const [searchByType, setSearchByType] = useState<'id' | 'name'>('id'); // 'id' or 'name'

//   const [month, setMonth] = useState<number>(dayjs().month() + 1);
//   const [year, setYear] = useState<number>(dayjs().year());
//   const [amount, setAmount] = useState<number | ''>('');
//   const [reason, setReason] = useState<string>("");
//   const [editingAdvanceId, setEditingAdvanceId] = useState<number | null>(null);

//   // Debounce for fetching advances based on employeeId, employeeName, and other filters
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       const employeeIdParam = searchByType === 'id' && searchQuery !== '' ? Number(searchQuery) : undefined;
//       const employeeNameParam = searchByType === 'name' && searchQuery !== '' ? String(searchQuery) : undefined;

//       // Only fetch if there's a search query, otherwise clear data
//       if (employeeIdParam !== undefined || employeeNameParam !== undefined) {
//         dispatch(
//           fetchEmployeeAdvances({
//             employeeId: employeeIdParam,
//             employeeName: employeeNameParam,
//             month,
//             year,
//           })
//         );
//       } else {
//         dispatch(clearAdvancesData()); // Clear table if no search criteria
//       }
//     }, 500);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [dispatch, searchQuery, searchByType, month, year]);

//   // Clear state on component unmount
//   useEffect(() => {
//     return () => {
//       dispatch(clearAdvanceState());
//     };
//   }, [dispatch]);

//   // Notifications for success and error
//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//       dispatch(clearAdvanceState());
//     }
//     if (success) {
//       toast.success(success);
//       dispatch(clearAdvanceState());
//       if (editingAdvanceId) {
//         setEditingAdvanceId(null);
//         resetForm(); // Reset form after successful edit
//       }
//     }
//   }, [error, success, dispatch, editingAdvanceId]);

//   // Helper to reset form fields
//   const resetForm = () => {
//     setSearchQuery('');
//     setAmount('');
//     setReason('');
//     // For Month/Year, keep existing values or reset if needed, or reset to current month/year
//     // setMonth(dayjs().month() + 1);
//     // setYear(dayjs().year());
//   };

//   const handleCreate = () => {
//     // Determine employeeId for creation - must be by ID
//     let employeeIdForCreation: number | undefined;
//     if (searchByType === 'id' && searchQuery !== '' && !isNaN(Number(searchQuery))) {
//       employeeIdForCreation = Number(searchQuery);
//     } else {
//       toast.error("Please enter a valid Employee ID when adding a new advance.");
//       return;
//     }

//     if (!employeeIdForCreation || !amount || !month || !year || Number(amount) <= 0) {
//       toast.error("Please fill in all required fields (Employee ID, Amount, Month, Year) and ensure amount is greater than 0.");
//       return;
//     }
//     dispatch(createAdvance({ employeeId: employeeIdForCreation, data: { amount: Number(amount), reason, month, year } }));
//   };

//   const handleEdit = (advance: any) => {
//     setEditingAdvanceId(advance.id);
//     setSearchByType('id'); // When editing, we always set to ID mode to show the specific employee's ID
//     setSearchQuery(advance.employee.id);
//     setAmount(advance.amount);
//     setReason(advance.reason);
//     setMonth(advance.month);
//     setYear(advance.year);
//   };

//   const handleUpdate = () => {
//     // Determine employeeId for update - must be by ID
//     let employeeIdForUpdate: number | undefined;
//     if (searchByType === 'id' && searchQuery !== '' && !isNaN(Number(searchQuery))) {
//       employeeIdForUpdate = Number(searchQuery);
//     } else {
//       toast.error("Please ensure a valid Employee ID is entered for update.");
//       return;
//     }

//     if (!editingAdvanceId || !employeeIdForUpdate || !amount || !month || !year || Number(amount) <= 0) {
//       toast.error("Please ensure all fields are valid for update.");
//       return;
//     }
//     toast.promise(
//       dispatch(updateAdvance({ id: editingAdvanceId, data: { employeeId: employeeIdForUpdate, amount: Number(amount), reason, month, year } })).unwrap(),
//       {
//         loading: 'Updating advance...',
//         success: 'Advance successfully updated!',
//         error: 'Failed to update advance.',
//       }
//     );
//   };

//   const handleCancelEdit = () => {
//     setEditingAdvanceId(null);
//     resetForm();
//   };

//   const handleDelete = (id: number) => {
//     toast.promise(
//       dispatch(deleteAdvance(id)).unwrap(),
//       {
//         loading: 'Deleting advance...',
//         success: 'Advance successfully deleted!',
//         error: 'Failed to delete advance.',
//       }
//     );
//   };

//   // Framer Motion variants for main container
//   const containerVariants = {
//     hidden: { opacity: 0, y: 20 },
//     show: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.6,
//         ease: "easeOut",
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   // Variants for the individual input cards
//   const inputCardVariants = {
//     hidden: { opacity: 0, y: 20, scale: 0.95 },
//     show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
//   };

//   // Variants for table rows
//   const tableRowVariants = {
//     initial: { opacity: 0, y: 20 },
//     animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
//     exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
//   };

//   return (
//     // OUTMOST CONTAINER: This div now has id="print-container" and will be the only thing visible for print.
//     <div id="print-container" className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
//       <motion.div
//         className="bg-white rounded-xl shadow-lg p-8 max-w-5xl w-full border border-gray-200 print-content-area" // Renamed from 'print-area' to 'print-content-area'
//         initial="hidden"
//         animate="show"
//         variants={containerVariants}
//       >
//         {/* Main Title (HIDDEN ON PRINT) */}
//         <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-800 hide-on-print">
//           <FiDollarSign className="inline-block mr-3 text-blue-600 align-middle" size={38} />
//           Employee Advance Management
//         </h2>

//         {/* Loading Indicator (HIDDEN ON PRINT) */}
//         {loading && (
//           <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl hide-on-print">
//             <div className="flex flex-col items-center">
//               <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-b-4 border-transparent mb-4"></div>
//               <p className="text-lg text-blue-700 font-semibold">Fetching data...</p>
//             </div>
//           </div>
//         )}

//         {/* --- Input & Filter Section (HIDDEN ON PRINT) --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-xl hide-on-print">

//           {/* Id or Name Input */}
//           <motion.div
//             variants={inputCardVariants}
//             className="flex flex-col items-center justify-center bg-blue-700 text-white p-4 rounded-xl shadow-lg border border-blue-800 relative"
//           >
//             <div className="flex items-center justify-center w-full mb-2">
//               <span className="text-sm font-medium mr-3">Search by:</span>
//               <label className="inline-flex items-center cursor-pointer">
//                 <input
//                   type="radio"
//                   className="form-radio h-4 w-4 text-white bg-white border-white"
//                   name="searchOption"
//                   value="id"
//                   checked={searchByType === 'id'}
//                   onChange={() => setSearchByType('id')}
//                   disabled={!!editingAdvanceId}
//                 />
//                 <span className="ml-1 text-sm font-medium">ID</span>
//               </label>
//               <label className="inline-flex items-center ml-4 cursor-pointer">
//                 <input
//                   type="radio"
//                   className="form-radio h-4 w-4 text-white bg-white border-white"
//                   name="searchOption"
//                   value="name"
//                   checked={searchByType === 'name'}
//                   onChange={() => setSearchByType('name')}
//                   disabled={!!editingAdvanceId}
//                 />
//                 <span className="ml-1 text-sm font-medium">Name</span>
//               </label>
//             </div>
//             <input
//               id="idOrName"
//               type={searchByType === 'id' ? 'number' : 'text'}
//               placeholder={searchByType === 'id' ? 'Enter Employee ID' : 'Enter Employee Name'}
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full bg-white text-gray-900 placeholder-gray-500 text-center text-xl font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
//               disabled={!!editingAdvanceId}
//             />
//           </motion.div>

//           {/* Advance Amount */}
//           <motion.div
//             variants={inputCardVariants}
//             className="flex items-center justify-center bg-blue-700 text-white p-4 rounded-xl shadow-lg border border-blue-800 relative"
//           >
//             <input
//               id="amount"
//               type="number"
//               placeholder="Advance Amount"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
//               className="w-full bg-white text-gray-900 placeholder-gray-500 text-center text-xl font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
//             />
//           </motion.div>

//           {/* Reason for Advance */}
//           <motion.div
//             variants={inputCardVariants}
//             className="flex items-center justify-center bg-blue-700 text-white p-4 rounded-xl shadow-lg border border-blue-800 relative"
//           >
//             <input
//               id="reason"
//               type="text"
//               placeholder="Reason for Advance"
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//               className="w-full bg-white text-gray-900 placeholder-gray-500 text-center text-xl font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
//             />
//           </motion.div>

//           {/* Month & Year Group */}
//           <motion.div
//             variants={inputCardVariants}
//             className="flex flex-col justify-center bg-white p-4 rounded-lg shadow-md border border-blue-200 hover:shadow-lg transition-all duration-300 relative"
//           >
//             <label className="text-gray-700 text-sm font-semibold mb-2 block text-center">Month & Year</label>
//             <div className="flex gap-4">
//               {/* Month */}
//               <div className="floating-input-group flex-1">
//                 <select
//                   id="month"
//                   value={month}
//                   onChange={(e) => setMonth(Number(e.target.value))}
//                   className="floating-input-field appearance-none pr-8 peer text-lg py-3 px-4"
//                   disabled={!!editingAdvanceId}
//                 >
//                   {[...Array(12)].map((_, idx) => (
//                     <option key={idx + 1} value={idx + 1}>
//                       {dayjs().month(idx).format('MMM')} {/* Shorter month name */}
//                     </option>
//                   ))}
//                 </select>
//                 <label htmlFor="month" className="floating-input-label text-md peer-focus:text-blue-600 peer-valid:text-blue-600">Month</label>
//                 <FiCalendar className="input-icon-right text-gray-400 peer-focus:text-blue-500 text-xl" />
//               </div>

//               {/* Year */}
//               <div className="floating-input-group flex-1">
//                 <input
//                   id="year"
//                   type="number"
//                   placeholder=" "
//                   value={year}
//                   onChange={(e) => setYear(Number(e.target.value))}
//                   className="floating-input-field peer text-lg py-3 px-4"
//                   disabled={!!editingAdvanceId}
//                 />
//                 <label htmlFor="year" className="floating-input-label text-md peer-focus:text-blue-600 peer-valid:text-blue-600">Year</label>
//                 <FiCalendar className="input-icon-right text-gray-400 peer-focus:text-blue-500 text-xl" />
//               </div>
//             </div>
//           </motion.div>
//         </div>
//         {/* --- End Input & Filter Section --- */}

//         {/* Action Buttons (HIDDEN ON PRINT) */}
//         <div className="flex gap-4 hide-on-print">
//           {editingAdvanceId ? (
//             <>
//               <motion.button
//                 onClick={handleUpdate}
//                 className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-lg font-semibold"
//                 whileHover={{ scale: 1.01 }}
//                 whileTap={{ scale: 0.99 }}
//               >
//                 <FiSave size={24} />
//                 Update Advance
//               </motion.button>
//               <motion.button
//                 onClick={handleCancelEdit}
//                 className="flex-1 flex items-center justify-center gap-2 bg-gray-400 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-500 transition-colors duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 text-lg font-semibold"
//                 whileHover={{ scale: 1.01 }}
//                 whileTap={{ scale: 0.99 }}
//               >
//                 <FiX size={24} />
//                 Cancel Edit
//               </motion.button>
//             </>
//           ) : (
//             <motion.button
//               onClick={handleCreate}
//               className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg font-semibold"
//               whileHover={{ scale: 1.01 }}
//               whileTap={{ scale: 0.99 }}
//             >
//               <FiPlusCircle size={24} />
//               Record New Advance
//             </motion.button>
//           )}
//         </div>

//         {/* Summary Card (VISIBLE FOR PRINT) */}
//         <motion.div
//           className="mt-8 p-6 bg-blue-600 text-white rounded-lg shadow-lg flex justify-between items-center flex-wrap gap-4"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.3 }}
//         >
//           <div className="flex items-center text-2xl font-bold">
//             <FiDollarSign className="mr-3" size={32} />
//             Total Advances: <span className="ml-2">${totalAdvance.toFixed(2)}</span>
//           </div>
//           <div className="text-sm font-medium opacity-90">
//             <p className="flex items-center gap-2 mb-1">
//               <FiUser /> Employee ID: <span className="font-semibold">{searchByType === 'id' && searchQuery !== '' ? searchQuery : 'None Selected'}</span>
//             </p>
//             <p className="flex items-center gap-2">
//               <FiCalendar /> Period: <span className="font-semibold">{dayjs().month(month - 1).format('MMMM')} {year}</span>
//             </p>
//             {searchByType === 'name' && searchQuery !== '' && (
//               <p className="flex items-center gap-2 mt-1">
//                 <FiUser /> Name: <span className="font-semibold">{searchQuery}</span>
//               </p>
//             )}
//           </div>
//         </motion.div>

//         {/* Advances List/Table Header with Print Button */}
//         <div className="mt-8 flex justify-between items-center mb-4">
//           <h3 className="text-2xl font-bold text-gray-800 flex items-center">
//             <FiBookOpen className="mr-2 text-blue-600" /> All Employee Advances
//           </h3>
//           <motion.button
//             onClick={() => window.print()} // Triggers browser's print dialog
//             className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300 transition-colors duration-200 text-md font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400 print-report-button" // This button will hide itself on print
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <FiPrinter size={20} /> Print Report
//           </motion.button>
//         </div>

//         {/* Advances List/Table (VISIBLE FOR PRINT) */}
//         {advances.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5, delay: 0.5 }}
//             className="text-center py-16 mt-8 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 text-gray-600"
//           >
//             <FiXCircle className="text-gray-400 text-6xl mb-6 mx-auto" />
//             <p className="text-2xl font-semibold mb-2">
//               {(searchQuery !== '' || searchByType !== 'id') ? "No advances found matching your criteria." : "Enter an Employee ID or Name to view advances."}
//             </p>
//             <p className="text-md">Use the fields above to search or add a new advance.</p>
//           </motion.div>
//         ) : (
//           <div className="mt-8 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-blue-700 text-white">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Reason</th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Employee</th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Recorded By</th>
//                     <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <AnimatePresence>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {advances.map((adv) => (
//                       <motion.tr
//                         key={adv.id}
//                         className={`transition-colors duration-200 odd:bg-white even:bg-gray-50 ${editingAdvanceId === adv.id ? 'bg-yellow-100 hover:bg-yellow-200' : 'hover:bg-blue-50'}`}
//                         variants={tableRowVariants}
//                         initial="initial"
//                         animate="animate"
//                         exit="exit"
//                         layout
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{adv.id}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-semibold">${adv.amount.toFixed(2)}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{adv.reason || 'N/A'}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{adv.employee?.fullName || 'Unknown'}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{adv.createdBy?.fullName || 'N/A'}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                           <div className="flex justify-end space-x-2">
//                             <button
//                               onClick={() => handleEdit(adv)}
//                               className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center gap-1"
//                               title="Edit Advance"
//                               disabled={!!editingAdvanceId}
//                             >
//                               <FiEdit size={16} /> Edit
//                             </button>
//                             <button
//                               onClick={() => handleDelete(adv.id)}
//                               className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center gap-1"
//                               title="Delete Advance"
//                               disabled={!!editingAdvanceId}
//                             >
//                               <FiTrash2 size={16} /> Delete
//                             </button>
//                           </div>
//                         </td>
//                       </motion.tr>
//                     ))}
//                   </tbody>
//                 </AnimatePresence>
//               </table>
//             </div>
//           </div>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default EmployeeAdvanceComponent;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createAdvance,
  fetchEmployeeAdvances,
  deleteAdvance,
  updateAdvance,
  clearAdvanceState,
  clearAdvancesData,
} from "../../Redux/Epmloyee/employeeAdvanceSlice";
import { RootState, AppDispatch } from "../../Redux/store";
import dayjs from "dayjs";
import {
  FiDollarSign,
  FiCalendar,
  FiUser,
  FiTrash2,
  FiPlusCircle,
  FiXCircle,
  FiBookOpen,
  FiEdit,
  FiSave,
  FiX,
  FiPrinter,
} from "react-icons/fi";
import { motion, AnimatePresence, Variants } from "framer-motion"; // Import Variants
import toast from "react-hot-toast";

const EmployeeAdvanceComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { advances, totalAdvance, loading, error, success } = useSelector(
    (state: RootState) => state.employeeAdvance
  );

  // Form states
  const [searchQuery, setSearchQuery] = useState<string | number>("");
  const [searchByType, setSearchByType] = useState<"id" | "name">("id"); // 'id' or 'name'

  const [month, setMonth] = useState<number>(dayjs().month() + 1);
  const [year, setYear] = useState<number>(dayjs().year());
  const [amount, setAmount] = useState<number | "">("");
  const [reason, setReason] = useState<string>("");
  const [editingAdvanceId, setEditingAdvanceId] = useState<number | null>(null);

  // Debounce for fetching advances based on employeeId, employeeName, and other filters
  useEffect(() => {
    const handler = setTimeout(() => {
      const employeeIdParam =
        searchByType === "id" && searchQuery !== ""
          ? Number(searchQuery)
          : undefined;
      const employeeNameParam =
        searchByType === "name" && searchQuery !== ""
          ? String(searchQuery)
          : undefined;

      // Only fetch if there's a search query, otherwise clear data
      if (employeeIdParam !== undefined || employeeNameParam !== undefined) {
        dispatch(
          fetchEmployeeAdvances({
            employeeId: employeeIdParam,
            employeeName: employeeNameParam,
            month,
            year,
          })
        );
      } else {
        dispatch(clearAdvancesData()); // Clear table if no search criteria
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [dispatch, searchQuery, searchByType, month, year]);

  // Clear state on component unmount
  useEffect(() => {
    return () => {
      dispatch(clearAdvanceState());
    };
  }, [dispatch]);

  // Notifications for success and error
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAdvanceState());
    }
    if (success) {
      toast.success(success);
      dispatch(clearAdvanceState());
      if (editingAdvanceId) {
        setEditingAdvanceId(null);
        resetForm(); // Reset form after successful edit
      }
    }
  }, [error, success, dispatch, editingAdvanceId]);

  // Helper to reset form fields
  const resetForm = () => {
    setSearchQuery("");
    setAmount("");
    setReason("");
    // For Month/Year, keep existing values or reset if needed, or reset to current month/year
    // setMonth(dayjs().month() + 1);
    // setYear(dayjs().year());
  };

  const handleCreate = () => {
    // Determine employeeId for creation - must be by ID
    let employeeIdForCreation: number | undefined;
    if (searchByType === "id" && searchQuery !== "" && !isNaN(Number(searchQuery))) {
      employeeIdForCreation = Number(searchQuery);
    } else {
      toast.error("Please enter a valid Employee ID when adding a new advance.");
      return;
    }

    if (!employeeIdForCreation || !amount || !month || !year || Number(amount) <= 0) {
      toast.error(
        "Please fill in all required fields (Employee ID, Amount, Month, Year) and ensure amount is greater than 0."
      );
      return;
    }
    dispatch(
      createAdvance({
        employeeId: employeeIdForCreation,
        data: { amount: Number(amount), reason, month, year },
      })
    );
  };

  const handleEdit = (advance: any) => {
    setEditingAdvanceId(advance.id);
    setSearchByType("id"); // When editing, we always set to ID mode to show the specific employee's ID
    setSearchQuery(advance.employee.id);
    setAmount(advance.amount);
    setReason(advance.reason);
    setMonth(advance.month);
    setYear(advance.year);
  };

  const handleUpdate = () => {
    // Determine employeeId for update - must be by ID
    let employeeIdForUpdate: number | undefined;
    if (searchByType === "id" && searchQuery !== "" && !isNaN(Number(searchQuery))) {
      employeeIdForUpdate = Number(searchQuery);
    } else {
      toast.error("Please ensure a valid Employee ID is entered for update.");
      return;
    }

    if (
      !editingAdvanceId ||
      !employeeIdForUpdate ||
      !amount ||
      !month ||
      !year ||
      Number(amount) <= 0
    ) {
      toast.error("Please ensure all fields are valid for update.");
      return;
    }
    toast.promise(
      dispatch(
        updateAdvance({
          id: editingAdvanceId,
          data: {
            employeeId: employeeIdForUpdate,
            amount: Number(amount),
            reason,
            month,
            year,
          },
        })
      ).unwrap(),
      {
        loading: "Updating advance...",
        success: "Advance successfully updated!",
        error: "Failed to update advance.",
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingAdvanceId(null);
    resetForm();
  };

  const handleDelete = (id: number) => {
    toast.promise(dispatch(deleteAdvance(id)).unwrap(), {
      loading: "Deleting advance...",
      success: "Advance successfully deleted!",
      error: "Failed to delete advance.",
    });
  };

  // Framer Motion variants for main container
  const containerVariants: Variants = {
    // Explicitly type here
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  // Variants for the individual input cards
  const inputCardVariants: Variants = {
    // Explicitly type here
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  // Variants for table rows
  const tableRowVariants: Variants = {
    // Explicitly type here
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  return (
    // OUTMOST CONTAINER: This div now has id="print-container" and will be the only thing visible for print.
    <div id="print-container" className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
      <motion.div
        className="bg-white rounded-xl shadow-lg p-8 max-w-5xl w-full border border-gray-200 print-content-area" // Renamed from 'print-area' to 'print-content-area'
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        {/* Main Title (HIDDEN ON PRINT) */}
        <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-800 hide-on-print">
          <FiDollarSign className="inline-block mr-3 text-blue-600 align-middle" size={38} />
          Employee Advance Management
        </h2>

        {/* Loading Indicator (HIDDEN ON PRINT) */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl hide-on-print">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-b-4 border-transparent mb-4"></div>
              <p className="text-lg text-blue-700 font-semibold">Fetching data...</p>
            </div>
          </div>
        )}

        {/* --- Input & Filter Section (HIDDEN ON PRINT) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-xl hide-on-print">
          {/* Id or Name Input */}
          <motion.div
            variants={inputCardVariants}
            className="flex flex-col items-center justify-center bg-blue-700 text-white p-4 rounded-xl shadow-lg border border-blue-800 relative"
          >
            <div className="flex items-center justify-center w-full mb-2">
              <span className="text-sm font-medium mr-3">Search by:</span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-white bg-white border-white"
                  name="searchOption"
                  value="id"
                  checked={searchByType === "id"}
                  onChange={() => setSearchByType("id")}
                  disabled={!!editingAdvanceId}
                />
                <span className="ml-1 text-sm font-medium">ID</span>
              </label>
              <label className="inline-flex items-center ml-4 cursor-pointer">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-white bg-white border-white"
                  name="searchOption"
                  value="name"
                  checked={searchByType === "name"}
                  onChange={() => setSearchByType("name")}
                  disabled={!!editingAdvanceId}
                />
                <span className="ml-1 text-sm font-medium">Name</span>
              </label>
            </div>
            <input
              id="idOrName"
              type={searchByType === "id" ? "number" : "text"}
              placeholder={
                searchByType === "id" ? "Enter Employee ID" : "Enter Employee Name"
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-gray-900 placeholder-gray-500 text-center text-xl font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={!!editingAdvanceId}
            />
          </motion.div>

          {/* Advance Amount */}
          <motion.div
            variants={inputCardVariants}
            className="flex items-center justify-center bg-blue-700 text-white p-4 rounded-xl shadow-lg border border-blue-800 relative"
          >
            <input
              id="amount"
              type="number"
              placeholder="Advance Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full bg-white text-gray-900 placeholder-gray-500 text-center text-xl font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
            />
          </motion.div>

          {/* Reason for Advance */}
          <motion.div
            variants={inputCardVariants}
            className="flex items-center justify-center bg-blue-700 text-white p-4 rounded-xl shadow-lg border border-blue-800 relative"
          >
            <input
              id="reason"
              type="text"
              placeholder="Reason for Advance"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-white text-gray-900 placeholder-gray-500 text-center text-xl font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
            />
          </motion.div>

          {/* Month & Year Group */}
          <motion.div
            variants={inputCardVariants}
            className="flex flex-col justify-center bg-white p-4 rounded-lg shadow-md border border-blue-200 hover:shadow-lg transition-all duration-300 relative"
          >
            <label className="text-gray-700 text-sm font-semibold mb-2 block text-center">
              Month & Year
            </label>
            <div className="flex gap-4">
              {/* Month */}
              <div className="floating-input-group flex-1">
                <select
                  id="month"
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="floating-input-field appearance-none pr-8 peer text-lg py-3 px-4"
                  disabled={!!editingAdvanceId}
                >
                  {[...Array(12)].map((_, idx) => (
                    <option key={idx + 1} value={idx + 1}>
                      {dayjs().month(idx).format("MMM")} {/* Shorter month name */}
                    </option>
                  ))}
                </select>
                <label
                  htmlFor="month"
                  className="floating-input-label text-md peer-focus:text-blue-600 peer-valid:text-blue-600"
                >
                  Month
                </label>
                <FiCalendar className="input-icon-right text-gray-400 peer-focus:text-blue-500 text-xl" />
              </div>

              {/* Year */}
              <div className="floating-input-group flex-1">
                <input
                  id="year"
                  type="number"
                  placeholder=" "
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="floating-input-field peer text-lg py-3 px-4"
                  disabled={!!editingAdvanceId}
                />
                <label
                  htmlFor="year"
                  className="floating-input-label text-md peer-focus:text-blue-600 peer-valid:text-blue-600"
                >
                  Year
                </label>
                <FiCalendar className="input-icon-right text-gray-400 peer-focus:text-blue-500 text-xl" />
              </div>
            </div>
          </motion.div>
        </div>
        {/* --- End Input & Filter Section --- */}

        {/* Action Buttons (HIDDEN ON PRINT) */}
        <div className="flex gap-4 hide-on-print">
          {editingAdvanceId ? (
            <>
              <motion.button
                onClick={handleUpdate}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-lg font-semibold"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <FiSave size={24} />
                Update Advance
              </motion.button>
              <motion.button
                onClick={handleCancelEdit}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-400 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-500 transition-colors duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 text-lg font-semibold"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <FiX size={24} />
                Cancel Edit
              </motion.button>
            </>
          ) : (
            <motion.button
              onClick={handleCreate}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg font-semibold"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <FiPlusCircle size={24} />
              Record New Advance
            </motion.button>
          )}
        </div>

        {/* Summary Card (VISIBLE FOR PRINT) */}
        <motion.div
          className="mt-8 p-6 bg-blue-600 text-white rounded-lg shadow-lg flex justify-between items-center flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center text-2xl font-bold">
            <FiDollarSign className="mr-3" size={32} />
            Total Advances: <span className="ml-2">${totalAdvance.toFixed(2)}</span>
          </div>
          <div className="text-sm font-medium opacity-90">
            <p className="flex items-center gap-2 mb-1">
              <FiUser /> Employee ID:{" "}
              <span className="font-semibold">
                {searchByType === "id" && searchQuery !== "" ? searchQuery : "None Selected"}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <FiCalendar /> Period:{" "}
              <span className="font-semibold">{dayjs().month(month - 1).format("MMMM")} {year}</span>
            </p>
            {searchByType === "name" && searchQuery !== "" && (
              <p className="flex items-center gap-2 mt-1">
                <FiUser /> Name: <span className="font-semibold">{searchQuery}</span>
              </p>
            )}
          </div>
        </motion.div>

        {/* Advances List/Table Header with Print Button */}
        <div className="mt-8 flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center">
            <FiBookOpen className="mr-2 text-blue-600" /> All Employee Advances
          </h3>
          <motion.button
            onClick={() => window.print()} // Triggers browser's print dialog
            className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300 transition-colors duration-200 text-md font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400 print-report-button" // This button will hide itself on print
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPrinter size={20} /> Print Report
          </motion.button>
        </div>

        {/* Advances List/Table (VISIBLE FOR PRINT) */}
        {advances.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center py-16 mt-8 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 text-gray-600"
          >
            <FiXCircle className="text-gray-400 text-6xl mb-6 mx-auto" />
            <p className="text-2xl font-semibold mb-2">
              {searchQuery !== "" || searchByType !== "id"
                ? "No advances found matching your criteria."
                : "Enter an Employee ID or Name to view advances."}
            </p>
            <p className="text-md">Use the fields above to search or add a new advance.</p>
          </motion.div>
        ) : (
          <div className="mt-8 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-700 text-white">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Reason
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Employee
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Recorded By
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <AnimatePresence>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {advances.map((adv) => (
                      <motion.tr
                        key={adv.id}
                        className={`transition-colors duration-200 odd:bg-white even:bg-gray-50 ${
                          editingAdvanceId === adv.id ? "bg-yellow-100 hover:bg-yellow-200" : "hover:bg-blue-50"
                        }`}
                        variants={tableRowVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        layout
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {adv.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-semibold">
                          ${adv.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {adv.reason || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {adv.employee?.fullName || "Unknown"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {adv.createdBy?.fullName || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(adv)}
                              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center gap-1"
                              title="Edit Advance"
                              disabled={!!editingAdvanceId}
                            >
                              <FiEdit size={16} /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(adv.id)}
                              className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center gap-1"
                              title="Delete Advance"
                              disabled={!!editingAdvanceId}
                            >
                              <FiTrash2 size={16} /> Delete
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </AnimatePresence>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EmployeeAdvanceComponent;