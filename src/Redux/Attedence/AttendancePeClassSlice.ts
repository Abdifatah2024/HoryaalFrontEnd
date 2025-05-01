import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";
import axios, { AxiosError } from "axios";
import { RootState } from "../../Redux/store";

// ✅ Added missing interface for ClassItem
interface ClassItem {
  id: number;
  name: string;
  // ... other properties
}

interface AttendanceState {
  loading: boolean;
  saving: boolean;
  classList: ClassItem[];
  successMessage: string;
  errorMessage: string;
}

const initialState: AttendanceState = {
  loading: false,
  saving: false,
  classList: [],
  successMessage: "",
  errorMessage: "",
};

export const fetchClasses = createAsyncThunk(
  "attendance/fetchClasses",
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const { Access_token = null } = state.loginSlice?.data || {};

    try {
      const res = await axios.get(`${BASE_API_URL}/student/classList`, {
        // ✅ Fixed typo: classtList → classList
        headers: { Authorization: `Bearer ${Access_token}` },
      });
      return res.data; // ✅ full array is response body
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

export const saveClassAttendance = createAsyncThunk(
  "attendance/saveClassAttendance",
  async (
    payload: { studentId: number; present: boolean; remark: string }[],
    { rejectWithValue, getState }
  ) => {
    const state = getState() as RootState;
    const { Access_token = null } = state.loginSlice?.data || {};

    if (!Access_token) {
      return rejectWithValue("Access token missing. Please login.");
    }

    try {
      const requests = payload.map((attend) =>
        axios.post(`${BASE_API_URL}/student/createattendance`, attend, {
          // ✅ Fixed typo: createattedence → createattendance
          headers: { Authorization: `Bearer ${Access_token}` },
        })
      );
      const results = await Promise.allSettled(requests); // ✅ Better error handling for partial failures
      const failed = results.filter((res) => res.status === "rejected");
      if (failed.length > 0) {
        throw new Error("Some attendance records failed to save.");
      }
      return "Attendance saved successfully!";
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

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    clearAttendanceState: (state) => {
      state.loading = false;
      state.saving = false;
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classList = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload as string;
      })
      .addCase(saveClassAttendance.pending, (state) => {
        state.saving = true;
        state.successMessage = "";
        state.errorMessage = "";
      })
      .addCase(saveClassAttendance.fulfilled, (state, action) => {
        state.saving = false;
        state.successMessage = action.payload as string;
      })
      .addCase(saveClassAttendance.rejected, (state, action) => {
        state.saving = false;
        state.errorMessage = action.payload as string;
      });
  },
});

export const { clearAttendanceState } = attendanceSlice.actions;
export default attendanceSlice.reducer;
