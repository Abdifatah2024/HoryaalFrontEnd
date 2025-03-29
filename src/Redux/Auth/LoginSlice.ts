import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IloginBody, IloginResponse } from "../../types/Login";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";
import axios, { AxiosError } from "axios";

const DEFAULT_USER_DATA = localStorage.getItem("userData")
  ? JSON.parse(localStorage.getItem("userData")!)
  : { token: null };

const initialState = {
  loading: false,
  data: (DEFAULT_USER_DATA as IloginResponse) || ({} as IloginResponse),
  error: "",
};

export const Loginfn = createAsyncThunk(
  "login",
  async (data: IloginBody, { rejectWithValue }) => {
    try {
      // add Bearar token.
      const userData = localStorage.getItem("userData");
      const parsedData = userData ? JSON.parse(userData) : null;

      // Access the token
      const token = parsedData?.token;

      // Configure the headers
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.post(`${BASE_API_URL}/user/login`, data, config);

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

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = {} as IloginResponse;
      state.error = "";
      state.loading = false;

      // Remove the data from the local storage
      localStorage.removeItem("userData");
    },
  },
  // Add reducers for other actions
  extraReducers(builder) {
    // Pending
    builder.addCase(Loginfn.pending, (state) => {
      state.loading = true;
      state.error = "";
      state.data = {} as IloginResponse;
    });

    // Fulfilled
    builder.addCase(Loginfn.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.data = action.payload;
    });

    // Rejected
    builder.addCase(Loginfn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.data = {} as IloginResponse;
    });
  },
});
export const { logout } = loginSlice.actions;
