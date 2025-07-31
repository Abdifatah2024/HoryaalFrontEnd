import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { fetchStudentsWithSameBus } from '../../Redux/Auth/RegstdSlice';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  TextField,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DirectionsBus as BusIcon, Search as SearchIcon } from '@mui/icons-material';

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 1000,
  margin: '0 auto'
}));

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-root': {
    padding: theme.spacing(1.5, 2),
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const SameBusStudents: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const dispatch = useAppDispatch();
  const { sameBusStudents, sameBusLoading, error } = useAppSelector((state) => state.StdRegSlice);

  const handleFetch = () => {
    const idNum = Number(studentId.trim());
    if (!isNaN(idNum) && idNum > 0) {
   dispatch(fetchStudentsWithSameBus(idNum.toString()));

    }
  };

  const busName = sameBusStudents[0]?.bus;

  return (
    <PageContainer>
      <Box mb={3} display="flex" alignItems="center" gap={2}>
        <BusIcon fontSize="large" color="primary" />
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Search Students by Bus
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter a Bus ID to see others who share the same bus
          </Typography>
        </Box>
      </Box>

      <Box mb={4} display="flex" gap={2}>
        <TextField
          label="Enter Bus ID"
          variant="outlined"
          size="small"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
          onClick={handleFetch}
        >
          Fetch Students
        </Button>
      </Box>

      {sameBusLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : sameBusStudents.length === 0 ? (
        <Alert severity="info">No students found yet. Try searching by ID.</Alert>
      ) : (
        <>
          <Typography variant="h6" mb={2}>
            Students using Bus: <strong>{busName}</strong>
          </Typography>
          <Paper elevation={2}>
            <StyledTable>
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Full Name</strong></TableCell>
                  <TableCell><strong>Class</strong></TableCell>
                  <TableCell align="center"><strong>Bus</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sameBusStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.fullname}</TableCell>
                    <TableCell>{student.classes?.name || '-'}</TableCell>
                    <TableCell align="center">
                      <Chip label={student.bus} color="info" size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </StyledTable>
          </Paper>
        </>
      )}
    </PageContainer>
  );
};

export default SameBusStudents;
