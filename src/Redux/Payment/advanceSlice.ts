import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

interface Employee {
  id: number;
  fullName: string;
  phone: string;
}

interface Advance {
  id: number;
  employeeId: number;
  amount: number;
  reason: string;
  dateIssued: string;
  month: number;
  year: number;
  createdById: number;
  employee: Employee;
  createdBy: { fullName: string };
}

// interface AdvanceSummary {
//   employeeName: string;
//   totalAdvance: number;
//   numberOfAdvances: number;
// }
interface AdvanceSummary {
  totalAdvance: number;
  advancesBy: string;
  employee: {
    name: string;
    phone: string;
    numberOfAdvances: number; // 👈 her
  };
}

interface State {
  advances: Advance[];
  summary1: AdvanceSummary | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  employeeVerification: {
    loading: boolean;
    data: Employee | null;
    error: string | null;
  };
}

const initialState: State = {
  advances: [],
  summary1: null,
  loading: false,
  error: null,
  totalCount: 0,
  employeeVerification: {
    loading: false,
    data: null,
    error: null,
  },
};

const getToken = () => {
  const data = localStorage.getItem("userData");
  return data ? JSON.parse(data).Access_token : null;
};

// Async Thunks
export const getAllAdvances = createAsyncThunk(
  "advance/getAll",
  async (filters: any, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.get(
        `${BASE_API_URL}/EmployeeAdvance/employee-advances`,
        {
          params: filters,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err.response?.data || DEFAULT_ERROR_MESSAGE);
    }
  }
);

export const verifyEmployee = createAsyncThunk(
  "advance/verifyEmployee",
  async (employeeId: number, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.get(
        `${BASE_API_URL}/user/employees/${employeeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err.response?.data || DEFAULT_ERROR_MESSAGE);
    }
  }
);

export const createAdvance = createAsyncThunk(
  "advance/create",
  async (
    data: Omit<
      Advance,
      "id" | "dateIssued" | "employee" | "createdBy" | "createdById"
    >,
    { rejectWithValue }
  ) => {
    try {
      const token = getToken();
      const res = await axios.post(
        `${BASE_API_URL}/EmployeeAdvance/employees/${data.employeeId}/advance-and-update-income`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err.response?.data || DEFAULT_ERROR_MESSAGE);
    }
  }
);

export const updateAdvance = createAsyncThunk(
  "advance/update",
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.put(
        `${BASE_API_URL}/EmployeeAdvance/employee-advances/${id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err.response?.data || DEFAULT_ERROR_MESSAGE);
    }
  }
);

export const deleteAdvance = createAsyncThunk(
  "advance/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const token = getToken();
      await axios.delete(
        `${BASE_API_URL}/EmployeeAdvance/employee-advances/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return id;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err.response?.data || DEFAULT_ERROR_MESSAGE);
    }
  }
);

const advanceSlice = createSlice({
  name: "advance",
  initialState,
  reducers: {
    clearEmployeeVerification: (state) => {
      state.employeeVerification = initialState.employeeVerification;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Advances
      .addCase(getAllAdvances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAdvances.fulfilled, (state, action) => {
        state.loading = false;
        state.advances = action.payload.advances;
        state.summary1 = action.payload.summary1;
        state.totalCount = action.payload.count;
      })
      .addCase(getAllAdvances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Verify Employee
      .addCase(verifyEmployee.pending, (state) => {
        state.employeeVerification.loading = true;
        state.employeeVerification.error = null;
      })
      .addCase(verifyEmployee.fulfilled, (state, action) => {
        state.employeeVerification.loading = false;
        state.employeeVerification.data = action.payload;
      })
      .addCase(verifyEmployee.rejected, (state, action) => {
        state.employeeVerification.loading = false;
        state.employeeVerification.error = action.payload as string;
        state.employeeVerification.data = null;
      })

      // Create Advance
      .addCase(createAdvance.fulfilled, (state, action) => {
        state.advances.unshift(action.payload);
        state.totalCount += 1;
        state.employeeVerification = initialState.employeeVerification;
      })

      // Update Advance
      .addCase(updateAdvance.fulfilled, (state, action) => {
        const index = state.advances.findIndex(
          (a) => a.id === action.payload.id
        );
        if (index !== -1) state.advances[index] = action.payload;
      })

      // Delete Advance
      .addCase(deleteAdvance.fulfilled, (state, action) => {
        state.advances = state.advances.filter((a) => a.id !== action.payload);
        state.totalCount -= 1;
        if (state.summary1) {
          state.summary1.totalAdvance = state.advances.reduce(
            (sum, adv) => sum + adv.amount,
            0
          );
          state.summary1.employee.numberOfAdvances = state.advances.length;
        }
      });
  },
});

export const { clearEmployeeVerification } = advanceSlice.actions;
export default advanceSlice.reducer;
