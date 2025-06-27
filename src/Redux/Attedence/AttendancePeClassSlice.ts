// // export default attendanceSlice.reducer;
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";
// import axios, { AxiosError } from "axios";
// import { RootState } from "../../Redux/store";

// interface Student {
//   id: number;
//   fullname: string;
//   classId: number;
//   // Add other relevant fields
// }

// interface ClassItem {
//   id: number;
//   name: string;
//   student?: Student[]; // ✅ added
// }

// interface AbsentStudent {
//   studentId: number;
//   fullname: string;
//   classId: number;
//   remark: string;
//   date: string;
// }

// export interface AttendanceState {
//   loading: boolean;
//   saving: boolean;
//   classList: ClassItem[];
//   successMessage: string;
//   errorMessage: string;
//   absentStudents: AbsentStudent[]; // ✅ NEW
// }

// const initialState: AttendanceState = {
//   loading: false,
//   saving: false,
//   classList: [],
//   successMessage: "",
//   errorMessage: "",
//   absentStudents: [], // ✅ NEW
// };

// // ✅ Fetch all class list
// export const fetchClasses = createAsyncThunk(
//   "attendance/fetchClasses",
//   async (_, { rejectWithValue, getState }) => {
//     const state = getState() as RootState;
//     const { Access_token = null } = state.loginSlice?.data || {};

//     try {
//       const res = await axios.get(`${BASE_API_URL}/student/classList`, {
//         headers: { Authorization: `Bearer ${Access_token}` },
//       });
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

// // ✅ Save class attendance
// export const saveClassAttendance = createAsyncThunk(
//   "attendance/saveClassAttendance",
//   async (
//     payload: { studentId: number; present: boolean; remark: string }[],
//     { rejectWithValue, getState }
//   ) => {
//     const state = getState() as RootState;
//     const { Access_token = null } = state.loginSlice?.data || {};

//     if (!Access_token) {
//       return rejectWithValue("Access token missing. Please login.");
//     }

//     try {
//       const requests = payload.map((attend) =>
//         axios.post(`${BASE_API_URL}/student/createattendance`, attend, {
//           headers: { Authorization: `Bearer ${Access_token}` },
//         })
//       );
//       const results = await Promise.allSettled(requests);
//       const failed = results.filter((res) => res.status === "rejected");
//       if (failed.length > 0) {
//         throw new Error("Some attendance records failed to save.");
//       }
//       return "Attendance saved successfully!";
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

// // ✅ Fetch absent students by date
// export const fetchAbsentStudentsByDate = createAsyncThunk<
//   AbsentStudent[],
//   string,
//   { rejectValue: string; state: RootState }
// >(
//   "attendance/fetchAbsentStudentsByDate",
//   async (date, { rejectWithValue, getState }) => {
//     const state = getState();
//     const { Access_token = null } = state.loginSlice?.data || {};

//     try {
//       const res = await axios.get(`${BASE_API_URL}/student/attendance/absent`, {
//         params: { date },
//         headers: { Authorization: `Bearer ${Access_token}` },
//       });
//       return res.data.absentStudents || [];
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

// const attendanceSlice = createSlice({
//   name: "attendance",
//   initialState,
//   reducers: {
//     clearAttendanceState: (state) => {
//       state.loading = false;
//       state.saving = false;
//       state.successMessage = "";
//       state.errorMessage = "";
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchClasses.pending, (state) => {
//         state.loading = true;
//         state.errorMessage = "";
//       })
//       .addCase(fetchClasses.fulfilled, (state, action) => {
//         state.loading = false;
//         state.classList = action.payload;
//       })
//       .addCase(fetchClasses.rejected, (state, action) => {
//         state.loading = false;
//         state.errorMessage = action.payload as string;
//       })

//       .addCase(saveClassAttendance.pending, (state) => {
//         state.saving = true;
//         state.successMessage = "";
//         state.errorMessage = "";
//       })
//       .addCase(saveClassAttendance.fulfilled, (state, action) => {
//         state.saving = false;
//         state.successMessage = action.payload as string;
//       })
//       .addCase(saveClassAttendance.rejected, (state, action) => {
//         state.saving = false;
//         state.errorMessage = action.payload as string;
//       })

//       .addCase(fetchAbsentStudentsByDate.pending, (state) => {
//         state.loading = true;
//         state.errorMessage = "";
//       })
//       .addCase(fetchAbsentStudentsByDate.fulfilled, (state, action) => {
//         state.loading = false;
//         state.absentStudents = action.payload;
//       })
//       .addCase(fetchAbsentStudentsByDate.rejected, (state, action) => {
//         state.loading = false;
//         state.errorMessage = action.payload as string;
//       });
//   },
// });

// export const { clearAttendanceState } = attendanceSlice.actions;
// export default attendanceSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";
import { RootState } from "../../Redux/store";

interface Student {
  id: number;
  fullname: string;
  classId: number;
}

interface ClassItem {
  id: number;
  name: string;
  student?: Student[];
}

interface AbsentStudent {
  studentId: number;
  fullname: string;
  classId: number;
  remark: string;
  date: string;
}

export interface AbsentStudentReportItem {
  date: string;
  remark: string;
  callStatus: string | null;
  callTime: string | null;
  callNotes: string | null;
  studentFullName: string;
  className: string;
  phone: string;
  phone2: string | null;
  recordedBy: string;
 studentId:number
}

export interface AttendanceState {
  loading: boolean;
  saving: boolean;
  updating: boolean;
  classList: ClassItem[];
  successMessage: string;
  errorMessage: string;
  absentStudents: AbsentStudent[];
  absentReport: AbsentStudentReportItem[];
}

const initialState: AttendanceState = {
  loading: false,
  saving: false,
  updating: false,
  classList: [],
  successMessage: "",
  errorMessage: "",
  absentStudents: [],
  absentReport: [],
};

// ✅ Fetch all class list
export const fetchClasses = createAsyncThunk(
  "attendance/fetchClasses",
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const { Access_token = null } = state.loginSlice?.data || {};

    try {
      const res = await axios.get(`${BASE_API_URL}/student/classList`, {
        headers: { Authorization: `Bearer ${Access_token}` },
      });
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

// ✅ Save class attendance
export const saveClassAttendance = createAsyncThunk(
  "attendance/saveClassAttendance",
  async (
    payload: { studentId: number; present: boolean; remark: string }[],
    { rejectWithValue, getState }
  ) => {
    const state = getState() as RootState;
    const { Access_token = null } = state.loginSlice?.data || {};

    if (!Access_token) {
      return rejectWithValue("Access token missing. Please login.");
    }

    try {
      const requests = payload.map((attend) =>
        axios.post(`${BASE_API_URL}/student/createattendance`, attend, {
          headers: { Authorization: `Bearer ${Access_token}` },
        })
      );
      const results = await Promise.allSettled(requests);
      const failed = results.filter((res) => res.status === "rejected");
      if (failed.length > 0) {
        throw new Error("Some attendance records failed to save.");
      }
      return "Attendance saved successfully!";
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

// ✅ Fetch absent students by date
export const fetchAbsentStudentsByDate = createAsyncThunk<
  AbsentStudent[],
  string,
  { rejectValue: string; state: RootState }
>(
  "attendance/fetchAbsentStudentsByDate",
  async (date, { rejectWithValue, getState }) => {
    const state = getState();
    const { Access_token = null } = state.loginSlice?.data || {};

    try {
      const res = await axios.get(`${BASE_API_URL}/student/attendance/absent`, {
        params: { date },
        headers: { Authorization: `Bearer ${Access_token}` },
      });
      return res.data.absentStudents || [];
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

// ✅ Fetch detailed absent report
export const fetchAbsentReport = createAsyncThunk<
  AbsentStudentReportItem[],
  { startDate?: string; endDate?: string },
  { rejectValue: string; state: RootState }
>(
  "attendance/fetchAbsentReport",
  async ({ startDate, endDate }, { rejectWithValue, getState }) => {
    const state = getState();
    const { Access_token = null } = state.loginSlice?.data || {};

    try {
      const res = await axios.get(`${BASE_API_URL}/student/attendance/report`, {
        params: { startDate, endDate },
        headers: { Authorization: `Bearer ${Access_token}` },
      });
      return res.data.report || [];
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

// ✅ Update absent record call info
export const updateAbsentRecord = createAsyncThunk<
  string,
  {
    studentId: number;
    date: string;
    callTime?: string;
    callStatus: string;
    callNotes?: string;
  },
  { rejectValue: string; state: RootState }
>(
  "attendance/updateAbsentRecord",
  async (payload, { rejectWithValue, getState }) => {
    const state = getState();
    const { Access_token = null } = state.loginSlice?.data || {};

    try {
      await axios.put(`${BASE_API_URL}/student/call-info`, payload, {
        headers: { Authorization: `Bearer ${Access_token}` },
      });
      return "Absent record updated successfully!";
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

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    clearAttendanceState: (state) => {
      state.loading = false;
      state.saving = false;
      state.updating = false;
      state.successMessage = "";
      state.errorMessage = "";
      state.absentReport = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classList = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload as string;
      })

      .addCase(saveClassAttendance.pending, (state) => {
        state.saving = true;
        state.successMessage = "";
        state.errorMessage = "";
      })
      .addCase(saveClassAttendance.fulfilled, (state, action) => {
        state.saving = false;
        state.successMessage = action.payload as string;
      })
      .addCase(saveClassAttendance.rejected, (state, action) => {
        state.saving = false;
        state.errorMessage = action.payload as string;
      })

      .addCase(fetchAbsentStudentsByDate.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(fetchAbsentStudentsByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.absentStudents = action.payload;
      })
      .addCase(fetchAbsentStudentsByDate.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload as string;
      })

      .addCase(fetchAbsentReport.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(fetchAbsentReport.fulfilled, (state, action) => {
        state.loading = false;
        state.absentReport = action.payload;
      })
      .addCase(fetchAbsentReport.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload as string;
      })

      .addCase(updateAbsentRecord.pending, (state) => {
        state.updating = true;
        state.successMessage = "";
        state.errorMessage = "";
      })
      .addCase(updateAbsentRecord.fulfilled, (state, action) => {
        state.updating = false;
        state.successMessage = action.payload;
      })
      .addCase(updateAbsentRecord.rejected, (state, action) => {
        state.updating = false;
        state.errorMessage = action.payload as string;
      });
  },
});

export const { clearAttendanceState } = attendanceSlice.actions;
export default attendanceSlice.reducer;
