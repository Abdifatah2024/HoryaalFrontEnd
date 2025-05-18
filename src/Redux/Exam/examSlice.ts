import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
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

// Thunks

export const createExamType = createAsyncThunk(
  "exam/createExamType",
  async (
    data: {
      name: string;
      type: string;
      maxMarks: number;
      academicYearId: number;
    },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("Access_token");
    try {
      const res = await axios.post(`${BASE_API_URL}/exam/create`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(
        err.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

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
      const err = error as AxiosError;
      return rejectWithValue(
        err.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

export const createAcademicYear = createAsyncThunk(
  "exam/createAcademicYear",
  async (data: { year: string }, { rejectWithValue }) => {
    const token = localStorage.getItem("Access_token");
    try {
      const res = await axios.post(
        `${BASE_API_URL}/exam/createAcademic`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(
        err.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

export const getExamList = createAsyncThunk(
  "exam/getExamList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/exam/list`);
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(
        err.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

export const registerScore = createAsyncThunk(
  "exam/registerScore",
  async (
    data: {
      studentId: number;
      examId: number;
      subjectId: number;
      marks: number;
      academicYearId: number;
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
      const err = error as AxiosError;
      return rejectWithValue(
        err.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

export const updateScore = createAsyncThunk(
  "exam/updateScore",
  async (
    data: {
      studentId: number;
      examId: number;
      subjectId: number;
      marks: number;
      academicYearId: number;
    },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("Access_token");
    try {
      const res = await axios.put(`${BASE_API_URL}/exam/score/update`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(
        err.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

export const deleteExamScore = createAsyncThunk(
  "exam/deleteExamScore",
  async (
    data: { studentId: number; examId: number; subjectId: number },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("Access_token");
    try {
      const res = await axios.delete(`${BASE_API_URL}/exam/score/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data, // ✅ This is the correct way to send request body with DELETE
      });
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(
        err.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
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
      .addCase(createExamType.pending, (state) => {
        state.loading = true;
      })
      .addCase(createExamType.fulfilled, (state) => {
        state.loading = false;
        state.success = "Exam created successfully";
      })
      .addCase(createExamType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createSubject.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSubject.fulfilled, (state) => {
        state.loading = false;
        state.success = "Subject created successfully";
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createAcademicYear.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAcademicYear.fulfilled, (state) => {
        state.loading = false;
        state.success = "Academic year created successfully";
      })
      .addCase(createAcademicYear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

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
      })

      .addCase(registerScore.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerScore.fulfilled, (state) => {
        state.loading = false;
        state.success = "Score registered successfully";
      })
      .addCase(registerScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateScore.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateScore.fulfilled, (state) => {
        state.loading = false;
        state.success = "Score updated successfully";
      })
      .addCase(updateScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteExamScore.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteExamScore.fulfilled, (state) => {
        state.loading = false;
        state.success = "Score deleted successfully";
      })
      .addCase(deleteExamScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearExamState } = examSlice.actions;
export default examSlice.reducer;
