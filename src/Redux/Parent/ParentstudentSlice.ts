// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import { BASE_API_URL } from "../../Constant"; // Ensure this path is correct for your project

// // ---
// // Types
// // ---

// interface Attendance {
//   id: number;
//   date: string;
//   present: boolean;
//   remark: string | null;
// }

// interface Discipline {
//   id: number;
//   type: string;
//   description: string;
//   actionTaken: string;
//   recordedAt: string;
// }

// /**
//  * Defines the structure for an individual exam result for a subject.
//  */
// interface ExamResult {
//   subject: string;
//   monthly?: number; // Optional: can be undefined or null if not available
//   midterm?: number; // Optional
//   final?: number; // Optional
//   totalMarks: number; // Assuming this is always present
// }

// /**
//  * Defines the structure for a Student object in the Redux state.
//  * Includes attendance, discipline, financial balance, and now exam results.
//  */
// export interface Student {
//   id: number;
//   fullname: string;
//   gender: string;
//   phone: string;
//   Age: number;
//   address: string;
//   classes?: { name: string };
//   attendance?: Attendance[];
//   totalPresent?: number;
//   totalAbsent?: number;
//   discipline?: Discipline[];
//   totalIncidents?: number;
//   examAverage?: string;

//   // Balance-related properties
//   monthlyFee?: number;
//   totalMonths?: number;
//   totalFees?: number;
//   totalPaid?: number;
//   carryForward?: number;
//   balance?: number;

//   // ✅ New: Exam results array for the student
//   examResults?: ExamResult[];
// }

// /**
//  * Defines the overall structure of the Student slice state.
//  * Includes loading and error states for different data fetches.
//  */
// interface StudentState {
//   students: Student[];
//   loading: boolean;
//   error: string | null;
//   attendanceLoading: boolean;
//   attendanceError: string | null;
//   disciplineLoading: boolean;
//   disciplineError: string | null;
//   balanceLoading: boolean;
//   balanceError: string | null;
//   examLoading: boolean; // New: Loading state for exam results
//   examError: string | null; // New: Error state for exam results
// }

// // ---
// // Initial State
// // ---

// const initialState: StudentState = {
//   students: [],
//   loading: false,
//   error: null,
//   attendanceLoading: false,
//   attendanceError: null,
//   disciplineLoading: false,
//   disciplineError: null,
//   balanceLoading: false,
//   balanceError: null,
//   examLoading: false, // Initialize new state properties
//   examError: null,
// };

// // ---
// // Thunks (Asynchronous Actions)
// // ---

// // 1. Fetches the list of children (students) associated with the parent.
// export const fetchMyStudents = createAsyncThunk<Student[]>(
//   "students/fetchMyStudents",
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("Access_token");
//       const response = await axios.get(
//         `${BASE_API_URL}/student/students/brothers`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const grouped = response.data.data;
//       // API returns an object with classes as keys, each holding an array of students.
//       // We flatten this to get a single array of all students.
//       const allStudents = Object.values(grouped).flat();
//       return allStudents as Student[];
//     } catch (error: any) {
//       console.error("Failed to fetch students:", error);
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch students"
//       );
//     }
//   }
// );

// // 2. Fetches attendance records for the parent's students.
// export const fetchStudentAttendance = createAsyncThunk(
//   "students/fetchStudentAttendance",
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("Access_token");
//       const response = await axios.get(
//         `${BASE_API_URL}/student/parent/attendance`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       return response.data.data; // Expected: an array of student objects with attendance data
//     } catch (error: any) {
//       console.error("Failed to fetch attendance:", error);
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch attendance"
//       );
//     }
//   }
// );

// // 3. Fetches discipline records for the parent's students.
// export const fetchStudentDiscipline = createAsyncThunk(
//   "students/fetchStudentDiscipline",
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("Access_token");
//       const response = await axios.get(
//         `${BASE_API_URL}/Dicipline/parent/students/discipline`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       return response.data.data; // Expected: an array of student objects with discipline data
//     } catch (error: any) {
//       console.error("Failed to fetch discipline:", error);
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch discipline"
//       );
//     }
//   }
// );

// // 4. Fetches payment balance information for the parent's students.
// export const fetchStudentBalance = createAsyncThunk(
//   "students/fetchStudentBalance",
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("Access_token");
//       const response = await axios.get(
//         `${BASE_API_URL}/Dicipline//parent/students/balance`, // Double check this URL for extra slash
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       return response.data.data; // Expected: an array of student objects with balance data
//     } catch (error: any) {
//       console.error("Failed to fetch payment balances:", error);
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch payment balances"
//       );
//     }
//   }
// );

// // 5. New: Fetches exam results for the parent's students.
// export const fetchStudentExamResults = createAsyncThunk(
//   "students/fetchStudentExamResults",
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("Access_token");
//       const response = await axios.get(`${BASE_API_URL}/exam/summary/parent`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       // The API should return data structured as an array of student objects,
//       // where each student object contains an 'exams' array.
//       return response.data.data;
//     } catch (error: any) {
//       console.error("Failed to fetch exam results:", error);
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch exam results"
//       );
//     }
//   }
// );

// // ---
// // Slice
// // ---

// const studentSlice = createSlice({
//   name: "students",
//   initialState,
//   reducers: {
//     // No synchronous reducers needed for this slice, all updates are async
//   },
//   extraReducers: (builder) => {
//     // Handling states for fetchMyStudents
//     builder
//       .addCase(fetchMyStudents.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchMyStudents.fulfilled, (state, action) => {
//         state.loading = false;
//         state.students = action.payload; // Set the initial list of students
//       })
//       .addCase(fetchMyStudents.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });

//     // Handling states for fetchStudentAttendance
//     builder
//       .addCase(fetchStudentAttendance.pending, (state) => {
//         state.attendanceLoading = true;
//         state.attendanceError = null;
//       })
//       .addCase(fetchStudentAttendance.fulfilled, (state, action) => {
//         state.attendanceLoading = false;
//         const attendanceData = action.payload;
//         // Map over existing students and merge attendance data
//         state.students = state.students.map((student) => {
//           const match = attendanceData.find((s: any) => s.id === student.id);
//           return match
//             ? {
//                 ...student,
//                 attendance: match.Attendance,
//                 totalPresent: match.totalPresent,
//                 totalAbsent: match.totalAbsent,
//               }
//             : student;
//         });
//       })
//       .addCase(fetchStudentAttendance.rejected, (state, action) => {
//         state.attendanceLoading = false;
//         state.attendanceError = action.payload as string;
//       });

//     // Handling states for fetchStudentDiscipline
//     builder
//       .addCase(fetchStudentDiscipline.pending, (state) => {
//         state.disciplineLoading = true;
//         state.disciplineError = null;
//       })
//       .addCase(fetchStudentDiscipline.fulfilled, (state, action) => {
//         state.disciplineLoading = false;
//         const disciplineData = action.payload;
//         // Map over existing students and merge discipline data
//         state.students = state.students.map((student) => {
//           const match = disciplineData.find((s: any) => s.id === student.id);
//           return match
//             ? {
//                 ...student,
//                 discipline: match.disciplineRecords,
//                 totalIncidents: match.totalIncidents,
//               }
//             : student;
//         });
//       })
//       .addCase(fetchStudentDiscipline.rejected, (state, action) => {
//         state.disciplineLoading = false;
//         state.disciplineError = action.payload as string;
//       });

//     // Handling states for fetchStudentBalance
//     builder
//       .addCase(fetchStudentBalance.pending, (state) => {
//         state.balanceLoading = true;
//         state.balanceError = null;
//       })
//       .addCase(fetchStudentBalance.fulfilled, (state, action) => {
//         state.balanceLoading = false;
//         const balanceData = action.payload;
//         // Map over existing students and merge balance data
//         state.students = state.students.map((student) => {
//           const match = balanceData.find((s: any) => s.id === student.id);
//           return match
//             ? {
//                 ...student,
//                 monthlyFee: match.monthlyFee,
//                 totalMonths: match.totalMonths,
//                 totalFees: match.totalFees,
//                 totalPaid: match.totalPaid,
//                 carryForward: match.carryForward,
//                 balance: match.balance,
//               }
//             : student;
//         });
//       })
//       .addCase(fetchStudentBalance.rejected, (state, action) => {
//         state.balanceLoading = false;
//         state.balanceError = action.payload as string;
//       });

//     // ✅ New: Handling states for fetchStudentExamResults
//     builder
//       .addCase(fetchStudentExamResults.pending, (state) => {
//         state.examLoading = true;
//         state.examError = null;
//       })
//       .addCase(fetchStudentExamResults.fulfilled, (state, action) => {
//         state.examLoading = false;
//         const examData = action.payload; // This payload is expected to be an array of objects like { id: studentId, exams: ExamResult[] }

//         // Map over existing students and merge exam results
//         state.students = state.students.map((student) => {
//           const match = examData.find((s: any) => s.id === student.id); // 'any' is used here for matching the incoming data structure
//           return match
//             ? {
//                 ...student,
//                 examResults: match.exams, // Assign the 'exams' array from the matched data
//               }
//             : student;
//         });
//       })
//       .addCase(fetchStudentExamResults.rejected, (state, action) => {
//         state.examLoading = false;
//         state.examError = action.payload as string;
//       });
//   },
// });

// export default studentSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API_URL } from "../../Constant"; // Ensure this path is correct for your project

// ---
// Types
// ---

interface Attendance {
  id: number;
  date: string;
  present: boolean;
  remark: string | null;
}

interface Discipline {
  id: number;
  type: string;
  description: string;
  actionTaken: string;
  recordedAt: string;
}

/**
 * Defines the structure for an individual exam result for a subject.
 */
interface ExamResult {
  subject: string;
  monthly?: number; // Optional: can be undefined or null if not available
  midterm?: number; // Optional
  final?: number; // Optional
  totalMarks: number; // Assuming this is always present
}

/**
 * Defines the structure for a Student object in the Redux state.
 * Includes attendance, discipline, financial balance, and now exam results.
 */
export interface Student {
  id: number;
  fullname: string;
  gender: string;
  phone: string;
  Age: number;
  address: string;
  classes?: { name: string };
  attendance?: Attendance[];
  totalPresent?: number;
  totalAbsent?: number;
  discipline?: Discipline[];
  totalIncidents?: number;
  examAverage?: string;

  // Balance-related properties
  monthlyFee?: number;
  totalMonths?: number;
  totalFees?: number;
  totalPaid?: number;
  carryForward?: number;
  balance?: number;

  // ✅ New: Exam results array for the student
  examResults?: ExamResult[];
}

/**
 * Defines the overall structure of the Student slice state.
 * Includes loading and error states for different data fetches.
 */
interface StudentState {
  students: Student[];
  loading: boolean;
  error: string | null;
  attendanceLoading: boolean;
  attendanceError: string | null;
  disciplineLoading: boolean;
  disciplineError: string | null;
  balanceLoading: boolean;
  balanceError: string | null;
  examLoading: boolean; // New: Loading state for exam results
  examError: string | null; // New: Error state for exam results
}

// ---
// Initial State
// ---

const initialState: StudentState = {
  students: [],
  loading: false,
  error: null,
  attendanceLoading: false,
  attendanceError: null,
  disciplineLoading: false,
  disciplineError: null,
  balanceLoading: false,
  balanceError: null,
  examLoading: false, // Initialize new state properties
  examError: null,
};

// ---
// Thunks (Asynchronous Actions)
// ---

// 1. Fetches the list of children (students) associated with the parent.
export const fetchMyStudents = createAsyncThunk<Student[]>(
  "students/fetchMyStudents",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Access_token");
      const response = await axios.get(
        `${BASE_API_URL}/student/students/brothers`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const grouped = response.data.data;
      // API returns an object with classes as keys, each holding an array of students.
      // We flatten this to get a single array of all students.
      const allStudents = Object.values(grouped).flat();
      return allStudents as Student[];
    } catch (error: any) {
      console.error("Failed to fetch students:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch students"
      );
    }
  }
);

// 2. Fetches attendance records for the parent's students.
export const fetchStudentAttendance = createAsyncThunk(
  "students/fetchStudentAttendance",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Access_token");
      const response = await axios.get(
        `${BASE_API_URL}/student/parent/attendance`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data; // Expected: an array of student objects with attendance data
    } catch (error: any) {
      console.error("Failed to fetch attendance:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch attendance"
      );
    }
  }
);

// 3. Fetches discipline records for the parent's students.
export const fetchStudentDiscipline = createAsyncThunk(
  "students/fetchStudentDiscipline",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Access_token");
      const response = await axios.get(
        `${BASE_API_URL}/Dicipline/parent/students/discipline`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data; // Expected: an array of student objects with discipline data
    } catch (error: any) {
      console.error("Failed to fetch discipline:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch discipline"
      );
    }
  }
);

// 4. Fetches payment balance information for the parent's students.
export const fetchStudentBalance = createAsyncThunk(
  "students/fetchStudentBalance",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Access_token");
      // Double check this URL for extra slash if it causes issues.
      // It's currently: `${BASE_API_URL}/Dicipline//parent/students/balance`
      const response = await axios.get(
        `${BASE_API_URL}/Dicipline/parent/students/balance`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data; // Expected: an array of student objects with balance data
    } catch (error: any) {
      console.error("Failed to fetch payment balances:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch payment balances"
      );
    }
  }
);

// 5. New: Fetches exam results for the parent's students.
export const fetchStudentExamResults = createAsyncThunk(
  "students/fetchStudentExamResults",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Access_token");
      const response = await axios.get(`${BASE_API_URL}/exam/summary/parent`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // The API should return data structured as an array of student objects,
      // where each student object contains an 'exams' array.
      return response.data.data;
    } catch (error: any) {
      console.error("Failed to fetch exam results:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch exam results"
      );
    }
  }
);

// ---
// Slice
// ---

const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    // No synchronous reducers needed for this slice, all updates are async
  },
  extraReducers: (builder) => {
    // Handling states for fetchMyStudents
    builder
      .addCase(fetchMyStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload; // Set the initial list of students
      })
      .addCase(fetchMyStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Handling states for fetchStudentAttendance
    builder
      .addCase(fetchStudentAttendance.pending, (state) => {
        state.attendanceLoading = true;
        state.attendanceError = null;
      })
      .addCase(fetchStudentAttendance.fulfilled, (state, action) => {
        state.attendanceLoading = false;
        const attendanceData = action.payload;
        // Map over existing students and merge attendance data
        state.students = state.students.map((student) => {
          // ✅ FIX: Convert s.id to a number for comparison
          const match = attendanceData.find(
            (s: any) => Number(s.id) === student.id
          );
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

    // Handling states for fetchStudentDiscipline
    builder
      .addCase(fetchStudentDiscipline.pending, (state) => {
        state.disciplineLoading = true;
        state.disciplineError = null;
      })
      .addCase(fetchStudentDiscipline.fulfilled, (state, action) => {
        state.disciplineLoading = false;
        const disciplineData = action.payload;
        // Map over existing students and merge discipline data
        state.students = state.students.map((student) => {
          // ✅ FIX: Convert s.id to a number for comparison
          const match = disciplineData.find(
            (s: any) => Number(s.id) === student.id
          );
          return match
            ? {
                ...student,
                discipline: match.disciplineRecords,
                totalIncidents: match.totalIncidents,
              }
            : student;
        });
      })
      .addCase(fetchStudentDiscipline.rejected, (state, action) => {
        state.disciplineLoading = false;
        state.disciplineError = action.payload as string;
      });

    // Handling states for fetchStudentBalance
    builder
      .addCase(fetchStudentBalance.pending, (state) => {
        state.balanceLoading = true;
        state.balanceError = null;
      })
      .addCase(fetchStudentBalance.fulfilled, (state, action) => {
        state.balanceLoading = false;
        const balanceData = action.payload;
        // Map over existing students and merge balance data
        state.students = state.students.map((student) => {
          // ✅ FIX: Convert s.id to a number for comparison
          const match = balanceData.find(
            (s: any) => Number(s.id) === student.id
          );
          return match
            ? {
                ...student,
                monthlyFee: match.monthlyFee,
                totalMonths: match.totalMonths,
                totalFees: match.totalFees,
                totalPaid: match.totalPaid,
                carryForward: match.carryForward,
                balance: match.balance,
              }
            : student;
        });
      })
      .addCase(fetchStudentBalance.rejected, (state, action) => {
        state.balanceLoading = false;
        state.balanceError = action.payload as string;
      });

    // ✅ New: Handling states for fetchStudentExamResults
    builder
      .addCase(fetchStudentExamResults.pending, (state) => {
        state.examLoading = true;
        state.examError = null;
      })
      .addCase(fetchStudentExamResults.fulfilled, (state, action) => {
        state.examLoading = false;
        const examData = action.payload; // This payload is expected to be an array of objects like { id: studentId, exams: ExamResult[] }

        // Map over existing students and merge exam results
        state.students = state.students.map((student) => {
          // ✅ FIX: Convert s.id to a number for comparison
          const match = examData.find((s: any) => Number(s.id) === student.id);
          return match
            ? {
                ...student,
                examResults: match.exams, // Assign the 'exams' array from the matched data
              }
            : student;
        });
      })
      .addCase(fetchStudentExamResults.rejected, (state, action) => {
        state.examLoading = false;
        state.examError = action.payload as string;
      });
  },
});

export default studentSlice.reducer;
