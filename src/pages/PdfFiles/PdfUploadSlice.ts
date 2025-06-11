import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API_URL } from "../../Constant";

interface Document {
  id: number;
  title: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  uploadedBy: {
    id: number;
    username: string;
  };
}

interface PdfState {
  loading: boolean;
  error: string | null;
  success: string | null;
  documents: Document[];
}

const initialState: PdfState = {
  loading: false,
  error: null,
  success: null,
  documents: [],
};

export const uploadPdfFn = createAsyncThunk(
  "pdf/upload",
  async (formData: FormData, thunkAPI) => {
    try {
      const res = await axios.post(`${BASE_API_URL}/user/upload-pdf`, formData);
      return res.data.url;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Upload failed"
      );
    }
  }
);

export const fetchDocuments = createAsyncThunk(
  "pdf/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/user/documents`);
      return res.data.documents;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Fetch failed"
      );
    }
  }
);

export const deleteDocument = createAsyncThunk(
  "pdf/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Access_token");

      await axios.delete(`${BASE_API_URL}/user/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return id;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Delete failed"
        );
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

const pdfUploadSlice = createSlice({
  name: "pdfUpload",
  initialState,
  reducers: {
    resetPdfState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadPdfFn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadPdfFn.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(uploadPdfFn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.documents = action.payload;
      })
      .addCase(deleteDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Document deleted successfully";
        state.documents = state.documents.filter(
          (doc) => doc.id !== action.payload
        );
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetPdfState } = pdfUploadSlice.actions;
export default pdfUploadSlice.reducer;
