// // import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// // import axios, { AxiosError } from "axios";
// // import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";
// // import { NewStudentInput, Student } from "../../types/Register";

// // interface RegisterStudentsState {
// //   loading: boolean;
// //   error: string;
// //   students: Student[];
// // }

// // const initialState: RegisterStudentsState = {
// //   loading: false,
// //   error: "",
// //   students: [],
// // };

// // export const registerStudents = createAsyncThunk<
// //   { students: Student[] },
// //   NewStudentInput[],
// //   { rejectValue: string; state: any }
// // >("students/registerMultiple", async (data, { rejectWithValue, getState }) => {
// //   const token =
// //     getState().loginSlice?.data?.Access_token ||
// //     JSON.parse(localStorage.getItem("userData") || "{}")?.token;

// //   try {
// //     const res = await axios.post(
// //       `${BASE_API_URL}/student/createMultiple`,
// //       data, // ✅ send raw array, not { students: data }
// //       {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       }
// //     );

// //     return res.data;
// //   } catch (error) {
// //     if (error instanceof AxiosError) {
// //       return rejectWithValue(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
// //     }
// //     return rejectWithValue(DEFAULT_ERROR_MESSAGE);
// //   }
// // });

// // const RegisterMultiStudentsSlice = createSlice({
// //   name: "registerStudents",
// //   initialState,
// //   reducers: {
// //     clearMultiStudentState: (state) => {
// //       state.loading = false;
// //       state.error = "";
// //       state.students = [];
// //     },
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(registerStudents.pending, (state) => {
// //         state.loading = true;
// //         state.error = "";
// //       })
// //       .addCase(registerStudents.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.students = action.payload.students;
// //       })
// //       .addCase(registerStudents.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload || "Failed to register students.";
// //       });
// //   },
// // });

// // export const { clearMultiStudentState } = RegisterMultiStudentsSlice.actions;
// // export default RegisterMultiStudentsSlice.reducer;
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios, { AxiosError } from "axios";
// import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";
// import { NewStudentInput, Student } from "../../types/Register";

// interface RegisterStudentsState {
//   loading: boolean;
//   error: string;
//   students: Student[];
// }

// const initialState: RegisterStudentsState = {
//   loading: false,
//   error: "",
//   students: [],
// };

// // 🔥 Improved: safe token retrieval
// const getAccessToken = (state: any) => {
//   const tokenFromState = state?.loginSlice?.data?.Access_token;
//   const tokenFromStorage = JSON.parse(localStorage.getItem("userData") || "{}")?.Access_token;
//   return tokenFromState || tokenFromStorage || null;
// };

// // 🔥 Register Multiple Students
// export const registerStudents = createAsyncThunk<
//   { students: Student[] }, 
//   NewStudentInput[], 
//   { rejectValue: string; state: any }
// >(
//   "students/registerMultiple",
//   async (data, { rejectWithValue, getState }) => {
//     const token = getAccessToken(getState());

//     if (!token) {
//       return rejectWithValue("Authentication token is missing");
//     }

//     try {
//       const response = await axios.post(
//         `${BASE_API_URL}/student/createMultiple`,
//         data,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       return response.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return rejectWithValue(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
//       }
//       return rejectWithValue(DEFAULT_ERROR_MESSAGE);
//     }
//   }
// );

// const RegisterMultiStudentsSlice = createSlice({
//   name: "registerStudents",
//   initialState,
//   reducers: {
//     clearMultiStudentState: (state) => {
//       state.loading = false;
//       state.error = "";
//       state.students = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(registerStudents.pending, (state) => {
//         state.loading = true;
//         state.error = "";
//       })
//       .addCase(registerStudents.fulfilled, (state, action) => {
//         state.loading = false;
//         state.students = action.payload.students;
//         state.error = "";
//       })
//       .addCase(registerStudents.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to register students.";
//       });
//   },
// });

// export const { clearMultiStudentState } = RegisterMultiStudentsSlice.actions;
// export default RegisterMultiStudentsSlice.reducer;
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios, { AxiosError } from "axios";
// import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";
// import { NewStudentInput, Student } from "../../types/Register";

// interface RegisterStudentsState {
//   loading: boolean;
//   error: string;
//   students: Student[];
// }

// const initialState: RegisterStudentsState = {
//   loading: false,
//   error: "",
//   students: [],
// };

// export const registerStudents = createAsyncThunk<
//   { students: Student[] },
//   NewStudentInput[],
//   { rejectValue: string; state: any }
// >("students/registerMultiple", async (data, { rejectWithValue, getState }) => {
//   const token =
//     getState().loginSlice?.data?.Access_token ||
//     JSON.parse(localStorage.getItem("userData") || "{}")?.token;

//   try {
//     const res = await axios.post(
//       `${BASE_API_URL}/student/createMultiple`,
//       data, // ✅ send raw array, not { students: data }
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return res.data;
//   } catch (error) {
//     if (error instanceof AxiosError) {
//       return rejectWithValue(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
//     }
//     return rejectWithValue(DEFAULT_ERROR_MESSAGE);
//   }
// });

// const RegisterMultiStudentsSlice = createSlice({
//   name: "registerStudents",
//   initialState,
//   reducers: {
//     clearMultiStudentState: (state) => {
//       state.loading = false;
//       state.error = "";
//       state.students = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(registerStudents.pending, (state) => {
//         state.loading = true;
//         state.error = "";
//       })
//       .addCase(registerStudents.fulfilled, (state, action) => {
//         state.loading = false;
//         state.students = action.payload.students;
//       })
//       .addCase(registerStudents.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to register students.";
//       });
//   },
// });

// export const { clearMultiStudentState } = RegisterMultiStudentsSlice.actions;
// export default RegisterMultiStudentsSlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";
import { NewStudentInput, Student } from "../../types/Register";

interface RegisterStudentsState {
  loading: boolean;
  error: string;
  students: Student[];
}

const initialState: RegisterStudentsState = {
  loading: false,
  error: "",
  students: [],
};

// 🔥 Improved: safe token retrieval
const getAccessToken = (state: any) => {
  const tokenFromState = state?.loginSlice?.data?.Access_token;
  const tokenFromStorage = JSON.parse(localStorage.getItem("userData") || "{}")?.Access_token;
  return tokenFromState || tokenFromStorage || null;
};

// 🔥 Register Multiple Students
export const registerStudents = createAsyncThunk<
  { students: Student[] }, 
  NewStudentInput[], 
  { rejectValue: string; state: any }
>(
  "students/registerMultiple",
  async (data, { rejectWithValue, getState }) => {
    const token = getAccessToken(getState());

    if (!token) {
      return rejectWithValue("Authentication token is missing");
    }

    try {
      const response = await axios.post(
        `${BASE_API_URL}/student/createMultiple`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

const RegisterMultiStudentsSlice = createSlice({
  name: "registerStudents",
  initialState,
  reducers: {
    clearMultiStudentState: (state) => {
      state.loading = false;
      state.error = "";
      state.students = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerStudents.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(registerStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.students;
        state.error = "";
      })
      .addCase(registerStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to register students.";
      });
  },
});

export const { clearMultiStudentState } = RegisterMultiStudentsSlice.actions;
export default RegisterMultiStudentsSlice.reducer;
