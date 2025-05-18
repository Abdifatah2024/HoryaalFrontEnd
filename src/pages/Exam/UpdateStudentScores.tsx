// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchStudentExamScores,
//   updateTenSubjectScores,
//   verifyStudent,
//   clearMessages,
// } from "../../Redux/Exam/studentScoreSlice";
// import { RootState, AppDispatch } from "../../Redux/store";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const UpdateStudentScores = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { scores, loading, error, success, studentInfo } = useSelector(
//     (state: RootState) => state.studentScores
//   );

//   const [form, setForm] = useState({
//     studentId: "",
//     examId: "1",
//     academicYearId: "1",
//   });

//   const [localScores, setLocalScores] = useState<
//     { subjectId: number; subjectName: string; marks: number }[]
//   >([]);

//   const maxMarks = {
//     "1": 20,
//     "2": 30,
//     "3": 50,
//   };

//   const handleSearch = async () => {
//     if (!form.studentId || !form.examId || !form.academicYearId) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     try {
//       await dispatch(verifyStudent(Number(form.studentId))).unwrap();
//       await dispatch(
//         fetchStudentExamScores({
//           studentId: Number(form.studentId),
//           examId: Number(form.examId),
//           academicYearId: Number(form.academicYearId),
//         })
//       ).unwrap();
//       toast.success("Student and scores loaded");
//     } catch (err: any) {
//       toast.error(err?.message || "Failed to fetch student data");
//     }
//   };

//   useEffect(() => {
//     setLocalScores(
//       scores.map((s) => ({
//         subjectId: s.subjectId,
//         subjectName: s.subjectName,
//         marks: s.marks,
//       }))
//     );
//   }, [scores]);

//   useEffect(() => {
//     if (error) toast.error(error);
//     if (success) toast.success(success);
//   }, [error, success]);

//   const handleMarksChange = (subjectId: number, value: string) => {
//     const marks = parseInt(value) || 0;
//     const max = maxMarks[form.examId as keyof typeof maxMarks];

//     if (marks > max) {
//       toast.error(`Max marks for this exam is ${max}`);
//       return;
//     }

//     setLocalScores((prev) =>
//       prev.map((s) => (s.subjectId === subjectId ? { ...s, marks } : s))
//     );
//   };

//   const handleUpdate = async () => {
//     if (!form.studentId || !form.examId || !form.academicYearId) {
//       toast.error("All fields are required");
//       return;
//     }

//     const max = maxMarks[form.examId as keyof typeof maxMarks];
//     const invalid = localScores.filter((s) => s.marks > max);
//     if (invalid.length > 0) {
//       toast.error(`Some scores exceed max of ${max}`);
//       return;
//     }

//     try {
//       await dispatch(
//         updateTenSubjectScores({
//           studentId: Number(form.studentId),
//           examId: Number(form.examId),
//           academicYearId: Number(form.academicYearId),
//           scores: localScores.map(({ subjectId, marks }) => ({ subjectId, marks })),
//         })
//       ).unwrap();
//       toast.success("Scores updated successfully!");
//     } catch (err: any) {
//       toast.error(err?.message || "Update failed");
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <div className="bg-white rounded-xl shadow-md overflow-hidden">
//         <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
//           <h1 className="text-xl font-bold">Exam Score Management</h1>
//         </div>

//         <div className="p-4 border-b grid grid-cols-1 md:grid-cols-4 gap-3">
//           <input
//             type="number"
//             placeholder="Student ID"
//             value={form.studentId}
//             onChange={(e) => setForm({ ...form, studentId: e.target.value })}
//             className="p-2 border rounded"
//           />
//           <select
//             value={form.examId}
//             onChange={(e) => setForm({ ...form, examId: e.target.value })}
//             className="p-2 border rounded"
//           >
//             <option value="1">Monthly</option>
//             <option value="2">Midterm</option>
//             <option value="3">Final</option>
//           </select>
//           <select
//             value={form.academicYearId}
//             onChange={(e) => setForm({ ...form, academicYearId: e.target.value })}
//             className="p-2 border rounded"
//           >
//             <option value="1">2024-2025</option>
//             <option value="2">2025-2026</option>
//           </select>
//           <button
//             onClick={handleSearch}
//             className="bg-blue-600 text-white px-4 py-2 rounded"
//             disabled={loading}
//           >
//             {loading ? "Loading..." : "Search"}
//           </button>
//         </div>

//         {studentInfo?.fullname && (
//           <div className="p-4 bg-blue-50">
//             <p className="text-blue-800 font-semibold">
//               {studentInfo.fullname} (ID: {form.studentId})
//             </p>
//           </div>
//         )}

//         {localScores.length > 0 && (
//           <div className="p-4">
//             <table className="w-full table-auto">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="p-2 text-left">Subject</th>
//                   <th className="p-2 text-left">Marks</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {localScores.map((subj) => (
//                   <tr key={subj.subjectId}>
//                     <td className="p-2">{subj.subjectName}</td>
//                     <td className="p-2">
//                       <input
//                         type="number"
//                         value={subj.marks}
//                         min={0}
//                         max={maxMarks[form.examId as keyof typeof maxMarks]}
//                         onChange={(e) =>
//                           handleMarksChange(subj.subjectId, e.target.value)
//                         }
//                         className="p-2 border rounded w-24"
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="mt-4 text-right">
//               <button
//                 onClick={handleUpdate}
//                 className="bg-green-600 text-white px-4 py-2 rounded"
//               >
//                 Update Scores
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UpdateStudentScores;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentExamScores,
  updateTenSubjectScores,
  verifyStudent,
  clearMessages,
} from "../../Redux/Exam/studentScoreSlice";
import { RootState, AppDispatch } from "../../Redux/store";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateStudentScores = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { scores, loading, error, success, studentInfo } = useSelector(
    (state: RootState) => state.studentScores
  );

  const [form, setForm] = useState({
    studentId: "",
    examId: "1",
    academicYearId: "1",
  });

  const [localScores, setLocalScores] = useState<
    { subjectId: number; subjectName: string; marks: number }[]
  >([]);

  const maxMarks = {
    "1": 20,
    "2": 30,
    "3": 50,
  };

  const handleSearch = async () => {
    if (!form.studentId || !form.examId || !form.academicYearId) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await dispatch(verifyStudent(Number(form.studentId))).unwrap();
      await dispatch(
        fetchStudentExamScores({
          studentId: Number(form.studentId),
          examId: Number(form.examId),
          academicYearId: Number(form.academicYearId),
        })
      ).unwrap();
      toast.success("Student and scores loaded");
    } catch (err: any) {
      toast.error(err?.message || "Failed to fetch student data");
    }
  };

  useEffect(() => {
    setLocalScores(
      scores.map((s) => ({
        subjectId: s.subjectId,
        subjectName: s.subjectName,
        marks: s.marks,
      }))
    );
  }, [scores]);

  useEffect(() => {
    if (error) toast.error(error);
    if (success) toast.success(success);
  }, [error, success]);

  const handleMarksChange = (subjectId: number, value: string) => {
    const marks = parseInt(value) || 0;
    const max = maxMarks[form.examId as keyof typeof maxMarks];

    if (marks > max) {
      toast.error(`Max marks for this exam is ${max}`);
      return;
    }

    setLocalScores((prev) =>
      prev.map((s) => (s.subjectId === subjectId ? { ...s, marks } : s))
    );
  };

  const handleUpdate = async () => {
    if (!form.studentId || !form.examId || !form.academicYearId) {
      toast.error("All fields are required");
      return;
    }

    const max = maxMarks[form.examId as keyof typeof maxMarks];
    const invalid = localScores.filter((s) => s.marks > max);
    if (invalid.length > 0) {
      toast.error(`Some scores exceed max of ${max}`);
      return;
    }

    try {
      await dispatch(
        updateTenSubjectScores({
          studentId: Number(form.studentId),
          examId: Number(form.examId),
          academicYearId: Number(form.academicYearId),
          scores: localScores.map(({ subjectId, marks }) => ({ subjectId, marks })),
        })
      ).unwrap();
      toast.success("Scores updated successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Update failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
          <h1 className="text-xl font-bold">Exam Score Management</h1>
        </div>

        <div className="p-4 border-b grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="number"
            placeholder="Student ID"
            value={form.studentId}
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            className="p-2 border rounded"
          />
          <select
            value={form.examId}
            onChange={(e) => setForm({ ...form, examId: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="1">Monthly</option>
            <option value="2">Midterm</option>
            <option value="3">Final</option>
          </select>
          <select
            value={form.academicYearId}
            onChange={(e) => setForm({ ...form, academicYearId: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="1">2024-2025</option>
            <option value="2">2025-2026</option>
          </select>
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        {studentInfo?.fullname && (
          <div className="p-4 bg-blue-50">
            <p className="text-blue-800 font-semibold">
              {studentInfo.fullname} (ID: {form.studentId})
            </p>
          </div>
        )}

        {localScores.length > 0 && (
          <div className="p-4">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Subject</th>
                  <th className="p-2 text-left">Marks</th>
                </tr>
              </thead>
              <tbody>
                {localScores.map((subj) => (
                  <tr key={subj.subjectId}>
                    <td className="p-2">{subj.subjectName}</td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={subj.marks}
                        min={0}
                        max={maxMarks[form.examId as keyof typeof maxMarks]}
                        onChange={(e) =>
                          handleMarksChange(subj.subjectId, e.target.value)
                        }
                        className="p-2 border rounded w-24"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 text-right">
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Update Scores
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateStudentScores;
