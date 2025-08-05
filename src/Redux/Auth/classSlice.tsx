// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios, { AxiosError } from "axios";
// import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// export interface Class {
//   id: string;
//   name: string;
//   userid: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface ClassState {
//   loading: boolean;
//   classes: Class[];
//   error: string;
// }

// const initialState: ClassState = {
//   loading: false,
//   classes: [],
//   error: "",
// };

// // 🔹 Create a New Class
// export const createClass = createAsyncThunk(
//   "classes/createClass",
//   async (data: { name: string }, { rejectWithValue, getState }) => {
//     const state: any = getState();
//     const { Access_token = null } = state?.loginSlice?.data || {};

//     try {
//       const res = await axios.post(`${BASE_API_URL}/student/createclass`, data, {
//         headers: { Authorization: `Bearer ${Access_token}` },
//       });
//       return res.data.class;
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

// const classSlice = createSlice({
//   name: "classes",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(createClass.pending, (state) => {
//       state.loading = true;
//       state.error = "";
//     });
//     builder.addCase(createClass.fulfilled, (state, action) => {
//       state.loading = false;
//       state.classes.push(action.payload);
//     });
//     builder.addCase(createClass.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });
//   },
// });

// export default classSlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// ------------------ Types ------------------
export interface Class {
  id: string;
  name: string;
  userid: string;
  createdAt: string;
  updatedAt: string;
}

export interface FreeStudent {
  id: number;
  fullname: string;
  phone: string;
  classes: {
    name: string;
  };
  registeredBy: {
    id: number;
    fullName: string;
    email: string;
  };
}

interface ClassState {
  loading: boolean;
  classes: Class[];
  error: string;
  freeStudents: FreeStudent[];
  standardizeStatus: string;
}

// ------------------ Initial State ------------------
const initialState: ClassState = {
  loading: false,
  classes: [],
  error: "",
  freeStudents: [],
  standardizeStatus: "",
};

// ------------------ Create Class ------------------
export const createClass = createAsyncThunk(
  "classSlice/createClass",
  async (data: { name: string }, { rejectWithValue, getState }) => {
    const state: any = getState();
    const { Access_token = null } = state?.loginSlice?.data || {};

    try {
      const res = await axios.post(`${BASE_API_URL}/student/createclass`, data, {
        headers: { Authorization: `Bearer ${Access_token}` },
      });
      return res.data.class;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

// ------------------ Get Free Students ------------------
export const getFreeStudents = createAsyncThunk(
  "classSlice/getFreeStudents",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/student/free-students`);
      return res.data.students;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

// ------------------ Standardize Gender ------------------
export const standardizeStudentGender = createAsyncThunk(
  "classSlice/standardizeGender",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_API_URL}/student/standardize-gender`);
      return res.data.message;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

// ------------------ Slice ------------------
const classSlice = createSlice({
  name: "classSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create Class
    builder.addCase(createClass.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(createClass.fulfilled, (state, action) => {
      state.loading = false;
      state.classes.push(action.payload);
    });
    builder.addCase(createClass.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get Free Students
    builder.addCase(getFreeStudents.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(getFreeStudents.fulfilled, (state, action) => {
      state.loading = false;
      state.freeStudents = action.payload;
    });
    builder.addCase(getFreeStudents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Standardize Gender
    builder.addCase(standardizeStudentGender.pending, (state) => {
      state.loading = true;
      state.error = "";
      state.standardizeStatus = "";
    });
    builder.addCase(standardizeStudentGender.fulfilled, (state, action) => {
      state.loading = false;
      state.standardizeStatus = action.payload;
    });
    builder.addCase(standardizeStudentGender.rejected, (state, action) => {
      state.loading = false;
      state.standardizeStatus = "";
      state.error = action.payload as string;
    });
  },
});

export default classSlice.reducer;
