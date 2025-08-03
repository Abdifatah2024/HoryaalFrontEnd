// src/features/students/studentSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { RootState } from "../../Redux/store";
import { BASE_API_URL } from "@/Constant";

// Types
export interface Student {
  id: number;
  fullname: string;
  gender: string;
  phone: string;
  fee: number;
  status: string;
}

interface StudentState {
  students: Student[];
  loading: boolean;
  error: string | null;
}

const initialState: StudentState = {
  students: [],
  loading: false,
  error: null,
};

// Async thunk to fetch students by classId
export const getStudentsByClass = createAsyncThunk(
  "students/getByClass",
  async (classId: number, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `'${BASE_API_URL}/student/ClassList/${classId}`
      );
      return res.data.students;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to fetch students";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Slice
const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    clearStudentsState: (state) => {
      state.error = null;
      state.students = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStudentsByClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudentsByClass.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(getStudentsByClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearStudentsState } = studentSlice.actions;

export const selectStudents = (state: RootState) => state.ListStdinClass;

export default studentSlice.reducer;
