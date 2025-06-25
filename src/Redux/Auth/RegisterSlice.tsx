import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";
import { IRegisterBody, IRegisterResponse } from "../../types/Register";
import { updateUserRole } from "../../pages/Employee/registerRoleThunk"; // 👈 Import from external file

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  photo: string;
  Role: "ADMIN" | "TEACHER" | "PARENT" | "STUDENT" | "USER";
   createdAt?:  Date;
  createdBy?: string; // ✅ Add this
}

const initialState = {
  loading: false,
  data: {} as IRegisterResponse,
  error: "",
  users: [] as User[],
  user: null as User | null,
};

// Register New User
export const Registerfn = createAsyncThunk(
  "register",
  async (data: IRegisterBody, { rejectWithValue, getState }) => {
    const token = (getState() as any)?.loginSlice?.data?.Access_token;

    try {
      const res = await axios.post(`${BASE_API_URL}/user/register`, data, {
        headers: { Authorization: `Bearer ${token}` },
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

// List Users
export const listUser = createAsyncThunk(
  "register/fetchUsers",
  async (_, { rejectWithValue, getState }) => {
    const token = (getState() as any)?.loginSlice?.data?.Access_token;

    try {
      const res = await axios.get(`${BASE_API_URL}/user/list`, {
        headers: { Authorization: `Bearer ${token}` },
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

// Get User by ID
export const getUserById = createAsyncThunk(
  "users/getUserById",
  async (userId: string, { rejectWithValue, getState }) => {
    const token = (getState() as any)?.loginSlice?.data?.Access_token;

    try {
      const res = await axios.get(`${BASE_API_URL}/user/userinfo/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "User not found");
      }
      return rejectWithValue("User not found");
    }
  }
);

// Update User
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (
    { userId, userData }: { userId: string; userData: Partial<any> },
    { rejectWithValue, getState }
  ) => {
    const token = (getState() as any)?.loginSlice?.data?.Access_token;

    try {
      const res = await axios.put(`${BASE_API_URL}/user/${userId}`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to update user");
      }
      return rejectWithValue("Failed to update user");
    }
  }
);

// Delete User
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId: string, { rejectWithValue, getState }) => {
    const token = (getState() as any)?.loginSlice?.data?.Access_token;

    try {
      await axios.delete(`${BASE_API_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return userId;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.msg || "Failed to delete user");
      }
      return rejectWithValue("Failed to delete user");
    }
  }
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
    builder
      // Register
      .addCase(Registerfn.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(Registerfn.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(Registerfn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // List
      .addCase(listUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(listUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(listUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get by ID
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.map((u) =>
          u.id === action.payload.id ? action.payload : u
        );
        if (state.user?.id === action.payload.id) {
          state.user = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
        if (state.user?.id === action.payload) {
          state.user = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 👇 Update Role
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.map((u) =>
          u.id === action.payload.id ? action.payload : u
        );
        if (state.user?.id === action.payload.id) {
          state.user = action.payload;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUser } = registerSlice.actions;
export default registerSlice.reducer;
