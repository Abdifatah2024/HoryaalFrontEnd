import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// ✅ Types
export interface Assignment {
  id: number;
  classId: number;
  className: string;
  subjectId: number;
  subjectName: string;
}

interface TeacherDashboardState {
  loading: boolean;
  error: string | null;
  success: string | null;
  teacherName: string;
  correctionLimit: number;
  correctionsUsed: number;
  remainingCorrections: number;
  assignments: Assignment[];
}

// ✅ Initial state
const initialState: TeacherDashboardState = {
  loading: false,
  error: null,
  success: null,
  teacherName: "",
  correctionLimit: 0,
  correctionsUsed: 0,
  remainingCorrections: 0,
  assignments: [],
};

// ✅ Thunk: Fetch Teacher Dashboard Data
export const fetchTeacherDashboard = createAsyncThunk(
  "teacherDashboard/fetch",
  async (_, { rejectWithValue, getState }) => {
    const token = localStorage.getItem("Access_token");

    // Optional: Verify role from loginSlice
    const state = getState() as { loginSlice: any };
    const role = state.loginSlice?.data?.user?.Role;

    if (role !== "Teacher") {
      return rejectWithValue("Only teachers can access the dashboard.");
    }

    try {
      const res = await axios.get(`${BASE_API_URL}/exam/dashboard-data`, {
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
const teacherDashboardSlice = createSlice({
  name: "teacherDashboard",
  initialState,
  reducers: {
    clearTeacherDashboardState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      state.teacherName = "";
      state.correctionLimit = 0;
      state.correctionsUsed = 0;
      state.remainingCorrections = 0;
      state.assignments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchTeacherDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Dashboard loaded successfully.";

        const data = action.payload;

        state.teacherName = data.teacherName;
        state.correctionLimit = data.correctionLimit;
        state.correctionsUsed = data.correctionsUsed;
        state.remainingCorrections = data.remainingCorrections;
        state.assignments = data.assignments;
      })
      .addCase(fetchTeacherDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTeacherDashboardState } = teacherDashboardSlice.actions;
export default teacherDashboardSlice.reducer;
