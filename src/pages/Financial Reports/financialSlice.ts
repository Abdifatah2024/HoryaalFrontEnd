import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../Redux/store";
const API_BASE = "http://localhost:4000";
export interface FinancialReportState {
  incomeStatement: any | null;
  balanceSheet: any | null;
  cashFlow: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: FinancialReportState = {
  incomeStatement: null,
  balanceSheet: null,
  cashFlow: null,
  loading: false,
  error: null,
};

// Async Thunks
export const getIncomeStatement = createAsyncThunk(
  "financial/getIncomeStatement",
  async (
    { month, year }: { month: number; year: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get(
        `${API_BASE}/financial/Reports/income-statement`,
        {
          params: { month, year },
        }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch income statement"
      );
    }
  }
);

export const getBalanceSheet = createAsyncThunk(
  "financial/getBalanceSheet",
  async (
    { month, year }: { month: number; year: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get(
        `${API_BASE}/financial/Reports/balance-sheet`,
        {
          params: { month, year },
        }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch balance sheet"
      );
    }
  }
);

export const getCashFlow = createAsyncThunk(
  "financial/getCashFlow",
  async (
    { month, year }: { month: number; year: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get(`${API_BASE}/financial/Reports/cash-flow`, {
        params: { month, year },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch cash flow report"
      );
    }
  }
);

// Slice
const financialSlice = createSlice({
  name: "financial",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Income Statement
      .addCase(getIncomeStatement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIncomeStatement.fulfilled, (state, action) => {
        state.loading = false;
        state.incomeStatement = action.payload;
      })
      .addCase(getIncomeStatement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Balance Sheet
      .addCase(getBalanceSheet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBalanceSheet.fulfilled, (state, action) => {
        state.loading = false;
        state.balanceSheet = action.payload;
      })
      .addCase(getBalanceSheet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Cash Flow
      .addCase(getCashFlow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCashFlow.fulfilled, (state, action) => {
        state.loading = false;
        state.cashFlow = action.payload;
      })
      .addCase(getCashFlow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default financialSlice.reducer;

// Selector
export const selectFinancialReports = (state: RootState) => state.financial;
