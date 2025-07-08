// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../../Constant";

// // ✅ Asset type
// export interface Asset {
//   id: number;
//   name: string;
//   category: string;
//   purchaseDate: string;
//   purchasePrice: number;
//   depreciationRate: number;
//   currentValue: number;
//   purchaseCompany: string;
//   condition: string;
//   location: string;
//   assignedTo: string;
//   serialNumber: string;
//   remarks: string;
//   createdAt: string;
//   updatedAt?: string; // optional
// }

// // ✅ Payload type
// export type AssetPayload = {
//   name: string;
//   category: string;
//   purchaseDate: string;
//   purchasePrice: number;
//   depreciationRate: number;
//   currentValue: number;
//   purchaseCompany: string;
//   condition: string;
//   location: string;
//   assignedTo: string;
//   serialNumber: string;
//   remarks: string;
// };

// // ✅ State
// interface AssetState {
//   assets: Asset[];
//   singleAsset: Asset | null;
//   loading: boolean;
//   error: string | null;
//   successMessage: string | null;
// }

// // ✅ Initial State
// const initialState: AssetState = {
//   assets: [],
//   singleAsset: null,
//   loading: false,
//   error: null,
//   successMessage: null,
// };

// // ✅ Create Asset
// export const createAsset = createAsyncThunk(
//   "assets/create",
//   async (data: AssetPayload, { rejectWithValue }) => {
//     try {
//       const res = await axios.post(`${BASE_API_URL}/Asset/assets`, data);
//       return res.data as Asset;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || DEFAULT_ERROR_MESSAGE
//       );
//     }
//   }
// );

// // ✅ Get All Assets
// export const fetchAssets = createAsyncThunk(
//   "assets/fetchAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE_API_URL}/Asset/assets`);
//       return res.data as Asset[];
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || DEFAULT_ERROR_MESSAGE
//       );
//     }
//   }
// );

// // ✅ Get Single Asset
// export const fetchAssetById = createAsyncThunk(
//   "assets/fetchById",
//   async (id: number, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE_API_URL}/Asset/assets/${id}`);
//       return res.data as Asset;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || DEFAULT_ERROR_MESSAGE
//       );
//     }
//   }
// );

// // ✅ Update Asset
// export const updateAsset = createAsyncThunk(
//   "assets/update",
//   async (
//     { id, data }: { id: number; data: Partial<AssetPayload> },
//     { rejectWithValue }
//   ) => {
//     try {
//       const res = await axios.put(`${BASE_API_URL}/Asset/assets/${id}`, data);
//       return res.data as Asset;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || DEFAULT_ERROR_MESSAGE
//       );
//     }
//   }
// );

// // ✅ Delete Asset
// export const deleteAsset = createAsyncThunk(
//   "assets/delete",
//   async (id: number, { rejectWithValue }) => {
//     try {
//       await axios.delete(`${BASE_API_URL}/Asset/assets/${id}`);
//       return id;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || DEFAULT_ERROR_MESSAGE
//       );
//     }
//   }
// );

// // ✅ Slice
// export const assetSlice = createSlice({
//   name: "assets",
//   initialState,
//   reducers: {
//     clearAssetState: (state) => {
//       state.error = null;
//       state.successMessage = null;
//       state.singleAsset = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Create
//       .addCase(createAsset.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(createAsset.fulfilled, (state, action) => {
//         state.loading = false;
//         state.assets.unshift(action.payload);
//         state.successMessage = "Asset created successfully.";
//       })
//       .addCase(createAsset.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Fetch All
//       .addCase(fetchAssets.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAssets.fulfilled, (state, action) => {
//         state.loading = false;
//         state.assets = action.payload;
//       })
//       .addCase(fetchAssets.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Fetch One
//       .addCase(fetchAssetById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.singleAsset = null;
//       })
//       .addCase(fetchAssetById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.singleAsset = action.payload;
//       })
//       .addCase(fetchAssetById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Update
//       .addCase(updateAsset.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(updateAsset.fulfilled, (state, action) => {
//         state.loading = false;
//         state.successMessage = "Asset updated successfully.";
//         state.assets = state.assets.map((a) =>
//           a.id === action.payload.id ? action.payload : a
//         );
//         state.singleAsset = action.payload;
//       })
//       .addCase(updateAsset.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Delete
//       .addCase(deleteAsset.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(deleteAsset.fulfilled, (state, action) => {
//         state.loading = false;
//         state.successMessage = "Asset deleted successfully.";
//         state.assets = state.assets.filter((a) => a.id !== action.payload);
//       })
//       .addCase(deleteAsset.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearAssetState } = assetSlice.actions;

// export default assetSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../../Constant";

// ✅ Asset type
export interface Asset {
  id: number;
  name: string;
  category: string;
  purchaseDate: string;
  purchasePrice: number;
  depreciationRate: number;
  currentValue: number;
  purchaseCompany: string;
  condition: string;
  location: string;
  assignedTo: string;
  serialNumber: string;
  remarks: string;
  createdAt: string;
  updatedAt?: string;
}

// ✅ Asset Report type
export interface AssetReport {
  generatedAt: string;
  totalAssets: number;
  totalPurchaseValue: number;
  totalCurrentValue: number;
  byCategory: Record<string, number>;
  byCondition: Record<string, number>;
  topValuable: {
    id: number;
    name: string;
    category: string;
    purchaseDate: string;
    purchasePrice: number;
    currentValue: number;
    condition: string;
    location: string;
  }[];
}

// ✅ Payload type
export type AssetPayload = {
  name: string;
  category: string;
  purchaseDate: string;
  purchasePrice: number;
  depreciationRate: number;
  currentValue: number;
  purchaseCompany: string;
  condition: string;
  location: string;
  assignedTo: string;
  serialNumber: string;
  remarks: string;
};

// ✅ State
interface AssetState {
  assets: Asset[];
  singleAsset: Asset | null;
  report: AssetReport | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

// ✅ Initial State
const initialState: AssetState = {
  assets: [],
  singleAsset: null,
  report: null,
  loading: false,
  error: null,
  successMessage: null,
};

// ✅ Create Asset
export const createAsset = createAsyncThunk(
  "assets/create",
  async (data: AssetPayload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_API_URL}/Asset/assets`, data);
      return res.data as Asset;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

// ✅ Get All Assets
export const fetchAssets = createAsyncThunk(
  "assets/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/Asset/assets`);
      return res.data as Asset[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

// ✅ Get Single Asset
export const fetchAssetById = createAsyncThunk(
  "assets/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/Asset/assets/${id}`);
      return res.data as Asset;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

// ✅ Update Asset
export const updateAsset = createAsyncThunk(
  "assets/update",
  async (
    { id, data }: { id: number; data: Partial<AssetPayload> },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.put(`${BASE_API_URL}/Asset/assets/${id}`, data);
      return res.data as Asset;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

// ✅ Delete Asset
export const deleteAsset = createAsyncThunk(
  "assets/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_API_URL}/Asset/assets/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

// ✅ Fetch Asset Report
export const fetchAssetReport = createAsyncThunk(
  "assets/fetchReport",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/Asset/assets/report`);
      return res.data as AssetReport;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

// ✅ Slice
export const assetSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    clearAssetState: (state) => {
      state.error = null;
      state.successMessage = null;
      state.singleAsset = null;
      state.report = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createAsset.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createAsset.fulfilled, (state, action) => {
        state.loading = false;
        state.assets.unshift(action.payload);
        state.successMessage = "Asset created successfully.";
      })
      .addCase(createAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch All
      .addCase(fetchAssets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.loading = false;
        state.assets = action.payload;
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch One
      .addCase(fetchAssetById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.singleAsset = null;
      })
      .addCase(fetchAssetById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleAsset = action.payload;
      })
      .addCase(fetchAssetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateAsset.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateAsset.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Asset updated successfully.";
        state.assets = state.assets.map((a) =>
          a.id === action.payload.id ? action.payload : a
        );
        state.singleAsset = action.payload;
      })
      .addCase(updateAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete
      .addCase(deleteAsset.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteAsset.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Asset deleted successfully.";
        state.assets = state.assets.filter((a) => a.id !== action.payload);
      })
      .addCase(deleteAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Report
      .addCase(fetchAssetReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssetReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(fetchAssetReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAssetState } = assetSlice.actions;

export default assetSlice.reducer;
