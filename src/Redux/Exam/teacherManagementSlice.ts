import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// ----------------- Interfaces -----------------
interface Teacher {
  id: number;
  fullName: string;
}

interface Assignment {
  id: number;
  classId: number;
  className: string;
  subjectId: number;
  subjectName: string;
  teacherId?: number;
  teacherName?: string;
}

interface TeacherManagementState {
  loading: boolean;
  error: string | null;
  success: string | null;
  teachers: Teacher[];
  correctionLimit: number;
  correctionsUsed: number;
  remaining: number;
  assignments: Assignment[];
}

// ----------------- Initial State -----------------
const initialState: TeacherManagementState = {
  loading: false,
  error: null,
  success: null,
  teachers: [],
  correctionLimit: 0,
  correctionsUsed: 0,
  remaining: 0,
  assignments: [],
};

// ----------------- Thunks -----------------

// Fetch all teachers (shared)
export const fetchAllTeachers = createAsyncThunk(
  "teacherManagement/fetchAllTeachers",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("Access_token");
    try {
      const res = await axios.get(`${BASE_API_URL}/user/listTeachers`, {
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

// Fetch correction status by teacher ID
export const fetchTeacherCorrectionStatus = createAsyncThunk(
  "teacherManagement/fetchTeacherCorrectionStatus",
  async (userId: number, { rejectWithValue }) => {
    const token = localStorage.getItem("Access_token");
    try {
      const response = await axios.get(
        `${BASE_API_URL}/exam/admin/teacher/${userId}/correction-limit`,
        {
          headers: { Authorization: `Bearer ${token}` },
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
  }
);

// Set correction limit
export const setTeacherCorrectionLimit = createAsyncThunk(
  "teacherManagement/setTeacherCorrectionLimit",
  async (
    data: { userId: number; correctionLimit: number },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("Access_token");
    try {
      const response = await axios.put(
        `${BASE_API_URL}/exam/admin/user/set-correction-limit`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
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
  }
);

// Fetch assignments
export const fetchTeacherAssignments = createAsyncThunk(
  "teacherManagement/fetchTeacherAssignments",
  async (teacherId: number, { rejectWithValue }) => {
    const token = localStorage.getItem("Access_token");
    try {
      const response = await axios.get(
        `${BASE_API_URL}/exam/teacher/${teacherId}/assignments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.assignments;
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

// Assign teacher to class/subject
export const assignTeacherToClassSubject = createAsyncThunk(
  "teacherManagement/assignTeacherToClassSubject",
  async (
    data: { teacherId: number; classId: number; subjectId: number },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("Access_token");
    try {
      const response = await axios.post(
        `${BASE_API_URL}/exam/teacher/assignments`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
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
  }
);

// Update assignment
export const updateTeacherAssignment = createAsyncThunk(
  "teacherManagement/updateTeacherAssignment",
  async (
    data: { assignmentId: number; classId: number; subjectId: number },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("Access_token");
    try {
      const response = await axios.put(
        `${BASE_API_URL}/exam/teacher/assignments`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.assignment;
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

// Delete assignment
export const deleteTeacherAssignment = createAsyncThunk(
  "teacherManagement/deleteTeacherAssignment",
  async (assignmentId: number, { rejectWithValue }) => {
    const token = localStorage.getItem("Access_token");
    try {
      await axios.delete(
        `${BASE_API_URL}/exam/teacher/assignment/${assignmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return assignmentId;
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

// ----------------- Slice -----------------
const teacherManagementSlice = createSlice({
  name: "teacherManagement",
  initialState,
  reducers: {
    clearTeacherManagementState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      state.teachers = [];
      state.assignments = [];
      state.correctionLimit = 0;
      state.correctionsUsed = 0;
      state.remaining = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Teachers
      .addCase(fetchAllTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload;
      })
      .addCase(fetchAllTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Correction Status
      .addCase(fetchTeacherCorrectionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherCorrectionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.correctionLimit = action.payload.correctionLimit;
        state.correctionsUsed = action.payload.correctionsUsed;
        state.remaining = action.payload.remainingCorrections;
      })
      .addCase(fetchTeacherCorrectionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Set Correction Limit
      .addCase(setTeacherCorrectionLimit.pending, (state) => {
        state.loading = true;
        state.success = null;
        state.error = null;
      })
      .addCase(setTeacherCorrectionLimit.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Correction limit updated.";
      })
      .addCase(setTeacherCorrectionLimit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Assignments
      .addCase(fetchTeacherAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchTeacherAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Assign Teacher
      .addCase(assignTeacherToClassSubject.pending, (state) => {
        state.loading = true;
        state.success = null;
        state.error = null;
      })
      .addCase(assignTeacherToClassSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Teacher assigned successfully.";
        state.assignments.push(action.payload);
      })
      .addCase(assignTeacherToClassSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Assignment
      .addCase(updateTeacherAssignment.pending, (state) => {
        state.loading = true;
        state.success = null;
        state.error = null;
      })
      .addCase(updateTeacherAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Assignment updated successfully.";
        const index = state.assignments.findIndex(
          (a) => a.id === action.payload.id
        );
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
      })
      .addCase(updateTeacherAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Assignment
      .addCase(deleteTeacherAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteTeacherAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Assignment deleted successfully.";
        state.assignments = state.assignments.filter(
          (a) => a.id !== action.payload
        );
      })
      .addCase(deleteTeacherAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTeacherManagementState } = teacherManagementSlice.actions;
export default teacherManagementSlice.reducer;
