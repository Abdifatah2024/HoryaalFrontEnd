import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface BulkState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BulkState = {
  status: 'idle',
  error: null,
};

// Thunk
export const markAbsenteesBulk = createAsyncThunk(
  'attendance/markAbsenteesBulk',
  async (
    { studentIds, date }: { studentIds: number[]; date: string },
    { rejectWithValue, getState }
  ) => {
    const stateData: any = getState();
    const { Access_token = null } = stateData?.loginSlice?.data || {};

    try {
      const response = await axios.post(
        'http://localhost:4000/student/mark-absentees',
        { studentIds, date },
        {
          headers: { Authorization: `Bearer ${Access_token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark absentees.');
    }
  }
);

const bulkAttendanceSlice = createSlice({
  name: 'bulkAttendance',
  initialState,
  reducers: {
    resetBulkStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(markAbsenteesBulk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(markAbsenteesBulk.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(markAbsenteesBulk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { resetBulkStatus } = bulkAttendanceSlice.actions;

export const selectBulkStatus = (state: any) => state.bulkAttendance.status;
export const selectBulkError = (state: any) => state.bulkAttendance.error;

export default bulkAttendanceSlice.reducer;
