// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios, { AxiosError } from "axios";
// import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// interface PaymentPayload {
//   studentId: number;
//   amountPaid: number;
//   discount: number;
//   discountReason: string;
//   description: string;
// }

// interface PaymentResponse {
//   message: string;
//   payment: any;
//   carryForward: number;
//   allocations: any[];
//   appliedDiscounts: any[];
// }

// interface PaymentHistory {
//   studentId: number;
//   name: string;
//   fee: number;
//   records: {
//     id: number;
//     month: number;
//     year: number;
//     required: number;
//     isPaid: boolean;
//     paid: number;
//     due: number;
//     paymentHistory: {
//       amount: number;
//       date: string;
//       discount: number;
//     }[];
//   }[];
// }

// interface State {
//   loading: boolean;
//   error: string;
//   paymentResponse: PaymentResponse | null;
//   paymentHistory: PaymentHistory | null;
// }

// const initialState: State = {
//   loading: false,
//   error: "",
//   paymentResponse: null,
//   paymentHistory: null,
// };

// // 🔐 Token utility
// const getAuthToken = () => {
//   const userData = localStorage.getItem("userData");
//   return userData ? JSON.parse(userData).Access_token : null;
// };

// // 🔹 Submit Payment
// export const submitPayment = createAsyncThunk(
//   "payment/submitPayment",
//   async (data: PaymentPayload, { rejectWithValue }) => {
//     try {
//       const token = getAuthToken();
//       if (!token) return rejectWithValue("Authentication required");

//       const res = await axios.post(`${BASE_API_URL}/fee/payment`, data, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       return res.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return rejectWithValue(
//           error.response?.data?.message || DEFAULT_ERROR_MESSAGE
//         );
//       }
//       return rejectWithValue(DEFAULT_ERROR_MESSAGE);
//     }
//   }
// );

// // 🔹 Fetch Payment History
// export const fetchPaymentHistory = createAsyncThunk(
//   "payment/fetchPaymentHistory",
//   async (studentId: number, { rejectWithValue }) => {
//     try {
//       const token = getAuthToken();
//       if (!token) return rejectWithValue("Authentication required");

//       const res = await axios.get(`${BASE_API_URL}/fee/students/${studentId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       return res.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return rejectWithValue(
//           error.response?.data?.message || DEFAULT_ERROR_MESSAGE
//         );
//       }
//       return rejectWithValue(DEFAULT_ERROR_MESSAGE);
//     }
//   }
// );

// const paymentSlice = createSlice({
//   name: "payment",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(submitPayment.pending, (state) => {
//         state.loading = true;
//         state.error = "";
//       })
//       .addCase(submitPayment.fulfilled, (state, action) => {
//         state.loading = false;
//         state.paymentResponse = action.payload;
//       })
//       .addCase(submitPayment.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       .addCase(fetchPaymentHistory.pending, (state) => {
//         state.loading = true;
//         state.error = "";
//       })
//       .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
//         state.loading = false;
//         state.paymentHistory = action.payload;
//       })
//       .addCase(fetchPaymentHistory.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export default paymentSlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

interface PaymentPayload {
  studentId: number;
  amountPaid: number;
  discount: number;
  discountReason: string;
  description: string;
}

interface PaymentResponse {
  message: string;
  payment: any;
  carryForward: number;
  allocations: any[];
  appliedDiscounts: any[];
}

interface PaymentHistory {
  studentId: number;
  name: string;
  fee: number;
  records: {
    id: number;
    month: number;
    year: number;
    required: number;
    isPaid: boolean;
    paid: number;
    due: number;
    paymentHistory: {
      amount: number;
      date: string;
      discount: number;
    }[];
  }[];
}

interface DepositStatus {
  studentId: number;
  name: string;
  totalRequired: number;
  totalPaid: number;
  carryForward: number;
  overpaid: number;
  hasExtraDeposit: boolean;
  message: string;
}

interface BalanceSummary {
  studentId: number;
  name: string;
  monthlyFee: number;
  monthsGenerated: number;
  unpaidMonths: number;
  unpaidDetails: {
    month: number;
    year: number;
    due: number;
    paid: number;
  }[];
  totalRequired: number;
  totalPaid: number;
  carryForward: number;
  rawBalance: number;
  balanceDue: number;
  explanation: string;
}

interface State {
  loading: boolean;
  error: string;
  paymentResponse: PaymentResponse | null;
  paymentHistory: PaymentHistory | null;
  depositStatus: DepositStatus | null;
  balanceSummary: BalanceSummary | null;
}

const initialState: State = {
  loading: false,
  error: "",
  paymentResponse: null,
  paymentHistory: null,
  depositStatus: null,
  balanceSummary: null,
};

const getAuthToken = () => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData).Access_token : null;
};

export const submitPayment = createAsyncThunk(
  "payment/submitPayment",
  async (data: PaymentPayload, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("Authentication required");

      const res = await axios.post(`${BASE_API_URL}/fee/payment`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
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

export const fetchPaymentHistory = createAsyncThunk(
  "payment/fetchPaymentHistory",
  async (studentId: number, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("Authentication required");

      const res = await axios.get(`${BASE_API_URL}/fee/students/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
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

export const fetchStudentDepositStatus = createAsyncThunk(
  "payment/fetchStudentDepositStatus",
  async (studentId: number, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("Authentication required");

      const res = await axios.get(
        `${BASE_API_URL}/fee/students/${studentId}/deposit-status`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
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

export const fetchStudentBalanceSummary = createAsyncThunk(
  "payment/fetchStudentBalanceSummary",
  async (studentId: number, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("Authentication required");

      const res = await axios.get(
        `${BASE_API_URL}/fee/students/${studentId}/balance`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
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

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitPayment.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(submitPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentResponse = action.payload;
      })
      .addCase(submitPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentHistory = action.payload;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStudentDepositStatus.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchStudentDepositStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.depositStatus = action.payload;
      })
      .addCase(fetchStudentDepositStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStudentBalanceSummary.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchStudentBalanceSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.balanceSummary = action.payload;
      })
      .addCase(fetchStudentBalanceSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default paymentSlice.reducer;
