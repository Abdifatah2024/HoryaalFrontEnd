// // src/api/employee.api.ts
// import axios from "axios";
// import { Employee } from "../../pages/Employee/types";

// const BASE_API_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// // Reusable auth header
// const authHeader = () => {
//   const token =
//     localStorage.getItem("access_token") ||
//     localStorage.getItem("Access_token");
//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
// };

// // Create Employee
// export const createEmployee = async (data: Employee) => {
//   const res = await axios.post(
//     `${BASE_API_URL}/user/employees`,
//     data,
//     authHeader()
//   );
//   return res.data;
// };

// // Fetch Employee by ID
// export const fetchEmployeeById = async (id: string) => {
//   const res = await axios.get(
//     `${BASE_API_URL}/user/employees/${id}`,
//     authHeader()
//   );
//   return res.data;
// };

// // Update Employee
// export const updateEmployeeAPI = async (data: Employee) => {
//   const res = await axios.put(
//     `${BASE_API_URL}/user/employees/${data.id}`,
//     data,
//     authHeader()
//   );
//   return res.data;
// };
// export const deleteEmployeeById = async (id: string) => {
//   const res = await axios.delete(
//     `${BASE_API_URL}/user/employees/${id}`,
//     authHeader()
//   );
//   return res.data;
// };
import axios from "axios";
import { Employee } from "../../pages/Employee/types";

const BASE_API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// Reusable auth header generator
const authHeader = () => {
  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("Access_token");
  return {
    headers: {
      Authorization: `Bearer ${token || ""}`,
    },
  };
};

// Create Employee
export const createEmployee = async (data: Employee) => {
  const res = await axios.post(
    `${BASE_API_URL}/user/employees`,
    data,
    authHeader()
  );
  return res.data;
};

// Fetch Employee by ID
export const fetchEmployeeById = async (id: string) => {
  const res = await axios.get(
    `${BASE_API_URL}/user/employees/${id}`,
    authHeader()
  );
  return res.data;
};

// Update Employee
export const updateEmployeeAPI = async (data: Employee) => {
  const res = await axios.put(
    `${BASE_API_URL}/user/employees/${data.id}`,
    data,
    authHeader()
  );
  return res.data;
};

// Delete Employee
export const deleteEmployeeById = async (id: string) => {
  const res = await axios.delete(
    `${BASE_API_URL}/user/employees/${id}`,
    authHeader()
  );
  return res.data;
};

// Link Student to Parent
export const updateStudentParent = async (
  studentId: number,
  parentPhone: string
) => {
  const res = await axios.put(
    `${BASE_API_URL}/student/student/update-parent`,
    { studentId, parentPhone },
    authHeader()
  );
  return res.data;
};
