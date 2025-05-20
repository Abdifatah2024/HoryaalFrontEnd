import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { fetchExamReport } from "../../Redux/Exam/ExamFinalreportSlice";
import { CircularProgress, Alert, AlertTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel, Button, Box, Typography } from "@mui/material";

interface Class {
  id: number;
  name: string;
}

interface AcademicYear {
  id: number;
  name: string;
}

interface SubjectScore {
  subject: string;
  marks: number;
}

interface StudentReport {
  studentId: number;
  fullName: string;
  subjects: SubjectScore[];
  totalMarks: number;
  rank: number;
}

const CLASS_LIST: Class[] = [
  { id: 1, name: "1A" }, { id: 2, name: "1B" }, { id: 3, name: "1C" },
  { id: 4, name: "1D" }, { id: 5, name: "1E" }, { id: 6, name: "1G" },
  { id: 7, name: "2A" }, { id: 8, name: "2B" }, { id: 9, name: "2C" },
  { id: 10, name: "2D" }, { id: 11, name: "2E" }, { id: 12, name: "2F" },
  { id: 13, name: "3A" }, { id: 14, name: "3B" }, { id: 15, name: "3C" },
  { id: 16, name: "3D" }, { id: 17, name: "3E" }, { id: 18, name: "4A" },
  { id: 19, name: "4B" }, { id: 20, name: "4C" }, { id: 21, name: "4D" },
];

const ACADEMIC_YEARS: AcademicYear[] = [
  { id: 1, name: "2024-2025" },
  { id: 2, name: "2025-2026" },
];

const ExamReportFinal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, report, error } = useSelector((state: RootState) => state.examReport);
  
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string>("");
  const [formError, setFormError] = useState<string>("");

  const handleFetchReport = () => {
    if (!selectedClassId || !selectedAcademicYearId) {
      setFormError("Please select both class and academic year");
      return;
    }
    
    setFormError("");
    dispatch(fetchExamReport({
      classId: Number(selectedClassId),
      academicYearId: Number(selectedAcademicYearId),
    }));
  };

  const selectedClassName = CLASS_LIST.find(c => c.id === Number(selectedClassId))?.name || "";
  const selectedAcademicYearName = ACADEMIC_YEARS.find(y => y.id === Number(selectedAcademicYearId))?.name || "";

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Exam Report
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="class-select-label">Class</InputLabel>
            <Select
              labelId="class-select-label"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              label="Class"
            >
              <MenuItem value="">Select Class</MenuItem>
              {CLASS_LIST.map((cls) => (
                <MenuItem key={cls.id} value={cls.id.toString()}>
                  {cls.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="year-select-label">Academic Year</InputLabel>
            <Select
              labelId="year-select-label"
              value={selectedAcademicYearId}
              onChange={(e) => setSelectedAcademicYearId(e.target.value)}
              label="Academic Year"
            >
              <MenuItem value="">Select Academic Year</MenuItem>
              {ACADEMIC_YEARS.map((year) => (
                <MenuItem key={year.id} value={year.id.toString()}>
                  {year.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            onClick={handleFetchReport}
            variant="contained"
            disabled={loading}
            sx={{ height: 40 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Get Report"}
          </Button>
        </Box>

        {(formError || error) && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <AlertTitle>Error</AlertTitle>
            {formError || error}
          </Alert>
        )}
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {report.length > 0 && (
        <Paper elevation={3} sx={{ mt: 2 }}>
          <Typography variant="h6" component="h2" sx={{ p: 2 }}>
            Report for {selectedClassName} - {selectedAcademicYearName}
          </Typography>
          
          <TableContainer>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  {(report[0] as StudentReport).subjects.map((s) => (
                    <TableCell key={s.subject} sx={{ fontWeight: 'bold' }} align="right">
                      {s.subject}
                    </TableCell>
                  ))}
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Total</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Rank</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.map((student: StudentReport) => (
                  <TableRow key={student.studentId} hover>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>{student.fullName}</TableCell>
                    {student.subjects.map((s) => (
                      <TableCell key={s.subject} align="right">
                        {s.marks}
                      </TableCell>
                    ))}
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {student.totalMarks}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {student.rank}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default ExamReportFinal;