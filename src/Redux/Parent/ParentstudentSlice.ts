// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Types
// interface Attendance {
//   id: number;
//   date: string;
//   present: boolean;
//   remark: string | null;
// }

// interface Student {
//   id: number;
//   fullname: string;
//   gender: string;
//   phone: string;
//   Age: number;
//   address: string;
//   classes?: {
//     name: string;
//   };
//   attendance?: Attendance[];
// }

// interface StudentState {
//   students: Student[];
//   loading: boolean;
//   error: string | null;
//   attendanceLoading: boolean;
//   attendanceError: string | null;
// }

// // Initial state
// const initialState: StudentState = {
//   students: [],
//   loading: false,
//   error: null,
//   attendanceLoading: false,
//   attendanceError: null,
// };

// // Thunk 1: Fetch students
// export const fetchMyStudents = createAsyncThunk(
//   "students/fetchMyStudents",
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("Access_token");
//       const response = await axios.get(
//         "http://localhost:4000/student/students/brothers",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const grouped = response.data.data;
//       const allStudents = Object.values(grouped).flat();
//       return allStudents;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch students"
//       );
//     }
//   }
// );

// // Thunk 2: Fetch attendance records
// export const fetchStudentAttendance = createAsyncThunk(
//   "students/fetchStudentAttendance",
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("Access_token");
//       const response = await axios.get(
//         "http://localhost:4000/student/parent/attendance",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       return response.data.data;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch attendance"
//       );
//     }
//   }
// );

// // Slice
// const studentSlice = createSlice({
//   name: "students",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchMyStudents.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchMyStudents.fulfilled, (state, action) => {
//         state.loading = false;
//         state.students = action.payload;
//       })
//       .addCase(fetchMyStudents.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Fetch attendance
//       .addCase(fetchStudentAttendance.pending, (state) => {
//         state.attendanceLoading = true;
//         state.attendanceError = null;
//       })
//       .addCase(fetchStudentAttendance.fulfilled, (state, action) => {
//         state.attendanceLoading = false;
//         const attendanceData = action.payload;

//         state.students = state.students.map((student) => {
//           const match = attendanceData.find((s: any) => s.id === student.id);
//           return match ? { ...student, attendance: match.Attendance } : student;
//         });
//       })
//       .addCase(fetchStudentAttendance.rejected, (state, action) => {
//         state.attendanceLoading = false;
//         state.attendanceError = action.payload as string;
//       });
//   },
// });

// export default studentSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Types
interface Attendance {
  id: number;
  date: string;
  present: boolean;
  remark: string | null;
}

interface Student {
  id: number;
  fullname: string;
  gender: string;
  phone: string;
  Age: number;
  address: string;
  classes?: {
    name: string;
  };
  attendance?: Attendance[];
  totalPresent?: number;
  totalAbsent?: number;
}

interface StudentState {
  students: Student[];
  loading: boolean;
  error: string | null;
  attendanceLoading: boolean;
  attendanceError: string | null;
}

// Initial state
const initialState: StudentState = {
  students: [],
  loading: false,
  error: null,
  attendanceLoading: false,
  attendanceError: null,
};

// Thunk 1: Fetch list of children (students)
export const fetchMyStudents = createAsyncThunk(
  "students/fetchMyStudents",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Access_token");
      const response = await axios.get(
        "http://localhost:4000/student/students/brothers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const grouped = response.data.data;
      const allStudents = Object.values(grouped).flat();
      return allStudents;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch students"
      );
    }
  }
);

// Thunk 2: Fetch attendance records
export const fetchStudentAttendance = createAsyncThunk(
  "students/fetchStudentAttendance",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Access_token");
      const response = await axios.get(
        "http://localhost:4000/student/parent/attendance",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data; // Should contain Attendance, totalPresent, totalAbsent
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch attendance"
      );
    }
  }
);

// Slice
const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Students
      .addCase(fetchMyStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchMyStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Attendance
      .addCase(fetchStudentAttendance.pending, (state) => {
        state.attendanceLoading = true;
        state.attendanceError = null;
      })
      .addCase(fetchStudentAttendance.fulfilled, (state, action) => {
        state.attendanceLoading = false;
        const attendanceData = action.payload;

        state.students = state.students.map((student) => {
          const match = attendanceData.find((s: any) => s.id === student.id);
          return match
            ? {
                ...student,
                attendance: match.Attendance,
                totalPresent: match.totalPresent,
                totalAbsent: match.totalAbsent,
              }
            : student;
        });
      })
      .addCase(fetchStudentAttendance.rejected, (state, action) => {
        state.attendanceLoading = false;
        state.attendanceError = action.payload as string;
      });
  },
});

export default studentSlice.reducer;
