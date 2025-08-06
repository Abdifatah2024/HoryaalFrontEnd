import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import {
  fetchStudentExams,
  clearStudentExams,
} from "../../Redux/Exam/studentExamsSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const StudentExams = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { student, exams, academicYear } = useSelector((state: RootState) => state.studentExams);
  const [studentIdInput, setStudentIdInput] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");

  const handleSearch = () => {
    if (!studentIdInput || !academicYearId) return;
    dispatch(clearStudentExams());
    dispatch(fetchStudentExams({ studentId: Number(studentIdInput), academicYearId: Number(academicYearId) }));
  };

  const generatePDF = () => {
    if (!student) return;

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("HORYAAL PRIMARY SCHOOL", 105, 20, { align: "center" });
    doc.setFontSize(14);
    doc.text("Official Academic Transcript", 105, 28, { align: "center" });

    doc.setFontSize(11);
    doc.text(`Student Name: ${student.fullName}`, 14, 40);
    doc.text(`Student ID: ${student.id}`, 14, 48);
    doc.text(`Class: ${student.class}`, 14, 56);
    doc.text(`Academic Year: ${academicYear || "N/A"}`, 14, 64);

    const headers = [["Subject", "Monthly", "Midterm", "Final", "Total", "Grade"]];

    const rows = subjectPerformance.map((subject) => [
      subject.subjectName,
      subject.monthly,
      subject.midterm,
      subject.final,
      subject.total,
      subject.grade,
    ]);

    rows.push([
      "Total",
      monthlyTotal,
      midtermTotal,
      finalTotal,
      combinedTotal,
      "-"
    ]);

    autoTable(doc, {
      startY: 70,
      head: headers,
      body: rows,
      styles: { halign: 'center' },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.text(`Combined Total: ${combinedTotal} / ${maxPossible}`, 14, finalY);
    doc.text(`Percentage: ${percentage}%`, 14, finalY + 6);

    doc.setFontSize(10);
    doc.text("This document is system-generated and does not require a signature.", 14, finalY + 16);

    doc.save(`Exam_Report_${student.fullName.replace(/\s/g, '_')}.pdf`);
  };

  const monthlyTotal = exams.find(e => e.examName === 'Monthly Exam')?.subjectScores.reduce((sum, s) => sum + s.marks, 0) || 0;
  const midtermTotal = exams.find(e => e.examName === 'Midterm')?.subjectScores.reduce((sum, s) => sum + s.marks, 0) || 0;
  const finalTotal = exams.find(e => e.examName === 'Final')?.subjectScores.reduce((sum, s) => sum + s.marks, 0) || 0;
  const combinedTotal = monthlyTotal + midtermTotal + finalTotal;
  const maxPossible = exams[0]?.subjectScores.length * 100 || 500;
  const percentage = ((combinedTotal / maxPossible) * 100).toFixed(1);

  const subjectPerformance = exams[0]?.subjectScores.map(subject => {
    const monthly = exams.find(e => e.examName === 'Monthly Exam')?.subjectScores.find(s => s.subjectName === subject.subjectName)?.marks || 0;
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
    };
  }) || [];

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">📚 Student Exam Report</h1>

      <div className="flex flex-wrap gap-4 mb-8 items-center">
        <input
          type="number"
          placeholder="Enter Student ID"
          value={studentIdInput}
          onChange={(e) => setStudentIdInput(e.target.value)}
          className="border border-gray-300 p-2 rounded w-40 shadow-sm"
        />
        <select
          value={academicYearId}
          onChange={(e) => setAcademicYearId(e.target.value)}
          className="border border-gray-300 p-2 rounded shadow-sm"
        >
          <option value="">Select Year</option>
          <option value="1">2024-2025</option>
          <option value="2">2025-2026</option>
          <option value="3">2026-2027</option>
        </select>
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Search</button>
        <button onClick={generatePDF} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Download PDF</button>
      </div>

      {student && (
        <div className="bg-white p-6 rounded shadow-md">
          <div className="mb-4">
            <p><strong>👤 Name:</strong> {student.fullName}</p>
            <p><strong>🏫 Class:</strong> {student.class}</p>
            <p><strong>📅 Academic Year:</strong> {academicYear}</p>
          </div>

          <table className="w-full table-auto border border-gray-300">
            <thead className="bg-blue-100">
              <tr>
                <th className="border p-2">Subject</th>
                <th className="border p-2">Monthly</th>
                <th className="border p-2">Midterm</th>
                <th className="border p-2">Final</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {subjectPerformance.map((s) => (
                <tr key={s.subjectName} className="text-center">
                  <td className="border p-2 text-left">{s.subjectName}</td>
                  <td className="border p-2">{s.monthly}</td>
                  <td className="border p-2">{s.midterm}</td>
                  <td className="border p-2">{s.final}</td>
                  <td className="border p-2 font-semibold">{s.total}</td>
                  <td className="border p-2">{s.grade}</td>
                </tr>
              ))}
              <tr className="bg-gray-200 font-semibold text-center">
                <td className="border p-2 text-left">Total</td>
                <td className="border p-2">{monthlyTotal}</td>
                <td className="border p-2">{midtermTotal}</td>
                <td className="border p-2">{finalTotal}</td>
                <td className="border p-2">{combinedTotal}</td>
                <td className="border p-2">-</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-6">
            <p><strong>✅ Combined Total:</strong> {combinedTotal} / {maxPossible}</p>
            <p><strong>📊 Percentage:</strong> {percentage}%</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentExams;
