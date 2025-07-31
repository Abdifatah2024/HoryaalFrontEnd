// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import axios, { AxiosError } from "axios";
// import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../../Constant";

// // ✅ Asset model

// export interface Asset {
//   id: number;
//   assetNumber: string;
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
//   updatedAt?: string;
// }

// // ✅ Asset report type
// export interface AssetReport {
//   generatedAt: string;
//   totalAssets: number;
//   totalPurchaseValue: number;
//   totalCurrentValue: number;
//   byCategory: Record<string, number>;
//   byCondition: Record<string, number>;
//   topValuable: Pick<
//     Asset,
//     | "id"
//     | "name"
//     | "category"
//     | "purchaseDate"
//     | "purchasePrice"
//     | "currentValue"
//     | "condition"
//     | "location"
//   >[];
// }

// // ✅ Payload for creating or updating asset
// export type AssetPayload = Omit<
//   Asset,
//   "id" | "assetNumber" | "createdAt" | "updatedAt"
// >;

// // ✅ Slice state
// interface AssetState {
//   assets: Asset[];
//   singleAsset: Asset | null;
//   report: AssetReport | null;
//   loading: boolean;
//   error: string | null;
//   successMessage: string | null;
// }

// // ✅ Initial state
// const initialState: AssetState = {
//   assets: [],
//   singleAsset: null,
//   report: null,
//   loading: false,
//   error: null,
//   successMessage: null,
// };

// // ✅ Async thunk config helper
// interface RejectValue {
//   rejectValue: string;
// }

// // -----------------------------
// // ✅ ASYNC THUNKS
// // -----------------------------

// export const createAsset = createAsyncThunk<Asset, AssetPayload, RejectValue>(
//   "assets/create",
//   async (data, { rejectWithValue }) => {
//     try {
//       const res = await axios.post(`${BASE_API_URL}/Asset/assets`, data);
//       return res.data;
//     } catch (err) {
//       const error = err as AxiosError<{ message: string }>;
//       return rejectWithValue(
//         error.response?.data?.message || DEFAULT_ERROR_MESSAGE
//       );
//     }
//   }
// );

// export const fetchAssets = createAsyncThunk<Asset[], void, RejectValue>(
//   "assets/fetchAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE_API_URL}/Asset/assets`);
//       return res.data;
//     } catch (err) {
//       const error = err as AxiosError<{ message: string }>;
//       return rejectWithValue(
//         error.response?.data?.message || DEFAULT_ERROR_MESSAGE
//       );
//     }
//   }
// );

// export const fetchAssetById = createAsyncThunk<Asset, number, RejectValue>(
//   "assets/fetchById",
//   async (id, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE_API_URL}/Asset/assets/${id}`);
//       return res.data;
//     } catch (err) {
//       const error = err as AxiosError<{ message: string }>;
//       return rejectWithValue(
//         error.response?.data?.message || DEFAULT_ERROR_MESSAGE
//       );
//     }
//   }
// );

// export const fetchAssetByNumber = createAsyncThunk<Asset, string, RejectValue>(
//   "assets/fetchByNumber",
//   async (assetNumber, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(
//         `${BASE_API_URL}/Asset/number/${assetNumber}`
//       );
//       return res.data;
//     } catch (err) {
//       const error = err as AxiosError<{ message: string }>;
//       return rejectWithValue(
//         error.response?.data?.message || DEFAULT_ERROR_MESSAGE
//       );
//     }
//   }
// );

// export const updateAsset = createAsyncThunk<
//   Asset,
//   { id: number; data: Partial<AssetPayload> },
//   RejectValue
// >("assets/update", async ({ id, data }, { rejectWithValue }) => {
//   try {
//     const res = await axios.put(`${BASE_API_URL}/Asset/assets/${id}`, data);
//     return res.data;
//   } catch (err) {
//     const error = err as AxiosError<{ message: string }>;
//     return rejectWithValue(
//       error.response?.data?.message || DEFAULT_ERROR_MESSAGE
//     );
//   }
// });

// export const deleteAsset = createAsyncThunk<number, number, RejectValue>(
//   "assets/delete",
//   async (id, { rejectWithValue }) => {
//     try {
//       await axios.delete(`${BASE_API_URL}/Asset/assets/${id}`);
//       return id;
//     } catch (err) {
//       const error = err as AxiosError<{ message: string }>;
//       return rejectWithValue(
//         error.response?.data?.message || DEFAULT_ERROR_MESSAGE
//       );
//     }
//   }
// );

// export const fetchAssetReport = createAsyncThunk<
//   AssetReport,
//   void,
//   RejectValue
// >("assets/fetchReport", async (_, { rejectWithValue }) => {
//   try {
//     const res = await axios.get(`${BASE_API_URL}/Asset/assets/report`);
//     return res.data;
//   } catch (err) {
//     const error = err as AxiosError<{ message: string }>;
//     return rejectWithValue(
//       error.response?.data?.message || DEFAULT_ERROR_MESSAGE
//     );
//   }
// });

// // -----------------------------
// // ✅ SLICE
// // -----------------------------

// const assetSlice = createSlice({
//   name: "assets",
//   initialState,
//   reducers: {
//     clearAssetState: (state) => {
//       state.error = null;
//       state.successMessage = null;
//       state.singleAsset = null;
//       state.report = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createAsset.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(createAsset.fulfilled, (state, action: PayloadAction<Asset>) => {
//         state.loading = false;
//         state.assets.unshift(action.payload);
//         state.successMessage = "Asset created successfully.";
//       })
//       .addCase(createAsset.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || DEFAULT_ERROR_MESSAGE;
//       })

//       .addCase(fetchAssets.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(
//         fetchAssets.fulfilled,
//         (state, action: PayloadAction<Asset[]>) => {
//           state.loading = false;
//           state.assets = action.payload;
//         }
//       )
//       .addCase(fetchAssets.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || DEFAULT_ERROR_MESSAGE;
//       })

//       .addCase(fetchAssetById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.singleAsset = null;
//       })
//       .addCase(
//         fetchAssetById.fulfilled,
//         (state, action: PayloadAction<Asset>) => {
//           state.loading = false;
//           state.singleAsset = action.payload;
//         }
//       )
//       .addCase(fetchAssetById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || DEFAULT_ERROR_MESSAGE;
//       })

//       .addCase(fetchAssetByNumber.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.singleAsset = null;
//       })
//       .addCase(
//         fetchAssetByNumber.fulfilled,
//         (state, action: PayloadAction<Asset>) => {
//           state.loading = false;
//           state.singleAsset = action.payload;
//         }
//       )
//       .addCase(fetchAssetByNumber.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || DEFAULT_ERROR_MESSAGE;
//       })

//       .addCase(updateAsset.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(updateAsset.fulfilled, (state, action: PayloadAction<Asset>) => {
//         state.loading = false;
//         state.successMessage = "Asset updated successfully.";
//         state.assets = state.assets.map((a) =>
//           a.id === action.payload.id ? action.payload : a
//         );
//         state.singleAsset = action.payload;
//       })
//       .addCase(updateAsset.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || DEFAULT_ERROR_MESSAGE;
//       })

//       .addCase(deleteAsset.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(
//         deleteAsset.fulfilled,
//         (state, action: PayloadAction<number>) => {
//           state.loading = false;
//           state.successMessage = "Asset deleted successfully.";
//           state.assets = state.assets.filter((a) => a.id !== action.payload);
//         }
//       )
//       .addCase(deleteAsset.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || DEFAULT_ERROR_MESSAGE;
//       })

//       .addCase(fetchAssetReport.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(
//         fetchAssetReport.fulfilled,
//         (state, action: PayloadAction<AssetReport>) => {
//           state.loading = false;
//           state.report = action.payload;
//         }
//       )
//       .addCase(fetchAssetReport.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || DEFAULT_ERROR_MESSAGE;
//       });
//   },
// });

// export const { clearAssetState } = assetSlice.actions;

// export default assetSlice.reducer;
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../../Constant";

// ✅ Asset model
export interface Asset {
  id: number;
  assetNumber: string;
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

// ✅ Asset report type
export interface AssetReport {
  generatedAt: string;
  totalAssets: number;
  totalPurchaseValue: number;
  totalCurrentValue: number;
  byCategory: Record<string, number>;
  byCondition: Record<string, number>;
  topValuable: Pick<
    Asset,
    | "id"
    | "name"
    | "category"
    | "purchaseDate"
    | "purchasePrice"
    | "currentValue"
    | "condition"
    | "location"
  >[];
}

// ✅ Payload for creating or updating asset
export type AssetPayload = Omit<
  Asset,
  "id" | "assetNumber" | "createdAt" | "updatedAt"
>;

// ✅ Slice state
interface AssetState {
  assets: Asset[];
  singleAsset: Asset | null;
  report: AssetReport | null;
  newlyCreatedAsset: Asset | null; // ✅ ADDED
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

// ✅ Initial state
const initialState: AssetState = {
  assets: [],
  singleAsset: null,
  report: null,
  newlyCreatedAsset: null, // ✅ ADDED
  loading: false,
  error: null,
  successMessage: null,
};

// ✅ Async thunk config helper
interface RejectValue {
  rejectValue: string;
}

// -----------------------------
// ✅ ASYNC THUNKS
// -----------------------------

export const createAsset = createAsyncThunk<Asset, AssetPayload, RejectValue>(
  "assets/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_API_URL}/Asset/assets`, data);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

export const fetchAssets = createAsyncThunk<Asset[], void, RejectValue>(
  "assets/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/Asset/assets`);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

export const fetchAssetById = createAsyncThunk<Asset, number, RejectValue>(
  "assets/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/Asset/assets/${id}`);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

export const fetchAssetByNumber = createAsyncThunk<Asset, string, RejectValue>(
  "assets/fetchByNumber",
  async (assetNumber, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_API_URL}/Asset/number/${assetNumber}`
      );
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

export const updateAsset = createAsyncThunk<
  Asset,
  { id: number; data: Partial<AssetPayload> },
  RejectValue
>("assets/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${BASE_API_URL}/Asset/assets/${id}`, data);
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || DEFAULT_ERROR_MESSAGE
    );
  }
});

export const deleteAsset = createAsyncThunk<number, number, RejectValue>(
  "assets/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_API_URL}/Asset/assets/${id}`);
      return id;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || DEFAULT_ERROR_MESSAGE
      );
    }
  }
);

export const fetchAssetReport = createAsyncThunk<
  AssetReport,
  void,
  RejectValue
>("assets/fetchReport", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${BASE_API_URL}/Asset/assets/report`);
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || DEFAULT_ERROR_MESSAGE
    );
  }
});

// -----------------------------
// ✅ SLICE
// -----------------------------

const assetSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    clearAssetState: (state) => {
      state.error = null;
      state.successMessage = null;
      state.singleAsset = null;
      state.report = null;
      state.newlyCreatedAsset = null; // ✅ RESET ON CLEAR
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAsset.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
        state.newlyCreatedAsset = null;
      })
      .addCase(createAsset.fulfilled, (state, action: PayloadAction<Asset>) => {
        state.loading = false;
        state.assets.unshift(action.payload);
        state.newlyCreatedAsset = action.payload; // ✅ ADDED
        state.successMessage = "Asset created successfully.";
      })
      .addCase(createAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || DEFAULT_ERROR_MESSAGE;
      })

      .addCase(fetchAssets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAssets.fulfilled,
        (state, action: PayloadAction<Asset[]>) => {
          state.loading = false;
          state.assets = action.payload;
        }
      )
      .addCase(fetchAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || DEFAULT_ERROR_MESSAGE;
      })

      .addCase(fetchAssetById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.singleAsset = null;
      })
      .addCase(
        fetchAssetById.fulfilled,
        (state, action: PayloadAction<Asset>) => {
          state.loading = false;
          state.singleAsset = action.payload;
        }
      )
      .addCase(fetchAssetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || DEFAULT_ERROR_MESSAGE;
      })

      .addCase(fetchAssetByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.singleAsset = null;
      })
      .addCase(
        fetchAssetByNumber.fulfilled,
        (state, action: PayloadAction<Asset>) => {
          state.loading = false;
          state.singleAsset = action.payload;
        }
      )
      .addCase(fetchAssetByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || DEFAULT_ERROR_MESSAGE;
      })

      .addCase(updateAsset.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateAsset.fulfilled, (state, action: PayloadAction<Asset>) => {
        state.loading = false;
        state.successMessage = "Asset updated successfully.";
        state.assets = state.assets.map((a) =>
          a.id === action.payload.id ? action.payload : a
        );
        state.singleAsset = action.payload;
      })
      .addCase(updateAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || DEFAULT_ERROR_MESSAGE;
      })

      .addCase(deleteAsset.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        deleteAsset.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.successMessage = "Asset deleted successfully.";
          state.assets = state.assets.filter((a) => a.id !== action.payload);
        }
      )
      .addCase(deleteAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || DEFAULT_ERROR_MESSAGE;
      })

      .addCase(fetchAssetReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAssetReport.fulfilled,
        (state, action: PayloadAction<AssetReport>) => {
          state.loading = false;
          state.report = action.payload;
        }
      )
      .addCase(fetchAssetReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || DEFAULT_ERROR_MESSAGE;
      });
  },
});

export const { clearAssetState } = assetSlice.actions;
export default assetSlice.reducer;
