// import { useState, useRef } from "react";
// import { useAppDispatch, useAppSelector } from "../../Redux/store";
// import { fetchAllEmployeesAdvances } from "../../Redux/Epmloyee/employeeAdvanceSlice";
// import { useReactToPrint } from "react-to-print";

// const AllEmployeeAdvances = () => {
//   const dispatch = useAppDispatch();
//   const { allEmployeeAdvances, loading, error } = useAppSelector(
//     (state) => state.employeeAdvance
//   );

//   const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
//   const [year, setYear] = useState<number>(new Date().getFullYear());

//   const tableRef = useRef<HTMLDivElement>(null);

//   const handlePrint = useReactToPrint({
//     content: () => tableRef.current,
//     documentTitle: `EmployeeAdvances_${month}_${year}`,
//     pageStyle: `
//       @page { size: A4 landscape; margin: 10mm; }
//       body { font-family: sans-serif; }
//       table { width: 100%; border-collapse: collapse; }
//       th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
//       th { background: #f0f0f0; }
//     `,
//   });

//   const handleFetch = () => {
//     if (month && year) {
//       dispatch(fetchAllEmployeesAdvances({ month, year }));
//     }
//   };

//   return (
//     <div className="mt-6">
//       <h2 className="font-bold text-xl mb-2">All Employees' Advances</h2>

//       <div className="flex gap-4 mb-4">
//         <input
//           type="number"
//           value={month}
//           onChange={(e) => setMonth(Number(e.target.value))}
//           className="border px-2 py-1"
//           placeholder="Month"
//         />
//         <input
//           type="number"
//           value={year}
//           onChange={(e) => setYear(Number(e.target.value))}
//           className="border px-2 py-1"
//           placeholder="Year"
//         />
//         <button
//           onClick={handleFetch}
//           className="bg-green-600 text-white px-4 py-1 rounded"
//         >
//           Fetch
//         </button>
//         <button
//           onClick={handlePrint}
//           className="bg-blue-600 text-white px-4 py-1 rounded"
//           disabled={allEmployeeAdvances.length === 0}
//         >
//           Print
//         </button>
//       </div>

//       {loading && <p>Loading...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       <div ref={tableRef}>
//         <table className="w-full border-collapse border text-sm">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border px-2 py-1">Name</th>
//               <th className="border px-2 py-1">Phone</th>
//               <th className="border px-2 py-1">Salary</th>
//               <th className="border px-2 py-1">Advance</th>
//               <th className="border px-2 py-1">Remaining</th>
//             </tr>
//           </thead>
//           <tbody>
//             {allEmployeeAdvances.map((emp) => (
//               <tr key={emp.id}>
//                 <td className="border px-2 py-1">{emp.fullName}</td>
//                 <td className="border px-2 py-1">{emp.phone}</td>
//                 <td className="border px-2 py-1">${emp.salary}</td>
//                 <td className="border px-2 py-1">${emp.totalAdvance}</td>
//                 <td className="border px-2 py-1">${emp.remainingBalance}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AllEmployeeAdvances;
import { useState, useRef, useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { fetchAllEmployeesAdvances } from "../../Redux/Epmloyee/employeeAdvanceSlice";
import { useReactToPrint } from "react-to-print";

const AllEmployeeAdvances = () => {
  const dispatch = useAppDispatch();
  const { allEmployeeAdvances, loading, error } = useAppSelector(
    (state) => state.employeeAdvance
  );

  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [isClient, setIsClient] = useState(false);

  const tableRef = useRef<HTMLDivElement>(null);

  // Ensure we're on client-side before printing
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
    documentTitle: `EmployeeAdvances_${month}_${year}`,
    onBeforeGetContent: () => {
      console.log("Preparing content...");
      if (!tableRef.current) {
        console.error("No content available to print");
        return Promise.reject("No content available");
      }
      return Promise.resolve();
    },
    onBeforePrint: () => console.log("About to print..."),
    onAfterPrint: () => console.log("Printed successfully"),
    onPrintError: (errorLocation, error) => {
      console.error("Print error:", errorLocation, error);
      alert(`Printing failed: ${error}`);
    },
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 10mm;
      }
      body {
        font-family: Arial, sans-serif;
        font-size: 12px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
      .print-title {
        text-align: center;
        font-size: 18px;
        margin-bottom: 15px;
      }
      .print-footer {
        text-align: right;
        font-size: 10px;
        margin-top: 15px;
        color: #666;
      }
    `,
    removeAfterPrint: false,
  });

  const handleFetch = async () => {
    if (month && year) {
      try {
        await dispatch(fetchAllEmployeesAdvances({ month, year })).unwrap();
      } catch (err) {
        console.error("Failed to fetch employee advances:", err);
      }
    }
  };

  if (!isClient) {
    return null; // Don't render on server-side
  }

  return (
    <div className="mt-6">
      <h2 className="font-bold text-xl mb-2">All Employees' Advances</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="number"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border px-2 py-1 w-20"
          placeholder="Month"
          min="1"
          max="12"
        />
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border px-2 py-1 w-24"
          placeholder="Year"
        />
        <button
          onClick={handleFetch}
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
        >
          Fetch
        </button>
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          disabled={allEmployeeAdvances.length === 0 || loading}
        >
          Print
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Printable content */}
      <div style={{ display: "none" }}>
        <div ref={tableRef}>
          <div className="print-title">Employee Advances - {month}/{year}</div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Salary</th>
                <th>Advance</th>
                <th>Remaining</th>
              </tr>
            </thead>
            <tbody>
              {allEmployeeAdvances.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.fullName}</td>
                  <td>{emp.phone}</td>
                  <td>${emp.salary.toFixed(2)}</td>
                  <td>${emp.totalAdvance.toFixed(2)}</td>
                  <td>${emp.remainingBalance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="print-footer">
            Printed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Visible table */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Preview</h3>
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Phone</th>
              <th className="border px-2 py-1">Salary</th>
              <th className="border px-2 py-1">Advance</th>
              <th className="border px-2 py-1">Remaining</th>
            </tr>
          </thead>
          <tbody>
            {allEmployeeAdvances.length > 0 ? (
              allEmployeeAdvances.map((emp) => (
                <tr key={emp.id}>
                  <td className="border px-2 py-1">{emp.fullName}</td>
                  <td className="border px-2 py-1">{emp.phone}</td>
                  <td className="border px-2 py-1">${emp.salary.toFixed(2)}</td>
                  <td className="border px-2 py-1">${emp.totalAdvance.toFixed(2)}</td>
                  <td className="border px-2 py-1">${emp.remainingBalance.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="border px-2 py-1 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllEmployeeAdvances;
