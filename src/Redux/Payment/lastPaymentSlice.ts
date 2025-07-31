import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// ---------------- Interfaces ----------------

interface LastPaymentStudent {
  id: number;
  fullname: string;
}

interface LastPaymentUser {
  id: number;
  fullName: string;
}

interface LastPaymentAllocation {
  studentFee: {
    month: number;
    year: number;
  };
}

interface LastPayment {
  id: number;
  amountPaid: string;
  discount: string;
  Description: string;
  date: string;
  student: LastPaymentStudent;
  user: LastPaymentUser;
  allocations: LastPaymentAllocation[];
}

interface LastPaymentState {
  loading: boolean;
  error: string;
  globalPayment: LastPayment | null;
  studentPayment: LastPayment | null;
}

// ---------------- Initial State ----------------

const initialState: LastPaymentState = {
  loading: false,
  error: "",
  globalPayment: null,
  studentPayment: null,
};

// ---------------- Token Helper ----------------

const getAuthToken = () => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData).Access_token : null;
};

// ---------------- Thunks ----------------

export const fetchLastGlobalPayment = createAsyncThunk(
  "lastPayment/fetchLastGlobalPayment",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("Authentication required");

      const res = await axios.get(`${BASE_API_URL}/Voucher/payment/last`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.payment;
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

export const fetchLastPaymentByStudent = createAsyncThunk(
  "lastPayment/fetchLastPaymentByStudent",
  async (studentId: number, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("Authentication required");

      const res = await axios.get(`${BASE_API_URL}/payment/last/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.payment;
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

// ---------------- Slice ----------------

const lastPaymentSlice = createSlice({
  name: "lastPayment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchLastGlobalPayment.fulfilled,
        (state, action: PayloadAction<LastPayment>) => {
          state.globalPayment = action.payload;
        }
      )
      .addCase(
        fetchLastPaymentByStudent.fulfilled,
        (state, action: PayloadAction<LastPayment>) => {
          state.studentPayment = action.payload;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("lastPayment/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = "";
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("lastPayment/") &&
          action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action: AnyAction) =>
          action.type.startsWith("lastPayment/") &&
          action.type.endsWith("/rejected"),
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default lastPaymentSlice.reducer;
