import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant/index";

// ✅ Updated Student Interface to match backend
export interface Student {
  id: number;
  firstname: string;
  middlename: string | null;
  lastname: string;
  fullname: string;
  familyName?: string; // ✅ added
  fourtname?: string;  // ✅ added
  classId: number;
  phone: string;
  phone2?: string | null;
  bus?: string | null;
  address?: string | null;
  previousSchool?: string | null;
  motherName?: string | null;
  gender: string;
  Age: number;
  fee: number;
  isdeleted: boolean;
  userid: number;
  classes: {
    name: string;
  };
  user: {
    email: string; // ✅ Changed from fullName to email
  };
}

interface StudentClassState {
  loading: boolean;
  error: string;
  success: boolean;
  student: Student | null;
  verificationLoading: boolean;
  verificationError: string;
  verifiedStudent: Student[];
  sameFamilyStudents?: Student[]; // ✅ new state
}

const initialState: StudentClassState = {
  loading: false,
  error: "",
  success: false,
  student: null,
  verificationLoading: false,
  verificationError: "",
  verifiedStudent: [],
  sameFamilyStudents: [],
};

// 🔹 Verify student by ID or Name
export const verifyStudent = createAsyncThunk(
  "studentClass/verifyStudent",
  async (studentIdOrName: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/student/${studentIdOrName}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Student not found");
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

// 🔹 Update Student Class
export const updateStudentClass = createAsyncThunk(
  "studentClass/updateStudentClass",
  async (
    { studentId, classId }: { studentId: number; classId: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`${BASE_API_URL}/student/updateClass`, {
        studentId,
        classId,
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

// 🔹 Get Students by Family Name
export const fetchStudentsByFamilyName = createAsyncThunk(
  "studentClass/fetchStudentsByFamilyName",
  async (familyName: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/student/family/by-name?familyName=${encodeURIComponent(familyName)}`);
      return response.data.students;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch family members");
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
      state.verifiedStudent = [];
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
        state.success = false;
      })
      .addCase(updateStudentClass.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.student = action.payload.student;
      })
      .addCase(updateStudentClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStudentsByFamilyName.fulfilled, (state, action) => {
        state.sameFamilyStudents = action.payload;
      })
      .addCase(fetchStudentsByFamilyName.rejected, (state, action) => {
        state.sameFamilyStudents = [];
        state.error = action.payload as string;
      });
  },
});

export const {
  resetStudentClassState,
  clearVerificationData,
} = studentClassSlice.actions;

export default studentClassSlice.reducer;
