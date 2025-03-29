import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

export interface Student {
  id: number;
  firstname: string;
  middlename?: string;
  lastname: string;
  fullname: string;
  classId: string;
  phone: string;
  gender: string;
  age: number;
  fee: number;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const initialState = {
  loading: false,
  students: [] as Student[], // List of students
  student: null as Student | null, // Selected student
  error: "",
};

// 🔹 Create a New Student
export const createStudent = createAsyncThunk(
  "students/createStudent",
  async (data: Partial<Student>, { rejectWithValue, getState }) => {
    
    const stateData: any = getState();

    const { Access_token = null } = stateData?.loginSlice?.data || {};

    try {
      const res = await axios.post(`${BASE_API_URL}/student/create`, data, {
        headers: { Authorization: `Bearer ${Access_token}` },
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
      const response = await axios.get(`${BASE_API_URL}/students/${studentId}`);
      return response.data;
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
    {
      studentId,
      studentData,
    }: { studentId: string; studentData: Partial<Student> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${BASE_API_URL}/students/${studentId}`,
        studentData
      );
      return response.data;
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
      await axios.delete(`${BASE_API_URL}/students/${studentId}`);
      return studentId; // Return deleted student ID
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.msg || "Failed to delete student"
        );
      }
    }
  }
);

// 🔥 Student Redux Slice
const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    clearStudent: (state) => {
      state.student = null;
    },
  },
  extraReducers: (builder) => {
    // 🔹 Create Student
    builder.addCase(createStudent.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(createStudent.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.students.push(action.payload);
    });
    builder.addCase(createStudent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // 🔹 Fetch Students
    builder.addCase(fetchStudents.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchStudents.fulfilled, (state, action) => {
      state.loading = false;
      state.students = action.payload;
    });
    builder.addCase(fetchStudents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // 🔹 Fetch Student by ID
    builder.addCase(getStudentById.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(getStudentById.fulfilled, (state, action) => {
      state.loading = false;
      state.student = action.payload;
    });
    builder.addCase(getStudentById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // 🔹 Update Student
    builder.addCase(updateStudent.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(updateStudent.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";

      state.students = state.students.map((student) =>
        student.id === action.payload.id ? action.payload : student
      );

      if (state.student?.id === action.payload.id) {
        state.student = action.payload;
      }
    });
    builder.addCase(updateStudent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // 🔹 Delete Student
    builder.addCase(deleteStudent.fulfilled, (state, action) => {
      state.loading = false;
      state.students = state.students.filter(
        (student) => student.id !== action.payload
      );
      if (state.student?.id === action.payload) {
        state.student = null;
      }
    });
    builder.addCase(deleteStudent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearStudent } = studentSlice.actions;
export default studentSlice.reducer;
