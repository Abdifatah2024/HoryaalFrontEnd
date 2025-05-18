
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createAcademicYear,
//   createExamType,
//   createSubject,
//   getExamList,
//   registerScore,
//   updateScore,
//   deleteExamScore,
//   clearExamState,
// } from "../../Redux/Exam/examSlice";
// import { AppDispatch, RootState } from "../../Redux/store";

// interface Exam {
//   id: number;
//   name: string;
//   type: "MONTHLY" | "MIDTERM" | "FINAL";
//   maxMarks: number;
//   academicYearId: number;
// }

// const ExamPage = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { exams, loading, error, success } = useSelector((state: RootState) => state.exam);

//   const [examInput, setExamInput] = useState({
//     name: "",
//     type: "MONTHLY" as "MONTHLY" | "MIDTERM" | "FINAL",
//     maxMarks: 20,
//     academicYearId: 1,
//   });

//   const [subjectInput, setSubjectInput] = useState({ name: "" });
//   const [academicYearInput, setAcademicYearInput] = useState({ year: "2024-2025" });

//   const [scoreInput, setScoreInput] = useState({
//     studentId: "",
//     examId: "",
//     subjectId: "",
//     marks: "",
//     academicYearId: "1",
//   });

//   const academicYears = [
//     { id: 1, year: "2024-2025" },
//     { id: 2, year: "2025-2026" },
//   ];

//   const subjects = [
//     { id: 1, name: "Chemistry" },
//     { id: 2, name: "Biology" },
//     { id: 3, name: "Physics" },
//     { id: 4, name: "Math" },
//     { id: 5, name: "English" },
//     { id: 6, name: "Arabic" },
//     { id: 7, name: "Islamic" },
//     { id: 8, name: "Geography" },
//     { id: 9, name: "History" },
//     { id: 10, name: "Somali" },
//   ];

//   const examTypes = [
//     { value: "MONTHLY", label: "Monthly Exam" },
//     { value: "MIDTERM", label: "Midterm Exam" },
//     { value: "FINAL", label: "Final Exam" },
//   ];

//   useEffect(() => {
//     dispatch(getExamList());
//     dispatch(clearExamState());
//   }, [dispatch]);

//   const handleCreateExam = () => {
//     if (!examInput.name) return alert("Exam name is required");
//     dispatch(createExamType(examInput));
//     setExamInput({ name: "", type: "MONTHLY", maxMarks: 20, academicYearId: 1 });
//   };

//   const handleCreateSubject = () => {
//     if (!subjectInput.name) return alert("Subject name is required");
//     dispatch(createSubject(subjectInput));
//     setSubjectInput({ name: "" });
//   };

//   const handleCreateAcademicYear = () => {
//     if (!academicYearInput.year) return alert("Academic year is required");
//     dispatch(createAcademicYear(academicYearInput));
//   };

//   const handleExamTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const type = e.target.value as "MONTHLY" | "MIDTERM" | "FINAL";
//     const maxMarks = type === "MIDTERM" ? 30 : type === "FINAL" ? 50 : 20;
//     setExamInput((prev) => ({ ...prev, type, maxMarks }));
//   };

//   const getScorePayload = () => {
//     const { studentId, examId, subjectId, marks, academicYearId } = scoreInput;
//     if (!studentId || !examId || !subjectId || !marks) {
//       alert("All fields are required");
//       return null;
//     }
//     return {
//       studentId: parseInt(studentId),
//       examId: parseInt(examId),
//       subjectId: parseInt(subjectId),
//       marks: parseInt(marks),
//       academicYearId: parseInt(academicYearId),
//     };
//   };

//   const resetScoreForm = () => {
//     setScoreInput({
//       studentId: "",
//       examId: "",
//       subjectId: "",
//       marks: "",
//       academicYearId: "1",
//     });
//   };

//   const handleCreateScore = () => {
//     const payload = getScorePayload();
//     if (!payload) return;
//     dispatch(registerScore(payload));
//     resetScoreForm();
//   };

//   const handleUpdateScore = () => {
//     const payload = getScorePayload();
//     if (!payload) return;
//     dispatch(updateScore(payload));
//     resetScoreForm();
//   };

//   const handleDeleteScore = () => {
//     const { studentId, examId, subjectId } = scoreInput;
//     if (!studentId || !examId || !subjectId) {
//       alert("studentId, examId, subjectId are required");
//       return;
//     }
//     dispatch(
//       deleteExamScore({
//         studentId: parseInt(studentId),
//         examId: parseInt(examId),
//         subjectId: parseInt(subjectId),
//       })
//     );
//     resetScoreForm();
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8 text-center">Exam Management System</h1>

//       {loading && <p className="text-center">Loading...</p>}
//       {error && <div className="bg-red-200 p-2 rounded text-red-700">{error}</div>}
//       {success && <div className="bg-green-200 p-2 rounded text-green-800">{success}</div>}

//       <div className="grid md:grid-cols-2 gap-8">
//         {/* Create Exam */}
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-lg font-semibold mb-4">Create Exam Type</h2>
//           <input
//             type="text"
//             placeholder="Exam Name"
//             className="w-full mb-3 border rounded px-3 py-2"
//             value={examInput.name}
//             onChange={(e) => setExamInput({ ...examInput, name: e.target.value })}
//           />
//           <select className="w-full mb-3 border rounded px-3 py-2" value={examInput.type} onChange={handleExamTypeChange}>
//             {examTypes.map((type) => (
//               <option key={type.value} value={type.value}>{type.label}</option>
//             ))}
//           </select>
//           <select
//             className="w-full mb-3 border rounded px-3 py-2"
//             value={examInput.academicYearId}
//             onChange={(e) => setExamInput({ ...examInput, academicYearId: parseInt(e.target.value) })}
//           >
//             {academicYears.map((year) => (
//               <option key={year.id} value={year.id}>{year.year}</option>
//             ))}
//           </select>
//           <input type="number" className="w-full mb-3 border rounded px-3 py-2" value={examInput.maxMarks} readOnly />
//           <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={handleCreateExam} disabled={loading}>
//             Create Exam
//           </button>
//         </div>

//         {/* Register Score */}
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-lg font-semibold mb-4">Manage Score</h2>
//           <input
//             type="number"
//             placeholder="Student ID"
//             className="w-full mb-3 border rounded px-3 py-2"
//             value={scoreInput.studentId}
//             onChange={(e) => setScoreInput({ ...scoreInput, studentId: e.target.value })}
//           />
//           <select
//             className="w-full mb-3 border rounded px-3 py-2"
//             value={scoreInput.examId}
//             onChange={(e) => setScoreInput({ ...scoreInput, examId: e.target.value })}
//           >
//             <option value="">Select Exam</option>
//             {exams.map((exam) => (
//               <option key={exam.id} value={exam.id}>
//                 {exam.name} ({exam.type})
//               </option>
//             ))}
//           </select>
//           <select
//             className="w-full mb-3 border rounded px-3 py-2"
//             value={scoreInput.subjectId}
//             onChange={(e) => setScoreInput({ ...scoreInput, subjectId: e.target.value })}
//           >
//             <option value="">Select Subject</option>
//             {subjects.map((subject) => (
//               <option key={subject.id} value={subject.id}>{subject.name}</option>
//             ))}
//           </select>
//           <select
//             className="w-full mb-3 border rounded px-3 py-2"
//             value={scoreInput.academicYearId}
//             onChange={(e) => setScoreInput({ ...scoreInput, academicYearId: e.target.value })}
//           >
//             {academicYears.map((y) => (
//               <option key={y.id} value={y.id}>{y.year}</option>
//             ))}
//           </select>
//           <input
//             type="number"
//             placeholder="Marks"
//             className="w-full mb-3 border rounded px-3 py-2"
//             value={scoreInput.marks}
//             onChange={(e) => setScoreInput({ ...scoreInput, marks: e.target.value })}
//           />

//           <div className="flex gap-2">
//             <button onClick={handleCreateScore} className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">
//               Create
//             </button>
//             <button onClick={handleUpdateScore} className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">
//               Update
//             </button>
//             <button onClick={handleDeleteScore} className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700">
//               Delete
//             </button>
//           </div>
//         </div>

//         {/* Subject & Academic Year */}
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-lg font-semibold mb-4">Create Subject</h2>
//           <select
//             className="w-full mb-3 border rounded px-3 py-2"
//             value={subjectInput.name}
//             onChange={(e) => setSubjectInput({ name: e.target.value })}
//           >
//             <option value="">Select Subject</option>
//             {subjects.map((s) => (
//               <option key={s.id} value={s.name}>{s.name}</option>
//             ))}
//           </select>
//           <button
//             onClick={handleCreateSubject}
//             className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//             disabled={loading}
//           >
//             Create Subject
//           </button>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-lg font-semibold mb-4">Create Academic Year</h2>
//           <select
//             className="w-full mb-3 border rounded px-3 py-2"
//             value={academicYearInput.year}
//             onChange={(e) => setAcademicYearInput({ year: e.target.value })}
//           >
//             {academicYears.map((y) => (
//               <option key={y.id} value={y.year}>{y.year}</option>
//             ))}
//           </select>
//           <button
//             onClick={handleCreateAcademicYear}
//             className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//             disabled={loading}
//           >
//             Create Year
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExamPage;
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createAcademicYear,
  createExamType,
  createSubject,
  getExamList,
  registerScore,
  updateScore,
  deleteExamScore,
  clearExamState,
} from "../../Redux/Exam/examSlice";
import { AppDispatch, RootState } from "../../Redux/store";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Exam {
  id: number;
  name: string;
  type: "MONTHLY" | "MIDTERM" | "FINAL";
  maxMarks: number;
  academicYearId: number;
}

interface Subject {
  id: number;
  name: string;
}

interface AcademicYear {
  id: number;
  year: string;
}

const ExamPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { exams, loading, error, success, subjects: reduxSubjects } = useSelector(
    (state: RootState) => state.exam
  );

  // Hardcoded academic years
  const academicYears: AcademicYear[] = [
    { id: 1, year: "2024-2025" },
    { id: 2, year: "2025-2026" },
  ];

  // Form states
  const [examInput, setExamInput] = useState({
    name: "",
    type: "MONTHLY" as "MONTHLY" | "MIDTERM" | "FINAL",
    maxMarks: 20,
    academicYearId: 1,
  });

  const [subjectInput, setSubjectInput] = useState({ name: "" });
  const [academicYearInput, setAcademicYearInput] = useState({ year: "" });
  const [scoreInput, setScoreInput] = useState({
    studentId: "",
    examId: "",
    subjectId: "",
    marks: "",
    academicYearId: "1",
  });

  // Derived data
  const examTypes = [
    { value: "MONTHLY", label: "Monthly Exam" },
    { value: "MIDTERM", label: "Midterm Exam" },
    { value: "FINAL", label: "Final Exam" },
  ];

  // Subjects data
  const subjects: Subject[] = [
    { id: 1, name: "Chemistry" },
    { id: 2, name: "Biology" },
    { id: 3, name: "Physics" },
    { id: 4, name: "Math" },
    { id: 5, name: "English" },
    { id: 6, name: "Arabic" },
    { id: 7, name: "Islamic" },
    { id: 8, name: "Geography" },
    { id: 9, name: "History" },
    { id: 10, name: "Somali" },
  ];

  // Memoized payload creator
  const getScorePayload = useCallback(() => {
    const { studentId, examId, subjectId, marks, academicYearId } = scoreInput;
    if (!studentId || !examId || !subjectId || !marks) {
      toast.error("All fields are required");
      return null;
    }
    return {
      studentId: parseInt(studentId),
      examId: parseInt(examId),
      subjectId: parseInt(subjectId),
      marks: parseInt(marks),
      academicYearId: parseInt(academicYearId),
    };
  }, [scoreInput]);

  // Reset functions
  const resetScoreForm = useCallback(() => {
    setScoreInput({
      studentId: "",
      examId: "",
      subjectId: "",
      marks: "",
      academicYearId: "1",
    });
  }, []);

  // Handlers
  const handleExamTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as "MONTHLY" | "MIDTERM" | "FINAL";
    const maxMarks = type === "MIDTERM" ? 30 : type === "FINAL" ? 50 : 20;
    setExamInput((prev) => ({ ...prev, type, maxMarks }));
  };

  const handleCreateExam = () => {
    if (!examInput.name) {
      toast.error("Exam name is required");
      return;
    }
    dispatch(createExamType(examInput))
      .unwrap()
      .then(() => {
        toast.success("Exam created successfully!");
        setExamInput({ name: "", type: "MONTHLY", maxMarks: 20, academicYearId: 1 });
      })
      .catch((err) => toast.error(err.message || "Failed to create exam"));
  };

  const handleCreateSubject = () => {
    if (!subjectInput.name) {
      toast.error("Subject name is required");
      return;
    }
    dispatch(createSubject(subjectInput))
      .unwrap()
      .then(() => {
        toast.success("Subject created successfully!");
        setSubjectInput({ name: "" });
      })
      .catch((err) => toast.error(err.message || "Failed to create subject"));
  };

  const handleCreateAcademicYear = () => {
    if (!academicYearInput.year) {
      toast.error("Academic year is required");
      return;
    }
    if (!/^\d{4}-\d{4}$/.test(academicYearInput.year)) {
      toast.error("Academic year must be in format YYYY-YYYY");
      return;
    }
    dispatch(createAcademicYear(academicYearInput))
      .unwrap()
      .then(() => {
        toast.success("Academic year created successfully!");
        setAcademicYearInput({ year: "" });
      })
      .catch((err) => toast.error(err.message || "Failed to create academic year"));
  };

  const handleCreateScore = () => {
    const payload = getScorePayload();
    if (!payload) return;
    dispatch(registerScore(payload))
      .unwrap()
      .then(() => {
        toast.success("Score registered successfully!");
        resetScoreForm();
      })
      .catch((err) => toast.error(err.message || "Failed to register score"));
  };

  const handleUpdateScore = () => {
    const payload = getScorePayload();
    if (!payload) return;
    dispatch(updateScore(payload))
      .unwrap()
      .then(() => {
        toast.success("Score updated successfully!");
        resetScoreForm();
      })
      .catch((err) => toast.error(err.message || "Failed to update score"));
  };

  const handleDeleteScore = () => {
    const { studentId, examId, subjectId } = scoreInput;
    if (!studentId || !examId || !subjectId) {
      toast.error("Student ID, Exam ID, and Subject ID are required");
      return;
    }
    dispatch(
      deleteExamScore({
        studentId: parseInt(studentId),
        examId: parseInt(examId),
        subjectId: parseInt(subjectId),
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Score deleted successfully!");
        resetScoreForm();
      })
      .catch((err) => toast.error(err.message || "Failed to delete score"));
  };

  // Effects
  useEffect(() => {
    dispatch(getExamList());
    dispatch(clearExamState());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
    if (success) toast.success(success);
  }, [error, success]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Exam Management System</h1>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-center">Processing...</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Create Exam */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Create Exam Type</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
              <input
                type="text"
                placeholder="Exam Name"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={examInput.name}
                onChange={(e) => setExamInput({ ...examInput, name: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
              <select 
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={examInput.type} 
                onChange={handleExamTypeChange}
              >
                {examTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
              <select
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={examInput.academicYearId}
                onChange={(e) => setExamInput({ ...examInput, academicYearId: parseInt(e.target.value) })}
              >
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.year}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Marks</label>
              <input 
                type="number" 
                className="w-full border rounded px-3 py-2 bg-gray-100" 
                value={examInput.maxMarks} 
                readOnly 
              />
            </div>
            
            <button
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              onClick={handleCreateExam}
              disabled={loading}
            >
              Create Exam
            </button>
          </div>
        </div>

        {/* Register Score */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Manage Score</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
              <input
                type="number"
                placeholder="Student ID"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={scoreInput.studentId}
                onChange={(e) => setScoreInput({ ...scoreInput, studentId: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam</label>
              <select
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={scoreInput.examId}
                onChange={(e) => setScoreInput({ ...scoreInput, examId: e.target.value })}
              >
                <option value="">Select Exam</option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name} ({exam.type})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={scoreInput.subjectId}
                onChange={(e) => setScoreInput({ ...scoreInput, subjectId: e.target.value })}
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
              <select
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={scoreInput.academicYearId}
                onChange={(e) => setScoreInput({ ...scoreInput, academicYearId: e.target.value })}
              >
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.year}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marks</label>
              <input
                type="number"
                placeholder="Marks"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={scoreInput.marks}
                onChange={(e) => setScoreInput({ ...scoreInput, marks: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreateScore}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors disabled:bg-green-400"
                disabled={loading}
              >
                Create
              </button>
              <button
                onClick={handleUpdateScore}
                className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition-colors disabled:bg-yellow-400"
                disabled={loading}
              >
                Update
              </button>
              <button
                onClick={handleDeleteScore}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors disabled:bg-red-400"
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Subject & Academic Year */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Create Subject</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
              <input
                type="text"
                placeholder="Subject Name"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={subjectInput.name}
                onChange={(e) => setSubjectInput({ name: e.target.value })}
              />
            </div>
            <button
              onClick={handleCreateSubject}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              disabled={loading}
            >
              Create Subject
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Create Academic Year</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year (YYYY-YYYY)</label>
              <input
                type="text"
                placeholder="e.g., 2024-2025"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={academicYearInput.year}
                onChange={(e) => setAcademicYearInput({ year: e.target.value })}
              />
            </div>
            <button
              onClick={handleCreateAcademicYear}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              disabled={loading}
            >
              Create Year
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;