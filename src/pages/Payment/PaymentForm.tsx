
// import React, { useEffect, useState } from 'react';
// import { useAppDispatch, useAppSelector } from '../../Redux/store';
// import { 
//   submitPayment, 
//   fetchPaymentHistory, 
//   fetchStudentDepositStatus, 
//   fetchStudentBalanceSummary
// } from '../../Redux/Payment/paymentSlice';
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Divider,
//   Grid,
//   CircularProgress,
//   Alert,
//   AlertTitle,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   IconButton,
//   Card,
//   CardHeader,
//   CardContent,
//   Collapse,
//   useTheme,
//   Paper,
//   Avatar,
//   Chip
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { 
//   Search as SearchIcon,
//   Payment as PaymentIcon,
//   Info as InfoIcon,
//   ExpandMore as ExpandMoreIcon,
//   ExpandLess as ExpandLessIcon,
//   AccountBalance as BalanceIcon,
//   AttachMoney as MoneyIcon,
//   Discount as DiscountIcon,
//   Description as DescriptionIcon,
//   CalendarToday as CalendarIcon
// } from '@mui/icons-material';

// const formatCurrency = (value: number) => {
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
//     minimumFractionDigits: 2
//   }).format(value);
// };

// // Styled Components
// const PageContainer = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(4),
//   maxWidth: 1400,
//   margin: '0 auto',
//   [theme.breakpoints.down('sm')]: {
//     padding: theme.spacing(2)
//   }
// }));

// const HeaderCard = styled(Card)(({ theme }) => ({
//   background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
//   color: theme.palette.primary.contrastText,
//   marginBottom: theme.spacing(4),
//   borderRadius: theme.shape.borderRadius * 2,
//   boxShadow: theme.shadows[4]
// }));

// const BalanceCard = styled(Card)(({ theme }) => ({
//   borderLeft: `6px solid ${theme.palette.secondary.main}`,
//   borderRadius: theme.shape.borderRadius * 2,
//   marginBottom: theme.spacing(3),
//   transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//   '&:hover': {
//     transform: 'translateY(-2px)',
//     boxShadow: theme.shadows[6]
//   }
// }));

// const PaymentFormCard = styled(Card)(({ theme }) => ({
//   borderRadius: theme.shape.borderRadius * 2,
//   boxShadow: theme.shadows[2],
//   transition: 'all 0.3s ease',
//   '&:hover': {
//     boxShadow: theme.shadows[6]
//   }
// }));

// const SummaryCard = styled(Card)(({ theme }) => ({
//   borderLeft: `6px solid ${theme.palette.info.main}`,
//   borderRadius: theme.shape.borderRadius * 2,
//   marginBottom: theme.spacing(3),
//   '&.deposit-card': {
//     borderLeftColor: theme.palette.success.main
//   },
//   '&.balance-card': {
//     borderLeftColor: theme.palette.warning.main
//   }
// }));

// const StyledTable = styled(Table)(({ theme }) => ({
//   '& .MuiTableCell-root': {
//     padding: theme.spacing(1.5, 2),
//     '&.header-cell': {
//       backgroundColor: theme.palette.grey[100],
//       fontWeight: 600
//     }
//   },
//   '& .MuiTableRow-root:hover': {
//     backgroundColor: theme.palette.action.hover
//   }
// }));

// const StudentPaymentPage: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const theme = useTheme();
//   const { 
//     loading, 
//     error, 
//     paymentResponse, 
//     depositStatus, 
//     balanceSummary 
//   } = useAppSelector((state) => state.payment);

//   const [studentId, setStudentId] = useState<number | null>(null);
//   const [searchInput, setSearchInput] = useState<string>('');
//   const [expandedSections, setExpandedSections] = useState({
//     paymentForm: true,
//     depositSummary: true,
//     balanceSummary: true
//   });
//   const [form, setForm] = useState({
//     studentId: 0,
//     amountPaid: '',
//     discount: '',
//     discountReason: '',
//     description: '',
//     paymentDate: new Date(),
//   });

//   useEffect(() => {
//     if (studentId !== null) {
//       dispatch(fetchPaymentHistory(studentId));
//       dispatch(fetchStudentDepositStatus(studentId));
//       dispatch(fetchStudentBalanceSummary(studentId));
//       setForm(prev => ({ 
//         ...prev, 
//         studentId,
//         amountPaid: '',
//         discount: '',
//         discountReason: '',
//         description: ''
//       }));
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
//       [name]: value
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
//       const paymentData = {
//         ...form,
//         studentId,
//         amountPaid: parseFloat(form.amountPaid) || 0,
//         discount: parseFloat(form.discount) || 0
//       };
//       dispatch(submitPayment(paymentData));
//     } else {
//       alert('Please search and select a Student ID first.');
//     }
//   };

//   const toggleSection = (section: keyof typeof expandedSections) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     }
//   };

//   return (
//     <PageContainer>
//       {/* Header Section */}
//       <HeaderCard>
//         <CardContent>
//           <Box display="flex" alignItems="center" mb={2}>
//             <PaymentIcon fontSize="large" sx={{ mr: 2 }} />
//             <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
//               Student Payment Portal
//             </Typography>
//           </Box>
//           <Typography variant="subtitle1">
//             Manage student payments, view balances, and process transactions
//           </Typography>
//         </CardContent>
//       </HeaderCard>

//       {/* Student Search Section */}
//       <BalanceCard>
//         <CardContent>
//           <Grid container spacing={3} alignItems="center">
//             <Grid item xs={12} md={6}>
//               <Box display="flex" alignItems="center" gap={2}>
//                 <TextField
//                   label="Enter Student ID"
//                   variant="outlined"
//                   size="small"
//                   fullWidth
//                   value={searchInput}
//                   onChange={(e) => setSearchInput(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   InputProps={{
//                     startAdornment: (
//                       <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
//                     )
//                   }}
//                 />
//                 <Button 
//                   variant="contained" 
//                   onClick={handleSearch}
//                   startIcon={<SearchIcon />}
//                   sx={{ minWidth: 180 }}
//                 >
//                   Search Student
//                 </Button>
//               </Box>
//             </Grid>
            
//             {/* Balance Display */}
//             {balanceSummary && (
//               <Grid item xs={12} md={6}>
//                 <Box display="flex" alignItems="center" justifyContent="flex-end" gap={2}>
//                   <Avatar sx={{ bgcolor: balanceSummary.balanceDue > 0 ? 'error.main' : 'success.main' }}>
//                     <BalanceIcon />
//                   </Avatar>
//                   <Box textAlign="right">
//                     <Typography variant="subtitle2" color="textSecondary">
//                       Current Balance
//                     </Typography>
//                     <Typography 
//                       variant="h5" 
//                       sx={{ 
//                         fontWeight: 700,
//                         color: balanceSummary.balanceDue > 0 ? 'error.main' : 'success.main'
//                       }}
//                     >
//                       {formatCurrency(Math.abs(balanceSummary.balanceDue))}
//                       {balanceSummary.balanceDue < 0 && (
//                         <Chip 
//                           label="Credit" 
//                           size="small" 
//                           sx={{ 
//                             ml: 1,
//                             backgroundColor: 'success.light',
//                             color: 'success.contrastText'
//                           }} 
//                         />
//                       )}
//                     </Typography>
//                   </Box>
//                 </Box>
//               </Grid>
//             )}
//           </Grid>
//         </CardContent>
//       </BalanceCard>

//       {/* Main Content */}
//       <Grid container spacing={4}>
//         {/* Payment Form Column */}
//         <Grid item xs={12} md={6}>
//           <PaymentFormCard>
//             <CardHeader
//               title={
//                 <Box display="flex" alignItems="center" gap={1}>
//                   <PaymentIcon color="primary" />
//                   <Typography variant="h6" component="h2">
//                     Make a Payment
//                   </Typography>
//                 </Box>
//               }
//               action={
//                 <IconButton onClick={() => toggleSection('paymentForm')}>
//                   {expandedSections.paymentForm ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                 </IconButton>
//               }
//               sx={{
//                 backgroundColor: theme.palette.primary.light,
//                 color: theme.palette.primary.contrastText,
//                 borderTopLeftRadius: theme.shape.borderRadius * 2,
//                 borderTopRightRadius: theme.shape.borderRadius * 2
//               }}
//             />
//             <Collapse in={expandedSections.paymentForm}>
//               <CardContent>
//                 <form onSubmit={handleSubmit}>
//                   <Grid container spacing={3}>
//                     <Grid item xs={12} sm={6}>
//                       <TextField
//                         fullWidth
//                         label="Amount Paid"
//                         name="amountPaid"
//                         type="number"
//                         value={form.amountPaid}
//                         onChange={handleChange}
//                         InputProps={{
//                           startAdornment: (
//                             <MoneyIcon sx={{ color: 'action.active', mr: 1 }} />
//                           )
//                         }}
//                         inputProps={{ min: 0, step: 0.01 }}
//                         required
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <TextField
//                         fullWidth
//                         label="Discount Amount"
//                         name="discount"
//                         type="number"
//                         value={form.discount}
//                         onChange={handleChange}
//                         InputProps={{
//                           startAdornment: (
//                             <DiscountIcon sx={{ color: 'action.active', mr: 1 }} />
//                           )
//                         }}
//                         inputProps={{ min: 0, step: 0.01 }}
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <TextField
//                         fullWidth
//                         label="Discount Reason"
//                         name="discountReason"
//                         value={form.discountReason}
//                         onChange={handleChange}
//                         disabled={!form.discount}
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <TextField
//                         fullWidth
//                         label="Payment Description"
//                         name="description"
//                         value={form.description}
//                         onChange={handleChange}
//                         multiline
//                         rows={3}
//                         InputProps={{
//                           startAdornment: (
//                             <DescriptionIcon sx={{ 
//                               color: 'action.active', 
//                               mr: 1,
//                               alignSelf: 'flex-start',
//                               mt: 1
//                             }} />
//                           )
//                         }}
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <LocalizationProvider dateAdapter={AdapterDateFns}>
//                         <DatePicker
//                           label="Payment Date"
//                           value={form.paymentDate}
//                           onChange={handleDateChange}
//                           maxDate={new Date()}
//                           renderInput={(params) => (
//                             <TextField 
//                               {...params} 
//                               fullWidth 
//                               InputProps={{
//                                 ...params.InputProps,
//                                 startAdornment: (
//                                   <CalendarIcon sx={{ 
//                                     color: 'action.active', 
//                                     mr: 1 
//                                   }} />
//                                 )
//                               }}
//                             />
//                           )}
//                         />
//                       </LocalizationProvider>
//                     </Grid>
//                     <Grid item xs={12}>
//                       <Button
//                         type="submit"
//                         variant="contained"
//                         color="primary"
//                         fullWidth
//                         disabled={loading || !studentId}
//                         size="large"
//                         sx={{ py: 1.5 }}
//                         startIcon={loading ? <CircularProgress size={24} /> : <PaymentIcon />}
//                       >
//                         {loading ? 'Processing Payment...' : 'Submit Payment'}
//                       </Button>
//                     </Grid>
//                   </Grid>
//                 </form>

//                 {error && (
//                   <Alert severity="error" sx={{ mt: 3 }}>
//                     <AlertTitle>Payment Error</AlertTitle>
//                     {error}
//                   </Alert>
//                 )}

//                 {paymentResponse && (
//                   <Alert severity="success" sx={{ mt: 3 }}>
//                     <AlertTitle>Payment Successful</AlertTitle>
//                     {paymentResponse.message}
//                     {paymentResponse.receiptNumber && (
//                       <Typography variant="body2" sx={{ mt: 1 }}>
//                         <strong>Receipt #:</strong> {paymentResponse.receiptNumber}
//                       </Typography>
//                     )}
//                   </Alert>
//                 )}
//               </CardContent>
//             </Collapse>
//           </PaymentFormCard>
//         </Grid>

//         {/* Deposit Summary Column */}
//         {studentId && depositStatus && (
//           <Grid item xs={12} md={6}>
//             <SummaryCard className="deposit-card">
//               <CardHeader
//                 title={
//                   <Box display="flex" alignItems="center" gap={1}>
//                     <InfoIcon color="success" />
//                     <Typography variant="h6" component="h2">
//                       Deposit Summary
//                     </Typography>
//                   </Box>
//                 }
//                 action={
//                   <IconButton onClick={() => toggleSection('depositSummary')}>
//                     {expandedSections.depositSummary ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                   </IconButton>
//                 }
//               />
//               <Collapse in={expandedSections.depositSummary}>
//                 <CardContent>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                       <Typography variant="body1" gutterBottom>
//                         <strong>Name:</strong> {depositStatus.name}
//                       </Typography>
//                       <Typography variant="body1" gutterBottom>
//                         <strong>Total Required:</strong> {formatCurrency(depositStatus.totalRequired)}
//                       </Typography>
//                       <Typography variant="body1" gutterBottom>
//                         <strong>Total Paid:</strong> {formatCurrency(depositStatus.totalPaid)}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <Typography variant="body1" gutterBottom>
//                         <strong>Carry Forward:</strong> {formatCurrency(depositStatus.carryForward)}
//                       </Typography>
//                       <Typography variant="body1" gutterBottom>
//                         <strong>Overpaid:</strong> {formatCurrency(depositStatus.overpaid)}
//                       </Typography>
//                       <Alert 
//                         severity={depositStatus.hasExtraDeposit ? 'success' : 'info'}
//                         sx={{ mt: 2 }}
//                         icon={false}
//                       >
//                         {depositStatus.message}
//                       </Alert>
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </Collapse>
//             </SummaryCard>
//           </Grid>
//         )}

//         {/* Balance Summary Section */}
//         {studentId && balanceSummary && (
//           <Grid item xs={12}>
//             <SummaryCard className="balance-card">
//               <CardHeader
//                 title={
//                   <Box display="flex" alignItems="center" gap={1}>
//                     <InfoIcon color="warning" />
//                     <Typography variant="h6" component="h2">
//                       Detailed Balance Summary
//                     </Typography>
//                   </Box>
//                 }
//                 action={
//                   <IconButton onClick={() => toggleSection('balanceSummary')}>
//                     {expandedSections.balanceSummary ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                   </IconButton>
//                 }
//               />
//               <Collapse in={expandedSections.balanceSummary}>
//                 <CardContent>
//                   <Grid container spacing={3} sx={{ mb: 2 }}>
//                     <Grid item xs={12} md={6}>
//                       <Typography variant="body1" gutterBottom>
//                         <strong>Name:</strong> {balanceSummary.name}
//                       </Typography>
//                       <Typography variant="body1" gutterBottom>
//                         <strong>Monthly Fee:</strong> {formatCurrency(balanceSummary.monthlyFee)}
//                       </Typography>
//                       <Typography variant="body1" gutterBottom>
//                         <strong>Months Generated:</strong> {balanceSummary.monthsGenerated}
//                       </Typography>
//                       <Typography variant="body1" gutterBottom>
//                         <strong>Unpaid Months:</strong> {balanceSummary.unpaidMonths}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12} md={6}>
//                       <Typography variant="body1" gutterBottom>
//                         <strong>Total Required:</strong> {formatCurrency(balanceSummary.totalRequired)}
//                       </Typography>
//                       <Typography variant="body1" gutterBottom>
//                         <strong>Total Paid:</strong> {formatCurrency(balanceSummary.totalPaid)}
//                       </Typography>
//                       <Typography variant="body1" gutterBottom>
//                         <strong>Carry Forward:</strong> {formatCurrency(balanceSummary.carryForward)}
//                       </Typography>
//                       <Typography variant="body1" gutterBottom>
//                         <strong>Balance Due:</strong> 
//                         <Box component="span" sx={{ 
//                           color: balanceSummary.balanceDue > 0 ? 'error.main' : 'success.main',
//                           fontWeight: 'bold',
//                           ml: 1
//                         }}>
//                           {formatCurrency(Math.abs(balanceSummary.balanceDue))}
//                           {balanceSummary.balanceDue < 0 && (
//                             <Chip 
//                               label="Credit" 
//                               size="small" 
//                               sx={{ 
//                                 ml: 1,
//                                 backgroundColor: 'success.light',
//                                 color: 'success.contrastText'
//                               }} 
//                             />
//                           )}
//                         </Box>
//                       </Typography>
//                     </Grid>
//                   </Grid>

//                   <Divider sx={{ my: 3 }} />

//                   <Typography variant="subtitle1" gutterBottom sx={{ 
//                     display: 'flex', 
//                     alignItems: 'center',
//                     mb: 2
//                   }}>
//                     <InfoIcon color="info" sx={{ mr: 1 }} />
//                     Unpaid Fee Details
//                   </Typography>
//                   {balanceSummary.unpaidDetails.length > 0 ? (
//                     <>
//                       <StyledTable size="small">
//                         <TableHead>
//                           <TableRow>
//                             <TableCell className="header-cell">Month/Year</TableCell>
//                             <TableCell className="header-cell" align="right">Amount Due</TableCell>
//                             <TableCell className="header-cell" align="right">Amount Paid</TableCell>
//                             <TableCell className="header-cell" align="right">Balance</TableCell>
//                           </TableRow>
//                         </TableHead>
//                         <TableBody>
//                           {balanceSummary.unpaidDetails.map((item, index) => {
//                             const balance = item.due;
//                             return (
//                               <TableRow key={index} hover>
//                                 <TableCell>{item.month} {item.year}</TableCell>
//                                 <TableCell align="right">{formatCurrency(item.due)}</TableCell>
//                                 <TableCell align="right">{formatCurrency(item.paid)}</TableCell>
//                                 <TableCell align="right">
//                                   <Chip 
//                                     label={formatCurrency(Math.abs(balance))} 
//                                     size="small"
//                                     sx={{ 
//                                       backgroundColor: balance > 0 ? 'error.light' : 'success.light',
//                                       color: balance > 0 ? 'error.contrastText' : 'success.contrastText',
//                                       fontWeight: 'bold'
//                                     }}
//                                   />
//                                 </TableCell>
//                               </TableRow>
//                             );
//                           })}
//                           <TableRow sx={{ 
//                             backgroundColor: theme.palette.grey[100],
//                             '& .MuiTableCell-root': {
//                               fontWeight: 'bold'
//                             }
//                           }}>
//                             <TableCell>Total</TableCell>
//                             <TableCell align="right">{formatCurrency(balanceSummary.totalRequired)}</TableCell>
//                             <TableCell align="right">{formatCurrency(balanceSummary.totalPaid + balanceSummary.carryForward)}</TableCell>
//                             <TableCell align="right">
//                               <Chip 
//                                 label={formatCurrency(Math.abs(balanceSummary.balanceDue))} 
//                                 size="medium"
//                                 sx={{ 
//                                   backgroundColor: balanceSummary.balanceDue > 0 ? 'error.light' : 'success.light',
//                                   color: balanceSummary.balanceDue > 0 ? 'error.contrastText' : 'success.contrastText',
//                                   fontWeight: 'bold'
//                                 }}
//                               />
//                             </TableCell>
//                           </TableRow>
//                         </TableBody>
//                       </StyledTable>
//                       <Typography variant="caption" sx={{ 
//                         display: 'block', 
//                         mt: 2, 
//                         fontStyle: 'italic',
//                         color: 'text.secondary'
//                       }}>
//                         * Includes carry forward amount if applicable
//                       </Typography>
//                     </>
//                   ) : (
//                     <Alert severity="success" icon={false}>
//                       No unpaid fees for this student
//                     </Alert>
//                   )}
//                 </CardContent>
//               </Collapse>
//             </SummaryCard>
//           </Grid>
//         )}
//       </Grid>
//     </PageContainer>
//   );
// };

// export default StudentPaymentPage;
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import {
  submitPayment,
  fetchPaymentHistory,
  fetchStudentDepositStatus,
  fetchStudentBalanceSummary
} from '../../Redux/Payment/paymentSlice';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  AlertTitle,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Collapse,
  IconButton,
  Chip,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Search as SearchIcon,
  Payment as PaymentIcon,
  Info as InfoIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  AccountBalance as BalanceIcon,
  AttachMoney as MoneyIcon,
  Discount as DiscountIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Type Definitions
interface PaymentAllocation {
  studentFeeId: number;
  paid: number;
}

interface PaymentResponse {
  payment: {
    id: number;
    amountPaid: number;
    discount: number;
    date: string;
  };
  allocations: PaymentAllocation[];
  message: string;
}

interface DepositStatus {
  name: string;
  totalRequired: number;
  totalPaid: number;
  carryForward: number;
  overpaid: number;
  hasExtraDeposit: boolean;
  message: string;
}

interface BalanceSummary {
  name: string;
  monthlyFee: number;
  unpaidMonths: number;
  unpaidDetails: {
    month: number;
    year: number;
    due: number;
    paid: number;
  }[];
}

interface FormData {
  studentId: number;
  amountPaid: string;
  discount: string;
  discountReason: string;
  description: string;
  paymentDate: Date;
}

// Helper Functions
const formatCurrency = (value: number | string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(Number(value));

// Styled Components
const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 1400,
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2)
  }
}));

const PaymentFormCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2]
}));

const SummaryCard = styled(Card)(({ theme }) => ({
  borderLeft: `6px solid ${theme.palette.info.main}`,
  borderRadius: theme.shape.borderRadius * 2,
  marginBottom: theme.spacing(3),
  '&.deposit-card': {
    borderLeftColor: theme.palette.success.main
  },
  '&.balance-card': {
    borderLeftColor: theme.palette.warning.main
  }
}));

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-root': {
    padding: theme.spacing(1.5, 2),
    '&.header-cell': {
      backgroundColor: theme.palette.grey[100],
      fontWeight: 600
    }
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

const StudentPaymentPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, paymentResponse, depositStatus, balanceSummary } =
    useAppSelector((state) => state.payment);

  const [studentId, setStudentId] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [validationMessages, setValidationMessages] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    depositSummary: true,
    balanceSummary: true
  });
  const [form, setForm] = useState<FormData>({
    studentId: 0,
    amountPaid: '',
    discount: '',
    discountReason: '',
    description: '',
    paymentDate: new Date()
  });

  useEffect(() => {
    if (studentId !== null) {
      dispatch(fetchPaymentHistory(studentId));
      dispatch(fetchStudentDepositStatus(studentId));
      dispatch(fetchStudentBalanceSummary(studentId));
      setForm((prev) => ({
        ...prev,
        studentId,
        amountPaid: '',
        discount: '',
        discountReason: '',
        description: ''
      }));
    }
  }, [dispatch, studentId]);

  const validateForm = (): string[] => {
    const errors: string[] = [];
    const amount = Number(form.amountPaid);
    const discount = Number(form.discount);

    if (!studentId) {
      errors.push('Please search and select a student first');
    }
    if (amount <= 0) {
      errors.push('Payment amount must be positive');
    }
    if (discount > amount) {
      errors.push('Discount cannot exceed payment amount');
    }
    if (form.paymentDate > new Date()) {
      errors.push('Payment date cannot be in the future');
    }
    if (form.discount && !form.discountReason.trim()) {
      errors.push('Please provide a reason for the discount');
    }

    return errors;
  };

  const handleSearch = () => {
    const id = parseInt(searchInput);
    if (!isNaN(id) && id > 0) {
      setStudentId(id);
      setValidationMessages([]);
    } else {
      setValidationMessages(['Please enter a valid Student ID (positive number)']);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear validation messages when user makes changes
    if (validationMessages.length > 0) {
      setValidationMessages([]);
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setForm({ ...form, paymentDate: date });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationMessages(errors);
      return;
    }

    if (studentId !== null) {
      dispatch(
        submitPayment({
          ...form,
          studentId,
          amountPaid: parseFloat(form.amountPaid) || 0,
          discount: parseFloat(form.discount) || 0
        })
      ).unwrap()
        .then(() => {
          // Refresh data after successful payment
          dispatch(fetchPaymentHistory(studentId));
          dispatch(fetchStudentDepositStatus(studentId));
          dispatch(fetchStudentBalanceSummary(studentId));
        })
        .catch((err) => {
          console.error('Payment failed:', err);
        });
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <PageContainer>
      <Typography variant="h4" gutterBottom>
        Student Payment Portal
      </Typography>

      {/* Student Search */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Enter Student ID"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          error={validationMessages.some(msg => msg.includes('Student ID'))}
        />
        <Button 
          variant="contained" 
          onClick={handleSearch} 
          startIcon={<SearchIcon />}
          aria-label="Search student"
        >
          Search
        </Button>
      </Box>

      {/* Validation Messages */}
      {validationMessages.map((message, index) => (
        <Alert key={index} severity="error" sx={{ mb: 2 }}>
          {message}
        </Alert>
      ))}

      <Grid container spacing={4}>
        {/* Payment Form */}
        <Grid item xs={12} md={6}>
          <PaymentFormCard>
            <CardHeader
              title="Make a Payment"
              avatar={<PaymentIcon />}
            />
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name="amountPaid"
                      label="Amount Paid"
                      value={form.amountPaid}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: <MoneyIcon sx={{ mr: 1 }} />
                      }}
                      type="number"
                      required
                      error={validationMessages.some(msg => msg.includes('amount'))}
                      inputProps={{
                        min: 0.01,
                        step: 0.01
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name="discount"
                      label="Discount"
                      value={form.discount}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: <DiscountIcon sx={{ mr: 1 }} />
                      }}
                      type="number"
                      inputProps={{
                        min: 0,
                        step: 0.01
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="discountReason"
                      label="Discount Reason"
                      value={form.discountReason}
                      onChange={handleChange}
                      disabled={!form.discount}
                      error={validationMessages.some(msg => msg.includes('reason'))}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="description"
                      label="Description"
                      value={form.description}
                      onChange={handleChange}
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
                        maxDate={new Date()}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            fullWidth 
                            error={validationMessages.some(msg => msg.includes('date'))}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <PaymentIcon />}
                    >
                      {loading ? 'Processing...' : 'Submit Payment'}
                    </Button>
                  </Grid>
                </Grid>
              </form>

              {/* API Error */}
              {error && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  <AlertTitle>Payment Error</AlertTitle>
                  {error}
                </Alert>
              )}

              {/* Payment Success */}
              {paymentResponse && paymentResponse.payment && (
                <>
                  <Alert severity="success" sx={{ mt: 3 }}>
                    <AlertTitle>Payment Successful</AlertTitle>
                    {paymentResponse.message}
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Receipt #:</strong> {paymentResponse.payment.id}
                    </Typography>
                  </Alert>

                  {/* Payment Receipt */}
                  <Box mt={3} display="flex" justifyContent="center">
                    <Paper
                      elevation={3}
                      sx={{
                        padding: 2,
                        width: 300,
                        borderRadius: 3,
                        textAlign: 'center',
                        backgroundColor: '#fafafa',
                        border: '1px solid #ddd'
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        🧾 Payment Receipt
                      </Typography>
                      <Typography variant="subtitle2">
                        Receipt No: #{paymentResponse.payment.id}
                      </Typography>
                      <Typography variant="body1" fontWeight={600} color="primary" gutterBottom>
                        {formatCurrency(paymentResponse.payment.amountPaid)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Date: {new Date(paymentResponse.payment.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Discount: {formatCurrency(paymentResponse.payment.discount)}
                      </Typography>
                      <Box mt={2} textAlign="left">
                        <Typography variant="subtitle2">Allocations:</Typography>
                        {paymentResponse.allocations.map((alloc: PaymentAllocation, idx: number) => (
                          <Typography key={idx} variant="body2" sx={{ pl: 1 }}>
                            • Fee ID #{alloc.studentFeeId} → {formatCurrency(alloc.paid)}
                          </Typography>
                        ))}
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{ mt: 2, display: 'block', color: 'text.disabled' }}
                      >
                        Thank you for your payment!
                      </Typography>
                    </Paper>
                  </Box>
                </>
              )}
            </CardContent>
          </PaymentFormCard>
        </Grid>

        {/* Deposit Summary */}
        {studentId && depositStatus && (
          <Grid item xs={12} md={6}>
            <SummaryCard className="deposit-card">
              <CardHeader
                title="Deposit Summary"
                avatar={<InfoIcon color="success" />}
                action={
                  <IconButton 
                    onClick={() => toggleSection('depositSummary')}
                    aria-label="Toggle deposit summary"
                  >
                    {expandedSections.depositSummary ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                }
              />
              <Collapse in={expandedSections.depositSummary}>
                <CardContent>
                  <Typography><strong>Name:</strong> {depositStatus.name}</Typography>
                  <Typography><strong>Total Required:</strong> {formatCurrency(depositStatus.totalRequired)}</Typography>
                  <Typography><strong>Total Paid:</strong> {formatCurrency(depositStatus.totalPaid)}</Typography>
                  <Typography><strong>Carry Forward:</strong> {formatCurrency(depositStatus.carryForward)}</Typography>
                  <Typography><strong>Overpaid:</strong> {formatCurrency(depositStatus.overpaid)}</Typography>
                  <Alert severity={depositStatus.hasExtraDeposit ? 'success' : 'info'} sx={{ mt: 2 }}>
                    {depositStatus.message}
                  </Alert>
                </CardContent>
              </Collapse>
            </SummaryCard>
          </Grid>
        )}

        {/* Balance Summary */}
        {studentId && balanceSummary && (
          <Grid item xs={12}>
            <SummaryCard className="balance-card">
              <CardHeader
                title="Balance Summary"
                avatar={<InfoIcon color="warning" />}
                action={
                  <IconButton 
                    onClick={() => toggleSection('balanceSummary')}
                    aria-label="Toggle balance summary"
                  >
                    {expandedSections.balanceSummary ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                }
              />
              <Collapse in={expandedSections.balanceSummary}>
                <CardContent>
                  <Typography><strong>Name:</strong> {balanceSummary.name}</Typography>
                  <Typography><strong>Monthly Fee:</strong> {formatCurrency(balanceSummary.monthlyFee)}</Typography>
                  <Typography><strong>Unpaid Months:</strong> {balanceSummary.unpaidMonths}</Typography>

                  <Divider sx={{ my: 2 }} />
                  <StyledTable size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Month/Year</TableCell>
                        <TableCell align="right">Due</TableCell>
                        <TableCell align="right">Paid</TableCell>
                        <TableCell align="right">Balance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {balanceSummary.unpaidDetails.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.month}/{item.year}</TableCell>
                          <TableCell align="right">{formatCurrency(item.due)}</TableCell>
                          <TableCell align="right">{formatCurrency(item.paid)}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={formatCurrency(item.due)}
                              size="small"
                              sx={{
                                backgroundColor: item.due > 0 ? 'error.light' : 'success.light',
                                color: item.due > 0 ? 'error.contrastText' : 'success.contrastText'
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </StyledTable>
                </CardContent>
              </Collapse>
            </SummaryCard>
          </Grid>
        )}
      </Grid>
    </PageContainer>
  );
};

export default StudentPaymentPage;