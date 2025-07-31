import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { RootState } from "../../Redux/store";
import { BASE_API_URL } from "../../Constant";

// TYPES
export interface BusDriver {
  id: number;
  fullName: string;
  salary: number;
  jobTitle: string; // 👈 Add this
}

export interface StudentInBus {
  id: number;
  fullname: string;
  classId?: number;
}

export interface Bus {
  id: number;
  name: string;
  route: string;
  plate: string;
  type: string;
  color: string;
  seats: number;
  capacity: number;
  driverId?: number;
  driver?: BusDriver;
  students?: StudentInBus[];
}

export interface BusFeeStudent {
  id: number;
  fullname: string;
  phone: string;
  fee: number;
  bus: string;
  FreeReason: string;
  classId: number;
  classes: { name: string };
  totalFee: number;
  schoolFee: number;
  busFee: number;
}

export interface BusFeeSummaryStudent {
  id: number;
  name: string;
  district: string;
  totalFee: number;
  schoolFee: number;
  expectedBusFee: number;
  actualBusFeeCollected: number;
  unpaidBusFee: number;
}

export interface BusSummary {
  busId: number;
  name: string;
  route: string;
  plate: string;
  driver: BusDriver | null;
  studentCount: number;
  totalBusFeeCollected: number;
  expectedBusIncome: number;
  collectionGap: number;
  status: "Profit" | "Shortage";
  profitOrLossAmount: number;
  students: BusFeeSummaryStudent[];
}

export interface BusFeeSummary {
  success: boolean;
  month: number;
  year: number;
  totalBuses: number;
  totalStudentsWithBus: number;
  totalBusFeeCollected: number;
  expectedBusIncome: number;
  busFeeCollectionGap: number;
  totalBusSalary: number;
  profitOrLoss: number;
  busSummaries: BusSummary[];
}

export interface BusFeeState {
  students: BusFeeStudent[];
  buses: Bus[];
  summary: BusFeeSummary | null;
  drivers: BusDriver[]; // <-- ADD THIS
  loading: boolean;
  error: string | null;
}

const initialState: BusFeeState = {
  students: [],
  buses: [],
  summary: null,
  drivers: [], // <-- ADD THIS
  loading: false,
  error: null,
};

// INITIAL STATE
// const initialState: BusFeeState = {
//   students: [],
//   buses: [],
//   summary: null,
//   loading: false,
//   error: null,
// };

// UTILS
const handleAxiosError = (error: unknown): string => {
  const axiosError = error as AxiosError<{ message: string }>;
  return axiosError?.response?.data?.message || "Unexpected error occurred";
};

// ASYNC THUNKS
export const fetchBusFeeExemptions = createAsyncThunk<
  BusFeeStudent[],
  void,
  { rejectValue: string }
>("busFee/fetchBusFeeExemptions", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(
      `${BASE_API_URL}/student/students/with-bus/Zero`
    );
    return res.data.students;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const updateFreeReason = createAsyncThunk<
  { id: number; FreeReason: string },
  { id: number; FreeReason: string },
  { rejectValue: string }
>(
  "busFee/updateFreeReason",
  async ({ id, FreeReason }, { rejectWithValue }) => {
    try {
      await axios.put(`${BASE_API_URL}/fee/students/update-reason`, {
        id,
        FreeReason,
      });
      return { id, FreeReason };
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

export const fetchAllBuses = createAsyncThunk<
  Bus[],
  void,
  { rejectValue: string }
>("busFee/fetchAllBuses", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${BASE_API_URL}/Bus/bus`);
    return res.data.buses;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const createBus = createAsyncThunk<
  Bus,
  Partial<Bus>,
  { rejectValue: string }
>("busFee/createBus", async (busData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${BASE_API_URL}/Bus/bus`, busData);
    return res.data.bus;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const updateBus = createAsyncThunk<
  Bus,
  { id: number; data: Partial<Bus> },
  { rejectValue: string }
>("busFee/updateBus", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${BASE_API_URL}/Bus/bus/${id}`, data);
    return res.data.bus;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const deleteBus = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("busFee/deleteBus", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_API_URL}/Bus/bus/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const assignStudentToBus = createAsyncThunk<
  StudentInBus,
  { studentId: number; busId: number },
  { rejectValue: string }
>(
  "busFee/assignStudentToBus",
  async ({ studentId, busId }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_API_URL}/Bus/assign-bus`, {
        studentId,
        busId,
      });
      return res.data.student;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

export const fetchBusSalaryAndFeeSummary = createAsyncThunk<
  BusFeeSummary,
  { month: number; year: number },
  { rejectValue: string }
>(
  "busFee/fetchBusSalaryAndFeeSummary",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_API_URL}/bus/bus-summary?month=${month}&year=${year}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);
export const fetchBusDriversOnly = createAsyncThunk<
  BusDriver[],
  void,
  { rejectValue: string }
>("busFee/fetchBusDriversOnly", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${BASE_API_URL}/Bus/employees/bus`);
    return res.data.employees; // ✅ FIXED: Extract only the array
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

// SLICE
const busFeeSlice = createSlice({
  name: "busFee",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Exemptions
      .addCase(fetchBusFeeExemptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBusFeeExemptions.fulfilled,
        (state, action: PayloadAction<BusFeeStudent[]>) => {
          state.loading = false;
          state.students = action.payload;
        }
      )
      .addCase(fetchBusFeeExemptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      // Update Free Reason
      .addCase(updateFreeReason.fulfilled, (state, action) => {
        const { id, FreeReason } = action.payload;
        const student = state.students.find((s) => s.id === id);
        if (student) student.FreeReason = FreeReason;
      })

      // Buses
      .addCase(
        fetchAllBuses.fulfilled,
        (state, action: PayloadAction<Bus[]>) => {
          state.buses = action.payload;
        }
      )
      .addCase(createBus.fulfilled, (state, action: PayloadAction<Bus>) => {
        state.buses.push(action.payload);
      })
      .addCase(updateBus.fulfilled, (state, action: PayloadAction<Bus>) => {
        const index = state.buses.findIndex(
          (bus) => bus.id === action.payload.id
        );
        if (index !== -1) state.buses[index] = action.payload;
      })
      .addCase(deleteBus.fulfilled, (state, action: PayloadAction<number>) => {
        state.buses = state.buses.filter((bus) => bus.id !== action.payload);
      })
      .addCase(
        fetchBusDriversOnly.fulfilled,
        (state, action: PayloadAction<BusDriver[]>) => {
          state.drivers = action.payload;
        }
      )

      // Salary + Fee Summary
      .addCase(
        fetchBusSalaryAndFeeSummary.fulfilled,
        (state, action: PayloadAction<BusFeeSummary>) => {
          state.summary = action.payload;
        }
      );
  },
});

// EXPORT
export default busFeeSlice.reducer;
export const selectBusFeeStudents = (state: RootState) => state.busFee;
