// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import { RootState } from "../store";
// import { BASE_API_URL } from "../../Constant";

// interface SubjectScore {
//   subjectName: string;
//   marks: number;
// }

// interface Exam {
//   examId: number;
//   examName: string;
//   subjectScores: SubjectScore[];
// }

// interface Student {
//   id: number;
//   fullName: string;
//   class: string;
// }

// interface StudentExamState {
//   loading: boolean;
//   student: Student | null;
//   exams: Exam[];
//   error: string | null;
// }

// const initialState: StudentExamState = {
//   loading: false,
//   student: null,
//   exams: [],
//   error: null,
// };

// export const fetchStudentExams = createAsyncThunk(
//   "student/fetchStudentExams",
//   async (
//     {
//       studentId,
//       academicYearId,
//     }: { studentId: number; academicYearId: number },
//     { rejectWithValue }
//   ) => {
//     try {
//       const res = await axios.get(
//         `${BASE_API_URL}/exam/student/${studentId}/year/${academicYearId}`
//       );
//       return res.data;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch exams"
//       );
//     }
//   }
// );

// const studentExamsSlice = createSlice({
//   name: "studentExams",
//   initialState,
//   reducers: {
//     clearStudentExams: (state) => {
//       state.loading = false;
//       state.student = null;
//       state.exams = [];
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchStudentExams.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchStudentExams.fulfilled, (state, action) => {
//         state.loading = false;
//         state.student = action.payload.student;
//         state.exams = action.payload.exams;
//       })
//       .addCase(fetchStudentExams.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearStudentExams } = studentExamsSlice.actions;
// export default studentExamsSlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API_URL } from "../../Constant";

interface SubjectScore {
  subjectName: string;
  marks: number;
}

interface Exam {
  examId: number;
  examName: string;
  subjectScores: SubjectScore[];
}

interface Student {
  id: number;
  fullName: string;
  class: string;
}

interface StudentExamState {
  loading: boolean;
  student: Student | null;
  exams: Exam[];
  academicYear: string | null; // ✅ NEW FIELD for academic year name
  error: string | null;
}

const initialState: StudentExamState = {
  loading: false,
  student: null,
  exams: [],
  academicYear: null,
  error: null,
};

// ✅ Fetch student exams by academic year
export const fetchStudentExams = createAsyncThunk(
  "student/fetchStudentExams",
  async (
    {
      studentId,
      academicYearId,
    }: { studentId: number; academicYearId: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get(
        `${BASE_API_URL}/exam/student/${studentId}/year/${academicYearId}`
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch exams"
      );
    }
  }
);

const studentExamsSlice = createSlice({
  name: "studentExams",
  initialState,
  reducers: {
    clearStudentExams: (state) => {
      state.loading = false;
      state.student = null;
      state.exams = [];
      state.academicYear = null; // ✅ Clear academic year too
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentExams.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudentExams.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload.student;
        state.exams = action.payload.exams;
        state.academicYear = action.payload.academicYear; // ✅ Set academic year name
      })
      .addCase(fetchStudentExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearStudentExams } = studentExamsSlice.actions;
export default studentExamsSlice.reducer;
