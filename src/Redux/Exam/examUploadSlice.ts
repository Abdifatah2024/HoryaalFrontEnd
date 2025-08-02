import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API_URL } from "../../Constant";

// Define the state structure
interface ExamUploadState {
  loading: boolean;
  error: string | null;
  success: boolean;
  responseData: any; // Stores inserted/skipped data for frontend
}

// Initial state
const initialState: ExamUploadState = {
  loading: false,
  error: null,
  success: false,
  responseData: null,
};

// Helper to extract error message from Axios errors
const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  return "Upload failed. Please try again.";
};

// Async thunk to upload Excel file
export const uploadExamExcel = createAsyncThunk<
  any, // returned data
  FormData, // payload type
  { rejectValue: string }
>("exam/uploadExamExcel", async (formData, { rejectWithValue }) => {
  const token = localStorage.getItem("Access_token");

  try {
    const res = await axios.post(
      `${BASE_API_URL}/exam/register-10-subjects`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

const examUploadSlice = createSlice({
  name: "examUpload",
  initialState,
  reducers: {
    clearExamUploadState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.responseData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadExamExcel.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.responseData = null;
      })
      .addCase(
        uploadExamExcel.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.success = true;
          state.responseData = action.payload;
        }
      )
      .addCase(
        uploadExamExcel.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Upload failed";
          state.success = false;
          state.responseData = null;
        }
      );
  },
});

export const { clearExamUploadState } = examUploadSlice.actions;
export default examUploadSlice.reducer;
