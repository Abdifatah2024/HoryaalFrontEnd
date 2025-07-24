import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store"; // Adjust path as per your project structure
import {
  fetchDeletedStudents,
  softDeleteStudent,
  clearSoftDeleteState,
} from "./studentSoftDeleteSlice"; // Adjust path as per your project structure
import {
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  TextField,
  CircularProgress,
  Container, // Added for better layout control
  Stack,     // Added for better spacing and alignment of elements
 // For icon buttons
} from "@mui/material";
import { toast } from "react-toastify"; // Assuming toastify is set up
import {
  AddCircleOutline as AddIcon,
  VisibilityOff as VisibilityOffIcon,
  Send as SendIcon,
  DeleteForever as DeleteForeverIcon, // For soft delete action
  Refresh as RefreshIcon, // For refresh button
} from '@mui/icons-material'; // Icons for modern design

// Define the Student interface based on your Redux slice's state
// interface Student {
//   studentId: number;
//   fullName: string;
//   className: string; // Assuming 'class' is 'className' to avoid keyword conflicts
//   reason: string;
//   deletedAt: string;
//   deletedByName: string;
//   deletedByEmail: string;
// }

const SoftDeletedStudents: React.FC = () => {
  const dispatch = useAppDispatch();
  const { deletedStudents, loading, error, successMessage } = useAppSelector(
    (state) => state.studentSoftDelete
  );

  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [studentId, setStudentId] = useState<number | "">("");
  const [reason, setReason] = useState("");

  // Fetch deleted students on component mount
  useEffect(() => {
    dispatch(fetchDeletedStudents());
  }, [dispatch]);

  // Handle success and error messages from Redux state
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(fetchDeletedStudents()); // Re-fetch to update the list
      dispatch(clearSoftDeleteState());
      setStudentId("");
      setReason("");
    }
    if (error) {
      toast.error(error);
      dispatch(clearSoftDeleteState()); // Clear error after showing
    }
  }, [successMessage, error, dispatch]);

  // Handle soft delete form submission
  const handleSubmit = () => {
    if (studentId && reason.trim()) {
      dispatch(softDeleteStudent({ studentId: Number(studentId), reason }));
    } else {
      toast.error("Please select a student ID and enter a reason for deletion.");
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    dispatch(fetchDeletedStudents());
  };

  return (
    // Use Container for responsive max-width and consistent padding
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
          Soft Deleted Student Management
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
          <Button
            variant="contained"
            color={showDeleteForm ? "secondary" : "primary"}
            onClick={() => setShowDeleteForm((prev) => !prev)}
            startIcon={showDeleteForm ? <VisibilityOffIcon /> : <AddIcon />}
            sx={{
              borderRadius: 2,
              py: 1.2,
              px: 3,
              textTransform: 'none',
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
              }
            }}
          >
            {showDeleteForm ? "Hide Soft Delete Form" : "Soft Delete Student"}
          </Button>

          <Button
            variant="outlined"
            color="info"
            onClick={handleRefresh}
            startIcon={<RefreshIcon />}
            sx={{
              borderRadius: 2,
              py: 1.2,
              px: 3,
              textTransform: 'none',
              fontWeight: 'bold',
              borderColor: 'info.main',
              color: 'info.main',
              '&:hover': {
                backgroundColor: 'info.light',
                color: 'white',
              }
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Refresh List"}
          </Button>
        </Stack>


        <Collapse in={showDeleteForm}>
          <Paper elevation={1} sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Soft Delete Student
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start" sx={{ flexWrap: "wrap" }}>
              <TextField
                label="Student ID"
                type="number"
                value={studentId}
                onChange={(e) => setStudentId(Number(e.target.value))}
                variant="outlined"
                fullWidth={false} // Allow it to take natural width
                sx={{ minWidth: { xs: '100%', sm: '150px' } }}
              />
              <TextField
                label="Reason for Deletion"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                variant="outlined"
                multiline
                rows={1} // Start with one row, expand as needed
                fullWidth
              />
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                startIcon={<SendIcon />}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 3,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 8px rgba(0,128,0,0.2)',
                  '&:hover': {
                    boxShadow: '0 6px 12px rgba(0,128,0,0.3)',
                  },
                  minWidth: { xs: '100%', sm: 'auto' }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Soft Delete"}
              </Button>
            </Stack>
          </Paper>
        </Collapse>

        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom sx={{ mt: 4, mb: 2, color: 'text.primary' }}>
          Deleted Students List
        </Typography>

        {loading && !deletedStudents.length ? ( // Show loading only if no data is present yet
          <Box display="flex" justifyContent="center" alignItems="center" py={5}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ ml: 2, color: 'text.secondary' }}>Loading deleted students...</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflowX: 'auto' }}>
            <Table size="small" aria-label="soft deleted students table">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>Student ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>Full Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>Class</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>Reason</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>Deleted At</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>Deleted By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deletedStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      <DeleteForeverIcon sx={{ fontSize: 40, mb: 1, color: 'grey.400' }} />
                      <Typography variant="body1">No deleted students found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  deletedStudents.map((student) => (
                    <TableRow key={student.studentId} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' }, '&:hover': { backgroundColor: 'action.selected' } }}>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.fullName}</TableCell>
                      <TableCell>{student.className}</TableCell>
                      <TableCell>{student.reason}</TableCell>
                      <TableCell>
                        {new Date(student.deletedAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {student.deletedByName} ({student.deletedByEmail})
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default SoftDeletedStudents;
