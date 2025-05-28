import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Type for each absent student
export interface AbsentStudent {
  studentId: number;
  fullname: string;
  classId: number;
  className?: string;
  remark: string;
  date: string;
}

// Slice state type
interface AttendanceState {
  absentStudents: AbsentStudent[];
  loading: boolean;
  errorMessage: string | null;
}

// Initial state
const initialState: AttendanceState = {
  absentStudents: [],
  loading: false,
  errorMessage: null,
};

// Thunk to fetch absentees by date
export const fetchAbsentStudentsByDate = createAsyncThunk<
  AbsentStudent[],
  string,
  { rejectValue: string }
>("attendance/fetchAbsentStudentsByDate", async (date, thunkAPI) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/attendance/absent-today`,
      {
        params: { date },
      }
    );
    return response.data.absentStudents as AbsentStudent[];
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || "Failed to fetch data"
    );
  }
});

// Slice
const attendanceSlice = createSlice({
  name: "attendancePerClass",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAbsentStudentsByDate.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(
        fetchAbsentStudentsByDate.fulfilled,
        (state, action: PayloadAction<AbsentStudent[]>) => {
          state.loading = false;
          state.absentStudents = action.payload;
        }
      )
      .addCase(
        fetchAbsentStudentsByDate.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.errorMessage = action.payload;
        }
      );
  },
});

export default attendanceSlice.reducer;
