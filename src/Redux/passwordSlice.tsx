// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../Constant";
// import axios, { AxiosError } from "axios";
// import { RootState } from "../Redux/store";

// interface PasswordState {
//   loading: boolean;
//   error: string;
//   success: boolean;
// }

// interface ChangePasswordPayload {
//   oldPassword: string;
//   newPassword: string;
// }

// const initialState: PasswordState = {
//   loading: false,
//   error: "",
//   success: false,
// };

// export const changePasswordFn = createAsyncThunk(
//   "password/change",
//   async (data: ChangePasswordPayload, { rejectWithValue, getState }) => {
//     try {
//       // Get user ID from Redux store
//       const state = getState() as RootState;
//       const userId = state.loginSlice.data?.user?.id;

//       // Get token from localStorage with correct key
//       const userData = localStorage.getItem("userData");
//       const token = userData ? JSON.parse(userData).Access_token : null;

//       if (!userId || !token) {
//         return rejectWithValue("Authentication required");
//       }

//       const response = await axios.put(
//         `${BASE_API_URL}/user/changepassword`,
//         {
//           userId,
//           oldPassword: data.oldPassword,
//           newPassword: data.newPassword,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       return response.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return rejectWithValue(
//           error.response?.data.message || DEFAULT_ERROR_MESSAGE
//         );
//       }
//       return rejectWithValue(DEFAULT_ERROR_MESSAGE);
//     }
//   }
// );

// const passwordSlice = createSlice({
//   name: "password",
//   initialState,
//   reducers: {
//     resetPasswordState: (state) => {
//       state.loading = false;
//       state.error = "";
//       state.success = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(changePasswordFn.pending, (state) => {
//         state.loading = true;
//         state.error = "";
//         state.success = false;
//       })
//       .addCase(changePasswordFn.fulfilled, (state) => {
//         state.loading = false;
//         state.success = true;
//         state.error = "";
//       })
//       .addCase(changePasswordFn.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//         state.success = false;
//       });
//   },
// });

// export const { resetPasswordState } = passwordSlice.actions;
// export default passwordSlice.reducer;
// src/Redux/Auth/PasswordSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../Constant";
import axios, { AxiosError } from "axios";
import { RootState } from "../Redux/store";

interface PasswordState {
  loading: boolean;
  error: string;
  success: boolean;
}

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

const initialState: PasswordState = {
  loading: false,
  error: "",
  success: false,
};

export const changePasswordFn = createAsyncThunk(
  "password/change",
  async (data: ChangePasswordPayload, { rejectWithValue, getState }) => {
    try {
      // Get user ID from Redux store
      const state = getState() as RootState;
      const userId = state.loginSlice.data?.user?.id;

      // Get token from localStorage with correct key
      const userData = localStorage.getItem("userData");
      const token = userData ? JSON.parse(userData).Access_token : null;

      if (!userId || !token) {
        return rejectWithValue("Authentication required");
      }

      const response = await axios.put(
        `${BASE_API_URL}/user/changepassword`,
        {
          userId,
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
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

const passwordSlice = createSlice({
  name: "password",
  initialState,
  reducers: {
    resetPasswordState: (state) => {
      state.loading = false;
      state.error = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePasswordFn.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(changePasswordFn.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = "";
      })
      .addCase(changePasswordFn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetPasswordState } = passwordSlice.actions;
export default passwordSlice.reducer;