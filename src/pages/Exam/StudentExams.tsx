// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../Redux/store";
// import {
//   fetchStudentExams,
//   clearStudentExams,
// } from "../../Redux/Exam/studentExamsSlice";

// const StudentExams = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { student, exams, academicYear } = useSelector((state: RootState) => state.studentExams);
//   const [studentIdInput, setStudentIdInput] = useState("");
//   const [academicYearId, setAcademicYearId] = useState("");

//   const handleSearch = () => {
//     if (!studentIdInput || !academicYearId) return;
//     dispatch(clearStudentExams());
//     dispatch(fetchStudentExams({ studentId: Number(studentIdInput), academicYearId: Number(academicYearId) }));
//   };

//   const monthlyTotal = exams.find(e => e.examName === 'Monthly')?.subjectScores.reduce((sum, s) => sum + s.marks, 0) || 0;
//   const midtermTotal = exams.find(e => e.examName === 'Midterm')?.subjectScores.reduce((sum, s) => sum + s.marks, 0) || 0;
//   const finalTotal = exams.find(e => e.examName === 'Final')?.subjectScores.reduce((sum, s) => sum + s.marks, 0) || 0;
//   const combinedTotal = monthlyTotal + midtermTotal + finalTotal;
//   const maxPossible = exams[0]?.subjectScores.length * 100 || 500;
//   const percentage = ((combinedTotal / maxPossible) * 100).toFixed(1);

//   const subjectPerformance = exams[0]?.subjectScores.map(subject => {
//     const monthly = exams.find(e => e.examName === 'Monthly')?.subjectScores.find(s => s.subjectName === subject.subjectName)?.marks || 0;
//     const midterm = exams.find(e => e.examName === 'Midterm')?.subjectScores.find(s => s.subjectName === subject.subjectName)?.marks || 0;
//     const final = exams.find(e => e.examName === 'Final')?.subjectScores.find(s => s.subjectName === subject.subjectName)?.marks || 0;
//     const total = monthly + midterm + final;

//     const grade =
//       total >= 90 ? 'A+' :
//       total >= 80 ? 'A' :
//       total >= 70 ? 'B+' :
//       total >= 60 ? 'B' :
//       total >= 50 ? 'C+' :
//       total >= 40 ? 'C' : 'D';

//     return {
//       subjectName: subject.subjectName,
//       monthly,
//       midterm,
//       final,
//       total,
//       grade,
//       performance: total < 50 ? 'weak' : total >= 70 ? 'strong' : 'average'
//     };
//   }) || [];

//   const weakSubjects = subjectPerformance.filter(subject => subject.performance === 'weak');
//   const strongSubjects = subjectPerformance.filter(subject => subject.performance === 'strong');

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//       {/* Inputs */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <input
//           type="number"
//           placeholder="Enter Student ID"
//           value={studentIdInput}
//           onChange={(e) => setStudentIdInput(e.target.value)}
//           className="p-2 border-b-2 focus:outline-none focus:border-blue-600"
//         />
//         <select
//           value={academicYearId}
//           onChange={(e) => setAcademicYearId(e.target.value)}
//           className="p-2 border-b-2 focus:outline-none focus:border-blue-600"
//         >
//           <option value="">Select Academic Year</option>
//           <option value="1">2024-2025</option>
//           <option value="2">2025-2026</option>
//           <option value="3">2026-2027</option>
//         </select>
//       </div>

//       <button
//         onClick={handleSearch}
//         className="px-6 py-2 mb-8 bg-blue-600 text-white rounded hover:bg-blue-700"
//       >
//         Generate Report
//       </button>

//       {student && (
//         <div className="space-y-8">
//           <div className="text-center border-b-2 pb-4">
//             <h1 className="text-3xl font-serif font-bold text-gray-800">
//               AL-IRSHAAD SECONDARY SCHOOL
//             </h1>
//             <p className="text-gray-600">Official Academic Transcript</p>
//             <div className="grid grid-cols-2 gap-4 mt-4 text-left text-sm">
//               <div>
//                 <p className="font-semibold">Student Name: <span className="font-semibold">{student.fullName}</span></p>
//                 <p className="font-semibold">Class: <span className="font-normal">{student.class}</span></p>
//               </div>
//               <div>
//                 <p className="font-semibold">Academic Year: <span className="font-normal">{academicYear || "N/A"}</span></p>
//                 <p className="font-semibold">Student ID: <span className="font-normal">{student.id}</span></p>
//               </div>
//             </div>
//           </div>

//           {/* Exam Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="p-3 text-left border">Subject</th>
//                   <th className="p-3 text-center border">Monthly</th>
//                   <th className="p-3 text-center border">Midterm</th>
//                   <th className="p-3 text-center border">Final</th>
//                   <th className="p-3 text-center border">Total</th>
//                   <th className="p-3 text-center border">Grade</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {subjectPerformance.map((subject) => (
//                   <tr key={subject.subjectName} className="border-t">
//                     <td className="p-3 border">{subject.subjectName}</td>
//                     <td className="p-3 text-center border">{subject.monthly}</td>
//                     <td className="p-3 text-center border">{subject.midterm}</td>
//                     <td className="p-3 text-center border">{subject.final}</td>
//                     <td className="p-3 text-center border font-semibold">{subject.total}</td>
//                     <td className="p-3 text-center border">
//                       <span className={`px-2 py-1 rounded ${
//                         subject.grade === 'A+' ? 'bg-green-100 text-green-800' :
//                         subject.grade.startsWith('A') ? 'bg-blue-100 text-blue-800' :
//                         subject.grade.startsWith('B') ? 'bg-yellow-100 text-yellow-800' :
//                         'bg-red-100 text-red-800'
//                       }`}>
//                         {subject.grade}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Summary */}
//           <div className="border p-4 rounded-lg">
//             <h3 className="text-lg font-semibold mb-4 text-center">Overall Performance Summary</h3>
//             <div className="flex justify-between mb-4">
//               <span>Total Marks Obtained:</span>
//               <span className="font-semibold">{combinedTotal}/{maxPossible}</span>
//             </div>
//             <div className="flex justify-between mb-4">
//               <span>Percentage:</span>
//               <span className="font-semibold">{percentage}%</span>
//             </div>
//             <div className="flex justify-between">
//               <span>School Position:</span>
//               <span className="font-semibold">15/180</span>
//             </div>
//           </div>

//           {/* Performance Highlights */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="border p-4 rounded-lg">
//               <h3 className="text-lg font-semibold mb-3 text-red-600">Subjects Needing Improvement</h3>
//               {weakSubjects.length > 0 ? (
//                 <ul className="space-y-2">
//                   {weakSubjects.map(subject => (
//                     <li key={subject.subjectName} className="flex justify-between items-center p-2 bg-red-50 rounded">
//                       <span className="font-medium">{subject.subjectName}</span>
//                       <span className="font-semibold text-red-600">{subject.total}/100</span>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <div className="text-center py-4 text-gray-500 bg-gray-50 rounded">
//                   No subjects below 50 marks
//                 </div>
//               )}
//             </div>
//             <div className="border p-4 rounded-lg">
//               <h3 className="text-lg font-semibold mb-3 text-green-600">Strong Subjects</h3>
//               {strongSubjects.length > 0 ? (
//                 <ul className="space-y-2">
//                   {strongSubjects.map(subject => (
//                     <li key={subject.subjectName} className="flex justify-between items-center p-2 bg-green-50 rounded">
//                       <span className="font-medium">{subject.subjectName}</span>
//                       <span className="font-semibold text-green-600">{subject.total}/100</span>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <div className="text-center py-4 text-gray-500 bg-gray-50 rounded">
//                   No subjects above 70 marks
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentExams;
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// Assuming these paths are correct for your Redux setup
import { AppDispatch, RootState } from "../../Redux/store";
import {
  fetchStudentExams,
  clearStudentExams,
} from "../../Redux/Exam/studentExamsSlice";
import logo from '../../assets/logo.png'; // Adjust path as needed


const StudentExams = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { student, exams, academicYear } = useSelector((state: RootState) => state.studentExams);
  const [studentIdInput, setStudentIdInput] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");

  const handleSearch = () => {
    if (!studentIdInput || !academicYearId) return;
    dispatch(clearStudentExams());
    dispatch(fetchStudentExams({ studentId: Number(studentIdInput), academicYearId: Number(academicYearId) }));
  };

  const handlePrint = () => {
    window.print();
  };

  // --- Calculations for Report Data (as per previous versions) ---
  const monthlyTotal = exams.find(e => e.examName === 'Monthly')?.subjectScores.reduce((sum, s) => sum + s.marks, 0) || 0;
  const midtermTotal = exams.find(e => e.examName === 'Midterm')?.subjectScores.reduce((sum, s) => sum + s.marks, 0) || 0;
  const finalTotal = exams.find(e => e.examName === 'Final')?.subjectScores.reduce((sum, s) => sum + s.marks, 0) || 0;
  const combinedTotal = monthlyTotal + midtermTotal + finalTotal;
  const maxPossible = exams[0]?.subjectScores.length * 100 || 500; // Assuming 100 marks per subject
  const percentage = maxPossible > 0 ? ((combinedTotal / maxPossible) * 100).toFixed(1) : '0.0';

  const subjectPerformance = exams[0]?.subjectScores.map(subject => {
    const monthly = exams.find(e => e.examName === 'Monthly')?.subjectScores.find(s => s.subjectName === subject.subjectName)?.marks || 0;
    const midterm = exams.find(e => e.examName === 'Midterm')?.subjectScores.find(s => s.subjectName === subject.subjectName)?.marks || 0;
    const final = exams.find(e => e.examName === 'Final')?.subjectScores.find(s => s.subjectName === subject.subjectName)?.marks || 0;
    const total = monthly + midterm + final;

    const grade =
      total >= 90 ? 'A+' :
      total >= 80 ? 'A' :
      total >= 70 ? 'B+' :
      total >= 60 ? 'B' :
      total >= 50 ? 'C+' :
      total >= 40 ? 'C' : 'D';

    return {
      subjectName: subject.subjectName,
      monthly,
      midterm,
      final,
      total,
      grade,
      performance: total < 50 ? 'weak' : total >= 70 ? 'strong' : 'average' // 'performance' property kept for completeness but not displayed
    };
  }) || [];
  // --- End Calculations ---

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      {/*
        This style block is crucial for print functionality.
        In a real application, you might put this into a global CSS file
        or a dedicated print.css for better organization.
      */}
      <style jsx>{`
        @media print {
          /* Hide everything not part of the certificate */
          body > * {
            display: none !important;
          }

          /* Display only the certificate container */
          #printable-certificate {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            margin: 0 auto !important; /* Center the certificate on the page */
            width: 210mm !important;   /* A4 width */
            min-height: 297mm !important; /* A4 height */
            box-shadow: none !important; /* Remove shadow for print */
            border: none !important;     /* Remove visible border for print (if desired, otherwise keep it) */
            padding: 10mm !important;    /* Adjust padding for print to fit A4 */
            background-color: white !important; /* Ensure white background */
            overflow: hidden !important; /* Prevent scrollbars */
            transform: scale(1) !important; /* Ensure no scaling issues */
          }

          /* Re-apply the specific double border if you want it on print */
          #printable-certificate {
             border: 8px double #1E3A8A !important; /* Keep the desired border */
             border-radius: 0 !important; /* Remove screen border radius for print */
          }

          /* Hide decorative corners on print for a cleaner look */
          #printable-certificate > div[class*="absolute top-0"] {
            display: none !important;
          }
          #printable-certificate > div[class*="absolute bottom-0"] {
            display: none !important;
          }

          /* Ensure content within certificate scales correctly */
          #printable-certificate * {
            zoom: 1 !important; /* Helps with scaling in some browsers */
            -webkit-print-color-adjust: exact; /* For background colors/images */
            color-adjust: exact;
          }

          /* Hide the print button itself when printing */
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>

      {/* Search and Input Section (Visible only when no student report is loaded) */}
      {!student && (
        <div className="max-w-sm w-full bg-white shadow-xl rounded-lg p-6 mr-8 border border-gray-200 print:hidden">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Generate Academic Report</h2>
          <div className="grid grid-cols-1 gap-5 mb-6">
            <input
              type="number"
              placeholder="Enter Student ID"
              value={studentIdInput}
              onChange={(e) => setStudentIdInput(e.target.value)}
              className="p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition duration-200 text-base"
            />
            <select
              value={academicYearId}
              onChange={(e) => setAcademicYearId(e.target.value)}
              className="p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition duration-200 text-base"
            >
              <option value="">Select Academic Year</option>
              <option value="1">2024-2025</option>
              <option value="2">2025-2026</option>
              <option value="3">2026-2027</option>
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200 shadow-md transform hover:scale-105"
          >
            Generate Report
          </button>
        </div>
      )}

      {/* Certificate/Report Display Area */}
      {student && (
        <div
          id="printable-certificate" // Unique ID for print targeting
          className="relative w-full max-w-4xl bg-white shadow-2xl rounded-xl p-10 lg:p-16 border-8 border-double border-blue-900 bg-gradient-to-br from-white to-blue-50 overflow-hidden font-serif"
        >
          {/* Print Button (Visible only when student report is loaded, hidden on print) */}
          <button
            onClick={handlePrint}
            className="absolute top-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 z-50 print:hidden"
            aria-label="Print Report"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m0 0l-1 2H6m-3 0h18" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 14H5a2 2 0 01-2-2V8a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2h-2m-3 2v-4h-4v4m0 0h4" />
            </svg>
          </button>

          {/* Decorative Corner Elements (hidden on print via CSS) */}
          <div className="absolute top-0 left-0 w-24 h-24 border-t-8 border-l-8 border-blue-900 rounded-tl-xl"></div>
          <div className="absolute top-0 right-0 w-24 h-24 border-t-8 border-r-8 border-blue-900 rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 border-b-8 border-l-8 border-blue-900 rounded-bl-xl"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-8 border-r-8 border-blue-900 rounded-br-xl"></div>

          {/* Optional: School Logo Placeholder */}
          <img src={logo} alt="School Logo" className="w-full h-full rounded-b-sm object-cover shadow-md" />

          <div className="absolute top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
             <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-2xl font-bold border-4 border-blue-400 shadow-lg">
                <span className="opacity-70">A+</span>

            </div>
          </div>

          <div className="relative z-10 space-y-10">
            {/* School Header */}
          
            {/* Student Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-lg text-gray-800 mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200 shadow-inner">
              <div>
                <p className="font-semibold text-blue-700">Student Name: <span className="font-bold text-gray-900">{student.fullName}</span></p>
                <p className="font-semibold text-blue-700">Class: <span className="font-normal text-gray-800">{student.class}</span></p>
              </div>
              <div>
                <p className="font-semibold text-blue-700">Academic Year: <span className="font-normal text-gray-800">{academicYear || "N/A"}</span></p>
                <p className="font-semibold text-blue-700">Student ID: <span className="font-normal text-gray-800">{student.id}</span></p>
              </div>
            </div>

            {/* Exam Table */}
            <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-800 text-white">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Subject</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Monthly</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Midterm</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Final</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Total</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Grade</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subjectPerformance.map((subject) => (
                    <tr key={subject.subjectName} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subject.subjectName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">{subject.monthly}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">{subject.midterm}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">{subject.final}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-blue-800 text-center">{subject.total}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          subject.grade === 'A+' ? 'bg-green-100 text-green-800' :
                          subject.grade.startsWith('A') ? 'bg-blue-100 text-blue-800' :
                          subject.grade.startsWith('B') ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {subject.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Overall Summary */}
            <div className="p-8 mt-10 bg-blue-50 border-2 border-blue-300 rounded-lg shadow-lg text-gray-800">
              <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">Overall Academic Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xl">
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-md shadow-sm border border-gray-100">
                  <span className="text-gray-600 text-base">Total Marks Obtained:</span>
                  <span className="font-extrabold text-blue-900 text-3xl mt-1">{combinedTotal} / {maxPossible}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-md shadow-sm border border-gray-100">
                  <span className="text-gray-600 text-base">Overall Percentage:</span>
                  <span className="font-extrabold text-green-700 text-3xl mt-1">{percentage}%</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-md shadow-sm border border-gray-100">
                  <span className="text-gray-600 text-base">School Position:</span>
                  <span className="font-extrabold text-purple-700 text-3xl mt-1">15 / 180</span>
                </div>
              </div>
            </div>

            {/* Footer / Signature Area */}
            <div className="mt-16 pt-10 border-t-2 border-gray-200 text-center text-gray-700 text-base">
              <p className="mb-6 font-semibold">This certificate proudly acknowledges the distinguished academic performance of the student for the stated academic year.</p>
              <div className="grid grid-cols-2 gap-x-8 max-w-xl mx-auto mt-8">
                  <div className="flex flex-col items-center">
                      <p className="text-xl font-bold text-blue-800">_______________________</p>
                      <p className="mt-1 text-gray-600">Principal's Signature</p>
                  </div>
                  <div className="flex flex-col items-center">
                      <p className="text-xl font-bold text-blue-800">_______________________</p>
                      <p className="mt-1 text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                  </div>
              </div>
              <p className="mt-10 text-xs text-gray-500">Official Document ID: {student.id}-{academicYearId || 'N/A'}-{new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentExams;