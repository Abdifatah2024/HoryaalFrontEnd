import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { uploadExcelFile } from "../../Service/api";

interface Student {
  firstname: string;
  middlename?: string;
  lastname: string;
  phone: string;
  gender: string;
  Age: number;
  fee: boolean;
  Amount: number;
  classId: string;
}

export const uploadStudentsExcel = createAsyncThunk(
  "studentUpload/uploadExcel",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await uploadExcelFile(formData);
      return response.data; // 👈 Ensure you return `response.data`
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Upload failed");
    }
  }
);

interface StudentUploadState {
  parsedStudents: Student[];
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: StudentUploadState = {
  parsedStudents: [],
  loading: false,
  success: false,
  error: null,
};

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
      .addCase(uploadStudentsExcel.fulfilled, (state) => {
        state.loading = false; // 👈 Reset loading on success
        state.success = true;
      })
      .addCase(uploadStudentsExcel.rejected, (state, action) => {
        state.loading = false; // 👈 Reset loading on failure
        state.error = (action.payload as string) || "Upload failed";
      });
  },
});

export const { setParsedStudents, clearParsedStudents } =
  studentUploadSlice.actions;
export default studentUploadSlice.reducer;
