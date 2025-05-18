import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Grid,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../Redux/store";
import { getStudentsByClass, selectStudents } from "../../Redux/Classes/ListStdInClassSlice";
import { registerTenSubjects } from "../../Redux/Exam/registerTenSubjectsSlice";
import { toast } from "react-toastify";
import { Save, Refresh } from "@mui/icons-material";

// Constants
const classList = [
  { id: 1, name: "1A" }, { id: 2, name: "1B" }, { id: 3, name: "1C" },
  { id: 4, name: "1D" }, { id: 5, name: "1E" }, { id: 6, name: "1G" },
  { id: 7, name: "2A" }, { id: 8, name: "2B" }, { id: 9, name: "2C" },
  { id: 10, name: "2D" }, { id: 11, name: "2E" }, { id: 12, name: "2F" },
  { id: 13, name: "3A" }, { id: 14, name: "3B" }, { id: 15, name: "3C" },
  { id: 16, name: "3D" }, { id: 17, name: "3E" }, { id: 18, name: "4A" },
  { id: 19, name: "4B" }, { id: 20, name: "4C" }, { id: 21, name: "4D" },
];

const examTypes = [
  { value: "1", label: "Monthly Exam", maxMarks: 20 },
  { value: "2", label: "Midterm Exam", maxMarks: 30 },
  { value: "3", label: "Final Exam", maxMarks: 50 },
];

const academicYears = [
  { id: 1, year: "2024-2025" },
  { id: 2, year: "2025-2026" },
];

const subjectsList = [
  { id: 1, name: "Chemistry", color: "#4caf50" },
  { id: 2, name: "Biology", color: "#8bc34a" },
  { id: 3, name: "Physics", color: "#2196f3" },
  { id: 4, name: "Math", color: "#673ab7" },
  { id: 5, name: "English", color: "#f44336" },
  { id: 6, name: "Arabic", color: "#ff9800" },
  { id: 7, name: "Islamic", color: "#009688" },
  { id: 8, name: "Geography", color: "#795548" },
  { id: 9, name: "History", color: "#607d8b" },
  { id: 10, name: "Somali", color: "#e91e63" },
];

interface MarksData {
  [studentId: number]: {
    [subjectId: number]: number;
  };
}

const RegisterExam = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { students, loading } = useSelector(selectStudents);

  const [selectedClassId, setSelectedClassId] = useState<number>(1);
  const [examId, setExamId] = useState<string>("");
  const [academicYearId, setAcademicYearId] = useState<string>("");
  const [marksData, setMarksData] = useState<MarksData>({});
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>(subjectsList.map(s => s.id));
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const maxMarks = examTypes.find(e => e.value === examId)?.maxMarks || 0;

  useEffect(() => {
    dispatch(getStudentsByClass(selectedClassId));
  }, [dispatch, selectedClassId]);

  const handleMarksChange = (studentId: number, subjectId: number, value: string) => {
    const parsedValue = parseInt(value) || 0;
    const numericValue = Math.min(Math.max(parsedValue, 0), maxMarks);
    setMarksData(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [subjectId]: numericValue,
      },
    }));
  };

  const handleSaveAll = async () => {
    if (!examId || !academicYearId) {
      toast.error("Please select exam type and academic year");
      return;
    }

    setIsSaving(true);
    try {
      await Promise.all(students.map(student =>
        dispatch(registerTenSubjects({
          studentId: student.id,
          examId: parseInt(examId),
          academicYearId: parseInt(academicYearId),
          scores: selectedSubjects.map(subjectId => ({
            subjectId,
            marks: marksData[student.id]?.[subjectId] || 0,
          })),
        })).unwrap()
      ));
      toast.success("All marks saved successfully");
    } catch (err) {
      toast.error("Failed to save some marks");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubjectToggle = (subjectId: number) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const refreshData = () => {
    dispatch(getStudentsByClass(selectedClassId));
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight={600}>
            Exam Entry Portal
          </Typography>
          <Tooltip title="Refresh">
            <IconButton onClick={refreshData} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Filters */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="medium">
              <InputLabel>Select Class</InputLabel>
              <Select
                value={selectedClassId}
                label="Select Class"
                onChange={(e: SelectChangeEvent<number>) => setSelectedClassId(+e.target.value)}
              >
                {classList.map(cls => (
                  <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Exam Type</InputLabel>
              <Select
                value={examId}
                label="Exam Type"
                onChange={(e) => setExamId(e.target.value)}
              >
                {examTypes.map(exam => (
                  <MenuItem key={exam.value} value={exam.value}>
                    {exam.label} (Max: {exam.maxMarks})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Academic Year</InputLabel>
              <Select
                value={academicYearId}
                label="Academic Year"
                onChange={(e) => setAcademicYearId(e.target.value)}
              >
                {academicYears.map(year => (
                  <MenuItem key={year.id} value={String(year.id)}>{year.year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Subject Filter */}
        <Box mb={3}>
          <Typography variant="subtitle2" gutterBottom>
            Select Subjects:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {subjectsList.map(subject => (
              <Chip
                key={subject.id}
                label={subject.name}
                onClick={() => handleSubjectToggle(subject.id)}
                color={selectedSubjects.includes(subject.id) ? "primary" : "default"}
                variant={selectedSubjects.includes(subject.id) ? "filled" : "outlined"}
                sx={{
                  backgroundColor: selectedSubjects.includes(subject.id) ? subject.color : undefined,
                  color: selectedSubjects.includes(subject.id) ? 'white' : undefined,
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Marks Entry Table */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveAll}
                disabled={isSaving || !examId || !academicYearId}
              >
                {isSaving ? "Saving..." : "Save All"}
              </Button>
            </Box>

            <TableContainer component={Paper} sx={{ maxHeight: '70vh', overflow: 'auto' }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Student</TableCell>
                    {subjectsList
                      .filter(subject => selectedSubjects.includes(subject.id))
                      .map(subject => (
                        <TableCell 
                          key={subject.id}
                          align="center"
                          sx={{
                            backgroundColor: subject.color,
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        >
                          {subject.name}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student, idx) => (
                    <TableRow key={student.id} hover>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 'medium' }}>{student.fullname}</TableCell>
                      {subjectsList
                        .filter(subject => selectedSubjects.includes(subject.id))
                        .map(subject => (
                          <TableCell key={subject.id} align="center" sx={{ p: 0 }}>
                            <TextField
                              inputMode="numeric"
                              value={marksData[student.id]?.[subject.id] || ""}
                              onChange={(e) => handleMarksChange(student.id, subject.id, e.target.value)}
                              InputProps={{
                                inputProps: {
                                  min: 0,
                                  max: maxMarks,
                                  style: {
                                    textAlign: 'center',
                                    MozAppearance: 'textfield',
                                  },
                                },
                                sx: {
                                  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                    display: 'none',
                                  },
                                  '& input': {
                                    padding: '6px 4px',
                                    fontSize: '14px',
                                    width: '100%',
                                    textAlign: 'center',
                                  },
                                },
                              }}
                              sx={{
                                width: '70px',
                                m: 0,
                              }}
                            />
                          </TableCell>
                        ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default RegisterExam;
