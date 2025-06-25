import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// ------------------ Types ------------------
export interface Discipline {
  id: number;
  studentId: number;
  type: string;
  description: string;
  actionTaken?: string;
  recordedAt?: string;
  isDeleted?: boolean;
  fullname?: string;
  student?: {
    fullname: string;
  }; // ✅ Fix: student is an object, not a string
}

export interface StudentVerification {
  id: number;
  fullname: string;
}

interface DisciplineState {
  disciplines: Discipline[];
  studentVerification: StudentVerification | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}

// ------------------ Initial State ------------------
const initialState: DisciplineState = {
  disciplines: [],
  studentVerification: null,
  loading: false,
  error: null,
  success: null,
};

// ------------------ Helpers ------------------
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("Access_token");
};

// ------------------ API URLs ------------------
const API_URL = "http://localhost:4000/Dicipline/discipline";
const STUDENT_URL = "http://localhost:4000/student";

// ------------------ Thunks ------------------

// Create new discipline
export const createDiscipline = createAsyncThunk(
  "discipline/create",
  async (disciplineData: Omit<Discipline, "id">, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Session expired. Please login again.");
        return rejectWithValue("No token found");
      }

      const response = await axios.post(API_URL, disciplineData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(
        response.data.message || "Discipline created successfully!"
      );
      return response.data.discipline;
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Failed to create discipline";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// Fetch all disciplines
export const fetchDisciplines = createAsyncThunk(
  "discipline/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Session expired. Please login again.");
        return rejectWithValue("No token found");
      }

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Failed to fetch disciplines";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// Update discipline
export const updateDiscipline = createAsyncThunk(
  "discipline/update",
  async (
    { id, updatedData }: { id: number; updatedData: Partial<Discipline> },
    { rejectWithValue }
  ) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Session expired. Please login again.");
        return rejectWithValue("No token found");
      }

      const response = await axios.put(`${API_URL}/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(
        response.data.message || "Discipline updated successfully!"
      );
      return response.data.discipline;
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Failed to update discipline";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// Delete discipline
export const deleteDiscipline = createAsyncThunk(
  "discipline/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Session expired. Please login again.");
        return rejectWithValue("No token found");
      }

      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(
        response.data.message || "Discipline deleted successfully!"
      );
      return id;
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Failed to delete discipline";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// Verify student
export const verifyStudent = createAsyncThunk(
  "discipline/verifyStudent",
  async (studentId: number, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Session expired. Please login again.");
        return rejectWithValue("No token found");
      }

      const response = await axios.get(`${STUDENT_URL}/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        id: response.data.id,
        fullname: response.data.fullname,
      };
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Student verification failed";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// ------------------ Slice ------------------

const disciplineSlice = createSlice({
  name: "discipline",
  initialState,
  reducers: {
    clearStudentVerification(state) {
      state.studentVerification = null;
    },
    clearDisciplineState(state) {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createDiscipline.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        createDiscipline.fulfilled,
        (state, action: PayloadAction<Discipline>) => {
          state.loading = false;
          state.success = "Created successfully";
          state.disciplines.push(action.payload);
        }
      )
      .addCase(createDiscipline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch
      .addCase(fetchDisciplines.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchDisciplines.fulfilled,
        (state, action: PayloadAction<Discipline[]>) => {
          state.loading = false;
          state.disciplines = action.payload;
        }
      )
      .addCase(fetchDisciplines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(
        updateDiscipline.fulfilled,
        (state, action: PayloadAction<Discipline>) => {
          const index = state.disciplines.findIndex(
            (d) => d.id === action.payload.id
          );
          if (index !== -1) {
            state.disciplines[index] = action.payload;
          }
        }
      )

      // Delete
      .addCase(
        deleteDiscipline.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.disciplines = state.disciplines.filter(
            (d) => d.id !== action.payload
          );
        }
      )

      // Verify Student
      .addCase(verifyStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        verifyStudent.fulfilled,
        (state, action: PayloadAction<StudentVerification>) => {
          state.loading = false;
          state.studentVerification = action.payload;
        }
      )
      .addCase(verifyStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.studentVerification = null;
      });
  },
});

export const { clearStudentVerification, clearDisciplineState } =
  disciplineSlice.actions;
export default disciplineSlice.reducer;
