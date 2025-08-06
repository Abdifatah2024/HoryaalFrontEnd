import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import {
  submitPayment,
  fetchPaymentHistory,
  fetchStudentBalanceSummary
} from '../../Redux/Payment/paymentSlice';
import {
  triggerGenerateFees,
  clearGenerateFeesMessage
} from '../../Redux/Payment/FeegenerateSlice';

import {
  Box, Typography, TextField, Button, Grid, Alert,
  Paper, InputAdornment, Table, TableBody, TableCell,
  TableRow, TableHead, Card, CardContent, Divider,
  Stack, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon, Payment as PaymentIcon,
  Badge as BadgeIcon, ArrowBack as ArrowBackIcon,
  Autorenew as AutorenewIcon, Close as CloseIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'react-hot-toast';

const formatCurrency = (value: number | string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value));

const StudentPaymentPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, paymentResponse, balanceSummary } = useAppSelector(state => state.payment);
  const generateFeesState = useAppSelector(state => state.generateFees);

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

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    const element = receiptRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('payment_voucher.pdf');
  };

  useEffect(() => {
    if (studentId !== null) {
      dispatch(fetchPaymentHistory(studentId));
      dispatch(fetchStudentBalanceSummary(studentId));
    }
  }, [dispatch, studentId]);

  useEffect(() => {
    if (paymentResponse && paymentResponse.payment) {
      setShowVoucher(true);
      toast.success('Payment submitted successfully!');
      // Clear form after successful payment
      setForm({
        amountPaid: 0,
        discount: 0,
        discountReason: '',
        description: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      });
    }
  }, [paymentResponse]);

  const handleSearch = () => {
    const id = parseInt(searchInput);
    if (!isNaN(id)) setStudentId(id);
  };

  const handleGenerateFees = () => {
    dispatch(triggerGenerateFees());
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve('Fees generated successfully');
        }, 2000);
      }),
      {
        loading: 'Generating fees...',
        success: 'Fees generated successfully!',
        error: 'Error generating fees',
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'amountPaid' || name === 'discount' ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || form.amountPaid <= 0) {
      toast.error('Please enter a valid amount and student ID');
      return;
    }

    toast.promise(
      dispatch(submitPayment({
        studentId,
        amountPaid: form.amountPaid,
        discount: form.discount,
        discountReason: form.discountReason,
        Description: form.description,
        month: form.month,
        year: form.year
      })).unwrap(),
      {
        loading: 'Processing payment...',
        success: 'Payment processed successfully!',
        error: (err) => err.message || 'Payment failed',
      }
    );
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
    toast.success('Form reset successfully');
  };

  const handleCloseVoucher = () => {
    setShowVoucher(false);
    toast('You can download the voucher later from payment history', {
      icon: 'ℹ️',
    });
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
              startIcon={generateFeesState.loading ? <CircularProgress size={20} /> : <AutorenewIcon />}
              sx={{ height: 40, minWidth: 120, backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
            >
              Generate
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Alerts */}
      {generateFeesState.message && (
        <Alert severity="success" onClose={() => dispatch(clearGenerateFeesMessage())} sx={{ mb: 2 }}>
          {generateFeesState.message}
        </Alert>
      )}
      {generateFeesState.error && (
        <Alert severity="error" onClose={() => dispatch(clearGenerateFeesMessage())} sx={{ mb: 2 }}>
          {generateFeesState.error}
        </Alert>
      )}

      {/* Voucher Dialog */}
      <Dialog open={showVoucher} onClose={handleCloseVoucher} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>Payment Voucher</Typography>
        </DialogTitle>
        <DialogContent>
          {paymentResponse?.payment && (
            <Paper ref={receiptRef} sx={{ p: 3, border: '1px dashed #ddd' }}>
              <Box textAlign="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">HORYAAL SCHOOL</Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </Typography>
              </Box>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" color="text.secondary">Name:</Typography>
                  <Typography variant="body1">{paymentResponse?.StudentName || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Receipt No.</Typography>
                  <Typography variant="body1">{paymentResponse?.payment?.id || 'N/A'}</Typography>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>Payment Details</Typography>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>Amount Paid</TableCell>
                    <TableCell align="right">{paymentResponse?.payment?.amountPaid ? formatCurrency(paymentResponse.payment.amountPaid) : 'N/A'}</TableCell>
                  </TableRow>
                  {Number(paymentResponse?.payment?.discount) > 0 && (
                    <TableRow>
                      <TableCell>Discount</TableCell>
                      <TableCell align="right">-{formatCurrency(Number(paymentResponse.payment.discount))}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Payment Method</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{paymentResponse?.payment?.description || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Month/Year</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{form.month}/{form.year}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Box mt={4} textAlign="center">
                <Typography variant="body2" color="text.secondary">Thank you for your payment!</Typography>
              </Box>
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVoucher} startIcon={<CloseIcon />}>Close</Button>
          <Button onClick={handleDownloadPDF} startIcon={<DownloadIcon />} variant="contained" color="primary">Download PDF</Button>
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
                          startAdornment: <InputAdornment position="start">$</InputAdornment>
                        }}
                        required
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
                          startAdornment: <InputAdornment position="start">$</InputAdornment>
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
                        required
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
                        required
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
                        required
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
                        <Typography fontWeight={500}>{formatCurrency(balanceSummary.monthlyFee)}</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography>Unpaid Months:</Typography>
                        <Typography fontWeight={500}>{balanceSummary.unpaidMonths}</Typography>
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
                                  {formatCurrency(item.due)}
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