import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

export interface ProfitLog {
  id: number;
  month: number;
  year: number;
  closedById: number;
  currentIncome: number;
  previousIncome: number;
  advanceIncome: number;
  totalRevenue: number;
  totalDiscounts: number;
  netRevenue: number;
  totalExpenses: number;
  totalEmployeeAdvances: number;
  netIncome: number;
  notes: string;
  closedAt: string;
}

export interface CashLedgerEntry {
  id: number;
  date: string;
  type: string;
  source: string;
  referenceId: number;
  amount: number;
  method: string;
  description: string;
  balanceAfter: number;
  createdBy?: {
    id: number;
    fullName: string;
    email: string;
  };
}

interface ProfitLogState {
  loading: boolean;
  error: string | null;
  logs: ProfitLog[];
  latest?: ProfitLog;
  ledger: CashLedgerEntry[];
}

const initialState: ProfitLogState = {
  loading: false,
  error: null,
  logs: [],
  ledger: [],
};

export const fetchProfitLogs = createAsyncThunk(
  "profitLog/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/profif/log/profitLogs`);
      return res.data.data as ProfitLog[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

export const fetchProfitLogById = createAsyncThunk(
  "profitLog/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/profitlog/${id}`);
      return res.data.data as ProfitLog;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

export const createProfitLog = createAsyncThunk(
  "profitLog/create",
  async (payload: Partial<ProfitLog>, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_API_URL}/profitlog`, payload);
      return res.data.data as ProfitLog;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

export const updateProfitLog = createAsyncThunk(
  "profitLog/update",
  async (
    { id, update }: { id: number; update: Partial<ProfitLog> },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.put(`${BASE_API_URL}/profitlog/${id}`, update);
      return res.data.data as ProfitLog;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

export const deleteProfitLog = createAsyncThunk(
  "profitLog/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_API_URL}/profitlog/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

export const autoCreateProfitLog = createAsyncThunk(
  "profitLog/autoCreate",
  async (
    {
      month,
      year,
      closedById,
    }: { month: number; year: number; closedById: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(`${BASE_API_URL}/profif/log/auto-create`, {
        month,
        year,
        closedById,
      });
      return res.data.data as ProfitLog;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

export const autoUpdateProfitLog = createAsyncThunk(
  "profitLog/autoUpdate",
  async (
    { month, year, notes }: { month: number; year: number; notes?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.put(`${BASE_API_URL}/profif/log/update`, {
        month,
        year,
        notes,
      });
      return res.data.data as ProfitLog;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

export const fetchCashLedger = createAsyncThunk(
  "profitLog/fetchLedger",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/profif/log/cash-ledger`);
      return res.data.data as CashLedgerEntry[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

export const createCashLedgerEntry = createAsyncThunk(
  "profitLog/createLedgerEntry",
  async (
    payload: {
      type: "DEPOSIT" | "WITHDRAWAL";
      source: string;
      amount: number;
      method: string;
      description?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        `${BASE_API_URL}/profif/log/manual-ledger`,
        payload
      );
      return res.data.data as CashLedgerEntry;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

const profitLogSlice = createSlice({
  name: "profitLog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfitLogs.fulfilled, (state, action) => {
        state.logs = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProfitLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfitLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCashLedger.fulfilled, (state, action) => {
        state.ledger = action.payload;
      });
  },
});

export default profitLogSlice.reducer;
