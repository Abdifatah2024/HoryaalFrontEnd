// src/Redux/Auth/classListSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// ------------------ Interfaces ------------------

export interface Student {
  id: number;
  firstname: string;
  middlename?: string;
  lastname: string;
  fourtname?: string;
  fullname: string;
  classId: string;
  phone: string;
  phone2?: string;
  bus?: string;
  address?: string;
  previousSchool?: string;
  previousSchoolType?: string;
  motherName?: string;
  gender: string;
  age: number;
  fee: number;
  amount: number;
  district: string;
  transfer: boolean;
  rollNumber: string;
  parentEmail: string;
  createdAt: Date;
  updatedAt: Date;
  classes?: { name: string }; // for class display
}

interface StudentWithBus {
  id: number;
  fullname: string;
  classId: string;
  bus: string;
  classes: {
    name: string;
  };
}

interface StudentState {
  loading: boolean;
  error: string;
  student: Student | null;
  students: Student[];
  untransferredStudents: Student[];
  untransferredLoading: boolean;
  sameBusStudents: StudentWithBus[];
  sameBusLoading: boolean;
  siblingStudent: Student | null;
  siblingLoading: boolean;
  classes: { id: number; name: string }[];
}

// ------------------ Initial State ------------------

const initialState: StudentState = {
  loading: false,
  error: "",
  student: null,
  students: [],
  untransferredStudents: [],
  untransferredLoading: false,
  sameBusStudents: [],
  sameBusLoading: false,
  siblingStudent: null,
  siblingLoading: false,
  classes: [],
};

// ------------------ Async Thunks ------------------

export const fetchAllClasses = createAsyncThunk(
  "classList/fetchAllClasses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/student/Class`);
      return res.data.classes;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch class"
        );
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

export const fetchStudentsByClassId = createAsyncThunk(
  "classList/fetchByClassId",
  async (classId: number, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_API_URL}/student/ClassList/${classId}`
      );
      return res.data.students;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch students by class"
        );
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

// ------------------ Slice ------------------

const classListSlice = createSlice({
  name: "classList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllClasses.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchAllClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(fetchAllClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStudentsByClassId.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchStudentsByClassId.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudentsByClassId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default classListSlice.reducer;
