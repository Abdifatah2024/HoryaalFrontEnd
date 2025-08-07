import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { fetchNewlyRegisteredStudents } from "../../pages/Payment/unpaidFamilySlice";

const NewStudentList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { loading, newStudents, error } = useSelector(
    (state: RootState) => state.unpaidFamily
  );

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      alert("Please enter both start and end dates.");
      return;
    }

    dispatch(fetchNewlyRegisteredStudents({ startDate, endDate }));
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" gutterBottom mt={4}>
        Newly Registered Students
      </Typography>

      <Box display="flex" gap={2} my={2}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ minWidth: "150px" }}
        >
          Search
        </Button>
      </Box>

      {loading && (
        <Box textAlign="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}

      {!loading && newStudents.length > 0 && (
        <Paper elevation={3} sx={{ mt: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Class</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {newStudents.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{student.fullname}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>{student.className}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {!loading && newStudents.length === 0 && (
        <Typography mt={2}>No students found in the selected range.</Typography>
      )}
    </Container>
  );
};

export default NewStudentList;
