// RegisterTenSubjects.tsx
// (File kept unchanged, updated only subject list with 10 original subjects)

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import {
  registerTenSubjects,
  clearRegisterTenSubjectsState,
} from "../../Redux/Exam/registerTenSubjectsSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FiInfo,
  FiBook,
  FiUser,
  FiAward,
  FiRefreshCw,
  FiPrinter,
  FiDownload,
} from "react-icons/fi";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";



interface AcademicYear {
  id: number;
  year: string;
}

interface ExamType {
  value: string;
  label: string;
  maxMarks: number;
}

interface Score {
  subjectId: number;
  marks: string | number;
}

interface FormInput {
  studentId: string | number;
  examId: string;
  academicYearId: string;
  scores: Score[];
}

interface ExamEntryPDFProps {
  formInput: FormInput;
  maxMarks: number;
}

const subjectsList = [
  { id: 1, name: "English", color: "#4caf50", icon: "📘" },
  { id: 2, name: "Arabic", color: "#8bc34a", icon: "📗" },
  { id: 3, name: "Somali", color: "#2196f3", icon: "📙" },
  { id: 4, name: "Mathematics", color: "#673ab7", icon: "📐" },
  { id: 5, name: "Science", color: "#f44336", icon: "🔬" },
  { id: 6, name: "Islamic", color: "#ff9800", icon: "🕌" },
  { id: 7, name: "Social", color: "#009688", icon: "🌍" },
];

// ...rest of the code remains unchanged

const academicYears: AcademicYear[] = [
  { id: 1, year: "2024-2025" },
  { id: 2, year: "2025-2026" },
  { id: 3, year: "2026-2027" },
  { id: 4, year: "2027-2028" },
  { id: 5, year: "2028-2029" },
];

const examTypes: ExamType[] = [
  { value: "1", label: "Monthly Exam", maxMarks: 20 },
  { value: "2", label: "Midterm Exam", maxMarks: 30 },
  { value: "3", label: "Final Exam", maxMarks: 50 },
];

const ExamEntryPDF = ({ formInput, maxMarks }: ExamEntryPDFProps) => {
  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: "Helvetica",
    },
    header: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: "bold",
    },
    row: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: "#000",
      padding: 8,
    },
    cell: {
      width: "50%",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Exam Entry Form</Text>
        <View style={styles.row}>
          <Text style={styles.cell}>Student ID:</Text>
          <Text style={styles.cell}>{formInput.studentId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Academic Year:</Text>
          <Text style={styles.cell}>
            {
              academicYears.find(
                (y) => y.id === parseInt(formInput.academicYearId)
              )?.year
            }
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Exam Type:</Text>
          <Text style={styles.cell}>
            {examTypes.find((e) => e.value === formInput.examId)?.label}
          </Text>
        </View>
        <Text style={{ marginTop: 20, marginBottom: 10, fontWeight: "bold" }}>
          Subject Marks (Max: {maxMarks})
        </Text>
        {subjectsList.map((subject, index) => (
          <View key={subject.id} style={styles.row}>
            <Text style={styles.cell}>{subject.name}</Text>
            <Text style={styles.cell}>
              {formInput.scores[index]?.marks || 0}/{maxMarks}
            </Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};

const RegisterTenSubjects = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success } = useSelector(
    (state: RootState) => state.registerTenSubjects
  );
  const reportRef = useRef(null);

  const [formInput, setFormInput] = useState<FormInput>({ // Typed useState
    studentId: "",
    examId: "",
    academicYearId: "1",
    scores: subjectsList.map((subject) => ({
      subjectId: subject.id,
      marks: "",
    })),
  });

  const [maxMarks, setMaxMarks] = useState<number>(0); // Typed useState
  const [totalMarks, setTotalMarks] = useState<number>(0); // Typed useState
  const [percentage, setPercentage] = useState<number>(0); // Typed useState

  useEffect(() => {
    if (success) {
      toast.success("Registration successful!", { icon: () => <span>✅</span> });
      resetFormInput();
      dispatch(clearRegisterTenSubjectsState());
    }
    if (error) toast.error(error, { icon: () => <span>❌</span> });
  }, [success, error, dispatch]);

  useEffect(() => {
    const exam = examTypes.find((e) => e.value === formInput.examId);
    setMaxMarks(exam?.maxMarks || 0);
  }, [formInput.examId]);

  useEffect(() => {
    const validScores = formInput.scores.filter(
      (s) => !isNaN(parseInt(s.marks as string)) // Cast to string for parseInt
    );
    const total = validScores.reduce(
      (sum, s) => sum + parseInt(s.marks as string), // Cast to string for parseInt
      0
    );
    setTotalMarks(total);
    // Ensure maxMarks * subjectsList.length is not zero to prevent division by zero
    const maxPossibleTotal = maxMarks * subjectsList.length;
    setPercentage(maxPossibleTotal > 0 ? (total / maxPossibleTotal) * 100 : 0);
  }, [formInput.scores, maxMarks]);

  const resetFormInput = () => {
    setFormInput({
      studentId: "",
      examId: "",
      academicYearId: "1",
      scores: subjectsList.map((s) => ({
        subjectId: s.id,
        marks: "",
      })),
    });
    setMaxMarks(0);
    setTotalMarks(0);
    setPercentage(0);
  };

  const handleMarksChange = (index: number, value: string) => {
    const numericValue = Math.min(parseInt(value) || 0, maxMarks);
    const scores = [...formInput.scores];
    scores[index].marks = numericValue.toString();
    setFormInput({ ...formInput, scores });
  };

  const handleSubmit = async () => {
    if (!formInput.studentId || !formInput.examId) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      ...formInput,
      studentId: parseInt(formInput.studentId as string), // Ensure studentId is parsed to number
      examId: parseInt(formInput.examId),
      academicYearId: parseInt(formInput.academicYearId),
      scores: formInput.scores.map((s) => ({
        subjectId: s.subjectId,
        marks: parseInt(s.marks as string), // Ensure marks are parsed to number
      })),
    };

    try {
      await dispatch(registerTenSubjects(payload));
    } catch (_err) { // Changed 'err' to '_err' to avoid unused variable warning
      toast.error("Submission failed");
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div ref={reportRef} className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Academic Performance Dashboard
          </motion.h1>
          <p className="mt-2 text-gray-600 flex items-center justify-center gap-2">
            <FiInfo className="text-blue-500 animate-pulse" />
            Comprehensive Student Assessment Interface
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiUser className="inline mr-2 text-blue-600" />
                  Student ID
                </label>
                <input
                  type="number"
                  value={formInput.studentId}
                  onChange={(e) => setFormInput({ ...formInput, studentId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Student ID"
                />
              </div>

              <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiBook className="inline mr-2 text-purple-600" />
                  Academic Year
                </label>
                <select
                  value={formInput.academicYearId}
                  onChange={(e) => setFormInput({ ...formInput, academicYearId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  {academicYears.map((year) => (
                    <option key={year.id} value={year.id}>{year.year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiAward className="inline mr-2 text-green-600" />
                Exam Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {examTypes.map((exam) => (
                  <motion.button
                    key={exam.value}
                    whileHover={{ scale: 1.05 }}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors
                      ${formInput.examId === exam.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-200'}`}
                    onClick={() => setFormInput({ ...formInput, examId: exam.value })}
                  >
                    {exam.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Subjects Grid */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Subject Performance Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjectsList.map((subject, index) => (
                  <div key={subject.id} className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{subject.icon} {subject.name}</span>
                      <span className="text-sm text-gray-500">Max: {maxMarks}</span>
                    </div>
                    <input
                      type="number"
                      value={formInput.scores[index].marks}
                      onChange={(e) => handleMarksChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter marks"
                      min="0"
                      max={maxMarks}
                      disabled={!formInput.examId}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-6">
            {/* Performance Summary */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-xl text-white">
              <h3 className="text-xl font-bold mb-4">Performance Analytics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Marks:</span>
                  <span className="font-bold text-2xl">{totalMarks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Percentage:</span>
                  <span className="font-bold text-2xl">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={handleSubmit}
                disabled={loading}
                className="py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <FiRefreshCw className="animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Save All Records"
                )}
              </motion.button>

              <div className="grid grid-cols-2 gap-3">
                <PDFDownloadLink
                  document={<ExamEntryPDF formInput={formInput} maxMarks={maxMarks} />}
                  fileName="academic-report.pdf"
                >
                  {({ loading: pdfLoading }) => ( // Renamed loading to pdfLoading to avoid conflict
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-center gap-2 py-2 bg-green-100 text-green-700 rounded-lg"
                    >
                      <FiDownload /> {pdfLoading ? "Generating..." : "Export PDF"}
                    </motion.button>
                  )}
                </PDFDownloadLink>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={resetFormInput}
                  className="flex items-center justify-center gap-2 py-2 bg-red-100 text-red-700 rounded-lg"
                >
                  <FiRefreshCw /> Reset Form
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 py-2 bg-purple-100 text-purple-700 rounded-lg"
              >
                <FiPrinter /> Print Summary
              </motion.button>
            </div>

            {/* Exam Type Legend */}
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h4 className="font-medium mb-3">Grading Scale Reference</h4>
              <div className="space-y-2">
                {examTypes.map((exam) => (
                  <div key={exam.value} className="flex justify-between text-sm">
                    <span>{exam.label}:</span>
                    <span className="text-gray-600">Max {exam.maxMarks} marks</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            background: white !important;
          }
          button, input, select {
            display: none !important;
          }
          .print-content {
            width: 100% !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterTenSubjects;