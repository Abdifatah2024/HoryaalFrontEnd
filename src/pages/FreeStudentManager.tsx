import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFreeStudents,
  standardizeStudentGender,
} from "../Redux/Auth/classSlice"; // ✅ Make sure path is correct
import { AppDispatch, RootState } from "../Redux/store";
import {
  Button,
  CircularProgress,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { toast } from "react-toastify";

const FreeStudentManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Safe fallback for undefined slice
  const classState = useSelector((state: RootState) => state.classSlice || {});

  const {
    freeStudents = [],
    loading = false,
    error = "",
    standardizeStatus = "",
  } = classState;

  // Load free students on mount
  useEffect(() => {
    dispatch(getFreeStudents());
  }, [dispatch]);

  // Show toast when gender standardization succeeds
  useEffect(() => {
    if (standardizeStatus) {
      toast.success(standardizeStatus);
    }
  }, [standardizeStatus]);

  const handleStandardize = () => {
    dispatch(standardizeStudentGender());
  };

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        🎓 Free Students (Fee = 0)
      </Typography>

      <Box className="flex items-center justify-between mb-4">
        <Button
          variant="contained"
          color="primary"
          onClick={handleStandardize}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Standardize Gender"
          )}
        </Button>
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      </Box>

      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
          <Typography variant="body1" mt={2}>
            Loading free students...
          </Typography>
        </Box>
      ) : freeStudents.length === 0 ? (
        <Typography>No free students found.</Typography>
      ) : (
        <TableContainer component={Paper} className="shadow-md rounded-lg">
          <Table>
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableCell><strong>#</strong></TableCell>
                <TableCell><strong>Full Name</strong></TableCell>
                <TableCell><strong>Phone</strong></TableCell>
                <TableCell><strong>Class</strong></TableCell>
                <TableCell><strong>Registered By</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {freeStudents.map((student: any, index: number) => (
                <TableRow key={student.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{student.fullname}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>{student.classes?.name || "-"}</TableCell>
                  <TableCell>
                    {student.registeredBy?.fullName || "Unknown"}
                    <br />
                    <small className="text-gray-500">
                      {student.registeredBy?.email}
                    </small>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default FreeStudentManager;
