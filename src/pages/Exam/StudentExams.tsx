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

  // Calculate totals
  const monthlyTotal = exams.find(e => e.examName === 'Monthly')?.subjectScores.reduce((sum, s) => sum + s.marks, 0) || 0;
  const midtermTotal = exams.find(e => e.examName === 'Midterm')?.subjectScores.reduce((sum, s) => sum + s.marks, 0) || 0;
  const combinedTotal = monthlyTotal + midtermTotal;
  const percentage = ((combinedTotal / 500) * 100).toFixed(1);

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
                <p className="font-semibold">Academic Year: <span className="font-normal">2023-2024</span></p>
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
                  <th className="p-3 text-center border">Total (50)</th>
                  <th className="p-3 text-center border">Grade</th>
                </tr>
              </thead>
              <tbody>
                {exams[0]?.subjectScores.map((subject, index) => {
                  const midtermMark = exams[1]?.subjectScores[index]?.marks || 0;
                  const totalMark = subject.marks + midtermMark;
                  const grade = 
                    totalMark >= 45 ? 'A+' :
                    totalMark >= 40 ? 'A' :
                    totalMark >= 35 ? 'B+' :
                    totalMark >= 30 ? 'B' :
                    totalMark >= 25 ? 'C+' :
                    totalMark >= 20 ? 'C' : 'D';

                  return (
                    <tr key={subject.subjectName} className="border-t">
                      <td className="p-3 border">{subject.subjectName}</td>
                      <td className="p-3 text-center border">{subject.marks}</td>
                      <td className="p-3 text-center border">{midtermMark}</td>
                      <td className="p-3 text-center border font-semibold">{totalMark}</td>
                      <td className="p-3 text-center border">
                        <span className={`px-2 py-1 rounded ${grade === 'A+' ? 'bg-green-100 text-green-800' : 
                          grade.startsWith('A') ? 'bg-blue-100 text-blue-800' :
                          grade.startsWith('B') ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                          {grade}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div className="grid grid-cols-2 gap-6">
            <div className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Overall Performance</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Marks Obtained:</span>
                  <span className="font-semibold">{combinedTotal}/500</span>
                </div>
                <div className="flex justify-between">
                  <span>Percentage:</span>
                  <span className="font-semibold">{percentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span>School Position:</span>
                  <span className="font-semibold">15/180</span>
                </div>
              </div>
            </div>

            <div className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Grading System</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>A+ (90-100%):</span>
                  <span>Outstanding</span>
                </div>
                <div className="flex justify-between">
                  <span>A (80-89%):</span>
                  <span>Excellent</span>
                </div>
                <div className="flex justify-between">
                  <span>B+ (70-79%):</span>
                  <span>Very Good</span>
                </div>
                <div className="flex justify-between">
                  <span>B (60-69%):</span>
                  <span>Good</span>
                </div>
                <div className="flex justify-between">
                  <span>C+ (50-59%):</span>
                  <span>Satisfactory</span>
                </div>
                <div className="flex justify-between">
                  <span>C (40-49%):</span>
                  <span>Needs Improvement</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comments & Signatures */}
          <div className="border-t-2 pt-6">
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Teacher's Comments:</h3>
              <p className="italic text-gray-600">
                "Faisa has shown consistent improvement in Mathematics and Science subjects. 
                More focus needed in Language subjects to achieve better results."
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-8">
              <div className="text-center">
                <p className="border-t-2 pt-4 inline-block px-8">
                  Class Teacher's Signature
                </p>
              </div>
              <div className="text-center">
                <p className="border-t-2 pt-4 inline-block px-8">
                  Principal's Signature
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  <p>Al-irshad Seconadry</p>
                  <p>Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 mt-8">
            <p>This is an official document. Any alterations will render it invalid.</p>
            <p>School Stamp</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentExams;
