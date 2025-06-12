import React, { useEffect, useRef } from "react"; // useRef for PDF export
import {
  FiBell,
  FiUser,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiAlertTriangle,
  FiDollarSign,
  FiMinusCircle,
  FiBarChart2,
  FiBook,
  FiPrinter, // New icon for print
  FiDownload, // New icon for download/PDF
} from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  fetchMyStudents,
  fetchStudentAttendance,
  fetchStudentDiscipline,
  fetchStudentBalance,
  fetchStudentExamResults,
} from "../../Redux/Parent/ParentstudentSlice";
import html2canvas from 'html2canvas'; // For capturing HTML as an image
import jsPDF from 'jspdf'; // For generating PDF

const ParentDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    students,
    loading,
    error,
    attendanceLoading,
    attendanceError,
    disciplineLoading,
    disciplineError,
    balanceLoading,
    balanceError,
    examLoading,
    examError,
  } = useAppSelector((state) => state.students);

  // Ref for the exam results section to be printed/exported
  const examSummaryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    dispatch(fetchMyStudents());
    dispatch(fetchStudentAttendance());
    dispatch(fetchStudentDiscipline());
    dispatch(fetchStudentBalance());
    dispatch(fetchStudentExamResults());
  }, [dispatch]);

  const isLoading =
    loading ||
    attendanceLoading ||
    disciplineLoading ||
    balanceLoading ||
    examLoading;
  const hasError =
    error ||
    attendanceError ||
    disciplineError ||
    balanceError ||
    examError;

  // Define max marks for each exam component per subject
  const MAX_MONTHLY_PER_SUBJECT = 20;
  const MAX_MIDTERM_PER_SUBJECT = 30;
  const MAX_FINAL_PER_SUBJECT = 50;
  const MAX_TOTAL_PER_SUBJECT = MAX_MONTHLY_PER_SUBJECT + MAX_MIDTERM_PER_SUBJECT + MAX_FINAL_PER_SUBJECT; // 100

  // Calculate total balance across all students
  const totalBalance = students.reduce(
    (acc, curr) => acc + (curr.balance ?? 0),
    0
  );

  // Format currency with USD
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate exam totals for each student
  const studentsWithExamTotals = students.map(student => {
    if (!student.examResults) return student;

    const examSummary = student.examResults.reduce((acc, exam) => {
      // Ensure exam totalMarks are correctly calculated based on components, if not already
      const currentTotalMarks = (exam.monthly || 0) + (exam.midterm || 0) + (exam.final || 0);

      return {
        totalMarks: acc.totalMarks + currentTotalMarks,
        count: acc.count + 1,
        totalMonthly: acc.totalMonthly + (exam.monthly || 0),
        totalMidterm: acc.totalMidterm + (exam.midterm || 0),
        totalFinal: acc.totalFinal + (exam.final || 0),
      };
    }, { totalMarks: 0, count: 0, totalMonthly: 0, totalMidterm: 0, totalFinal: 0 });

    const numberOfSubjects = student.examResults.length;
    const totalPossibleMonthly = numberOfSubjects * MAX_MONTHLY_PER_SUBJECT;
    const totalPossibleMidterm = numberOfSubjects * MAX_MIDTERM_PER_SUBJECT;
    const totalPossibleFinal = numberOfSubjects * MAX_FINAL_PER_SUBJECT;
    const totalPossibleOverall = numberOfSubjects * MAX_TOTAL_PER_SUBJECT; // This will be 1000 if 10 subjects

    return {
      ...student,
      examAverage: examSummary.count > 0
        ? (examSummary.totalMarks / (examSummary.count * MAX_TOTAL_PER_SUBJECT) * 100).toFixed(2) // Average percentage based on actual possible marks
        : null,
      examTotals: {
        achievedMonthly: examSummary.totalMonthly,
        possibleMonthly: totalPossibleMonthly,
        achievedMidterm: examSummary.totalMidterm,
        possibleMidterm: totalPossibleMidterm,
        achievedFinal: examSummary.totalFinal,
        possibleFinal: totalPossibleFinal,
        achievedOverall: examSummary.totalMarks,
        possibleOverall: totalPossibleOverall,
      }
    };
  });

  // Calculate OVERALL average performance across ALL students
  // This average is based on the average of each student's exam average
  const overallExamAverage = studentsWithExamTotals.length > 0 && studentsWithExamTotals.some(s => s.examAverage)
    ? (
        studentsWithExamTotals
          .filter(s => s.examAverage)
          .reduce((sum, s) => sum + parseFloat(s.examAverage!), 0) /
        studentsWithExamTotals.filter(s => s.examAverage).length
      ).toFixed(2)
    : null;

  // --- Print and PDF Export Handlers ---
  const handlePrint = (studentId: string) => {
    const content = examSummaryRefs.current[studentId];
    if (content) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Exam Summary</title>');
        // Inject basic Tailwind CSS or custom print styles if needed
        printWindow.document.write('<style>');
        printWindow.document.write(`
          body { font-family: sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
          th { background-color: #f1f5f9; font-weight: bold; }
          .no-print { display: none; } /* Hide elements not meant for print */
          .bg-indigo-50 { background-color: #eef2ff !important; }
          .text-indigo-800 { color: #3730a3 !important; }
          .bg-indigo-100 { background-color: #e0e7ff !important; }
          .font-bold { font-weight: 700; }
          .text-center { text-align: center; }
          .text-sm { font-size: 0.875rem; }
          .px-4 { padding-left: 1rem; padding-right: 1rem; }
          .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
        `);
        printWindow.document.write('</style></head><body>');
        printWindow.document.write('<h1>Exam Summary for ' + students.find(s => s.id === studentId)?.fullname + '</h1>');
        printWindow.document.write(content.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleDownloadPdf = async (studentId: number) => {
    const content = examSummaryRefs.current[studentId];
    const studentName = students.find(s => s.id === studentId)?.fullname || 'Student';

    if (content) {
      // Temporarily remove print-only class if any, to ensure content is visible
      const tempContent = content.cloneNode(true) as HTMLDivElement;
      const noPrintElements = tempContent.querySelectorAll('.no-print');
      noPrintElements.forEach(el => (el as HTMLElement).style.display = 'none');

      const canvas = await html2canvas(tempContent, { scale: 2 }); // Increase scale for better resolution
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' for portrait, 'mm' for millimeters, 'a4' for A4 size
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`${studentName}_Exam_Summary.pdf`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col font-sans">
      <div className="flex-1 p-6 sm:p-10">
        {/* Dashboard Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">Parent Dashboard</h1>
            <p className="text-gray-600 mt-2 text-lg">Welcome back! Here's an overview of your children's progress.</p>
          </div>
          <div className="flex gap-4 items-center mt-6 sm:mt-0">
            <button
              className="relative p-3 bg-indigo-50 rounded-full shadow-sm hover:bg-indigo-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label="Notifications"
            >
              <FiBell className="text-indigo-700 text-xl" />
              <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </button>
            <div className="flex items-center gap-3 bg-indigo-700 text-white px-5 py-2.5 rounded-full shadow-lg">
              <div className="bg-indigo-600 p-2 rounded-full">
                <FiUser className="text-white text-lg" />
              </div>
              <span className="font-semibold text-lg">Parent</span>
            </div>
          </div>
        </header>

        {/* Summary Cards Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {/* Total Balance Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-green-100 rounded-full">
                <FiDollarSign className="text-green-600 text-2xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Total Balance</h2>
            </div>
            <p className={`text-4xl font-bold ${
              totalBalance > 0 ? "text-red-600" : "text-green-600"
            }`}>
              {formatCurrency(totalBalance)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {totalBalance > 0 ? "Outstanding payment due" : "All accounts are current"}
            </p>
          </div>

          {/* Total Students Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <FiUser className="text-blue-600 text-2xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">My Children</h2>
            </div>
            <p className="text-4xl font-bold text-gray-800">
              {students.length}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {students.length === 1 ? "1 child enrolled" : `${students.length} children enrolled`}
            </p>
          </div>

          {/* Overall Exam Summary Card (Narrow) */}
          {overallExamAverage && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform hover:scale-105 transition-transform duration-300 ease-in-out">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-purple-100 rounded-full">
                  <FiBarChart2 className="text-purple-600 text-2xl" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Avg. Exams</h2>
              </div>
              <p className="text-4xl font-bold text-gray-800">
                {overallExamAverage}%
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Overall across all students
              </p>
            </div>
          )}
        </section>

        {/* Error State */}
        {hasError && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-md mb-8 shadow-sm" role="alert">
            <div className="flex items-center">
              <FiAlertTriangle className="text-red-600 mr-3 text-xl" />
              <p className="text-red-800 font-medium">
                Error: {error || attendanceError || disciplineError || balanceError || examError}. Please try again later.
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            <p className="ml-4 text-lg text-gray-600">Loading data...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && students.length === 0 && !hasError && (
          <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <FiInfo className="mx-auto text-6xl text-gray-300 mb-5" />
            <p className="text-xl text-gray-600 font-medium">No students registered yet.</p>
            <p className="text-md text-gray-500 mt-2">Please contact the school administration to register your children.</p>
          </div>
        )}

        {/* Student Cards */}
        {!isLoading && studentsWithExamTotals.map((student) => (
          <section key={student.id} className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8 border border-gray-100">
            {/* Student Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-5 mb-6 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                  <FiUser className="text-indigo-600 mr-3 text-2xl" /> {student.fullname}
                </h2>
                <p className="text-md text-gray-600 mt-1">
                  <span className="font-semibold">{student.classes?.name || "Unassigned class"}</span> • {student.gender}, Age {student.Age}
                </p>
              </div>
            </header>

            {/* Student Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Attendance Section */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-md">
                <h3 className="flex items-center gap-3 text-lg font-bold text-indigo-700 mb-4">
                  <FiClock className="text-indigo-500 text-xl" /> Attendance
                </h3>
                <div className="text-md text-gray-700 mb-3 flex items-center">
                  <FiMinusCircle className="inline-block text-yellow-500 mr-2 text-lg" />
                  Total Absent:{" "}
                  <span className="font-extrabold text-red-600 ml-1">
                    {student.totalAbsent ?? 0}
                  </span>
                </div>
                {student.attendance?.length ? (
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                          <th className="px-4 py-3 text-left tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {student.attendance.slice(0, 5).map((a) => (
                          <tr key={a.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              {new Date(a.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                  a.present
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {a.present ? (
                                  <>
                                    <FiCheckCircle className="mr-1" /> Present
                                  </>
                                ) : (
                                  <>
                                    <FiXCircle className="mr-1" /> Absent {a.remark ? ` (${a.remark})` : ""}
                                  </>
                                )}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">No recent attendance data.</p>
                )}
              </div>

              {/* Discipline Section */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-md">
                <h3 className="flex items-center gap-3 text-lg font-bold text-red-700 mb-4">
                  <FiAlertTriangle className="text-red-500 text-xl" /> Discipline
                </h3>
                {student.discipline?.length ? (
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                          <th className="px-4 py-3 text-left tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left tracking-wider">Type</th>
                          <th className="px-4 py-3 text-left tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {student.discipline.slice(0, 5).map((d) => (
                          <tr key={d.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              {new Date(d.recordedAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-800">{d.type}</td>
                            <td className="px-4 py-3 text-gray-800">{d.actionTaken}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">No discipline records found.</p>
                )}
              </div>

              {/* Financial Section */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-md">
                <h3 className="flex items-center gap-3 text-lg font-bold text-green-700 mb-4">
                  <FiDollarSign className="text-green-500 text-xl" /> Financial Summary
                </h3>
                <div className="space-y-3 text-md text-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Monthly Fee:</span>
                    <span>{formatCurrency(student.monthlyFee)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Months:</span>
                    <span>{student.totalMonths ?? "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Paid:</span>
                    <span className="text-green-700 font-semibold">
                      {formatCurrency(student.totalPaid)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Fees:</span>
                    <span className="text-blue-700 font-semibold">
                      {formatCurrency(student.totalFees)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-3">
                    <span className="text-lg text-gray-800 font-bold">Balance Due:</span>
                    <span
                      className={`text-lg font-extrabold ${
                        student.balance && student.balance > 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {formatCurrency(student.balance)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exam Results Section - Pivoted with Totals and Export Options */}
            <div className="mt-8 bg-white p-5 rounded-xl border border-gray-200 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="flex items-center gap-3 text-lg font-bold text-blue-700">
                  <FiBook className="text-blue-500 text-xl" /> Exam Results
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePrint(student.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                  >
                    <FiPrinter /> Print
                  </button>
                  <button
                    onClick={() => handleDownloadPdf(student.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <FiDownload /> Export PDF
                  </button>
                </div>
              </div>

              {student.examResults?.length ? (
                // Wrap the content to be printed/exported in a ref
                <div ref={(el) => (examSummaryRefs.current[student.id] = el)} className="exam-summary-printable">
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                          <th className="px-4 py-3 text-left tracking-wider">Exam Type</th>
                          {/* Dynamically generate subject headers */}
                          {[...new Set(student.examResults.map(e => e.subject))].map((subject, sIdx) => (
                            <th key={sIdx} className="px-4 py-3 text-center tracking-wider">{subject}</th>
                          ))}
                          <th className="px-4 py-3 text-center tracking-wider bg-gray-200 text-gray-800">Total Achieved</th>
                          <th className="px-4 py-3 text-center tracking-wider bg-gray-200 text-gray-800">Total Possible</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-200">
                        {/* Monthly Scores Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-800 font-medium">Monthly</td>
                          {[...new Set(student.examResults.map(e => e.subject))].map((subject, sIdx) => {
                            const exam = student.examResults.find(e => e.subject === subject);
                            return (
                              <td key={sIdx} className="px-4 py-3 text-center">
                                {exam?.monthly ?? "-"}
                              </td>
                            );
                          })}
                          <td className="px-4 py-3 text-center font-bold bg-gray-100 text-gray-700">
                            {student.examTotals?.achievedMonthly ?? "-"}
                          </td>
                          <td className="px-4 py-3 text-center font-bold bg-gray-100 text-gray-700">
                            {student.examTotals?.possibleMonthly ?? "-"}
                          </td>
                        </tr>
                        {/* Midterm Scores Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-800 font-medium">Midterm</td>
                          {[...new Set(student.examResults.map(e => e.subject))].map((subject, sIdx) => {
                            const exam = student.examResults.find(e => e.subject === subject);
                            return (
                              <td key={sIdx} className="px-4 py-3 text-center">
                                {exam?.midterm ?? "-"}
                              </td>
                            );
                          })}
                          <td className="px-4 py-3 text-center font-bold bg-gray-100 text-gray-700">
                            {student.examTotals?.achievedMidterm ?? "-"}
                          </td>
                          <td className="px-4 py-3 text-center font-bold bg-gray-100 text-gray-700">
                            {student.examTotals?.possibleMidterm ?? "-"}
                          </td>
                        </tr>
                        {/* Final Scores Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-800 font-medium">Final</td>
                          {[...new Set(student.examResults.map(e => e.subject))].map((subject, sIdx) => {
                            const exam = student.examResults.find(e => e.subject === subject);
                            return (
                              <td key={sIdx} className="px-4 py-3 text-center">
                                {exam?.final ?? "-"}
                              </td>
                            );
                          })}
                          <td className="px-4 py-3 text-center font-bold bg-gray-100 text-gray-700">
                            {student.examTotals?.achievedFinal ?? "-"}
                          </td>
                          <td className="px-4 py-3 text-center font-bold bg-gray-100 text-gray-700">
                            {student.examTotals?.possibleFinal ?? "-"}
                          </td>
                        </tr>
                        {/* Total Marks Row (per subject) */}
                        <tr className="hover:bg-gray-50 font-bold bg-indigo-50 text-indigo-800">
                          <td className="px-4 py-3">Total Marks</td>
                          {[...new Set(student.examResults.map(e => e.subject))].map((subject, sIdx) => {
                            const exam = student.examResults.find(e => e.subject === subject);
                            return (
                              <td key={sIdx} className="px-4 py-3 text-center">
                                {exam?.totalMarks ?? "-"}
                              </td>
                            );
                          })}
                          <td className="px-4 py-3 text-center font-bold bg-indigo-100">
                            {student.examTotals?.achievedOverall ?? "-"}
                          </td>
                          <td className="px-4 py-3 text-center font-bold bg-indigo-100">
                            {student.examTotals?.possibleOverall ?? "-"}
                          </td>
                        </tr>
                        {/* Grade Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-800 font-medium">Grade</td>
                          {[...new Set(student.examResults.map(e => e.subject))].map((subject, sIdx) => {
                            const exam = student.examResults.find(e => e.subject === subject);
                            const grade = exam?.totalMarks !== undefined ?
                                        (exam.totalMarks >= 90 ? 'A' :
                                        exam.totalMarks >= 80 ? 'B' :
                                        exam.totalMarks >= 70 ? 'C' :
                                        exam.totalMarks >= 60 ? 'D' : 'F') : 'N/A'; // Changed to 'N/A'
                            return (
                              <td key={sIdx} className="px-4 py-3 text-center">
                                <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-md font-semibold
                                  ${
                                    grade === 'A' ? 'bg-green-100 text-green-800' :
                                    grade === 'B' ? 'bg-blue-100 text-blue-800' :
                                    grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                                    grade === 'D' ? 'bg-orange-100 text-orange-800' :
                                    grade === 'F' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-600' // Style for N/A
                                  }`}
                                >
                                  {grade}
                                </span>
                              </td>
                            );
                          })}
                          <td className="px-4 py-3 text-center font-bold bg-gray-100 text-gray-700">
                            {student.examAverage ? `${student.examAverage}%` : 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-center font-bold bg-gray-100 text-gray-700">
                            {/* Overall letter grade based on examAverage */}
                            <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-md font-semibold
                              ${
                                student.examAverage && parseFloat(student.examAverage) >= 90 ? 'bg-green-100 text-green-800' :
                                student.examAverage && parseFloat(student.examAverage) >= 80 ? 'bg-blue-100 text-blue-800' :
                                student.examAverage && parseFloat(student.examAverage) >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                student.examAverage && parseFloat(student.examAverage) >= 60 ? 'bg-orange-100 text-orange-800' :
                                student.examAverage ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-600' // Style for N/A
                              }`}
                            >
                              {student.examAverage ? (
                                parseFloat(student.examAverage) >= 90 ? 'A' :
                                parseFloat(student.examAverage) >= 80 ? 'B' :
                                parseFloat(student.examAverage) >= 70 ? 'C' :
                                parseFloat(student.examAverage) >= 60 ? 'D' : 'F'
                              ) : 'N/A'}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">No exam results available for this student.</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default ParentDashboard;