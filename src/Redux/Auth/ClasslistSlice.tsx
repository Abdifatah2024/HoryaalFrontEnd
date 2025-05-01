import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

export interface Class {
  id: string;
  name: string;
  userid: string;
  createdAt: string;
  updatedAt: string;
}

interface ClassListState {
  loading: boolean;
  classList: Class[];
  error: string;
}

const initialState: ClassListState = {
  loading: false, 
  classList: [],
  error: "",
};

// 🔹 Fetch All Classes
export const fetchClasses = createAsyncThunk(
  "classlist/fetchClasses",
  async (_, { rejectWithValue, getState }) => {
    const state: any = getState();
    const { Access_token = null } = state?.loginSlice?.data || {};

    try {
      const res = await axios.get(`${BASE_API_URL}/student/classtList`, {
        headers: { Authorization: `Bearer ${Access_token}` },
      });
      return res.data.classes;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || DEFAULT_ERROR_MESSAGE
        );
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

const classlistSlice = createSlice({
  name: "classlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classList = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default classlistSlice.reducer;