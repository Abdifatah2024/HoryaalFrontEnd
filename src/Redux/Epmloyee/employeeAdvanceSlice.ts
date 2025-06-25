// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"; // Import PayloadAction
// import axios, { AxiosError } from "axios";
// import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// // ================== Types ===================
// export interface Advance {
//   id: number;
//   amount: number;
//   reason: string;
//   month: number;
//   year: number;
//   employeeId: number;
//   employee: {
//     fullName: string;
//     phone: string;
//   };
//   createdBy: {
//     fullName: string;
//   };
// }

// interface CreateAdvanceResponse {
//   message: string;
//   advance: Advance;
// }

// interface GetAdvanceResponse {
//   count: number;
//   summary1: {
//     totalAdvance: number;
//     advancesBy: string | null;
//     employee: {
//       name: string;
//       phone: string;
//     } | null;
//   };
//   advances: Advance[];
// }

// interface UpdateAdvanceResponse {
//   message: string;
//   updated: Advance;
// }

// interface DeleteAdvanceResponse {
//   id: number;
//   message: string;
// }

// export interface AdvanceState {
//   loading: boolean;
//   error: string | null;
//   success: string | null;
//   advances: Advance[];
//   totalAdvance: number;
//   selectedAdvance: Advance | null;
// }

// const initialState: AdvanceState = {
//   loading: false,
//   error: null,
//   success: null,
//   advances: [],
//   totalAdvance: 0,
//   selectedAdvance: null,
// };

// // ================ Thunks =================
// export const createAdvance = createAsyncThunk<
//   CreateAdvanceResponse,
//   { employeeId: number; data: any },
//   { rejectValue: string }
// >(
//   "employeeAdvance/create",
//   async ({ employeeId, data }, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("Access_token");
//       const response = await axios.post(
//         `${BASE_API_URL}/EmployeeAdvance/employees/${employeeId}/advance-and-update-income`,
//         data,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return response.data;
//     } catch (error) {
//       const err = error as AxiosError;
//       return rejectWithValue(
//         err.response?.data?.message || DEFAULT_ERROR_MESSAGE
//       );
//     }
//   }
// );

// export const fetchEmployeeAdvances = createAsyncThunk<
//   GetAdvanceResponse,
//   { employeeId?: number; employeeName?: string; month?: number; year?: number },
//   { rejectValue: string }
// >(
//   "employeeAdvance/fetch",
//   async ({ employeeId, employeeName, month, year }, { rejectWithValue }) => {
//     try {
//       const params = new URLSearchParams();
//       if (employeeId) params.append("employeeId", String(employeeId));
//       if (employeeName) params.append("employeeName", employeeName);
//       if (month) params.append("month", String(month));
//       if (year) params.append("year", String(year));

//       const token = localStorage.getItem("Access_token");
//       const response = await axios.get(
//         `${BASE_API_URL}/EmployeeAdvance/employee-advanceDetail/?${params.toString()}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       const err = error as AxiosError;
//       return rejectWithValue(
//         err.response?.data?.message || DEFAULT_ERROR_MESSAGE
//       );
//     }
//   }
// );

// // export const updateAdvance = createAsyncThunk<
// //   UpdateAdvanceResponse,
// //   {
// //     id: number;
// //     data: { amount: number; reason?: string; employeeId?: number };
// //   },
// //   { rejectValue: string }
// // >("employeeAdvance/update", async ({ id, data }, { rejectWithValue }) => {
// //   try {
// //     const token = localStorage.getItem("Access_token");
// //     const response = await axios.put(
// //       `${BASE_API_URL}/employee-advance/${id}`,
// //       data,
// //       {
// //         headers: { Authorization: `Bearer ${token}` },
// //       }
// //     );
// //     return response.data;
// //   } catch (error) {
// //     const err = error as AxiosError;
// //     return rejectWithValue(
// //       err.response?.data?.message || DEFAULT_ERROR_MESSAGE
// //     );
// //   }
// // });
// export const updateAdvance = createAsyncThunk<
//   UpdateAdvanceResponse,
//   {
//     id: number;
//     data: {
//       amount: number;
//       reason?: string;
//       employeeId?: number;
//       month?: number;
//       year?: number; // ✅ added this
//     };
//   },
//   { rejectValue: string }
// >("employeeAdvance/update", async ({ id, data }, { rejectWithValue }) => {
//   try {
//     const token = localStorage.getItem("Access_token");
//     const response = await axios.put(
//       `${BASE_API_URL}/employee-advance/${id}`,
//       data,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     const err = error as AxiosError;
//     return rejectWithValue(
//       err.response?.data?.message || DEFAULT_ERROR_MESSAGE
//     );
//   }
// });

// export const deleteAdvance = createAsyncThunk<
//   DeleteAdvanceResponse,
//   number,
//   { rejectValue: string }
// >("employeeAdvance/delete", async (id, { rejectWithValue }) => {
//   try {
//     const token = localStorage.getItem("Access_token");
//     const response = await axios.delete(
//       `${BASE_API_URL}/employee-advance/${id}`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     return { id, message: response.data.message };
//   } catch (error) {
//     const err = error as AxiosError;
//     return rejectWithValue(
//       err.response?.data?.message || DEFAULT_ERROR_MESSAGE
//     );
//   }
// });

// // ================ Slice =================
// const employeeAdvanceSlice = createSlice({
//   name: "employeeAdvance",
//   initialState,
//   reducers: {
//     clearAdvanceState: (state) => {
//       state.loading = false;
//       state.error = null;
//       state.success = null;
//       state.selectedAdvance = null;
//     },
//     // NEW: Action to specifically clear advances data and total
//     clearAdvancesData: (state) => {
//       state.advances = [];
//       state.totalAdvance = 0;
//       state.loading = false; // Ensure loading is off
//       state.error = null; // Clear any existing errors
//       state.success = null; // Clear any existing success messages
//       state.selectedAdvance = null; // Also clear selected advance if any
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createAdvance.pending, (state) => {
//         state.loading = true;
//         state.success = null;
//         state.error = null;
//       })
//       .addCase(createAdvance.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = action.payload.message;
//       })
//       .addCase(createAdvance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to create advance";
//       })

//       .addCase(fetchEmployeeAdvances.pending, (state) => {
//         state.loading = true;
//         state.error = null; // Clear error on new fetch attempt
//         state.success = null; // Clear success on new fetch attempt
//       })
//       .addCase(fetchEmployeeAdvances.fulfilled, (state, action) => {
//         state.loading = false;
//         state.advances = action.payload.advances;
//         state.totalAdvance = action.payload.summary1.totalAdvance;
//       })
//       .addCase(fetchEmployeeAdvances.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to fetch advances";
//         state.advances = []; // Clear advances on error
//         state.totalAdvance = 0; // Reset total on error
//       })

//       .addCase(updateAdvance.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = null;
//       })
//       .addCase(updateAdvance.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = action.payload.message;
//         // Update the specific advance in the list
//         const index = state.advances.findIndex(
//           (adv) => adv.id === action.payload.updated.id
//         );
//         if (index !== -1) {
//           const oldAmount = state.advances[index].amount;
//           state.advances[index] = action.payload.updated;
//           // Recalculate totalAdvance based on the change
//           state.totalAdvance =
//             state.totalAdvance - oldAmount + action.payload.updated.amount;
//         }
//       })
//       .addCase(updateAdvance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to update advance";
//       })

//       .addCase(deleteAdvance.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = null;
//       })
//       .addCase(deleteAdvance.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = action.payload.message;
//         state.advances = state.advances.filter(
//           (a) => a.id !== action.payload.id
//         );
//         // Recalculate total after deletion
//         state.totalAdvance = state.advances.reduce(
//           (sum, adv) => sum + adv.amount,
//           0
//         );
//       })
//       .addCase(deleteAdvance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to delete advance";
//       });
//   },
// });

// export const { clearAdvanceState, clearAdvancesData } =
//   employeeAdvanceSlice.actions; // Export both actions

// export default employeeAdvanceSlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// =============== Types ===============
export interface Advance {
  id: number;
  amount: number;
  reason: string;
  month: number;
  year: number;
  employeeId: number;
  employee: {
    fullName: string;
    phone: string;
  };
  createdBy: {
    fullName: string;
  };
}

interface CreateAdvanceResponse {
  message: string;
  advance: Advance;
}

interface GetAdvanceResponse {
  count: number;
  summary1: {
    totalAdvance: number;
    advancesBy: string | null;
    employee: {
      name: string;
      phone: string;
    } | null;
  };
  advances: Advance[];
}

interface UpdateAdvanceResponse {
  message: string;
  updated: Advance;
}

interface DeleteAdvanceResponse {
  id: number;
  message: string;
}

export interface AdvanceState {
  loading: boolean;
  error: string | null;
  success: string | null;
  advances: Advance[];
  totalAdvance: number;
  selectedAdvance: Advance | null;
}

const initialState: AdvanceState = {
  loading: false,
  error: null,
  success: null,
  advances: [],
  totalAdvance: 0,
  selectedAdvance: null,
};

// =============== Thunks ===============
export const createAdvance = createAsyncThunk<
  CreateAdvanceResponse,
  { employeeId: number; data: any },
  { rejectValue: string }
>(
  "employeeAdvance/create",
  async ({ employeeId, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Access_token");
      const response = await axios.post(
        `${BASE_API_URL}/EmployeeAdvance/employees/${employeeId}/advance-and-update-income`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(
        (err.response?.data as { message?: string })?.message ||
          DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

export const fetchEmployeeAdvances = createAsyncThunk<
  GetAdvanceResponse,
  { employeeId?: number; employeeName?: string; month?: number; year?: number },
  { rejectValue: string }
>(
  "employeeAdvance/fetch",
  async ({ employeeId, employeeName, month, year }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (employeeId) params.append("employeeId", String(employeeId));
      if (employeeName) params.append("employeeName", employeeName);
      if (month) params.append("month", String(month));
      if (year) params.append("year", String(year));

      const token = localStorage.getItem("Access_token");
      const response = await axios.get(
        `${BASE_API_URL}/EmployeeAdvance/employee-advanceDetail/?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(
        (err.response?.data as { message?: string })?.message ||
          DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

export const updateAdvance = createAsyncThunk<
  UpdateAdvanceResponse,
  {
    id: number;
    data: {
      amount: number;
      reason?: string;
      employeeId?: number;
      month?: number;
      year?: number;
    };
  },
  { rejectValue: string }
>("employeeAdvance/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("Access_token");
    const response = await axios.put(
      `${BASE_API_URL}/employee-advance/${id}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(
      (err.response?.data as { message?: string })?.message ||
        DEFAULT_ERROR_MESSAGE
    );
  }
});

export const deleteAdvance = createAsyncThunk<
  DeleteAdvanceResponse,
  number,
  { rejectValue: string }
>("employeeAdvance/delete", async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("Access_token");
    const response = await axios.delete(
      `${BASE_API_URL}/employee-advance/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { id, message: response.data.message };
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(
      (err.response?.data as { message?: string })?.message ||
        DEFAULT_ERROR_MESSAGE
    );
  }
});

// =============== Slice ===============
const employeeAdvanceSlice = createSlice({
  name: "employeeAdvance",
  initialState,
  reducers: {
    clearAdvanceState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      state.selectedAdvance = null;
    },
    clearAdvancesData: (state) => {
      state.advances = [];
      state.totalAdvance = 0;
      state.loading = false;
      state.error = null;
      state.success = null;
      state.selectedAdvance = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAdvance.pending, (state) => {
        state.loading = true;
        state.success = null;
        state.error = null;
      })
      .addCase(createAdvance.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(createAdvance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create advance";
      })

      .addCase(fetchEmployeeAdvances.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchEmployeeAdvances.fulfilled, (state, action) => {
        state.loading = false;
        state.advances = action.payload.advances;
        state.totalAdvance = action.payload.summary1.totalAdvance;
      })
      .addCase(fetchEmployeeAdvances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch advances";
        state.advances = [];
        state.totalAdvance = 0;
      })

      .addCase(updateAdvance.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateAdvance.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        const index = state.advances.findIndex(
          (adv) => adv.id === action.payload.updated.id
        );
        if (index !== -1) {
          const oldAmount = state.advances[index].amount;
          state.advances[index] = action.payload.updated;
          state.totalAdvance =
            state.totalAdvance - oldAmount + action.payload.updated.amount;
        }
      })
      .addCase(updateAdvance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update advance";
      })

      .addCase(deleteAdvance.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteAdvance.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.advances = state.advances.filter(
          (a) => a.id !== action.payload.id
        );
        state.totalAdvance = state.advances.reduce(
          (sum, adv) => sum + adv.amount,
          0
        );
      })
      .addCase(deleteAdvance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete advance";
      });
  },
});

export const { clearAdvanceState, clearAdvancesData } =
  employeeAdvanceSlice.actions;
export default employeeAdvanceSlice.reducer;
