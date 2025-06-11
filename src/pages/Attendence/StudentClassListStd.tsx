import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../Redux/store";
import { getStudentsByClass, selectStudents } from "../../Redux/Classes/ListStdInClassSlice";
import {
  Box,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  Button,
  TextField,
  Chip,
  Avatar,
  Grid,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { markAttendance } from "../../Redux/Auth/AttedenceSlice";
import { CheckCircleOutline, CancelOutlined } from "@mui/icons-material";

const classList = [
  { id: 1, name: "1A" }, { id: 2, name: "1B" }, { id: 3, name: "1C" },
  { id: 4, name: "1D" }, { id: 5, name: "1E" }, { id: 6, name: "1G" },
  { id: 7, name: "2A" }, { id: 8, name: "2B" }, { id: 9, name: "2C" },
  { id: 10, name: "2D" }, { id: 11, name: "2E" }, { id: 12, name: "2F" },
  { id: 13, name: "3A" }, { id: 14, name: "3B" }, { id: 15, name: "3C" },
  { id: 16, name: "3D" }, { id: 17, name: "3E" }, { id: 18, name: "4A" },
  { id: 19, name: "4B" }, { id: 20, name: "4C" }, { id: 21, name: "4D" },
];

const absentReasons = [
  { value: "sick", label: "Sick" },
  { value: "family", label: "Family Matter" },
  { value: "travel", label: "Travel" },
  { value: "other", label: "Other" },
];

const StudentClassListStd2: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { students, loading, error } = useSelector(selectStudents);
  const [selectedClassId, setSelectedClassId] = useState<number>(classList[0].id);
  const [attendanceData, setAttendanceData] = useState<Record<number, { 
    present: boolean; 
    remark?: string;
    reason?: string;
  }>>({});
  const theme = useTheme();

  useEffect(() => {
    dispatch(getStudentsByClass(selectedClassId));
  }, [dispatch, selectedClassId]);

  useEffect(() => {
    const defaultData: Record<number, { present: boolean }> = {};
    students.forEach((s) => {
      defaultData[s.id] = { present: true };
    });
    setAttendanceData(defaultData);
  }, [students]);

  const handleChange = (e: SelectChangeEvent<number>) => {
    setSelectedClassId(Number(e.target.value));
  };

  const handleAttendanceToggle = (studentId: number) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        present: !prev[studentId]?.present,
        remark: prev[studentId]?.present ? "" : prev[studentId]?.remark,
        reason: prev[studentId]?.present ? "" : prev[studentId]?.reason,
      },
    }));
  };

  const handleReasonChange = (studentId: number, reason: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        reason,
        remark: reason === "other" ? prev[studentId]?.remark || "" : "",
      },
    }));
  };

  const saveAttendance = async () => {
    try {
      for (const [id, data] of Object.entries(attendanceData)) {
        const remark = data.present 
          ? "Present" 
          : data.reason === "other" 
            ? data.remark || "Absent - Other" 
            : `Absent - ${absentReasons.find(r => r.value === data.reason)?.label || "Unknown"}`;

        const resultAction = await dispatch(
          markAttendance({
            studentId: +id,
            present: data.present,
            remark,
          })
        );

        if (markAttendance.rejected.match(resultAction)) {
          throw new Error(resultAction.payload as string);
        }
      }

      toast.success("Attendance saved successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to save attendance.", {
        position: "top-center",
      });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b',
          borderLeft: `4px solid ${theme.palette.primary.main}`,
        }}
      >
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Student Attendance
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Track and manage class attendance
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="medium">
              <InputLabel id="class-select-label">Select Class</InputLabel>
              <Select
                labelId="class-select-label"
                value={selectedClassId}
                label="Select Class"
                onChange={handleChange}
                sx={{ borderRadius: 3 }}
              >
                {classList.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : error ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'error.light' }}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </Paper>
      ) : students.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
          <Typography variant="h6" color="text.secondary">
            No students found in this class
          </Typography>
        </Paper>
      ) : (
        <>
          <TableContainer 
            component={Paper} 
            elevation={0}
            sx={{ 
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              overflow: 'hidden',
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  backgroundColor: theme.palette.mode === 'light' ? '#f1f5f9' : '#334155',
                }}>
                  <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Gender</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Fee</TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow 
                    key={student.id} 
                    hover 
                    sx={{ 
                      '&:nth-of-type(even)': { 
                        backgroundColor: theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b' 
                      } 
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ 
                          bgcolor: theme.palette.primary.main, 
                          width: 36, 
                          height: 36,
                          fontSize: 14,
                        }}>
                          {student.fullname.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Typography fontWeight={500}>{student.fullname}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={student.gender} 
                        size="small"
                        color={student.gender.toLowerCase() === 'male' ? 'primary' : 'secondary'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell>
                      <Chip 
                        label={`$${student.fee}`} 
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Button
                          size="small"
                          variant={attendanceData[student.id]?.present ? "contained" : "outlined"}
                          color={attendanceData[student.id]?.present ? "success" : "error"}
                          startIcon={attendanceData[student.id]?.present ? 
                            <CheckCircleOutline /> : <CancelOutlined />}
                          onClick={() => handleAttendanceToggle(student.id)}
                          sx={{ 
                            borderRadius: 3,
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                        >
                          {attendanceData[student.id]?.present ? "Present" : "Absent"}
                        </Button>
                        
                        {!attendanceData[student.id]?.present && (
                          <Box mt={1} display="flex" flexDirection="column" gap={1}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Reason</InputLabel>
                              <Select
                                value={attendanceData[student.id]?.reason || ""}
                                onChange={(e) => handleReasonChange(student.id, e.target.value)}
                                label="Reason"
                                sx={{ borderRadius: 3 }}
                              >
                                {absentReasons.map((reason) => (
                                  <MenuItem key={reason.value} value={reason.value}>
                                    {reason.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            
                            {attendanceData[student.id]?.reason === 'other' && (
                              <TextField
                                size="small"
                                placeholder="Please specify"
                                variant="outlined"
                                fullWidth
                                value={attendanceData[student.id]?.remark || ""}
                                onChange={(e) => {
                                  const remark = e.target.value;
                                  setAttendanceData((prev) => ({
                                    ...prev,
                                    [student.id]: {
                                      ...prev[student.id],
                                      remark,
                                    },
                                  }));
                                }}
                                sx={{ borderRadius: 3 }}
                              />
                            )}
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ 
            mt: 4, 
            display: "flex", 
            justifyContent: "center",
            position: 'sticky',
            bottom: 20,
            zIndex: 1,
          }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={saveAttendance}
              size="large"
              sx={{
                borderRadius: 3,
                px: 6,
                py: 1.5,
                fontWeight: 700,
                boxShadow: theme.shadows[4],
                '&:hover': {
                  boxShadow: theme.shadows[8],
                }
              }}
            >
              Save Attendance
            </Button>
          </Box>
        </>
      )}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme.palette.mode}
      />
    </Container>
  );
};

export default StudentClassListStd2
