import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { fetchExamReport } from '../../Redux/Exam/examReportSlice';

const CLASS_LIST = [
  { id: 1, name: "1A" }, { id: 2, name: "1B" }, { id: 3, name: "1C" },
  { id: 4, name: "1D" }, { id: 5, name: "1E" }, { id: 6, name: "1G" },
  { id: 7, name: "2A" }, { id: 8, name: "2B" }, { id: 9, name: "2C" },
  { id: 10, name: "2D" }, { id: 11, name: "2E" }, { id: 12, name: "2F" },
  { id: 13, name: "3A" }, { id: 14, name: "3B" }, { id: 15, name: "3C" },
  { id: 16, name: "3D" }, { id: 17, name: "3E" }, { id: 18, name: "4A" },
  { id: 19, name: "4B" }, { id: 20, name: "4C" }, { id: 21, name: "4D" },
];

const EXAM_TYPES = [
  { id: 1, name: "Monthly" },
  { id: 2, name: "Midterm" },
  { id: 3, name: "Final" },
];

const ExamReport: React.FC = () => {
  const [classId, setClassId] = useState('');
  const [examId, setExamId] = useState('');
  const dispatch = useAppDispatch();
  const { loading, report, error } = useAppSelector((state) => state.examReport);

  const subjectHeaders = report.length > 0
    ? [...new Set(report.flatMap(student => student.subjects.map(s => s.subject)))]
    : [];

  const subjectTotals = subjectHeaders.map(subject => {
    return report.reduce((sum, student) => {
      const match = student.subjects.find(s => s.subject === subject);
      return sum + (match ? match.marks : 0);
    }, 0);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (classId && examId) {
      dispatch(fetchExamReport({ classId: Number(classId), examId: Number(examId) }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Exam Results Report</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Class</option>
              {CLASS_LIST.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
            <select
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Exam Type</option>
              {EXAM_TYPES.map((exam) => (
                <option key={exam.id} value={exam.id}>{exam.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : report.length > 0 && (
        <div className="space-y-8">
          {/* Summary Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Results for {CLASS_LIST.find(c => c.id === Number(classId))?.name} - {EXAM_TYPES.find(e => e.id === Number(examId))?.name}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Marks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.map((student) => (
                    <tr key={student.studentId}>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          student.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                          student.rank === 2 ? 'bg-gray-100 text-gray-800' :
                          student.rank === 3 ? 'bg-amber-100 text-amber-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {student.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.fullName}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{student.totalMarks}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {Math.round((student.totalMarks / (student.subjects.length * 100)) * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subject-wise Marks Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Subject-wise Marks</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                    {subjectHeaders.map(subject => (
                      <th key={subject} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{subject}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.map((student) => (
                    <tr key={student.studentId}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.fullName}</td>
                      {subjectHeaders.map(subject => {
                        const match = student.subjects.find(s => s.subject === subject);
                        return (
                          <td key={`${student.studentId}-${subject}`} className="px-6 py-4 text-sm text-gray-900">
                            {match ? match.marks : '-'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {/* Totals Row */}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-6 py-4 text-sm text-gray-700">Total</td>
                    {subjectTotals.map((total, i) => (
                      <td key={`total-${i}`} className="px-6 py-4 text-sm text-gray-800">{total}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamReport;
