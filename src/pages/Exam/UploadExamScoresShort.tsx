import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import * as XLSX from "xlsx";
import { AppDispatch } from "../../Redux/store";
import { uploadExamExcel } from "../../Redux/Exam/examUploadSlice";
import { FiDownload, FiFile, FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";

const subjectsList = [
  { id: 1, name: "English", color: "#4caf50", icon: "📘" },
  { id: 2, name: "Arabic", color: "#8bc34a", icon: "📗" },
  { id: 3, name: "Somali", color: "#2196f3", icon: "📙" },
  { id: 4, name: "Mathematics", color: "#673ab7", icon: "📐" },
  { id: 5, name: "Science", color: "#f44336", icon: "🔬" },
  { id: 6, name: "Islamic", color: "#ff9800", icon: "🕌" },
  { id: 7, name: "Social", color: "#009688", icon: "🌍" },
];

interface ExcelRow {
  studentId: number;
  examName: string;
  academicYearId: number;
  [subject: string]: string | number;
}

const UploadExamScoresShort = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<ExcelRow[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file);
    setResponse(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target?.result, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<ExcelRow>(ws);

        if (rows.length === 0) {
          toast.error("Excel file is empty");
          return;
        }

        const required = ["studentId", "examName", "academicYearId"];
        const missing = required.filter((field) => !(field in rows[0]));
        if (missing.length) {
          toast.error(`Missing fields: ${missing.join(", ")}`);
          return;
        }

        setData(rows);
      } catch {
        toast.error("Invalid file format");
      }
    };
    reader.readAsBinaryString(file);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!data.length || !file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await dispatch(uploadExamExcel(formData)).unwrap();
      setResponse(res);

      if (res.insertedCount === 0 && res.skippedCount > 0) {
        toast.error(`❌ ${res.message} Skipped: ${res.skippedCount}`);
      } else {
        toast.success(`✅ Inserted: ${res.insertedCount}, Skipped: ${res.skippedCount}`);
      }

      setData([]);
      setFile(null);
    } catch (err: any) {
      toast.error(err.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  }, [dispatch, data, file]);

  const handleDownloadTemplate = () => {
    const sample = {
      studentId: 101,
      examName: "Monthly Exam",
      academicYearId: 1,
      ...Object.fromEntries(subjectsList.map((s) => [s.name, 0])),
    };
    const ws = XLSX.utils.json_to_sheet([sample]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ExamScores");
    XLSX.writeFile(wb, "Exam_Score_Template_Short.xlsx");
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Upload Short Exam Scores</h2>

      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-600">Upload Excel file with 7 subject scores.</p>
        <button
          onClick={handleDownloadTemplate}
          className="bg-green-100 text-green-800 px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FiDownload /> Download Template
        </button>
      </div>

      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
        className="mb-4 block"
      />

      {file && (
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <FiFile />
          {file.name} ({(file.size / 1024).toFixed(1)} KB)
        </div>
      )}

      {data.length > 0 && (
        <div className="overflow-x-auto mt-4 mb-6">
          <p className="text-sm text-gray-500 mb-2">Preview first 5 records:</p>
          <table className="min-w-full border text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Student ID</th>
                <th className="border px-3 py-2">Exam Name</th>
                <th className="border px-3 py-2">Academic Year</th>
                {subjectsList.map((s) => (
                  <th key={s.id} className="border px-3 py-2">{s.icon} {s.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 5).map((row, idx) => (
                <tr key={idx}>
                  <td className="border px-3 py-1">{row.studentId}</td>
                  <td className="border px-3 py-1">{row.examName}</td>
                  <td className="border px-3 py-1">{row.academicYearId}</td>
                  {subjectsList.map((s) => (
                    <td key={s.id} className="border px-3 py-1">
                      {row[s.name] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {response?.skippedDetails?.length > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-semibold text-red-600 mb-2">Skipped Records</h4>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-3 py-1">Row</th>
                <th className="border px-3 py-1">Reason</th>
              </tr>
            </thead>
            <tbody>
              {response.skippedDetails.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="border px-3 py-1">{item.row}</td>
                  <td className="border px-3 py-1">{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !data.length}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md mt-4 flex items-center gap-2"
      >
        {loading ? "Uploading..." : <><FiUpload /> Upload Scores</>}
      </button>
    </div>
  );
};

export default UploadExamScoresShort;
