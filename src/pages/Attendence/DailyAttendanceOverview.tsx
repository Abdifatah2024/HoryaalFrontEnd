import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store"
import { fetchDailyAttendanceOverview, clearAttendanceState } from "../../Redux/Attedence/AttendancePeClassSlice";
import { CircularProgress, Table, TableHead, TableRow, TableCell, TableBody, Typography, } from "@mui/material";
import { format } from "date-fns";

export const DailyAttendanceOverview: React.FC = () => {
  const dispatch = useAppDispatch();
  const { dailyOverview, loading, errorMessage } = useAppSelector((state) => state.attendance);

  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));

  useEffect(() => {
    dispatch(fetchDailyAttendanceOverview({ date: selectedDate }));
    return () => {
      dispatch(clearAttendanceState());
    };
  }, [dispatch, selectedDate]);

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Daily Attendance Overview
      </Typography>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      {loading && <CircularProgress />}
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}

      {dailyOverview && dailyOverview.classes.map((cls) => (
        <div key={cls.classId} style={{ marginBottom: 32 }}>
          <Typography variant="h6">
            Class: {cls.className}
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Remark</TableCell>
                <TableCell>Recorded By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cls.records.map((rec) => (
                <TableRow key={rec.studentId}>
                  <TableCell>{rec.fullname}</TableCell>
                  <TableCell>{rec.status}</TableCell>
                  <TableCell>{rec.remark}</TableCell>
                  <TableCell>{rec.recordedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};
