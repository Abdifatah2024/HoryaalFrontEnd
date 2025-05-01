import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchExamReport = createAsyncThunk(
  "examReport/fetchExamReport",
  async ({ classId }: { classId: number }) => {
    const res = await axios.post("http://localhost:4000/exam/final-exam-report", { classId });
    return res.data.report;
  }
);

const examReportSlice = createSlice({
  name: "examReport",
  initialState: {
    loading: false,
    report: [],
    error: null,
  },
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
        state.error = action.error.message || "Failed to load report";
      });
  },
});

export default examReportSlice.reducer;
