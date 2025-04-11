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

interface ClassState {
  loading: boolean;
  classes: Class[];
  error: string;
}

const initialState: ClassState = {
  loading: false,
  classes: [],
  error: "",
};

// 🔹 Create a New Class
export const createClass = createAsyncThunk(
  "classes/createClass",
  async (data: { name: string }, { rejectWithValue, getState }) => {
    const state: any = getState();
    const { Access_token = null } = state?.loginSlice?.data || {};

    try {
      const res = await axios.post(`${BASE_API_URL}/student/createclass`, data, {
        headers: { Authorization: `Bearer ${Access_token}` },
      });
      return res.data.class;
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

const classSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createClass.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(createClass.fulfilled, (state, action) => {
      state.loading = false;
      state.classes.push(action.payload);
    });
    builder.addCase(createClass.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default classSlice.reducer;
