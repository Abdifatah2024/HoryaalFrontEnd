import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { RootState } from "../../Redux/store";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// State type
export interface ExamState {
  loading: boolean;
  error: string | null;
  success: string | null;
  exams: any[];
}

const initialState: ExamState = {
  loading: false,
  error: null,
  success: null,
  exams: [],
};

// Create Exam Type
export const createExamType = createAsyncThunk(
  "exam/createExamType",
  async (
    data: { name: string; type: string; maxMarks: number },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("Access_token");
    try {
      const res = await axios.post(`${BASE_API_URL}/exam/create`, data, {
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

// Create Subject
export const createSubject = createAsyncThunk(
  "exam/createSubject",
  async (data: { name: string }, { rejectWithValue }) => {
    const token = localStorage.getItem("Access_token");
    try {
      const res = await axios.post(`${BASE_API_URL}/exam/createsubject`, data, {
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

// Create Academic Year
export const createAcademicYear = createAsyncThunk(
  "exam/createAcademicYear",
  async (data: { year: string }, { rejectWithValue }) => {
    const token = localStorage.getItem("Access_token");
    try {
      const res = await axios.post(`${BASE_API_URL}/exam/createAcadmic`, data, {
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

// Register Score
export const registerScore = createAsyncThunk(
  "exam/registerScore",
  async (
    data: {
      studentId: number;
      examId: number;
      subjectId: number;
      marks: number;
      academicYearId: number; // ✅ Added this
    },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("Access_token");
    try {
      const res = await axios.post(`${BASE_API_URL}/exam/RegisterScore`, data, {
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

// Get Exam List
export const getExamList = createAsyncThunk(
  "exam/getExamList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/exam/list`); // ✅ Fixed URL
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

// Slice
const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    clearExamState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createExamType
      .addCase(createExamType.pending, (state) => {
        state.loading = true;
      })
      .addCase(createExamType.fulfilled, (state) => {
        state.loading = false;
        state.success = "Exam Created Successfully.";
      })
      .addCase(createExamType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // createSubject
      .addCase(createSubject.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSubject.fulfilled, (state) => {
        state.loading = false;
        state.success = "Subject Created Successfully.";
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // createAcademicYear
      .addCase(createAcademicYear.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAcademicYear.fulfilled, (state) => {
        state.loading = false;
        state.success = "Academic Year Created Successfully.";
      })
      .addCase(createAcademicYear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // registerScore
      .addCase(registerScore.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerScore.fulfilled, (state) => {
        state.loading = false;
        state.success = "Score Registered Successfully.";
      })
      .addCase(registerScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // getExamList
      .addCase(getExamList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getExamList.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = action.payload;
      })
      .addCase(getExamList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearExamState } = examSlice.actions;
export default examSlice.reducer;
