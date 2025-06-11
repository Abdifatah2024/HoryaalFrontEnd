import React, { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  fetchStudentsWithBus,
  fetchStudentsWithoutBus,
} from "../../Redux/studentBusSlice";
import { 
  TableContainer, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Box,
  Chip,
  Stack,
  Divider
} from "@mui/material";
import { formatCurrency } from "../../types/Register";
import { School, DirectionsBus, Paid } from "@mui/icons-material";

// Expected bus fee per student
const EXPECTED_BUS_FEE = 15;

const StudentBusList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { withBus, withoutBus, loading, error } = useAppSelector(
    (state) => state.studentBus
  );

  useEffect(() => {
    dispatch(fetchStudentsWithBus());
    dispatch(fetchStudentsWithoutBus());
  }, [dispatch]);

  // Calculate totals and bus fee analysis
  const [withBusTotals, withoutBusTotals, grandTotals, busFeeAnalysis] = useMemo(() => {
    const calculateTotals = (students: typeof withBus) => ({
      totalFee: students.reduce((sum, student) => sum + student.totalFee, 0),
      schoolFee: students.reduce((sum, student) => sum + student.schoolFee, 0),
      busFee: students.reduce((sum, student) => sum + student.busFee, 0),
      count: students.length
    });

    const withBusTotals = calculateTotals(withBus);
    const withoutBusTotals = calculateTotals(withoutBus);
    
    const grandTotals = {
      totalFee: withBusTotals.totalFee + withoutBusTotals.totalFee,
      schoolFee: withBusTotals.schoolFee + withoutBusTotals.schoolFee,
      busFee: withBusTotals.busFee + withoutBusTotals.busFee,
      count: withBusTotals.count + withoutBusTotals.count
    };

    // Bus fee analysis
    const expectedBusFee = withBus.length * EXPECTED_BUS_FEE;
    const actualBusFee = withBusTotals.busFee;
    const busFeeDifference = expectedBusFee - actualBusFee;
    const busFeeCompliance = actualBusFee / expectedBusFee * 100;

    const busFeeAnalysis = {
      expected: expectedBusFee,
      actual: actualBusFee,
      difference: busFeeDifference,
      compliance: busFeeCompliance,
      expectedPerStudent: EXPECTED_BUS_FEE
    };

    return [withBusTotals, withoutBusTotals, grandTotals, busFeeAnalysis];
  }, [withBus, withoutBus]);

  const renderTable = (
    title: string, 
    data: typeof withBus, 
    totals: typeof withBusTotals
  ) => (
    <Grid item xs={12} md={6}>
      <Paper elevation={2} sx={{ overflow: "hidden", height: '100%' }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ 
          p: 2, 
          bgcolor: title.includes("With") ? "primary.main" : "secondary.main", 
          color: "white" 
        }}>
          {title.includes("With") ? <DirectionsBus /> : <School />}
          <Typography variant="h6">{title}</Typography>
          <Chip 
            label={`${totals.count} students`} 
            sx={{ 
              ml: 'auto', 
              color: 'inherit', 
              backgroundColor: 'rgba(255,255,255,0.2)' 
            }} 
          />
        </Stack>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Class</TableCell>
                <TableCell align="right">Total Fee</TableCell>
                <TableCell align="right">School Fee</TableCell>
                <TableCell align="right">Bus Fee</TableCell>
                {title.includes("With") && (
                  <TableCell align="right">Fee Status</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((student) => (
                <TableRow 
                  key={student.id} 
                  hover
                  sx={{ '&:last-child td': { borderBottom: 0 } }}
                >
                  <TableCell>{student.fullname}</TableCell>
                  <TableCell>{student.classes.name}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(student.totalFee)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(student.schoolFee)}
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      fontWeight: 600,
                      color: student.busFee > 0 ? 'success.dark' : 'text.secondary'
                    }}
                  >
                    {formatCurrency(student.busFee)}
                  </TableCell>
                  {title.includes("With") && (
                    <TableCell align="right">
                      <Chip 
                        size="small"
                        label={
                          student.busFee >= EXPECTED_BUS_FEE 
                            ? "Full" 
                            : student.busFee > 0 
                              ? "Partial" 
                              : "None"
                        }
                        color={
                          student.busFee >= EXPECTED_BUS_FEE 
                            ? "success" 
                            : student.busFee > 0 
                              ? "warning" 
                              : "error"
                        }
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
              
              {/* Footer row with totals */}
              <TableRow sx={{ 
                '& td': { 
                  fontWeight: 'bold', 
                  backgroundColor: 'action.hover' 
                } 
              }}>
                <TableCell colSpan={2} align="right">Totals:</TableCell>
                <TableCell align="right">{formatCurrency(totals.totalFee)}</TableCell>
                <TableCell align="right">{formatCurrency(totals.schoolFee)}</TableCell>
                <TableCell align="right">{formatCurrency(totals.busFee)}</TableCell>
                {title.includes("With") && <TableCell />}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        {data.length === 0 && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              No students found
            </Typography>
          </Box>
        )}
      </Paper>
    </Grid>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading student data: {error}
      </Alert>
    );
  }

  return (
    <>
      <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h5" gutterBottom>
          Student Bus Service Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="textSecondary">
                Total Students
              </Typography>
              <Typography variant="h4">{grandTotals.count}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="textSecondary">
                Bus Service Users
              </Typography>
              <Typography variant="h4">
                {withBus.length} 
                <Typography variant="body2" color="textSecondary">
                  ({Math.round((withBus.length / grandTotals.count) * 100)}%)
                </Typography>
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="textSecondary">
                Expected Bus Revenue
              </Typography>
              <Typography variant="h4">
                {formatCurrency(busFeeAnalysis.expected)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="textSecondary">
                Actual Bus Revenue
              </Typography>
              <Typography variant="h4" 
                sx={{ 
                  color: busFeeAnalysis.actual >= busFeeAnalysis.expected 
                    ? 'success.main' 
                    : 'error.main'
                }}
              >
                {formatCurrency(busFeeAnalysis.actual)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {renderTable("Students With Bus Service", withBus, withBusTotals)}
        {renderTable("Students Without Bus Service", withoutBus, withoutBusTotals)}
      </Grid>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Bus Fee Analysis */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <DirectionsBus sx={{ mr: 1 }} /> Bus Fee Analysis
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Typography variant="body2">Expected Fee per Student:</Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography variant="body1" fontWeight="bold">
                  {formatCurrency(EXPECTED_BUS_FEE)}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2">Students Using Bus:</Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography variant="body1" fontWeight="bold">
                  {withBus.length} students
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2">Total Expected Revenue:</Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography variant="body1" fontWeight="bold">
                  {formatCurrency(busFeeAnalysis.expected)}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2">Actual Revenue Collected:</Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography 
                  variant="body1" 
                  fontWeight="bold"
                  color={busFeeAnalysis.actual >= busFeeAnalysis.expected ? 'success.main' : 'error.main'}
                >
                  {formatCurrency(busFeeAnalysis.actual)}
                </Typography>
              </Grid>
              
              <Divider sx={{ my: 1, width: '100%' }} />
              
              <Grid item xs={6}>
                <Typography variant="body2">Revenue Difference:</Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography 
                  variant="body1" 
                  fontWeight="bold"
                  color={busFeeAnalysis.difference <= 0 ? 'success.main' : 'error.main'}
                >
                  {busFeeAnalysis.difference <= 0 
                    ? `+${formatCurrency(-busFeeAnalysis.difference)}` 
                    : `-${formatCurrency(busFeeAnalysis.difference)}`}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2">Compliance Rate:</Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography 
                  variant="body1" 
                  fontWeight="bold"
                  color={busFeeAnalysis.compliance >= 95 ? 'success.main' : busFeeAnalysis.compliance >= 80 ? 'warning.main' : 'error.main'}
                >
                  {busFeeAnalysis.compliance.toFixed(1)}%
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Payment Compliance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Paid sx={{ mr: 1 }} /> Payment Compliance
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Stack direction="row" alignItems="center">
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    bgcolor: 'success.main', 
                    mr: 1, 
                    borderRadius: '50%' 
                  }} />
                  <Typography variant="body2">Fully Paid ({EXPECTED_BUS_FEE})</Typography>
                </Stack>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography variant="body1" fontWeight="bold">
                  {
                    withBus.filter(s => s.busFee >= EXPECTED_BUS_FEE).length
                  } students
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Stack direction="row" alignItems="center">
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    bgcolor: 'warning.main', 
                    mr: 1, 
                    borderRadius: '50%' 
                  }} />
                  <Typography variant="body2">Partially Paid (&lt; {EXPECTED_BUS_FEE})</Typography>
                </Stack>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography variant="body1" fontWeight="bold">
                  {
                    withBus.filter(s => s.busFee > 0 && s.busFee < EXPECTED_BUS_FEE).length
                  } students
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Stack direction="row" alignItems="center">
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    bgcolor: 'error.main', 
                    mr: 1, 
                    borderRadius: '50%' 
                  }} />
                  <Typography variant="body2">Not Paid (0)</Typography>
                </Stack>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography variant="body1" fontWeight="bold">
                  {
                    withBus.filter(s => s.busFee === 0).length
                  } students
                </Typography>
              </Grid>
              
              <Divider sx={{ my: 1, width: '100%' }} />
              
              <Grid item xs={6}>
                <Typography variant="body2">Total Outstanding:</Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography 
                  variant="body1" 
                  fontWeight="bold"
                  color="error.main"
                >
                  {formatCurrency(busFeeAnalysis.difference)}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2">Potential Revenue:</Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography 
                  variant="body1" 
                  fontWeight="bold"
                  color="success.main"
                >
                  {formatCurrency(busFeeAnalysis.expected)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Financial Summary */}
      <Paper sx={{ p: 3, bgcolor: 'success.light' }}>
        <Typography variant="h6" gutterBottom>
          Financial Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Typography>Total School Fees:</Typography>
            <Typography variant="h6">{formatCurrency(grandTotals.schoolFee)}</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography>Expected Bus Revenue:</Typography>
            <Typography variant="h6">{formatCurrency(busFeeAnalysis.expected)}</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography>Actual Bus Revenue:</Typography>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold',
              color: busFeeAnalysis.actual >= busFeeAnalysis.expected 
                ? 'success.dark' 
                : 'error.dark'
            }}>
              {formatCurrency(busFeeAnalysis.actual)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography>Combined Revenue:</Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {formatCurrency(grandTotals.totalFee)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default StudentBusList;