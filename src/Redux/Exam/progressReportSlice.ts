// Redux/Exam/progressReportSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

interface SubjectReport {
  subject: string;
  monthly: number;
  midterm: number;
  final: number;
  total: number;
}

interface ProgressReportState {
  loading: boolean;
  error: string | null;
  data: {
    student: { id: number; fullName: string; class: string };
    academicYearId: number;
    progressReport: SubjectReport[];
  } | null;
}

const initialState: ProgressReportState = {
  loading: false,
  error: null,
  data: null,
};

export const fetchProgressReport = createAsyncThunk(
  "progressReport/fetch",
  async (
    {
      studentId,
      academicYearId,
    }: { studentId: number; academicYearId: number },
    { rejectWithValue, getState }
  ) => {
    const token = (getState() as RootState).loginSlice.data?.Access_token;
    try {
      const res = await axios.post(
        "http://localhost:4000/exam/reports/yearly-progress-report",
        { studentId, academicYearId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch report"
      );
    }
  }
);

const progressReportSlice = createSlice({
  name: "progressReport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgressReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgressReport.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProgressReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default progressReportSlice.reducer;
