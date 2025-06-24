// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import { BASE_API_URL } from "../../Constant";

// // ---------- Types ----------

// interface MonthDue {
//   month: number;
//   year: number;
//   due: number;
// }

// interface StudentBalance {
//   studentId: number;
//   fullname: string;
//   balance: number;
//   months: MonthDue[];
// }

// interface FamilyBalance {
//   parentName: string;
//   phone: string;
//   totalFamilyBalance: number;
//   students: StudentBalance[];
// }

// interface StudentPaymentDetail {
//   studentName: string; // Assuming your backend returns this or similar
//   amountPaid: number; // Assuming your backend returns this or similar
//   // Add other details if needed for the receipt, e.g., month, year paid for a specific student
// }

// // Updated PayFamilyResponse to include all necessary receipt details
// interface PayFamilyResponse {
//   message: string;
//   parentName: string; // Add this for the receipt
//   parentPhone: string; // Add this for the receipt
//   monthPaid: number; // Add the month that was paid for
//   yearPaid: number; // Add the year that was paid for
//   totalPaid: number;
//   totalDiscountUsed: number;
//   paymentDescription: string; // e.g., "Cash", "ZAAD - 063xxxxxx", "EVC Plus"
//   students: StudentPaymentDetail[]; // Now contains detailed info per student
//   // Add any other fields your receipt needs (e.g., paymentId, dateProcessed, etc.)
//   paymentId?: number; // Optional, if your backend returns a payment ID
//   createdAt?: string; // Optional, if your backend returns the creation timestamp
// }

// interface CheckResponse {
//   alreadyUsed: boolean;
//   message: string;
// }

// interface LastPaymentInfo {
//   alreadyUsed: boolean;
//   message: string;
//   paymentId?: number;
//   description?: string;
//   createdAt?: string;
//   paidFor?: {
//     student: string;
//     month: number;
//     year: number;
//     amount: string;
//   }[];
// }

// interface State {
//   loading: boolean;
//   error: string | null;
//   family: FamilyBalance | null;
//   paymentLoading: boolean;
//   paymentSuccess: PayFamilyResponse | null; // <-- CHANGED TYPE HERE
//   paymentError: string | null;
//   checkLoading: boolean;
//   checkMessage: string | null;
//   lastPaymentLoading: boolean;
//   lastPaymentInfo: LastPaymentInfo | null;
// }

// // ---------- Initial State ----------

// const initialState: State = {
//   loading: false,
//   error: null,
//   family: null,
//   paymentLoading: false,
//   paymentSuccess: null, // Initialize as null
//   paymentError: null,
//   checkLoading: false,
//   checkMessage: null,
//   lastPaymentLoading: false,
//   lastPaymentInfo: null,
// };

// // ---------- Thunks ----------

// export const fetchFamilyBalance = createAsyncThunk(
//   "familyPayment/fetchBalance",
//   async (query: string, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE_API_URL}/fee/family/balance`, {
//         params: {
//           phone: query, // backend checks phone first
//           familyName: query, // then checks familyName if not found
//         },
//       });
//       return res.data;
//     } catch (err: any) {
//       return rejectWithValue(
//         err?.response?.data?.message || "Failed to fetch family balance"
//       );
//     }
//   }
// );

// export const payFamilyMonthly = createAsyncThunk<
//   PayFamilyResponse, // <-- Specify the fulfilled type
//   {
//     parentPhone?: string;
//     familyName?: string;
//     month: number;
//     year: number;
//     discount?: number;
//     discountReason?: string;
//     description?: string;
//   },
//   { rejectValue: string }
// >(
//   "familyPayment/payFamilyMonthly",
//   async (
//     {
//       parentPhone,
//       familyName,
//       month,
//       year,
//       discount = 0,
//       discountReason = "",
//       description = "",
//     },
//     { rejectWithValue }
//   ) => {
//     try {
//       const token = localStorage.getItem("Access_token");

//       const res = await axios.post<PayFamilyResponse>( // <-- Use PayFamilyResponse here
//         `${BASE_API_URL}/fee/pay-full-month`,
//         {
//           parentPhone,
//           familyName,
//           month,
//           year,
//           discount,
//           discountReason,
//           description,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // IMPORTANT: Ensure your backend response matches the PayFamilyResponse interface.
//       // If the backend returns different field names (e.g., 'parent' instead of 'parentName'),
//       // you'll need to map them here before returning `res.data`.
//       // For example:
//       // return {
//       //   message: res.data.message,
//       //   parentName: res.data.parent, // Example mapping
//       //   ...other fields
//       // }

//       return res.data; // Return the full data from the backend
//     } catch (err: any) {
//       return rejectWithValue(
//         err?.response?.data?.message || "Family payment failed"
//       );
//     }
//   }
// );

// export const checkPaymentNumberUsed = createAsyncThunk(
//   "familyPayment/checkPaymentNumberUsed",
//   async (
//     {
//       number,
//       month,
//       year,
//       method,
//     }: { number: string; month: number; year: number; method: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const token = localStorage.getItem("Access_token");
//       const res = await axios.post<CheckResponse>(
//         `${BASE_API_URL}/fee/payment/check-last-used-number`,
//         { number, month, year, method },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return res.data;
//     } catch (err: any) {
//       return rejectWithValue(err?.response?.data?.message || "Check failed");
//     }
//   }
// );

// export const checkLastPaymentByNumber = createAsyncThunk(
//   "familyPayment/checkLastPaymentByNumber",
//   async (
//     { number, method }: { number: string; method: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const token = localStorage.getItem("Access_token");
//       const res = await axios.post<LastPaymentInfo>(
//         `${BASE_API_URL}/fee/check-payment-number`,
//         { number, method },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return res.data;
//     } catch (err: any) {
//       return rejectWithValue(
//         err?.response?.data?.message || "Last payment check failed"
//       );
//     }
//   }
// );

// // ---------- Slice ----------

// const familyPaymentSlice = createSlice({
//   name: "familyPayment",
//   initialState,
//   reducers: {
//     clearFamilyBalance: (state) => {
//       state.family = null;
//       state.error = null;
//       state.loading = false;
//     },
//     clearFamilyPaymentStatus: (state) => {
//       state.paymentError = null;
//       state.paymentSuccess = null; // Clears the full object now
//     },
//     clearNumberCheck: (state) => {
//       state.checkMessage = null;
//     },
//     clearLastPaymentInfo: (state) => {
//       state.lastPaymentInfo = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch balance
//       .addCase(fetchFamilyBalance.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchFamilyBalance.fulfilled, (state, action) => {
//         state.loading = false;
//         state.family = action.payload;
//       })
//       .addCase(fetchFamilyBalance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Payment
//       .addCase(payFamilyMonthly.pending, (state) => {
//         state.paymentLoading = true;
//         state.paymentSuccess = null; // Ensure it's null when pending
//         state.paymentError = null;
//       })
//       .addCase(payFamilyMonthly.fulfilled, (state, action) => {
//         state.paymentLoading = false;
//         state.paymentSuccess = action.payload; // <-- CHANGED HERE: Store the entire payload
//         state.paymentError = null;
//       })
//       .addCase(payFamilyMonthly.rejected, (state, action) => {
//         state.paymentLoading = false;
//         state.paymentSuccess = null; // Clear success on error
//         state.paymentError = action.payload as string;
//       })

//       // Check number usage
//       .addCase(checkPaymentNumberUsed.pending, (state) => {
//         state.checkLoading = true;
//         state.checkMessage = null;
//       })
//       .addCase(checkPaymentNumberUsed.fulfilled, (state, action) => {
//         state.checkLoading = false;
//         state.checkMessage = action.payload.message;
//       })
//       .addCase(checkPaymentNumberUsed.rejected, (state, action) => {
//         state.checkLoading = false;
//         state.checkMessage = action.payload as string;
//       })

//       // Check last payment
//       .addCase(checkLastPaymentByNumber.pending, (state) => {
//         state.lastPaymentLoading = true;
//         state.lastPaymentInfo = null;
//       })
//       .addCase(checkLastPaymentByNumber.fulfilled, (state, action) => {
//         state.lastPaymentLoading = false;
//         state.lastPaymentInfo = action.payload;
//       })
//       .addCase(checkLastPaymentByNumber.rejected, (state, action) => {
//         state.lastPaymentLoading = false;
//         state.lastPaymentInfo = {
//           alreadyUsed: false,
//           message: action.payload as string,
//         };
//       });
//   },
// });

// // ---------- Exports ----------

// export const {
//   clearFamilyBalance,
//   clearFamilyPaymentStatus,
//   clearNumberCheck,
//   clearLastPaymentInfo,
// } = familyPaymentSlice.actions;

// export default familyPaymentSlice.reducer;
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
  totalFamilyBalance: number;
  students: StudentBalance[];
}

interface StudentPaymentDetail {
  studentName: string;
  amountPaid: number;
  // Add other receipt-relevant details here if needed
}

interface PayFamilyResponse {
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
  "familyPayment/fetchBalance",
  async (query: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/fee/family/balance`, {
        params: {
          phone: query,
          familyName: query,
        },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch family balance"
      );
    }
  }
);

export const payFamilyMonthly = createAsyncThunk<
  PayFamilyResponse,
  {
    parentPhone?: string;
    familyName?: string;
    month: number;
    year: number;
    discount?: number;
    discountReason?: string;
    description?: string;
  },
  { rejectValue: string }
>(
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Family payment failed"
      );
    }
  }
);

export const payStudentMonthly = createAsyncThunk<
  PayFamilyResponse,
  {
    studentId: number;
    month: number;
    year: number;
    discount?: number;
    discountReason?: string;
    description?: string;
  },
  { rejectValue: string }
>(
  "familyPayment/payStudentMonthly",
  async (
    {
      studentId,
      month,
      year,
      discount = 0,
      discountReason = "",
      description = "",
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("Access_token");
      const res = await axios.post<PayFamilyResponse>(
        `${BASE_API_URL}/fee/payment/student`,
        {
          studentId,
          month,
          year,
          discount,
          discountReason,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
      // Fetch balance
      .addCase(fetchFamilyBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFamilyBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.family = action.payload;
      })
      .addCase(fetchFamilyBalance.rejected, (state, action) => {
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
        state.paymentError = null;
      })
      .addCase(payFamilyMonthly.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentSuccess = null;
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
        state.paymentError = null;
      })
      .addCase(payStudentMonthly.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentSuccess = null;
        state.paymentError = action.payload as string;
      })

      // Check number usage
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
