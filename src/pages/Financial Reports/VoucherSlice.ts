import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../Redux/store";
import { BASE_API_URL } from "@/Constant";

export interface Voucher {
  id: number;
  studentId: number;
  userId: number;
  amountPaid: number;
  discount: number;
  Description: string;
  date: string;
  student?: { fullname: string };
  user?: { fullName: string };
  allocations?: {
    studentFee: {
      month: number;
      year: number;
    };
  }[];
}

export interface MonthlyVoucherGroup {
  month: number;
  year: number;
  count: number;
}

interface VoucherState {
  vouchers: Voucher[];
  voucherGroups: MonthlyVoucherGroup[];
  selectedVoucher: Voucher | null;
  loading: boolean;
  error: string | null;
}

const initialState: VoucherState = {
  vouchers: [],
  voucherGroups: [],
  selectedVoucher: null,
  loading: false,
  error: null,
};

// ✅ Thunks
export const fetchVouchers = createAsyncThunk(
  "voucher/fetchVouchers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/Voucher/vouchers`);
      return res.data as Voucher[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch vouchers"
      );
    }
  }
);

export const fetchVoucherById = createAsyncThunk(
  "voucher/fetchVoucherById",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/Voucher/vouchers/${id}`);
      return res.data as Voucher;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch voucher by ID"
      );
    }
  }
);

export const updateVoucher = createAsyncThunk(
  "voucher/updateVoucher",
  async (
    {
      id,
      amountPaid,
      discount,
      Description,
    }: {
      id: number;
      amountPaid: number;
      discount: number;
      Description: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.put(`${BASE_API_URL}/Voucher/payments/${id}`, {
        amountPaid,
        discount,
        Description,
      });
      return res.data.updated;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update voucher"
      );
    }
  }
);

export const fetchVoucherGroups = createAsyncThunk(
  "voucher/fetchVoucherGroups",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_API_URL}/Voucher/vouchers/monthly/grouped`
      );
      return res.data as MonthlyVoucherGroup[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch grouped vouchers"
      );
    }
  }
);

const voucherSlice = createSlice({
  name: "voucher",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVouchers.fulfilled, (state, action) => {
        state.loading = false;
        state.vouchers = action.payload;
      })
      .addCase(fetchVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchVoucherById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedVoucher = null;
      })
      .addCase(fetchVoucherById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVoucher = action.payload;
      })
      .addCase(fetchVoucherById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVoucher.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.vouchers = state.vouchers.map((v) =>
          v.id === updated.id ? updated : v
        );
      })
      .addCase(updateVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchVoucherGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVoucherGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.voucherGroups = action.payload;
      })
      .addCase(fetchVoucherGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default voucherSlice.reducer;

export const selectVoucherState = (state: RootState) => state.voucher;
