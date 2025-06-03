
// import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
// import axios, { AxiosError } from "axios";
// import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// // export interface Student {
// //   id: number;
// //   firstname: string;
// //   middlename?: string;
// //   lastname: string;
// //   fullname: string;
// //   classId: string;
// //   phone: string;
// //   gender: string;
// //   age: number;
// //   fee: number;
// //   amount: number;
// //   createdAt: Date;
// //   updatedAt: Date;
// // }
// export interface Student {
//   id: number;
//   firstname: string;
//   middlename?: string;
//   lastname: string;
//   fourtname?: string; // ✅ added
//   fullname: string;
//   classId: string;
//   phone: string;
//   gender: string;
//   age: number;
//   fee: number;
//   amount: number;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const initialState = {
//   loading: false,
//   students: [] as Student[],
//   student: null as Student | null,
//   error: "",
// };

// // Create a Student
// export const createStudent = createAsyncThunk(
//   "students/createStudent",
//   async (data: Partial<Student>, { rejectWithValue }) => {
//     const token = localStorage.getItem("Access_token");
//     try {
//       const res = await axios.post(`${BASE_API_URL}/student/create`, data, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return rejectWithValue(
//           error.response?.data?.message || DEFAULT_ERROR_MESSAGE
//         );
//       }
//       return rejectWithValue(DEFAULT_ERROR_MESSAGE);
//     }
//   }
// );

// // Fetch All Students
// export const fetchStudents = createAsyncThunk(
//   "students/fetchStudents",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE_API_URL}/student/studentList`);
//       return res.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return rejectWithValue(
//           error.response?.data?.message || DEFAULT_ERROR_MESSAGE
//         );
//       }
//       return rejectWithValue(DEFAULT_ERROR_MESSAGE);
//     }
//   }
// );

// // Fetch Student by ID
// export const getStudentById = createAsyncThunk(
//   "students/getStudentById",
//   async (studentId: string, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE_API_URL}/student/Get/${studentId}`);
//       return res.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return rejectWithValue(
//           error.response?.data?.message || "Student not found"
//         );
//       }
//     }
//   }
// );

// // Update Student (using token from localStorage)
// export const updateStudent = createAsyncThunk(
//   "students/updateStudent",
//   async (
//     { studentId, studentData }: { studentId: string; studentData: Partial<Student> },
//     { rejectWithValue }
//   ) => {
//     try {
//       const token = localStorage.getItem("Access_token");
//       const res = await axios.put(`${BASE_API_URL}/student/${studentId}`, studentData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return res.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return rejectWithValue(
//           error.response?.data?.message || "Failed to update student"
//         );
//       }
//       return rejectWithValue("Unexpected error occurred");
//     }
//   }
// );

// // Delete Student
// export const deleteStudent = createAsyncThunk(
//   "students/deleteStudent",
//   async (studentId: string, { rejectWithValue }) => {
//     try {
//       await axios.delete(`${BASE_API_URL}/students/${studentId}`);
//       return studentId;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return rejectWithValue(
//           error.response?.data?.msg || "Failed to delete student"
//         );
//       }
//     }
//   }
// );

// // Manual Reset
// export const clearStudent = createAction("students/clear");

// const studentSlice = createSlice({
//   name: "students",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     // Create
//     builder.addCase(createStudent.pending, (state) => {
//       state.loading = true;
//       state.error = "";
//     });
//     builder.addCase(createStudent.fulfilled, (state, action) => {
//       state.loading = false;
//       state.error = "";
//       state.students.push(action.payload);
//     });
//     builder.addCase(createStudent.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });

//     // Fetch All
//     builder.addCase(fetchStudents.pending, (state) => {
//       state.loading = true;
//       state.error = "";
//     });
//     builder.addCase(fetchStudents.fulfilled, (state, action) => {
//       state.loading = false;
//       state.students = action.payload;
//     });
//     builder.addCase(fetchStudents.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });

//     // Get by ID
//     builder.addCase(getStudentById.pending, (state) => {
//       state.loading = true;
//       state.error = "";
//     });
//     builder.addCase(getStudentById.fulfilled, (state, action) => {
//       state.loading = false;
//       state.student = action.payload;
//     });
//     builder.addCase(getStudentById.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });

//     // Update
//     builder.addCase(updateStudent.pending, (state) => {
//       state.loading = true;
//       state.error = "";
//     });
//     builder.addCase(updateStudent.fulfilled, (state, action) => {
//       state.loading = false;
//       state.error = "";
//       state.students = state.students.map((student) =>
//         student.id === action.payload.id ? action.payload : student
//       );
//       if (state.student?.id === action.payload.id) {
//         state.student = action.payload;
//       }
//     });
//     builder.addCase(updateStudent.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });

//     // Delete
//     builder.addCase(deleteStudent.fulfilled, (state, action) => {
//       state.loading = false;
//       state.students = state.students.filter((s) => s.id !== action.payload);
//       if (state.student?.id === action.payload) {
//         state.student = null;
//       }
//     });
//     builder.addCase(deleteStudent.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });

//     // Clear student manually
//     builder.addCase(clearStudent, (state) => {
//       state.student = null;
//       state.error = "";
//     });
//   },
// });

// export default studentSlice.reducer;
import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

export interface Student {
  id: number;
  firstname: string;
  middlename?: string;
  lastname: string;
  fourtname?: string;
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

interface StudentWithBus {
  id: number;
  fullname: string;
  classId: string;
  bus: string;
  classes: {
    name: string;
  };
}

const initialState = {
  loading: false,
  students: [] as Student[],
  student: null as Student | null,
  error: "",
  sameBusStudents: [] as StudentWithBus[],
  sameBusLoading: false,
};

// --------------------- THUNKS ---------------------

export const createStudent = createAsyncThunk(
  "students/createStudent",
  async (data: Partial<Student>, { rejectWithValue }) => {
    const token = localStorage.getItem("Access_token");
    try {
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

export const getStudentById = createAsyncThunk(
  "students/getStudentById",
  async (studentId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/student/Get/${studentId}`);
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

export const updateStudent = createAsyncThunk(
  "students/updateStudent",
  async (
    { studentId, studentData }: { studentId: string; studentData: Partial<Student> },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("Access_token");
      const res = await axios.put(`${BASE_API_URL}/student/${studentId}`, studentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update student"
        );
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

export const deleteStudent = createAsyncThunk(
  "students/deleteStudent",
  async (studentId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_API_URL}/students/${studentId}`);
      return studentId;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.msg || "Failed to delete student"
        );
      }
    }
  }
);

// export const fetchStudentsWithSameBus = createAsyncThunk(
//   "students/fetchStudentsWithSameBus",
//   async (studentId: number, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE_API_URL}/student/students/same-bus/${studentId}`);
//       return res.data.students;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return rejectWithValue(
//           error.response?.data?.message || "Failed to fetch students with same bus"
//         );
//       }
//       return rejectWithValue(DEFAULT_ERROR_MESSAGE);
//     }
//   }
// );

// --------------------- RESET ---------------------
export const fetchStudentsWithSameBus = createAsyncThunk(
  "students/fetchStudentsWithSameBus",
  async (busNumber: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/student/students/same-bus/${busNumber}`);
      return res.data.students;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch students with same bus"
        );
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

export const clearStudent = createAction("students/clear");

// --------------------- SLICE ---------------------

const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create
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

      // Fetch All
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

      // Get by ID
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

      // Update
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.students = state.students.map((student) =>
          student.id === action.payload.id ? action.payload : student
        );
        if (state.student?.id === action.payload.id) {
          state.student = action.payload;
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students = state.students.filter((s) => s.id !== action.payload);
        if (state.student?.id === action.payload) {
          state.student = null;
        }
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Same Bus
      .addCase(fetchStudentsWithSameBus.pending, (state) => {
        state.sameBusLoading = true;
      })
      .addCase(fetchStudentsWithSameBus.fulfilled, (state, action) => {
        state.sameBusLoading = false;
        state.sameBusStudents = action.payload;
      })
      .addCase(fetchStudentsWithSameBus.rejected, (state, action) => {
        state.sameBusLoading = false;
        state.error = action.payload as string;
      })

      // Clear
      .addCase(clearStudent, (state) => {
        state.student = null;
        state.error = "";
      });
  },
});

export default studentSlice.reducer;
