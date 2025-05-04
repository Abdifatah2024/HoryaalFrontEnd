// import { useSelector } from "react-redux";
// import { Navigate, Outlet } from "react-router-dom";
// import { RootState } from "../../Redux/store";
// import { jwtDecode } from "jwt-decode";
// import { Role } from "../../types/Login"; // match your import path

// interface JwtPayload {
//   role: string;
// }

// interface ProtectedRouteProps {
//   allowedRoles: Role[];
// }

// const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
//   const token = useSelector((state: RootState) => state.loginSlice.data.Access_token);

//   let userRole: Role | null = null;
//   try {
//     const decoded = jwtDecode<JwtPayload>(token);
//     if (Object.values(Role).includes(decoded.role as Role)) {
//       userRole = decoded.role as Role;
//     }
//   } catch {
//     return <Navigate to="/auth/login" replace />;
//   }

//   if (!userRole || !allowedRoles.includes(userRole)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import { RootState } from "../../Redux/store";
import { jwtDecode } from "jwt-decode";
import { RootState } from '../../Redux/store';
import { Role } from '../../types/Login';

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

interface JwtPayload {
  useId: number;
  userName: string;
  role: string;
  exp: number;
  iat: number;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const token = useSelector((state: RootState) => state.loginSlice.data.Access_token);

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // Token expiry check
    if (decoded.exp * 1000 < Date.now()) {
      return <Navigate to="/auth/login" replace />;
    }

    const userRole = decoded.role as Role;

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
  } catch (error) {
    console.error('Invalid token:', error);
    return <Navigate to="/auth/login" replace />;
  }
};

export default ProtectedRoute;
