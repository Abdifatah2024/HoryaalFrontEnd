// src/Redux/WorkPlan/workPlanSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_API_URL = "http://localhost:4000";
const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

interface User {
  id: number;
  fullName: string;
  role: string;
}

interface WorkPlanComment {
  id: number;
  comment: string;
  status: string;
  user: User;
  createdAt: string;
  workPlanId: number;
}

interface WorkPlan {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  assignedToId: number;
  reviewedById?: number;
  reviewComments?: string;
  assignedTo: User;
  reviewedBy?: User | null;
  WorkPlanComment: WorkPlanComment[];
}

interface WorkPlanState {
  loading: boolean;
  error: string | null;
  success: string | null;
  workPlans: WorkPlan[];
  selectedPlan: WorkPlan | null;
  comments: WorkPlanComment[];
  users: User[];
}

const initialState: WorkPlanState = {
  loading: false,
  error: null,
  success: null,
  workPlans: [],
  selectedPlan: null,
  comments: [],
  users: [], // ✅ important for default
};

// Thunks
export const fetchAllWorkPlansWithComments = createAsyncThunk(
  "workPlan/fetchAllWorkPlansWithComments",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Access_token");
      const res = await axios.get(
        `${BASE_API_URL}/api/workplans/workplans-with-comments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.workPlans;
    } catch {
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "workPlan/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Access_token");
      const res = await axios.get(`${BASE_API_URL}/user/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch {
      return rejectWithValue("Failed to fetch users");
    }
  }
);

export const createWorkPlan = createAsyncThunk(
  "workPlan/createWorkPlan",
  async (data: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Access_token");
      const res = await axios.post(`${BASE_API_URL}/api/workplans`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.workPlan;
    } catch {
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

export const updateWorkPlan = createAsyncThunk(
  "workPlan/updateWorkPlan",
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Access_token");
      const res = await axios.put(`${BASE_API_URL}/work-plans/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.workPlan;
    } catch {
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

export const deleteWorkPlan = createAsyncThunk(
  "workPlan/deleteWorkPlan",
  async (id: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Access_token");
      await axios.delete(`${BASE_API_URL}/api/workplans/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch {
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

export const addComment = createAsyncThunk(
  "workPlan/addComment",
  async (
    data: { workPlanId: number; comment: string; status: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("Access_token");
      const res = await axios.post(
        `${BASE_API_URL}/api/workplans/workplans/${data.workPlanId}/comments`,
        {
          comment: data.comment,
          status: data.status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.comment;
    } catch {
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

// Slice
const workPlanSlice = createSlice({
  name: "workPlan",
  initialState,
  reducers: {
    clearWorkPlanState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      state.selectedPlan = null;
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllWorkPlansWithComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllWorkPlansWithComments.fulfilled, (state, action) => {
        state.loading = false;
        state.workPlans = action.payload;
      })
      .addCase(fetchAllWorkPlansWithComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload || []; // ✅ safe default
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(createWorkPlan.fulfilled, (state, action) => {
        state.workPlans.unshift(action.payload);
        state.success = "Work plan created.";
      })

      .addCase(updateWorkPlan.fulfilled, (state, action) => {
        const idx = state.workPlans.findIndex(
          (wp) => wp.id === action.payload.id
        );
        if (idx !== -1) state.workPlans[idx] = action.payload;
        state.success = "Work plan updated.";
      })

      .addCase(deleteWorkPlan.fulfilled, (state, action) => {
        state.workPlans = state.workPlans.filter(
          (wp) => wp.id !== action.payload
        );
        state.success = "Work plan deleted.";
      })

      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
        const plan = state.workPlans.find(
          (wp) => wp.id === action.payload.workPlanId
        );
        if (plan) {
          plan.WorkPlanComment.push(action.payload);
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearWorkPlanState } = workPlanSlice.actions;
export default workPlanSlice.reducer;
