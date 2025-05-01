// src/components/ExamReport.tsx
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { fetchExamReport } from '../../Redux/Exam/examReportSlice';

const ExamReport: React.FC = () => {
  const [classId, setClassId] = useState('');
  const [examId, setExamId] = useState('');
  const dispatch = useAppDispatch();
  const { loading, report, error } = useAppSelector((state) => state.examReport);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (classId && examId) {
      dispatch(fetchExamReport({ classId: Number(classId), examId: Number(examId) }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Exam Report by Class</h1>

      <form onSubmit={handleSubmit} className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="number"
          placeholder="Class ID"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="input input-bordered w-full md:w-1/3"
        />
        <input
          type="number"
          placeholder="Exam ID"
          value={examId}
          onChange={(e) => setExamId(e.target.value)}
          className="input input-bordered w-full md:w-1/3"
        />
        <button type="submit" className="btn btn-primary w-full md:w-auto">Get Report</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && report.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Rank</th>
                <th className="p-2 border">Student Name</th>
                <th className="p-2 border">Total Marks</th>
                <th className="p-2 border">Subjects</th>
              </tr>
            </thead>
            <tbody>
              {report.map((student) => (
                <tr key={student.studentId} className="border-t">
                  <td className="p-2 border text-center">{student.rank}</td>
                  <td className="p-2 border">{student.fullName}</td>
                  <td className="p-2 border text-center">{student.totalMarks}</td>
                  <td className="p-2 border">
                    <ul className="list-disc pl-4">
                      {student.subjects.map((s, idx) => (
                        <li key={idx}>
                          {s.subject}: <span className="font-semibold">{s.marks}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExamReport;
