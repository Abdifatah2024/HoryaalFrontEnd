import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { BASE_API_URL } from "@/Constant";

interface PayRemainingSalariesPayload {
  month: number;
  year: number;
}

interface ProfitLogState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: ProfitLogState = {
  loading: false,
  error: null,
  successMessage: null,
};

// ✅ Async thunk to pay remaining salaries
export const payEmployeeRemainingSalaries = createAsyncThunk<
  string,
  PayRemainingSalariesPayload,
  { state: RootState; rejectValue: string }
>(
  "profitLog/payEmployeeRemainingSalaries",
  async ({ month, year }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.loginSlice.data.Access_token;

      const res = await axios.post(
        `${BASE_API_URL}/EmployeeAdvance/employee/salary/pay-all/`,
        { month, year },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data.message || "Salaries paid successfully";
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to pay salaries";

      return thunkAPI.rejectWithValue(message as string);
    }
  }
);

const profitLogSlice = createSlice({
  name: "profitLog",
  initialState,
  reducers: {
    clearProfitLogState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(payEmployeeRemainingSalaries.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(payEmployeeRemainingSalaries.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(payEmployeeRemainingSalaries.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to pay salaries";
      });
  },
});

export const { clearProfitLogState } = profitLogSlice.actions;
export default profitLogSlice.reducer;
