import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant/index";
import axios from "axios";

interface Student {
  id: number;
  firstname: string;
  middlename: string | null;
  lastname: string;
  fullname: string;
  classId: number;
  phone: string;
  gender: string;
  Age: number;
  fee: number;
  Amount: number;
  isdeleted: boolean;
  userid: number;
}

interface StudentClassState {
  loading: boolean;
  error: string;
  success: boolean;
  student: Student | null;
  verificationLoading: boolean;
  verificationError: string;
  verifiedStudent: Student | null;
}

const initialState: StudentClassState = {
  loading: false,
  error: "",
  success: false,
  student: null,
  verificationLoading: false,
  verificationError: "",
  verifiedStudent: null,
};

export const verifyStudent = createAsyncThunk(
  "studentClass/verifyStudent",
  async (studentId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/student/${studentId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Student not found");
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

export const updateStudentClass = createAsyncThunk(
  "studentClass/update",
  async ({ studentId, classId }: { studentId: number; classId: number }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_API_URL}/student/updateClass`, {
        studentId,
        classId
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

const studentClassSlice = createSlice({
  name: "studentClass",
  initialState,
  reducers: {
    resetStudentClassState: (state) => {
      Object.assign(state, initialState);
    },
    clearVerificationData: (state) => {
      state.verificationLoading = false;
      state.verificationError = "";
      state.verifiedStudent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyStudent.pending, (state) => {
        state.verificationLoading = true;
        state.verificationError = "";
      })
      .addCase(verifyStudent.fulfilled, (state, action) => {
        state.verificationLoading = false;
        state.verifiedStudent = action.payload;
      })
      .addCase(verifyStudent.rejected, (state, action) => {
        state.verificationLoading = false;
        state.verificationError = action.payload as string;
      })
      .addCase(updateStudentClass.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateStudentClass.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.student = action.payload.student;
      })
      .addCase(updateStudentClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetStudentClassState, clearVerificationData } = studentClassSlice.actions;
export default studentClassSlice.reducer;