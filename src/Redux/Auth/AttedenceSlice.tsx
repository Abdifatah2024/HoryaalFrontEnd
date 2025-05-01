import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from '../../Constant';
import type { RootState } from '../../Redux/store';

interface AttendanceRecord {
  id: number;
  date: string;
  present: boolean;
  remark: string;
  studentId: number;
  userId: number;
  user: {
    fullName: string;
  };
}

interface AttendanceState {
  markStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  attendance: AttendanceRecord | null;
  attendanceRecords: AttendanceRecord[];
}

const initialState: AttendanceState = {
  markStatus: 'idle',
  fetchStatus: 'idle',
  updateStatus: 'idle',
  error: null,
  attendance: null,
  attendanceRecords: [],
};

// 🔹 Mark Attendance
export const markAttendance = createAsyncThunk(
  'attendance/mark',
  async (
    { studentId, present, remark }: { studentId: number; present: boolean; remark: string },
    { rejectWithValue, getState }
  ) => {
    const stateData: any = getState();
         // add Bearar token.
         const userData = localStorage.getItem("userData");
         const parsedData = userData ? JSON.parse(userData) : null;
    const { Access_token = null } = stateData?.loginSlice?.data || {};
    try {
      const response = await axios.post(
        `${BASE_API_URL}/student/createattedence`,
        { studentId, present, remark },
        { headers: { Authorization: `Bearer ${Access_token}` } }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

// 🔹 Fetch Attendance with optional date/present
export const fetchAttendanceRecords = createAsyncThunk(
  'attendance/fetchRecords',
  async (
    { studentId, date, present }: { studentId: number; date?: string; present?: boolean },
    { rejectWithValue, getState }
  ) => {
    const stateData: any = getState();
    const { Access_token = null } = stateData?.loginSlice?.data || {};

    const queryParams = new URLSearchParams();
    if (date) queryParams.append('date', date);
    if (present !== undefined) queryParams.append('present', String(present));

    try {
      const response = await axios.get(
        `${BASE_API_URL}/student/attedencelist/${studentId}?${queryParams.toString()}`,
        { headers: { Authorization: `Bearer ${Access_token}` } }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

// 🔹 Update Attendance
export const updateAttendanceRecord = createAsyncThunk(
  'attendance/updateRecord',
  async (
    { id, present, remark }: { id: number; present: boolean; remark: string },
    { rejectWithValue, getState }
  ) => {
    const stateData: any = getState();
    const { Access_token = null } = stateData?.loginSlice?.data || {};

    try {
      const response = await axios.put(
        `${BASE_API_URL}/student/attendance/${id}`,
        { present, remark },
        { headers: { Authorization: `Bearer ${Access_token}` } }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    resetAttendanceStatus: (state) => {
      state.markStatus = 'idle';
      state.fetchStatus = 'idle';
      state.updateStatus = 'idle';
      state.error = null;
    },
    clearAttendanceRecords: (state) => {
      state.attendanceRecords = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(markAttendance.pending, (state) => {
        state.markStatus = 'loading';
        state.error = null;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.markStatus = 'succeeded';
        state.attendance = action.payload.attendance;
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.markStatus = 'failed';
        state.error = action.payload as string;
      })

      .addCase(fetchAttendanceRecords.pending, (state) => {
        state.fetchStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchAttendanceRecords.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.attendanceRecords = action.payload.records || action.payload;
      })
      .addCase(fetchAttendanceRecords.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload as string;
      })

      .addCase(updateAttendanceRecord.pending, (state) => {
        state.updateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateAttendanceRecord.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.attendance = action.payload.attendance;
        state.attendanceRecords = state.attendanceRecords.map((record) =>
          record.id === action.payload.attendance.id ? action.payload.attendance : record
        );
      })
      .addCase(updateAttendanceRecord.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { resetAttendanceStatus, clearAttendanceRecords } = attendanceSlice.actions;

export const selectAttendance = (state: RootState) => state.attendanceSlice;
export const selectAttendanceRecords = (state: RootState) => state.attendanceSlice.attendanceRecords;
export const selectAttendanceMarkStatus = (state: RootState) => state.attendanceSlice.markStatus;
export const selectAttendanceFetchStatus = (state: RootState) => state.attendanceSlice.fetchStatus;
export const selectAttendanceUpdateStatus = (state: RootState) => state.attendanceSlice.updateStatus;
export const selectAttendanceError = (state: RootState) => state.attendanceSlice.error;

export default attendanceSlice.reducer;