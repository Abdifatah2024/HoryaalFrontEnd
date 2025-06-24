// import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
// import axios, { AxiosError } from "axios";
// import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// // ------------------ Interfaces ------------------

// export interface Student {
//   id: number;
//   firstname: string;
//   middlename?: string;
//   lastname: string;
//   fourtname?: string; // fixed typo
//   fullname: string;
//   classId: string;
//   phone: string;
//   phone2?: string;
//   bus?: string;
//   address?: string;
//   previousSchool?: string;
//   previousSchoolType?: string;
//   motherName?: string;
//   gender: string;
//   age: number; // fixed naming convention
//   fee: number;
//   amount: number;
//   district: string;
//   transfer: boolean;
//   rollNumber: string;
//   parentEmail: string;
//   createdAt: Date;
//   updatedAt: Date;
// }



// interface StudentWithBus {
//   id: number;
//   fullname: string;
//   classId: string;
//   bus: string;
//   classes: {
//     name: string;
//   };
// }

// interface StudentState {
//   loading: boolean;
//   error: string;
//   student: Student | null;
//   students: Student[];
//   sameBusStudents: StudentWithBus[];
//   sameBusLoading: boolean;
//   siblingStudent: Student | null;
//   siblingLoading: boolean;
// }

// // ------------------ Initial State ------------------

// const initialState: StudentState = {
//   loading: false,
//   error: "",
//   student: null,
//   students: [],
//   sameBusStudents: [],
//   sameBusLoading: false,
//   siblingStudent: null,
//   siblingLoading: false,
// };

// // ------------------ Async Thunks ------------------

// // Create student
// export const createStudent = createAsyncThunk(
//   "students/createStudent",
//   async (data: Partial<Student>, { rejectWithValue }) => {
//     const token = localStorage.getItem("Access_token");
//     try {
//       const res = await axios.post(`${BASE_API_URL}/student/create`, data, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data;
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

// // Fetch all students
// export const fetchStudents = createAsyncThunk(
//   "students/fetchStudents",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE_API_URL}/student/studentList`);
//       return res.data;
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

// // Fetch student by ID
// export const getStudentById = createAsyncThunk(
//   "students/getStudentById",
//   async (studentId: string, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE_API_URL}/student/Get/${studentId}`);
//       return res.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return rejectWithValue(
//           error.response?.data?.message || "Student not found"
//         );
//       }
//       return rejectWithValue("Error fetching student");
//     }
//   }
// );

// // Update student
// export const updateStudent = createAsyncThunk(
//   "students/updateStudent",
//   async (
//     { studentId, studentData }: { studentId: number; studentData: Partial<Student> },
//     { rejectWithValue }
//   ) => {
//     try {
//       const token = localStorage.getItem("Access_token");
//       const res = await axios.put(`${BASE_API_URL}/student/${studentId}`, studentData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return res.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return rejectWithValue(
//           error.response?.data?.message || "Failed to update student"
//         );
//       }
//       return rejectWithValue("Unexpected error occurred");
//     }
//   }
// );

// // Delete student
// export const deleteStudent = createAsyncThunk(
//   "students/deleteStudent",
//   async (studentId: number, { rejectWithValue }) => {
//     try {
//       await axios.delete(`${BASE_API_URL}/students/${studentId}`);
//       return studentId;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return rejectWithValue(
//           error.response?.data?.msg || "Failed to delete student"
//         );
//       }
//       return rejectWithValue("Error deleting student");
//     }
//   }
// );

// // Fetch students with same bus
// export const fetchStudentsWithSameBus = createAsyncThunk(
//   "students/fetchStudentsWithSameBus",
//   async (busNumber: string, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE_API_URL}/student/students/same-bus/${busNumber}`);
//       return res.data.students;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return rejectWithValue(
//           error.response?.data?.message || "Failed to fetch students with same bus"
//         );
//       }
//       return rejectWithValue(DEFAULT_ERROR_MESSAGE);
//     }
//   }
// );

// // ✅ Fetch sibling student by parent phone
// export const fetchSiblingStudentByPhone = createAsyncThunk(
//   "students/fetchSiblingStudentByPhone",
//   async (phone: string, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE_API_URL}/student/students/by-parent-phone?phone=${phone}`);
//       return res.data.student;
//     } catch (error: any) {
//       return rejectWithValue(
//         error?.response?.data?.message || "Failed to fetch sibling data"
//       );
//     }
//   }
// );


// // ------------------ Actions ------------------

// export const clearStudent = createAction("students/clear");
// export const clearSibling = createAction("students/clearSibling");

// // ------------------ Slice ------------------

// const studentSlice = createSlice({
//   name: "students",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Create
//       .addCase(createStudent.pending, (state) => {
//         state.loading = true;
//         state.error = "";
//       })
//       .addCase(createStudent.fulfilled, (state, action) => {
//         state.loading = false;
//         state.students.push(action.payload);
//       })
//       .addCase(createStudent.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Fetch all
//       .addCase(fetchStudents.pending, (state) => {
//         state.loading = true;
//         state.error = "";
//       })
//       .addCase(fetchStudents.fulfilled, (state, action) => {
//         state.loading = false;
//         state.students = action.payload;
//       })
//       .addCase(fetchStudents.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Get by ID
//       .addCase(getStudentById.pending, (state) => {
//         state.loading = true;
//         state.error = "";
//       })
//       .addCase(getStudentById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.student = action.payload;
//       })
//       .addCase(getStudentById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Update
//       .addCase(updateStudent.pending, (state) => {
//         state.loading = true;
//         state.error = "";
//       })
//       .addCase(updateStudent.fulfilled, (state, action) => {
//         state.loading = false;
//         state.students = state.students.map((s) =>
//           s.id === action.payload.id ? action.payload : s
//         );
//         if (state.student?.id === action.payload.id) {
//           state.student = action.payload;
//         }
//       })
//       .addCase(updateStudent.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Delete
//       .addCase(deleteStudent.fulfilled, (state, action) => {
//   const deletedId = Number(action.payload); // ✅ convert string to number
//   state.students = state.students.filter((s) => s.id !== deletedId);
//   if (state.student?.id === deletedId) {
//     state.student = null;
//   }
// })
//       .addCase(deleteStudent.rejected, (state, action) => {
//         state.error = action.payload as string;
//       })

//       // Same bus
//       .addCase(fetchStudentsWithSameBus.pending, (state) => {
//         state.sameBusLoading = true;
//       })
//       .addCase(fetchStudentsWithSameBus.fulfilled, (state, action) => {
//         state.sameBusLoading = false;
//         state.sameBusStudents = action.payload;
//       })
//       .addCase(fetchStudentsWithSameBus.rejected, (state, action) => {
//         state.sameBusLoading = false;
//         state.error = action.payload as string;
//       })

//       // ✅ Sibling
//       .addCase(fetchSiblingStudentByPhone.pending, (state) => {
//         state.siblingLoading = true;
//         state.error = "";
//       })
//       .addCase(fetchSiblingStudentByPhone.fulfilled, (state, action) => {
//         state.siblingLoading = false;
//         state.siblingStudent = action.payload;
//       })
//       .addCase(fetchSiblingStudentByPhone.rejected, (state, action) => {
//         state.siblingLoading = false;
//         state.error = action.payload as string;
//         state.siblingStudent = null;
//       })

//       // Clear
//       .addCase(clearStudent, (state) => {
//         state.student = null;
//         state.error = "";
//       })
//       .addCase(clearSibling, (state) => {
//         state.siblingStudent = null;
//         state.siblingLoading = false;
//       });
//   },
// });

// export default studentSlice.reducer;
import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../Constant";

// ------------------ Interfaces ------------------

export interface Student {
  id: number;
  firstname: string;
  middlename?: string;
  lastname: string;
  fourtname?: string;
  fullname: string;
  classId: string;
  phone: string;
  phone2?: string;
  bus?: string;
  address?: string;
  previousSchool?: string;
  previousSchoolType?: string;
  motherName?: string;
  gender: string;
  age: number;
  fee: number;
  amount: number;
  district: string;
  transfer: boolean;
  rollNumber: string;
  parentEmail: string;
  createdAt: Date;
  updatedAt: Date;
  classes?: { name: string }; // for class display
}



interface StudentWithBus {
  id: number;
  fullname: string;
  classId: string;
  bus: string;
  classes: {
    name: string;
  };
}

interface StudentState {
  loading: boolean;
  error: string;
  student: Student | null;
  students: Student[];
  untransferredStudents: Student[];
  untransferredLoading: boolean;
  sameBusStudents: StudentWithBus[];
  sameBusLoading: boolean;
  siblingStudent: Student | null;
  siblingLoading: boolean;
}

// ------------------ Initial State ------------------

const initialState: StudentState = {
  loading: false,
  error: "",
  student: null,
  students: [],
  untransferredStudents: [],
  untransferredLoading: false,
  sameBusStudents: [],
  sameBusLoading: false,
  siblingStudent: null,
  siblingLoading: false,
};

// ------------------ Async Thunks ------------------

// Create student
export const createStudent = createAsyncThunk(
  "students/createStudent",
  async (data: Partial<Student>, { rejectWithValue }) => {
    const token = localStorage.getItem("Access_token");
    try {
      const res = await axios.post(`${BASE_API_URL}/student/create`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

// Fetch all students
export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/student/studentList`);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

// Fetch student by ID
export const getStudentById = createAsyncThunk(
  "students/getStudentById",
  async (studentId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/student/Get/${studentId}`);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Student not found");
      }
      return rejectWithValue("Error fetching student");
    }
  }
);

// Update student
export const updateStudent = createAsyncThunk(
  "students/updateStudent",
  async (
    { studentId, studentData }: { studentId: number; studentData: Partial<Student> },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("Access_token");
      const res = await axios.put(`${BASE_API_URL}/student/${studentId}`, studentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to update student");
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

// Delete student
export const deleteStudent = createAsyncThunk(
  "students/deleteStudent",
  async (studentId: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_API_URL}/students/${studentId}`);
      return studentId;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.msg || "Failed to delete student");
      }
      return rejectWithValue("Error deleting student");
    }
  }
);

// Fetch students with same bus
export const fetchStudentsWithSameBus = createAsyncThunk(
  "students/fetchStudentsWithSameBus",
  async (busNumber: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/student/students/same-bus/${busNumber}`);
      return res.data.students;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch bus students");
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

// Fetch sibling student
export const fetchSiblingStudentByPhone = createAsyncThunk(
  "students/fetchSiblingStudentByPhone",
  async (phone: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/student/students/by-parent-phone?phone=${phone}`);
      return res.data.student;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch sibling data");
    }
  }
);

// ✅ Fetch Untransferred Students
export const fetchUntransferredStudents = createAsyncThunk(
  "students/fetchUntransferredStudents",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_API_URL}/student/students/untransferred`);
      return res.data.students;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch untransferred students");
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

// ✅ Update Transfer & Roll Number
export const updateTransferAndRollNumber = createAsyncThunk(
  "students/updateTransferAndRollNumber",
  async (
    data: { id: number; transfer: boolean; rollNumber: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("Access_token");
      const res = await axios.patch(`${BASE_API_URL}/student/students/update-transfer-roll`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.student;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to update transfer");
      }
      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

// ------------------ Actions ------------------

export const clearStudent = createAction("students/clear");
export const clearSibling = createAction("students/clearSibling");

// ------------------ Slice ------------------

const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createStudent.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students.push(action.payload);
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch All
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get by ID
      .addCase(getStudentById.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload;
      })
      .addCase(getStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students = state.students.map((s) =>
          s.id === action.payload.id ? action.payload : s
        );
        if (state.student?.id === action.payload.id) {
          state.student = action.payload;
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteStudent.fulfilled, (state, action) => {
        const deletedId = Number(action.payload);
        state.students = state.students.filter((s) => s.id !== deletedId);
        if (state.student?.id === deletedId) {
          state.student = null;
        }
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Same Bus
      .addCase(fetchStudentsWithSameBus.pending, (state) => {
        state.sameBusLoading = true;
      })
      .addCase(fetchStudentsWithSameBus.fulfilled, (state, action) => {
        state.sameBusLoading = false;
        state.sameBusStudents = action.payload;
      })
      .addCase(fetchStudentsWithSameBus.rejected, (state, action) => {
        state.sameBusLoading = false;
        state.error = action.payload as string;
      })

      // Sibling
      .addCase(fetchSiblingStudentByPhone.pending, (state) => {
        state.siblingLoading = true;
        state.error = "";
      })
      .addCase(fetchSiblingStudentByPhone.fulfilled, (state, action) => {
        state.siblingLoading = false;
        state.siblingStudent = action.payload;
      })
      .addCase(fetchSiblingStudentByPhone.rejected, (state, action) => {
        state.siblingLoading = false;
        state.error = action.payload as string;
        state.siblingStudent = null;
      })

      // Clear
      .addCase(clearStudent, (state) => {
        state.student = null;
        state.error = "";
      })
      .addCase(clearSibling, (state) => {
        state.siblingStudent = null;
        state.siblingLoading = false;
      })

      // ✅ Untransferred Students
      .addCase(fetchUntransferredStudents.pending, (state) => {
        state.untransferredLoading = true;
        state.error = "";
      })
      .addCase(fetchUntransferredStudents.fulfilled, (state, action) => {
        state.untransferredLoading = false;
        state.untransferredStudents = action.payload;
      })
      .addCase(fetchUntransferredStudents.rejected, (state, action) => {
        state.untransferredLoading = false;
        state.error = action.payload as string;
      })

      // ✅ Update Transfer & Roll
      .addCase(updateTransferAndRollNumber.fulfilled, (state, action) => {
        const updated = action.payload;
        state.untransferredStudents = state.untransferredStudents.filter(
          (s) => s.id !== updated.id
        );
        state.students = state.students.map((s) =>
          s.id === updated.id ? updated : s
        );
      })
      .addCase(updateTransferAndRollNumber.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default studentSlice.reducer;
