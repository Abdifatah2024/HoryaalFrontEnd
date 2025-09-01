// import React, { useEffect, useState, useMemo, useRef } from "react";
// import { useAppDispatch, useAppSelector } from "../../Redux/store";
// import {
//   fetchFamilyBalance,
//   fetchStudentBalance,
//   payFamilyMonthly,
//   payStudentMonthly,
//   clearFamilyPaymentStatus,
//   checkPaymentNumberUsed,
//   checkLastPaymentByNumber,
//   clearLastPaymentInfo,
// } from "../../Redux/Payment/familyPaymentSlice";
// import { toast } from "react-hot-toast";
// import { UsedNumberResponse } from "@/types/Login";

// /* ----------------------------- helpers ----------------------------- */
// const formatCurrency = (n: number | undefined | null) => `$${Number(n || 0).toFixed(2)}`;
// const monthName = (m: number) =>
//   ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][Math.max(1, Math.min(12, m)) - 1];

// type StudentDue = {
//   studentId: number;
//   fullname: string;
//   balance?: number;
//   months?: { month: number; year: number; due: number }[];
// };

// const getDueFor = (s: StudentDue, m: number, y: number) => {
//   if (!Array.isArray(s?.months)) return 0;
//   const row = s.months.find((x) => Number(x.month) === Number(m) && Number(x.year) === Number(y));
//   return Number(row?.due || 0);
// };

// /* ------------------------ Receipt Voucher (A5, dynamic rows) ---------------------- */
// type VoucherStudent = { name: string; amount: number };

// const ReceiptVoucher: React.FC<{
//   data: {
//     students: VoucherStudent[]; // render exactly what backend provides (no filler rows)
//     total: number;
//     discount: number;
//     description: string; // e.g. "ZAAD - 63xxxxxxx" / "E-dahab - 63xxxxxxx" / "Cash"
//     receivedBy: string;
//     date: string;
//     monthYear: string;
//   };
// }> = ({ data }) => {
//   const net = Math.max(0, Number(data.total || 0) - Number(data.discount || 0));

//   return (
//     <div className="receipt-container bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200 print:border print:shadow-none print:break-inside-avoid">
//       {/* School Header */}
//       <div className="text-center mb-6 border-b pb-4 border-gray-300">
//         <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
//           HORYAAL PRIMARY SCHOOL
//         </h1>
//         <p className="text-sm text-gray-600 mt-2">ZAAD NO: 500536 · Tel: 063-4818888</p>
//       </div>

//       {/* Receipt Meta */}
//       <div className="flex flex-col space-y-2 mb-6 text-sm text-gray-700">
//         <div className="flex justify-between">
//           <span className="font-semibold">RECEIPT</span>
//           <span className="font-semibold text-gray-500">Date: {data.date}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-500">Payment Type:</span>
//           <span className="font-medium">Cash Receipt</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-500">Month/Year:</span>
//           <span className="font-medium">{data.monthYear}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-500">Received By:</span>
//           <span className="font-medium">{data.receivedBy}</span>
//         </div>
//       </div>

//       {/* Student Table (dynamic rows only) */}
//       <div className="mb-6">
//         <table className="min-w-full table-auto">
//           <thead>
//             <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
//               <th className="py-3 px-6 text-left">#</th>
//               <th className="py-3 px-6 text-left">Student Name</th>
//               <th className="py-3 px-6 text-right">Amount</th>
//             </tr>
//           </thead>
//           <tbody className="text-gray-700 text-sm font-light">
//             {data.students.map((row, i) => (
//               <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
//                 <td className="py-3 px-6 text-left whitespace-nowrap">{i + 1}</td>
//                 <td className="py-3 px-6 text-left">{row.name}</td>
//                 <td className="py-3 px-6 text-right">{formatCurrency(row.amount)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Summary */}
//       <div className="w-full text-right mb-6">
//         <div className="border-t pt-4 border-gray-300">
//           <div className="flex justify-between text-gray-700 mb-1">
//             <span className="font-bold">Total</span>
//             <span className="font-bold">{formatCurrency(data.total)}</span>
//           </div>
//           <div className="flex justify-between text-gray-700 mb-1">
//             <span className="font-semibold">Discount</span>
//             <span>{formatCurrency(data.discount)}</span>
//           </div>
//           <div className="flex justify-between text-lg font-bold text-gray-800 border-t mt-2 pt-2 border-gray-400">
//             <span>Net Amount</span>
//             <span>{formatCurrency(net)}</span>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="text-sm text-gray-700">
//         <p className="mb-2">
//           <strong>Description:</strong> {data.description}
//         </p>
//         <div className="flex justify-between items-center mt-4">
//           <p>
//             <strong>Cashier Signature:</strong>
//           </p>
//           <span className="border-b border-gray-400 flex-grow ml-2"></span>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ------------------------ Main FamilyPayment Page ------------------------ */
// const FamilyPayment: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { family, paymentError, paymentSuccess, checkLoading } = useAppSelector(
//     (state) => state.familyPayment
//   );

//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchSingleStudent, setSearchSingleStudent] = useState(false);
//   const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
//   const [year, setYear] = useState<number>(new Date().getFullYear());
//   const [discount, setDiscount] = useState<number>(0);
//   const [discountReason, setDiscountReason] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("Cash");
//   const [zaadNumber, setZaadNumber] = useState("");
//   const [edahabNumber, setEdahabNumber] = useState("");
//   const [isDiscountVisible, setIsDiscountVisible] = useState(false);
//   const [numberChecked, setNumberChecked] = useState(false);
//   const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [pendingPayment, setPendingPayment] = useState<{ type: "family" | "student"; payload: any } | null>(null);

//   const [usedNumberInfo, setUsedNumberInfo] = useState<null | {
//     message: string;
//     description?: string;
//     createdAt?: string;
//     paidFor?: { student: string; month: number; year: number; amount: string }[];
//   }>(null);

//   // printing
//   const [showPrintButton, setShowPrintButton] = useState(false);
//   const [receiptData, setReceiptData] = useState<any>(null);
//   const receiptPrintAreaRef = useRef<HTMLDivElement>(null);

//   const currentStudent = useMemo(() => {
//     if (selectedStudentId && family?.students?.length) {
//       return family.students.find((s: any) => s.studentId === selectedStudentId) || family.students[0];
//     }
//     if (family?.students?.length) return family.students[0];
//     return null;
//   }, [family, selectedStudentId]);

//   // selected-month dues
//   const selectedStudentDue = useMemo(
//     () => (currentStudent ? getDueFor(currentStudent, month, year) : 0),
//     [currentStudent, month, year]
//   );

//   const familySelectedMonthTotal = useMemo(() => {
//     if (!family?.students) return 0;
//     return family.students.reduce((sum: number, s: StudentDue) => sum + getDueFor(s, month, year), 0);
//   }, [family, month, year]);

//   /* ---------------- Description strings ----------------
//      Server must receive EXACTLY: `${method} - ${number}`
//      Voucher shows only `${method} - ${number}` (dynamic).
//   --------------------------------------------------------*/
//   const buildServerDescription = () => {
//     if (paymentMethod === "ZAAD" && zaadNumber.trim()) return `ZAAD - ${zaadNumber.trim()}`;
//     if (paymentMethod === "E-dahab" && edahabNumber.trim()) return `E-dahab - ${edahabNumber.trim()}`;
//     return "Cash";
//   };

//   const buildVoucherDescription = () => {
//     return buildServerDescription();
//   };

//   /* ---------------- actions ---------------- */
//   const handleSearch = () => {
//     const query = searchQuery.trim();
//     if (!query) {
//       toast.error(searchSingleStudent ? "Enter a student ID." : "Enter a phone number or family name.");
//       return;
//     }
//     if (searchSingleStudent) dispatch(fetchStudentBalance(query));
//     else dispatch(fetchFamilyBalance(query));

//     dispatch(clearLastPaymentInfo());
//     setShowPrintButton(false);
//     setReceiptData(null);
//   };

//   const handleCheckNumber = () => {
//     const number = paymentMethod === "ZAAD" ? zaadNumber : edahabNumber;
//     if (!number) {
//       toast.error("Enter the payment number to check.");
//       return;
//     }

//     setUsedNumberInfo(null);

//     // verify usage for this month/year
//     dispatch(checkPaymentNumberUsed({ number, month, year, method: paymentMethod })).then((res: any) => {
//       const success = res.meta.requestStatus === "fulfilled";
//       setNumberChecked(success);

//       if (success && res.payload && typeof res.payload === "object") {
//         const data = res.payload as UsedNumberResponse;
//         if (data.alreadyUsed) {
//           setUsedNumberInfo(data);
//           toast.error(data.message);
//         } else {
//           toast.success(data.message);
//         }
//       }
//     });

//     // latest by (method - number) exactly
//     dispatch(checkLastPaymentByNumber({ number, method: paymentMethod }));
//   };

//   const handlePay = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!family) return toast.error("Search for a family or student first.");
//     if (paymentMethod !== "Cash" && !numberChecked) {
//       toast("⚠️ You have not verified this payment number.", { icon: "⚠️" });
//       return;
//     }

//     const description = buildServerDescription(); // EXACT for server

//     if (searchSingleStudent) {
//       if (!currentStudent) return toast.error("No student found.");
//       if (selectedStudentDue <= 0) {
//         toast.error(`No due for ${monthName(month)} ${year} for this student.`);
//         return;
//       }
//       setPendingPayment({
//         type: "student",
//         payload: { studentId: currentStudent.studentId, month, year, discount, discountReason, description },
//       });
//     } else {
//       if (familySelectedMonthTotal <= 0) {
//         toast.error(`No dues for ${monthName(month)} ${year} in this family.`);
//         return;
//       }
//       setPendingPayment({
//         type: "family",
//         payload: { parentPhone: family.phone, month, year, discount, discountReason, description },
//       });
//     }
//     setShowConfirmModal(true);
//   };

//   const confirmPayment = () => {
//     if (!pendingPayment) return;
//     if (pendingPayment.type === "student") dispatch(payStudentMonthly(pendingPayment.payload));
//     else dispatch(payFamilyMonthly(pendingPayment.payload));
//     setShowConfirmModal(false);
//     setPendingPayment(null);
//   };

//   const cancelPayment = () => {
//     setShowConfirmModal(false);
//     setPendingPayment(null);
//   };

//   /* ---------------- printing: SINGLE A5 voucher at TOP (no margins) ---------------- */
//   const handlePrint = () => {
//     if (!receiptPrintAreaRef.current) return;

//     const printContents = receiptPrintAreaRef.current.innerHTML;
//     const printWindow = window.open("", "_blank");
//     if (!printWindow) {
//       toast.error("Could not open print window.");
//       return;
//     }

//     printWindow.document.write("<html><head><title>Print Receipt</title>");
//     printWindow.document.write(`<style>
//       @page { size: A5 portrait; margin: 0; } /* ZERO margins */
//       html, body { height: 100%; }
//       body {
//         font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
//         margin: 0; padding: 0; background: #ffffff;
//       }

//       /* Top-left anchored, no centering */
//       .a5-page {
//         height: 210mm;  /* full A5 portrait height */
//         width: 148mm;   /* full A5 portrait width */
//         box-sizing: border-box;
//         display: block;
//         padding: 6mm 8mm;      /* small inner padding so content isn't cropped */
//       }

//       /* Tighten for printing */
//       .receipt-container {
//         box-shadow: none !important;
//         border: 1px solid #e5e7eb !important;
//         width: 100% !important;
//         max-width: 100% !important;
//         margin: 0 !important;
//         padding: 8mm !important;
//         border-radius: 8px !important;
//       }

//       /* table look */
//       table{border-collapse:collapse;width:100%}
//       thead tr{background:#f3f4f6;color:#4b5563;text-transform:uppercase;font-size:.85rem}
//       th,td{padding:8px 12px}
//       tbody tr{border-bottom:1px solid #e5e7eb}

//       /* typography utilities used in the component */
//       .text-3xl{font-size:1.75rem;font-weight:700}
//       .text-sm{font-size:.875rem}
//     </style>`);
//     printWindow.document.write("</head><body>");
//     printWindow.document.write('<div class="a5-page">'); // now anchored at top with zero page margins
//     printWindow.document.write(printContents);
//     printWindow.document.write("</div>");
//     printWindow.document.write("</body></html>");
//     printWindow.document.close();
//     printWindow.focus();
//     printWindow.print();
//     printWindow.close();
//   };

//   /* -------- after success: build voucher data (dynamic rows) ------- */
//   useEffect(() => {
//     if (paymentSuccess) {
//       toast.success(paymentSuccess.message || "Payment successful!");

//       const receivedBy = "Mr. Abdirisak Omer";
//       const dateStr = new Date().toLocaleDateString();
//       const monthYearStr = `${monthName(month)} ${year}`;
//       const displayDesc = buildVoucherDescription(); // e.g. "ZAAD - 63..." or "Cash"

//       if (searchSingleStudent && currentStudent) {
//         const amt = getDueFor(currentStudent, month, year);
//         const students: VoucherStudent[] = amt > 0 ? [{ name: currentStudent.fullname, amount: amt }] : [];
//         setReceiptData({
//           students,
//           total: students.reduce((s, r) => s + r.amount, 0),
//           discount,
//           description: displayDesc,
//           receivedBy,
//           date: dateStr,
//           monthYear: monthYearStr,
//         });
//       } else if (family?.students) {
//         const studentsWithAmt: VoucherStudent[] = family.students
//           .map((s: StudentDue) => ({ name: s.fullname, amount: getDueFor(s, month, year) }))
//           .filter((x: VoucherStudent) => x.amount > 0);
//         const total = studentsWithAmt.reduce((sum: number, s: VoucherStudent) => sum + s.amount, 0);

//         setReceiptData({
//           students: studentsWithAmt, // dynamic rows only
//           total,
//           discount,
//           description: displayDesc,
//           receivedBy,
//           date: dateStr,
//           monthYear: monthYearStr,
//         });
//       }

//       setShowPrintButton(true);
//       dispatch(clearFamilyPaymentStatus());
//       // keep month/year
//       setDiscount(0);
//       setDiscountReason("");
//       setZaadNumber("");
//       setEdahabNumber("");
//       setNumberChecked(false);
//       setIsDiscountVisible(false);
//       setSelectedStudentId(null);
//       setSearchQuery("");
//       dispatch(clearLastPaymentInfo());
//       setUsedNumberInfo(null);
//     }

//     if (paymentError) {
//       toast.error(paymentError);
//       dispatch(clearFamilyPaymentStatus());
//       setShowPrintButton(false);
//       setReceiptData(null);
//     }
//   }, [
//     paymentSuccess,
//     paymentError,
//     dispatch,
//     currentStudent,
//     family,
//     month,
//     year,
//     discount,
//   ]);

//   return (
//     <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-2xl max-w-4xl my-8">
//       <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
//         {searchSingleStudent ? "Single Student Payment" : "Family Payment Dashboard"}
//       </h2>

//       <form onSubmit={handlePay} className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Left Column */}
//         <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
//           <div className="flex flex-col sm:flex-row gap-4 items-end">
//             <input
//               type="text"
//               placeholder={searchSingleStudent ? "Student ID" : "Family name or phone number"}
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="flex-1 border border-gray-300 rounded-lg py-2 px-4"
//             />
//             <button
//               type="button"
//               onClick={handleSearch}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
//             >
//               Search
//             </button>
//           </div>

//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={searchSingleStudent}
//               onChange={() => setSearchSingleStudent(!searchSingleStudent)}
//               className="h-5 w-5 text-blue-600 rounded"
//             />
//             <label className="text-base font-medium text-gray-800">Single Student</label>
//           </div>

//           {/* Students & selected-month dues with month chips */}
//           {family && family.students && family.students.length > 0 && (
//             <div className="border border-gray-200 rounded-xl p-5 bg-blue-50/50 shadow-sm space-y-4">
//               <h4 className="font-bold text-xl text-blue-800">
//                 Students — {monthName(month)} {year}
//               </h4>

//               <ol className="space-y-3">
//                 {family.students.map((s: StudentDue, idx: number) => {
//                   const months = Array.isArray(s.months) ? s.months : [];
//                   const selectedDue = getDueFor(s, month, year);
//                   return (
//                     <li
//                       key={s.studentId}
//                       onClick={() => setSelectedStudentId(s.studentId)}
//                       className={`cursor-pointer rounded-md px-3 py-2 transition ${
//                         selectedStudentId === s.studentId ? "bg-white shadow" : "hover:bg-white/70"
//                       }`}
//                     >
//                       <div className="flex items-center justify-between gap-4">
//                         <span className="font-medium text-gray-800">
//                           {idx + 1}. {s.fullname}
//                         </span>
//                         <span
//                           className={`font-semibold ${
//                             selectedDue > 0 ? "text-green-700" : "text-gray-500"
//                           }`}
//                           title="Due for the selected month"
//                         >
//                           {formatCurrency(selectedDue)}
//                         </span>
//                       </div>

//                       {/* month chips */}
//                       <div className="mt-2 flex flex-wrap gap-2">
//                         {months.length > 0 ? (
//                           months.map((m, i) => (
//                             <button
//                               type="button"
//                               key={`${s.studentId}-${i}`}
//                               onClick={() => {
//                                 setMonth(Number(m.month));
//                                 setYear(Number(m.year));
//                                 setSelectedStudentId(s.studentId);
//                               }}
//                               className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
//                                 Number(m.month) === month && Number(m.year) === year
//                                   ? "bg-blue-600 text-white border-blue-600"
//                                   : "bg-white text-gray-800"
//                               }`}
//                               title={`Set ${monthName(m.month)} ${m.year}`}
//                             >
//                               {monthName(m.month)} {m.year}: {formatCurrency(m.due || 0)}
//                             </button>
//                           ))
//                         ) : (
//                           <span className="text-xs text-gray-500">No due months</span>
//                         )}
//                       </div>
//                     </li>
//                   );
//                 })}
//               </ol>

//               <div className="border-t pt-3 mt-2 flex items-center justify-between">
//                 <span className="text-lg font-bold text-gray-900">Total (Selected Month)</span>
//                 <span className="text-lg font-extrabold text-gray-900">
//                   {formatCurrency(familySelectedMonthTotal)}
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right Column */}
//         <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
//           {showPrintButton && receiptData && (
//             <button
//               type="button"
//               onClick={handlePrint}
//               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded mb-4"
//             >
//               Print Receipt (A5, top)
//             </button>
//           )}

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Month</label>
//               <input
//                 type="number"
//                 min={1}
//                 max={12}
//                 value={month}
//                 onChange={(e) => setMonth(Number(e.target.value))}
//                 className="w-full border border-gray-300 rounded px-4 py-2"
//               />
//               <p className="text-[11px] text-gray-500 mt-1">{monthName(month)}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Year</label>
//               <input
//                 type="number"
//                 value={year}
//                 onChange={(e) => setYear(Number(e.target.value))}
//                 className="w-full border border-gray-300 rounded px-4 py-2"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Payment Method</label>
//             <select
//               value={paymentMethod}
//               onChange={(e) => {
//                 setPaymentMethod(e.target.value);
//                 setNumberChecked(false);
//                 setUsedNumberInfo(null);
//                 dispatch(clearLastPaymentInfo());
//               }}
//               className="w-full border border-gray-300 rounded px-4 py-2"
//             >
//               <option value="Cash">Cash</option>
//               <option value="ZAAD">ZAAD</option>
//               <option value="E-dahab">E-dahab</option>
//             </select>
//           </div>

//           {(paymentMethod === "ZAAD" || paymentMethod === "E-dahab") && (
//             <div className="space-y-2 border border-gray-200 p-4 rounded bg-gray-50">
//               <label className="block text-sm font-medium mb-1">
//                 {paymentMethod} Number
//               </label>
//               <input
//                 type="text"
//                 value={paymentMethod === "ZAAD" ? zaadNumber : edahabNumber}
//                 onChange={(e) =>
//                   paymentMethod === "ZAAD"
//                     ? setZaadNumber(e.target.value)
//                     : setEdahabNumber(e.target.value)
//                 }
//                 className="w-full border border-gray-300 rounded px-4 py-2"
//               />
//               <button
//                 type="button"
//                 onClick={handleCheckNumber}
//                 className={`w-full mt-2 py-2 rounded text-white font-semibold ${
//                   numberChecked ? "bg-green-500" : "bg-yellow-500 hover:bg-yellow-600"
//                 }`}
//                 disabled={checkLoading}
//               >
//                 {checkLoading ? "Checking..." : numberChecked ? "Checked!" : "Check Number"}
//               </button>

//               {usedNumberInfo && (
//                 <div className="mt-3 text-sm bg-red-50 border border-red-200 rounded p-3 space-y-2">
//                   <p className="font-semibold text-red-700">{usedNumberInfo.message}</p>
//                   {usedNumberInfo.description && (
//                     <p><span className="font-medium">Description:</span> {usedNumberInfo.description}</p>
//                   )}
//                   {usedNumberInfo?.createdAt && (
//                     <p>
//                       <span className="font-medium">Created At:</span>{" "}
//                       {new Date(usedNumberInfo.createdAt).toLocaleString()}
//                     </p>
//                   )}
//                   {usedNumberInfo?.paidFor && usedNumberInfo.paidFor.length > 0 && (
//                     <div>
//                       <p className="font-medium mb-1">Paid For:</p>
//                       <ul className="list-disc pl-5 text-gray-700">
//                         {usedNumberInfo.paidFor.map((entry, idx) => (
//                           <li key={idx}>
//                             {entry.student} — {monthName(entry.month)} {entry.year} — ${entry.amount}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           <div className="border border-gray-200 rounded p-4 bg-gray-50">
//             <label className="flex items-center gap-2 mb-3">
//               <input
//                 type="checkbox"
//                 checked={isDiscountVisible}
//                 onChange={() => setIsDiscountVisible(!isDiscountVisible)}
//                 className="h-5 w-5 text-blue-600"
//               />
//               <span>Apply Discount</span>
//             </label>
//             {isDiscountVisible && (
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Discount Amount ($)</label>
//                   <input
//                     type="number"
//                     value={discount}
//                     onChange={(e) => setDiscount(Number(e.target.value))}
//                     className="w-full border border-gray-300 rounded px-4 py-2"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Reason</label>
//                   <input
//                     type="text"
//                     value={discountReason}
//                     onChange={(e) => setDiscountReason(e.target.value)}
//                     className="w-full border border-gray-300 rounded px-4 py-2"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded">
//             Submit Payment
//           </button>
//         </div>
//       </form>

//       {/* Confirm Modal */}
//       {showConfirmModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
//             <h3 className="text-xl font-bold">Confirm Payment</h3>
//             {pendingPayment?.type === "student" ? (
//               <>
//                 <p><strong>Student:</strong> {currentStudent?.fullname}</p>
//                 <p><strong>Amount:</strong> {formatCurrency(selectedStudentDue)}</p>
//               </>
//             ) : (
//               <>
//                 <p><strong>Total Amount:</strong> {formatCurrency(familySelectedMonthTotal)}</p>
//               </>
//             )}
//             <p><strong>Month:</strong> {monthName(month)}</p>
//             <p><strong>Year:</strong> {year}</p>
//             <p><strong>Discount:</strong> {formatCurrency(discount)}</p>
//             <p><strong>Description (server):</strong> {pendingPayment?.payload?.description}</p>
//             <div className="flex justify-end gap-2 mt-4">
//               <button onClick={cancelPayment} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
//               <button onClick={confirmPayment} className="px-4 py-2 bg-green-600 text-white rounded">Confirm</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Hidden Receipt Component for Printing (single dynamic voucher) */}
//       {receiptData && (
//         <div style={{ display: "none" }}>
//           <div ref={receiptPrintAreaRef} className="print-area-wrapper">
//             <ReceiptVoucher data={receiptData} />
//           </div>
//         </div>
//       )}

//       {showPrintButton && receiptData && (
//         <div className="mt-6">
//           <button
//             type="button"
//             onClick={handlePrint}
//             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded"
//           >
//             Print Receipt (A5, top)
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FamilyPayment;
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  fetchFamilyBalance,
  fetchStudentBalance,
  payFamilyMonthly,
  payStudentMonthly,
  clearFamilyPaymentStatus,
  checkPaymentNumberUsed,
  checkLastPaymentByNumber,
  clearLastPaymentInfo,
} from "../../Redux/Payment/familyPaymentSlice";
import { toast } from "react-hot-toast";
import { UsedNumberResponse } from "@/types/Login";

/* ----------------------------- helpers ----------------------------- */
const formatCurrency = (n: number | undefined | null) => `$${Number(n || 0).toFixed(2)}`;
const monthName = (m: number) =>
  ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][Math.max(1, Math.min(12, m)) - 1];

type StudentDue = {
  studentId: number;
  fullname: string;
  balance?: number;
  months?: { month: number; year: number; due: number }[];
};

const getDueFor = (s: StudentDue, m: number, y: number) => {
  if (!Array.isArray(s?.months)) return 0;
  const row = s.months.find((x) => Number(x.month) === Number(m) && Number(x.year) === Number(y));
  return Number(row?.due || 0);
};

// Sum all dues for a single student across all their months
const sumStudentAllMonths = (s?: StudentDue) => {
  if (!s?.months) return 0;
  return s.months.reduce((acc, m) => acc + Number(m?.due || 0), 0);
};

/* ------------------------ Receipt Voucher (A5, dynamic rows) ---------------------- */
type VoucherStudent = { name: string; amount: number };

const ReceiptVoucher: React.FC<{
  data: {
    students: VoucherStudent[]; // render exactly what backend provides (no filler rows)
    total: number;
    discount: number;
    description: string; // e.g. "ZAAD - 63xxxxxxx" / "E-dahab - 63xxxxxxx" / "Cash"
    receivedBy: string;
    date: string;
    monthYear: string;
  };
}> = ({ data }) => {
  const net = Math.max(0, Number(data.total || 0) - Number(data.discount || 0));

  return (
    <div className="receipt-container bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200 print:border print:shadow-none print:break-inside-avoid">
      {/* School Header */}
      <div className="text-center mb-6 border-b pb-4 border-gray-300">
        <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
          HORYAAL PRIMARY SCHOOL
        </h1>
        <p className="text-sm text-gray-600 mt-2">ZAAD NO: 500536 · Tel: 063-4818888</p>
      </div>

      {/* Receipt Meta */}
      <div className="flex flex-col space-y-2 mb-6 text-sm text-gray-700">
        <div className="flex justify-between">
          <span className="font-semibold">RECEIPT</span>
          <span className="font-semibold text-gray-500">Date: {data.date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Payment Type:</span>
          <span className="font-medium">Cash Receipt</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Month/Year:</span>
          <span className="font-medium">{data.monthYear}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Received By:</span>
          <span className="font-medium">{data.receivedBy}</span>
        </div>
      </div>

      {/* Student Table (dynamic rows only) */}
      <div className="mb-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">#</th>
              <th className="py-3 px-6 text-left">Student Name</th>
              <th className="py-3 px-6 text-right">Amount</th>
            </tr>
          </thead>
        <tbody className="text-gray-700 text-sm font-light">
            {data.students.map((row, i) => (
              <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6 text-left whitespace-nowrap">{i + 1}</td>
                <td className="py-3 px-6 text-left">{row.name}</td>
                <td className="py-3 px-6 text-right">{formatCurrency(row.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="w-full text-right mb-6">
        <div className="border-t pt-4 border-gray-300">
          <div className="flex justify-between text-gray-700 mb-1">
            <span className="font-bold">Total</span>
            <span className="font-bold">{formatCurrency(data.total)}</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-1">
            <span className="font-semibold">Discount</span>
            <span>{formatCurrency(data.discount)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-800 border-t mt-2 pt-2 border-gray-400">
            <span>Net Amount</span>
            <span>{formatCurrency(net)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-sm text-gray-700">
        <p className="mb-2">
          <strong>Description:</strong> {data.description}
        </p>
        <div className="flex justify-between items-center mt-4">
          <p>
            <strong>Cashier Signature:</strong>
          </p>
          <span className="border-b border-gray-400 flex-grow ml-2"></span>
        </div>
      </div>
    </div>
  );
};

/* ------------------------ Main FamilyPayment Page ------------------------ */
const FamilyPayment: React.FC = () => {
  const dispatch = useAppDispatch();
  const { family, paymentError, paymentSuccess, checkLoading } = useAppSelector(
    (state) => state.familyPayment
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [searchSingleStudent, setSearchSingleStudent] = useState(false);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [discount, setDiscount] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [zaadNumber, setZaadNumber] = useState("");
  const [edahabNumber, setEdahabNumber] = useState("");
  const [isDiscountVisible, setIsDiscountVisible] = useState(false);
  const [numberChecked, setNumberChecked] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<{ type: "family" | "student"; payload: any } | null>(null);

  const [usedNumberInfo, setUsedNumberInfo] = useState<null | {
    message: string;
    description?: string;
    createdAt?: string;
    paidFor?: { student: string; month: number; year: number; amount: string }[];
  }>(null);

  // printing
  const [showPrintButton, setShowPrintButton] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const receiptPrintAreaRef = useRef<HTMLDivElement>(null);

  const currentStudent = useMemo(() => {
    if (selectedStudentId && family?.students?.length) {
      return family.students.find((s: any) => s.studentId === selectedStudentId) || family.students[0];
    }
    if (family?.students?.length) return family.students[0];
    return null;
  }, [family, selectedStudentId]);

  // selected-month dues
  const selectedStudentDue = useMemo(
    () => (currentStudent ? getDueFor(currentStudent, month, year) : 0),
    [currentStudent, month, year]
  );

  const familySelectedMonthTotal = useMemo(() => {
    if (!family?.students) return 0;
    return family.students.reduce((sum: number, s: StudentDue) => sum + getDueFor(s, month, year), 0);
  }, [family, month, year]);

  /* ---------------- Description strings ----------------
     Server must receive EXACTLY: `${method} - ${number}`
     Voucher shows only `${method} - ${number}` (dynamic).
  --------------------------------------------------------*/
  const buildServerDescription = () => {
    if (paymentMethod === "ZAAD" && zaadNumber.trim()) return `ZAAD - ${zaadNumber.trim()}`;
    if (paymentMethod === "E-dahab" && edahabNumber.trim()) return `E-dahab - ${edahabNumber.trim()}`;
    return "Cash";
  };

  const buildVoucherDescription = () => {
    return buildServerDescription();
  };

  /* ---------------- NEW: totals & summaries ---------------- */
  /** Per-student month list for the currently selected student (label + amount) */
  const studentMonthTotals = useMemo(() => {
    if (!currentStudent?.months) return [];
    return currentStudent.months.map((m) => ({
      key: `${m.year}-${String(m.month).padStart(2, "0")}`,
      label: `${monthName(m.month)} ${m.year}`,
      amount: Number(m.due || 0),
    }));
  }, [currentStudent]);

  /** Sum across ALL months for the selected student */
  const studentAllMonthsTotal = useMemo(() => {
    return sumStudentAllMonths(currentStudent || undefined);
  }, [currentStudent]);

  /**
   * Family month-wise totals (sum of dues for each month across all students)
   * Produces sorted array: [{ key: '2025-08', label: 'Aug 2025', amount: 10 }, ...]
   */
  const familyMonthTotals = useMemo(() => {
    const map = new Map<string, number>(); // key = YYYY-MM
    if (family?.students?.length) {
      for (const s of family.students as StudentDue[]) {
        if (!s?.months) continue;
        for (const m of s.months) {
          const k = `${m.year}-${String(m.month).padStart(2, "0")}`;
          map.set(k, (map.get(k) || 0) + Number(m.due || 0));
        }
      }
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0])) // chronological
      .map(([key, amount]) => {
        const [yy, mm] = key.split("-");
        return { key, label: `${monthName(Number(mm))} ${yy}`, amount };
      });
  }, [family]);

  /** Grand total across all months for the whole family */
  const familyGrandTotal = useMemo(
    () => familyMonthTotals.reduce((acc, x) => acc + x.amount, 0),
    [familyMonthTotals]
  );

  /* ---------------- actions ---------------- */
  const handleSearch = () => {
    const query = searchQuery.trim();
    if (!query) {
      toast.error(searchSingleStudent ? "Enter a student ID." : "Enter a phone number or family name.");
      return;
    }
    if (searchSingleStudent) dispatch(fetchStudentBalance(query));
    else dispatch(fetchFamilyBalance(query));

    dispatch(clearLastPaymentInfo());
    setShowPrintButton(false);
    setReceiptData(null);
  };

  const handleCheckNumber = () => {
    const number = paymentMethod === "ZAAD" ? zaadNumber : edahabNumber;
    if (!number) {
      toast.error("Enter the payment number to check.");
      return;
    }

    setUsedNumberInfo(null);

    // verify usage for this month/year
    dispatch(checkPaymentNumberUsed({ number, month, year, method: paymentMethod })).then((res: any) => {
      const success = res.meta.requestStatus === "fulfilled";
      setNumberChecked(success);

      if (success && res.payload && typeof res.payload === "object") {
        const data = res.payload as UsedNumberResponse;
        if (data.alreadyUsed) {
          setUsedNumberInfo(data);
          toast.error(data.message);
        } else {
          toast.success(data.message);
        }
      }
    });

    // latest by (method - number) exactly
    dispatch(checkLastPaymentByNumber({ number, method: paymentMethod }));
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!family) return toast.error("Search for a family or student first.");
    if (paymentMethod !== "Cash" && !numberChecked) {
      toast("⚠️ You have not verified this payment number.", { icon: "⚠️" });
      return;
    }

    const description = buildServerDescription(); // EXACT for server

    if (searchSingleStudent) {
      if (!currentStudent) return toast.error("No student found.");
      if (selectedStudentDue <= 0) {
        toast.error(`No due for ${monthName(month)} ${year} for this student.`);
        return;
      }
      setPendingPayment({
        type: "student",
        payload: { studentId: currentStudent.studentId, month, year, discount, discountReason, description },
      });
    } else {
      if (familySelectedMonthTotal <= 0) {
        toast.error(`No dues for ${monthName(month)} ${year} in this family.`);
        return;
      }
      setPendingPayment({
        type: "family",
        payload: { parentPhone: family.phone, month, year, discount, discountReason, description },
      });
    }
    setShowConfirmModal(true);
  };

  const confirmPayment = () => {
    if (!pendingPayment) return;
    if (pendingPayment.type === "student") dispatch(payStudentMonthly(pendingPayment.payload));
    else dispatch(payFamilyMonthly(pendingPayment.payload));
    setShowConfirmModal(false);
    setPendingPayment(null);
  };

  const cancelPayment = () => {
    setShowConfirmModal(false);
    setPendingPayment(null);
  };

  /* ---------------- printing: SINGLE A5 voucher at TOP (no margins) ---------------- */
  const handlePrint = () => {
    if (!receiptPrintAreaRef.current) return;

    const printContents = receiptPrintAreaRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Could not open print window.");
      return;
    }

    printWindow.document.write("<html><head><title>Print Receipt</title>");
    printWindow.document.write(`<style>
      @page { size: A5 portrait; margin: 0; } /* ZERO margins */
      html, body { height: 100%; }
      body {
        font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        margin: 0; padding: 0; background: #ffffff;
      }

      /* Top-left anchored, no centering */
      .a5-page {
        height: 210mm;  /* full A5 portrait height */
        width: 148mm;   /* full A5 portrait width */
        box-sizing: border-box;
        display: block;
        padding: 6mm 8mm;      /* small inner padding so content isn't cropped */
      }

      /* Tighten for printing */
      .receipt-container {
        box-shadow: none !important;
        border: 1px solid #e5e7eb !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 8mm !important;
        border-radius: 8px !important;
      }

      /* table look */
      table{border-collapse:collapse;width:100%}
      thead tr{background:#f3f4f6;color:#4b5563;text-transform:uppercase;font-size:.85rem}
      th,td{padding:8px 12px}
      tbody tr{border-bottom:1px solid #e5e7eb}

      /* typography utilities used in the component */
      .text-3xl{font-size:1.75rem;font-weight:700}
      .text-sm{font-size:.875rem}
    </style>`);
    printWindow.document.write("</head><body>");
    printWindow.document.write('<div class="a5-page">'); // now anchored at top with zero page margins
    printWindow.document.write(printContents);
    printWindow.document.write("</div>");
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  /* -------- after success: build voucher data (dynamic rows) ------- */
  useEffect(() => {
    if (paymentSuccess) {
      toast.success(paymentSuccess.message || "Payment successful!");

      const receivedBy = "Mr. Abdirisak Omer";
      const dateStr = new Date().toLocaleDateString();
      const monthYearStr = `${monthName(month)} ${year}`;
      const displayDesc = buildVoucherDescription(); // e.g. "ZAAD - 63..." or "Cash"

      if (searchSingleStudent && currentStudent) {
        const amt = getDueFor(currentStudent, month, year);
        const students: VoucherStudent[] = amt > 0 ? [{ name: currentStudent.fullname, amount: amt }] : [];
        setReceiptData({
          students,
          total: students.reduce((s, r) => s + r.amount, 0),
          discount,
          description: displayDesc,
          receivedBy,
          date: dateStr,
          monthYear: monthYearStr,
        });
      } else if (family?.students) {
        const studentsWithAmt: VoucherStudent[] = family.students
          .map((s: StudentDue) => ({ name: s.fullname, amount: getDueFor(s, month, year) }))
          .filter((x: VoucherStudent) => x.amount > 0);
        const total = studentsWithAmt.reduce((sum: number, s: VoucherStudent) => sum + s.amount, 0);

        setReceiptData({
          students: studentsWithAmt, // dynamic rows only
          total,
          discount,
          description: displayDesc,
          receivedBy,
          date: dateStr,
          monthYear: monthYearStr,
        });
      }

      setShowPrintButton(true);
      dispatch(clearFamilyPaymentStatus());
      // keep month/year
      setDiscount(0);
      setDiscountReason("");
      setZaadNumber("");
      setEdahabNumber("");
      setNumberChecked(false);
      setIsDiscountVisible(false);
      setSelectedStudentId(null);
      setSearchQuery("");
      dispatch(clearLastPaymentInfo());
      setUsedNumberInfo(null);
    }

    if (paymentError) {
      toast.error(paymentError);
      dispatch(clearFamilyPaymentStatus());
      setShowPrintButton(false);
      setReceiptData(null);
    }
  }, [
    paymentSuccess,
    paymentError,
    dispatch,
    currentStudent,
    family,
    month,
    year,
    discount,
  ]);

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-2xl max-w-4xl my-8">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
        {searchSingleStudent ? "Single Student Payment" : "Family Payment Dashboard"}
      </h2>

      <form onSubmit={handlePay} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <input
              type="text"
              placeholder={searchSingleStudent ? "Student ID" : "Family name or phone number"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg py-2 px-4"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
            >
              Search
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={searchSingleStudent}
              onChange={() => setSearchSingleStudent(!searchSingleStudent)}
              className="h-5 w-5 text-blue-600 rounded"
            />
            <label className="text-base font-medium text-gray-800">Single Student</label>
          </div>

          {/* Students & selected-month dues with month chips */}
          {family && family.students && family.students.length > 0 && (
            <div className="border border-gray-200 rounded-xl p-5 bg-blue-50/50 shadow-sm space-y-4">
              <h4 className="font-bold text-xl text-blue-800">
                Students — {monthName(month)} {year}
              </h4>

              <ol className="space-y-3">
                {family.students.map((s: StudentDue, idx: number) => {
                  const months = Array.isArray(s.months) ? s.months : [];
                  const selectedDue = getDueFor(s, month, year);
                  return (
                    <li
                      key={s.studentId}
                      onClick={() => setSelectedStudentId(s.studentId)}
                      className={`cursor-pointer rounded-md px-3 py-2 transition ${
                        selectedStudentId === s.studentId ? "bg-white shadow" : "hover:bg-white/70"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-medium text-gray-800">
                          {idx + 1}. {s.fullname}
                        </span>
                        <span
                          className={`font-semibold ${
                            selectedDue > 0 ? "text-green-700" : "text-gray-500"
                          }`}
                          title="Due for the selected month"
                        >
                          {formatCurrency(selectedDue)}
                        </span>
                      </div>

                      {/* month chips */}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {months.length > 0 ? (
                          months.map((m, i) => (
                            <button
                              type="button"
                              key={`${s.studentId}-${i}`}
                              onClick={() => {
                                setMonth(Number(m.month));
                                setYear(Number(m.year));
                                setSelectedStudentId(s.studentId);
                              }}
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                                Number(m.month) === month && Number(m.year) === year
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white text-gray-800"
                              }`}
                              title={`Set ${monthName(m.month)} ${m.year}`}
                            >
                              {monthName(m.month)} {m.year}: {formatCurrency(m.due || 0)}
                            </button>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">No due months</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>

              <div className="border-t pt-3 mt-2 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">Total (Selected Month)</span>
                <span className="text-lg font-extrabold text-gray-900">
                  {formatCurrency(familySelectedMonthTotal)}
                </span>
              </div>

              {/* Selected student: all months total + chips */}
              {currentStudent && (
                <div className="mt-3 p-3 rounded-lg bg-white border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">
                      {currentStudent.fullname} — Total (All Months)
                    </span>
                    <span className="font-extrabold">
                      {formatCurrency(studentAllMonthsTotal)}
                    </span>
                  </div>

                  {studentMonthTotals.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {studentMonthTotals.map((m) => (
                        <span
                          key={m.key}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border bg-white text-gray-800"
                          title={`${m.label} — ${formatCurrency(m.amount)}`}
                        >
                          {m.label}: {formatCurrency(m.amount)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          {showPrintButton && receiptData && (
            <button
              type="button"
              onClick={handlePrint}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded mb-4"
            >
              Print Receipt (A5, top)
            </button>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Month</label>
              <input
                type="number"
                min={1}
                max={12}
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <p className="text-[11px] text-gray-500 mt-1">{monthName(month)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setNumberChecked(false);
                setUsedNumberInfo(null);
                dispatch(clearLastPaymentInfo());
              }}
              className="w-full border border-gray-300 rounded px-4 py-2"
            >
              <option value="Cash">Cash</option>
              <option value="ZAAD">ZAAD</option>
              <option value="E-dahab">E-dahab</option>
            </select>
          </div>

          {(paymentMethod === "ZAAD" || paymentMethod === "E-dahab") && (
            <div className="space-y-2 border border-gray-200 p-4 rounded bg-gray-50">
              <label className="block text-sm font-medium mb-1">
                {paymentMethod} Number
              </label>
              <input
                type="text"
                value={paymentMethod === "ZAAD" ? zaadNumber : edahabNumber}
                onChange={(e) =>
                  paymentMethod === "ZAAD"
                    ? setZaadNumber(e.target.value)
                    : setEdahabNumber(e.target.value)
                }
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <button
                type="button"
                onClick={handleCheckNumber}
                className={`w-full mt-2 py-2 rounded text-white font-semibold ${
                  numberChecked ? "bg-green-500" : "bg-yellow-500 hover:bg-yellow-600"
                }`}
                disabled={checkLoading}
              >
                {checkLoading ? "Checking..." : numberChecked ? "Checked!" : "Check Number"}
              </button>

              {usedNumberInfo && (
                <div className="mt-3 text-sm bg-red-50 border border-red-200 rounded p-3 space-y-2">
                  <p className="font-semibold text-red-700">{usedNumberInfo.message}</p>
                  {usedNumberInfo.description && (
                    <p><span className="font-medium">Description:</span> {usedNumberInfo.description}</p>
                  )}
                  {usedNumberInfo?.createdAt && (
                    <p>
                      <span className="font-medium">Created At:</span>{" "}
                      {new Date(usedNumberInfo.createdAt).toLocaleString()}
                    </p>
                  )}
                  {usedNumberInfo?.paidFor && usedNumberInfo.paidFor.length > 0 && (
                    <div>
                      <p className="font-medium mb-1">Paid For:</p>
                      <ul className="list-disc pl-5 text-gray-700">
                        {usedNumberInfo.paidFor.map((entry, idx) => (
                          <li key={idx}>
                            {entry.student} — {monthName(entry.month)} {entry.year} — ${entry.amount}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="border border-gray-200 rounded p-4 bg-gray-50">
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={isDiscountVisible}
                onChange={() => setIsDiscountVisible(!isDiscountVisible)}
                className="h-5 w-5 text-blue-600"
              />
              <span>Apply Discount</span>
            </label>
            {isDiscountVisible && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Discount Amount ($)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Reason</label>
                  <input
                    type="text"
                    value={discountReason}
                    onChange={(e) => setDiscountReason(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Family month-wise totals + grand total */}
          {family && familyMonthTotals.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-800">Family Balance by Month</h4>
                <span className="text-sm text-gray-600">
                  Months: {familyMonthTotals.length}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {familyMonthTotals.map((m) => (
                  <span
                    key={m.key}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border bg-white text-gray-800"
                    title={`${m.label} — ${formatCurrency(m.amount)}`}
                  >
                    {m.label}: {formatCurrency(m.amount)}
                  </span>
                ))}
              </div>

              <div className="border-t mt-3 pt-2 flex items-center justify-between">
                <span className="font-semibold text-gray-900">Grand Total</span>
                <span className="font-extrabold text-gray-900">
                  {formatCurrency(familyGrandTotal)}
                </span>
              </div>
            </div>
          )}

          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded">
            Submit Payment
          </button>
        </div>
      </form>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold">Confirm Payment</h3>
            {pendingPayment?.type === "student" ? (
              <>
                <p><strong>Student:</strong> {currentStudent?.fullname}</p>
                <p><strong>Amount:</strong> {formatCurrency(selectedStudentDue)}</p>
              </>
            ) : (
              <>
                <p><strong>Total Amount:</strong> {formatCurrency(familySelectedMonthTotal)}</p>
                <p><strong>Family Grand Total (All Months):</strong> {formatCurrency(familyGrandTotal)}</p>
              </>
            )}
            <p><strong>Month:</strong> {monthName(month)}</p>
            <p><strong>Year:</strong> {year}</p>
            <p><strong>Discount:</strong> {formatCurrency(discount)}</p>
            <p><strong>Description (server):</strong> {pendingPayment?.payload?.description}</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={cancelPayment} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={confirmPayment} className="px-4 py-2 bg-green-600 text-white rounded">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Receipt Component for Printing (single dynamic voucher) */}
      {receiptData && (
        <div style={{ display: "none" }}>
          <div ref={receiptPrintAreaRef} className="print-area-wrapper">
            <ReceiptVoucher data={receiptData} />
          </div>
        </div>
      )}

      {showPrintButton && receiptData && (
        <div className="mt-6">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded"
          >
            Print Receipt (A5, top)
          </button>
        </div>
      )}
    </div>
  );
};

export default FamilyPayment;
