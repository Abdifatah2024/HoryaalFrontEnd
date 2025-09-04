import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { fetchMidtermReport } from "../../Redux/Exam/ExamMidtermReportSlice";
import { fetchAllClasses } from "../../Redux/Auth/studentSlice"; // ✅ fetch classes from backend
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { FiPrinter, FiDownload } from "react-icons/fi";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useReactToPrint, UseReactToPrintOptions } from "react-to-print";

// Constants
const ACADEMIC_YEAR = "2024 - 2025";
const MAX_MARKS = 500;
const PASSING_MARKS = 250;

interface SortConfig {
  key: string;
  direction: "ascending" | "descending";
}

const ExamMidtermReport: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { report, loading, error } = useSelector(
    (state: RootState) => state.midtermReport
  );
  const { classes = [] } = useSelector((state: RootState) => state.classList); // ✅ classList slice
  const [classId, setClassId] = useState<number | "">("");
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const reportRef = useRef<HTMLDivElement>(null);

  // ✅ Fetch classes on mount
  useEffect(() => {
    dispatch(fetchAllClasses());
  }, [dispatch]);

  const selectedClass = classes.find((c) => c.id === Number(classId));
  const className = selectedClass?.name || "N/A";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (classId) {
      dispatch(fetchMidtermReport({ classId: Number(classId) }));
    }
  };

  const calculatePercentage = (total: number) =>
    ((total / MAX_MARKS) * 100).toFixed(2);

  const filteredReports = React.useMemo(() => {
    let data = [...report];
    if (searchTerm) {
      data = data.filter(
        (s) =>
          s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.studentId.toString().includes(searchTerm)
      );
    }

    if (sortConfig) {
      data.sort((a, b) => {
        if (sortConfig.key === "fullName") {
          return sortConfig.direction === "ascending"
            ? a.fullName.localeCompare(b.fullName)
            : b.fullName.localeCompare(a.fullName);
        } else if (sortConfig.key === "totalMarks") {
          return sortConfig.direction === "ascending"
            ? a.totalMarks - b.totalMarks
            : b.totalMarks - a.totalMarks;
        } else if (sortConfig.key === "rank") {
          return sortConfig.direction === "ascending"
            ? a.rank - b.rank
            : b.rank - a.rank;
        }
        return 0;
      });
    }

    return data;
  }, [report, sortConfig, searchTerm]);

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key)
      return <FaSort className="ml-1 opacity-40" />;
    return sortConfig.direction === "ascending" ? (
      <FaSortUp className="ml-1" />
    ) : (
      <FaSortDown className="ml-1" />
    );
  };

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: `Midterm Report - ${className}`,
  } as unknown as UseReactToPrintOptions);

  const exportToPDF = () => {
    if (!report.length) return;

    const doc = new jsPDF({ orientation: "landscape", unit: "mm" });

    const passed = report.filter((r) => r.totalMarks >= PASSING_MARKS).length;
    const failed = report.length - passed;

    doc.setFontSize(16);
    doc.text(`Midterm Examination Report`, 15, 15);
    doc.setFontSize(12);
    doc.text(`Class: ${className}`, 15, 23);
    doc.text(`Academic Year: ${ACADEMIC_YEAR}`, 15, 30);
    doc.text(`Total Students: ${report.length}`, 15, 37);
    doc.text(`Passed: ${passed} | Failed: ${failed}`, 15, 44);

    const headers = [
      "Student Name",
      ...(report[0]?.subjects?.map((s) => s.subject) || []),
      "Total",
      "Percentage",
      "Rank",
      "Status",
    ];

    const data = report.map((student) => [
      student.fullName,
      ...student.subjects.map((s) => s.marks),
      student.totalMarks,
      `${calculatePercentage(student.totalMarks)}%`,
      student.rank,
      student.totalMarks >= PASSING_MARKS ? "Passed" : "Failed",
    ]);

    (doc as any).autoTable({
      head: [headers],
      body: data,
      startY: 50,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
    });

    doc.save(`midterm-results-${className}.pdf`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Midterm Examination Results
      </h1>

      {/* ✅ Use dynamic classes */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <select
          value={classId}
          onChange={(e) => setClassId(Number(e.target.value))}
          className="border rounded px-3 py-1"
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          {loading ? "Loading..." : "Get Results"}
        </button>
      </form>

      {report.length > 0 && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search students..."
            className="border rounded px-3 py-1 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handlePrint}
            className="bg-gray-700 text-white px-3 py-1 rounded flex items-center gap-1"
          >
            <FiPrinter /> Print
          </button>
          <button
            onClick={exportToPDF}
            className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
          >
            <FiDownload /> PDF
          </button>
        </div>
      )}

      <div ref={reportRef}>
        {error && <p className="text-red-600">{error}</p>}

        {!loading && filteredReports.length > 0 && (
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th
                  className="text-left px-2 py-2 cursor-pointer"
                  onClick={() => requestSort("fullName")}
                >
                  <div className="flex items-center">
                    Student Name {getSortIcon("fullName")}
                  </div>
                </th>
                {report[0].subjects.map((s) => (
                  <th key={s.subject} className="text-center px-2 py-2">
                    {s.subject}
                  </th>
                ))}
                <th
                  className="text-center px-2 py-2 cursor-pointer"
                  onClick={() => requestSort("totalMarks")}
                >
                  <div className="flex items-center justify-center">
                    Total {getSortIcon("totalMarks")}
                  </div>
                </th>
                <th className="text-center px-2 py-2">%</th>
                <th
                  className="text-center px-2 py-2 cursor-pointer"
                  onClick={() => requestSort("rank")}
                >
                  <div className="flex items-center justify-center">
                    Rank {getSortIcon("rank")}
                  </div>
                </th>
                <th className="text-center px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((student) => (
                <tr key={student.studentId} className="border-t">
                  <td className="px-2 py-1">{student.fullName}</td>
                  {student.subjects.map((s) => (
                    <td key={s.subject} className="text-center px-2 py-1">
                      {s.marks}
                    </td>
                  ))}
                  <td className="text-center px-2 py-1 font-bold">
                    {student.totalMarks}
                  </td>
                  <td className="text-center px-2 py-1">
                    {calculatePercentage(student.totalMarks)}%
                  </td>
                  <td className="text-center px-2 py-1">{student.rank}</td>
                  <td className="text-center px-2 py-1">
                    {student.totalMarks >= PASSING_MARKS ? (
                      <span className="text-green-600 font-medium">
                        Passed
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        Failed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExamMidtermReport;
