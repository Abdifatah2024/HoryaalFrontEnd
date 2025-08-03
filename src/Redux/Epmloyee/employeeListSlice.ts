// src/redux/Epmloyee/employeeSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Employee } from "../../pages/Employee/types";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "@/Constant";

// 🔁 Submit (Create) Employee
export const submitEmployee = createAsyncThunk(
  "employee/submit",
  async (data: Employee, { rejectWithValue }) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.post(
        `${BASE_API_URL}/employee/create`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || DEFAULT_ERROR_MESSAGE
        );
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

// 🔁 Fetch All Employees
export const fetchEmployees = createAsyncThunk(
  "employee/fetchAll",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.get(`${BASE_API_URL}/user/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.employees;
    } catch (error: any) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || DEFAULT_ERROR_MESSAGE
        );
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

// ✅ State Interface
interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  success: false,
  error: null,
};

// ✅ Slice
const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    resetEmployeeState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Create Employee
      .addCase(submitEmployee.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitEmployee.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get All Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetEmployeeState } = employeeSlice.actions;
export default employeeSlice.reducer;
