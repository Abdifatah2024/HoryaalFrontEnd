import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

interface Teacher {
  id: number;
  fullName: string;
}

interface CorrectionState {
  teachers: Teacher[];
  correctionLimit: number;
  correctionsUsed: number;
  remaining: number;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: CorrectionState = {
  teachers: [],
  correctionLimit: 0,
  correctionsUsed: 0,
  remaining: 0,
  loading: false,
  error: null,
  success: null,
};

// ✅ Fetch all teachers
export const fetchAllTeachers = createAsyncThunk(
  "teacherCorrection/fetchAllTeachers",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("Access_token");
    try {
      const response = await axios.get(`${BASE_API_URL}/user/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
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

// ✅ Fetch correction status by teacher ID (Admin)
export const fetchTeacherCorrectionStatus = createAsyncThunk(
  "teacherCorrection/fetchStatus",
  async (userId: number, { rejectWithValue }) => {
    const token = localStorage.getItem("Access_token");
    try {
      const response = await axios.get(
        `${BASE_API_URL}/exam/admin/teacher/${userId}/correction-limit`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
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

// ✅ Set correction limit (Admin)
export const setTeacherCorrectionLimit = createAsyncThunk(
  "teacherCorrection/setLimit",
  async (
    data: { userId: number; correctionLimit: number },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("Access_token");
    try {
      const response = await axios.put(
        `${BASE_API_URL}/exam/admin/user/set-correction-limit`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
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

const teacherCorrectionSlice = createSlice({
  name: "teacherCorrection",
  initialState,
  reducers: {
    clearCorrectionState: (state) => {
      state.teachers = [];
      state.correctionLimit = 0;
      state.correctionsUsed = 0;
      state.remaining = 0;
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all teachers
      .addCase(fetchAllTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload;
      })
      .addCase(fetchAllTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch correction status
      .addCase(fetchTeacherCorrectionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchTeacherCorrectionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.correctionLimit = action.payload.correctionLimit;
        state.correctionsUsed = action.payload.correctionsUsed;
        state.remaining = action.payload.remainingCorrections; // ✅ fixed key
      })
      .addCase(fetchTeacherCorrectionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Set correction limit
      .addCase(setTeacherCorrectionLimit.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(setTeacherCorrectionLimit.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Correction limit updated.";
      })
      .addCase(setTeacherCorrectionLimit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCorrectionState } = teacherCorrectionSlice.actions;
export default teacherCorrectionSlice.reducer;
