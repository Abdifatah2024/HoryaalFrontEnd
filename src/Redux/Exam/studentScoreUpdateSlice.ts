import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

interface UpdatedScore {
  id: number;
  studentId: number;
  subjectId: number;
  examId: number;
  academicYearId: number;
  marks: number;
  userid: number;
  correctionCount: number;
  correctionLimit: number;
  lastUpdatedAt: string;
  lastUpdatedBy: number;
}

interface StudentScoreState {
  loading: boolean;
  error: string | null;
  success: string | null;
  updatedScore: UpdatedScore | null;
}

const initialState: StudentScoreState = {
  loading: false,
  error: null,
  success: null,
  updatedScore: null,
};

// ✅ Thunk: Update Student Score
export const updateStudentScore = createAsyncThunk(
  "studentScore/updateStudentScore",
  async (
    data: {
      studentId: number;
      subjectId: number;
      examId: number;
      academicYearId: number;
      newMarks: number;
    },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("Access_token");

    try {
      const res = await axios.put(`${BASE_API_URL}/exam/scores/update`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

// ✅ Slice
const studentScoreSlice = createSlice({
  name: "studentScore",
  initialState,
  reducers: {
    clearStudentScoreState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      state.updatedScore = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateStudentScore.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.updatedScore = null;
      })
      .addCase(updateStudentScore.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Score updated successfully.";
        state.updatedScore = action.payload.updatedScore;
      })
      .addCase(updateStudentScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.updatedScore = null;
      });
  },
});

export const { clearStudentScoreState } = studentScoreSlice.actions;
export default studentScoreSlice.reducer;
