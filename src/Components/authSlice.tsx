// features/auth/authSlice.ts (renamed for clarity)
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IloginBody, IloginResponse } from "../types/Login";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../Constant";
import axios, { AxiosError } from "axios";

// Enhanced initial state with isAuthenticated flag
const DEFAULT_USER_DATA = localStorage.getItem("userData")
  ? JSON.parse(localStorage.getItem("userData")!)
  : null;

const initialState = {
  isAuthenticated: !!DEFAULT_USER_DATA?.token, // Auto-login if token exists
  loading: false,
  userData: DEFAULT_USER_DATA || ({} as IloginResponse),
  error: "",
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: IloginBody, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_API_URL}/user/login`, data);
      
      // Store token and user data
      localStorage.setItem("userData", JSON.stringify(res.data));
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data.message || DEFAULT_ERROR_MESSAGE
        );
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.userData = {} as IloginResponse;
      localStorage.removeItem("userData");
    },
    initializeAuth: (state) => {
      state.isAuthenticated = !!state.userData?.token;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;