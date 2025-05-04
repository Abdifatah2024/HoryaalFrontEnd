// components/YearlyProgressReport.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProgressReport } from "../../Redux/Exam/progressReportSlice";
import { RootState, AppDispatch } from "../../Redux/store";

interface Props {
  studentId: number;
  academicYearId: number;
}

const YearlyProgressReport = ({ studentId, academicYearId }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.progressReport
  );

  useEffect(() => {
    if (studentId && academicYearId) {
      dispatch(fetchProgressReport({ studentId, academicYearId }));
    }
  }, [studentId, academicYearId, dispatch]);

  if (loading) return <div>Loading report...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!data) return <div>No report found.</div>;

  const grandTotal = data.progressReport.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md">
      <h2 className="text-xl font-bold mb-4">
        Progress Report for {data.student.fullName} ({data.student.class})
      </h2>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border px-3 py-2">Subject</th>
            <th className="border px-3 py-2">Monthly</th>
            <th className="border px-3 py-2">Midterm</th>
            <th className="border px-3 py-2">Final</th>
            <th className="border px-3 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.progressReport.map((subject, idx) => (
            <tr key={idx}>
              <td className="border px-3 py-2">{subject.subject}</td>
              <td className="border px-3 py-2">{subject.monthly}</td>
              <td className="border px-3 py-2">{subject.midterm}</td>
              <td className="border px-3 py-2">{subject.final}</td>
              <td className="border px-3 py-2 font-semibold">{subject.total}</td>
            </tr>
          ))}
          <tr className="bg-yellow-100 font-bold">
            <td colSpan={4} className="px-3 py-2 text-right">Grand Total</td>
            <td className="px-3 py-2">{grandTotal}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default YearlyProgressReport;
