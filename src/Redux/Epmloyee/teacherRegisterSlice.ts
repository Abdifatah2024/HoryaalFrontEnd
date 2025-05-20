import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// Types
interface Teacher {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface RegisterTeacherInput {
  username: string;
  password: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  photoUrl?: string;
}

interface TeacherRegisterState {
  loading: boolean;
  success: string | null;
  error: string | null;
  teacher: Teacher | null;
}

// Initial State
const initialState: TeacherRegisterState = {
  loading: false,
  success: null,
  error: null,
  teacher: null,
};

// Async thunk for teacher registration
export const registerTeacher = createAsyncThunk(
  "teacherRegister/registerTeacher",
  async (data: RegisterTeacherInput, { rejectWithValue }) => {
    const token = localStorage.getItem("Access_token");

    try {
      const response = await axios.post(
        `${BASE_API_URL}/exam/register/teacher`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // expected: { user, message }
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || DEFAULT_ERROR_MESSAGE
        );
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

// Slice
const teacherRegisterSlice = createSlice({
  name: "teacherRegister",
  initialState,
  reducers: {
    clearTeacherRegisterState: (state) => {
      state.loading = false;
      state.success = null;
      state.error = null;
      state.teacher = null;
    },
    clearTeacherState: (state) => {
      state.loading = false;
      state.success = null;
      state.error = null;
      state.teacher = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerTeacher.pending, (state) => {
        state.loading = true;
        state.success = null;
        state.error = null;
        state.teacher = null;
      })
      .addCase(registerTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.success =
          action.payload.message || "Teacher registered successfully";
        state.teacher = action.payload.user;
      })
      .addCase(registerTeacher.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = action.payload as string;
        state.teacher = null;
      });
  },
});

export const { clearTeacherRegisterState, clearTeacherState } =
  teacherRegisterSlice.actions;

export default teacherRegisterSlice.reducer;
