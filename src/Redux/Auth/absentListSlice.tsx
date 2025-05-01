import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from '../../Constant';
import type { RootState } from '../../Redux/store';

interface AbsentRecord {
  id: number;
  date: string;
  remark: string;
  present: boolean;
  student: {
    id: number;
    fullName: string;
  };
  user: {
    fullName: string;
  };
}

interface AbsentState {
  loading: boolean;
  error: string | null;
  absentees: AbsentRecord[];
}

const initialState: AbsentState = {
  loading: false,
  error: null,
  absentees: [],
};

export const fetchAbsenteesByDate = createAsyncThunk(
  'absentees/fetchByDate',
  async (date: string, { rejectWithValue, getState }) => {
    const stateData: any = getState();
    const { Access_token = null } = stateData?.loginSlice?.data || {};

    try {
      const res = await axios.get(`${BASE_API_URL}/student/absentees?date=${date}`, {
        headers: { Authorization: `Bearer ${Access_token}` },
      });
      return res.data.records;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

const absentListSlice = createSlice({
  name: 'absentees',
  initialState,
  reducers: {
    clearAbsentees: (state) => {
      state.absentees = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAbsenteesByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAbsenteesByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.absentees = action.payload;
      })
      .addCase(fetchAbsenteesByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAbsentees } = absentListSlice.actions;

export const selectAbsentees = (state: RootState) => state.absentList.absentees;
export const selectAbsentLoading = (state: RootState) => state.absentList.loading;
export const selectAbsentError = (state: RootState) => state.absentList.error;

export default absentListSlice.reducer;
