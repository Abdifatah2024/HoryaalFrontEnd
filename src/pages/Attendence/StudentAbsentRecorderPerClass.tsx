import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Redux/store';
import { fetchClasses, saveClassAttendance } from '../../Redux/Attedence/AttendancePeClassSlice';
import { Box, Button, Card, CardContent, CardHeader, Collapse, Typography, IconButton, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface StudentAttendance {
  present: boolean;
  remark?: string;
}

type AttendanceData = Record<number, Record<number, StudentAttendance>>;

const StudentAbsentRecorder: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { classList = [], loading, saving, errorMessage } = useSelector((state: RootState) => state.attendance);
  const [expandedClassId, setExpandedClassId] = useState<number | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({});

  useEffect(() => { dispatch(fetchClasses()); }, [dispatch]);

  
  const handleExpand = useCallback((classId: number) => {
    setExpandedClassId(prev => (prev === classId ? null : classId));
  }, []);

  const toggleAttendance = useCallback((classId: number, studentId: number) => {
    setAttendanceData(prev => ({
      ...prev,
      [classId]: {
        ...prev[classId],
        [studentId]: {
          present: !(prev[classId]?.[studentId]?.present ?? true),
          remark: prev[classId]?.[studentId]?.remark,
        },
      },
    }));
  }, []);

  const handleRemarkChange = useCallback((classId: number, studentId: number, remark: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [classId]: {
        ...prev[classId],
        [studentId]: { ...prev[classId]?.[studentId], remark },
      },
    }));
  }, []);

  const saveAttendance = useCallback((classId: number) => {
    const studentsAttendance = attendanceData[classId];
    if (!studentsAttendance || Object.keys(studentsAttendance).length === 0) {
      toast.error("No attendance data to save.");
      return;
    }

    const payload = Object.entries(studentsAttendance).map(([studentId, data]) => ({
      studentId: Number(studentId),
      present: data.present,
      remark: data.remark || (data.present ? "Present" : "Absent"),
    }));

    dispatch(saveClassAttendance(payload))
      .unwrap()
      .then(() => toast.success(`Attendance saved for "${classList.find(cls => cls.id === classId)?.name}"!`))
      .catch((err) => toast.error(err || "Failed to save attendance."));
  }, [attendanceData, classList, dispatch]);

  if (loading) return <CircularProgress />;
  if (errorMessage) return <Alert severity="error">{errorMessage}</Alert>;

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>Student Attendance</Typography>
      {classList.length === 0 ? (
        <Typography>No classes found.</Typography>
      ) : (
        classList.map((classItem) => (
          <Card key={classItem.id} sx={{ mb: 3 }}>
            <CardHeader
              title={classItem.name}
              action={
                <IconButton onClick={() => handleExpand(classItem.id)}>
                  {expandedClassId === classItem.id ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              }
            />
            <Collapse in={expandedClassId === classItem.id}>
              <CardContent>
                {classItem.student && classItem.student.length > 0 ? (
                  <>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Student Name</TableCell>
                            <TableCell>Attendance</TableCell>
                            <TableCell>Remark</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {classItem.student.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell>{student.fullname}</TableCell>
                              <TableCell>
                                <Button
                                  variant="contained"
                                  color={attendanceData[classItem.id]?.[student.id]?.present ?? true ? "success" : "error"}
                                  onClick={() => toggleAttendance(classItem.id, student.id)}
                                >
                                  {attendanceData[classItem.id]?.[student.id]?.present ?? true ? "Present" : "Absent"}
                                </Button>
                              </TableCell>
                              <TableCell>
                                {!(attendanceData[classItem.id]?.[student.id]?.present ?? true) && (
                                  <TextField
                                    placeholder="Enter remark"
                                    size="small"
                                    value={attendanceData[classItem.id]?.[student.id]?.remark || ""}
                                    onChange={(e) => handleRemarkChange(classItem.id, student.id, e.target.value)}
                                  />
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box mt={2}>
                      <Button
                        variant="contained"
                        startIcon={saving ? <CircularProgress size={20} /> : null}
                        onClick={() => saveAttendance(classItem.id)}
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save Attendance"}
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Typography>No students in this class.</Typography>
                )}
              </CardContent>
            </Collapse>
          </Card>
        ))
      )}
      <ToastContainer autoClose={5000} />
    </Box>
  );
};

export default StudentAbsentRecorder;