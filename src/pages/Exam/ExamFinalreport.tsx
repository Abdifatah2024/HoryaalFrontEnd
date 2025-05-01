import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { fetchExamReport } from "../../Redux/Exam/ExamFinalreportSlice";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { FiPrinter, FiDownload, FiSearch, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const CLASS_LIST = [
  { id: 1, name: "1A" }, { id: 2, name: "1B" }, { id: 3, name: "1C" },
  { id: 4, name: "1D" }, { id: 5, name: "1E" }, { id: 6, name: "1G" },
  { id: 7, name: "2A" }, { id: 8, name: "2B" }, { id: 9, name: "2C" },
  { id: 10, name: "2D" }, { id: 11, name: "2E" }, { id: 12, name: "2F" },
  { id: 13, name: "3A" }, { id: 14, name: "3B" }, { id: 15, name: "3C" },
  { id: 16, name: "3D" }, { id: 17, name: "3E" }, { id: 18, name: "4A" },
  { id: 19, name: "4B" }, { id: 20, name: "4C" }, { id: 21, name: "4D" },
] as const;

const ACADEMIC_YEAR = "2024 - 2025";
const MAX_MARKS = 1000;
const PASSING_MARKS = 500;

interface SortConfig {
  key: string;
  direction: 'ascending' | 'descending';
}

const ExamReportFinal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [classId, setClassId] = useState<number | "">("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [expandedStudent, setExpandedStudent] = useState<number | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const { loading, report, error } = useSelector(
    (state: RootState) => state.examReport
  );

  const selectedClass = CLASS_LIST.find((cls) => cls.id === Number(classId));
  const className = selectedClass ? selectedClass.name : "N/A";

  const processedReports = React.useMemo(() => {
    let filteredReports = [...report];
    
    if (searchTerm) {
      filteredReports = filteredReports.filter(student =>
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toString().includes(searchTerm)
      );
    }
    
    if (sortConfig !== null) {
      filteredReports.sort((a, b) => {
        if (sortConfig.key === 'fullName') {
          return sortConfig.direction === 'ascending' 
            ? a.fullName.localeCompare(b.fullName)
            : b.fullName.localeCompare(a.fullName);
        } else if (sortConfig.key === 'totalMarks') {
          return sortConfig.direction === 'ascending' 
            ? a.totalMarks - b.totalMarks
            : b.totalMarks - a.totalMarks;
        } else if (sortConfig.key === 'rank') {
          return sortConfig.direction === 'ascending' 
            ? a.rank - b.rank
            : b.rank - a.rank;
        }
        return 0;
      });
    }
    
    return filteredReports;
  }, [report, searchTerm, sortConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(classId) > 0) {
      dispatch(fetchExamReport({ classId: Number(classId) }));
    }
  };

  const calculatePercentage = (totalMarks: number) => {
    return ((totalMarks / MAX_MARKS) * 100).toFixed(2);
  };

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 5mm;
      }
      @media print {
        body {
          zoom: 90%;
          overflow: visible !important;
        }
        html, body {
          height: auto;
          overflow: visible !important;
        }
        .no-print {
          display: none !important;
        }
        .student-details {
          display: block !important;
        }
        table {
          width: 100% !important;
        }
      }
    `,
    documentTitle: `Exam Results - ${className}`,
  });

  const exportToPDF = () => {
    if (!report.length) {
      alert("No data to export");
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
    });

    const passedCount = report.filter((s) => s.totalMarks >= PASSING_MARKS).length;
    const failedCount = report.length - passedCount;

    doc.setFontSize(14);
    doc.text(`Class Examination Report - ${className}`, 105, 10, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Academic Year: ${ACADEMIC_YEAR} | Total Students: ${report.length}`, 105, 15, { align: 'center' });
    doc.text(`Passed: ${passedCount} | Failed: ${failedCount}`, 105, 20, { align: 'center' });

    const headers = [
      "ID",
      "Name",
      ...report[0].subjects.map((s) => s.subject),
      "Total",
      "%",
      "Rank",
      "Status",
    ];

    const data = report.map((student) => [
      student.studentId,
      student.fullName,
      ...student.subjects.map((s) => s.marks),
      student.totalMarks,
      calculatePercentage(student.totalMarks),
      student.rank,
      student.totalMarks >= PASSING_MARKS ? "Passed" : "Failed",
    ]);

    (doc as any).autoTable({
      head: [headers],
      body: data,
      startY: 25,
      margin: { top: 25 },
      styles: {
        fontSize: 7,
        cellPadding: 1,
        valign: "middle",
        halign: "center",
        overflow: "linebreak"
      },
      headStyles: {
        fillColor: [241, 245, 249],
        textColor: [55, 65, 81],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
      },
    });

    doc.save(`exam-results-${className}.pdf`);
  };

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return <FaSort className="ml-1 opacity-30" />;
    return sortConfig.direction === 'ascending' 
      ? <FaSortUp className="ml-1" /> 
      : <FaSortDown className="ml-1" />;
  };

  const toggleStudentDetails = (studentId: number) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  useEffect(() => {
    setExpandedStudent(null);
  }, [classId]);

  return (
    <div className="bg-gray-50 p-4 overflow-hidden" style={{ height: 'calc(100vh - 32px)' }}>
      <div className="max-w-full mx-auto h-full flex flex-col">
        <div className="mb-3 no-print">
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            Examination Results
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-3">
            <select
              value={classId}
              onChange={(e) => setClassId(Number(e.target.value))}
              className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            >
              <option value="">Select Class</option>
              {CLASS_LIST.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? "Loading..." : "Get Results"}
            </button>
          </form>

          {report.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400 text-sm" />
                </div>
                <input
                  type="text"
                  placeholder="Search students..."
                  className="pl-8 pr-3 py-1.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center gap-1 text-sm"
                >
                  <FiPrinter size={14} /> Print
                </button>
                <button
                  onClick={exportToPDF}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-1 text-sm"
                >
                  <FiDownload size={14} /> PDF
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-3 p-2 bg-red-100 text-red-700 rounded-md border border-red-200 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <div ref={reportRef} className="bg-white rounded-lg shadow-sm p-3 print:p-2 print:shadow-none flex-1 overflow-hidden flex flex-col">
            {!loading && report.length > 0 ? (
              <>
                <div className="mb-3 print:mb-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                    <h2 className="text-lg font-semibold text-gray-700">
                      Class: <span className="font-bold">{className}</span>
                    </h2>
                    <p className="text-xl text-gray-600 ">
                      Year: <span className="text-gray-800">{ACADEMIC_YEAR}</span>
                    </p>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="bg-gray-50 p-1 rounded">
                      <p className="text-gray-600 font-bold text-xl">Total Marks</p>
                      <p className="font-medium">{MAX_MARKS}</p>
                    </div>
                    <div className="bg-gray-50 p-1 rounded">
                      <p className="text-gray-600 font-bold text-xl">Total students</p>
                      <p className="font-medium">{report.length}</p>
                    </div>
                    <div className="bg-green-50 p-1 rounded">
                      <p className="text-green-600 font-bold text-xl">Passed</p>
                      <p className="font-semibold">
                        {report.filter((s) => s.totalMarks >= PASSING_MARKS).length}
                      </p>
                    </div>
                    <div className="bg-red-50 p-1 rounded">
                      <p className="text-red-600 font-bold text-xl">Failed</p>
                      <p className="font-semibold">
                        {report.filter((s) => s.totalMarks < PASSING_MARKS).length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th 
                          className="px-2 py-1.5 text-left font-bold text-gray-700 cursor-pointer"
                          onClick={() => requestSort('fullName')}
                        >
                          <div className="flex items-center">
                            Student
                            {getSortIcon('fullName')}
                          </div>
                        </th>
                        {report[0]?.subjects?.map((subject) => (
                          <th 
                            key={subject.subject} 
                            className="px-1 py-1.5 text-center font-bold text-gray-700"
                          >
                            {subject.subject}
                          </th>
                        ))}
                        <th 
                          className="px-1 py-1.5 text-center font-bold text-gray-700 cursor-pointer"
                          onClick={() => requestSort('totalMarks')}
                        >
                          <div className="flex items-center justify-center">
                            Total
                            {getSortIcon('totalMarks')}
                          </div>
                        </th>
                        <th className="px-1 py-1.5 text-center font-bold text-gray-700">%</th>
                        <th 
                          className="px-1 py-1.5 text-center font-bold text-gray-700 cursor-pointer"
                          onClick={() => requestSort('rank')}
                        >
                          <div className="flex items-center justify-center">
                            Rank
                            {getSortIcon('rank')}
                          </div>
                        </th>
                        <th className="px-1 py-1.5 text-center font-bold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {processedReports.map((student) => (
                        <React.Fragment key={student.studentId}>
                          <tr 
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => toggleStudentDetails(student.studentId)}
                          >
                            <td className="px-2 py-1.5 whitespace-nowrap">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{student.fullName}</div>
                                  <div className="text-xs text-gray-500">ID: {student.studentId}</div>
                                </div>
                                {expandedStudent === student.studentId ? (
                                  <FiChevronUp className="text-gray-400" />
                                ) : (
                                  <FiChevronDown className="text-gray-400" />
                                )}
                              </div>
                            </td>
                            {student.subjects.map((subject) => (
                              <td key={subject.subject} className="px-1 py-1.5 text-center">
                                {subject.marks}
                              </td>
                            ))}
                            <td className="px-1 py-1.5 text-center font-bold">
                              {student.totalMarks}
                            </td>
                            <td className="px-1 py-1.5 text-center font-bold text-blue-600">
                              {calculatePercentage(student.totalMarks)}
                            </td>
                            <td className="px-1 py-1.5 text-center font-bold">
                              {student.rank}
                            </td>
                            <td className="px-1 py-1.5 text-center">
                              {student.totalMarks >= PASSING_MARKS ? (
                                <span className="px-1 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                                  Passed
                                </span>
                              ) : (
                                <span className="px-1 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                                  Failed
                                </span>
                              )}
                            </td>
                          </tr>
                          {expandedStudent === student.studentId && (
                            <tr className="student-details hidden print:table-row bg-gray-50">
                              <td colSpan={report[0].subjects.length + 5} className="px-2 py-1.5">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                  {student.subjects.map((subject) => (
                                    <div key={subject.subject} className="bg-white p-1 rounded shadow-xs">
                                      <p className="font-medium">{subject.subject}</p>
                                      <p>Marks: {subject.marks}</p>
                                      <p>%: {((subject.marks / 100) * 100).toFixed(2)}</p>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : !loading && !error ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium">
                    {classId ? `No results for ${className}` : "Select a class"}
                  </h3>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamReportFinal;