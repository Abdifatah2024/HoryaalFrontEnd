// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios, { AxiosError } from "axios";
// import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";
// import { RootState } from "../../Redux/store";

// // Interfaces
// export interface EmployeeAttendance {
//   id: number;
//   employeeId: number;
//   present: boolean;
//   remark?: string;
//   markedById: number;
//   date: string;
//   employee?: {
//     id: number;
//     fullname: string;
//     email?: string;
//   };
//   markedBy?: {
//     id: number;
//     fullname: string;
//   };
// }

// export interface MonthlyAttendanceReportItem {
//   employeeId: number;
//   fullName: string;
//   jobTitle: string;
//   phone: string;
//   totalAbsences: number;
//   totalPresents: number;
//   attendanceRate: string;
//   presentDays: string;
//   records: {
//     date: string;
//     remark: string;
//     markedBy: string;
//   }[];
// }

// export interface YearlyAttendanceSummaryItem {
//   employeeId: number;
//   fullName: string;
//   jobTitle: string;
//   monthlySummary: {
//     month: number;
//     present: number;
//     absent: number;
//   }[];
//   totalPresent: number;
//   totalAbsent: number;
// }

// // State
// interface EmployeeAttendanceState {
//   loading: boolean;
//   error: string;
//   records: EmployeeAttendance[];
//   record: EmployeeAttendance | null;
//   monthlyReport: MonthlyAttendanceReportItem[];
//   yearlyReport: YearlyAttendanceSummaryItem[];
// }

// const initialState: EmployeeAttendanceState = {
//   loading: false,
//   error: "",
//   records: [],
//   record: null,
//   monthlyReport: [],
//   yearlyReport: [],
// };

// // Thunks
// export const markEmployeeAttendance = createAsyncThunk(
//   "employeeAttendance/mark",
//   async (
//     data: { employeeId: number; present: boolean; remark?: string },
//     { getState, rejectWithValue }
//   ) => {
//     const state = getState() as RootState;
//     const markedById = state.loginSlice.data?.user?.id;

//     if (!markedById) {
//       return rejectWithValue("Login user not found.");
//     }

//     try {
//       const res = await axios.post(`${BASE_API_URL}/Employee/Attendece`, {
//         ...data,
//         markedById,
//         date: new Date().toISOString(),
//       });
//       return res.data.attendance;
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(
//           error.response?.data?.message || "Failed to mark attendance."
//         );
//       }
//       return rejectWithValue("Unexpected error occurred.");
//     }
//   }
// );

// export const fetchAllEmployeeAttendances = createAsyncThunk(
//   "employeeAttendance/fetchAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE_API_URL}/Employee/Attendece`);
//       return res.data;
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

// export const fetchMonthlyEmployeeReport = createAsyncThunk(
//   "employeeAttendance/fetchMonthlyReport",
//   async (
//     { month, year }: { month: number; year: number },
//     { rejectWithValue }
//   ) => {
//     try {
//       const res = await axios.get(
//         `${BASE_API_URL}/Employee/Attendece/employee-report?month=${month}&year=${year}`
//       );
//       return res.data.report as MonthlyAttendanceReportItem[];
//     } catch (error) {
//       return rejectWithValue("Failed to fetch monthly report");
//     }
//   }
// );

// export const fetchYearlyEmployeeReport = createAsyncThunk(
//   "employeeAttendance/fetchYearlyReport",
//   async (year: number, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(
//         `${BASE_API_URL}/Employee/Attendece/yearly-summary?year=${year}`
//       );
//       return res.data.report as YearlyAttendanceSummaryItem[];
//     } catch (error) {
//       return rejectWithValue("Failed to fetch yearly report");
//     }
//   }
// );

// export const updateEmployeeAttendance = createAsyncThunk(
//   "employeeAttendance/update",
//   async (
//     { id, present }: { id: number; present: boolean },
//     { rejectWithValue }
//   ) => {
//     try {
//       const res = await axios.put(`${BASE_API_URL}/Employee/Attendece/${id}`, {
//         present,
//         remark: present ? "Present" : "Absent",
//       });
//       return res.data.updated as EmployeeAttendance;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return rejectWithValue(
//           error.response?.data?.message || "Update failed"
//         );
//       }
//       return rejectWithValue(DEFAULT_ERROR_MESSAGE);
//     }
//   }
// );

// export const deleteEmployeeAttendance = createAsyncThunk(
//   "employeeAttendance/delete",
//   async (id: number, { rejectWithValue }) => {
//     try {
//       await axios.delete(`${BASE_API_URL}/employee-attendance/${id}`);
//       return id;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return rejectWithValue(
//           error.response?.data?.message || "Delete failed"
//         );
//       }
//       return rejectWithValue(DEFAULT_ERROR_MESSAGE);
//     }
//   }
// );

// // Slice
// const employeeAttendanceSlice = createSlice({
//   name: "employeeAttendance",
//   initialState,
//   reducers: {
//     clearAttendance: (state) => {
//       state.record = null;
//       state.error = "";
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(markEmployeeAttendance.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(markEmployeeAttendance.fulfilled, (state, action) => {
//         state.loading = false;
//         state.records.unshift(action.payload);
//       })
//       .addCase(markEmployeeAttendance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       .addCase(fetchAllEmployeeAttendances.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchAllEmployeeAttendances.fulfilled, (state, action) => {
//         state.loading = false;
//         state.records = action.payload;
//       })
//       .addCase(fetchAllEmployeeAttendances.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       .addCase(fetchMonthlyEmployeeReport.fulfilled, (state, action) => {
//         state.monthlyReport = action.payload;
//       })
//       .addCase(fetchMonthlyEmployeeReport.rejected, (state, action) => {
//         state.error = action.payload as string;
//       })

//       .addCase(fetchYearlyEmployeeReport.fulfilled, (state, action) => {
//         state.yearlyReport = action.payload;
//       })
//       .addCase(fetchYearlyEmployeeReport.rejected, (state, action) => {
//         state.error = action.payload as string;
//       })

//       .addCase(updateEmployeeAttendance.fulfilled, (state, action) => {
//         const index = state.records.findIndex(
//           (r) => r.id === action.payload.id
//         );
//         if (index !== -1) state.records[index] = action.payload;
//       })

//       .addCase(deleteEmployeeAttendance.fulfilled, (state, action) => {
//         state.records = state.records.filter((r) => r.id !== action.payload);
//       });
//   },
// });

// export const { clearAttendance } = employeeAttendanceSlice.actions;
// export default employeeAttendanceSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";
import { RootState } from "../../Redux/store";

// Interfaces
export interface EmployeeAttendance {
  id: number;
  employeeId: number;
  present: boolean;
  remark?: string;
  markedById: number;
  date: string;
  employee?: {
    id: number;
    fullname: string;
    email?: string;
  };
  markedBy?: {
    id: number;
    fullname: string;
  };
}

export interface MonthlyAttendanceReportItem {
  employeeId: number;
  fullName: string;
  jobTitle: string;
  phone: string;
  totalAbsences: number;
  totalPresents: number;
  attendanceRate: string;
  presentDays: string;
  records: {
    date: string;
    remark: string;
    markedBy: string;
  }[];
}

export interface YearlyAttendanceSummaryItem {
  employeeId: number;
  fullName: string;
  jobTitle: string;
  monthlySummary: {
    month: number;
    present: number;
    absent: number;
  }[];
  totalPresent: number;
  totalAbsent: number;
}

// State
interface EmployeeAttendanceState {
  loading: boolean;
  error: string;
  records: EmployeeAttendance[];
  record: EmployeeAttendance | null;
  monthlyReport: MonthlyAttendanceReportItem[];
  yearlyReport: YearlyAttendanceSummaryItem[];
}

const initialState: EmployeeAttendanceState = {
  loading: false,
  error: "",
  records: [],
  record: null,
  monthlyReport: [],
  yearlyReport: [],
};

// Thunks
export const markEmployeeAttendance = createAsyncThunk(
  "employeeAttendance/mark",
  async (
    data: { employeeId: number; present: boolean; remark?: string },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const markedById = state.loginSlice.data?.user?.id;

    if (!markedById) {
      return rejectWithValue("Login user not found.");
    }

    try {
      const res = await axios.post(`${BASE_API_URL}/Employee/Attendece`, {
        ...data,
        markedById,
        date: new Date().toISOString(),
      });
      return res.data.attendance;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to mark attendance."
        );
      }
      return rejectWithValue("Unexpected error occurred.");
    }
  }
);

export const fetchAllEmployeeAttendances = createAsyncThunk(
  "employeeAttendance/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/Employee/Attendece`);
      return res.data;
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

export const fetchMonthlyEmployeeReport = createAsyncThunk(
  "employeeAttendance/fetchMonthlyReport",
  async (
    { month, year }: { month: number; year: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get(
        `${BASE_API_URL}/Employee/Attendece/employee-report?month=${month}&year=${year}`
      );
      return res.data.report as MonthlyAttendanceReportItem[];
    } catch (_) {
      return rejectWithValue("Failed to fetch monthly report");
    }
  }
);

export const fetchYearlyEmployeeReport = createAsyncThunk(
  "employeeAttendance/fetchYearlyReport",
  async (year: number, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_API_URL}/Employee/Attendece/yearly-summary?year=${year}`
      );
      return res.data.report as YearlyAttendanceSummaryItem[];
    } catch (_) {
      return rejectWithValue("Failed to fetch yearly report");
    }
  }
);

export const updateEmployeeAttendance = createAsyncThunk(
  "employeeAttendance/update",
  async (
    { id, present }: { id: number; present: boolean },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.put(`${BASE_API_URL}/Employee/Attendece/${id}`, {
        present,
        remark: present ? "Present" : "Absent",
      });
      return res.data.updated as EmployeeAttendance;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Update failed"
        );
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

export const deleteEmployeeAttendance = createAsyncThunk(
  "employeeAttendance/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_API_URL}/employee-attendance/${id}`);
      return id;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Delete failed"
        );
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

// Slice
const employeeAttendanceSlice = createSlice({
  name: "employeeAttendance",
  initialState,
  reducers: {
    clearAttendance: (state) => {
      state.record = null;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(markEmployeeAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(markEmployeeAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.records.unshift(action.payload);
      })
      .addCase(markEmployeeAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAllEmployeeAttendances.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllEmployeeAttendances.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchAllEmployeeAttendances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchMonthlyEmployeeReport.fulfilled, (state, action) => {
        state.monthlyReport = action.payload;
      })
      .addCase(fetchMonthlyEmployeeReport.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(fetchYearlyEmployeeReport.fulfilled, (state, action) => {
        state.yearlyReport = action.payload;
      })
      .addCase(fetchYearlyEmployeeReport.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(updateEmployeeAttendance.fulfilled, (state, action) => {
        const index = state.records.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) state.records[index] = action.payload;
      })

      .addCase(deleteEmployeeAttendance.fulfilled, (state, action) => {
        state.records = state.records.filter((r) => r.id !== action.payload);
      });
  },
});

export const { clearAttendance } = employeeAttendanceSlice.actions;
export default employeeAttendanceSlice.reducer;
