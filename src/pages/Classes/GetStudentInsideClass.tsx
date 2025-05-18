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
  useTheme
} from "@mui/material";

// Class list
const classList = [
  { id: 1, name: "1A" }, { id: 2, name: "1B" }, { id: 3, name: "1C" },
  { id: 4, name: "1D" }, { id: 5, name: "1E" }, { id: 6, name: "1F" },
  { id: 7, name: "2A" }, { id: 8, name: "2B" }, { id: 9, name: "2C" },
  { id: 10, name: "2D" }, { id: 11, name: "2F" }, { id: 12, name: "3A" },
  { id: 13, name: "3B" }, { id: 14, name: "3C" }, { id: 15, name: "3D" },
  { id: 16, name: "4A" }, { id: 17, name: "4B" }, { id: 18, name: "4C" },
  { id: 19, name: "4D" }, { id: 20, name: "4E" }, { id: 21, name: "4F" },
];

const StudentClassListStd: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { students, loading, error } = useSelector(selectStudents);
  const [selectedClassId, setSelectedClassId] = useState<number>(classList[0].id);
  const theme = useTheme();

  useEffect(() => {
    dispatch(getStudentsByClass(selectedClassId));
  }, [dispatch, selectedClassId]);

  const handleChange = (e: SelectChangeEvent<number>) => {
    setSelectedClassId(Number(e.target.value));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      {/* Header Section */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          background: theme.palette.background.paper,
          borderLeft: `5px solid ${theme.palette.primary.main}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Student Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              View and manage students by class
            </Typography>
          </Box>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="class-select-label">Select Class</InputLabel>
            <Select
              labelId="class-select-label"
              value={selectedClassId}
              label="Select Class"
              onChange={handleChange}
            >
              {classList.map((cls) => (
                <MenuItem key={cls.id} value={cls.id}>
                  {cls.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Table Section */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center" sx={{ mt: 4 }}>
          {error}
        </Typography>
      ) : students.length === 0 ? (
        <Typography align="center" sx={{ mt: 4 }}>
          No students found in this class.
        </Typography>
      ) : (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>#</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Full Name</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Gender</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Phone</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Phone 2</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Fee ($)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={student.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{student.fullname}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>{student.phone2 || "N/A"}</TableCell>
                  <TableCell>${student.fee}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default StudentClassListStd;
