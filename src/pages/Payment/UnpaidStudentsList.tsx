import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { fetchAllUnpaidStudents } from '../../Redux/Payment/paymentSlice';
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
  AlertTitle,
  Chip,
  useTheme,
  Avatar,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  AccountBalanceWallet as WalletIcon,
  Info as InfoIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';

// Styled Components
const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 1400,
  margin: '0 auto',
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh'
}));

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-root': {
    padding: theme.spacing(1.5, 2),
    '&.header-cell': {
      backgroundColor: theme.palette.grey[100],
      fontWeight: 600,
      color: theme.palette.text.primary
    }
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

const StatusBadge = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  minWidth: 80,
  '&.paid': {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark
  },
  '&.due': {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark
  }
}));

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

const UnpaidStudentsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { unpaidStudents, loading, error } = useAppSelector((state) => state.payment);
  const componentRef = useRef<HTMLDivElement>(null);
  const [printLoading, setPrintLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllUnpaidStudents());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAllUnpaidStudents());
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @page { 
        size: A4 landscape; 
        margin: 10mm; 
      }
      body { 
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
        font-family: Arial, sans-serif; 
      }
      table { 
        width: 100%; 
        border-collapse: collapse;
      }
      th { 
        background-color: #f5f5f5 !important; 
        font-weight: bold; 
        text-align: left; 
      }
      td, th { 
        padding: 8px; 
        border: 1px solid #ddd; 
      }
      .no-print { 
        display: none !important; 
      }
      .print-header {
        text-align: center;
        margin-bottom: 20px;
      }
      .print-footer {
        margin-top: 20px;
        font-size: 0.8rem;
        text-align: center;
        color: #666;
      }
    `,
    documentTitle: `Unpaid_Students_Report_${new Date().toISOString().slice(0, 10)}`,
    onBeforeGetContent: () => {
      setPrintLoading(true);
      return new Promise((resolve) => {
        setTimeout(() => {
          setPrintLoading(false);
          resolve(null);
        }, 500);
      });
    }
  });

  const handlePrintSafe = async () => {
    if (unpaidStudents.length === 0) {
      alert('No data available to print.');
      return;
    }
    
    if (printLoading) {
      alert('Print is already being prepared.');
      return;
    }

    try {
      await handlePrint();
    } catch (err) {
      console.error('Print error:', err);
      alert('Failed to open print dialog. Please check your browser settings.');
    }
  };

  return (
    <PageContainer>
      {/* Header */}
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 56, height: 56 }}>
            <WalletIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Students with Balance
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Overview of students who have outstanding balances or unpaid months
            </Typography>
          </Box>
        </Box>

        <Box display="flex" gap={1}>
          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh} color="primary" disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Print report">
            <IconButton 
              onClick={handlePrintSafe} 
              color="primary" 
              className="no-print"
              disabled={printLoading || unpaidStudents.length === 0}
            >
              {printLoading ? <CircularProgress size={24} /> : <PrintIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="More information">
            <IconButton color="primary">
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Loading & Error */}
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress size={60} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} action={
          <Button color="inherit" size="small" onClick={handleRefresh}>
            Retry
          </Button>
        }>
          <AlertTitle>Error Loading Data</AlertTitle>
          {error}
        </Alert>
      )}

      {/* Table */}
      {!loading && !error && (
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell className="header-cell">ID</TableCell>
                <TableCell className="header-cell">Student Name</TableCell>
                <TableCell className="header-cell">Class</TableCell>
                <TableCell className="header-cell" align="right">Total Required</TableCell>
                <TableCell className="header-cell" align="right">Total Paid</TableCell>
                <TableCell className="header-cell" align="right">Unpaid Months</TableCell>
                <TableCell className="header-cell" align="right">Carry Forward</TableCell>
                <TableCell className="header-cell" align="right">Balance Due</TableCell>
                <TableCell className="header-cell" align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {unpaidStudents.map((student) => (
                <TableRow key={student.studentId} hover>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{student.name}</TableCell>
                  <TableCell>
                    <Chip label={student.className} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">{formatCurrency(student.totalRequired)}</TableCell>
                  <TableCell align="right">{formatCurrency(student.totalPaid)}</TableCell>
                  <TableCell align="right">
                    <Chip label={student.unpaidMonths} color="warning" size="small" />
                  </TableCell>
                  <TableCell align="right">{formatCurrency(student.carryForward)}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(student.balanceDue)}</TableCell>
                  {/* <TableCell align="center">
                    <StatusBadge
                      label={student.balanceDue > 0 ? 'Due' : 'Paid'}
                      className={student.balanceDue > 0 ? 'due' : 'paid'}
                    />
                  </TableCell> */}
                  <TableCell align="center">
  <StatusBadge
    label={student.balanceDue > 0 ? 'Due' : 'Paid'}
    className={`text-white font-semibold px-2 py-1 rounded ${
      student.balanceDue > 0 ? 'bg-red-500' : 'bg-green-500'
    }`}
  />
</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </StyledTable>

          {unpaidStudents.length === 0 && (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200} p={4}>
              <Typography variant="h6" color="text.secondary">
                No students with outstanding balances found
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* Printable content - hidden on screen */}
      <div style={{ position: 'absolute', left: '-10000px', top: 0 }}>
        <div ref={componentRef}>
          {unpaidStudents.length > 0 && (
            <Box p={3}>
              <div className="print-header">
                <Typography variant="h4" gutterBottom>
                  Students with Outstanding Balances
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </Typography>
                <Typography variant="subtitle2">
                  Total Students: {unpaidStudents.length}
                </Typography>
              </div>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Class</TableCell>
                    <TableCell align="right">Total Required</TableCell>
                    <TableCell align="right">Total Paid</TableCell>
                    <TableCell align="right">Unpaid Months</TableCell>
                    <TableCell align="right">Carry Forward</TableCell>
                    <TableCell align="right">Balance Due</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {unpaidStudents.map((student) => (
                    <TableRow key={student.studentId}>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.className}</TableCell>
                      <TableCell align="right">{formatCurrency(student.totalRequired)}</TableCell>
                      <TableCell align="right">{formatCurrency(student.totalPaid)}</TableCell>
                      <TableCell align="right">{student.unpaidMonths}</TableCell>
                      <TableCell align="right">{formatCurrency(student.carryForward)}</TableCell>
                      <TableCell align="right">{formatCurrency(student.balanceDue)}</TableCell>
                      <TableCell align="center">
                        {student.balanceDue > 0 ? 'Due' : 'Paid'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="print-footer">
                <Typography variant="body2">
                  * This report includes all students with outstanding balances as of the generation date.
                </Typography>
              </div>
            </Box>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default UnpaidStudentsList;