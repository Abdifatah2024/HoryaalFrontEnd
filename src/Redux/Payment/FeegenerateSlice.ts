import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const triggerGenerateFees = createAsyncThunk(
  "fees/generate",
  async () => {
    const response = await fetch(
      "http://localhost:4000/fee/generate-monthly-fees",
      {
        method: "POST",
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error generating fees");

    return data.message;
  }
);

const generateFeesSlice = createSlice({
  name: "generateFees",
  initialState: {
    loading: false,
    message: null,
    error: null,
  } as {
    loading: boolean;
    message: string | null;
    error: string | null;
  },
  reducers: {
    clearGenerateFeesMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(triggerGenerateFees.pending, (state) => {
        state.loading = true;
        state.message = null;
        state.error = null;
      })
      .addCase(triggerGenerateFees.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(triggerGenerateFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error";
      });
  },
});

export const { clearGenerateFeesMessage } = generateFeesSlice.actions;
export default generateFeesSlice.reducer;
