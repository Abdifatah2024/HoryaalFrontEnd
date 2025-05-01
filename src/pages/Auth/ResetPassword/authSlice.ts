import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sendResetCodeAPI, resetPasswordAPI } from "./authAPI";

interface AuthState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  success: false,
};

// Thunks
export const sendResetCode = createAsyncThunk(
  "auth/sendResetCode",
  async (emailOrPhone: string, { rejectWithValue }) => {
    try {
      await sendResetCodeAPI(emailOrPhone);
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    { token, newPassword }: { token: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      await resetPasswordAPI(token, newPassword);
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendResetCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendResetCode.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(sendResetCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearState } = authSlice.actions;
export default authSlice.reducer;
