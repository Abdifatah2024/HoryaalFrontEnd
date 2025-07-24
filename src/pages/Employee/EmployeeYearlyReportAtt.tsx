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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { fetchYearlyEmployeeReport } from "./EmployeeAttendanceSlice";

interface MonthSummary {
  month: number;
  present: number;
  absent: number;
}

interface YearlyAttendanceSummaryItem {
  employeeId: number;
  fullName: string;
  jobTitle: string;
  monthlySummary: MonthSummary[];
  totalPresent: number;
  totalAbsent: number;
}

const EmployeeYearlyAttendanceOnly: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    loading,
    yearlyReport = [],
    error = "",
  } = useAppSelector((state) => state.employeeAttendance);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    dispatch(fetchYearlyEmployeeReport(selectedYear));
  }, [dispatch, selectedYear]);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Find or create empty monthly data for each employee
  const getEmployeeMonthlyData = (employee: YearlyAttendanceSummaryItem) => {
    return monthNames.map((_, index) => {
      const monthNumber = index + 1;
      const monthData = employee.monthlySummary?.find(m => m.month === monthNumber) || {
        present: 0,
        absent: 0,
      };
      return {
        ...monthData,
        month: monthNumber
      };
    });
  };

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Yearly Employee Attendance Summary ({selectedYear})
      </Typography>

      <Paper sx={{ p: 2, mb: 4 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
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

        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}

        {!loading && yearlyReport.length > 0 && (
          <Table size="small" sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Position</TableCell>
                {monthNames.map((name) => (
                  <TableCell key={name} align="center">{name}</TableCell>
                ))}
                <TableCell align="center">Total Present</TableCell>
                <TableCell align="center">Total Absent</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {yearlyReport.map((employee) => {
                const monthlyData = getEmployeeMonthlyData(employee);
                return (
                  <TableRow key={employee.employeeId}>
                    <TableCell>{employee.fullName}</TableCell>
                    <TableCell>{employee.jobTitle}</TableCell>
                    
                    {monthlyData.map((month) => (
                      <TableCell key={month.month} align="center">
                        {month.present > 0 || month.absent > 0 ? (
                          <>
                            <Typography variant="body2">
                              <Box component="span" color="success.main">
                                P: {month.present}
                              </Box>
                              {' / '}
                              <Box component="span" color={month.absent > 0 ? "error.main" : "text.primary"}>
                                A: {month.absent}
                              </Box>
                            </Typography>
                          </>
                        ) : '-'}
                      </TableCell>
                    ))}
                    
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      {employee.totalPresent}
                    </TableCell>
                    <TableCell 
                      align="center" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: employee.totalAbsent > 0 ? 'error.main' : 'inherit'
                      }}
                    >
                      {employee.totalAbsent}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {!loading && yearlyReport.length === 0 && !error && (
          <Typography variant="body1" align="center" sx={{ p: 3 }}>
            No attendance records found for {selectedYear}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default EmployeeYearlyAttendanceOnly;