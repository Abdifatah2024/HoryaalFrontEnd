// src/store/slices/studentBusSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../Constant";

// Types
interface StudentBus {
  id: number;
  fullname: string;
  classId: number;
  fee: number;
  bus: string | null;
  totalFee: number;
  schoolFee: number;
  busFee: number;
  classes: {
    name: string;
  };
}

interface StudentBusState {
  withBus: StudentBus[];
  withoutBus: StudentBus[];
  loading: boolean;
  error: string;
}

export interface Student {
  id: number;
  fullname: string;
  email: string;
  busNumber?: string; // Adjust fields based on your actual API response
}

// Initial State
const initialState: StudentBusState = {
  withBus: [],
  withoutBus: [],
  loading: false,
  error: "",
};

// Fetch students with bus

export const fetchStudentsWithBus = createAsyncThunk<
  // Return type on success:
  StudentBus[],
  // Argument type:
  void,
  // ThunkAPI config (includes rejectWithValue type):
  {
    rejectValue: string;
  }
>("studentBus/fetchWithBus", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${BASE_API_URL}/student/students/with-bus`);
    return res.data.students;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || DEFAULT_ERROR_MESSAGE
    );
  }
});

// Fetch students without bus
export const fetchStudentsWithoutBus = createAsyncThunk<
  StudentBus[], // ✅ Success return type
  void, // ✅ No parameters
  {
    rejectValue: string; // ✅ Rejected value type
  }
>("studentBus/fetchWithoutBus", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${BASE_API_URL}/student/students/without-bus`);
    return res.data.students;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || DEFAULT_ERROR_MESSAGE
    );
  }
});

// Slice
const studentBusSlice = createSlice({
  name: "studentBus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // With Bus
      .addCase(fetchStudentsWithBus.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchStudentsWithBus.fulfilled, (state, action) => {
        state.loading = false;
        state.withBus = action.payload;
      })
      .addCase(fetchStudentsWithBus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Without Bus
      .addCase(fetchStudentsWithoutBus.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchStudentsWithoutBus.fulfilled, (state, action) => {
        state.loading = false;
        state.withoutBus = action.payload;
      })
      .addCase(fetchStudentsWithoutBus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default studentBusSlice.reducer;
