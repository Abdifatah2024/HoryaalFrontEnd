import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// ✅ Types
export interface DeletedStudent {
  studentId: number;
  fullName: string;
  className: string;
  reason: string;
  deletedAt: string;
  deletedByUserId: number;
  deletedByName: string;
  deletedByEmail: string;
}

//   studentId: number;
//   fullName: string;
//   className: string;
//   reason: string;
//   deletedAt: string;
//   restoredAt: string;
//   restoredByName: string;
//   deletedBy: string;
// }

// ✅ Payloads
export interface RestoredStudent {
  studentId: number;
  fullName: string;
  className: string;
  reason: string;
  deletedAt: string;
  restoredAt: string;
  deletedBy: {
    id: number;
    name: string;
    email: string;
  };
  restoredBy: {
    id: number;
    name: string;
    email: string;
  };
}

interface SoftDeletePayload {
  studentId: number;
  reason: string;
}

interface RestorePayload {
  studentId: number;
}

// ✅ State
interface SoftDeleteState {
  deletedStudents: DeletedStudent[];
  restoredStudents: RestoredStudent[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

// ✅ Initial State
const initialState: SoftDeleteState = {
  deletedStudents: [],
  restoredStudents: [],
  loading: false,
  error: null,
  successMessage: null,
};

// ✅ Thunks
export const softDeleteStudent = createAsyncThunk<
  string,
  SoftDeletePayload,
  { rejectValue: string }
>("students/softDelete", async (payload, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("Access_token");
    const response = await axios.post<{ message: string }>(
      `${BASE_API_URL}/student/soft-delete`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.message;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      axiosError.response?.data?.message ||
        axiosError.message ||
        DEFAULT_ERROR_MESSAGE
    );
  }
});

export const fetchDeletedStudents = createAsyncThunk<
  DeletedStudent[],
  void,
  { rejectValue: string }
>("students/fetchDeleted", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("Access_token");
    const response = await axios.get<{ deletedStudents: DeletedStudent[] }>(
      `${BASE_API_URL}/student/soft/deleted`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.deletedStudents;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      axiosError.response?.data?.message ||
        axiosError.message ||
        DEFAULT_ERROR_MESSAGE
    );
  }
});

export const restoreStudent = createAsyncThunk<
  string,
  RestorePayload,
  { rejectValue: string }
>("students/restoreStudent", async ({ studentId }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("Access_token");
    const response = await axios.post<{ message: string }>(
      `${BASE_API_URL}/student/restore`,
      { studentId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.message;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      axiosError.response?.data?.message ||
        axiosError.message ||
        DEFAULT_ERROR_MESSAGE
    );
  }
});

export const fetchRestoredStudents = createAsyncThunk<
  RestoredStudent[],
  void,
  { rejectValue: string }
>("students/fetchRestored", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("Access_token");
    const response = await axios.get<{ restoredStudents: RestoredStudent[] }>(
      `${BASE_API_URL}/student/students/restored`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.restoredStudents;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      axiosError.response?.data?.message ||
        axiosError.message ||
        DEFAULT_ERROR_MESSAGE
    );
  }
});

// ✅ Slice
const studentSoftDeleteSlice = createSlice({
  name: "studentSoftDelete",
  initialState,
  reducers: {
    clearSoftDeleteState: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(softDeleteStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        softDeleteStudent.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.successMessage = action.payload;
        }
      )
      .addCase(softDeleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? DEFAULT_ERROR_MESSAGE;
      })

      .addCase(fetchDeletedStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDeletedStudents.fulfilled,
        (state, action: PayloadAction<DeletedStudent[]>) => {
          state.loading = false;
          state.deletedStudents = action.payload;
        }
      )
      .addCase(fetchDeletedStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? DEFAULT_ERROR_MESSAGE;
      })

      .addCase(restoreStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        restoreStudent.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.successMessage = action.payload;
        }
      )
      .addCase(restoreStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? DEFAULT_ERROR_MESSAGE;
      })

      .addCase(fetchRestoredStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRestoredStudents.fulfilled,
        (state, action: PayloadAction<RestoredStudent[]>) => {
          state.loading = false;
          state.restoredStudents = action.payload;
        }
      )
      .addCase(fetchRestoredStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? DEFAULT_ERROR_MESSAGE;
      });
  },
});

export const { clearSoftDeleteState } = studentSoftDeleteSlice.actions;

export default studentSoftDeleteSlice.reducer;
