import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // Import AxiosError
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
type LedgerType = "DEPOSIT" | "WITHDRAWAL";

export interface IloginResponse {
  token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
}

export interface CashLedgerEntry {
  id: number;
  date: string;
  type: LedgerType;
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
  latest?: ProfitLog; // 'latest' is optional
  ledger: CashLedgerEntry[];
}

const initialState: ProfitLogState = {
  loading: false,
  error: null,
  logs: [],
  ledger: [],
};

// Helper function to extract error message
const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Axios error, check for response data
    return (error.response?.data?.message as string) || DEFAULT_ERROR_MESSAGE;
  }
  // Generic error or other types of errors
  return error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE;
};

export const fetchProfitLogs = createAsyncThunk(
  "profitLog/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/profif/log/profitLogs`);
      return res.data.data as ProfitLog[];
    } catch (error: unknown) {
      // Changed 'any' to 'unknown'
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchProfitLogById = createAsyncThunk(
  "profitLog/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/profitlog/${id}`);
      return res.data.data as ProfitLog;
    } catch (error: unknown) {
      // Changed 'any' to 'unknown'
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createProfitLog = createAsyncThunk(
  "profitLog/create",
  async (payload: Partial<ProfitLog>, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_API_URL}/profitlog`, payload);
      return res.data.data as ProfitLog;
    } catch (error: unknown) {
      // Changed 'any' to 'unknown'
      return rejectWithValue(getErrorMessage(error));
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
    } catch (error: unknown) {
      // Changed 'any' to 'unknown'
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteProfitLog = createAsyncThunk(
  "profitLog/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_API_URL}/profitlog/${id}`);
      return id;
    } catch (error: unknown) {
      // Changed 'any' to 'unknown'
      return rejectWithValue(getErrorMessage(error));
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
    } catch (error: unknown) {
      // Changed 'any' to 'unknown'
      return rejectWithValue(getErrorMessage(error));
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
    } catch (error: unknown) {
      // Changed 'any' to 'unknown'
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchCashLedger = createAsyncThunk(
  "profitLog/fetchLedger",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/profif/log/cash-ledger`);
      return res.data.data as CashLedgerEntry[];
    } catch (error: unknown) {
      // Changed 'any' to 'unknown'
      return rejectWithValue(getErrorMessage(error));
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
    } catch (error: unknown) {
      // Changed 'any' to 'unknown'
      return rejectWithValue(getErrorMessage(error));
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
        state.error = action.payload as string; // Payload is now explicitly a string from rejectWithValue
      })
      .addCase(fetchCashLedger.fulfilled, (state, action) => {
        state.ledger = action.payload;
        state.loading = false; // Add loading and error reset for fulfilled case
        state.error = null;
      })
      .addCase(fetchCashLedger.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCashLedger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // Add other extraReducers for pending/rejected/fulfilled states of other thunks if needed for loading/error handling
    // Example for createProfitLog:
    // .addCase(createProfitLog.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(createProfitLog.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.error = null;
    //   // state.logs.push(action.payload); // Or update state as needed
    // })
    // .addCase(createProfitLog.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload as string;
    // });
  },
});

export default profitLogSlice.reducer;
