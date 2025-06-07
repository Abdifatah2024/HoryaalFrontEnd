import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ============================
// Types
// ============================

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

interface Student {
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

  // ✅ Balance-related
  monthlyFee?: number;
  totalMonths?: number;
  totalFees?: number;
  totalPaid?: number;
  carryForward?: number;
  balance?: number;
}

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
}

// ============================
// Initial State
// ============================

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
};

// ============================
// Thunks
// ============================

// 1. Fetch list of children (students)
export const fetchMyStudents = createAsyncThunk<Student[]>(
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
      return allStudents as Student[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch students"
      );
    }
  }
);

// 2. Fetch attendance
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
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch attendance"
      );
    }
  }
);

// 3. Fetch discipline
export const fetchStudentDiscipline = createAsyncThunk(
  "students/fetchStudentDiscipline",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Access_token");
      const response = await axios.get(
        "http://localhost:4000/Dicipline/parent/students/discipline",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch discipline"
      );
    }
  }
);

// 4. Fetch payment balance
export const fetchStudentBalance = createAsyncThunk(
  "students/fetchStudentBalance",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Access_token");
      const response = await axios.get(
        "http://localhost:4000/Dicipline//parent/students/balance",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch payment balances"
      );
    }
  }
);

// ============================
// Slice
// ============================

const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch My Students
    builder
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
      });

    // Attendance
    builder
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

    // Discipline
    builder
      .addCase(fetchStudentDiscipline.pending, (state) => {
        state.disciplineLoading = true;
        state.disciplineError = null;
      })
      .addCase(fetchStudentDiscipline.fulfilled, (state, action) => {
        state.disciplineLoading = false;
        const disciplineData = action.payload;

        state.students = state.students.map((student) => {
          const match = disciplineData.find((s: any) => s.id === student.id);
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

    // Balance
    builder
      .addCase(fetchStudentBalance.pending, (state) => {
        state.balanceLoading = true;
        state.balanceError = null;
      })
      .addCase(fetchStudentBalance.fulfilled, (state, action) => {
        state.balanceLoading = false;
        const balanceData = action.payload;

        state.students = state.students.map((student) => {
          const match = balanceData.find((s: any) => s.id === student.id);
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
  },
});

export default studentSlice.reducer;
