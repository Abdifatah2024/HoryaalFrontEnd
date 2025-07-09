import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API_URL } from "../../Constant";

// ---------- Types ----------

interface MonthDue {
  month: number;
  year: number;
  due: number;
}

interface StudentBalance {
  studentId: number;
  fullname: string;
  balance: number;
  months: MonthDue[];
}

interface FamilyBalance {
  parentName: string;
  phone: string;
  familyName?: string;
  totalFamilyBalance: number;
  students: StudentBalance[];
}

interface StudentPaymentDetail {
  studentName: string;
  amountPaid: number;
}

interface PayFamilyResponse {
  studentName: string;
  month: number;
  message: string;
  parentName: string;
  parentPhone: string;
  monthPaid: number;
  yearPaid: number;
  totalPaid: number;
  totalDiscountUsed: number;
  paymentDescription: string;
  students: StudentPaymentDetail[];
  paymentId?: number;
  createdAt?: string;
}

interface CheckResponse {
  alreadyUsed: boolean;
  message: string;
}

interface LastPaymentInfo {
  alreadyUsed: boolean;
  message: string;
  paymentId?: number;
  description?: string;
  createdAt?: string;
  paidFor?: {
    student: string;
    month: number;
    year: number;
    amount: string;
  }[];
}

interface State {
  loading: boolean;
  error: string | null;
  family: FamilyBalance | null;
  paymentLoading: boolean;
  paymentSuccess: PayFamilyResponse | null;
  paymentError: string | null;
  checkLoading: boolean;
  checkMessage: string | null;
  lastPaymentLoading: boolean;
  lastPaymentInfo: LastPaymentInfo | null;
}

// ---------- Initial State ----------

const initialState: State = {
  loading: false,
  error: null,
  family: null,
  paymentLoading: false,
  paymentSuccess: null,
  paymentError: null,
  checkLoading: false,
  checkMessage: null,
  lastPaymentLoading: false,
  lastPaymentInfo: null,
};

// ---------- Thunks ----------

export const fetchFamilyBalance = createAsyncThunk(
  "familyPayment/fetchFamilyBalance",
  async (query: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/fee/family/balance`, {
        params: { phone: query, familyName: query },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch family balance"
      );
    }
  }
);

// ✅ This now has a unique prefix
export const fetchStudentBalance = createAsyncThunk(
  "familyPayment/fetchStudentBalance",
  async (query: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/fee/students/search`, {
        params: { query },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch student balance"
      );
    }
  }
);

export const payFamilyMonthly = createAsyncThunk(
  "familyPayment/payFamilyMonthly",
  async (
    {
      parentPhone,
      familyName,
      month,
      year,
      discount = 0,
      discountReason = "",
      description = "",
    }: {
      parentPhone?: string;
      familyName?: string;
      month: number;
      year: number;
      discount?: number;
      discountReason?: string;
      description?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("Access_token");
      const res = await axios.post<PayFamilyResponse>(
        `${BASE_API_URL}/fee/pay-full-month`,
        {
          parentPhone,
          familyName,
          month,
          year,
          discount,
          discountReason,
          description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Family payment failed"
      );
    }
  }
);

export const payStudentMonthly = createAsyncThunk(
  "familyPayment/payStudentMonthly",
  async (
    {
      studentId,
      month,
      year,
      discount = 0,
      discountReason = "",
      description = "",
    }: {
      studentId: number;
      month: number;
      year: number;
      discount?: number;
      discountReason?: string;
      description?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("Access_token");
      const res = await axios.post<PayFamilyResponse>(
        `${BASE_API_URL}/fee/payment/student`,
        { studentId, month, year, discount, discountReason, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Student payment failed"
      );
    }
  }
);

export const checkPaymentNumberUsed = createAsyncThunk(
  "familyPayment/checkPaymentNumberUsed",
  async (
    {
      number,
      month,
      year,
      method,
    }: { number: string; month: number; year: number; method: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("Access_token");
      const res = await axios.post<CheckResponse>(
        `${BASE_API_URL}/fee/payment/check-last-used-number`,
        { number, month, year, method },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Check failed");
    }
  }
);

export const checkLastPaymentByNumber = createAsyncThunk(
  "familyPayment/checkLastPaymentByNumber",
  async (
    { number, method }: { number: string; method: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("Access_token");
      const res = await axios.post<LastPaymentInfo>(
        `${BASE_API_URL}/fee/check-payment-number`,
        { number, method },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Last payment check failed"
      );
    }
  }
);

// ---------- Slice ----------

const familyPaymentSlice = createSlice({
  name: "familyPayment",
  initialState,
  reducers: {
    clearFamilyBalance: (state) => {
      state.family = null;
      state.error = null;
      state.loading = false;
    },
    clearFamilyPaymentStatus: (state) => {
      state.paymentError = null;
      state.paymentSuccess = null;
    },
    clearNumberCheck: (state) => {
      state.checkMessage = null;
    },
    clearLastPaymentInfo: (state) => {
      state.lastPaymentInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch family
      .addCase(fetchFamilyBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.family = null;
      })
      .addCase(fetchFamilyBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.family = action.payload;
      })
      .addCase(fetchFamilyBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch student (now safe unique prefix)
      .addCase(fetchStudentBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.family = null;
      })
      .addCase(fetchStudentBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.family = action.payload;
      })
      .addCase(fetchStudentBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Family payment
      .addCase(payFamilyMonthly.pending, (state) => {
        state.paymentLoading = true;
        state.paymentSuccess = null;
        state.paymentError = null;
      })
      .addCase(payFamilyMonthly.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.paymentSuccess = action.payload;
      })
      .addCase(payFamilyMonthly.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload as string;
      })
      // Student payment
      .addCase(payStudentMonthly.pending, (state) => {
        state.paymentLoading = true;
        state.paymentSuccess = null;
        state.paymentError = null;
      })
      .addCase(payStudentMonthly.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.paymentSuccess = action.payload;
      })
      .addCase(payStudentMonthly.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload as string;
      })
      // Number check
      .addCase(checkPaymentNumberUsed.pending, (state) => {
        state.checkLoading = true;
        state.checkMessage = null;
      })
      .addCase(checkPaymentNumberUsed.fulfilled, (state, action) => {
        state.checkLoading = false;
        state.checkMessage = action.payload.message;
      })
      .addCase(checkPaymentNumberUsed.rejected, (state, action) => {
        state.checkLoading = false;
        state.checkMessage = action.payload as string;
      })
      // Last payment check
      .addCase(checkLastPaymentByNumber.pending, (state) => {
        state.lastPaymentLoading = true;
        state.lastPaymentInfo = null;
      })
      .addCase(checkLastPaymentByNumber.fulfilled, (state, action) => {
        state.lastPaymentLoading = false;
        state.lastPaymentInfo = action.payload;
      })
      .addCase(checkLastPaymentByNumber.rejected, (state, action) => {
        state.lastPaymentLoading = false;
        state.lastPaymentInfo = {
          alreadyUsed: false,
          message: action.payload as string,
        };
      });
  },
});

// ---------- Exports ----------

export const {
  clearFamilyBalance,
  clearFamilyPaymentStatus,
  clearNumberCheck,
  clearLastPaymentInfo,
} = familyPaymentSlice.actions;

export default familyPaymentSlice.reducer;
