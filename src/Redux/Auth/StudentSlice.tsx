import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";


// 🔥 Updated Student Interface
export interface Student {
  id: number;
  firstname: string;
  middlename?: string;
  lastname: string;
  fullname: string;
  classId: string;
  phone: string;
  phone2?: string;
  bus?: string;
  address?: string;
  previousSchool?: string;
  motherName?: string;
  gender: string;
  age: number;
  fee: number;
  createdAt: Date;
  updatedAt: Date;
}

const initialState = {
  loading: false,
  students: [] as Student[],
  student: null as Student | null,
  error: "",
};

// Utility to get token
const getAuthToken = () => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData).Access_token : null;
};

// 🔹 Create Student
export const createStudent = createAsyncThunk(
  "students/createStudent",
  async (data: Partial<Student>, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("Authentication required");

      const res = await axios.post(`${BASE_API_URL}/student/create`, data, {
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

// 🔹 Fetch All Students
export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/student/studentList`);
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

// 🔹 Fetch Student by ID
export const getStudentById = createAsyncThunk(
  "students/getStudentById",
  async (studentId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/student/${studentId}`);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Student not found"
        );
      }
    }
  }
);

// 🔹 Update Student
export const updateStudent = createAsyncThunk(
  "students/updateStudent",
  async (
    { studentId, studentData }: { studentId: number; studentData: Partial<Student> },
    { rejectWithValue }
  ) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("Authentication required");

      const res = await axios.put(
        `${BASE_API_URL}/student/${studentId}`,
        studentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update student"
        );
      }
    }
  }
);

// 🔹 Delete Student
export const deleteStudent = createAsyncThunk(
  "students/deleteStudent",
  async (studentId: string, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("Authentication required");

      await axios.delete(`${BASE_API_URL}/student/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return studentId;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to delete student"
        );
      }
    }
  }
);

// 🔹 Clear student data manually
export const clearStudent = createAction("students/clear");

const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createStudent.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.students.push(action.payload);
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getStudentById.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload;
      })
      .addCase(getStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.students = state.students.map((s) =>
          s.id === action.payload.id ? action.payload : s
        );
        if (state.student?.id === action.payload.id) {
          state.student = action.payload;
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    .addCase(deleteStudent.fulfilled, (state, action) => {
  const id = Number(action.payload); // Convert to number

  state.loading = false;
  state.students = state.students.filter((s) => s.id !== id);

  if (state.student?.id === id) {
    state.student = null;
  }
})

      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(clearStudent, (state) => {
        state.student = null;
        state.error = "";
      });
  },
});

export default studentSlice.reducer;
