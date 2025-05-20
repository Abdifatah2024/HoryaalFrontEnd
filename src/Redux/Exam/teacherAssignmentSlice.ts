import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

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

interface TeacherAssignmentState {
  loading: boolean;
  error: string | null;
  success: string | null;
  teachers: Teacher[];
  assignments: Assignment[];
}

const initialState: TeacherAssignmentState = {
  loading: false,
  error: null,
  success: null,
  teachers: [],
  assignments: [],
};

// Fetch all teachers
export const fetchAllTeachers = createAsyncThunk(
  "teacherAssignment/fetchAllTeachers",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("Access_token");
    try {
      const response = await axios.get(`${BASE_API_URL}/user/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

// Fetch teacher assignments
export const fetchTeacherAssignments = createAsyncThunk(
  "teacherAssignment/fetchTeacherAssignments",
  async (teacherId: number, { rejectWithValue }) => {
    if (!teacherId) {
      return rejectWithValue("Teacher ID is required");
    }

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
  "teacherAssignment/assignTeacherToClassSubject",
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
  "teacherAssignment/updateTeacherAssignment",
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
  "teacherAssignment/deleteTeacherAssignment",
  async (assignmentId: number, { rejectWithValue }) => {
    if (!assignmentId) {
      return rejectWithValue("Assignment ID is required");
    }

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

const teacherAssignmentSlice = createSlice({
  name: "teacherAssignment",
  initialState,
  reducers: {
    clearTeacherAssignmentState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch teachers
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

      // Fetch assignments
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

      // Assign
      .addCase(assignTeacherToClassSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(assignTeacherToClassSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Teacher assigned successfully";
        state.assignments.push(action.payload);
      })
      .addCase(assignTeacherToClassSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateTeacherAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateTeacherAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Assignment updated successfully";
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

      // Delete
      .addCase(deleteTeacherAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteTeacherAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Assignment deleted successfully";
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

export const { clearTeacherAssignmentState } = teacherAssignmentSlice.actions;
export default teacherAssignmentSlice.reducer;
