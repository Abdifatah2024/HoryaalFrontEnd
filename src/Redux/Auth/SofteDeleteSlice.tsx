import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../Redux/store';
import { BASE_API_URL } from '@/Constant';

interface Student {
  id: number;
  firstname: string;
  middlename: string | null;
  lastname: string;
  fullname: string;
  classId: number;
  phone: string;
  gender: string;
  Age: number;
  fee: number;
  Amount: number;
  isdeleted: boolean;
  userid: number;
}

interface DeleteStudentState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deletedStudent: Student | null;
}

const initialState: DeleteStudentState = {
  loading: false,
  error: null,
  success: false,
  deletedStudent: null,
};

export const deleteStudent = createAsyncThunk(
  'students/delete',
  async (studentId: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_API_URL}/student/delete-all/${studentId}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to delete student');
      }
      return rejectWithValue('Network error occurred');
    }
  }
);

const deleteStudentSlice = createSlice({
  name: 'deleteStudent',
  initialState,
  reducers: {
    resetDeleteState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.deletedStudent = action.payload.student;
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetDeleteState } = deleteStudentSlice.actions;
export const selectDeleteStudent = (state: RootState) => state.deleteStudent;

export default deleteStudentSlice.reducer;