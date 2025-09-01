// src/Redux/Payment/paymentNumberHistorySlice.ts
import { createAsyncThunk, createSlice, PayloadAction, AnyAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

/* --------------------------- Types & Interfaces --------------------------- */

export type PayMethod = "ZAAD" | "E-dahab";

export interface NumberHistoryFilters {
  number: string;
  methods?: PayMethod[];     // defaults to ["ZAAD", "E-DAHAB"]
  month?: number;            // optional (used with year)
  year?: number;             // optional
  dateStart?: string;        // YYYY-MM-DD optional
  dateEnd?: string;          // YYYY-MM-DD optional
}

export interface NumberHistoryRow {
  student: string;
  class: string;
  amount: number;
  month: number | null;
  year: number | null;
  date: string;              // ISO
  user: string;
  method: string;
  number: string;
  paymentId: number;
}

export interface NumberHistoryGroupedPayment {
  paymentId: number;
  description: string;
  method: string;
  number: string;
  createdAt: string;         // ISO
  user: string;
  paidFor: Array<{
    student: string;
    class: string;
    month: number | null;
    year: number | null;
    amount: number;
  }>;
}

export interface NumberHistoryResponse {
  usedCount: number;
  totalAllocations: number;
  totalAmountThisMonth: number;  // sum across rows for the effective range
  dateStart: string | null;      // ISO or null
  dateEnd: string | null;        // ISO or null
  message: string;
  rows: NumberHistoryRow[];
  payments: NumberHistoryGroupedPayment[];
}

/* --------------------------------- State --------------------------------- */

interface State {
  loading: boolean;
  error: string;
  data: NumberHistoryResponse | null;
  lastFilters: NumberHistoryFilters | null;
}

const initialState: State = {
  loading: false,
  error: "",
  data: null,
  lastFilters: null,
};

/* ------------------------------ Token helper ------------------------------ */

const getAuthToken = () => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData).Access_token : null;
};

/* --------------------------------- Thunk ---------------------------------- */

export const fetchNumberHistory = createAsyncThunk<
  NumberHistoryResponse,
  NumberHistoryFilters,
  { rejectValue: string }
>(
  "paymentNumberHistory/fetch",
  async (filters, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("Authentication required");

      // Build request body according to your controller
      const body: any = {
        number: filters.number,
        methods:
          Array.isArray(filters.methods) && filters.methods.length > 0
            ? filters.methods
            : ["ZAAD", "E-dahab"],
      };

      if (filters.dateStart && filters.dateEnd) {
        body.dateStart = filters.dateStart;
        body.dateEnd = filters.dateEnd;
      } else if (filters.month && filters.year) {
        body.month = filters.month;
        body.year = filters.year;
      } else if (filters.year) {
        body.year = filters.year;
      }

      const res = await axios.post(
        `${BASE_API_URL}/fee/check-number-history`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // The controller returns Date objects; ensure strings for UI:
      const normalizeDate = (d: any) =>
        typeof d === "string" ? d : d ? new Date(d).toISOString() : null;

      const payload: NumberHistoryResponse = {
        usedCount: res.data.usedCount ?? 0,
        totalAllocations: res.data.totalAllocations ?? 0,
        totalAmountThisMonth: res.data.totalAmountThisMonth ?? 0,
        dateStart: normalizeDate(res.data.dateStart),
        dateEnd: normalizeDate(res.data.dateEnd),
        message: res.data.message ?? "",
        rows: (res.data.rows || []).map((r: any) => ({
          ...r,
          date: normalizeDate(r.date) as string,
        })),
        payments: (res.data.payments || []).map((p: any) => ({
          ...p,
          createdAt: normalizeDate(p.createdAt) as string,
        })),
      };

      return payload;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          (error.response?.data as any)?.message || DEFAULT_ERROR_MESSAGE
        );
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

/* --------------------------------- Slice ---------------------------------- */

const paymentNumberHistorySlice = createSlice({
  name: "paymentNumberHistory",
  initialState,
  reducers: {
    clearNumberHistory(state) {
      state.data = null;
      state.error = "";
      state.lastFilters = null;
    },
    setLastFilters(state, action: PayloadAction<NumberHistoryFilters>) {
      state.lastFilters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNumberHistory.pending, (state, action) => {
        state.loading = true;
        state.error = "";
        state.lastFilters = action.meta.arg || null;
      })
      .addCase(
        fetchNumberHistory.fulfilled,
        (state, action: PayloadAction<NumberHistoryResponse>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchNumberHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || DEFAULT_ERROR_MESSAGE;
      })
      .addMatcher(
        (action: AnyAction) =>
          action.type.startsWith("paymentNumberHistory/") &&
          action.type.endsWith("/rejected"),
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.error = action.payload || DEFAULT_ERROR_MESSAGE;
        }
      );
  },
});

export const { clearNumberHistory, setLastFilters } =
  paymentNumberHistorySlice.actions;

export default paymentNumberHistorySlice.reducer;

/* -------------------------------- Selectors -------------------------------- */

export const selectNumberHistoryLoading = (state: any) =>
  state.paymentNumberHistory.loading;
export const selectNumberHistoryError = (state: any) =>
  state.paymentNumberHistory.error;
export const selectNumberHistoryData = (state: any) =>
  state.paymentNumberHistory.data;
export const selectNumberHistoryLastFilters = (state: any) =>
  state.paymentNumberHistory.lastFilters;
