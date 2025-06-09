// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios, { AxiosError } from "axios";
// import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";
// import { IRegisterBody, IRegisterResponse } from "../../types/Register";

// export interface User {
//   id: string;
//   fullName: string;
//   email: string;
//   phoneNumber: string;
//   photo: string;
//   Role:string

// }

// const initialState = {
//   loading: false,
//   data: {} as IRegisterResponse,
//   error: "",
//   users: [] as User[], // Users list
//   user: null as User | null, // Selected user
// };

// // 🔹 Register a New User
// export const Registerfn = createAsyncThunk(
//   "register",
//   async (data: IRegisterBody, { rejectWithValue, getState }) => {
//     const stateData: any = getState() as { loginSlice: { data: { Access_token: string } } };
//     const { Access_token = null } = stateData?.loginSlice?.data || {};

//     try {
//       const res = await axios.post(`${BASE_API_URL}/user/register`, data, {
//         headers: { Authorization: `Bearer ${Access_token}` },
//       });
//       return res.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return rejectWithValue(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
//       }
//       return rejectWithValue(DEFAULT_ERROR_MESSAGE);
//     }
//   }
// );

// // 🔹 Fetch All Users
// export const listUser = createAsyncThunk(
//   "register/fetchUsers",
//   async (_, { rejectWithValue, getState }) => {
//     const stateData: any = getState() as { loginSlice: { data: { Access_token: string } } };
//     const { Access_token = null } = stateData?.loginSlice?.data || {};

//     try {
//       const res = await axios.get(`${BASE_API_URL}/user/list`, {
//         headers: { Authorization: `Bearer ${Access_token}` },
//       });
//       return res.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return rejectWithValue(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
//       }
//       return rejectWithValue(DEFAULT_ERROR_MESSAGE);
//     }
//   }
// );

// // 🔹 Fetch User by ID
// export const getUserById = createAsyncThunk(
//   "users/getUserById",
//   async (userId: string, { rejectWithValue, getState }) => {
//     const stateData: any = getState() as { loginSlice: { data: { Access_token: string } } };
//     const { Access_token = null } = stateData?.loginSlice?.data || {};

//     try {
//       const response = await axios.get(`${BASE_API_URL}/user/userinfo/${userId}`, {
//         headers: { Authorization: `Bearer ${Access_token}` },
//       });
//       return response.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return rejectWithValue(error.response?.data?.message || "User not found");
//       }
//       return rejectWithValue("User not found");
//     }
//   }
// );

// // 🔹 Update User
// export const updateUser = createAsyncThunk(
//   "users/updateUser",
//   async (
//     { userId, userData }: { userId: string; userData: Partial<User> },
//     { rejectWithValue, getState }
//   ) => {
//     const stateData: any = getState() as { loginSlice: { data: { Access_token: string } } };
//     const { Access_token = null } = stateData?.loginSlice?.data || {};

//     try {
//       const response = await axios.put(`${BASE_API_URL}/user/${userId}`, userData, {
//         headers: { Authorization: `Bearer ${Access_token}` },
//       });
//       return response.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return rejectWithValue(error.response?.data?.message || "Failed to update user");
//       }
//       return rejectWithValue("Failed to update user");
//     }
//   }
// );

// // 🔹 Delete User
// export const deleteUser = createAsyncThunk(
//   "users/deleteUser",
//   async (userId: string, { rejectWithValue, getState }) => {
//     const stateData: any = getState() as { loginSlice: { data: { Access_token: string } } };
//     const { Access_token = null } = stateData?.loginSlice?.data || {};

//     try {
//       await axios.delete(`${BASE_API_URL}/user/${userId}`, {
//         headers: { Authorization: `Bearer ${Access_token}` },
//       });
//       return userId;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return rejectWithValue(error.response?.data?.msg || "Failed to delete user");
//       }
//       return rejectWithValue("Failed to delete user");
//     }
//   }
// );

// // 🔥 Redux Slice
// const registerSlice = createSlice({
//   name: "register",
//   initialState,
//   reducers: {
//     clearUser: (state) => {
//       state.user = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // 🔹 Register a User
//     builder.addCase(Registerfn.pending, (state) => {
//       state.loading = true;
//       state.error = "";
//     });
//     builder.addCase(Registerfn.fulfilled, (state, action) => {
//       state.loading = false;
//       state.error = "";
//       state.data = action.payload;
//     });
//     builder.addCase(Registerfn.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });

//     // 🔹 Fetch Users
//     builder.addCase(listUser.pending, (state) => {
//       state.loading = true;
//       state.error = "";
//     });
//     builder.addCase(listUser.fulfilled, (state, action) => {
//       state.loading = false;
//       state.users = action.payload;
//     });
//     builder.addCase(listUser.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });

//     // 🔹 Fetch User by ID
//     builder.addCase(getUserById.pending, (state) => {
//       state.loading = true;
//       state.error = "";
//     });
//     builder.addCase(getUserById.fulfilled, (state, action) => {
//       state.loading = false;
//       state.user = action.payload.user;
//     });
//     builder.addCase(getUserById.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });

//     // 🔹 Update User
//     builder.addCase(updateUser.pending, (state) => {
//       state.loading = true;
//       state.error = "";
//     });
//     builder.addCase(updateUser.fulfilled, (state, action) => {
//       state.loading = false;
//       state.error = "";
//       state.users = state.users.map((user) =>
//         user.id === action.payload.id ? action.payload : user
//       );
//       if (state.user?.id === action.payload.id) {
//         state.user = action.payload;
//       }
//     });
//     builder.addCase(updateUser.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });

//     // 🔹 Delete User
//     builder.addCase(deleteUser.fulfilled, (state, action) => {
//       state.loading = false;
//       state.user = null;
//       state.users = state.users.filter((user) => user.id !== action.payload);
//     });
//     builder.addCase(deleteUser.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });
//   },
// });

// export const { clearUser } = registerSlice.actions;
// export default registerSlice.reducer;
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
    { userId, userData }: { userId: string; userData: Partial<User> },
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
