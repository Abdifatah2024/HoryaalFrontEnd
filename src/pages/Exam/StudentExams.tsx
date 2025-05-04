import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { fetchStudentExams, clearStudentExams } from "../../Redux/Exam/studentExamsSlice";

const StudentExams = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, student, exams, error } = useSelector((state: RootState) => state.studentExams);
  const [studentIdInput, setStudentIdInput] = useState("");

  const handleSearch = () => {
    if (studentIdInput.trim() === "") return;
    dispatch(clearStudentExams());
    dispatch(fetchStudentExams(Number(studentIdInput)));
  };

  // Calculate totals and performance by subject
  const monthlyTotal = exams.find(e => e.examName === 'Monthly')?.subjectScores.reduce((sum, s) => sum + s.marks, 0) || 0;
  const midtermTotal = exams.find(e => e.examName === 'Midterm')?.subjectScores.reduce((sum, s) => sum + s.marks, 0) || 0;
  const finalTotal = exams.find(e => e.examName === 'Final')?.subjectScores.reduce((sum, s) => sum + s.marks, 0) || 0;
  const combinedTotal = monthlyTotal + midtermTotal + finalTotal;
  const maxPossible = exams[0]?.subjectScores.length * 100 || 500;
  const percentage = ((combinedTotal / maxPossible) * 100).toFixed(1);

  // Calculate subject performance
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

  // Filter subjects by performance
  const weakSubjects = subjectPerformance.filter(subject => subject.performance === 'weak');
  const strongSubjects = subjectPerformance.filter(subject => subject.performance === 'strong');

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Search Section */}
      <div className="mb-8 flex gap-4">
        <input
          type="number"
          placeholder="Enter Student ID"
          value={studentIdInput}
          onChange={(e) => setStudentIdInput(e.target.value)}
          className="flex-1 p-2 border-b-2 focus:outline-none focus:border-blue-600"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Generate Report
        </button>
      </div>

      {student && (
        <div className="space-y-8">
          {/* Report Card Header */}
          <div className="text-center border-b-2 pb-4">
            <div className="flex justify-center mb-4">
              <div className="text-center">
                <h1 className="text-3xl font-serif font-bold text-gray-800">AL-IRSHAAD SECONDARY SCHOOL</h1>
                <p className="text-gray-600">Official Academic Transcript</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="font-semibold">Student Name: <span className="font-normal">{student.fullName}</span></p>
                <p className="font-semibold">Class: <span className="font-normal">{student.class}</span></p>
              </div>
              <div>
                <p className="font-semibold">Academic Year: <span className="font-normal">2024-2025</span></p>
                <p className="font-semibold">Student ID: <span className="font-normal">{student.id}</span></p>
              </div>
            </div>
          </div>

          {/* Academic Performance Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left border">Subject</th>
                  <th className="p-3 text-center border">Monthly (20)</th>
                  <th className="p-3 text-center border">Midterm (30)</th>
                  <th className="p-3 text-center border">Final (50)</th>
                  <th className="p-3 text-center border">Total (100)</th>
                  <th className="p-3 text-center border">Grade</th>
                </tr>
              </thead>
              <tbody>
                {subjectPerformance.map((subject, index) => (
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
                        'bg-red-100 text-red-800'}`}>
                        {subject.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
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

          {/* Performance Analysis - Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weak Subjects Column */}
            <div className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-red-600">Subjects Needing Improvement (Below 50 marks)</h3>
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

            {/* Strong Subjects Column */}
            <div className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-green-600">Strong Subjects (70-100 marks)</h3>
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

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 mt-8">
            <p>This is an official document. Any alterations will render it invalid.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentExams;