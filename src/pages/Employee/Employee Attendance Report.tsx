import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  fetchMonthlyEmployeeReport,
  fetchYearlyEmployeeReport,
} from "./EmployeeAttendanceSlice"; // Adjust path as needed

const EmployeeAttendanceReport: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    loading,
    monthlyReport = [],
    yearlyReport = [],
    error = "",
  } = useAppSelector((state) => state.employeeAttendance);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  useEffect(() => {
    dispatch(fetchMonthlyEmployeeReport({ month: selectedMonth, year: selectedYear }));
    dispatch(fetchYearlyEmployeeReport(selectedYear));
  }, [dispatch, selectedMonth, selectedYear]);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Employee Attendance Report
      </Typography>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Month</InputLabel>
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                label="Month"
              >
                {monthNames.map((name, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                label="Year"
              >
                {[2023, 2024, 2025, 2026].map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {loading && <CircularProgress sx={{ mt: 2 }} />}
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}

        {!loading && monthlyReport && monthlyReport.length > 0 && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Monthly Absences
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Total Absences</TableCell>
                  <TableCell>Present Days</TableCell>
                  <TableCell>Dates</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {monthlyReport.map((emp) => (
                  <TableRow key={emp.employeeId}>
                    <TableCell>{emp.fullName}</TableCell>
                    <TableCell>{emp.jobTitle}</TableCell>
                    <TableCell>{emp.phone}</TableCell>
                    <TableCell>{emp.totalAbsences}</TableCell>
                    <TableCell>{emp.presentDays}</TableCell>
                    <TableCell>
                      {emp.records?.map((r) =>
                        new Date(r.date).toLocaleDateString()
                      ).join(", ")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Yearly Attendance Summary
        </Typography>

        {!loading && yearlyReport && yearlyReport.length > 0 && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                {[...Array(12)].map((_, idx) => (
                  <TableCell key={idx}>{monthNames[idx]}</TableCell>
                ))}
                <TableCell>Total Absent</TableCell>
                <TableCell>Total Present</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {yearlyReport.map((emp) => (
                <TableRow key={emp.employeeId}>
                  <TableCell>{emp.fullName}</TableCell>
                  {[...Array(12)].map((_, i) => {
                    const monthData = emp.monthlySummary.find((m) => m.month === i + 1) || {
                      absent: 0,
                      present: 0,
                    };
                    return (
                      <TableCell key={i}>
                        A: {monthData.absent}, P: {monthData.present}
                      </TableCell>
                    );
                  })}
                  <TableCell>{emp.totalAbsent}</TableCell>
                  <TableCell>{emp.totalPresent}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default EmployeeAttendanceReport;
