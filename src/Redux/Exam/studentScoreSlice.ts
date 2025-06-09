// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios, { AxiosError } from "axios";
// import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// // Define the structure for a single score item
// interface ScoreItem {
//   subjectId: number;
//   marks: number;
//   subjectName: string;
// }

// // Define the structure for student information
// interface StudentInfo {
//   id: number;
//   fullname: string;
//   email?: string;
//   classId?: number;
// }

// // Define the initial state structure
// interface StudentScoreState {
//   scores: ScoreItem[];
//   studentInfo: StudentInfo | null;
//   loading: boolean;
//   error: string | null;
//   success: string | null;
//   verificationLoading: boolean;
// }

// // Initialize the state
// const initialState: StudentScoreState = {
//   scores: [],
//   studentInfo: null,
//   loading: false,
//   error: null,
//   success: null,
//   verificationLoading: false,
// };

// // Async thunk to fetch student's scores for a specific exam and academic year
// export const fetchStudentExamScores = createAsyncThunk<
//   { scores: ScoreItem[] },
//   { studentId: number; examId: number; academicYearId: number },
//   { rejectValue: string }
// >(
//   "student/fetchScores",
//   async ({ studentId, examId, academicYearId }, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(
//         `${BASE_API_URL}/exam/student/${studentId}/exam/${examId}/year/${academicYearId}`
//       );
//       return res.data;
//     } catch (err) {
//       const error = err as AxiosError;
//       return rejectWithValue(
//         error.response?.data?.message || DEFAULT_ERROR_MESSAGE
//       );
//     }
//   }
// );

// // Async thunk to update or insert all 10 subject scores
// export const updateTenSubjectScores = createAsyncThunk<
//   any,
//   {
//     studentId: number;
//     examId: number;
//     academicYearId: number;
//     scores: { subjectId: number; marks: number }[];
//   },
//   { rejectValue: string }
// >("student/updateScores", async (data, { rejectWithValue }) => {
//   try {
//     const token = localStorage.getItem("Access_token");
//     const res = await axios.post(
//       `${BASE_API_URL}/exam/update-ten-subjects`,
//       data,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return res.data;
//   } catch (err) {
//     const error = err as AxiosError;
//     return rejectWithValue(
//       error.response?.data?.message || DEFAULT_ERROR_MESSAGE
//     );
//   }
// });

// // Async thunk to verify student before updating
// export const verifyStudent = createAsyncThunk<
//   StudentInfo,
//   number,
//   { rejectValue: string }
// >("student/verifyStudent", async (studentId, { rejectWithValue }) => {
//   try {
//     const res = await axios.get(`${BASE_API_URL}/student/Get/${studentId}`);
//     return res.data;
//   } catch (err) {
//     const error = err as AxiosError;
//     return rejectWithValue(
//       error.response?.data?.message || DEFAULT_ERROR_MESSAGE
//     );
//   }
// });

// // Create the slice
// const studentScoreSlice = createSlice({
//   name: "studentScores",
//   initialState,
//   reducers: {
//     clearMessages: (state) => {
//       state.error = null;
//       state.success = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Handle fetch scores
//       .addCase(fetchStudentExamScores.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchStudentExamScores.fulfilled, (state, action) => {
//         state.loading = false;
//         state.scores = action.payload.scores;
//       })
//       .addCase(fetchStudentExamScores.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload ?? "Failed to fetch scores";
//       })

//       // Handle update scores
//       .addCase(updateTenSubjectScores.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = null;
//       })
//       .addCase(updateTenSubjectScores.fulfilled, (state) => {
//         state.loading = false;
//         state.success = "Scores updated successfully";
//       })
//       .addCase(updateTenSubjectScores.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload ?? "Failed to update scores";
//       })

//       // Handle verify student
//       .addCase(verifyStudent.pending, (state) => {
//         state.verificationLoading = true;
//         state.studentInfo = null;
//       })
//       .addCase(verifyStudent.fulfilled, (state, action) => {
//         state.verificationLoading = false;
//         state.studentInfo = action.payload;
//       })
//       .addCase(verifyStudent.rejected, (state, action) => {
//         state.verificationLoading = false;
//         state.error = action.payload ?? "Failed to verify student";
//       });
//   },
// });

// export const { clearMessages } = studentScoreSlice.actions;
// export default studentScoreSlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// ------------------ Types ------------------

interface APIErrorResponse {
  message: string;
}

interface ScoreItem {
  subjectId: number;
  marks: number;
  subjectName: string;
}

interface StudentInfo {
  id: number;
  fullname: string;
  email?: string;
  classId?: number;
}

interface StudentScoreState {
  scores: ScoreItem[];
  studentInfo: StudentInfo | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  verificationLoading: boolean;
}

// ------------------ Initial State ------------------

const initialState: StudentScoreState = {
  scores: [],
  studentInfo: null,
  loading: false,
  error: null,
  success: null,
  verificationLoading: false,
};

// ------------------ Helper Function ------------------

function extractErrorMessage(error: unknown): string {
  const err = error as AxiosError<APIErrorResponse>;
  return err.response?.data?.message || DEFAULT_ERROR_MESSAGE;
}

// ------------------ Async Thunks ------------------

// Fetch student's scores
export const fetchStudentExamScores = createAsyncThunk<
  { scores: ScoreItem[] },
  { studentId: number; examId: number; academicYearId: number },
  { rejectValue: string }
>(
  "student/fetchScores",
  async ({ studentId, examId, academicYearId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_API_URL}/exam/student/${studentId}/exam/${examId}/year/${academicYearId}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

// Update 10 subject scores
export const updateTenSubjectScores = createAsyncThunk<
  any,
  {
    studentId: number;
    examId: number;
    academicYearId: number;
    scores: { subjectId: number; marks: number }[];
  },
  { rejectValue: string }
>("student/updateScores", async (data, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("Access_token");
    const res = await axios.post(
      `${BASE_API_URL}/exam/update-ten-subjects`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

// Verify student before updating
export const verifyStudent = createAsyncThunk<
  StudentInfo,
  number,
  { rejectValue: string }
>("student/verifyStudent", async (studentId, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${BASE_API_URL}/student/Get/${studentId}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

// ------------------ Slice ------------------

const studentScoreSlice = createSlice({
  name: "studentScores",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch scores
      .addCase(fetchStudentExamScores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentExamScores.fulfilled, (state, action) => {
        state.loading = false;
        state.scores = action.payload.scores;
      })
      .addCase(fetchStudentExamScores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch scores";
      })

      // Update scores
      .addCase(updateTenSubjectScores.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateTenSubjectScores.fulfilled, (state) => {
        state.loading = false;
        state.success = "Scores updated successfully";
      })
      .addCase(updateTenSubjectScores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update scores";
      })

      // Verify student
      .addCase(verifyStudent.pending, (state) => {
        state.verificationLoading = true;
        state.studentInfo = null;
      })
      .addCase(verifyStudent.fulfilled, (state, action) => {
        state.verificationLoading = false;
        state.studentInfo = action.payload;
      })
      .addCase(verifyStudent.rejected, (state, action) => {
        state.verificationLoading = false;
        state.error = action.payload ?? "Failed to verify student";
      });
  },
});

export const { clearMessages } = studentScoreSlice.actions;
export default studentScoreSlice.reducer;
