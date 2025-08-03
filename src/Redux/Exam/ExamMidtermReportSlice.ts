// src/Redux/Exam/ExamMidtermReportSlice.ts
import { BASE_API_URL } from "@/Constant";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface Subject {
  subject: string;
  marks: number;
}

interface Student {
  studentId: number;
  fullName: string;
  totalMarks: number;
  rank: number;
  subjects: Subject[];
}

interface ExamReportState {
  report: Student[];
  loading: boolean;
  error: string | null;
}

const initialState: ExamReportState = {
  report: [],
  loading: false,
  error: null,
};

// Thunk to fetch midterm report
export const fetchMidtermReport = createAsyncThunk(
  "midtermReport/fetch",
  async ({ classId }: { classId: number }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${BASE_API_URL}/exam/report/midterm-monthly`,
        { classId }
      );
      return res.data.report;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Error fetching midterm report"
      );
    }
  }
);

const midtermReportSlice = createSlice({
  name: "midtermReport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMidtermReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMidtermReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(fetchMidtermReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default midtermReportSlice.reducer;
