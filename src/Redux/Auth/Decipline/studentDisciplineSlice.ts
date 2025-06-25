import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Discipline record type
interface MinimalStudent {
  id: number;
  fullname: string;
}

interface DisciplineRecord {
  id: number;
  type: string;
  description: string;
  actionTaken?: string;
  recordedAt: string;
  student?: MinimalStudent; // for displaying student.fullname in table
}

// Slice state
interface StudentDisciplineState {
  studentId: number | null;
  fullname: string;
  className: string;
  disciplines: DisciplineRecord[];
  loading: boolean;
  error: string | null;

  students: MinimalStudent[];
  studentListLoading: boolean;
  studentListError: string | null;
}

// Initial state
const initialState: StudentDisciplineState = {
  studentId: null,
  fullname: "",
  className: "",
  disciplines: [],
  loading: false,
  error: null,

  students: [],
  studentListLoading: false,
  studentListError: null,
};

// 🔐 Helper to get token
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("Access_token");
  }
  return null;
};

//
// ─── FETCH DISCIPLINE BY STUDENT ID ─────────────────────────────────────
//
export const fetchStudentDiscipline = createAsyncThunk(
  "student/fetchDiscipline",
  async (studentId: number, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const res = await axios.get(
        `http://localhost:4000/Dicipline/discipline/${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Failed to fetch student record";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

//
// ─── FETCH STUDENT LIST ────────────────────────────────────────────────
//
export const fetchStudentList = createAsyncThunk(
  "student/fetchList",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const res = await axios.get(
        "http://localhost:4000/Dicipline/students/minimal",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch student list");
    }
  }
);

//
// ─── SLICE ─────────────────────────────────────────────────────────────
//
const studentDisciplineSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    clearStudentRecord(state) {
      state.studentId = null;
      state.fullname = "";
      state.className = "";
      state.disciplines = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // 🔸 fetchStudentDiscipline
    builder
      .addCase(fetchStudentDiscipline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchStudentDiscipline.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.studentId = action.payload.id;
          state.fullname = action.payload.fullname;
          state.className = action.payload.className;
          state.disciplines = action.payload.disciplines;
        }
      )
      .addCase(fetchStudentDiscipline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 🔸 fetchStudentList
    builder
      .addCase(fetchStudentList.pending, (state) => {
        state.studentListLoading = true;
        state.studentListError = null;
      })
      .addCase(
        fetchStudentList.fulfilled,
        (state, action: PayloadAction<MinimalStudent[]>) => {
          state.students = action.payload;
          state.studentListLoading = false;
        }
      )
      .addCase(fetchStudentList.rejected, (state, action) => {
        state.studentListLoading = false;
        state.studentListError = action.payload as string;
      });
  },
});

export const { clearStudentRecord } = studentDisciplineSlice.actions;
export default studentDisciplineSlice.reducer;
