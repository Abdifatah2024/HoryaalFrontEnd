import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import type { RootState } from "../Redux/store";
import { logout } from "../Redux/Auth/LoginSlice";
import type { Role } from "../types/Login";

// export interface ProtectedRouteProps {
//   allowedRoles: ("ADMIN" | "USER" | "Teacher" | "PARENT")[];
// }
export interface ProtectedRouteProps {
  allowedRoles: Role[]; // ✅ now accepts "ACADEMY" and any future roles
}

interface JwtPayload {
  useId: number;
  userName: string;
  role: string;
  exp: number;
  iat: number;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const dispatch = useDispatch();
  const reduxToken = useSelector((state: RootState) => state.loginSlice.data.Access_token);
  const token = reduxToken || localStorage.getItem("Access_token");

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // ✅ Expired token: clear state and redirect
    if (decoded.exp * 1000 < Date.now()) {
      dispatch(logout());
      return <Navigate to="/auth/login" replace />;
    }

    // ✅ Role check

const isRole = (value: unknown): value is Role =>
  typeof value === "string" &&
  ["ADMIN", "TEACHER", "PARENT", "STUDENT", "USER", "ACADEMY"].includes(value);


const userRole = decoded.role;

if (!isRole(userRole) || !allowedRoles.includes(userRole)) {
  return <Navigate to="/unauthorized" replace />;
}


    return <Outlet />; // ✅ access granted
  } catch (error) {
    console.error("Invalid token:", error);
    dispatch(logout());
    return <Navigate to="/auth/login" replace />;
  }
};
