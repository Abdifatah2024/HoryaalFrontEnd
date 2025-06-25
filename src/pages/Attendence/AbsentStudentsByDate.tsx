
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Chip,
  styled,
  useMediaQuery,
  Theme
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { AppDispatch, RootState } from '../../Redux/store';
import { fetchAbsentStudentsByDate } from '../../Redux/Attedence/AttendancePeClassSlice';
import { motion } from 'framer-motion';
import {
  Refresh as RefreshIcon,
  CalendarToday as CalendarIcon,
  ErrorOutline as ErrorIcon,
  CheckCircleOutline as SuccessIcon
} from '@mui/icons-material';

// Class list used for mapping classId to readable names
const classList = [
  { id: 1, name: "1A" }, { id: 2, name: "1B" }, { id: 3, name: "1C" },
  { id: 4, name: "1D" }, { id: 5, name: "1E" }, { id: 6, name: "1G" },
  { id: 7, name: "2A" }, { id: 8, name: "2B" }, { id: 9, name: "2C" },
  { id: 10, name: "2D" }, { id: 11, name: "2E" }, { id: 12, name: "2F" },
  { id: 13, name: "3A" }, { id: 14, name: "3B" }, { id: 15, name: "3C" },
  { id: 16, name: "3D" }, { id: 17, name: "3E" }, { id: 18, name: "4A" },
  { id: 19, name: "4B" }, { id: 20, name: "4C" }, { id: 21, name: "4D" },
];

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    transition: 'background-color 0.3s ease',
  },
}));

const AnimatedBox = motion(Box);

const AbsentStudentsByDate: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { absentStudents, loading, errorMessage } = useSelector((state: RootState) => state.attendancePerClass);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  useEffect(() => {
    if (selectedDate) {
      dispatch(fetchAbsentStudentsByDate(selectedDate.format('YYYY-MM-DD')));
    }
  }, [dispatch, selectedDate]);

  const getClassNameById = (classId: number) => {
    const foundClass = classList.find(cls => cls.id === classId);
    return foundClass ? foundClass.name : `Class ${classId}`;
  };

  const getClassColor = (classId: number) => {
    const gradeLevel = classId <= 6 ? 1 :
                      classId <= 12 ? 2 :
                      classId <= 17 ? 3 : 4;
    switch (gradeLevel) {
      case 1: return 'primary';
      case 2: return 'secondary';
      case 3: return 'success';
      case 4: return 'warning';
      default: return 'default';
    }
  };

  const getReasonChipColor = (reason: string) => {
    if (reason.includes('Sick')) return 'error';
    if (reason.includes('Travel')) return 'warning';
    if (reason.includes('Family')) return 'info';
    return 'default';
  };

  const handleRefresh = () => {
    if (selectedDate) {
      dispatch(fetchAbsentStudentsByDate(selectedDate.format('YYYY-MM-DD')));
    }
  };

  return (
    <AnimatedBox
      p={isMobile ? 2 : 3}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Student Absence Tracker
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="caption" color="text.secondary">
            Last updated: {dayjs().format('h:mm A')}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <AnimatedBox
        mb={4}
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        alignItems={isMobile ? 'stretch' : 'center'}
        gap={2}
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={(date) => setSelectedDate(date as Dayjs | null)}
          slots={{
            openPickerIcon: CalendarIcon,
          }}
          sx={{ flex: 1 }}
        />
        <Button
          variant="contained"
          onClick={handleRefresh}
          disabled={loading}
          startIcon={<RefreshIcon />}
          sx={{ px: 3 }}
        >
          Load Data
        </Button>
      </AnimatedBox>

      {loading && (
        <Box textAlign="center" py={4}>
          <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main' }} />
          <Typography mt={2}>Loading attendance data...</Typography>
        </Box>
      )}

      {errorMessage && (
        <AnimatedBox initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
          <Alert
            severity="error"
            icon={<ErrorIcon fontSize="inherit" />}
            sx={{ mb: 3 }}
          >
            <Typography fontWeight="bold">Error loading data:</Typography>
            {errorMessage}
          </Alert>
        </AnimatedBox>
      )}

      {!loading && absentStudents.length === 0 && !errorMessage && (
        <AnimatedBox textAlign="center" py={4} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <SuccessIcon color="success" sx={{ fontSize: 60 }} />
          <Typography variant="h6" mt={2} color="text.secondary">
            No absent students found for {selectedDate?.format('MMMM D, YYYY')}
          </Typography>
          <Typography variant="body2" mt={1}>
            Perfect attendance for this day!
          </Typography>
        </AnimatedBox>
      )}

      {!loading && absentStudents.length > 0 && (
        <AnimatedBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Typography variant="h6" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Absence Details
            <Chip label={`${absentStudents.length} students`} color="primary" size="small" />
          </Typography>

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.main' }}>
                  <TableCell sx={{ color: 'common.white', fontWeight: 600 }}>Student Name</TableCell>
                  <TableCell sx={{ color: 'common.white', fontWeight: 600 }}>Class</TableCell>
                  <TableCell sx={{ color: 'common.white', fontWeight: 600 }}>Reason</TableCell>
                  <TableCell sx={{ color: 'common.white', fontWeight: 600 }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {absentStudents.map((student) => (
                  <StyledTableRow key={student.studentId}>
                    <TableCell>
                      <Typography fontWeight={500}>{student.fullname}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {student.studentId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getClassNameById(student.classId)}
                        color={getClassColor(student.classId)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={student.remark}
                        color={getReasonChipColor(student.remark)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {dayjs(student.date).format('MMM D, YYYY')}
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AnimatedBox>
      )}
    </AnimatedBox>
  );
};

export default AbsentStudentsByDate;
