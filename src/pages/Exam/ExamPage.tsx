import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import {
  createAcademicYear,
  createExamType,
  createSubject,
  getExamList,
  registerScore,
  clearExamState,
} from "../../Redux/Exam/examSlice";

interface Exam {
  id: number;
  name: string;
  type: "MONTHLY" | "MIDTERM" | "FINAL";
  maxMarks: number;
  academicYearId: number;
}

const ExamPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success, exams } = useSelector((state: RootState) => state.exam);

  // Form states
  const [examInput, setExamInput] = useState({
    name: "",
    type: "MONTHLY" as "MONTHLY" | "MIDTERM" | "FINAL",
    maxMarks: 20,
    academicYearId: 1
  });

  const [subjectInput, setSubjectInput] = useState({ name: "" });
  const [academicYearInput, setAcademicYearInput] = useState({ year: "2024-2025" });
  
  const [scoreInput, setScoreInput] = useState({
    studentId: "",
    examId: "",
    subjectId: "",
    marks: "",
    academicYearId: "1"
  });

  // Predefined data
  const academicYears = [
    { id: 1, year: "2024-2025" },
    { id: 2, year: "2025-2026" },
    { id: 3, year: "2026-2027" },
    { id: 4, year: "2027-2028" },
    { id: 5, year: "2028-2029" },
  ];

  const subjects = [
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

  const examTypes = [
    { value: "MONTHLY", label: "Monthly Exam" },
    { value: "MIDTERM", label: "Midterm Exam" },
    { value: "FINAL", label: "Final Exam" },
  ];

  useEffect(() => {
    dispatch(getExamList());
    dispatch(clearExamState());
  }, [dispatch]);

  const handleCreateExam = () => {
    if (!examInput.name) {
      alert("Exam name is required");
      return;
    }
    dispatch(createExamType(examInput));
    setExamInput({ 
      name: "", 
      type: "MONTHLY", 
      maxMarks: 20,
      academicYearId: 1 
    });
  };

  const handleCreateSubject = () => {
    if (!subjectInput.name) {
      alert("Subject name is required");
      return;
    }
    dispatch(createSubject(subjectInput));
    setSubjectInput({ name: "" });
  };

  const handleCreateAcademicYear = () => {
    if (!academicYearInput.year) {
      alert("Academic year is required");
      return;
    }
    dispatch(createAcademicYear(academicYearInput));
  };

  const handleRegisterScore = () => {
    if (
      !scoreInput.studentId ||
      !scoreInput.examId ||
      !scoreInput.subjectId ||
      !scoreInput.marks
    ) {
      alert("All fields are required");
      return;
    }

    const selectedExam = exams.find(exam => exam.id === parseInt(scoreInput.examId));
    if (!selectedExam) {
      alert("Selected exam not found");
      return;
    }

    // Validate marks against exam type
    const marksNum = parseInt(scoreInput.marks);
    if (marksNum > selectedExam.maxMarks) {
      alert(`Marks cannot exceed ${selectedExam.maxMarks} for this exam`);
      return;
    }

    if (selectedExam.type === "MONTHLY" && marksNum > 20) {
      alert("Monthly exam marks must not exceed 20");
      return;
    }
    if (selectedExam.type === "MIDTERM" && marksNum > 30) {
      alert("Midterm exam marks must not exceed 30");
      return;
    }
    if (selectedExam.type === "FINAL" && marksNum > 50) {
      alert("Final exam marks must not exceed 50");
      return;
    }

    const payload = {
      studentId: parseInt(scoreInput.studentId),
      examId: parseInt(scoreInput.examId),
      subjectId: parseInt(scoreInput.subjectId),
      marks: marksNum,
      academicYearId: parseInt(scoreInput.academicYearId)
    };

    dispatch(registerScore(payload));

    setScoreInput({
      studentId: "",
      examId: "",
      subjectId: "",
      marks: "",
      academicYearId: "1"
    });
  };

  const handleExamTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as "MONTHLY" | "MIDTERM" | "FINAL";
    let maxMarks = 20;
    if (type === "MIDTERM") maxMarks = 30;
    if (type === "FINAL") maxMarks = 50;
    setExamInput({ ...examInput, type, maxMarks });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Exam Management System</h1>

      {/* Status Messages */}
      {loading && <div className="text-center py-4">Loading...</div>}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Create Exam Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Create Exam Type</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Exam Name"
              className="w-full px-3 py-2 border rounded-md"
              value={examInput.name}
              onChange={(e) => setExamInput({ ...examInput, name: e.target.value })}
            />
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={examInput.type}
              onChange={handleExamTypeChange}
            >
              {examTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label} (Max: {type.value === "MONTHLY" ? 20 : type.value === "MIDTERM" ? 30 : 50} marks)
                </option>
              ))}
            </select>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={examInput.academicYearId}
              onChange={(e) => setExamInput({ ...examInput, academicYearId: parseInt(e.target.value) })}
            >
              {academicYears.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.year}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={examInput.maxMarks}
              className="w-full px-3 py-2 border rounded-md"
              readOnly
            />
            <button
              onClick={handleCreateExam}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              Create Exam
            </button>
          </div>
        </div>

        {/* Register Score Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Register Student Score</h2>
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Student ID"
              className="w-full px-3 py-2 border rounded-md"
              value={scoreInput.studentId}
              onChange={(e) => setScoreInput({ ...scoreInput, studentId: e.target.value })}
            />
            
            {/* Exam Selection */}
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={scoreInput.examId}
              onChange={(e) => setScoreInput({ ...scoreInput, examId: e.target.value })}
            >
              <option value="">Select Exam</option>
              {exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name} ({exam.type} - Max: {exam.maxMarks} marks)
                </option>
              ))}
            </select>

            <select
              className="w-full px-3 py-2 border rounded-md"
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

            <select
              className="w-full px-3 py-2 border rounded-md"
              value={scoreInput.academicYearId}
              onChange={(e) => setScoreInput({ ...scoreInput, academicYearId: e.target.value })}
            >
              <option value="">Select Academic Year</option>
              {academicYears.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.year}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Marks"
              className="w-full px-3 py-2 border rounded-md"
              value={scoreInput.marks}
              onChange={(e) => setScoreInput({ ...scoreInput, marks: e.target.value })}
              min="0"
              max="50"
            />

            <button
              onClick={handleRegisterScore}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              Register Score
            </button>
          </div>
        </div>

        {/* Create Subject Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Create Subject</h2>
          <div className="space-y-4">
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={subjectInput.name}
              onChange={(e) => setSubjectInput({ name: e.target.value })}
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleCreateSubject}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              Create Subject
            </button>
          </div>
        </div>

        {/* Create Academic Year Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Create Academic Year</h2>
          <div className="space-y-4">
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={academicYearInput.year}
              onChange={(e) => setAcademicYearInput({ year: e.target.value })}
            >
              {academicYears.map((year) => (
                <option key={year.id} value={year.year}>
                  {year.year}
                </option>
              ))}
            </select>
            <button
              onClick={handleCreateAcademicYear}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              Create Academic Year
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;