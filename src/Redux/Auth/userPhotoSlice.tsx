import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '../../Constant';

// Define a more detailed User type
interface User {
  id: number;
  fullName: string;
  username: string;
  email: string;
  photoUrl?: string;
  role: string;
}

interface UserState {
  userData: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userData: null,
  loading: false,
  error: null,
};

// Helper function to extract error message
const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "Network Error";
  }
  return "An unknown error occurred";
};

// Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<User>(`${BASE_API_URL}/user/photo/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Upload user photo
export const uploadUserPhoto = createAsyncThunk(
  'user/uploadPhoto',
  async ({ userId, photo }: { userId: number; photo: File }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('photo', photo);

      const response = await axios.post<{ photoUrl: string }>(
        `${BASE_API_URL}/user/${userId}/photo`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      return response.data.photoUrl;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Optional: Add a reset action
    resetUserState: (state) => {
      state.userData = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadUserPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadUserPhoto.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        if (state.userData) {
          state.userData.photoUrl = action.payload;
        }
      })
      .addCase(uploadUserPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
