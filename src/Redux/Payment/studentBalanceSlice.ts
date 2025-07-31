import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// ------------------ Types ------------------

export interface StudentDueMonth {
  month: number;
  year: number;
  due: number;
}

export interface StudentWithBalance {
  studentId: number;
  fullname: string;
  className: string;
  balance: number;
  carryForward: number;
  monthsDue: StudentDueMonth[];
}

interface StudentBalanceState {
  loading: boolean;
  error: string;
  students: StudentWithBalance[];
}

// ------------------ Initial State ------------------

const initialState: StudentBalanceState = {
  loading: false,
  error: "",
  students: [],
};

// ------------------ Auth Helper ------------------

const getAuthToken = () => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData).Access_token : null;
};

// ------------------ Thunk ------------------

export const fetchStudentsWithBalancesAndMonths = createAsyncThunk<
  StudentWithBalance[],
  void,
  { rejectValue: string }
>(
  "studentBalance/fetchStudentsWithBalancesAndMonths",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("Authentication required");

      const res = await axios.get(
        `${BASE_API_URL}/fee/GetStudent/Balance/Month`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.students;
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

// ------------------ Slice ------------------

const studentBalanceSlice = createSlice({
  name: "studentBalance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentsWithBalancesAndMonths.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        fetchStudentsWithBalancesAndMonths.fulfilled,
        (state, action: PayloadAction<StudentWithBalance[]>) => {
          state.loading = false;
          state.students = action.payload;
        }
      )
      .addCase(
        fetchStudentsWithBalancesAndMonths.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || DEFAULT_ERROR_MESSAGE;
        }
      );
  },
});

export default studentBalanceSlice.reducer;
