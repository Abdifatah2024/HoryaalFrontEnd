import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";
import { IRegisterBody, IRegisterResponse } from "../../types/Register";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

const initialState = {
  loading: false,
  data: {} as IRegisterResponse,
  error: "",
  users: [] as User[], // Users list
  user: null as User | null, // Selected user
};

// 🔹 Register a New User
export const Registerfn = createAsyncThunk(
  "register",
  async (data: IRegisterBody, { rejectWithValue,getState }) => {
    const stateData: any = getState() as { loginSlice: { data: { token: string } } };

    // const { Access_token } = stateData?.loginSlice?.data;
    const { Access_token = null } = stateData?.loginSlice?.data || {};

    console.log(Access_token);

    try {
      const res = await axios.post(`${BASE_API_URL}/user/register`, data,{
        headers: { Authorization: `Bearer ${Access_token}` }
      });
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

// 🔹 Fetch All Users
export const listUser = createAsyncThunk("register/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${BASE_API_URL}/user/list`);
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
    }
    return rejectWithValue(DEFAULT_ERROR_MESSAGE);
  }
});

// 🔹 Fetch User by ID
export const getUserById = createAsyncThunk(
  "users/getUserById",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/user/userinfo/${userId}`);
      return response.data;
    } catch (error) {
      if(error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message || "User not found");
    }
  }
}
);

// 🔹 Update User
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ userId, userData }: { userId: string; userData: Partial<User> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_API_URL}/user/${userId}`, userData);
      return response.data;
    } catch (error) {
      if(error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message || "Failed to update user");
    }
  }}
);

// 🔹 Delete User
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_API_URL}/user/${userId}`);
      return userId; // Return deleted user ID
    } catch (error) {
      if(error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.msg || "Failed to delete user");
    }
  }}
);

// 🔥 Redux Slice
const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    // 🔹 Register a User
    builder.addCase(Registerfn.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(Registerfn.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.data = action.payload;
    });
    builder.addCase(Registerfn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // 🔹 Fetch Users
    builder.addCase(listUser.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(listUser.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(listUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // 🔹 Fetch User by ID
    builder.addCase(getUserById.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(getUserById.fulfilled, (state, action) => {
      state.loading = false;
      console.log("Fetched User:", action.payload); // Debugging
      state.user = action.payload.user; // ✅ Correctly assign user object
    });
    builder.addCase(getUserById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // 🔹 Update User
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      
      // Update user in the users list
      state.users = state.users.map(user => 
        user.id === action.payload.id ? action.payload : user
      );

      // Update selected user if it matches the updated one
      if (state.user?.id === action.payload.id) {
        state.user = action.payload;
      }
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // 🔹 Delete User
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = null; // Clear user from Redux state
      state.users = state.users.filter(user => user.id !== action.payload); // Remove from list
      console.log("User deleted:", action.payload); // Debugging
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearUser } = registerSlice.actions;
export default registerSlice.reducer;
