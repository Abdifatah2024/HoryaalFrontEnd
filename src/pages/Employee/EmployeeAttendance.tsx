import  { useEffect, useState } from "react";
import {
  markEmployeeAttendance,
  fetchAllEmployeeAttendances,
  updateEmployeeAttendance,
  deleteEmployeeAttendance,
} from "./EmployeeAttendanceSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Delete, PersonAdd } from "@mui/icons-material";
import toast from "react-hot-toast";

const EmployeeAttendance = () => {
  const dispatch = useAppDispatch();
  const { records, loading } = useAppSelector((state) => state.employeeAttendance);
  const loginUser = useAppSelector((state) => state.loginSlice.data?.user);

  const [showForm, setShowForm] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [present, setPresent] = useState(true);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    dispatch(fetchAllEmployeeAttendances());
  }, [dispatch]);

  const handleRegister = () => {
    if (!employeeId) return toast.error("Employee ID is required");
    if (!loginUser?.id) return toast.error("Logged in user not found");
    if (!present && !remark.trim()) return toast.error("Remark is required when absent");

    dispatch(
      markEmployeeAttendance({
        employeeId: +employeeId,
        present,
        remark: present ? "Present" : remark,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Attendance recorded");
        setEmployeeId("");
        setRemark("");
        setPresent(true);
        setShowForm(false);
      })
      .catch((err) => toast.error(err));
  };

  const handleToggle = (id: number, current: boolean) => {
    dispatch(updateEmployeeAttendance({ id, present: !current }))
      .unwrap()
      .then(() => toast.success("Status updated"))
      .catch((err) => toast.error(err));
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure to delete this record?")) {
      dispatch(deleteEmployeeAttendance(id))
        .unwrap()
        .then(() => toast.success("Deleted"))
        .catch((err) => toast.error(err));
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Employee Attendance</Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => setShowForm((p) => !p)}
        >
          {showForm ? "Close Form" : "Register Attendance"}
        </Button>
      </Box>

      {showForm && (
        <Card sx={{ mt: 2, mb: 4 }}>
          <CardContent>
            <TextField
              label="Employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />

            <TextField
              select
              label="Status"
              fullWidth
              value={present ? "present" : "absent"}
              onChange={(e) => setPresent(e.target.value === "present")}
              SelectProps={{ native: true }}
              sx={{ mb: 2 }}
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </TextField>

            {!present && (
              <TextField
                label="Remark (required if absent)"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
            )}

            <Button variant="contained" onClick={handleRegister}>
              Save Attendance
            </Button>
          </CardContent>
        </Card>
      )}

      <Typography variant="h6" gutterBottom>
        Attendance Records
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Marked By</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Remark</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>No records found</TableCell>
                </TableRow>
              ) : (
                records.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell>{rec.employee?.fullName || rec.employeeId}</TableCell>
                    <TableCell>{rec.present ? "Present" : "Absent"}</TableCell>
                    <TableCell>{rec.markedBy?.fullName || rec.markedById}</TableCell>
                    <TableCell>{new Date(rec.date).toLocaleDateString()}</TableCell>
                    <TableCell>{rec.remark}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        onClick={() => handleToggle(rec.id, rec.present)}
                      >
                        Toggle
                      </Button>
                      <IconButton color="error" onClick={() => handleDelete(rec.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default EmployeeAttendance;
