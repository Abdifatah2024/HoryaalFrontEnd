// import React, { useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from "../../Redux/store";
// import {
//   fetchFamilyBalance,
//   payFamilyMonthly,
//   clearFamilyBalance,
//   clearFamilyPaymentStatus,
//   checkPaymentNumberUsed,
//   checkLastPaymentByNumber,
//   clearLastPaymentInfo,
// } from "../../Redux/Payment/familyPaymentSlice";
// import { toast } from "react-hot-toast";
// import {
//   FiUser,
//   FiDollarSign,
//   FiSearch,
//   FiXCircle,
//   FiCheckCircle,
//   FiCalendar,
//   FiTag,
//   FiCreditCard,
//   FiInfo,
// } from "react-icons/fi"; // Added FiCalendar, FiTag, FiCreditCard, FiInfo
// import { FaMoneyBillWave } from "react-icons/fa";

// const FamilyPayment: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const {
//     family,
//     loading,
//     error,
//     paymentError,
//     paymentSuccess,
//     paymentLoading,
//     checkLoading,
//     lastPaymentLoading,
//     lastPaymentInfo,
//   } = useAppSelector((state) => state.familyPayment);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
//   const [year, setYear] = useState<number>(new Date().getFullYear());
//   const [discount, setDiscount] = useState<number>(0);
//   const [discountReason, setDiscountReason] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("Cash");
//   const [zaadNumber, setZaadNumber] = useState("");
//   const [edahabNumber, setEdahabNumber] = useState("");
//   const [isDiscountVisible, setIsDiscountVisible] = useState(false);
//   const [numberChecked, setNumberChecked] = useState(false);

//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

//   // 🔍 Search Handler
//   const handleSearch = (e?: React.FormEvent) => {
//     e?.preventDefault();
//     const query = searchQuery.trim();
//     if (!query) {
//       toast.error("Please enter a phone number or family name.");
//       return;
//     }
//     dispatch(fetchFamilyBalance(query));
//     dispatch(clearLastPaymentInfo()); // Clear last payment info on new search
//   };

//   // 🧹 Reset Form
//   const handleClear = () => {
//     dispatch(clearFamilyBalance());
//     dispatch(clearLastPaymentInfo());
//     setSearchQuery("");
//     setMonth(new Date().getMonth() + 1);
//     setYear(new Date().getFullYear());
//     setDiscount(0);
//     setDiscountReason("");
//     setZaadNumber("");
//     setEdahabNumber("");
//     setPaymentMethod("Cash");
//     setNumberChecked(false);
//     setIsDiscountVisible(false);
//   };

//   // 🔎 Check Number Used
//   const handleCheckUsed = async () => {
//     const number = paymentMethod === "ZAAD" ? zaadNumber.trim() : edahabNumber.trim();
//     if (!number) {
//       toast.error("Please enter a valid number to check.");
//       setNumberChecked(false); // Reset check status if number is empty
//       return;
//     }

//     try {
//       const result = await dispatch(
//         checkPaymentNumberUsed({ number, month, year, method: paymentMethod })
//       ).unwrap();

//       if (result.alreadyUsed) {
//         toast.error(result.message);
//         setNumberChecked(false); // It's already used for THIS month/year, so mark as not checked for current payment
//       } else {
//         toast.success(result.message);
//         setNumberChecked(true); // Mark as checked and available
//       }
//     } catch (error: any) {
//       toast.error(error || "An error occurred while checking the number.");
//       setNumberChecked(false);
//     }
//   };

//   // 🔍 Check Last Payment
//   const handleCheckLastPayment = async () => {
//     const number = paymentMethod === "ZAAD" ? zaadNumber.trim() : edahabNumber.trim();
//     if (!number) {
//       toast.error("Please enter a valid number to check last payment.");
//       return;
//     }

//     try {
//       // Dispatch action and unwrap the result to handle success/failure
//       const res = await dispatch(
//         checkLastPaymentByNumber({ number, method: paymentMethod })
//       ).unwrap();

//       if (res.alreadyUsed) {
//         toast.success(res.message);
//         // The last payment info is now in `lastPaymentInfo` state, which will trigger the UI update.
//       } else {
//         toast.error(res.message);
//         dispatch(clearLastPaymentInfo()); // Clear previous last payment info if nothing found
//       }
//     } catch (error: any) {
//       toast.error(error || "Error checking last payment.");
//       dispatch(clearLastPaymentInfo()); // Clear on error
//     }
//   };

//   // 💸 Handle Payment
//   const handlePay = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!family) {
//       toast.error("Please search for a family first.");
//       return;
//     }

//     if ((paymentMethod === "ZAAD" || paymentMethod === "E-dahab") && !numberChecked) {
//       toast.error("Please check the payment number before proceeding.");
//       return;
//     }

//     let finalDescription = paymentMethod;
//     if (paymentMethod === "ZAAD" && zaadNumber.trim()) {
//       finalDescription = `ZAAD - ${zaadNumber.trim()}`;
//     } else if (paymentMethod === "E-dahab" && edahabNumber.trim()) {
//       finalDescription = `E-dahab - ${edahabNumber.trim()}`;
//     }

//     // Determine if searchQuery is a phone number or family name
//     const isPhone = /^\d{6,}$/.test(searchQuery.trim());

//     dispatch(
//       payFamilyMonthly({
//         ...(isPhone
//           ? { parentPhone: searchQuery.trim() }
//           : { familyName: searchQuery.trim() }),
//         month,
//         year,
//         discount,
//         discountReason,
//         description: finalDescription,
//       })
//     );
//   };

//   // 🎯 Success/Error Effects for Payment
//   useEffect(() => {
//     if (paymentSuccess) {
//       toast.success(paymentSuccess);
//       dispatch(clearFamilyPaymentStatus());
//       // Re-fetch balance to show updated dues after payment
//       dispatch(fetchFamilyBalance(searchQuery));
//       // Reset form fields after successful payment
//       setDiscount(0);
//       setDiscountReason("");
//       setZaadNumber("");
//       setEdahabNumber("");
//       setNumberChecked(false);
//       setIsDiscountVisible(false);
//     }

//     if (paymentError) {
//       toast.error(paymentError);
//       dispatch(clearFamilyPaymentStatus());
//     }
//   }, [paymentSuccess, paymentError, dispatch, searchQuery]);

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
//       <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-8">
//         <header className="mb-8 border-b pb-6">
//           <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
//             <FaMoneyBillWave className="mr-4 text-blue-600 text-4xl" /> Family Payment Portal
//           </h1>
//           <p className="text-gray-600 mt-2 text-lg">Manage monthly payments for families and their students.</p>
//         </header>

//         {/* 🔍 Unified Search Input */}
//         <section className="mb-10 p-6 bg-blue-50 rounded-lg border border-blue-200 shadow-inner">
//           <h2 className="text-2xl font-bold text-blue-800 mb-5 flex items-center">
//             <FiSearch className="mr-3 text-blue-600" /> Find Family Account
//           </h2>
//           <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-center">
//             <div className="flex-grow relative w-full">
//               <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
//               <input
//                 type="text"
//                 className="pl-12 pr-4 py-3 border border-gray-300 rounded-lg w-full text-lg focus:ring-3 focus:ring-blue-400 focus:border-blue-500 transition duration-300 ease-in-out shadow-sm"
//                 placeholder="Enter phone number or family name (e.g., 063XXXXXX or Ahmed Family)"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 aria-label="Phone number or family name search input"
//               />
//             </div>
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-full sm:w-auto"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Searching...
//                 </>
//               ) : (
//                 "Search Family"
//               )}
//             </button>
//             {family && (
//               <button
//                 onClick={handleClear}
//                 type="button"
//                 className="bg-gray-500 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-600 transition duration-300 ease-in-out flex items-center justify-center w-full sm:w-auto"
//               >
//                 <FiXCircle className="mr-2 text-xl" /> Clear Search
//               </button>
//             )}
//           </form>
//           {error && <p className="text-red-600 mt-4 text-sm font-medium text-center">{error}</p>}
//         </section>

//         {/* ⚠️ Last Payment Info Display (Warning) */}
//         {lastPaymentInfo?.alreadyUsed && (
//           <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-lg shadow-md mb-8 animate-fadeIn">
//             <div className="flex justify-between items-center mb-3">
//               <h2 className="font-bold text-xl text-yellow-800 flex items-center">
//                 <FiInfo className="mr-3 text-yellow-600 text-2xl" /> Important: Last Payment Found!
//               </h2>
//               <button
//                 onClick={() => dispatch(clearLastPaymentInfo())}
//                 className="text-sm text-yellow-700 hover:text-yellow-900 transition-colors duration-200 flex items-center px-3 py-1 rounded-md border border-yellow-300 hover:border-yellow-500"
//                 title="Dismiss last payment info"
//               >
//                 <FiXCircle className="mr-1 text-base" /> Dismiss
//               </button>
//             </div>
//             <p className="text-yellow-700 text-base mb-3 leading-relaxed">{lastPaymentInfo.message}</p>
//             <div className="text-gray-700 text-sm grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
//               <p>
//                 <strong>Payment ID:</strong>{" "}
//                 <span className="font-mono bg-yellow-100 px-2 py-0.5 rounded text-yellow-900">
//                   {lastPaymentInfo.paymentId || "N/A"}
//                 </span>
//               </p>
//               <p>
//                 <strong>Method:</strong>{" "}
//                 <span className="font-medium text-yellow-900">{lastPaymentInfo.description || "N/A"}</span>
//               </p>
//               <p className="col-span-full">
//                 <strong>Date:</strong>{" "}
//                 {lastPaymentInfo.createdAt
//                   ? new Date(lastPaymentInfo.createdAt).toLocaleString()
//                   : "N/A"}
//               </p>
//             </div>
//             {lastPaymentInfo.paidFor && lastPaymentInfo.paidFor.length > 0 && (
//               <div className="mt-4 pt-3 border-t border-yellow-200">
//                 <p className="font-semibold text-yellow-800 mb-2">Details for this payment:</p>
//                 <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
//                   {lastPaymentInfo.paidFor.map((p, i) => (
//                     <li key={i} className="flex items-center">
//                       <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
//                       <span className="font-medium text-gray-800">{p.student}</span> —{" "}
//                       {new Date(p.year, p.month - 1).toLocaleString("default", {
//                         month: "long",
//                       })}{" "}
//                       {p.year} — <strong className="text-green-700">${parseFloat(p.amount).toFixed(2)}</strong>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         )}

//         {/* 💳 Payment Form and 👨‍👩‍👧‍👦 Student Info Sections */}
//         {family && (
//           <div className="grid md:grid-cols-2 gap-10">
//             {/* 🧾 Payment Form */}
//             <section className="border border-gray-200 rounded-xl p-7 bg-white shadow-lg">
//               <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center">
//                 <FiDollarSign className="mr-3 text-green-600 text-2xl" /> Process New Payment
//               </h2>
//               <form onSubmit={handlePay} className="space-y-6">
//                 {/* Month and Year Selection */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-2">
//                       <FiCalendar className="inline-block mr-1 text-gray-500" /> Month
//                     </label>
//                     <select
//                       id="month-select"
//                       value={month}
//                       onChange={(e) => setMonth(Number(e.target.value))}
//                       className="block w-full border border-gray-300 rounded-md py-2.5 px-3 bg-white text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none"
//                       aria-label="Select month"
//                     >
//                       {[...Array(12)].map((_, i) => (
//                         <option key={i + 1} value={i + 1}>
//                           {new Date(0, i).toLocaleString("default", { month: "long" })}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-2">
//                       <FiCalendar className="inline-block mr-1 text-gray-500" /> Year
//                     </label>
//                     <select
//                       id="year-select"
//                       value={year}
//                       onChange={(e) => setYear(Number(e.target.value))}
//                       className="block w-full border border-gray-300 rounded-md py-2.5 px-3 bg-white text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none"
//                       aria-label="Select year"
//                     >
//                       {years.map((y) => (
//                         <option key={y} value={y}>
//                           {y}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 {/* Payment Method */}
//                 <div>
//                   <label htmlFor="payment-method-select" className="block text-sm font-medium text-gray-700 mb-2">
//                     <FiCreditCard className="inline-block mr-1 text-gray-500" /> Payment Method
//                   </label>
//                   <select
//                     id="payment-method-select"
//                     value={paymentMethod}
//                     onChange={(e) => {
//                       setPaymentMethod(e.target.value);
//                       setZaadNumber("");
//                       setEdahabNumber("");
//                       setNumberChecked(false); // Reset check status on method change
//                       dispatch(clearLastPaymentInfo()); // Clear last payment info on method change
//                     }}
//                     className="block w-full border border-gray-300 rounded-md py-2.5 px-3 bg-white text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none"
//                     aria-label="Select payment method"
//                   >
//                     <option value="Cash">Cash</option>
//                     <option value="ZAAD">ZAAD</option>
//                     <option value="E-dahab">E-dahab</option>
//                   </select>
//                 </div>

//                 {/* ZAAD or E-dahab number input and check buttons */}
//                 {(paymentMethod === "ZAAD" || paymentMethod === "E-dahab") && (
//                   <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
//                     <label htmlFor="mobile-money-number" className="block text-sm font-medium text-gray-700">
//                       {paymentMethod} Number:
//                     </label>
//                     <div className="flex items-center gap-3">
//                       <input
//                         id="mobile-money-number"
//                         type="text"
//                         value={paymentMethod === "ZAAD" ? zaadNumber : edahabNumber}
//                         onChange={(e) =>
//                           paymentMethod === "ZAAD"
//                             ? setZaadNumber(e.target.value)
//                             : setEdahabNumber(e.target.value)
//                         }
//                         className="flex-grow border border-gray-300 rounded-md py-2.5 px-3 text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//                         placeholder={`Enter ${paymentMethod} number`}
//                         aria-label={`${paymentMethod} number input`}
//                       />
//                       {checkLoading ? (
//                         <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                       ) : numberChecked ? (
//                         <FiCheckCircle className="text-green-500 text-3xl" title="Number checked and available for this month" />
//                       ) : (
//                         <FiXCircle className="text-red-500 text-3xl" title="Not checked or already used for this month" />
//                       )}
//                     </div>
//                     <div className="flex flex-wrap gap-3 text-sm mt-2">
//                       <button
//                         type="button"
//                         onClick={handleCheckUsed}
//                         className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded-md bg-blue-100 hover:bg-blue-200 transition-colors duration-200 flex items-center"
//                         disabled={checkLoading}
//                       >
//                         <FiCheckCircle className="mr-1" /> {checkLoading ? "Checking..." : "Check for this month"}
//                       </button>
//                       <button
//                         type="button"
//                         onClick={handleCheckLastPayment}
//                         className="text-purple-600 hover:text-purple-800 font-medium px-3 py-1 rounded-md bg-purple-100 hover:bg-purple-200 transition-colors duration-200 flex items-center"
//                         disabled={lastPaymentLoading}
//                       >
//                         <FiSearch className="mr-1" /> {lastPaymentLoading ? "Checking..." : "Check last payment"}
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Discount Section */}
//                 <div className="border p-4 rounded-lg bg-gray-50 shadow-sm">
//                   <button
//                     type="button"
//                     onClick={() => setIsDiscountVisible(!isDiscountVisible)}
//                     className="text-blue-600 hover:text-blue-800 text-base font-medium flex items-center"
//                     aria-expanded={isDiscountVisible}
//                     aria-controls="discount-fields"
//                   >
//                     <FiTag className="mr-2 text-blue-500" />{" "}
//                     {isDiscountVisible ? "Hide Discount Fields" : "Apply Discount"}
//                   </button>
//                   {isDiscountVisible && (
//                     <div id="discount-fields" className="mt-4 space-y-4 animate-fadeIn">
//                       <div>
//                         <label htmlFor="discount-amount" className="block text-sm font-medium text-gray-700 mb-2">
//                           Discount Amount ($)
//                         </label>
//                         <input
//                           id="discount-amount"
//                           type="number"
//                           value={discount}
//                           onChange={(e) => setDiscount(Number(e.target.value))}
//                           className="block w-full border border-gray-300 rounded-md py-2.5 px-3 text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//                           placeholder="0.00"
//                           min="0"
//                           aria-label="Discount amount"
//                         />
//                       </div>
//                       {discount > 0 && (
//                         <div>
//                           <label htmlFor="discount-reason" className="block text-sm font-medium text-gray-700 mb-2">
//                             Reason for Discount
//                           </label>
//                           <input
//                             id="discount-reason"
//                             type="text"
//                             value={discountReason}
//                             onChange={(e) => setDiscountReason(e.target.value)}
//                             className="block w-full border border-gray-300 rounded-md py-2.5 px-3 text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//                             placeholder="e.g., Early payment, Sibling discount"
//                             aria-label="Reason for discount"
//                           />
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   disabled={paymentLoading || (paymentMethod !== "Cash" && !numberChecked)}
//                   className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-bold text-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out flex items-center justify-center"
//                 >
//                   {paymentLoading ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Processing Payment...
//                     </>
//                   ) : (
//                     "Confirm & Pay"
//                   )}
//                 </button>
//                 {paymentError && <p className="text-red-600 mt-3 text-sm text-center">{paymentError}</p>}
//               </form>
//             </section>

//             {/* 👨‍👩‍👧‍👦 Student Info */}
//             <section className="border border-gray-200 rounded-xl p-7 bg-white shadow-lg">
//               <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center">
//                 <FiUser className="mr-3 text-purple-600 text-2xl" /> Family Details & Dues
//               </h2>
//               <p className="font-extrabold text-blue-700 text-3xl mb-5 flex items-baseline">
//                 Total Family Balance:{" "}
//                 <span className="text-red-600 ml-2">
//                   ${family.totalFamilyBalance.toFixed(2)}
//                 </span>
//               </p>
//               <div className="space-y-6">
//                 {family.students.map((student) => (
//                   <div
//                     key={student.studentId}
//                     className="bg-gray-50 border border-gray-200 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
//                   >
//                     <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                       {student.fullname}
//                     </h3>
//                     <p className="text-base text-gray-700 mb-3">
//                       Current Balance:{" "}
//                       <strong className="text-red-500">${student.balance.toFixed(2)}</strong>
//                     </p>
//                     {student.months.length > 0 ? (
//                       <div>
//                         <p className="font-medium text-gray-800 mb-2 flex items-center">
//                           <FiCalendar className="mr-2 text-gray-600" /> Outstanding Months:
//                         </p>
//                         <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
//                           {student.months.map((m, i) => (
//                             <li key={i} className="flex items-center">
//                               <span className="font-medium">
//                                 {new Date(m.year, m.month - 1).toLocaleString("default", {
//                                   month: "long",
//                                 })}{" "}
//                                 {m.year}
//                               </span>{" "}
//                               — <strong className="text-orange-600 ml-1">${m.due.toFixed(2)}</strong>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     ) : (
//                       <p className="text-green-600 text-base font-medium flex items-center">
//                         <FiCheckCircle className="mr-2" /> No outstanding dues for this student.
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </section>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FamilyPayment;


import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  fetchFamilyBalance,
  payFamilyMonthly,
  payStudentMonthly,
  clearFamilyPaymentStatus,
  checkPaymentNumberUsed,
  checkLastPaymentByNumber,
  clearLastPaymentInfo,
} from "../../Redux/Payment/familyPaymentSlice";
import { toast } from "react-hot-toast";

const FamilyPayment: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    family,
    paymentError,
    paymentSuccess,
    checkLoading,
    lastPaymentInfo,
  } = useAppSelector((state) => state.familyPayment);

  const [searchQuery, setSearchQuery] = useState("");
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [discount, setDiscount] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [zaadNumber, setZaadNumber] = useState("");
  const [edahabNumber, setEdahabNumber] = useState("");
  const [isDiscountVisible, setIsDiscountVisible] = useState(false);
  const [numberChecked, setNumberChecked] = useState(false);
  const [paySingle, setPaySingle] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const [showStudentModal, setShowStudentModal] = useState(false);

  // Calculate total balance using useMemo for efficiency
  const totalBalance = useMemo(() => {
    if (!family || !family.students) return 0;
    return family.students.reduce((sum, student) => sum + student.balance, 0);
  }, [family]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      toast.error("Please enter a phone number or family name to search.");
      return;
    }
    dispatch(fetchFamilyBalance(query));
    dispatch(clearLastPaymentInfo());
  };

  const handleCheckNumber = () => {
    const number = paymentMethod === "ZAAD" ? zaadNumber : edahabNumber;
    if (!number) {
      toast.error("Please enter the payment number to check.");
      return;
    }
    dispatch(
      checkPaymentNumberUsed({ number, month, year, method: paymentMethod })
    ).then((res) => {
      const success = res.meta.requestStatus === "fulfilled";
      setNumberChecked(success);
      if (success && res.payload?.message) {
        toast.success(res.payload.message);
      }
    });
    dispatch(checkLastPaymentByNumber({ number, method: paymentMethod }));
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!family) {
      toast.error("Please search for a family first.");
      return;
    }
    if (paymentMethod !== "Cash" && !numberChecked) {
      toast.error("Please check the payment number before submitting.");
      return;
    }

    const desc =
      paymentMethod === "ZAAD" && zaadNumber
        ? `ZAAD - ${zaadNumber}`
        : paymentMethod === "E-dahab" && edahabNumber
        ? `E-dahab - ${edahabNumber}`
        : paymentMethod;

    if (paySingle) {
      if (!selectedStudentId) {
        toast.error("Please select a student to pay for.");
        return;
      }
      dispatch(
        payStudentMonthly({
          studentId: selectedStudentId,
          month,
          year,
          discount,
          discountReason,
          description: desc,
        })
      );
    } else {
      const isPhone = /^\d{6,}$/.test(searchQuery.trim());
      dispatch(
        payFamilyMonthly({
          ...(isPhone
            ? { parentPhone: searchQuery.trim() }
            : { familyName: searchQuery.trim() }),
          month,
          year,
          discount,
          discountReason,
          description: desc,
        })
      );
    }
  };

  useEffect(() => {
    if (paymentSuccess) {
      toast.success(paymentSuccess.message || "Payment successful!");
      dispatch(clearFamilyPaymentStatus());
      setDiscount(0);
      setDiscountReason("");
      setZaadNumber("");
      setEdahabNumber("");
      setNumberChecked(false);
      setIsDiscountVisible(false);
      setSelectedStudentId(null);
      setSearchQuery(""); // Clear search query after successful payment
      dispatch(clearLastPaymentInfo()); // Clear last payment info
      setShowStudentModal(false); // Close modal on success
    }
    if (paymentError) {
      toast.error(paymentError);
      dispatch(clearFamilyPaymentStatus());
    }
  }, [paymentSuccess, paymentError, dispatch]);

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-2xl max-w-4xl my-8">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
        Family Payment Dashboard
      </h2>
      <form onSubmit={handlePay} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Search, Family Details, Pay Single */}
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-blue-700 mb-4 border-b pb-2">
            Family Information
          </h3>
          {/* Search Family Section */}
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label
                htmlFor="searchQuery"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Family (Name or Phone)
              </label>
              <input
                type="text"
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                placeholder="e.g., 615xxxxxx or Hussein Family"
              />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105"
            >
              Search
            </button>
          </div>

          {/* Family and Student Details Summary */}
          {family && (
            <div className="border border-gray-200 rounded-xl p-5 bg-blue-50/50 shadow-sm">
              <h4 className="font-bold text-xl text-blue-800 mb-3">
                Family: {family.familyName}
              </h4>
              <div className="flex justify-between items-center mb-3">
                <p className="text-gray-700 text-md font-semibold">
                  Total Balance:{" "}
                  <span className="text-green-700 text-lg">
                    ${totalBalance.toFixed(2)}
                  </span>
                </p>
                {family.students.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowStudentModal(true)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm transition duration-150 ease-in-out"
                  >
                    View Student Details ({family.students.length})
                  </button>
                )}
              </div>
              {family.students.length === 0 && (
                <p className="text-gray-600 italic">
                  No students found for this family.
                </p>
              )}
            </div>
          )}

          {/* Pay Single Student Option */}
          <div className="flex items-center gap-3 mt-6">
            <input
              type="checkbox"
              checked={paySingle}
              onChange={() => setPaySingle(!paySingle)}
              id="paySingle"
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="paySingle"
              className="text-base font-medium text-gray-800 cursor-pointer"
            >
              Pay for a Single Student
            </label>
          </div>

          {paySingle && family?.students?.length > 0 && (
            <div>
              <label
                htmlFor="selectStudent"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Student
              </label>
              <select
                id="selectStudent"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                value={selectedStudentId ?? ""}
                onChange={(e) => setSelectedStudentId(Number(e.target.value))}
              >
                <option value="">-- Select a Student --</option>
                {family.students.map((s) => (
                  <option key={s.studentId} value={s.studentId}>
                    {s.fullname} (${s.balance.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right Column: Payment Details, Discount, Submit */}
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-green-700 mb-4 border-b pb-2">
            Payment Details
          </h3>
          {/* Month and Year Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="month"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Month
              </label>
              <input
                type="number"
                id="month"
                min={1}
                max={12}
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
            </div>
            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Year
              </label>
              <input
                type="number"
                id="year"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label
              htmlFor="paymentMethod"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setNumberChecked(false); // Reset check when method changes
                dispatch(clearLastPaymentInfo()); // Clear last payment info when method changes
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            >
              <option value="Cash">Cash</option>
              <option value="ZAAD">ZAAD</option>
              <option value="E-dahab">E-dahab</option>
            </select>
          </div>

          {/* Mobile Payment Number Check */}
          {(paymentMethod === "ZAAD" || paymentMethod === "E-dahab") && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Mobile Payment Verification
              </h4>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label
                    htmlFor="paymentNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {paymentMethod === "ZAAD" ? "ZAAD" : "E-dahab"} Number
                  </label>
                  <input
                    type="text"
                    id="paymentNumber"
                    value={
                      paymentMethod === "ZAAD" ? zaadNumber : edahabNumber
                    }
                    onChange={(e) =>
                      paymentMethod === "ZAAD"
                        ? setZaadNumber(e.target.value)
                        : setEdahabNumber(e.target.value)
                    }
                    placeholder="Enter payment number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCheckNumber}
                  className={`w-full sm:w-auto font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105
                ${
                  numberChecked
                    ? "bg-green-500 text-white"
                    : "bg-yellow-500 hover:bg-yellow-600 text-white"
                }
              `}
                  disabled={checkLoading}
                >
                  {checkLoading
                    ? "Checking..."
                    : numberChecked
                    ? "Checked!"
                    : "Check Number"}
                </button>
              </div>
              {lastPaymentInfo?.message && (
                <p className="text-sm text-gray-600 italic bg-gray-100 p-3 rounded-md border border-gray-200 mt-4">
                  <span className="font-semibold">Last Payment Info:</span>{" "}
                  {lastPaymentInfo.message}
                </p>
              )}
            </div>
          )}

          {/* Discount Section */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Discount Options
            </h4>
            <label className="flex items-center gap-2 text-base font-medium text-gray-800 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={isDiscountVisible}
                onChange={() => setIsDiscountVisible(!isDiscountVisible)}
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              Apply Discount
            </label>
            {isDiscountVisible && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="discountAmount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Discount Amount ($)
                  </label>
                  <input
                    type="number"
                    id="discountAmount"
                    placeholder="e.g., 10"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label
                    htmlFor="discountReason"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Reason for Discount
                  </label>
                  <input
                    type="text"
                    id="discountReason"
                    placeholder="e.g., Early payment, Sibling discount"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    value={discountReason}
                    onChange={(e) => setDiscountReason(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mt-auto"
            // mt-auto pushes the button to the bottom if the right column is shorter
          >
            Submit Payment
          </button>
        </div>
      </form>

      {/* Student List Pop-up (Modal) */}
      {showStudentModal && family && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                Students of {family.familyName}
              </h3>
              <button
                onClick={() => setShowStudentModal(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl font-semibold leading-none"
              >
                &times;
              </button>
            </div>
            {family.students.length > 0 ? (
              <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {family.students.map((s) => (
                  <li
                    key={s.studentId}
                    className="flex justify-between items-center text-base text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100"
                  >
                    <span className="font-medium">{s.fullname}</span>
                    <span className="font-semibold text-green-600">
                      ${s.balance.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 italic">
                No students found for this family.
              </p>
            )}
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">
                Overall Total:
              </span>
              <span className="text-2xl font-bold text-green-700">
                ${totalBalance.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyPayment;