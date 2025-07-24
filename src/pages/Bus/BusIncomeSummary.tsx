import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../Redux/store";
import {
  fetchBusSalaryAndFeeSummary,
  selectBusFeeStudents,
} from "../../Redux/Auth/busFeeSlice";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// --- Type Definitions (Interfaces) ---
interface Driver {
  id: number;
  name: string;
  salary: number;
}

interface Student {
  id: number;
  name: string;
  district: string;
  totalFee: number;
  schoolFee: number;
  expectedBusFee: number;
  actualBusFeeCollected: number;
  unpaidBusFee: number;
}

interface BusSummary {
  busId: number;
  name: string;
  route: string;
  plate: string;
  driver: Driver;
  studentCount: number;
  totalBusFeeCollected: number;
  expectedBusIncome: number;
  collectionGap: number;
  status: string;
  profitOrLossAmount: number;
  students: Student[];
}

interface OverallSummary {
  success: boolean;
  month: number;
  year: number;
  totalBuses: number;
  totalStudentsWithBus: number;
  totalBusFeeCollected: number;
  expectedBusIncome: number;
  busFeeCollectionGap: number;
  totalBusSalary: number;
  profitOrLoss: number;
  busSummaries: BusSummary[];
}
// --- End Type Definitions ---


const BusFeeSummaryPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { summary, loading, error } = useSelector(selectBusFeeStudents) as {
    summary: OverallSummary | null;
    loading: boolean;
    error: string | null;
  };
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [expandedBusId, setExpandedBusId] = useState<number | null>(null); // For individual bus student list toggle
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showAllBuses, setShowAllBuses] = useState<boolean>(true); // Renamed and defaulted to true to show all buses initially

  // --- PDF & Print for Overall Summary ONLY ---
  const handleOverallSummaryPDF = () => {
    if (!summary) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Overall Bus Fee & Salary Summary`, 14, 20);
    doc.setFontSize(12);
    doc.text(`For: ${new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}`, 14, 28);

    autoTable(doc, {
      startY: 40,
      head: [
        ["Total Buses", "Students with Bus", "Collected Fee", "Expected Income", "Collection Gap", "Total Salary", "Profit/Loss"]
      ],
      body: [
        [
          summary.totalBuses,
          summary.totalStudentsWithBus,
          `$${summary.totalBusFeeCollected}`,
          `$${summary.expectedBusIncome}`,
          `$${summary.busFeeCollectionGap}`,
          `$${summary.totalBusSalary}`,
          `$${summary.profitOrLoss}`
        ]
      ],
      styles: { cellPadding: 2, fontSize: 9, halign: 'center' },
      headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontStyle: 'bold' },
    });

    doc.save(`overall-summary-${new Date(year, month - 1).toLocaleString('default', { month: 'short', year: 'numeric' })}.pdf`);
  };

  const handleOverallSummaryPrint = () => {
    if (!summary) return;

    const htmlContent = `
      <html>
        <head>
          <title>Overall Bus Fee & Salary Summary</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; font-size: 14px; }
            h1 { text-align: center; margin-bottom: 25px; font-size: 22px; color: #333; }
            h2 { text-align: center; margin-bottom: 20px; font-size: 18px; color: #555; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .overall-summary-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                margin-bottom: 30px;
                text-align: center;
            }
            .overall-summary-card {
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 15px;
                background-color: #fff;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .overall-summary-card h4 { font-size: 13px; margin-bottom: 8px; color: #777; }
            .overall-summary-card p { font-size: 18px; font-weight: bold; color: #333; }
            .profit-loss-positive { color: green; }
            .profit-loss-negative { color: red; }
          </style>
        </head>
        <body>
          <h1>Overall Bus Fee & Salary Summary</h1>
          <h2>For: ${new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
          <div class="overall-summary-grid">
            <div class="overall-summary-card"><h4>Total Buses</h4><p>${summary.totalBuses}</p></div>
            <div class="overall-summary-card"><h4>Students With Bus</h4><p>${summary.totalStudentsWithBus}</p></div>
            <div class="overall-summary-card"><h4>Collected Bus Fee</h4><p>$${summary.totalBusFeeCollected}</p></div>
            <div class="overall-summary-card"><h4>Expected Bus Income</h4><p>$${summary.expectedBusIncome}</p></div>
            <div class="overall-summary-card"><h4>Collection Gap</h4><p>$${summary.busFeeCollectionGap}</p></div>
            <div class="overall-summary-card"><h4>Total Bus Salary</h4><p>$${summary.totalBusSalary}</p></div>
            <div class="overall-summary-card" style="grid-column: span 2 / auto;"><h4>Overall Profit/Loss</h4><p class="${summary.profitOrLoss >= 0 ? "profit-loss-positive" : "profit-loss-negative"}">$${summary.profitOrLoss}</p></div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    }
  };

  // --- PDF & Print for Individual Bus ---
  const handleBusPDF = (bus: BusSummary) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Bus Summary - ${bus.name} (${bus.route})`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Month: ${new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}`, 14, 28);

    autoTable(doc, {
      startY: 40,
      head: [["Driver", "Salary", "Expected", "Collected", "Profit/Loss", "Status"]],
      body: [[
        bus.driver?.name || 'N/A',
        `$${bus.driver?.salary || 0}`,
        `$${bus.expectedBusIncome}`,
        `$${bus.totalBusFeeCollected}`,
        `$${bus.profitOrLossAmount}`,
        bus.status,
      ]],
      styles: { cellPadding: 2, fontSize: 9, halign: 'center' },
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
      didDrawCell: (data) => {
        if (data.column.index === 5 && data.cell.text[0] === "Shortage") {
          doc.setTextColor(255, 255, 255);
          doc.setFillColor(220, 38, 38); // bg-red-600
        }
      },
    });

    if (bus.students && bus.students.length > 0) {
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 15,
        head: [["Student", "District", "Expected Fee", "Collected", "Unpaid"]],
        body: bus.students.map((student: Student) => [
          student.name,
          student.district,
          `$${student.expectedBusFee}`,
          `$${student.actualBusFeeCollected}`,
          `$${student.unpaidBusFee}`,
        ]),
        styles: { cellPadding: 2, fontSize: 8, halign: 'center' },
        headStyles: { fillColor: [250, 250, 250], textColor: [0, 0, 0], fontStyle: 'bold' },
      });
    } else {
        doc.setFontSize(10);
        doc.text("No students assigned to this bus.", 14, (doc as any).lastAutoTable.finalY + 25);
    }

    doc.save(`bus-summary-${bus.name.replace(/\s/g, '-')}.pdf`);
  };

  const handleBusPrint = (bus: BusSummary) => {
    const htmlContent = `
      <html>
        <head>
          <title>Bus Summary - ${bus.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; margin-bottom: 20px; font-size: 18px; }
            h3 { margin-top: 25px; margin-bottom: 10px; font-size: 16px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f0f0f0; }
            .shortage { background-color: #dc2626; color: white; font-weight: bold; text-align: center; }
            .profit-loss-positive { color: green; font-weight: bold; }
            .profit-loss-negative { color: red; font-weight: bold; }
            .text-center { text-align: center; }
          </style>
        </head>
        <body>
          <h2>Bus Summary - ${bus.name} (${bus.route})</h2>
          <p><strong>Month:</strong> ${new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
          <table>
            <thead>
              <tr>
                <th>Driver</th>
                <th>Salary</th>
                <th>Expected Income</th>
                <th>Collected Fee</th>
                <th>Profit/Loss</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${bus.driver?.name || 'N/A'}</td>
                <td>$${bus.driver?.salary || 0}</td>
                <td>$${bus.expectedBusIncome}</td>
                <td>$${bus.totalBusFeeCollected}</td>
                <td class="${bus.profitOrLossAmount >= 0 ? "profit-loss-positive" : "profit-loss-negative"}">$${bus.profitOrLossAmount}</td>
                <td class="${bus.status === "Shortage" ? "shortage" : ""}">${bus.status}</td>
              </tr>
            </tbody>
          </table>
          ${bus.students && bus.students.length > 0 ? `
            <h3>Students List</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>District</th>
                  <th>Expected Fee</th>
                  <th>Collected</th>
                  <th>Unpaid</th>
                </tr>
              </thead>
              <tbody>
                ${bus.students.map((student: Student) => `
                  <tr>
                    <td>${student.name}</td>
                    <td>${student.district}</td>
                    <td>$${student.expectedBusFee}</td>
                    <td>$${student.actualBusFeeCollected}</td>
                    <td>$${student.unpaidBusFee}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          ` : '<p style="text-align: center; margin-top: 20px; font-size: 12px;">No students assigned to this bus.</p>'}
          <script>window.print();</script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    }
  };

  useEffect(() => {
    dispatch(fetchBusSalaryAndFeeSummary({ month, year }));
  }, [dispatch, month, year]);

  const filteredBuses = summary?.busSummaries.filter((bus: BusSummary) =>
    bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.driver?.name.toLowerCase().includes(searchTerm.toLowerCase() || "")
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Bus Fee & Salary Summary</h1>

      {/* Date and Search Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end bg-white p-5 rounded-lg shadow-sm border border-gray-200">
        <div className="flex-1">
          <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">Month</label>
          <input
            id="month"
            type="number"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border border-gray-300 p-2 rounded-md w-full md:w-28 focus:ring-blue-500 focus:border-blue-500"
            min={1}
            max={12}
          />
        </div>

        <div className="flex-1">
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input
            id="year"
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border border-gray-300 p-2 rounded-md w-full md:w-36 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex-2 w-full md:w-auto">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Bus or Driver</label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type bus, route, or driver name"
          />
        </div>
      </div>

      {loading && <p className="text-center text-gray-600 mt-8">Loading summary...</p>}
      {error && <p className="text-center text-red-500 font-medium mt-8">Error: {error}</p>}

      {summary && (
        <>
          {/* Overall Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            <div className="bg-white shadow rounded p-4 border border-gray-200 col-span-1">
              <h4 className="text-sm font-semibold text-gray-600">Total Buses</h4>
              <p className="text-xl font-bold text-indigo-700">{summary.totalBuses}</p>
            </div>
            <div className="bg-white shadow rounded p-4 border border-gray-200 col-span-1">
              <h4 className="text-sm font-semibold text-gray-600">Students With Bus</h4>
              <p className="text-xl font-bold text-green-700">{summary.totalStudentsWithBus}</p>
            </div>
            <div className="bg-white shadow rounded p-4 border border-gray-200 col-span-1">
              <h4 className="text-sm font-semibold text-gray-600">Collected Fee</h4>
              <p className="text-xl font-bold text-blue-700">${summary.totalBusFeeCollected}</p>
            </div>
            <div className="bg-white shadow rounded p-4 border border-gray-200 col-span-1">
              <h4 className="text-sm font-semibold text-gray-600">Expected Income</h4>
              <p className="text-xl font-bold text-purple-700">${summary.expectedBusIncome}</p>
            </div>
            <div className="bg-white shadow rounded p-4 border border-gray-200 col-span-1">
              <h4 className="text-sm font-semibold text-gray-600">Collection Gap</h4>
              <p className="text-xl font-bold text-yellow-700">${summary.busFeeCollectionGap}</p>
            </div>
            <div className="bg-white shadow rounded p-4 border border-gray-200 col-span-1">
              <h4 className="text-sm font-semibold text-gray-600">Total Salary</h4>
              <p className="text-xl font-bold text-red-700">${summary.totalBusSalary}</p>
            </div>
            <div className="bg-white shadow rounded p-4 border border-gray-200 col-span-2 md:col-span-1">
              <h4 className="text-sm font-semibold text-gray-600">Profit/Loss</h4>
              <p className={`text-xl font-bold ${summary.profitOrLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${summary.profitOrLoss}
              </p>
            </div>
          </div>

          {/* Overall Summary PDF and Print Buttons (summary ONLY) */}
          <div className="flex justify-end gap-3 mb-6">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-md transition-colors duration-200 ease-in-out flex items-center"
              onClick={handleOverallSummaryPrint}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m0 0l-4 4m4-4l4 4m-4-4v-4m7 4V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8c0 1.1.9 2 2 2h2m4 0h6m-3-3v3m0 0H8m4 0H8m4 0h6"></path></svg>
              Print Overall Summary
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md transition-colors duration-200 ease-in-out flex items-center"
              onClick={handleOverallSummaryPDF}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Download Overall PDF
            </button>
          </div>

          {/* Toggle for ALL Bus sections */}
          <div className="flex justify-start mb-6">
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-4 py-2 rounded-md transition-colors duration-200 ease-in-out flex items-center"
              onClick={() => setShowAllBuses(!showAllBuses)}
            >
              {showAllBuses ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Hide All Buses
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Show All Buses
                </>
              )}
            </button>
          </div>

          {/* Individual Bus Summaries (conditionally rendered by showAllBuses) */}
          {showAllBuses && filteredBuses && filteredBuses.length > 0 ? (
            filteredBuses.map((bus: BusSummary) => (
              <div key={bus.busId} className="border shadow-sm rounded-lg p-4 mb-6 bg-white border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {bus.name} - {bus.route} ({bus.students.length} students)
                  </h3>
                  <div className="space-x-2 flex items-center">
                    {/* Individual Bus PDF/Print buttons */}
                    <button
                      className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-1 rounded transition-colors duration-200"
                      onClick={() => handleBusPrint(bus)}
                    >
                      Print Bus
                    </button>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded transition-colors duration-200"
                      onClick={() => handleBusPDF(bus)}
                    >
                      PDF Bus
                    </button>
                    {/* Individual Bus Student List Toggle */}
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded transition-colors duration-200"
                      onClick={() => setExpandedBusId(expandedBusId === bus.busId ? null : bus.busId)}
                    >
                      {expandedBusId === bus.busId ? "Hide Students" : "View Students"}
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 border text-left">Driver</th>
                        <th className="p-2 border text-left">Salary</th>
                        <th className="p-2 border text-left">Expected</th>
                        <th className="p-2 border text-left">Collected</th>
                        <th className="p-2 border text-left">Profit/Loss</th>
                        <th className="p-2 border text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border">{bus.driver?.name || 'N/A'}</td>
                        <td className="p-2 border">${bus.driver?.salary || 0}</td>
                        <td className="p-2 border">${bus.expectedBusIncome}</td>
                        <td className="p-2 border">${bus.totalBusFeeCollected}</td>
                        <td className={`p-2 border ${bus.profitOrLossAmount >= 0 ? "text-green-600" : "text-red-600"}`}>
                          ${bus.profitOrLossAmount}
                        </td>
                        <td
                          className={`p-2 border font-bold text-center ${
                            bus.status === "Shortage" ? "bg-red-600 text-white" : ""
                          }`}
                        >
                          {bus.status}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Students List (conditionally rendered by individual toggle) */}
                {expandedBusId === bus.busId && ( // Only individual toggle controls student list now
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold mb-2 text-gray-800">Students List</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-300 text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="p-2 border text-left">Name</th>
                            <th className="p-2 border text-left">District</th>
                            <th className="p-2 border text-left">Expected</th>
                            <th className="p-2 border text-left">Collected</th>
                            <th className="p-2 border text-left">Unpaid</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bus.students.length > 0 ? (
                            bus.students.map((student: Student) => (
                              <tr key={student.id}>
                                <td className="p-2 border">{student.name}</td>
                                <td className="p-2 border">{student.district}</td>
                                <td className="p-2 border">${student.expectedBusFee}</td>
                                <td className="p-2 border">${student.actualBusFeeCollected}</td>
                                <td className="p-2 border text-red-600">${student.unpaidBusFee}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="p-2 border text-center text-gray-500">
                                No students found for this bus.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            // This message appears if showAllBuses is true but filteredBuses is empty, OR if showAllBuses is false
            <p className="text-center text-gray-600 mt-8">
              {showAllBuses ? "No bus summaries available for the selected criteria." : "All bus details are currently hidden. Click 'Show All Buses' to view them."}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default BusFeeSummaryPage;