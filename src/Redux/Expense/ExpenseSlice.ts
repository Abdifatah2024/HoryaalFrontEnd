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

interface APIError {
  message: string;
}

interface State {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  message: string | null;
  summary: FinancialSummary | null;
  totalCount: number;
  incomeSummary: FinancialSummary | null;
  expenseCategorySummary?: {
    month: number;
    year: number;
    totalExpenses: number;
    categorySummary: { category: string; amount: number }[];
  } | null;
}

const initialState: State = {
  expenses: [],
  loading: false,
  error: null,
  message: null,
  summary: null,
  totalCount: 0,
  incomeSummary: null,
  expenseCategorySummary: null,
};

const getToken = () => {
  const data = localStorage.getItem("userData");
  return data ? JSON.parse(data).Access_token : null;
};

// Get all expenses
export const getAllExpenses = createAsyncThunk<
  any,
  any,
  { rejectValue: APIError }
>("expenses/getAll", async (filters, { rejectWithValue }) => {
  try {
    const token = getToken();
    const res = await axios.get(`${BASE_API_URL}/expenses`, {
      params: filters,
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    const err = error as AxiosError<APIError>;
    return rejectWithValue(
      err.response?.data || { message: DEFAULT_ERROR_MESSAGE }
    );
  }
});

// Create expense
export const createExpense = createAsyncThunk<
  any,
  Omit<Expense, "id" | "userId">,
  { rejectValue: APIError }
>("expenses/create", async (data, { rejectWithValue }) => {
  try {
    const token = getToken();
    const res = await axios.post(`${BASE_API_URL}/expenses/create`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    const err = error as AxiosError<APIError>;
    return rejectWithValue(
      err.response?.data || { message: DEFAULT_ERROR_MESSAGE }
    );
  }
});

// Update expense
export const updateExpense = createAsyncThunk<
  any,
  { id: number; data: Partial<Expense> },
  { rejectValue: APIError }
>("expenses/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const token = getToken();
    const res = await axios.put(`${BASE_API_URL}/expenses/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    const err = error as AxiosError<APIError>;
    return rejectWithValue(
      err.response?.data || { message: DEFAULT_ERROR_MESSAGE }
    );
  }
});

// Delete expense
export const deleteExpense = createAsyncThunk<
  number,
  number,
  { rejectValue: APIError }
>("expenses/delete", async (id, { rejectWithValue }) => {
  try {
    const token = getToken();
    await axios.delete(`${BASE_API_URL}/expenses/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  } catch (error) {
    const err = error as AxiosError<APIError>;
    return rejectWithValue(
      err.response?.data || { message: DEFAULT_ERROR_MESSAGE }
    );
  }
});

// Get categorized expense summary
export const getExpenseSummary = createAsyncThunk<
  {
    month: number;
    year: number;
    totalExpenses: number;
    categorySummary: { category: string; amount: number }[];
  },
  { month: number; year: number },
  { rejectValue: APIError }
>(
  "expenses/getExpenseSummary",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.get(`${BASE_API_URL}/expenses/summary`, {
        params: { month, year },
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      const err = error as AxiosError<APIError>;
      return rejectWithValue(
        err.response?.data || { message: DEFAULT_ERROR_MESSAGE }
      );
    }
  }
);

// Get monthly financial summary
export const getMonthlyBalance = createAsyncThunk<
  any,
  { month: number; year: number },
  { rejectValue: APIError }
>(
  "expenses/getMonthlyBalance",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.get(`${BASE_API_URL}/expenses/balance/monthly`, {
        params: { month, year },
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      const err = error as AxiosError<APIError>;
      return rejectWithValue(
        err.response?.data || { message: DEFAULT_ERROR_MESSAGE }
      );
    }
  }
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    clearMessage(state) {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(getAllExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload.expenses;
        state.totalCount = action.payload.count;
        state.summary = action.payload.financialSummary || null;
        state.message = "Expenses loaded successfully";
      })
      .addCase(getAllExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load expenses";
        state.message = null;
      })

      .addCase(createExpense.fulfilled, (state, action) => {
        state.expenses.unshift(action.payload.expense);
        state.summary = action.payload.financialSummary || null;
        state.totalCount += 1;
        state.error = null;
        state.message = "Expense created successfully";
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to create expense";
        state.message = null;
      })

      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(
          (e) => e.id === action.payload.expense.id
        );
        if (index !== -1) {
          state.expenses[index] = action.payload.expense;
          state.summary = action.payload.financialSummary || null;
        }
        state.error = null;
        state.message = "Expense updated successfully";
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to update expense";
        state.message = null;
      })

      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter((e) => e.id !== action.payload);
        state.totalCount -= 1;
        state.error = null;
        state.message = "Expense deleted successfully";
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to delete expense";
        state.message = null;
      })
      .addCase(getExpenseSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.expenseCategorySummary = action.payload;
        state.message = "Expense summary loaded successfully";
      })
      .addCase(getExpenseSummary.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to load expense summary";
      })
      .addCase(getMonthlyBalance.fulfilled, (state, action) => {
        state.incomeSummary = action.payload || null; // ✅ Corrected
        state.error = null;
        state.message = "Monthly balance loaded successfully";
      })
      .addCase(getMonthlyBalance.rejected, (state, action) => {
        state.error =
          action.payload?.message || "Failed to load monthly balance";
        state.message = null;
      });
  },
});

export const { clearMessage } = expenseSlice.actions;
export default expenseSlice.reducer;
