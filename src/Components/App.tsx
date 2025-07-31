// App.tsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { initializeAuth } from '../../';
import {ProtectedRoute} from './ProtectedRoute';
import Login from './../pages/Auth/Login';
import Dashboard from './../pages/dashboard';
import { RootState } from '@/Redux/store';
import { initializeAuth } from './authSlice';
import { Role } from '../../src/types/Login'; // adjust path accordingly


function App() {
  const dispatch = useDispatch();
  // const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = useSelector((state: RootState) => state.auth);

  // Initialize auth state on app load
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
        {/* <Route element={<ProtectedRoute />}> */}
        <Route element={<ProtectedRoute allowedRoles={[Role.ADMIN, Role.USER, Role.Teacher]} />}>

          <Route path="/" element={<Dashboard />} />
          {/* Add other protected routes here */}
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;

