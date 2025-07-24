import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { submitPayment } from "../../Redux/Payment/paymentSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DollarSign } from "lucide-react";
import PayPayment from "./PayPayment"; // ✅ Make sure this path is correct

const CreateStudentPaymentForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, paymentResponse } = useSelector(
    (state: RootState) => state.payment
  );

  const [studentId, setStudentId] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountReason, setDiscountReason] = useState("");
  const [description, setDescription] = useState("");
  const [showVoucher, setShowVoucher] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId || !amountPaid) {
      toast.error("Student ID and Amount Paid are required");
      return;
    }

    dispatch(
      submitPayment({
        studentId: Number(studentId),
        amountPaid: Number(amountPaid),
        discount: Number(discount) || 0,
        discountReason,
        Description: description,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Payment submitted successfully");

        // reset form
        setStudentId("");
        setAmountPaid("");
        setDiscount("");
        setDiscountReason("");
        setDescription("");

        // show voucher dialog
        setShowVoucher(true);
      })
      .catch((err: string) => {
        toast.error(err || "Payment submission failed");
      });
  };

  // close voucher dialog
  const handleCloseVoucher = () => {
    setShowVoucher(false);
  };

  return (
    <>
      <ToastContainer />

      {/* ✅ Voucher dialog shown after payment */}
      {showVoucher && paymentResponse && (
        <PayPayment
          paymentData={paymentResponse}
          onClose={handleCloseVoucher}
        />
      )}

      {/* Form only shows when voucher is hidden */}
      {!showVoucher && (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl border border-blue-200"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <DollarSign className="text-green-600" />
              Student Payment Entry
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID
                </label>
                <input
                  type="number"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Paid
                </label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount
                </label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Reason
                </label>
                <input
                  type="text"
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 mt-2 bg-red-100 p-2 rounded">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Payment"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default CreateStudentPaymentForm;
// import React, { useEffect, useState, useRef } from 'react';
// import { useAppDispatch, useAppSelector } from '../../Redux/store';
// import {
//   submitPayment,
//   fetchPaymentHistory,
//   fetchStudentBalanceSummary
// } from '../../Redux/Payment/paymentSlice';
// import { useReactToPrint } from 'react-to-print';
// import {
//   Box, Typography, TextField, Button, Grid, Alert, 
//   Paper, InputAdornment, Table, TableBody, TableCell, 
//   TableRow, TableHead, Card, CardContent, Divider,
//   Stack, IconButton, Dialog, DialogTitle, DialogContent,
//   DialogActions, CircularProgress
// } from '@mui/material';
// import {
//   Search as SearchIcon, Payment as PaymentIcon,
//   Badge as BadgeIcon, Print as PrintIcon, 
//   ArrowBack as ArrowBackIcon, Autorenew as AutorenewIcon,
//   Close as CloseIcon, Phone as PhoneIcon
// } from '@mui/icons-material';

// const formatCurrency = (value: number | string) =>
//   new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value));

// const StudentPaymentPage: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { loading, error, paymentResponse, balanceSummary } = useAppSelector(state => state.payment);
//   const generateFeesState = useAppSelector(state => state.generateFees);

//   const [studentId, setStudentId] = useState<number | null>(null);
//   const [searchInput, setSearchInput] = useState('');
//   const [form, setForm] = useState({
//     amountPaid: 0,
//     discount: 0,
//     discountReason: '',
//     description: '',
//     month: new Date().getMonth() + 1,
//     year: new Date().getFullYear()
//   });
//   const [showVoucher, setShowVoucher] = useState(false);

//   const receiptRef = useRef<HTMLDivElement>(null);
//   const handlePrint = useReactToPrint({ 
//     content: () => receiptRef.current,
//     pageStyle: `
//       @page { size: auto; margin: 5mm; }
//       @media print {
//         body { -webkit-print-color-adjust: exact; }
//         .no-print { display: none !important; }
//       }
//     `
//   });

//   useEffect(() => {
//     if (studentId !== null) {
//       dispatch(fetchPaymentHistory(studentId));
//       dispatch(fetchStudentBalanceSummary(studentId));
//     }
//   }, [dispatch, studentId]);

//   useEffect(() => {
//     if (paymentResponse) {
//       setShowVoucher(true);
//     }
//   }, [paymentResponse]);

//   const handleSearch = () => {
//     const id = parseInt(searchInput);
//     if (!isNaN(id)) setStudentId(id);
//   };

//   const handleGenerateFees = () => {
//     // Add your generate fees logic here
//     console.log("Generate fees clicked");
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: name === 'amountPaid' || name === 'discount' ? parseFloat(value) || 0 : value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!studentId || form.amountPaid <= 0) return;

//     dispatch(submitPayment({
//       studentId,
//       amountPaid: form.amountPaid,
//       discount: form.discount,
//       discountReason: form.discountReason,
//       description: form.description,
//       month: form.month,
//       year: form.year
//     }));
//   };

//   const resetForm = () => {
//     setStudentId(null);
//     setSearchInput('');
//     setForm({
//       amountPaid: 0,
//       discount: 0,
//       discountReason: '',
//       description: '',
//       month: new Date().getMonth() + 1,
//       year: new Date().getFullYear()
//     });
//     setShowVoucher(false);
//   };

//   const handleCloseVoucher = () => {
//     setShowVoucher(false);
//   };

//   return (
//     <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
//       <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
//         {studentId && (
//           <IconButton onClick={resetForm} color="primary">
//             <ArrowBackIcon />
//           </IconButton>
//         )}
//         <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
//           Student Payment Portal
//         </Typography>
//       </Stack>

//       {/* Search Section */}
//       <Card sx={{ mb: 3, boxShadow: 3 }}>
//         <CardContent>
//           <Stack direction="row" spacing={2} alignItems="center">
//             <TextField
//               label="Student ID"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//               fullWidth
//               size="small"
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <BadgeIcon color="primary" />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//             <Button 
//               variant="contained" 
//               onClick={handleSearch} 
//               startIcon={<SearchIcon />}
//               sx={{ height: 40, minWidth: 120 }}
//             >
//               Search
//             </Button>
//             <Button 
//               variant="contained" 
//               onClick={handleGenerateFees}
//               disabled={generateFeesState.loading}
//               startIcon={
//                 generateFeesState.loading ? (
//                   <CircularProgress size={20} />
//                 ) : (
//                   <AutorenewIcon />
//                 )
//               }
//               sx={{ 
//                 height: 40, 
//                 minWidth: 120,
//                 backgroundColor: '#4caf50',
//                 '&:hover': {
//                   backgroundColor: '#388e3c',
//                 }
//               }}
//             >
//               Generate
//             </Button>
//           </Stack>
//         </CardContent>
//       </Card>

//       {/* Voucher Dialog */}
//       <Dialog open={showVoucher} onClose={handleCloseVoucher} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           <Typography variant="h6" fontWeight={600}>
//             Payment Receipt
//           </Typography>
//         </DialogTitle>
//         <DialogContent>
//           <Paper ref={receiptRef} sx={{ p: 3, border: '1px dashed #ddd' }}>
//             <Box textAlign="center" mb={2}>
//               <Typography variant="h5" fontWeight="bold" gutterBottom>
//                 AL-IRSHAAD SECONDARY SCHOOL
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {new Date().toLocaleDateString('en-US', {
//                   year: 'numeric',
//                   month: 'long',
//                   day: 'numeric',
//                   hour: '2-digit',
//                   minute: '2-digit'
//                 })}
//               </Typography>
//             </Box>
            
//             <Grid container spacing={2} mb={2}>
//               <Grid item xs={6}>
//                 <Typography variant="subtitle1" color="text.secondary">
//                   Student Name:
//                 </Typography>
//                 <Typography variant="body1" fontWeight={500}>
//                   {paymentResponse?.studentName || 'N/A'}
//                 </Typography>
//               </Grid>
//               <Grid item xs={6}>
//                 <Typography variant="subtitle1" color="text.secondary">
//                   Receipt No:
//                 </Typography>
//                 <Typography variant="body1" fontWeight={500}>
//                   {paymentResponse?.paymentId || 'N/A'}
//                 </Typography>
//               </Grid>
//               <Grid item xs={6}>
//                 <Typography variant="subtitle1" color="text.secondary">
//                   Parent Phone:
//                 </Typography>
//                 <Typography variant="body1" fontWeight={500}>
//                   {paymentResponse?.parentPhone || 'N/A'}
//                 </Typography>
//               </Grid>
//               <Grid item xs={6}>
//                 <Typography variant="subtitle1" color="text.secondary">
//                   Period:
//                 </Typography>
//                 <Typography variant="body1" fontWeight={500}>
//                   {paymentResponse?.month}/{paymentResponse?.year}
//                 </Typography>
//               </Grid>
//             </Grid>
            
//             <Divider sx={{ my: 2 }} />
            
//             <Typography variant="subtitle1" fontWeight="bold" mb={1}>
//               Payment Details
//             </Typography>
            
//             <Table size="small">
//               <TableBody>
//                 <TableRow>
//                   <TableCell>Amount Paid</TableCell>
//                   <TableCell align="right">
//                     {paymentResponse?.paidAmount ? 
//                       formatCurrency(paymentResponse.paidAmount) : 'N/A'}
//                   </TableCell>
//                 </TableRow>
//                 {paymentResponse?.discountUsed > 0 && (
//                   <TableRow>
//                     <TableCell>Discount</TableCell>
//                     <TableCell align="right">
//                       -{formatCurrency(paymentResponse.discountUsed)}
//                     </TableCell>
//                   </TableRow>
//                 )}
//                 <TableRow>
//                   <TableCell sx={{ fontWeight: 'bold' }}>Payment Method</TableCell>
//                   <TableCell align="right" sx={{ fontWeight: 'bold' }}>
//                     {paymentResponse?.paymentDescription || 'N/A'}
//                   </TableCell>
//                 </TableRow>
//               </TableBody>
//             </Table>
            
//             <Box mt={4} textAlign="center">
//               <Typography variant="body2" color="text.secondary">
//                 {paymentResponse?.message || 'Payment processed successfully'}
//               </Typography>
//               <Typography variant="caption" display="block" color="text.secondary" mt={2}>
//                 Thank you for your payment!
//               </Typography>
//             </Box>
//           </Paper>
//         </DialogContent>
//         <DialogActions>
//           <Button 
//             onClick={handleCloseVoucher}
//             startIcon={<CloseIcon />}
//             sx={{ mr: 1 }}
//             className="no-print"
//           >
//             Close
//           </Button>
//           <Button 
//             variant="contained"
//             onClick={handlePrint}
//             startIcon={<PrintIcon />}
//             color="primary"
//             className="no-print"
//           >
//             Print Receipt
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Rest of your form and balance summary components remain the same */}
//       {studentId && (
//         <Grid container spacing={3}>
//           {/* Payment Form Section */}
//           <Grid item xs={12} md={6}>
//             <Card sx={{ boxShadow: 3 }}>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
//                   Payment Information
//                 </Typography>
                
//                 <form onSubmit={handleSubmit}>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                       <TextField
//                         label="Amount Paid"
//                         name="amountPaid"
//                         value={form.amountPaid}
//                         onChange={handleChange}
//                         type="number"
//                         fullWidth
//                         size="small"
//                         InputProps={{
//                           startAdornment: (
//                             <InputAdornment position="start">$</InputAdornment>
//                           ),
//                         }}
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <TextField
//                         label="Discount"
//                         name="discount"
//                         value={form.discount}
//                         onChange={handleChange}
//                         type="number"
//                         fullWidth
//                         size="small"
//                         InputProps={{
//                           startAdornment: (
//                             <InputAdornment position="start">$</InputAdornment>
//                           ),
//                         }}
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <TextField
//                         label="Discount Reason"
//                         name="discountReason"
//                         value={form.discountReason}
//                         onChange={handleChange}
//                         fullWidth
//                         size="small"
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <TextField
//                         label="Description (e.g., ZAAD - 4740303)"
//                         name="description"
//                         value={form.description}
//                         onChange={handleChange}
//                         fullWidth
//                         size="small"
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <TextField
//                         label="Month"
//                         name="month"
//                         value={form.month}
//                         onChange={handleChange}
//                         type="number"
//                         fullWidth
//                         size="small"
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <TextField
//                         label="Year"
//                         name="year"
//                         value={form.year}
//                         onChange={handleChange}
//                         type="number"
//                         fullWidth
//                         size="small"
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <Button
//                         type="submit"
//                         variant="contained"
//                         disabled={loading}
//                         fullWidth
//                         size="large"
//                         startIcon={<PaymentIcon />}
//                         sx={{ mt: 1 }}
//                       >
//                         {loading ? 'Processing...' : 'Submit Payment'}
//                       </Button>
//                     </Grid>
//                   </Grid>
//                 </form>

//                 {error && (
//                   <Alert severity="error" sx={{ mt: 2 }}>
//                     {error}
//                   </Alert>
//                 )}
//               </CardContent>
//             </Card>
//           </Grid>

//           {/* Balance Summary Section */}
//           <Grid item xs={12} md={6}>
//             <Card sx={{ boxShadow: 3, height: '100%' }}>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
//                   Balance Summary
//                 </Typography>
                
//                 {balanceSummary && (
//                   <>
//                     <Stack spacing={2} sx={{ mb: 3 }}>
//                       <Stack direction="row" justifyContent="space-between">
//                         <Typography>Monthly Fee:</Typography>
//                         <Typography fontWeight={500}>
//                           {formatCurrency(balanceSummary.monthlyFee)}
//                         </Typography>
//                       </Stack>
//                       <Stack direction="row" justifyContent="space-between">
//                         <Typography>Unpaid Months:</Typography>
//                         <Typography fontWeight={500}>
//                           {balanceSummary.unpaidMonths}
//                         </Typography>
//                       </Stack>
//                     </Stack>

//                     {balanceSummary.unpaidDetails && (
//                       <>
//                         <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
//                           Unpaid Details
//                         </Typography>
//                         <Table size="small" sx={{ mt: 1 }}>
//                           <TableHead>
//                             <TableRow>
//                               <TableCell sx={{ fontWeight: 600 }}>Period</TableCell>
//                               <TableCell align="right" sx={{ fontWeight: 600 }}>Due</TableCell>
//                               <TableCell align="right" sx={{ fontWeight: 600 }}>Paid</TableCell>
//                               <TableCell align="right" sx={{ fontWeight: 600 }}>Balance</TableCell>
//                             </TableRow>
//                           </TableHead>
//                           <TableBody>
//                             {balanceSummary.unpaidDetails.map((item: any, idx: number) => (
//                               <TableRow key={idx} hover>
//                                 <TableCell>{`${item.month}/${item.year}`}</TableCell>
//                                 <TableCell align="right">{formatCurrency(item.due)}</TableCell>
//                                 <TableCell align="right">{formatCurrency(item.paid)}</TableCell>
//                                 <TableCell align="right" sx={{ color: 'error.main', fontWeight: 500 }}>
//                                   {formatCurrency(item.due - item.paid)}
//                                 </TableCell>
//                               </TableRow>
//                             ))}
//                           </TableBody>
//                         </Table>
//                       </>
//                     )}
//                   </>
//                 )}
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       )}
//     </Box>
//   );
// };

// export default StudentPaymentPage;