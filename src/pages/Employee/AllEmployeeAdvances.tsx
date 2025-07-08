import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { fetchAllEmployeesAdvances } from "../../Redux/Epmloyee/employeeAdvanceSlice";
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";

const AllEmployeeAdvances = () => {
  const dispatch = useAppDispatch();
  const { allEmployeeAdvances, loading, error } = useAppSelector(
    (state) => state.employeeAdvance
  );

  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [isClient, setIsClient] = useState(false);

  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFetch = async () => {
    if (month && year) {
      try {
        await dispatch(fetchAllEmployeesAdvances({ month, year })).unwrap();
      } catch (err) {
        console.error("Failed to fetch employee advances:", err);
      }
    }
  };

  const handleDownloadPdf = () => {
    if (pdfRef.current) {
      html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: `EmployeeAdvances_${month}_${year}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { orientation: "landscape", unit: "mm", format: "a4" },
        })
        .from(pdfRef.current)
        .save();
    }
  };

  const handleDownloadExcel = () => {
    if (allEmployeeAdvances.length === 0) {
      alert("No data to export");
      return;
    }

    const worksheetData = allEmployeeAdvances.map((emp) => ({
      Name: emp.fullName,
      Phone: emp.phone,
      Salary: emp.salary,
      Advance: emp.totalAdvance,
      Remaining: emp.remainingBalance,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Advances");

    XLSX.writeFile(workbook, `EmployeeAdvances_${month}_${year}.xlsx`);
  };

  if (!isClient) {
    return null;
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
          onClick={handleDownloadPdf}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          disabled={allEmployeeAdvances.length === 0 || loading}
        >
          Download PDF
        </button>
        <button
          onClick={handleDownloadExcel}
          className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
          disabled={allEmployeeAdvances.length === 0 || loading}
        >
          Download Excel
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Hidden content for PDF */}
      <div style={{ position: "absolute", left: "-9999px", top: "0" }}>
        <div ref={pdfRef}>
          <div
            style={{
              textAlign: "center",
              fontSize: "18px",
              marginBottom: "15px",
            }}
          >
            Employee Advances - {month}/{year}
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Name</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Phone</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Salary</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Advance</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Remaining</th>
              </tr>
            </thead>
            <tbody>
              {allEmployeeAdvances.map((emp) => (
                <tr key={emp.id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{emp.fullName}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{emp.phone}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    ${emp.salary.toFixed(2)}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    ${emp.totalAdvance.toFixed(2)}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    ${emp.remainingBalance.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              textAlign: "right",
              fontSize: "10px",
              marginTop: "15px",
              color: "#666",
            }}
          >
            Generated on {new Date().toLocaleDateString()} at{" "}
            {new Date().toLocaleTimeString()}
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
                  <td className="border px-2 py-1">
                    ${emp.salary.toFixed(2)}
                  </td>
                  <td className="border px-2 py-1">
                    ${emp.totalAdvance.toFixed(2)}
                  </td>
                  <td className="border px-2 py-1">
                    ${emp.remainingBalance.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="border px-2 py-1 text-center text-gray-500"
                >
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
