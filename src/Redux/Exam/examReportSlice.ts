// src/store/slices/examReportSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface SubjectScore {
  subject: string;
  marks: number;
}

export interface StudentReport {
  studentId: number;
  fullName: string;
  totalMarks: number;
  rank: number;
  subjects: SubjectScore[];
}

interface ExamReportState {
  loading: boolean;
  report: StudentReport[];
  error: string | null;
}

const initialState: ExamReportState = {
  loading: false,
  report: [],
  error: null,
};

export const fetchExamReport = createAsyncThunk(
  "examReport/fetchExamReport",
  async ({ classId, examId }: { classId: number; examId: number }) => {
    const response = await axios.post(
      "http://localhost:4000/exam/exam-report",
      { classId, examId }
    );
    return response.data.report;
  }
);

const examReportSlice = createSlice({
  name: "examReport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExamReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(fetchExamReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch exam report";
      });
  },
});

export default examReportSlice.reducer;
