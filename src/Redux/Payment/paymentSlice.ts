// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios, { AxiosError } from "axios";
// import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";
// import { PayloadAction, AnyAction } from "@reduxjs/toolkit";

// // ---------------- Interfaces ----------------

// interface PaymentPayload {
//   studentId: number;
//   amountPaid: number;
//   discount: number;
//   discountReason: string;
//   Description: string;
// }

// interface Payment {
//   id: number;
//   studentId: number;
//   userId: number;
//   amountPaid: string;
//   discount: string;
//   Description: string;
//   date: string;
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

// interface DiscountLog {
//   id: number;
//   studentId: number;
//   studentFeeId: number;
//   month: number;
//   year: number;
//   amount: number;
//   reason: string;
//   approvedBy: number;
//   verified: boolean;
//   verifiedBy: string | null;
//   verifiedAt: string | null;
//   createdAt: string;
//   student: {
//     id: number;
//     fullname: string;
//   };
//   approvedUser: {
//     id: number;
//     fullName: string;
//     email: string;
//   };
// }

// interface DepositStatus {
//   studentId: number;
//   name: string;
//   totalRequired: number;
//   totalPaid: number;
//   carryForward: number;
//   overpaid: number;
//   hasExtraDeposit: boolean;
//   message: string;
// }

// interface BalanceSummary {
//   studentId: number;
//   name: string;
//   monthlyFee: number;
//   monthsGenerated: number;
//   unpaidMonths: number;
//   unpaidDetails: {
//     month: number;
//     year: number;
//     due: number;
//     paid: number;
//   }[];
//   totalRequired: number;
//   totalPaid: number;
//   carryForward: number;
//   rawBalance: number;
//   balanceDue: number;
//   explanation: string;
// }

// interface UnpaidStudent {
//   studentId: number;
//   name: string;
//   totalRequired: number;
//   totalPaid: number;
//   unpaidMonths: number;
//   carryForward: number;
//   balanceDue: number;
//   className: string;
// }

// interface PaymentAllocation {
//   id: number;
//   amount: string;
//   paymentId: number;
//   studentFeeId: number;
//   studentId: number;
//   payment: {
//     id: number;
//     amountPaid: string;
//     discount: string;
//     date: string;
//   };
//   studentFee: {
//     id: number;
//     month: number;
//     year: number;
//     isPaid: boolean;
//   };
//   Student: {
//     id: number;
//     fullname: string;
//   };
// }

// interface PaymentResponse {
//   message: string;
//   payment: Payment;
//   StudentName: string;
//   carryForward: number;
//   allocations: any[];
//   appliedDiscounts: any[];
// }

// interface State {
//   loading: boolean;
//   error: string;
//   paymentResponse: PaymentResponse | null;
//   paymentHistory: PaymentHistory | null;
//   depositStatus: DepositStatus | null;
//   balanceSummary: BalanceSummary | null;
//   unpaidStudents: UnpaidStudent[];
//   discountLogs: DiscountLog[];
//   allocations: PaymentAllocation[];
// }

// // ---------------- Initial State ----------------

// const initialState: State = {
//   loading: false,
//   error: "",
//   paymentResponse: null,
//   paymentHistory: null,
//   depositStatus: null,
//   balanceSummary: null,
//   unpaidStudents: [],
//   discountLogs: [],
//   allocations: [],
// };

// // ---------------- Token Helper ----------------

// const getAuthToken = () => {
//   const userData = localStorage.getItem("userData");
//   return userData ? JSON.parse(userData).Access_token : null;
// };

// // ---------------- Thunks ----------------

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

// export const submitMultiPayment = createAsyncThunk(
//   "payment/submitMultiPayment",
//   async (data: { students: PaymentPayload[] }, { rejectWithValue }) => {
//     try {
//       const token = getAuthToken();
//       if (!token) return rejectWithValue("Authentication required");
//       const res = await axios.post(`${BASE_API_URL}/fee/payment/multi`, data, {
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

// export const fetchStudentDepositStatus = createAsyncThunk(
//   "payment/fetchStudentDepositStatus",
//   async (studentId: number, { rejectWithValue }) => {
//     try {
//       const token = getAuthToken();
//       if (!token) return rejectWithValue("Authentication required");
//       const res = await axios.get(
//         `${BASE_API_URL}/fee/students/${studentId}/deposit-status`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
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

// export const fetchStudentBalanceSummary = createAsyncThunk(
//   "payment/fetchStudentBalanceSummary",
//   async (studentId: number, { rejectWithValue }) => {
//     try {
//       const token = getAuthToken();
//       if (!token) return rejectWithValue("Authentication required");
//       const res = await axios.get(
//         `${BASE_API_URL}/fee/students/${studentId}/balance`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
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

// export const fetchAllUnpaidStudents = createAsyncThunk(
//   "payment/fetchAllUnpaidStudents",
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = getAuthToken();
//       if (!token) return rejectWithValue("Authentication required");
//       const res = await axios.get(`${BASE_API_URL}/fee/StudentWithBalance`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data.students;
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

// export const fetchAllDiscountLogs = createAsyncThunk(
//   "payment/fetchAllDiscountLogs",
//   async (
//     filters: { month?: string; year?: string } = {},
//     { rejectWithValue }
//   ) => {
//     try {
//       const token = getAuthToken();
//       if (!token) return rejectWithValue("Authentication required");

//       const queryParams = new URLSearchParams();
//       if (filters.month) queryParams.append("month", filters.month);
//       if (filters.year) queryParams.append("year", filters.year);

//       const res = await axios.get(
//         `${BASE_API_URL}/fee/discounts?${queryParams}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       return res.data.discounts;
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

// export const fetchAllPaymentAllocations = createAsyncThunk(
//   "payment/fetchAllPaymentAllocations",
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = getAuthToken();
//       if (!token) return rejectWithValue("Authentication required");

//       const res = await axios.get(`${BASE_API_URL}/fee/payments`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const payments = res.data.payments;

//       // Flatten and attach student, payment, discount, etc.
//       const flatAllocations = payments.flatMap((payment: any) =>
//         payment.allocations.map((alloc: any) => ({
//           ...alloc,
//           Student: payment.student,
//           payment: {
//             id: payment.id,
//             amountPaid: payment.amountPaid,
//             discount: payment.discount,
//             date: payment.date,
//           },
//         }))
//       );

//       return flatAllocations;
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

// export const updatePaymentAllocation = createAsyncThunk(
//   "payment/updatePaymentAllocation",
//   async (
//     { id, amount }: { id: number; amount: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const token = getAuthToken();
//       if (!token) return rejectWithValue("Authentication required");

//       const res = await axios.put(
//         `${BASE_API_URL}/fee/payment-allocations/${id}`,
//         { amount },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       return res.data.updatedAllocation;
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

// // ---------------- Slice ----------------

// const paymentSlice = createSlice({
//   name: "payment",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // .addCase(submitPayment.fulfilled, (state, action) => {
//       //   state.paymentResponse = action.payload;
//       // })
//       .addCase(
//         submitPayment.fulfilled,
//         (state, action: PayloadAction<PaymentResponse>) => {
//           state.paymentResponse = action.payload;
//         }
//       )
//       .addCase(submitMultiPayment.fulfilled, (state, action) => {
//         state.paymentResponse = action.payload;
//       })
//       .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
//         state.paymentHistory = action.payload;
//       })
//       .addCase(fetchStudentDepositStatus.fulfilled, (state, action) => {
//         state.depositStatus = action.payload;
//       })
//       .addCase(fetchStudentBalanceSummary.fulfilled, (state, action) => {
//         state.balanceSummary = action.payload;
//       })
//       .addCase(fetchAllUnpaidStudents.fulfilled, (state, action) => {
//         state.unpaidStudents = action.payload;
//       })
//       .addCase(fetchAllDiscountLogs.fulfilled, (state, action) => {
//         state.discountLogs = action.payload;
//       })
//       .addCase(fetchAllPaymentAllocations.fulfilled, (state, action) => {
//         state.allocations = action.payload;
//       })
//       .addCase(updatePaymentAllocation.fulfilled, (state, action) => {
//         const updated = action.payload;
//         const index = state.allocations.findIndex((a) => a.id === updated.id);
//         if (index !== -1) {
//           state.allocations[index] = updated;
//         }
//       })
//       .addMatcher(
//         (action) =>
//           action.type.startsWith("payment/") &&
//           action.type.endsWith("/pending"),
//         (state) => {
//           state.loading = true;
//           state.error = "";
//         }
//       )
//       .addMatcher(
//         (action) =>
//           action.type.startsWith("payment/") &&
//           action.type.endsWith("/fulfilled"),
//         (state) => {
//           state.loading = false;
//         }
//       )
//       .addMatcher(
//         (action: AnyAction) =>
//           action.type.startsWith("payment/") &&
//           action.type.endsWith("/rejected"),
//         (state, action: PayloadAction<string>) => {
//           state.loading = false;
//           state.error = action.payload;
//         }
//       );
//   },
// });

// export default paymentSlice.reducer;
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// ---------------- Interfaces ----------------

interface PaymentPayload {
  studentId: number;
  amountPaid: number;
  discount: number;
  discountReason: string;
  Description: string;
}

interface Payment {
  id: number;
  studentId: number;
  userId: number;
  amountPaid: string;
  discount: string;
  description: string;
  date: string;
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

interface DiscountLog {
  id: number;
  studentId: number;
  studentFeeId: number;
  month: number;
  year: number;
  amount: number;
  reason: string;
  approvedBy: number;
  verified: boolean;
  verifiedBy: string | null;
  verifiedAt: string | null;
  createdAt: string;
  student: {
    id: number;
    fullname: string;
  };
  approvedUser: {
    id: number;
    fullName: string;
    email: string;
  };
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

interface UnpaidStudent {
  studentId: number;
  name: string;
  totalRequired: number;
  totalPaid: number;
  unpaidMonths: number;
  carryForward: number;
  balanceDue: number;
  className: string;
}

interface PaymentAllocation {
  id: number;
  amount: string;
  paymentId: number;
  studentFeeId: number;
  studentId: number;
  payment: {
    id: number;
    amountPaid: string;
    discount: string;
    date: string;
    studentId: number;
    fullname: string;
    description?: string;
  };
  studentFee: {
    id: number;
    month: number;
    year: number;
    isPaid: boolean;
  };
  Student: {
    id: number;
    fullname: string;
  };
}

interface PaymentResponse {
  message: string;
  payment: Payment;
  StudentName: string;
  carryForward: number;
  allocations: any[];
  appliedDiscounts: any[];
}

interface State {
  loading: boolean;
  error: string;
  paymentResponse: PaymentResponse | null;
  paymentHistory: PaymentHistory | null;
  depositStatus: DepositStatus | null;
  balanceSummary: BalanceSummary | null;
  unpaidStudents: UnpaidStudent[];
  discountLogs: DiscountLog[];
  allocations: PaymentAllocation[];
}

// ---------------- Initial State ----------------

const initialState: State = {
  loading: false,
  error: "",
  paymentResponse: null,
  paymentHistory: null,
  depositStatus: null,
  balanceSummary: null,
  unpaidStudents: [],
  discountLogs: [],
  allocations: [],
};

// ---------------- Token Helper ----------------

const getAuthToken = () => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData).Access_token : null;
};

// ---------------- Thunks ----------------

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

export const submitMultiPayment = createAsyncThunk(
  "payment/submitMultiPayment",
  async (data: { students: PaymentPayload[] }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("Authentication required");
      const res = await axios.post(`${BASE_API_URL}/fee/payment/multi`, data, {
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
        { headers: { Authorization: `Bearer ${token}` } }
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
        { headers: { Authorization: `Bearer ${token}` } }
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

export const fetchAllUnpaidStudents = createAsyncThunk(
  "payment/fetchAllUnpaidStudents",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("Authentication required");
      const res = await axios.get(`${BASE_API_URL}/fee/StudentWithBalance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

export const fetchAllDiscountLogs = createAsyncThunk(
  "payment/fetchAllDiscountLogs",
  async (
    filters: { month?: string; year?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("Authentication required");

      const queryParams = new URLSearchParams();
      if (filters.month) queryParams.append("month", filters.month);
      if (filters.year) queryParams.append("year", filters.year);

      const res = await axios.get(
        `${BASE_API_URL}/fee/discounts?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.discounts;
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

export const fetchAllPaymentAllocations = createAsyncThunk(
  "payment/fetchAllPaymentAllocations",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("Authentication required");

      const res = await axios.get(`${BASE_API_URL}/fee/payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const payments = res.data.payments;

      const flatAllocations = payments.flatMap((payment: any) =>
        payment.allocations.map((alloc: any) => ({
          ...alloc,
          Student: payment.student,
          payment: {
            id: payment.id,
            studentId: payment.studentId, // ✅ Now included
            amountPaid: payment.amountPaid,
            discount: payment.discount,
            description: payment.description,
            date: payment.date,
            fullname: payment.fullname,
          },
        }))
      );

      return flatAllocations;
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

// ✅ New Thunk: Update Payment
export const updatePayment = createAsyncThunk(
  "payment/updatePayment",
  async (
    {
      id,
      amountPaid,
      discount,
      Description,
    }: {
      id: number;
      amountPaid: string;
      discount: string;
      Description: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("Authentication required");

      const res = await axios.put(
        `${BASE_API_URL}/fee/payments/${id}`,
        { amountPaid, discount, Description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return res.data.updatedPayment;
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

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        submitPayment.fulfilled,
        (state, action: PayloadAction<PaymentResponse>) => {
          state.paymentResponse = action.payload;
        }
      )
      .addCase(submitMultiPayment.fulfilled, (state, action) => {
        state.paymentResponse = action.payload;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.paymentHistory = action.payload;
      })
      .addCase(fetchStudentDepositStatus.fulfilled, (state, action) => {
        state.depositStatus = action.payload;
      })
      .addCase(fetchStudentBalanceSummary.fulfilled, (state, action) => {
        state.balanceSummary = action.payload;
      })
      .addCase(fetchAllUnpaidStudents.fulfilled, (state, action) => {
        state.unpaidStudents = action.payload;
      })
      .addCase(fetchAllDiscountLogs.fulfilled, (state, action) => {
        state.discountLogs = action.payload;
      })
      .addCase(fetchAllPaymentAllocations.fulfilled, (state, action) => {
        state.allocations = action.payload;
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        const updated = action.payload;
        state.allocations = state.allocations.map((a) => {
          if (a.payment?.id === updated.id) {
            return {
              ...a,
              payment: {
                ...a.payment,
                amountPaid: updated.amountPaid,
                discount: updated.discount,
                Description: updated.Description,
              },
            };
          }
          return a;
        });
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("payment/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = "";
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("payment/") &&
          action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action: AnyAction) =>
          action.type.startsWith("payment/") &&
          action.type.endsWith("/rejected"),
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default paymentSlice.reducer;
