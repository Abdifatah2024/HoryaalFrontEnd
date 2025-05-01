// import axios from "axios";

// // Create a base Axios instance
// const API = axios.create({
//   baseURL: "http://localhost:4000/student", // 👈 adjust if your backend URL is different
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // API to upload students Excel file
// export const uploadExcelFile = async (formData: FormData) => {
//   const response = await API.post("/upload", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data", // Important for file uploads
//     },
//   });
//   return response.data;
// };

// // API to create a single student manually (if needed)
// export const createStudent = async (studentData: any) => {
//   const response = await API.post("/create", studentData);
//   return response.data;
// };

// // API to fetch all students (if needed later)
// export const getStudents = async () => {
//   const response = await API.get("/studentList");
//   return response.data;
// };

// export default API;
import axios from "axios";

// Axios instance with base configuration
const API = axios.create({
  baseURL: "http://localhost:4000/student",
  headers: {
    "Content-Type": "application/json",
  },
});

// Upload Excel file
export const uploadExcelFile = async (formData: FormData) => {
  const response = await API.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Required for file uploads
    },
  });
  return response.data;
};

// Fetch all students (example)
export const getStudents = async () => {
  const response = await API.get("/studentList");
  return response.data;
};

export default API;
