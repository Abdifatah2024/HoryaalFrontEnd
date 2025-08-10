// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios, { AxiosError } from "axios";
// import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// // -------------------- Types --------------------
// interface MonthDue {
//   month: number;
//   year: number;
//   due: number;
// }

// interface Student {
//   studentId: number;
//   fullname: string;
//   className: string;
//   balance: number;
//   monthsDue: MonthDue[];
// }

// export interface UnpaidFamily {
//   familyName: string;
//   phones: string[];
//   totalBalance: number;
//   students: Student[];
// }

// export interface NewStudent {
//   fullname: string;
//   phone: string;
//   gender: string;
//   className: string;
// }

// interface UnpaidFamilyState {
//   loading: boolean;
//   families: UnpaidFamily[];
//   newStudents: NewStudent[];
//   error: string;
// }

// // -------------------- Initial State --------------------
// const initialState: UnpaidFamilyState = {
//   loading: false,
//   families: [],
//   newStudents: [],
//   error: "",
// };

// // -------------------- Thunks --------------------

// // ✅ Thunk: Fetch unpaid families
// export const fetchUnpaidFamilies = createAsyncThunk(
//   "unpaidFamily/fetchUnpaidFamilies",
//   async (_, { rejectWithValue, getState }) => {
//     const state: any = getState();
//     const { Access_token = null } = state?.loginSlice?.data || {};

//     try {
//       const res = await axios.get(`${BASE_API_URL}/fee/unpaid-families`, {
//         headers: { Authorization: `Bearer ${Access_token}` },
//       });

//       return res.data.families as UnpaidFamily[];
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

// // ✅ Thunk: Fetch newly registered students by date range
// export const fetchNewlyRegisteredStudents = createAsyncThunk<
//   NewStudent[],
//   { startDate: string; endDate: string },
//   { rejectValue: string }
// >(
//   "unpaidFamily/fetchNewlyRegisteredStudents",
//   async ({ startDate, endDate }, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(
//         `${BASE_API_URL}/student/students/new?startDate=${startDate}&endDate=${endDate}`
//       );

//       return res.data.students as NewStudent[];
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

// // -------------------- Slice --------------------
// const unpaidFamilySlice = createSlice({
//   name: "unpaidFamily",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Unpaid families
//       .addCase(fetchUnpaidFamilies.pending, (state) => {
//         state.loading = true;
//         state.error = "";
//       })
//       .addCase(fetchUnpaidFamilies.fulfilled, (state, action) => {
//         state.loading = false;
//         state.families = action.payload;
//       })
//       .addCase(fetchUnpaidFamilies.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Newly registered students
//       .addCase(fetchNewlyRegisteredStudents.pending, (state) => {
//         state.loading = true;
//         state.error = "";
//       })
//       .addCase(fetchNewlyRegisteredStudents.fulfilled, (state, action) => {
//         state.loading = false;
//         state.newStudents = action.payload;
//       })
//       .addCase(fetchNewlyRegisteredStudents.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export default unpaidFamilySlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// -------------------- Types --------------------
interface MonthDue {
  month: number;
  year: number;
  due: number;
}

interface Student {
  studentId: number;
  fullname: string;
  className: string;
  balance: number;
  monthsDue: MonthDue[];
}

export interface UnpaidFamily {
  familyName: string;
  phones: string[];
  totalBalance: number;
  students: Student[];
}

export interface NewStudent {
  fullname: string;
  phone: string;
  gender: string;
  address: string; // ⬅️ added
  className: string;
  createdAt?: string; // ⬅️ optional (backend can include later)
}

interface UnpaidFamilyState {
  loading: boolean;
  families: UnpaidFamily[];
  newStudents: NewStudent[];
  error: string;
}

// -------------------- Initial State --------------------
const initialState: UnpaidFamilyState = {
  loading: false,
  families: [],
  newStudents: [],
  error: "",
};

// -------------------- Thunks --------------------

// ✅ Thunk: Fetch unpaid families
export const fetchUnpaidFamilies = createAsyncThunk<
  UnpaidFamily[],
  void,
  { rejectValue: string; state: any }
>(
  "unpaidFamily/fetchUnpaidFamilies",
  async (_, { rejectWithValue, getState }) => {
    const state: any = getState();
    const { Access_token = null } = state?.loginSlice?.data || {};

    try {
      const res = await axios.get(`${BASE_API_URL}/fee/unpaid-families`, {
        headers: { Authorization: `Bearer ${Access_token}` },
      });
      return res.data.families as UnpaidFamily[];
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

// ✅ Thunk: Fetch newly registered students by date range
export const fetchNewlyRegisteredStudents = createAsyncThunk<
  NewStudent[],
  { startDate: string; endDate: string },
  { rejectValue: string; state: any }
>(
  "unpaidFamily/fetchNewlyRegisteredStudents",
  async ({ startDate, endDate }, { rejectWithValue, getState }) => {
    const state: any = getState();
    const { Access_token = null } = state?.loginSlice?.data || {};

    try {
      const res = await axios.get(`${BASE_API_URL}/student/students/new`, {
        params: { startDate, endDate },
        headers: { Authorization: `Bearer ${Access_token}` },
      });
      // expects: { students: [{ fullname, phone, gender, address, className, createdAt? }]}
      return res.data.students as NewStudent[];
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

// -------------------- Slice --------------------
const unpaidFamilySlice = createSlice({
  name: "unpaidFamily",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Unpaid families
      .addCase(fetchUnpaidFamilies.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchUnpaidFamilies.fulfilled, (state, action) => {
        state.loading = false;
        state.families = action.payload;
      })
      .addCase(fetchUnpaidFamilies.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || DEFAULT_ERROR_MESSAGE;
      })

      // Newly registered students
      .addCase(fetchNewlyRegisteredStudents.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchNewlyRegisteredStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.newStudents = action.payload;
      })
      .addCase(fetchNewlyRegisteredStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || DEFAULT_ERROR_MESSAGE;
      });
  },
});

export default unpaidFamilySlice.reducer;
