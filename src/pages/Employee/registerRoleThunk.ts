import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";
import type { User } from "../../types/Register";

// ✅ Exported separately
// export const updateUserRole = createAsyncThunk(
//   "users/updateUserRole",
//   async (
//     { userId, role }: { userId: string; role: "ADMIN" | "USER" },
//     { rejectWithValue, getState }
//   ) => {
//     const token = (getState() as any)?.loginSlice?.data?.Access_token;

//     try {
//       const response = await axios.put(
//         `${BASE_API_URL}/user/users/${userId}/role`,
//         { role },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       return response.data.user as User;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return rejectWithValue(
//           error.response?.data?.message || DEFAULT_ERROR_MESSAGE
//         );
//       }
//       return rejectWithValue(DEFAULT_ERROR_MESSAGE);
//     }
//   }
// );

export const updateUserRole = createAsyncThunk(
  "users/updateUserRole",
  async (
    { userId, role }: { userId: string; role: "ADMIN" | "USER" },
    { rejectWithValue, getState }
  ) => {
    const token = (getState() as any)?.loginSlice?.data?.Access_token;

    try {
      const response = await axios.put(
        `${BASE_API_URL}/user/users/${userId}/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.user as User;
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
