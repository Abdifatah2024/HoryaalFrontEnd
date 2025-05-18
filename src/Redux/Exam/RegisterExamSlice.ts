import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

interface ExamScoreEntry {
  studentId: number;
  scores: { subjectId: number; marks: number }[];
}

interface RegisterClassExamPayload {
  classId: number;
  academicYearId: number;
  examId: number;
  entries: ExamScoreEntry[];
}

interface RegisterClassExamState {
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: RegisterClassExamState = {
  loading: false,
  error: null,
  success: null,
};

export const registerClassExam = createAsyncThunk(
  "exam/registerClassExam",
  async (data: RegisterClassExamPayload, { rejectWithValue }) => {
    const token = localStorage.getItem("Access_token");
    try {
      const res = await axios.post(
        `${BASE_API_URL}/exam/registerClassExam`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || DEFAULT_ERROR_MESSAGE
        );
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

const registerClassExamSlice = createSlice({
  name: "registerClassExam",
  initialState,
  reducers: {
    clearRegisterClassExamState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerClassExam.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(registerClassExam.fulfilled, (state) => {
        state.loading = false;
        state.success = "Class exam scores registered successfully.";
      })
      .addCase(registerClassExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearRegisterClassExamState } = registerClassExamSlice.actions;

export default registerClassExamSlice.reducer;
