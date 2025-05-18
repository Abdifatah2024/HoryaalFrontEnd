import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import {
  fetchStudentExams,
  clearStudentExams,
} from "../../Redux/Exam/studentExamsSlice";

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

  const monthlyTotal = exams.find(e => e.examName === 'Monthly')?.subjectScores.reduce((sum, s) => sum + s.marks, 0) || 0;
  const midtermTotal = exams.find(e => e.examName === 'Midterm')?.subjectScores.reduce((sum, s) => sum + s.marks, 0) || 0;
  const finalTotal = exams.find(e => e.examName === 'Final')?.subjectScores.reduce((sum, s) => sum + s.marks, 0) || 0;
  const combinedTotal = monthlyTotal + midtermTotal + finalTotal;
  const maxPossible = exams[0]?.subjectScores.length * 100 || 500;
  const percentage = ((combinedTotal / maxPossible) * 100).toFixed(1);

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
      performance: total < 50 ? 'weak' : total >= 70 ? 'strong' : 'average'
    };
  }) || [];

  const weakSubjects = subjectPerformance.filter(subject => subject.performance === 'weak');
  const strongSubjects = subjectPerformance.filter(subject => subject.performance === 'strong');

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="number"
          placeholder="Enter Student ID"
          value={studentIdInput}
          onChange={(e) => setStudentIdInput(e.target.value)}
          className="p-2 border-b-2 focus:outline-none focus:border-blue-600"
        />
        <select
          value={academicYearId}
          onChange={(e) => setAcademicYearId(e.target.value)}
          className="p-2 border-b-2 focus:outline-none focus:border-blue-600"
        >
          <option value="">Select Academic Year</option>
          <option value="1">2024-2025</option>
          <option value="2">2025-2026</option>
          <option value="3">2026-2027</option>
        </select>
      </div>

      <button
        onClick={handleSearch}
        className="px-6 py-2 mb-8 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Generate Report
      </button>

      {student && (
        <div className="space-y-8">
          <div className="text-center border-b-2 pb-4">
            <h1 className="text-3xl font-serif font-bold text-gray-800">
              AL-IRSHAAD SECONDARY SCHOOL
            </h1>
            <p className="text-gray-600">Official Academic Transcript</p>
            <div className="grid grid-cols-2 gap-4 mt-4 text-left text-sm">
              <div>
                <p className="font-semibold">Student Name: <span className="font-semibold">{student.fullName}</span></p>
                <p className="font-semibold">Class: <span className="font-normal">{student.class}</span></p>
              </div>
              <div>
                <p className="font-semibold">Academic Year: <span className="font-normal">{academicYear || "N/A"}</span></p>
                <p className="font-semibold">Student ID: <span className="font-normal">{student.id}</span></p>
              </div>
            </div>
          </div>

          {/* Exam Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left border">Subject</th>
                  <th className="p-3 text-center border">Monthly</th>
                  <th className="p-3 text-center border">Midterm</th>
                  <th className="p-3 text-center border">Final</th>
                  <th className="p-3 text-center border">Total</th>
                  <th className="p-3 text-center border">Grade</th>
                </tr>
              </thead>
              <tbody>
                {subjectPerformance.map((subject) => (
                  <tr key={subject.subjectName} className="border-t">
                    <td className="p-3 border">{subject.subjectName}</td>
                    <td className="p-3 text-center border">{subject.monthly}</td>
                    <td className="p-3 text-center border">{subject.midterm}</td>
                    <td className="p-3 text-center border">{subject.final}</td>
                    <td className="p-3 text-center border font-semibold">{subject.total}</td>
                    <td className="p-3 text-center border">
                      <span className={`px-2 py-1 rounded ${
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

          {/* Summary */}
          <div className="border p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-center">Overall Performance Summary</h3>
            <div className="flex justify-between mb-4">
              <span>Total Marks Obtained:</span>
              <span className="font-semibold">{combinedTotal}/{maxPossible}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Percentage:</span>
              <span className="font-semibold">{percentage}%</span>
            </div>
            <div className="flex justify-between">
              <span>School Position:</span>
              <span className="font-semibold">15/180</span>
            </div>
          </div>

          {/* Performance Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-red-600">Subjects Needing Improvement</h3>
              {weakSubjects.length > 0 ? (
                <ul className="space-y-2">
                  {weakSubjects.map(subject => (
                    <li key={subject.subjectName} className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <span className="font-medium">{subject.subjectName}</span>
                      <span className="font-semibold text-red-600">{subject.total}/100</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 text-gray-500 bg-gray-50 rounded">
                  No subjects below 50 marks
                </div>
              )}
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-green-600">Strong Subjects</h3>
              {strongSubjects.length > 0 ? (
                <ul className="space-y-2">
                  {strongSubjects.map(subject => (
                    <li key={subject.subjectName} className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="font-medium">{subject.subjectName}</span>
                      <span className="font-semibold text-green-600">{subject.total}/100</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 text-gray-500 bg-gray-50 rounded">
                  No subjects above 70 marks
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentExams;
