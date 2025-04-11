// src/Redux/Student/studentSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchStudentById = createAsyncThunk(
  'student/fetchStudentById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/student/${id}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Error fetching student');
    }
  }
);

interface StudentState {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: StudentState = {
  data: null,
  loading: false,
  error: null,
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default studentSlice.reducer;
