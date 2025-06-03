// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { Employee } from "../../pages/Employee/types";
// import {
//   createEmployee,
//   deleteEmployeeById,
//   fetchEmployeeById,
//   updateEmployeeAPI,
// } from "../../pages/Employee/employeeAPI";

// interface EmployeeState {
//   employee: Employee | null;
//   loading: boolean;
//   error: string | null;
//   success: boolean;
// }

// const initialState: EmployeeState = {
//   employee: null,
//   loading: false,
//   error: null,
//   success: false,
// };

// // Create
// export const submitEmployee = createAsyncThunk(
//   "employee/submit",
//   async (data: Employee, { rejectWithValue }) => {
//     try {
//       return await createEmployee(data);
//     } catch (err: any) {
//       return rejectWithValue(err?.response?.data?.message || "Create failed");
//     }
//   }
// );

// // Fetch by ID
// export const getEmployeeById = createAsyncThunk(
//   "employee/fetchById",
//   async (id: string, { rejectWithValue }) => {
//     try {
//       const result = await fetchEmployeeById(id);
//       return result.employee; // assuming response is { employee }
//     } catch (err: any) {
//       return rejectWithValue(err?.response?.data?.message || "Fetch failed");
//     }
//   }
// );

// // Update
// export const updateEmployee = createAsyncThunk(
//   "employee/update",
//   async (data: Employee, { rejectWithValue }) => {
//     try {
//       return await updateEmployeeAPI(data);
//     } catch (err: any) {
//       return rejectWithValue(err?.response?.data?.message || "Update failed");
//     }
//   }
// );

// // Delete
// export const deleteEmployee = createAsyncThunk(
//   "employee/delete",
//   async (id: string, { rejectWithValue }) => {
//     try {
//       return await deleteEmployeeById(id);
//     } catch (err: any) {
//       return rejectWithValue(err?.response?.data?.message || "Delete failed");
//     }
//   }
// );

// const employeeSlice = createSlice({
//   name: "employee",
//   initialState,
//   reducers: {
//     resetEmployeeState: (state) => {
//       state.employee = null;
//       state.loading = false;
//       state.error = null;
//       state.success = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Submit
//       .addCase(submitEmployee.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(submitEmployee.fulfilled, (state) => {
//         state.loading = false;
//         state.success = true;
//       })
//       .addCase(submitEmployee.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Get
//       .addCase(getEmployeeById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.employee = null;
//       })
//       .addCase(getEmployeeById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.employee = action.payload;
//       })
//       .addCase(getEmployeeById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Update
//       .addCase(updateEmployee.pending, (state) => {
//         state.loading = true;
//         state.success = false;
//         state.error = null;
//       })
//       .addCase(updateEmployee.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = true;
//         state.employee = action.payload;
//       })
//       .addCase(updateEmployee.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // ✅ Delete
//       .addCase(deleteEmployee.pending, (state) => {
//         state.loading = true;
//         state.success = false;
//         state.error = null;
//       })
//       .addCase(deleteEmployee.fulfilled, (state) => {
//         state.loading = false;
//         state.success = true;
//         state.employee = null;
//       })
//       .addCase(deleteEmployee.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { resetEmployeeState } = employeeSlice.actions;
// export default employeeSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Employee } from "../../pages/Employee/types";
import {
  createEmployee,
  deleteEmployeeById,
  fetchEmployeeById,
  updateEmployeeAPI,
  updateStudentParent,
} from "../../pages/Employee/employeeAPI";

interface Parent {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
}

interface Student {
  id: number;
  parentUserId: number | null;
}

interface UpdateParentResponse {
  message: string;
  student: Student;
  parentUser: Parent;
}

interface EmployeeState {
  employee: Employee | null;
  studentParentData: UpdateParentResponse | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: EmployeeState = {
  employee: null,
  studentParentData: null,
  loading: false,
  error: null,
  success: false,
};

// -------------------- Thunks --------------------

// Employee CRUD
export const submitEmployee = createAsyncThunk(
  "employee/submit",
  async (data: Employee, { rejectWithValue }) => {
    try {
      return await createEmployee(data);
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Create failed");
    }
  }
);

export const getEmployeeById = createAsyncThunk(
  "employee/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const result = await fetchEmployeeById(id);
      return result.employee;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Fetch failed");
    }
  }
);

export const updateEmployee = createAsyncThunk(
  "employee/update",
  async (data: Employee, { rejectWithValue }) => {
    try {
      return await updateEmployeeAPI(data);
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Update failed");
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  "employee/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteEmployeeById(id);
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Delete failed");
    }
  }
);

// Link Student to Parent
export const linkStudentToParent = createAsyncThunk(
  "employee/linkStudentToParent",
  async (
    { studentId, parentPhone }: { studentId: number; parentPhone: string },
    { rejectWithValue }
  ) => {
    try {
      return await updateStudentParent(studentId, parentPhone);
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Link failed");
    }
  }
);

// -------------------- Slice --------------------

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    resetEmployeeState: (state) => {
      state.employee = null;
      state.studentParentData = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(submitEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitEmployee.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch
      .addCase(getEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.employee = null;
      })
      .addCase(getEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload;
      })
      .addCase(getEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.employee = action.payload;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.employee = null;
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Link Student to Parent
      .addCase(linkStudentToParent.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(linkStudentToParent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.studentParentData = action.payload;
      })
      .addCase(linkStudentToParent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetEmployeeState } = employeeSlice.actions;
export default employeeSlice.reducer;
