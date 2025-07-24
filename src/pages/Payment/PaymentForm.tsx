// // import React, { useEffect, useState, useRef } from 'react';
// // import { useAppDispatch, useAppSelector } from '../../Redux/store';
// // import {
// //   submitPayment,
// //   fetchPaymentHistory,
// //   fetchStudentBalanceSummary
// // } from '../../Redux/Payment/paymentSlice';
// // import { useReactToPrint } from 'react-to-print';
// // import {
// //   Box, Typography, TextField, Button, Grid, Alert, 
// //   Paper, InputAdornment, Table, TableBody, TableCell, 
// //   TableRow, TableHead, Card, CardContent, Divider,
// //   Stack, IconButton, CircularProgress
// // } from '@mui/material';
// // import {
// //   Search as SearchIcon, Payment as PaymentIcon,
// //   Badge as BadgeIcon, Print as PrintIcon, 
// //   ArrowBack as ArrowBackIcon, Autorenew as AutorenewIcon
// // } from '@mui/icons-material';

// // // Import the generate fees actions
// // import {
// //   triggerGenerateFees,
// //   clearGenerateFeesMessage
// // } from '../../Redux/Payment/FeegenerateSlice';

// // const formatCurrency = (value: number | string) =>
// //   new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value));

// // const StudentPaymentPage: React.FC = () => {
// //   const dispatch = useAppDispatch();
// //   const { loading, error, paymentResponse, balanceSummary } = useAppSelector(state => state.payment);
// //   const generateFeesState = useAppSelector(state => state.generateFees);

// //   const [studentId, setStudentId] = useState<number | null>(null);
// //   const [searchInput, setSearchInput] = useState('');
// //   const [form, setForm] = useState({
// //     amountPaid: 0,
// //     discount: 0,
// //     discountReason: '',
// //     description: '',
// //     month: new Date().getMonth() + 1,
// //     year: new Date().getFullYear()
// //   });

// //   const receiptRef = useRef<HTMLDivElement>(null);
// //   const handlePrint = useReactToPrint({ content: () => receiptRef.current });

// //   useEffect(() => {
// //     if (studentId !== null) {
// //       dispatch(fetchPaymentHistory(studentId));
// //       dispatch(fetchStudentBalanceSummary(studentId));
// //     }
// //   }, [dispatch, studentId]);

// //   const handleSearch = () => {
// //     const id = parseInt(searchInput);
// //     if (!isNaN(id)) setStudentId(id);
// //   };

// //   const handleGenerateFees = () => {
// //     dispatch(triggerGenerateFees());
// //   };

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const { name, value } = e.target;
// //     setForm(prev => ({ ...prev, [name]: name === 'amountPaid' || name === 'discount' ? parseFloat(value) || 0 : value }));
// //   };

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!studentId || form.amountPaid <= 0) return;

// //     dispatch(submitPayment({
// //       studentId,
// //       amountPaid: form.amountPaid,
// //       discount: form.discount,
// //       discountReason: form.discountReason,
// //       description: form.description,
// //       month: form.month,
// //       year: form.year
// //     }));
// //   };

// //   const resetForm = () => {
// //     setStudentId(null);
// //     setSearchInput('');
// //     setForm({
// //       amountPaid: 0,
// //       discount: 0,
// //       discountReason: '',
// //       description: '',
// //       month: new Date().getMonth() + 1,
// //       year: new Date().getFullYear()
// //     });
// //   };

// //   return (
// //     <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
// //       <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
// //         {studentId && (
// //           <IconButton onClick={resetForm} color="primary">
// //             <ArrowBackIcon />
// //           </IconButton>
// //         )}
// //         <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
// //           Student Payment Portal
// //         </Typography>
// //       </Stack>

// //       {/* Search Section */}
// //       <Card sx={{ mb: 3, boxShadow: 3 }}>
// //         <CardContent>
// //           <Stack direction="row" spacing={2} alignItems="center">
// //             <TextField
// //               label="Student ID"
// //               value={searchInput}
// //               onChange={(e) => setSearchInput(e.target.value)}
// //               onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
// //               fullWidth
// //               size="small"
// //               InputProps={{
// //                 startAdornment: (
// //                   <InputAdornment position="start">
// //                     <BadgeIcon color="primary" />
// //                   </InputAdornment>
// //                 ),
// //               }}
// //             />
// //             <Button 
// //               variant="contained" 
// //               onClick={handleSearch} 
// //               startIcon={<SearchIcon />}
// //               sx={{ height: 40, minWidth: 120 }}
// //             >
// //               Search
// //             </Button>
// //             {/* Added Green Generate Button with proper functionality */}
// //             <Button 
// //               variant="contained" 
// //               onClick={handleGenerateFees}
// //               disabled={generateFeesState.loading}
// //               startIcon={
// //                 generateFeesState.loading ? (
// //                   <CircularProgress size={20} />
// //                 ) : (
// //                   <AutorenewIcon />
// //                 )
// //               }
// //               sx={{ 
// //                 height: 40, 
// //                 minWidth: 120,
// //                 backgroundColor: '#4caf50',
// //                 '&:hover': {
// //                   backgroundColor: '#388e3c',
// //                 }
// //               }}
// //             >
// //               Generate
// //             </Button>
// //           </Stack>
// //         </CardContent>
// //       </Card>

// //       {/* System Alerts for Generate Fees */}
// //       {generateFeesState.message && (
// //         <Alert
// //           severity="success"
// //           onClose={() => dispatch(clearGenerateFeesMessage())}
// //           sx={{ mb: 2 }}
// //         >
// //           {generateFeesState.message}
// //         </Alert>
// //       )}
// //       {generateFeesState.error && (
// //         <Alert
// //           severity="error"
// //           onClose={() => dispatch(clearGenerateFeesMessage())}
// //           sx={{ mb: 2 }}
// //         >
// //           {generateFeesState.error}
// //         </Alert>
// //       )}

// //       {/* Rest of your existing code remains the same */}
// //       {studentId && (
// //         <Grid container spacing={3}>
// //           {/* Payment Form Section */}
// //           <Grid item xs={12} md={6}>
// //             <Card sx={{ boxShadow: 3 }}>
// //               <CardContent>
// //                 <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
// //                   Payment Information
// //                 </Typography>
                
// //                 <form onSubmit={handleSubmit}>
// //                   <Grid container spacing={2}>
// //                     <Grid item xs={12} sm={6}>
// //                       <TextField
// //                         label="Amount Paid"
// //                         name="amountPaid"
// //                         value={form.amountPaid}
// //                         onChange={handleChange}
// //                         type="number"
// //                         fullWidth
// //                         size="small"
// //                         InputProps={{
// //                           startAdornment: (
// //                             <InputAdornment position="start">$</InputAdornment>
// //                           ),
// //                         }}
// //                       />
// //                     </Grid>
// //                     <Grid item xs={12} sm={6}>
// //                       <TextField
// //                         label="Discount"
// //                         name="discount"
// //                         value={form.discount}
// //                         onChange={handleChange}
// //                         type="number"
// //                         fullWidth
// //                         size="small"
// //                         InputProps={{
// //                           startAdornment: (
// //                             <InputAdornment position="start">$</InputAdornment>
// //                           ),
// //                         }}
// //                       />
// //                     </Grid>
// //                     <Grid item xs={12}>
// //                       <TextField
// //                         label="Discount Reason"
// //                         name="discountReason"
// //                         value={form.discountReason}
// //                         onChange={handleChange}
// //                         fullWidth
// //                         size="small"
// //                       />
// //                     </Grid>
// //                     <Grid item xs={12}>
// //                       <TextField
// //                         label="Description (e.g., ZAAD - 4740303)"
// //                         name="description"
// //                         value={form.description}
// //                         onChange={handleChange}
// //                         fullWidth
// //                         size="small"
// //                       />
// //                     </Grid>
// //                     <Grid item xs={12} sm={6}>
// //                       <TextField
// //                         label="Month"
// //                         name="month"
// //                         value={form.month}
// //                         onChange={handleChange}
// //                         type="number"
// //                         fullWidth
// //                         size="small"
// //                       />
// //                     </Grid>
// //                     <Grid item xs={12} sm={6}>
// //                       <TextField
// //                         label="Year"
// //                         name="year"
// //                         value={form.year}
// //                         onChange={handleChange}
// //                         type="number"
// //                         fullWidth
// //                         size="small"
// //                       />
// //                     </Grid>
// //                     <Grid item xs={12}>
// //                       <Button
// //                         type="submit"
// //                         variant="contained"
// //                         disabled={loading}
// //                         fullWidth
// //                         size="large"
// //                         startIcon={<PaymentIcon />}
// //                         sx={{ mt: 1 }}
// //                       >
// //                         {loading ? 'Processing...' : 'Submit Payment'}
// //                       </Button>
// //                     </Grid>
// //                   </Grid>
// //                 </form>

// //                 {error && (
// //                   <Alert severity="error" sx={{ mt: 2 }}>
// //                     {error}
// //                   </Alert>
// //                 )}
// //               </CardContent>
// //             </Card>

// //             {paymentResponse && (
// //               <Card sx={{ mt: 3, boxShadow: 3 }}>
// //                 <CardContent>
// //                   <Alert severity="success" sx={{ mb: 2 }}>
// //                     {paymentResponse.message}
// //                   </Alert>
// //                   <Paper ref={receiptRef} sx={{ p: 3, border: '1px dashed #ddd' }}>
// //                     <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
// //                       Payment Voucher
// //                     </Typography>
// //                     <Divider sx={{ my: 2 }} />
// //                     <Stack spacing={1.5}>
// //                       <Typography>
// //                         <strong>Name:</strong> {paymentResponse.StudentName}
// //                       </Typography>
// //                       <Typography>
// //                         <strong>Amount Paid:</strong> {formatCurrency(paymentResponse.payment.amountPaid)}
// //                       </Typography>
// //                       <Typography>
// //                         <strong>Discount:</strong> {formatCurrency(paymentResponse.payment.discount)}
// //                       </Typography>
// //                       <Typography>
// //                         <strong>Description:</strong> {paymentResponse.payment.Description}
// //                       </Typography>
// //                       <Typography>
// //                         <strong>Month:</strong> {form.month}
// //                       </Typography>
// //                       <Typography>
// //                         <strong>Year:</strong> {form.year}
// //                       </Typography>
// //                     </Stack>
// //                     <Button
// //                       variant="outlined"
// //                       onClick={handlePrint}
// //                       startIcon={<PrintIcon />}
// //                       sx={{ mt: 3 }}
// //                     >
// //                       Print Voucher
// //                     </Button>
// //                   </Paper>
// //                 </CardContent>
// //               </Card>
// //             )}
// //           </Grid>

// //           {/* Balance Summary Section */}
// //           <Grid item xs={12} md={6}>
// //             <Card sx={{ boxShadow: 3, height: '100%' }}>
// //               <CardContent>
// //                 <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
// //                   Balance Summary
// //                 </Typography>
                
// //                 {balanceSummary && (
// //                   <>
// //                     <Stack spacing={2} sx={{ mb: 3 }}>
// //                       <Stack direction="row" justifyContent="space-between">
// //                         <Typography>Monthly Fee:</Typography>
// //                         <Typography fontWeight={500}>
// //                           {formatCurrency(balanceSummary.monthlyFee)}
// //                         </Typography>
// //                       </Stack>
// //                       <Stack direction="row" justifyContent="space-between">
// //                         <Typography>Unpaid Months:</Typography>
// //                         <Typography fontWeight={500}>
// //                           {balanceSummary.unpaidMonths}
// //                         </Typography>
// //                       </Stack>
// //                     </Stack>

// //                     {balanceSummary.unpaidDetails && (
// //                       <>
// //                         <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
// //                           Unpaid Details
// //                         </Typography>
// //                         <Table size="small" sx={{ mt: 1 }}>
// //                           <TableHead>
// //                             <TableRow>
// //                               <TableCell sx={{ fontWeight: 600 }}>Period</TableCell>
// //                               <TableCell align="right" sx={{ fontWeight: 600 }}>Due</TableCell>
// //                               <TableCell align="right" sx={{ fontWeight: 600 }}>Paid</TableCell>
// //                               <TableCell align="right" sx={{ fontWeight: 600 }}>Balance</TableCell>
// //                             </TableRow>
// //                           </TableHead>
// //                           <TableBody>
// //                             {balanceSummary.unpaidDetails.map((item: any, idx: number) => (
// //                               <TableRow key={idx} hover>
// //                                 <TableCell>{`${item.month}/${item.year}`}</TableCell>
// //                                 <TableCell align="right">{formatCurrency(item.due)}</TableCell>
// //                                 <TableCell align="right">{formatCurrency(item.paid)}</TableCell>
// //                                 <TableCell align="right" sx={{ color: 'error.main', fontWeight: 500 }}>
// //                                   {formatCurrency(item.due - item.paid)}
// //                                 </TableCell>
// //                               </TableRow>
// //                             ))}
// //                           </TableBody>
// //                         </Table>
// //                       </>
// //                     )}
// //                   </>
// //                 )}
// //               </CardContent>
// //             </Card>
// //           </Grid>
// //         </Grid>
// //       )}
// //     </Box>
// //   );
// // };

// // export default StudentPaymentPage;
import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import {
  submitPayment,
  fetchPaymentHistory,
  fetchStudentBalanceSummary
} from '../../Redux/Payment/paymentSlice';
import {
  triggerGenerateFees, // Import the action for generating fees
  clearGenerateFeesMessage // Import action to clear generate fees messages
} from '../../Redux/Payment/FeegenerateSlice'; // Adjust path if necessary

import { useReactToPrint } from 'react-to-print';
import {
  Box, Typography, TextField, Button, Grid, Alert,
  Paper, InputAdornment, Table, TableBody, TableCell,
  TableRow, TableHead, Card, CardContent, Divider,
  Stack, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon, Payment as PaymentIcon,
  Badge as BadgeIcon, Print as PrintIcon,
  ArrowBack as ArrowBackIcon, Autorenew as AutorenewIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const formatCurrency = (value: number | string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value));

const StudentPaymentPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, paymentResponse, balanceSummary } = useAppSelector(state => state.payment);
  const generateFeesState = useAppSelector(state => state.generateFees); // State for generate fees

  const [studentId, setStudentId] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [form, setForm] = useState({
    amountPaid: 0,
    discount: 0,
    discountReason: '',
    description: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [showVoucher, setShowVoucher] = useState(false);

  const receiptRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    pageStyle: `
      @page { size: auto; margin: 5mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
      }
    `
  });

  useEffect(() => {
    if (studentId !== null) {
      dispatch(fetchPaymentHistory(studentId));
      dispatch(fetchStudentBalanceSummary(studentId));
    }
  }, [dispatch, studentId]);

  useEffect(() => {
    if (paymentResponse && paymentResponse.payment) {
      setShowVoucher(true);
    }
  }, [paymentResponse]);

  const handleSearch = () => {
    const id = parseInt(searchInput);
    if (!isNaN(id)) setStudentId(id);
  };

  // Make the Generate Fees button functional
  const handleGenerateFees = () => {
    dispatch(triggerGenerateFees());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'amountPaid' || name === 'discount' ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || form.amountPaid <= 0) return;

    dispatch(submitPayment({
      studentId,
      amountPaid: form.amountPaid,
      discount: form.discount,
      discountReason: form.discountReason,
      description: form.description,
      month: form.month,
      year: form.year
    }));
  };

  const resetForm = () => {
    setStudentId(null);
    setSearchInput('');
    setForm({
      amountPaid: 0,
      discount: 0,
      discountReason: '',
      description: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    });
    setShowVoucher(false);
  };

  const handleCloseVoucher = () => {
    setShowVoucher(false);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        {studentId && (
          <IconButton onClick={resetForm} color="primary">
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Student Payment Portal
        </Typography>
      </Stack>

      {/* Search Section */}
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Student ID"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
              sx={{ height: 40, minWidth: 120 }}
            >
              Search
            </Button>
            <Button
              variant="contained"
              onClick={handleGenerateFees}
              disabled={generateFeesState.loading}
              startIcon={
                generateFeesState.loading ? (
                  <CircularProgress size={20} />
                ) : (
                  <AutorenewIcon />
                )
              }
              sx={{
                height: 40,
                minWidth: 120,
                backgroundColor: '#4caf50',
                '&:hover': {
                  backgroundColor: '#388e3c',
                }
              }}
            >
              Generate
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* System Alerts for Generate Fees */}
      {generateFeesState.message && (
        <Alert
          severity="success"
          onClose={() => dispatch(clearGenerateFeesMessage())}
          sx={{ mb: 2 }}
        >
          {generateFeesState.message}
        </Alert>
      )}
      {generateFeesState.error && (
        <Alert
          severity="error"
          onClose={() => dispatch(clearGenerateFeesMessage())}
          sx={{ mb: 2 }}
        >
          {generateFeesState.error}
        </Alert>
      )}

      {/* Voucher Dialog */}
      <Dialog open={showVoucher} onClose={handleCloseVoucher} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Payment Voucher
          </Typography>
        </DialogTitle>
        <DialogContent>
          {paymentResponse?.payment && (
            <Paper ref={receiptRef} sx={{ p: 3, border: '1px dashed #ddd' }}>
              <Box textAlign="center" mb={2}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  AL-IRSHAAD SECONDARY SCHOOL
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
              </Box>

              <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Name:
                  </Typography>
                  <Typography variant="body1">
                    {paymentResponse?.StudentName || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Receipt No.
                  </Typography>
                  <Typography variant="body1">
                    {paymentResponse?.payment?.id || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Payment Details
              </Typography>

              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>Amount Paid</TableCell>
                    <TableCell align="right">
                      {paymentResponse?.payment?.amountPaid ?
                        formatCurrency(paymentResponse.payment.amountPaid) : 'N/A'}
                    </TableCell>
                  </TableRow>
                  {paymentResponse?.payment?.discount > 0 && (
                    <TableRow>
                      <TableCell>Discount</TableCell>
                      <TableCell align="right">
                        -{formatCurrency(paymentResponse.payment.discount)}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Payment Method</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {paymentResponse?.payment?.Description || 'N/A'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Month/Year</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {form.month}/{form.year}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Box mt={4} textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Thank you for your payment!
                </Typography>
              </Box>
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseVoucher}
            startIcon={<CloseIcon />}
            sx={{ mr: 1 }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handlePrint}
            startIcon={<PrintIcon />}
            color="primary"
          >
            Print Voucher
          </Button>
        </DialogActions>
      </Dialog>

      {studentId && (
        <Grid container spacing={3}>
          {/* Payment Form Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                  Payment Information
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Amount Paid"
                        name="amountPaid"
                        value={form.amountPaid}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Discount"
                        name="discount"
                        value={form.discount}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Discount Reason"
                        name="discountReason"
                        value={form.discountReason}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Description (e.g., ZAAD - 4740303)"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Month"
                        name="month"
                        value={form.month}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Year"
                        name="year"
                        value={form.year}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        fullWidth
                        size="large"
                        startIcon={<PaymentIcon />}
                        sx={{ mt: 1 }}
                      >
                        {loading ? 'Processing...' : 'Submit Payment'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Balance Summary Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Balance Summary
                </Typography>

                {balanceSummary && (
                  <>
                    <Stack spacing={2} sx={{ mb: 3 }}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography>Monthly Fee:</Typography>
                        <Typography fontWeight={500}>
                          {formatCurrency(balanceSummary.monthlyFee)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography>Unpaid Months:</Typography>
                        <Typography fontWeight={500}>
                          {balanceSummary.unpaidMonths}
                        </Typography>
                      </Stack>
                    </Stack>

                    {balanceSummary.unpaidDetails && (
                      <>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                          Unpaid Details
                        </Typography>
                        <Table size="small" sx={{ mt: 1 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 600 }}>Period</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 600 }}>Due</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 600 }}>Paid</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 600 }}>Balance</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {balanceSummary.unpaidDetails.map((item: any, idx: number) => (
                              <TableRow key={idx} hover>
                                <TableCell>{`${item.month}/${item.year}`}</TableCell>
                                <TableCell align="right">{formatCurrency(item.due)}</TableCell>
                                <TableCell align="right">{formatCurrency(item.paid)}</TableCell>
                                <TableCell align="right" sx={{ color: 'error.main', fontWeight: 500 }}>
                                  {formatCurrency(item.due - item.paid)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default StudentPaymentPage;
