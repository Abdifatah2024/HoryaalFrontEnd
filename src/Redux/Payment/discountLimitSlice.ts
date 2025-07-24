import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { DiscountLimit } from "../../types/DiscountLimit";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// State
interface DiscountLimitState {
  currentLimit: DiscountLimit | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: DiscountLimitState = {
  currentLimit: null,
  loading: false,
  error: null,
  successMessage: null,
};

// Thunks

// ✅ Set (Create or Upsert)
export const setDiscountLimit = createAsyncThunk<
  DiscountLimit,
  { month: number; year: number; maxLimit: number },
  { rejectValue: string }
>("discountLimit/set", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${BASE_API_URL}/api/discount-limit`, data);
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || DEFAULT_ERROR_MESSAGE
    );
  }
});

// ✅ Get
export const getDiscountLimit = createAsyncThunk<
  DiscountLimit,
  { month: number; year: number },
  { rejectValue: string }
>("discountLimit/get", async ({ month, year }, { rejectWithValue }) => {
  try {
    const res = await axios.get(
      `${BASE_API_URL}/api/discount-limit/${month}/${year}`
    );
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || DEFAULT_ERROR_MESSAGE
    );
  }
});

// ✅ Update
export const updateDiscountLimit = createAsyncThunk<
  DiscountLimit,
  { month: number; year: number; maxLimit: number },
  { rejectValue: string }
>(
  "discountLimit/update",
  async ({ month, year, maxLimit }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${BASE_API_URL}/api/discount-limit/${month}/${year}`,
        {
          maxLimit,
        }
      );
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

// Slice
const discountLimitSlice = createSlice({
  name: "discountLimit",
  initialState,
  reducers: {
    clearDiscountLimitState: (state) => {
      state.currentLimit = null;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Set
      .addCase(setDiscountLimit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        setDiscountLimit.fulfilled,
        (state, action: PayloadAction<DiscountLimit>) => {
          state.loading = false;
          state.currentLimit = action.payload;
          state.successMessage = "Discount limit set successfully.";
        }
      )
      .addCase(setDiscountLimit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || DEFAULT_ERROR_MESSAGE;
      })

      // Get
      .addCase(getDiscountLimit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getDiscountLimit.fulfilled,
        (state, action: PayloadAction<DiscountLimit>) => {
          state.loading = false;
          state.currentLimit = action.payload;
        }
      )
      .addCase(getDiscountLimit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || DEFAULT_ERROR_MESSAGE;
      })

      // Update
      .addCase(updateDiscountLimit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateDiscountLimit.fulfilled,
        (state, action: PayloadAction<DiscountLimit>) => {
          state.loading = false;
          state.currentLimit = action.payload;
          state.successMessage = "Discount limit updated.";
        }
      )
      .addCase(updateDiscountLimit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || DEFAULT_ERROR_MESSAGE;
      });
  },
});

export const { clearDiscountLimitState } = discountLimitSlice.actions;
export default discountLimitSlice.reducer;
