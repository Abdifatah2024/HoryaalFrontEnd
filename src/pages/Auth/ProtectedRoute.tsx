// // import { Navigate, Outlet } from 'react-router-dom';
// // import { useSelector } from 'react-redux';
// // // import { RootState } from "../../Redux/store";
// // import { jwtDecode } from "jwt-decode";
// // import { RootState } from '../../Redux/store';
// // import { Role } from '../../types/Login';

// // interface ProtectedRouteProps {
// //   allowedRoles: Role[];
// // }

// // interface JwtPayload {
// //   useId: number;
// //   userName: string;
// //   role: string;
// //   exp: number;
// //   iat: number;
// // }


// // export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
// //   const token = useSelector((state: RootState) => state.loginSlice.data.Access_token);

// //   if (!token) {
// //     return <Navigate to="/auth/login" replace />;
// //   }

// //   try {
// //     const decoded = jwtDecode<JwtPayload>(token);

// //     // Token expiry check
// //     if (decoded.exp * 1000 < Date.now()) {
// //       return <Navigate to="/auth/login" replace />;
// //     }

// //     const userRole = decoded.role as Role;

// //     if (!allowedRoles.includes(userRole)) {
// //       return <Navigate to="/unauthorized" replace />;
// //     }

// //     return <Outlet />;
// //   } catch (error) {
// //     console.error('Invalid token:', error);
// //     return <Navigate to="/auth/login" replace />;
// //   }
// // };

// // // export default ProtectedRoute;
// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { jwtDecode } from 'jwt-decode';
// import { RootState } from '../../Redux/store';
// import { Role } from '../../types/Login';

// interface ProtectedRouteProps {
//   allowedRoles: Role[];
// }

// interface JwtPayload {
//   userId: number;
//   userName: string;
//   role: string;  // Matches Role enum values
//   exp: number;
//   iat: number;
// }

// export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
//   const token = useSelector((state: RootState) => state.loginSlice.data.Access_token);

//   // Immediately redirect if token is missing
//   if (!token) {
//     return <Navigate to="/auth/login" replace />;
//   }

//   try {
//     const decoded = jwtDecode<JwtPayload>(token);

//     // Check token expiration (converted to milliseconds)
//     if (decoded.exp * 1000 < Date.now()) {
//       return <Navigate to="/auth/login" replace />;
//     }

//     // Validate role against allowed roles
//     const userRole = decoded.role;
//     if (!allowedRoles.includes(userRole as Role)) {
//       return <Navigate to="/unauthorized" replace />;
//     }

//     return <Outlet />;
//   } catch (error) {
//     console.error('Token validation failed:', error);
//     return <Navigate to="/auth/login" replace />;
//   }
// };

// // Optional: Uncomment if default export is needed
// // export default ProtectedRoute;