import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../Constant";
import axios, { AxiosError } from "axios";
import { RootState } from "../Redux/store";

interface PhotoState {
  loading: boolean;
  error: string;
  success: boolean;
}

interface UploadPhotoResponse {
  photoUrl: string;
}

const initialState: PhotoState = {
  loading: false,
  error: "",
  success: false,
};

export const uploadPhotoFn = createAsyncThunk(
  "photo/upload",
  async (formData: FormData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const userId = state.loginSlice.data?.user?.id;

      const userData = localStorage.getItem("userData");
      const token = userData ? JSON.parse(userData).Access_token : null;

      if (!userId || !token) {
        return rejectWithValue("Authentication required");
      }

      formData.append("userId", userId.toString());

      // Corrected HTTP method to POST
      const response = await axios.post<UploadPhotoResponse>(
        `${BASE_API_URL}/user/upload-photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Upload error:", error);
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || DEFAULT_ERROR_MESSAGE
        );
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    resetPhotoState: (state) => {
      state.loading = false;
      state.error = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadPhotoFn.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(uploadPhotoFn.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = "";
      })
      .addCase(uploadPhotoFn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetPhotoState } = photoSlice.actions;
export default photoSlice.reducer;