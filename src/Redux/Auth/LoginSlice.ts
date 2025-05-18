import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IloginBody } from "../../types/Login";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";
import axios, { AxiosError } from "axios";

// LocalStorage keys
const LOCAL_STORAGE_KEYS = {
  USER_DATA: "userData",
  Access_token: "Access_token",
};

// Helpers
const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error accessing localStorage", error);
    return defaultValue;
  }
};

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LOCAL_STORAGE_KEYS.Access_token);
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Response types
export interface IloginResponse {
  message: string;
  Access_token: string;
  user: {
    id: number;
    email: string;
    username: string;
    fullname: string;
    Role: string;
  };
}

// Initial State
const initialState = {
  loading: false,
  data: getFromLocalStorage<IloginResponse>(
    LOCAL_STORAGE_KEYS.USER_DATA,
    {} as IloginResponse
  ),
  error: "",
  forgetPasswordSuccess: false,
};

// ✅ Login async thunk
export const Loginfn = createAsyncThunk(
  "login",
  async (data: IloginBody, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_API_URL}/user/login`, data);
      const userData: IloginResponse = res.data;
      const token = userData.Access_token;

      if (!token) {
        return rejectWithValue("No token returned from server.");
      }

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.USER_DATA,
        JSON.stringify(userData)
      );
      localStorage.setItem(LOCAL_STORAGE_KEYS.Access_token, token);
      setAuthToken(token);

      return userData;
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

// ✅ Forgot Password thunk
export const ForgotPasswordfn = createAsyncThunk(
  "login/forgotPassword",
  async (emailOrPhone: string, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_API_URL}/user/send-reset-code`, {
        emailOrPhone,
      });
      return res.data.message || "Reset code sent successfully!";
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

// Redux slice
export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = {} as IloginResponse;
      state.error = "";
      state.loading = false;
      state.forgetPasswordSuccess = false;

      Object.values(LOCAL_STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });

      setAuthToken(null);
    },
    checkAuth: (state) => {
      const userData = getFromLocalStorage<IloginResponse>(
        LOCAL_STORAGE_KEYS.USER_DATA,
        {} as IloginResponse
      );
      state.data = userData;
      const token = getAccessToken();
      setAuthToken(token);
    },
    clearForgetPasswordState: (state) => {
      state.forgetPasswordSuccess = false;
      state.error = "";
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔐 Login flow
      .addCase(Loginfn.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.data = {} as IloginResponse;
      })
      .addCase(Loginfn.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.data = action.payload;
      })
      .addCase(Loginfn.rejected, (state, action) => {
        state.loading = false;
        const errorMessage = action.payload as string;

        // Optional: you can parse or categorize the error here
        if (
          errorMessage.toLowerCase().includes("locked") ||
          errorMessage.toLowerCase().includes("try again in")
        ) {
          // Example: you could trigger a countdown or disable login button
        }

        state.error = errorMessage;
        state.data = {} as IloginResponse;
      })

      // 🔐 Forgot Password
      .addCase(ForgotPasswordfn.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(ForgotPasswordfn.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.forgetPasswordSuccess = true;
      })
      .addCase(ForgotPasswordfn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.forgetPasswordSuccess = false;
      });
  },
});

export const { logout, checkAuth, clearForgetPasswordState } =
  loginSlice.actions;
export default loginSlice.reducer;
