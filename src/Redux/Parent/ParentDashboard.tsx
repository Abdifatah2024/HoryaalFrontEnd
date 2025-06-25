import React, { useEffect } from "react";
import { FiUser, FiBook, FiCalendar, FiActivity } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyStudents,
  fetchStudentAttendance,
  fetchStudentDiscipline,
  fetchStudentExamResults,
  fetchStudentBalance,
} from "../../Redux/Parent/ParentstudentSlice"; // adjust path
import { RootState, AppDispatch } from "../store"; // adjust path

const ParentDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { students,  examLoading, examError } = useSelector(
    (state: RootState) => state.students
  );

useEffect(() => {
  console.log("📢 Dispatching all student-related data...");

  dispatch(fetchMyStudents());
  dispatch(fetchStudentAttendance());
  dispatch(fetchStudentDiscipline());
  dispatch(fetchStudentExamResults());
  dispatch(fetchStudentBalance());
}, [dispatch]);


  const student = students[0]; // Assuming one student per parent for now

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">Parent Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome! Here's an overview of your child’s academic status.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Profile */}
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center mb-2">
            <FiUser className="text-indigo-600 text-xl mr-2" />
            <h2 className="text-lg font-semibold">Student Profile</h2>
          </div>
          {student ? (
            <div className="text-sm text-gray-700">
              <p><strong>Name:</strong> {student.fullname}</p>
              <p><strong>Class:</strong> {student.classes?.name}</p>
              <p><strong>Gender:</strong> {student.gender}</p>
              <p><strong>Phone:</strong> {student.phone}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Loading student info...</p>
          )}
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center mb-2">
            <FiCalendar className="text-indigo-600 text-xl mr-2" />
            <h2 className="text-lg font-semibold">Attendance</h2>
          </div>
          {student ? (
            <div className="text-sm text-gray-700">
              <p><strong>Present:</strong> {student.totalPresent}</p>
              <p><strong>Absent:</strong> {student.totalAbsent}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Loading attendance...</p>
          )}
        </div>

        {/* Exam Results */}
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center mb-2">
            <FiBook className="text-indigo-600 text-xl mr-2" />
            <h2 className="text-lg font-semibold">Exam Results</h2>
          </div>
          {examLoading ? (
            <p className="text-sm text-gray-500">Loading exam results...</p>
          ) : examError ? (
            <p className="text-sm text-red-500">{examError}</p>
          ) : student?.examResults?.length ? (
            <table className="w-full text-sm mt-2">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-1">Subject</th>
                  <th className="py-1">Monthly</th>
                  <th className="py-1">Midterm</th>
                  <th className="py-1">Final</th>
                  <th className="py-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {student.examResults.map((exam, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-1">{exam.subject}</td>
                    <td className="py-1">{exam.monthly ?? "-"}</td>
                    <td className="py-1">{exam.midterm ?? "-"}</td>
                    <td className="py-1">{exam.final ?? "-"}</td>
                    <td className="py-1">{exam.totalMarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-500">No exam results available.</p>
          )}
        </div>

        {/* Discipline */}
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center mb-2">
            <FiActivity className="text-indigo-600 text-xl mr-2" />
            <h2 className="text-lg font-semibold">Disciplinary Records</h2>
          </div>
          {student?.discipline?.length ? (
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {student.discipline.map((record, idx) => (
                <li key={idx}>
                  {record.type} – {record.description}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No discipline records.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;

