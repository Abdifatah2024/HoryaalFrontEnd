import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

interface DisciplineRecord {
  id: number;
  type: string;
  description: string;
  actionTaken?: string;
  recordedAt: string;
}

interface StudentDisciplineState {
  studentId: number | null;
  fullname: string;
  className: string;
  disciplines: DisciplineRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: StudentDisciplineState = {
  studentId: null,
  fullname: "",
  className: "",
  disciplines: [],
  loading: false,
  error: null,
};

// Helper
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("Access_token");
  }
  return null;
};

// Thunk to fetch
export const fetchStudentDiscipline = createAsyncThunk(
  "studentDiscipline/fetch",
  async (studentId: number, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No token found");

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

const studentDisciplineSlice = createSlice({
  name: "studentDiscipline",
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
  },
});

export const { clearStudentRecord } = studentDisciplineSlice.actions;
export default studentDisciplineSlice.reducer;
