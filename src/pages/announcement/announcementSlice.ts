// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios, { AxiosError } from "axios";
// import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// export interface Announcement {
//   id: number;
//   title: string;
//   message: string;
//   targetRole: string;
//   startDate: string;
//   endDate: string;
//   createdAt: string;
//   timeRemaining?: string;
//   daysLeft?: number;
//   hoursLeft?: number;
//   minutesLeft?: number;
// }

// interface AnnouncementState {
//   announcements: Announcement[];
//   loading: boolean;
//   error: string | null;
//   success: string | null;
// }

// const initialState: AnnouncementState = {
//   announcements: [],
//   loading: false,
//   error: null,
//   success: null,
// };

// // ✅ GET: Fetch current role-based announcements
// export const fetchMyAnnouncements = createAsyncThunk(
//   "announcement/fetchMyAnnouncements",
//   async (_, { rejectWithValue }) => {
//     const token = localStorage.getItem("Access_token");
//     try {
//       const response = await axios.get(`${BASE_API_URL}/user/announcements`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return response.data;
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

// // ✅ GET: Admin-only — Fetch all announcements
// export const fetchAllAnnouncementsForAdmin = createAsyncThunk(
//   "announcement/fetchAllAnnouncementsForAdmin",
//   async (_, { rejectWithValue }) => {
//     const token = localStorage.getItem("Access_token");
//     try {
//       const response = await axios.get(
//         `${BASE_API_URL}/user/announcements/all`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       return response.data;
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

// // ✅ POST: Create new announcement (Admin)
// export const createAnnouncement = createAsyncThunk(
//   "announcement/createAnnouncement",
//   async (
//     data: {
//       title: string;
//       message: string;
//       targetRole: string;
//       startDate: string;
//       endDate: string;
//     },
//     { rejectWithValue }
//   ) => {
//     const token = localStorage.getItem("Access_token");
//     try {
//       const response = await axios.post(
//         `${BASE_API_URL}/user/announcements`,
//         data,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       return response.data;
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

// // ✅ DELETE: Delete announcement (optional, if implemented on backend)
// export const deleteAnnouncement = createAsyncThunk(
//   "announcement/deleteAnnouncement",
//   async (announcementId: number, { rejectWithValue }) => {
//     const token = localStorage.getItem("Access_token");
//     try {
//       await axios.delete(`${BASE_API_URL}/announcements/${announcementId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return announcementId;
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

// const announcementSlice = createSlice({
//   name: "announcement",
//   initialState,
//   reducers: {
//     clearAnnouncementState: (state) => {
//       state.loading = false;
//       state.error = null;
//       state.success = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch own announcements
//       .addCase(fetchMyAnnouncements.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchMyAnnouncements.fulfilled, (state, action) => {
//         state.loading = false;
//         state.announcements = action.payload;
//       })
//       .addCase(fetchMyAnnouncements.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Fetch all for admin
//       .addCase(fetchAllAnnouncementsForAdmin.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllAnnouncementsForAdmin.fulfilled, (state, action) => {
//         state.loading = false;
//         state.announcements = action.payload;
//       })
//       .addCase(fetchAllAnnouncementsForAdmin.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Create
//       .addCase(createAnnouncement.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = null;
//       })
//       .addCase(createAnnouncement.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = "Announcement created successfully";
//         state.announcements.unshift(action.payload);
//       })
//       .addCase(createAnnouncement.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Delete
//       .addCase(deleteAnnouncement.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = null;
//       })
//       .addCase(deleteAnnouncement.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = "Announcement deleted successfully";
//         state.announcements = state.announcements.filter(
//           (a) => a.id !== action.payload
//         );
//       })
//       .addCase(deleteAnnouncement.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearAnnouncementState } = announcementSlice.actions;
// export default announcementSlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// ------------------------
// Interfaces
// ------------------------
export interface Announcement {
  id: number;
  title: string;
  message: string;
  targetRole: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  timeRemaining?: string;
  daysLeft?: number;
  hoursLeft?: number;
  minutesLeft?: number;
  isExpired?: boolean; // 👈 Add this if used in UI
  createdBy?: {
    id: number;
    fullName: string;
    email: string;
    role: string;
  };
}

interface AnnouncementState {
  announcements: Announcement[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: AnnouncementState = {
  announcements: [],
  loading: false,
  error: null,
  success: null,
};

// ------------------------
// Async Thunks
// ------------------------

// ✅ GET: Fetch current user announcements (by role)
export const fetchMyAnnouncements = createAsyncThunk(
  "announcement/fetchMyAnnouncements",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("Access_token");
    try {
      const response = await axios.get(`${BASE_API_URL}/user/announcements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
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

// ✅ GET: Admin — fetch all announcements
export const fetchAllAnnouncementsForAdmin = createAsyncThunk(
  "announcement/fetchAllAnnouncementsForAdmin",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("Access_token");
    try {
      const response = await axios.get(
        `${BASE_API_URL}/user/announcements/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
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

// ✅ POST: Create announcement
export const createAnnouncement = createAsyncThunk(
  "announcement/createAnnouncement",
  async (
    data: {
      title: string;
      message: string;
      targetRole: string;
      startDate: string;
      endDate: string;
    },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("Access_token");
    try {
      const response = await axios.post(
        `${BASE_API_URL}/user/announcements`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
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

// ✅ PUT: Edit announcement
export const editAnnouncement = createAsyncThunk(
  "announcement/editAnnouncement",
  async (
    data: {
      id: number;
      title: string;
      message: string;
      targetRole: string;
      startDate: string;
      endDate: string;
    },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("Access_token");
    try {
      const response = await axios.put(
        `${BASE_API_URL}/user/announcements/${data.id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
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

// ✅ DELETE: Delete announcement
export const deleteAnnouncement = createAsyncThunk(
  "announcement/deleteAnnouncement",
  async (announcementId: number, { rejectWithValue }) => {
    const token = localStorage.getItem("Access_token");
    try {
      await axios.delete(
        `${BASE_API_URL}/user/announcements/${announcementId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return announcementId;
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

// ------------------------
// Slice
// ------------------------
const announcementSlice = createSlice({
  name: "announcement",
  initialState,
  reducers: {
    clearAnnouncementState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch for user
      .addCase(fetchMyAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = action.payload;
      })
      .addCase(fetchMyAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Fetch all for admin
      .addCase(fetchAllAnnouncementsForAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAnnouncementsForAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = action.payload;
      })
      .addCase(fetchAllAnnouncementsForAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Create
      .addCase(createAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Announcement created successfully";
        state.announcements.unshift(action.payload);
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Edit
      .addCase(editAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(editAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Announcement updated successfully";
        const index = state.announcements.findIndex(
          (a) => a.id === action.payload.id
        );
        if (index !== -1) {
          state.announcements[index] = action.payload;
        }
      })
      .addCase(editAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Delete
      .addCase(deleteAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Announcement deleted successfully";
        state.announcements = state.announcements.filter(
          (a) => a.id !== action.payload
        );
      })
      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ------------------------
// Exports
// ------------------------
export const { clearAnnouncementState } = announcementSlice.actions;
export default announcementSlice.reducer;
