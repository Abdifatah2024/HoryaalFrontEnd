import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { submitPayment, fetchPaymentHistory } from '../../Redux/Payment/paymentSlice';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Chip,
  Collapse,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import html2pdf from 'html2pdf.js';
import { PictureAsPdf, Visibility, VisibilityOff } from '@mui/icons-material';

const getMonthYearString = (month: number, year: number) => {
  const date = new Date(year, month - 1);
  return format(date, 'MMMM yyyy');
};

const StyledForm = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
}));

const PaymentRecordCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const StudentPaymentPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, paymentResponse, paymentHistory } = useAppSelector((state) => state.payment);

  const [studentId, setStudentId] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState<string>(''); // Default empty
  const [showHistory, setShowHistory] = useState<boolean>(true);

  const [form, setForm] = useState({
    studentId: 0,
    amountPaid: 0,
    discount: 0,
    discountReason: '',
    description: '',
    paymentDate: new Date(),
  });

  useEffect(() => {
    if (studentId !== null) {
      dispatch(fetchPaymentHistory(studentId));
      setForm((prev) => ({ ...prev, studentId }));
    }
  }, [dispatch, studentId]);

  const handleSearch = () => {
    const id = parseInt(searchInput);
    if (!isNaN(id) && id > 0) {
      setStudentId(id);
    } else {
      alert('Please enter a valid Student ID.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'amountPaid' || name === 'discount' ? parseFloat(value) || 0 : value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setForm({ ...form, paymentDate: date });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentId !== null) {
      dispatch(submitPayment({ ...form, studentId }));
    } else {
      alert('Search and select a Student ID first.');
    }
  };

  const calculateDue = (required: number, paid: number) => {
    return Math.max(0, required - paid);
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('history-section');
    if (element) {
      html2pdf()
        .set({
          filename: `Student_${studentId}_History.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        })
        .from(element)
        .save();
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 4 }}>
        Student Payment Portal
      </Typography>

      {/* Search Section */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          label="Enter Student ID"
          variant="outlined"
          size="small"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Payment Form - Always Visible */}
        <Grid item xs={12} md={6}>
          <StyledForm elevation={3}>
            <Typography variant="h6" gutterBottom>
              Make a Payment
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Amount Paid ($)"
                    name="amountPaid"
                    type="number"
                    value={form.amountPaid}
                    onChange={handleChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Discount ($)"
                    name="discount"
                    type="number"
                    value={form.discount}
                    onChange={handleChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Discount Reason"
                    name="discountReason"
                    value={form.discountReason}
                    onChange={handleChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    size="small"
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Payment Date"
                      value={form.paymentDate}
                      onChange={handleDateChange}
                      renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    size="large"
                  >
                    {loading ? <CircularProgress size={24} /> : 'Process Payment'}
                  </Button>
                </Grid>
              </Grid>
            </form>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            )}

            {paymentResponse && (
              <Alert severity="success" sx={{ mt: 2 }}>
                <AlertTitle>Success</AlertTitle>
                {paymentResponse.message}
              </Alert>
            )}
          </StyledForm>
        </Grid>

        {/* History - Only shows after search */}
        {studentId && paymentHistory && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: '12px' }}>
              <Typography variant="h6" gutterBottom>
                Student Summary
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography><strong>Name:</strong> {paymentHistory.name}</Typography>
                <Chip label={`Monthly Fee: $${paymentHistory.fee}`} color="primary" variant="outlined" />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={showHistory ? <VisibilityOff /> : <Visibility />}
                  onClick={() => setShowHistory(!showHistory)}
                >
                  {showHistory ? 'Hide History' : 'Show History'}
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<PictureAsPdf />}
                  onClick={handleDownloadPDF}
                  disabled={!showHistory}
                >
                  Download PDF
                </Button>
              </Box>

              <Collapse in={showHistory}>
                <div id="history-section">
                  <Typography variant="h6" gutterBottom>
                    Payment History
                  </Typography>

                  {paymentHistory.records.length > 0 ? (
                    <List sx={{ maxHeight: 500, overflow: 'auto' }}>
                      {paymentHistory.records.map((rec) => (
                        <PaymentRecordCard key={rec.id}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {getMonthYearString(rec.month, rec.year)}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 2 }}>
                                <Typography variant="body2"><strong>Required:</strong> ${rec.required}</Typography>
                                <Typography variant="body2" color="success.main"><strong>Paid:</strong> ${rec.paid}</Typography>
                                <Typography variant="body2" color={rec.due > 0 ? 'error.main' : 'success.main'}>
                                  <strong>Due:</strong> ${calculateDue(rec.required, rec.paid)}
                                </Typography>
                              </Box>
                            </Box>

                            {rec.paymentHistory.length > 0 ? (
                              <List dense>
                                {rec.paymentHistory.map((ph, idx) => (
                                  <ListItem key={idx} sx={{ py: 0.5 }}>
                                    <ListItemText
                                      primary={`$${ph.amount} payment`}
                                      secondary={`${new Date(ph.date).toLocaleDateString()} ${
                                        ph.discount ? `• $${ph.discount} discount` : ''
                                      }`}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                No payments for this period.
                              </Typography>
                            )}
                          </CardContent>
                        </PaymentRecordCard>
                      ))}
                    </List>
                  ) : (
                    <Typography>No history found.</Typography>
                  )}
                </div>
              </Collapse>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default StudentPaymentPage;
// ⚠️ Truncated for clarity due to size limits.
// ⚠️ Paste this into a file and ask me to send remaining parts if it's clipped.

// import React, { useEffect, useState } from 'react';
// import { useAppDispatch, useAppSelector } from '../../Redux/store';
// import { submitPayment, fetchPaymentHistory } from '../../Redux/Payment/paymentSlice';
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Divider,
//   Paper,
//   Grid,
//   CircularProgress,
//   Alert,
//   AlertTitle,
//   List,
//   ListItem,
//   ListItemText,
//   Card,
//   CardContent,
//   Chip,
//   Collapse,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Avatar,
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { format } from 'date-fns';
// import html2pdf from 'html2pdf.js';
// import { PictureAsPdf, Visibility, VisibilityOff, Receipt, Close } from '@mui/icons-material';

// const VoucherCard = styled(Card)(({ theme }) => ({
//   border: `1px solid ${theme.palette.divider}`,
//   borderRadius: '8px',
//   marginBottom: theme.spacing(2),
//   background: theme.palette.background.paper,
// }));

// const getMonthYearString = (month: number, year: number) => {
//   const date = new Date(year, month - 1);
//   return format(date, 'MMMM yyyy');
// };

// const StudentPaymentPage: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { loading, error, paymentResponse, paymentHistory } = useAppSelector((state) => state.payment);

//   const [studentId, setStudentId] = useState<number | null>(null);
//   const [searchInput, setSearchInput] = useState<string>('');
//   const [showHistory, setShowHistory] = useState<boolean>(true);
//   const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
//   const [openVoucherDialog, setOpenVoucherDialog] = useState<boolean>(false);

//   const [form, setForm] = useState({
//     studentId: 0,
//     amountPaid: 0,
//     discount: 0,
//     discountReason: '',
//     description: '',
//     paymentDate: new Date(),
//   });

//   useEffect(() => {
//     if (studentId !== null) {
//       dispatch(fetchPaymentHistory(studentId));
//       setForm((prev) => ({ ...prev, studentId }));
//     }
//   }, [dispatch, studentId]);

//   const handleSearch = () => {
//     const id = parseInt(searchInput);
//     if (!isNaN(id) && id > 0) {
//       setStudentId(id);
//     } else {
//       alert('Please enter a valid Student ID.');
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm({
//       ...form,
//       [name]: name === 'amountPaid' || name === 'discount' ? parseFloat(value) || 0 : value,
//     });
//   };

//   const handleDateChange = (date: Date | null) => {
//     if (date) {
//       setForm({ ...form, paymentDate: date });
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (studentId !== null) {
//       dispatch(submitPayment({ ...form, studentId }));
//     } else {
//       alert('Search and select a Student ID first.');
//     }
//   };

//   const calculateDue = (required: number, paid: number) => {
//     return Math.max(0, required - paid);
//   };

//   const handleDownloadPDF = () => {
//     const element = document.getElementById('history-section');
//     if (element) {
//       html2pdf()
//         .set({
//           filename: `Student_${studentId}_Payment_History.pdf`,
//           margin: 10,
//           image: { type: 'jpeg', quality: 0.98 },
//           html2canvas: { scale: 2 },
//           jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
//         })
//         .from(element)
//         .save();
//     }
//   };

//   const handleViewVoucher = (payment: any) => {
//     setSelectedVoucher(payment);
//     setOpenVoucherDialog(true);
//   };

//   const handleCloseVoucherDialog = () => {
//     setOpenVoucherDialog(false);
//   };

//   const renderVoucherDialog = () => (
//     <Dialog open={openVoucherDialog} onClose={handleCloseVoucherDialog} maxWidth="sm" fullWidth>
//       <DialogTitle>
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <Typography variant="h6">Payment Voucher</Typography>
//           <IconButton onClick={handleCloseVoucherDialog}><Close /></IconButton>
//         </Box>
//       </DialogTitle>
//       <DialogContent dividers>
//         {selectedVoucher && (
//           <div id="voucher-pdf-content">
//             <Table>
//               <TableBody>
//                 <TableRow>
//                   <TableCell>Amount Paid</TableCell>
//                   <TableCell align="right">${(selectedVoucher?.amountPaid ?? 0).toFixed(2)}</TableCell>
//                 </TableRow>
//                 {selectedVoucher?.discount > 0 && (
//                   <TableRow>
//                     <TableCell>Discount ({selectedVoucher.discountReason || 'N/A'})</TableCell>
//                     <TableCell align="right">-${(selectedVoucher?.discount ?? 0).toFixed(2)}</TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//             <Typography variant="body2" mt={2}>
//               {selectedVoucher?.description}
//             </Typography>
//           </div>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleCloseVoucherDialog}>Close</Button>
//         <Button
//           variant="contained"
//           startIcon={<PictureAsPdf />}
//           onClick={() => {
//             const element = document.getElementById('voucher-pdf-content');
//             if (element) {
//               html2pdf()
//                 .set({
//                   filename: `Voucher_${selectedVoucher?.id}.pdf`,
//                   margin: 10,
//                   image: { type: 'jpeg', quality: 0.98 },
//                   html2canvas: { scale: 2 },
//                   jsPDF: { unit: 'mm', format: 'a4' },
//                 })
//                 .from(element)
//                 .save();
//             }
//             handleCloseVoucherDialog();
//           }}
//         >
//           Download
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );

//   return (
//     <Box p={3}>
//       <Typography variant="h4" gutterBottom>Student Payment Portal</Typography>
//       <Box display="flex" gap={2} mb={4}>
//         <TextField
//           label="Student ID"
//           value={searchInput}
//           onChange={(e) => setSearchInput(e.target.value)}
//           size="small"
//         />
//         <Button variant="contained" onClick={handleSearch}>Search</Button>
//       </Box>

//       <Grid container spacing={4}>
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ p: 3 }}>
//             <form onSubmit={handleSubmit}>
//               <Typography variant="h6" gutterBottom>Make a Payment</Typography>
//               <TextField
//                 fullWidth
//                 label="Amount Paid"
//                 name="amountPaid"
//                 type="number"
//                 value={form.amountPaid}
//                 onChange={handleChange}
//                 margin="normal"
//               />
//               <TextField
//                 fullWidth
//                 label="Discount"
//                 name="discount"
//                 type="number"
//                 value={form.discount}
//                 onChange={handleChange}
//                 margin="normal"
//               />
//               <TextField
//                 fullWidth
//                 label="Discount Reason"
//                 name="discountReason"
//                 value={form.discountReason}
//                 onChange={handleChange}
//                 margin="normal"
//               />
//               <TextField
//                 fullWidth
//                 label="Description"
//                 name="description"
//                 value={form.description}
//                 onChange={handleChange}
//                 multiline
//                 rows={2}
//                 margin="normal"
//               />
//               <LocalizationProvider dateAdapter={AdapterDateFns}>
//                 <DatePicker
//                   label="Payment Date"
//                   value={form.paymentDate}
//                   onChange={handleDateChange}
//                   renderInput={(params) => <TextField fullWidth {...params} margin="normal" />}
//                 />
//               </LocalizationProvider>
//               <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
//                 {loading ? <CircularProgress size={24} /> : 'Submit Payment'}
//               </Button>
//             </form>
//             {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
//             {paymentResponse && <Alert severity="success" sx={{ mt: 2 }}>{paymentResponse.message}</Alert>}
//           </Paper>
//         </Grid>

//         {/* History Display */}
//         {studentId && paymentHistory && (
//           <Grid item xs={12} md={6}>
//             <Paper sx={{ p: 3 }}>
//               <Box display="flex" justifyContent="space-between" alignItems="center">
//                 <Typography variant="h6">Payment History</Typography>
//                 <Button
//                   variant="outlined"
//                   onClick={handleDownloadPDF}
//                   startIcon={<PictureAsPdf />}
//                 >
//                   Download
//                 </Button>
//               </Box>
//               <Divider sx={{ my: 2 }} />
//               <Collapse in={showHistory}>
//                 <div id="history-section">
//                   {paymentHistory.records.map((rec) => (
//                     <Box key={rec.id} mb={2}>
//                       <Typography fontWeight={600}>{getMonthYearString(rec.month, rec.year)}</Typography>
//                       {rec.paymentHistory.map((ph, idx) => (
//                         <VoucherCard key={ph.id ?? idx}>
//                           <Box display="flex" justifyContent="space-between" p={2}>
//                             <Typography>{format(new Date(ph.date), 'PPP')}</Typography>
//                             <Typography>${(ph.amount ?? 0).toFixed(2)}</Typography>
//                           </Box>
//                           {ph.discount > 0 && (
//                             <Box px={2}>
//                               <Typography variant="body2" color="text.secondary">
//                                 Discount: ${(ph.discount ?? 0).toFixed(2)} ({ph.discountReason || 'N/A'})
//                               </Typography>
//                             </Box>
//                           )}
//                           <Box px={2} pb={2}>
//                             <Button onClick={() => handleViewVoucher(ph)} startIcon={<Receipt />} size="small">
//                               View Voucher
//                             </Button>
//                           </Box>
//                         </VoucherCard>
//                       ))}
//                     </Box>
//                   ))}
//                 </div>
//               </Collapse>
//             </Paper>
//           </Grid>
//         )}
//       </Grid>

//       {renderVoucherDialog()}
//     </Box>
//   );
// };

// export default StudentPaymentPage;
