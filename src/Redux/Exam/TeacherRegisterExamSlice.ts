import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

interface RegisterTenSubjectsState {
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: RegisterTenSubjectsState = {
  loading: false,
  error: null,
  success: null,
};

export const registerTenSubjects = createAsyncThunk(
  "subjects/registerTenSubjects",
  async (
    data: {
      studentId: number;
      examId: number;
      academicYearId: number;
      scores: { subjectId: number; marks: number }[];
    },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("Access_token");
    try {
      const res = await axios.post(`${BASE_API_URL}/exam/teacher/score`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
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

const registerTenSubjectsSlice = createSlice({
  name: "registerTenSubjects",
  initialState,
  reducers: {
    clearRegisterTenSubjectsState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerTenSubjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerTenSubjects.fulfilled, (state) => {
        state.loading = false;
        state.success = "Registered 10 subjects successfully.";
      })
      .addCase(registerTenSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearRegisterTenSubjectsState } =
  registerTenSubjectsSlice.actions;
export default registerTenSubjectsSlice.reducer;
