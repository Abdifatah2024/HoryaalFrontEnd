// import React, { useEffect, useState, useRef } from "react";
// import { useAppDispatch, useAppSelector } from "../../Redux/store";
// import {
//   fetchUserPaymentCollections,
//   selectFinancialReports,
// } from "./financialSlice";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// const UserPaymentCollection: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { usersPaymentSummary, loading, error } = useAppSelector(
//     selectFinancialReports
//   );
//   const contentRef = useRef<HTMLDivElement>(null);

//   const [selectedUserId, setSelectedUserId] = useState<number | "">("");
//   const [filterDate, setFilterDate] = useState("");
//   const [filterMonth, setFilterMonth] = useState<number | "">("");
//   const [filterYear, setFilterYear] = useState<number | "">("");

//   useEffect(() => {
//     dispatch(fetchUserPaymentCollections());
//   }, [dispatch]);

//   // Clear date filter when month/year is selected and vice versa
//   useEffect(() => {
//     if (filterMonth || filterYear) {
//       setFilterDate("");
//     }
//   }, [filterMonth, filterYear]);

//   useEffect(() => {
//     if (filterDate) {
//       setFilterMonth("");
//       setFilterYear("");
//     }
//   }, [filterDate]);

//   const filteredUsers = usersPaymentSummary.filter((user) => {
//     if (selectedUserId && user.userId !== selectedUserId) return false;
//     return true;
//   });

//   const generatePDF = () => {
//     if (!contentRef.current) return;

//     const doc = new jsPDF();
//     const date = new Date().toLocaleDateString();
    
//     // Add title
//     doc.setFontSize(18);
//     doc.text("Payment Collection Report", 14, 20);
//     doc.setFontSize(12);
//     doc.text(`Generated on: ${date}`, 14, 30);
    
//     // Add filters info
//     let filters = [];
//     if (selectedUserId) filters.push(`User: ${usersPaymentSummary.find(u => u.userId === selectedUserId)?.fullName}`);
//     if (filterDate) filters.push(`Date: ${filterDate}`);
//     if (filterMonth) filters.push(`Month: ${filterMonth}`);
//     if (filterYear) filters.push(`Year: ${filterYear}`);
    
//     if (filters.length > 0) {
//       doc.text(`Filters: ${filters.join(", ")}`, 14, 40);
//     }

//     let yPosition = 50;

//     filteredUsers.forEach((user, index) => {
//       const filteredPayments = user.studentPayments.filter((sp) => {
//         const spDate = new Date(sp.date);
//         const spMonth = spDate.getMonth() + 1;
//         const spYear = spDate.getFullYear();
//         const spDateStr = sp.date.slice(0, 10);

//         const matchDate = filterDate ? spDateStr === filterDate : true;
//         const matchMonth = filterMonth ? spMonth === filterMonth : true;
//         const matchYear = filterYear ? spYear === filterYear : true;

//         return matchDate && matchMonth && matchYear;
//       });

//       if (filteredPayments.length === 0) return;

//       // Calculate totals by payment method
//       const totalsByMethod = filteredPayments.reduce((acc, sp) => {
//         const method = sp.description?.toLowerCase() || 'cash';
//         if (method.includes('zaad')) {
//           acc.zaad += sp.amountPaid;
//         } else if (method.includes('e-dahab') || method.includes('edahab')) {
//           acc.edahab += sp.amountPaid;
//         } else {
//           acc.cash += sp.amountPaid;
//         }
//         return acc;
//       }, { cash: 0, zaad: 0, edahab: 0 });

//       const totalPaid = filteredPayments.reduce((sum, sp) => sum + sp.amountPaid, 0);
//       const totalDiscount = filteredPayments.reduce((sum, sp) => sum + sp.discount, 0);

//       // Add user summary to PDF
//       doc.setFontSize(14);
//       doc.text(`${index + 1}. ${user.fullName}`, 14, yPosition);
//       yPosition += 7;
      
//       doc.setFontSize(10);
//       doc.text(`Email: ${user.email}`, 14, yPosition);
//       yPosition += 7;
      
//       doc.text(`Total Paid: $${totalPaid.toFixed(2)}`, 14, yPosition);
//       yPosition += 7;
      
//       doc.text(`Total Discount: $${totalDiscount.toFixed(2)}`, 14, yPosition);
//       yPosition += 7;
      
//       doc.text(`Transactions: ${filteredPayments.length}`, 14, yPosition);
//       yPosition += 7;
      
//       // Payment method breakdown
//       doc.text(`Payment Methods:`, 14, yPosition);
//       yPosition += 7;
      
//       doc.text(`- Cash: $${totalsByMethod.cash.toFixed(2)}`, 20, yPosition);
//       yPosition += 7;
      
//       doc.text(`- ZAAD: $${totalsByMethod.zaad.toFixed(2)}`, 20, yPosition);
//       yPosition += 7;
      
//       doc.text(`- E-dahab: $${totalsByMethod.edahab.toFixed(2)}`, 20, yPosition);
//       yPosition += 10;

//       // Add transactions table
//       const tableData = filteredPayments.map(sp => [
//         sp.studentName,
//         `$${sp.amountPaid.toFixed(2)}`,
//         `$${sp.discount.toFixed(2)}`,
//         sp.description?.toLowerCase().includes('zaad') ? 'ZAAD' : 
//         sp.description?.toLowerCase().includes('e-dahab') || sp.description?.toLowerCase().includes('edahab') ? 'E-dahab' : 'Cash',
//         sp.date.slice(0, 10)
//       ]);

//       autoTable(doc, {
//         startY: yPosition,
//         head: [['Student', 'Amount', 'Discount', 'Method', 'Date']],
//         body: tableData,
//         margin: { top: 10 },
//         styles: { fontSize: 8 },
//         headStyles: { fillColor: [41, 128, 185] }
//       });

//       yPosition = doc.lastAutoTable.finalY + 10;
      
//       // Add page break if we're getting close to the bottom
//       if (yPosition > 250) {
//         doc.addPage();
//         yPosition = 20;
//       }
//     });

//     doc.save(`payment-report-${date}.pdf`);
//   };

//   const handlePrint = () => {
//     const printContent = contentRef.current;
//     if (!printContent) return;

//     const printWindow = window.open('', '_blank');
//     if (!printWindow) return;

//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Payment Collection Report</title>
//           <style>
//             body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
//             h2 { color: #2c3e50; }
//             .print-header { margin-bottom: 20px; }
//             .print-filters { margin-bottom: 15px; font-size: 14px; }
//             .user-card { margin-bottom: 30px; break-inside: avoid; }
//             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//             th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//             th { background-color: #f2f2f2; }
//             .payment-methods { display: flex; gap: 10px; margin-bottom: 15px; }
//             .method-card { border: 1px solid #ddd; padding: 10px; border-radius: 4px; flex: 1; }
//             .totals-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px; }
//             .total-card { border: 1px solid #ddd; padding: 10px; border-radius: 4px; }
//             @media print {
//               @page { size: auto; margin: 10mm; }
//               body { padding: 0; }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="print-header">
//             <h2>Payment Collection Report</h2>
//             <p>Generated on: ${new Date().toLocaleDateString()}</p>
//           </div>
//           ${printContent.innerHTML}
//         </body>
//       </html>
//     `);

//     printWindow.document.close();
//     setTimeout(() => {
//       printWindow.print();
//       printWindow.close();
//     }, 200);
//   };

//   return (
//     <div className="p-4 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {/* Header with buttons - will not be printed */}
//         <div className="flex justify-between items-center mb-6 no-print">
//           <h2 className="text-2xl font-bold text-gray-800">User Payment Collections</h2>
//           <div className="flex gap-2">
//             <button 
//               onClick={generatePDF}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
//               </svg>
//               Export PDF
//             </button>
//             <button 
//               onClick={handlePrint}
//               className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//               </svg>
//               Print
//             </button>
//           </div>
//         </div>

//         {/* Filters Section - will not be printed */}
//         <div className="bg-white p-4 rounded-lg shadow-md mb-6 no-print">
//           <h3 className="text-lg font-semibold mb-4 text-gray-700">Filters</h3>
//           <div className="flex flex-wrap gap-4">
//             <div className="flex-1 min-w-[200px]">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
//               <select
//                 className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 value={selectedUserId}
//                 onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : "")}
//               >
//                 <option value="">All Users</option>
//                 {usersPaymentSummary.map((user) => (
//                   <option key={user.userId} value={user.userId}>
//                     {user.fullName}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="flex-1 min-w-[200px]">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Specific Date</label>
//               <input
//                 type="date"
//                 className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 value={filterDate}
//                 onChange={(e) => setFilterDate(e.target.value)}
//               />
//             </div>

//             <div className="flex gap-4">
//               <div className="w-24">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
//                 <input
//                   type="number"
//                   placeholder="MM"
//                   min="1"
//                   max="12"
//                   className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   value={filterMonth}
//                   onChange={(e) => setFilterMonth(e.target.value ? Number(e.target.value) : "")}
//                 />
//               </div>

//               <div className="w-28">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
//                 <input
//                   type="number"
//                   placeholder="YYYY"
//                   min="2000"
//                   max={new Date().getFullYear()}
//                   className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   value={filterYear}
//                   onChange={(e) => setFilterYear(e.target.value ? Number(e.target.value) : "")}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Status Indicators */}
//         {loading && (
//           <div className="flex justify-center items-center p-8 no-print">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         )}
//         {error && (
//           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded no-print">
//             <p>Error: {error}</p>
//           </div>
//         )}

//         {/* Content to be printed/exported */}
//         <div ref={contentRef} className="printable-content">
//           {/* Results Grid */}
//           {!loading && !error && (
//             <div className="grid gap-6 md:grid-cols-2 print:grid-cols-1">
//               {filteredUsers.map((user, index) => {
//                 const filteredPayments = user.studentPayments.filter((sp) => {
//                   const spDate = new Date(sp.date);
//                   const spMonth = spDate.getMonth() + 1;
//                   const spYear = spDate.getFullYear();
//                   const spDateStr = sp.date.slice(0, 10);

//                   const matchDate = filterDate ? spDateStr === filterDate : true;
//                   const matchMonth = filterMonth ? spMonth === filterMonth : true;
//                   const matchYear = filterYear ? spYear === filterYear : true;

//                   return matchDate && matchMonth && matchYear;
//                 });

//                 if (filteredPayments.length === 0) return null;

//                 // Calculate totals by payment method
//                 const totalsByMethod = filteredPayments.reduce((acc, sp) => {
//                   const method = sp.description?.toLowerCase() || 'cash';
//                   if (method.includes('zaad')) {
//                     acc.zaad += sp.amountPaid;
//                   } else if (method.includes('e-dahab') || method.includes('edahab')) {
//                     acc.edahab += sp.amountPaid;
//                   } else {
//                     acc.cash += sp.amountPaid;
//                   }
//                   return acc;
//                 }, { cash: 0, zaad: 0, edahab: 0 });

//                 const totalPaid = filteredPayments.reduce((sum, sp) => sum + sp.amountPaid, 0);
//                 const totalDiscount = filteredPayments.reduce((sum, sp) => sum + sp.discount, 0);

//                 return (
//                   <div key={user.userId} className="bg-white p-5 rounded-lg border border-gray-200 print:border print:break-inside-avoid">
//                     <div className="flex justify-between items-start mb-3">
//                       <h3 className="text-lg font-semibold text-gray-800 print:text-black">
//                         <span className="text-blue-600 print:text-black">{index + 1}.</span> {user.fullName}
//                       </h3>
//                       <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full print:border print:border-gray-300 print:text-black">
//                         {filteredPayments.length} {filteredPayments.length === 1 ? 'transaction' : 'transactions'}
//                       </span>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3 mb-4 print:grid-cols-3">
//                       <div className="bg-gray-50 p-3 rounded print:border">
//                         <p className="text-sm text-gray-500 print:text-gray-700">Email</p>
//                         <p className="font-medium text-gray-800 print:text-black">{user.email}</p>
//                       </div>
//                       <div className="bg-green-50 p-3 rounded print:border">
//                         <p className="text-sm text-gray-500 print:text-gray-700">Total Paid</p>
//                         <p className="font-medium text-green-600 print:text-black">${totalPaid.toFixed(2)}</p>
//                       </div>
//                       <div className="bg-yellow-50 p-3 rounded print:border">
//                         <p className="text-sm text-gray-500 print:text-gray-700">Total Discount</p>
//                         <p className="font-medium text-yellow-600 print:text-black">${totalDiscount.toFixed(2)}</p>
//                       </div>
//                     </div>

//                     {/* Payment Method Summary */}
//                     <div className="mb-4 p-3 bg-blue-50 rounded print:border">
//                       <h4 className="font-semibold mb-2 text-blue-800 print:text-black">Payment Method Summary</h4>
//                       <div className="grid grid-cols-3 gap-2">
//                         <div className="bg-white p-2 rounded border border-blue-100 print:border-gray-200">
//                           <p className="text-xs text-gray-500">Cash</p>
//                           <p className="font-medium">${totalsByMethod.cash.toFixed(2)}</p>
//                         </div>
//                         <div className="bg-white p-2 rounded border border-blue-100 print:border-gray-200">
//                           <p className="text-xs text-gray-500">ZAAD</p>
//                           <p className="font-medium">${totalsByMethod.zaad.toFixed(2)}</p>
//                         </div>
//                         <div className="bg-white p-2 rounded border border-blue-100 print:border-gray-200">
//                           <p className="text-xs text-gray-500">E-dahab</p>
//                           <p className="font-medium">${totalsByMethod.edahab.toFixed(2)}</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mt-4">
//                       <h4 className="font-semibold mb-2 text-gray-700 border-b pb-1 print:text-black print:border-black">Payment Details</h4>
//                       <div className="overflow-x-auto print:overflow-visible">
//                         <table className="w-full border-collapse print:w-full">
//                           <thead>
//                             <tr className="bg-gray-100 text-gray-600 text-left print:bg-gray-200 print:text-black">
//                               <th className="p-2 border-b print:border-black">Student</th>
//                               <th className="p-2 border-b text-right print:border-black">Amount</th>
//                               <th className="p-2 border-b text-right print:border-black">Discount</th>
//                               <th className="p-2 border-b print:border-black">Method</th>
//                               <th className="p-2 border-b print:border-black">Date</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {filteredPayments.map((sp, idx) => (
//                               <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 print:bg-white'}>
//                                 <td className="p-2 border-b text-gray-700 print:border-gray-300 print:text-black">{sp.studentName}</td>
//                                 <td className="p-2 border-b text-right font-medium text-green-600 print:border-gray-300 print:text-black">${sp.amountPaid.toFixed(2)}</td>
//                                 <td className="p-2 border-b text-right font-medium text-yellow-600 print:border-gray-300 print:text-black">${sp.discount.toFixed(2)}</td>
//                                 <td className="p-2 border-b text-gray-600 print:border-gray-300 print:text-black">
//                                   {sp.description?.toLowerCase().includes('zaad') ? 'ZAAD' : 
//                                    sp.description?.toLowerCase().includes('e-dahab') || sp.description?.toLowerCase().includes('edahab') ? 'E-dahab' : 'Cash'}
//                                 </td>
//                                 <td className="p-2 border-b text-gray-500 print:border-gray-300 print:text-black">{sp.date.slice(0, 10)}</td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//           {/* Empty State */}
//           {!loading && !error && filteredUsers.length === 0 && (
//             <div className="bg-white p-8 rounded-lg text-center">
//               <div className="text-gray-400 mb-4">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-medium text-gray-700 mb-2">No payment records found</h3>
//               <p className="text-gray-500">Try adjusting your filters to see more results</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserPaymentCollection;
import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  fetchUserPaymentCollections,
  selectFinancialReports,
} from "./financialSlice";
import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

const UserPaymentCollection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { usersPaymentSummary, loading, error } = useAppSelector(
    selectFinancialReports
  );
  const contentRef = useRef<HTMLDivElement>(null);

  const [selectedUserId, setSelectedUserId] = useState<number | "">("");
  const [filterDate, setFilterDate] = useState("");
  const [filterMonth, setFilterMonth] = useState<number | "">("");
  const [filterYear, setFilterYear] = useState<number | "">("");

  useEffect(() => {
    dispatch(fetchUserPaymentCollections());
  }, [dispatch]);

  // Clear date filter when month/year is selected and vice versa
  useEffect(() => {
    if (filterMonth || filterYear) {
      setFilterDate("");
    }
  }, [filterMonth, filterYear]);

  useEffect(() => {
    if (filterDate) {
      setFilterMonth("");
      setFilterYear("");
    }
  }, [filterDate]);

  const filteredUsers = usersPaymentSummary.filter((user) => {
    if (selectedUserId && user.userId !== selectedUserId) return false;
    return true;
  });

  const generatePDF = () => {
    if (!contentRef.current) return;

    // Cast doc to 'any' to avoid TypeScript errors related to autoTable not being on jsPDF type
    const doc: any = new jsPDF();
    const date = new Date().toLocaleDateString();

    // Add title
    doc.setFontSize(18);
    doc.text("Payment Collection Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${date}`, 14, 30);

    // Add filters info
    const filters: string[] = []; // Changed to const
    if (selectedUserId) filters.push(`User: ${usersPaymentSummary.find(u => u.userId === selectedUserId)?.fullName}`);
    if (filterDate) filters.push(`Date: ${filterDate}`);
    if (filterMonth) filters.push(`Month: ${filterMonth}`);
    if (filterYear) filters.push(`Year: ${filterYear}`);

    if (filters.length > 0) {
      doc.text(`Filters: ${filters.join(", ")}`, 14, 40);
    }

    let yPosition = 50;

    filteredUsers.forEach((user, index) => {
      const filteredPayments = user.studentPayments.filter((sp) => {
        const spDate = new Date(sp.date);
        const spMonth = spDate.getMonth() + 1;
        const spYear = spDate.getFullYear();
        const spDateStr = sp.date.slice(0, 10);

        const matchDate = filterDate ? spDateStr === filterDate : true;
        const matchMonth = filterMonth ? spMonth === filterMonth : true;
        const matchYear = filterYear ? spYear === filterYear : true;

        return matchDate && matchMonth && matchYear;
      });

      if (filteredPayments.length === 0) return;

      // Calculate totals by payment method, safely parsing amounts
      const totalsByMethod = filteredPayments.reduce((acc, sp) => {
        const method = sp.description?.toLowerCase() || 'cash';
        const amount = parseFloat(sp.amountPaid as any) || 0; // Safely parse amount
        if (method.includes('zaad')) {
          acc.zaad += amount;
        } else if (method.includes('e-dahab') || method.includes('edahab')) {
          acc.edahab += amount;
        } else {
          acc.cash += amount;
        }
        return acc;
      }, { cash: 0, zaad: 0, edahab: 0 });

      const totalPaid = filteredPayments.reduce((sum, sp) => sum + (parseFloat(sp.amountPaid as any) || 0), 0); // Safely parse
      const totalDiscount = filteredPayments.reduce((sum, sp) => sum + (parseFloat(sp.discount as any) || 0), 0); // Safely parse

      // Add user summary to PDF
      doc.setFontSize(14);
      doc.text(`${index + 1}. ${user.fullName}`, 14, yPosition);
      yPosition += 7;

      doc.setFontSize(10);
      doc.text(`Email: ${user.email}`, 14, yPosition);
      yPosition += 7;

      doc.text(`Total Paid: $${totalPaid.toFixed(2)}`, 14, yPosition);
      yPosition += 7;

      doc.text(`Total Discount: $${totalDiscount.toFixed(2)}`, 14, yPosition);
      yPosition += 7;

      doc.text(`Transactions: ${filteredPayments.length}`, 14, yPosition);
      yPosition += 7;

      // Payment method breakdown
      doc.text(`Payment Methods:`, 14, yPosition);
      yPosition += 7;

      doc.text(`- Cash: $${totalsByMethod.cash.toFixed(2)}`, 20, yPosition);
      yPosition += 7;

      doc.text(`- ZAAD: $${totalsByMethod.zaad.toFixed(2)}`, 20, yPosition);
      yPosition += 7;

      doc.text(`- E-dahab: $${totalsByMethod.edahab.toFixed(2)}`, 20, yPosition);
      yPosition += 10;

      // Add transactions table
      const tableData = filteredPayments.map(sp => [
        sp.studentName,
        `$${(parseFloat(sp.amountPaid as any) || 0).toFixed(2)}`, // Safely parse
        `$${(parseFloat(sp.discount as any) || 0).toFixed(2)}`,   // Safely parse
        sp.description?.toLowerCase().includes('zaad') ? 'ZAAD' :
        sp.description?.toLowerCase().includes('e-dahab') || sp.description?.toLowerCase().includes('edahab') ? 'E-dahab' : 'Cash',
        sp.date.slice(0, 10)
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [['Student', 'Amount', 'Discount', 'Method', 'Date']],
        body: tableData,
        margin: { top: 10 },
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] }
      });

      yPosition = doc.autoTable.previous.finalY + 10; // Access previous.finalY safely

      // Add page break if we're getting close to the bottom
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
    });

    doc.save(`payment-report-${date}.pdf`);
  };

  const handlePrint = () => {
    const printContent = contentRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Payment Collection Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
            h2 { color: #2c3e50; }
            .print-header { margin-bottom: 20px; }
            .print-filters { margin-bottom: 15px; font-size: 14px; }
            .user-card { margin-bottom: 30px; break-inside: avoid; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .payment-methods { display: flex; gap: 10px; margin-bottom: 15px; }
            .method-card { border: 1px solid #ddd; padding: 10px; border-radius: 4px; flex: 1; }
            .totals-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px; }
            .total-card { border: 1px solid #ddd; padding: 10px; border-radius: 4px; }
            @media print {
              @page { size: auto; margin: 10mm; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h2>Payment Collection Report</h2>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 200);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with buttons - will not be printed */}
        <div className="flex justify-between items-center mb-6 no-print">
          <h2 className="text-2xl font-bold text-gray-800">User Payment Collections</h2>
          <div className="flex gap-2">
            <button
              onClick={generatePDF}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Export PDF
            </button>
            <button
              onClick={handlePrint}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
          </div>
        </div>

        {/* Filters Section - will not be printed */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 no-print">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Filters</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
              <select
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : "")}
              >
                <option value="">All Users</option>
                {usersPaymentSummary.map((user) => (
                  <option key={user.userId} value={user.userId}>
                    {user.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Specific Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <div className="w-24">
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <input
                  type="number"
                  placeholder="MM"
                  min="1"
                  max="12"
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value ? Number(e.target.value) : "")}
                />
              </div>

              <div className="w-28">
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input
                  type="number"
                  placeholder="YYYY"
                  min="2000"
                  max={new Date().getFullYear()}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value ? Number(e.target.value) : "")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        {loading && (
          <div className="flex justify-center items-center p-8 no-print">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded no-print">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Content to be printed/exported */}
        <div ref={contentRef} className="printable-content">
          {/* Results Grid */}
          {!loading && !error && (
            <div className="grid gap-6 md:grid-cols-2 print:grid-cols-1">
              {filteredUsers.map((user, index) => {
                const filteredPayments = user.studentPayments.filter((sp) => {
                  const spDate = new Date(sp.date);
                  const spMonth = spDate.getMonth() + 1;
                  const spYear = spDate.getFullYear();
                  const spDateStr = sp.date.slice(0, 10);

                  const matchDate = filterDate ? spDateStr === filterDate : true;
                  const matchMonth = filterMonth ? spMonth === filterMonth : true;
                  const matchYear = filterYear ? spYear === filterYear : true;

                  return matchDate && matchMonth && matchYear;
                });

                if (filteredPayments.length === 0) return null;

                // Calculate totals by payment method
                const totalsByMethod = filteredPayments.reduce((acc, sp) => {
                  const method = sp.description?.toLowerCase() || 'cash';
                  const amount = parseFloat(sp.amountPaid as any) || 0; // Safely parse amount
                  if (method.includes('zaad')) {
                    acc.zaad += amount;
                  } else if (method.includes('e-dahab') || method.includes('edahab')) {
                    acc.edahab += amount;
                  } else {
                    acc.cash += amount;
                  }
                  return acc;
                }, { cash: 0, zaad: 0, edahab: 0 });

                const totalPaid = filteredPayments.reduce((sum, sp) => sum + (parseFloat(sp.amountPaid as any) || 0), 0); // Safely parse
                const totalDiscount = filteredPayments.reduce((sum, sp) => sum + (parseFloat(sp.discount as any) || 0), 0); // Safely parse

                return (
                  <div key={user.userId} className="bg-white p-5 rounded-lg border border-gray-200 print:border print:break-inside-avoid">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 print:text-black">
                        <span className="text-blue-600 print:text-black">{index + 1}.</span> {user.fullName}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full print:border print:border-gray-300 print:text-black">
                        {filteredPayments.length} {filteredPayments.length === 1 ? 'transaction' : 'transactions'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4 print:grid-cols-3">
                      <div className="bg-gray-50 p-3 rounded print:border">
                        <p className="text-sm text-gray-500 print:text-gray-700">Email</p>
                        <p className="font-medium text-gray-800 print:text-black">{user.email}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded print:border">
                        <p className="text-sm text-gray-500 print:text-gray-700">Total Paid</p>
                        <p className="font-medium text-green-600 print:text-black">${totalPaid.toFixed(2)}</p>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded print:border">
                        <p className="text-sm text-gray-500 print:text-gray-700">Total Discount</p>
                        <p className="font-medium text-yellow-600 print:text-black">${totalDiscount.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Payment Method Summary */}
                    <div className="mb-4 p-3 bg-blue-50 rounded print:border">
                      <h4 className="font-semibold mb-2 text-blue-800 print:text-black">Payment Method Summary</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white p-2 rounded border border-blue-100 print:border-gray-200">
                          <p className="text-xs text-gray-500">Cash</p>
                          <p className="font-medium">${totalsByMethod.cash.toFixed(2)}</p>
                        </div>
                        <div className="bg-white p-2 rounded border border-blue-100 print:border-gray-200">
                          <p className="text-xs text-gray-500">ZAAD</p>
                          <p className="font-medium">${totalsByMethod.zaad.toFixed(2)}</p>
                        </div>
                        <div className="bg-white p-2 rounded border border-blue-100 print:border-gray-200">
                          <p className="text-xs text-gray-500">E-dahab</p>
                          <p className="font-medium">${totalsByMethod.edahab.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-semibold mb-2 text-gray-700 border-b pb-1 print:text-black print:border-black">Payment Details</h4>
                      <div className="overflow-x-auto print:overflow-visible">
                        <table className="w-full border-collapse print:w-full">
                          <thead>
                            <tr className="bg-gray-100 text-gray-600 text-left print:bg-gray-200 print:text-black">
                              <th className="p-2 border-b print:border-black">Student</th>
                              <th className="p-2 border-b text-right print:border-black">Amount</th>
                              <th className="p-2 border-b text-right print:border-black">Discount</th>
                              <th className="p-2 border-b print:border-black">Method</th>
                              <th className="p-2 border-b print:border-black">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredPayments.map((sp, idx) => (
                              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 print:bg-white'}>
                                <td className="p-2 border-b text-gray-700 print:border-gray-300 print:text-black">{sp.studentName}</td>
                                <td className="p-2 border-b text-right font-medium text-green-600 print:border-gray-300 print:text-black">${(parseFloat(sp.amountPaid as any) || 0).toFixed(2)}</td>
                                <td className="p-2 border-b text-right font-medium text-yellow-600 print:border-gray-300 print:text-black">${(parseFloat(sp.discount as any) || 0).toFixed(2)}</td>
                                <td className="p-2 border-b text-gray-600 print:border-gray-300 print:text-black">
                                  {sp.description?.toLowerCase().includes('zaad') ? 'ZAAD' :
                                    sp.description?.toLowerCase().includes('e-dahab') || sp.description?.toLowerCase().includes('edahab') ? 'E-dahab' : 'Cash'}
                                </td>
                                <td className="p-2 border-b text-gray-500 print:border-gray-300 print:text-black">{sp.date.slice(0, 10)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredUsers.length === 0 && (
            <div className="bg-white p-8 rounded-lg text-center">
              <div className="text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No payment records found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPaymentCollection;
