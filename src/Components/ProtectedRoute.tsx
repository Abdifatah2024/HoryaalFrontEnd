// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { jwtDecode } from "jwt-decode";
// import type { RootState } from "../Redux/store";
// import type { Role } from "../types/Login";

// export interface ProtectedRouteProps {
//   allowedRoles: ("ADMIN" | "USER" | "Teacher" | "PARENT")[];
// }

// interface JwtPayload {
//   useId: number;
//   userName: string;
//   role: string;
//   exp: number;
//   iat: number;
// }

// export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
//   // Get token from Redux or fallback to localStorage
//   const reduxToken = useSelector((state: RootState) => state.loginSlice.data.Access_token);
//   const token = reduxToken || localStorage.getItem("Access_token");

//   if (!token) {
//     return <Navigate to="/auth/login" replace />;
//   }

//   try {
//     const decoded = jwtDecode<JwtPayload>(token);

//     // ✅ Token expiration check
//     if (decoded.exp * 1000 < Date.now()) {
//       return <Navigate to="/auth/login" replace />;
//     }

//     // ✅ Role check
//     const userRole = decoded.role as Role;

//     if (!allowedRoles.includes(userRole)) {
//       return <Navigate to="/unauthorized" replace />;
//     }

//     // ✅ Access granted
//     return <Outlet />;
//   } catch (error) {
//     console.error("Invalid token:", error);
//     return <Navigate to="/auth/login" replace />;
//   }
// };
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import type { RootState } from "../Redux/store";
import { logout } from "../Redux/Auth/LoginSlice";
import type { Role } from "../types/Login";

export interface ProtectedRouteProps {
  allowedRoles: ("ADMIN" | "USER" | "Teacher" | "PARENT")[];
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
    const userRole = decoded.role as Role;
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />; // ✅ access granted
  } catch (error) {
    console.error("Invalid token:", error);
    dispatch(logout());
    return <Navigate to="/auth/login" replace />;
  }
};
