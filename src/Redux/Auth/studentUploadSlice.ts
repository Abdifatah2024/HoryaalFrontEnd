import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Student } from "../../types/Register"; // Adjust if needed
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// --- Axios Instance with Token ---
const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const userData = localStorage.getItem("userData");
  const token = userData ? JSON.parse(userData)?.Access_token : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// --- Slice State Interface ---
export interface StudentUploadState {
  parsedStudents: Student[];
  loading: boolean;
  success: boolean;
  error: string | null;
}

// --- Initial State ---
const initialState: StudentUploadState = {
  parsedStudents: [],
  loading: false,
  success: false,
  error: null,
};

// --- Thunk for Uploading Excel ---
export const uploadStudentsExcel = createAsyncThunk<
  any,
  FormData,
  { rejectValue: string }
>("studentUpload/uploadExcel", async (formData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(
      "/student/upload-excel",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(
        error.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
    return rejectWithValue(DEFAULT_ERROR_MESSAGE);
  }
});

// --- Slice ---
const studentUploadSlice = createSlice({
  name: "studentUpload",
  initialState,
  reducers: {
    setParsedStudents: (state, action: PayloadAction<Student[]>) => {
      state.parsedStudents = action.payload;
    },
    clearParsedStudents: (state) => {
      state.parsedStudents = [];
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadStudentsExcel.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(uploadStudentsExcel.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (Array.isArray(action.payload)) {
          state.parsedStudents = action.payload;
        }
      })
      .addCase(uploadStudentsExcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Upload failed";
      });
  },
});

// --- Exports ---
export const { setParsedStudents, clearParsedStudents } =
  studentUploadSlice.actions;
export default studentUploadSlice.reducer;
