// features/absence/absenceSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface AbsenceRecord {
  date: string;
  remark: string;
}

interface AbsenceItem {
  id: number;
  name: string;
  totalAbsences: number;
  recentAbsences: AbsenceRecord[];
}

interface AbsenceState {
  data: AbsenceItem[];
  loading: boolean;
  error: string | null;
}

const initialState: AbsenceState = {
  data: [],
  loading: false,
  error: null
};

export const fetchAbsences = createAsyncThunk(
  'absence/fetchAbsences',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:4000/student/attendance/top-absent');
      return response.data.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch absence data');
    }
  }
);

const absenceSlice = createSlice({
  name: 'absence',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAbsences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAbsences.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAbsences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default absenceSlice.reducer;