// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios, { AxiosError } from "axios";
// import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// export interface Expense {
//   id: number;
//   category: string;
//   amount: number;
//   date: string;
//   paymentMethod: string;
//   description?: string;
//   approvedBy?: string;
//   receiptUrl?: string;
//   userId: number;
// }

// interface FinancialSummary {
//   totalIncome: number;
//   totalAdvance: number;
//   totalExpense: number;
//   used: number;
//   remaining: number;
// }

// interface State {
//   expenses: Expense[];
//   loading: boolean;
//   error: string | null;
//   summary: FinancialSummary | null;
//   totalCount: number;
// }

// const initialState: State = {
//   expenses: [],
//   loading: false,
//   error: null,
//   summary: null,
//   totalCount: 0,
// };

// const getToken = () => {
//   const data = localStorage.getItem("userData");
//   return data ? JSON.parse(data).Access_token : null;
// };

// export const getAllExpenses = createAsyncThunk(
//   "expenses/getAll",
//   async (filters: any, { rejectWithValue }) => {
//     try {
//       const token = getToken();
//       const res = await axios.get(`${BASE_API_URL}/expenses`, {
//         params: filters,
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data;
//     } catch (error) {
//       const err = error as AxiosError;
//       return rejectWithValue(err.response?.data || DEFAULT_ERROR_MESSAGE);
//     }
//   }
// );

// export const createExpense = createAsyncThunk(
//   "expenses/create",
//   async (data: Omit<Expense, "id" | "userId">, { rejectWithValue }) => {
//     try {
//       const token = getToken();
//       const res = await axios.post(`${BASE_API_URL}/expenses`, data, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data;
//     } catch (error) {
//       const err = error as AxiosError;
//       return rejectWithValue(err.response?.data || DEFAULT_ERROR_MESSAGE);
//     }
//   }
// );

// export const updateExpense = createAsyncThunk(
//   "expenses/update",
//   async (
//     { id, data }: { id: number; data: Partial<Expense> },
//     { rejectWithValue }
//   ) => {
//     try {
//       const token = getToken();
//       const res = await axios.put(`${BASE_API_URL}/expenses/${id}`, data, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data;
//     } catch (error) {
//       const err = error as AxiosError;
//       return rejectWithValue(err.response?.data || DEFAULT_ERROR_MESSAGE);
//     }
//   }
// );

// export const deleteExpense = createAsyncThunk(
//   "expenses/delete",
//   async (id: number, { rejectWithValue }) => {
//     try {
//       const token = getToken();
//       await axios.delete(`${BASE_API_URL}/expenses/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return id;
//     } catch (error) {
//       const err = error as AxiosError;
//       return rejectWithValue(err.response?.data || DEFAULT_ERROR_MESSAGE);
//     }
//   }
// );

// const expenseSlice = createSlice({
//   name: "expenses",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(getAllExpenses.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getAllExpenses.fulfilled, (state, action) => {
//         state.loading = false;
//         state.expenses = action.payload.expenses;
//         state.totalCount = action.payload.count;
//         state.summary = action.payload.financialSummary || null;
//       })
//       .addCase(getAllExpenses.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(createExpense.fulfilled, (state, action) => {
//         state.expenses.unshift(action.payload.expense);
//         state.summary = action.payload.financialSummary || null;
//         state.totalCount += 1;
//       })
//       .addCase(updateExpense.fulfilled, (state, action) => {
//         const index = state.expenses.findIndex(
//           (e) => e.id === action.payload.expense.id
//         );
//         if (index !== -1) {
//           state.expenses[index] = action.payload.expense;
//           state.summary = action.payload.financialSummary || null;
//         }
//       })
//       .addCase(deleteExpense.fulfilled, (state, action) => {
//         state.expenses = state.expenses.filter((e) => e.id !== action.payload);
//         state.totalCount -= 1;
//       });
//   },
// });

// export default expenseSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

export interface Expense {
  id: number;
  category: string;
  amount: number;
  date: string;
  paymentMethod: string;
  description?: string;
  approvedBy?: string;
  receiptUrl?: string;
  userId: number;
}

interface FinancialSummary {
  totalIncome: number;
  totalAdvance: number;
  totalExpense: number;
  used: number;
  remaining: number;
}

interface State {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  summary: FinancialSummary | null;
  totalCount: number;
  incomeSummary: FinancialSummary | null; // ✅ Add this line
}

const initialState: State = {
  expenses: [],
  loading: false,
  error: null,
  summary: null,
  totalCount: 0,
  incomeSummary: null, // ✅ Add this
};

const getToken = () => {
  const data = localStorage.getItem("userData");
  return data ? JSON.parse(data).Access_token : null;
};

// 🔄 Get all expenses
export const getAllExpenses = createAsyncThunk(
  "expenses/getAll",
  async (filters: any, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.get(`${BASE_API_URL}/expenses`, {
        params: filters,
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err.response?.data || DEFAULT_ERROR_MESSAGE);
    }
  }
);

// ➕ Create expense
export const createExpense = createAsyncThunk(
  "expenses/create",
  async (data: Omit<Expense, "id" | "userId">, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.post(`${BASE_API_URL}/expenses/create`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err.response?.data || DEFAULT_ERROR_MESSAGE);
    }
  }
);

// ✏️ Update expense
export const updateExpense = createAsyncThunk(
  "expenses/update",
  async (
    { id, data }: { id: number; data: Partial<Expense> },
    { rejectWithValue }
  ) => {
    try {
      const token = getToken();
      const res = await axios.put(`${BASE_API_URL}/expenses/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err.response?.data || DEFAULT_ERROR_MESSAGE);
    }
  }
);

// ❌ Delete expense
export const deleteExpense = createAsyncThunk(
  "expenses/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const token = getToken();
      await axios.delete(`${BASE_API_URL}/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err.response?.data || DEFAULT_ERROR_MESSAGE);
    }
  }
);

// 📊 Get monthly financial summary
export const getMonthlyBalance = createAsyncThunk(
  "expenses/getMonthlyBalance",
  async (
    { month, year }: { month: number; year: number },
    { rejectWithValue }
  ) => {
    try {
      const token = getToken();
      const res = await axios.get(`${BASE_API_URL}/expenses/balance/monthly`, {
        params: { month, year },
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err.response?.data || DEFAULT_ERROR_MESSAGE);
    }
  }
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload.expenses;
        state.totalCount = action.payload.count;
        state.summary = action.payload.financialSummary || null;
      })
      .addCase(getAllExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.expenses.unshift(action.payload.expense);
        state.summary = action.payload.financialSummary || null;
        state.totalCount += 1;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(
          (e) => e.id === action.payload.expense.id
        );
        if (index !== -1) {
          state.expenses[index] = action.payload.expense;
          state.summary = action.payload.financialSummary || null;
        }
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter((e) => e.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(getMonthlyBalance.fulfilled, (state, action) => {
        state.summary = action.payload;
      });
  },
});

export default expenseSlice.reducer;
