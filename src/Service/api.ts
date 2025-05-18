import axios from "axios";

// Axios instance
const API = axios.create({
  baseURL: "http://localhost:4000/student", // Ensure this matches your backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Upload Excel
export const uploadExcelFile = async (formData: FormData) => {
  const response = await API.post("/upload-excel", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Fetch students
export const getStudents = async () => {
  const response = await API.get("/studentList");
  return response.data;
};

export default API;
