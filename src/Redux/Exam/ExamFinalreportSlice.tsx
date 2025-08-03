import { BASE_API_URL } from "@/Constant";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface FetchExamReportArgs {
  classId: number;
  academicYearId: number;
}

interface StudentSubject {
  subject: string;
  marks: number;
}

interface StudentReport {
  studentId: number;
  fullName: string;
  totalMarks: number;
  rank: number;
  subjects: StudentSubject[];
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
  async ({ classId, academicYearId }: FetchExamReportArgs, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_API_URL}/exam/final-exam-report`, {
        classId,
        academicYearId,
      });
      return res.data.report;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch exam report"
      );
    }
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
        state.report = [];
      })
      .addCase(fetchExamReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(fetchExamReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default examReportSlice.reducer;
