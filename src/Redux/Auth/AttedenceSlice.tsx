import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AttendancePayload } from "../../types/Register"; // Define your types
import { AppDispatch, RootState } from "../store";

interface AttendanceState {
  loading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  loading: false,
  error: null,
};

export const markAttendance = createAsyncThunk<
  void,
  { studentId: string; present: boolean; remark: string },
  { dispatch: AppDispatch; state: RootState }
>(
  "attendance/markAttendance",
  async (attendanceData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:4000/student/createattedence", attendanceData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message || "Failed to mark attendance");
    }
  }
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    clearAttendanceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAttendance.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAttendanceError } = attendanceSlice.actions;
export default attendanceSlice.reducer;