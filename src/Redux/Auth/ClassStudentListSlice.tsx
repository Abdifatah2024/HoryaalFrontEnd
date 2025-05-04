import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ClassItem } from '../../types/ClassListTypes';

interface ClassState {
  classes: ClassItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ClassState = {
  classes: [],
  status: 'idle',
  error: null,
};

export const fetchClasses = createAsyncThunk<ClassItem[]>(
  'class/fetchClasses',
  async () => {
    const response = await axios.get<ClassItem[]>('http://localhost:4000/student/classtListstd'); // Replace with your real API
    return response.data;
  }
);

const classSlice = createSlice({
  name: 'class',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchClasses.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Something went wrong';
      });
  },
});

export default classSlice.reducer;
