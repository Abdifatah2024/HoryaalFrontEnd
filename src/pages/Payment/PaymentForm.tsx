import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import {
  submitPayment,
  submitMultiPayment,
  fetchPaymentHistory,
  fetchStudentDepositStatus,
  fetchStudentBalanceSummary
} from '../../Redux/Payment/paymentSlice';
import {
  triggerGenerateFees,
  clearGenerateFeesMessage
} from '../../Redux/Payment/FeegenerateSlice';
import { useReactToPrint } from 'react-to-print';
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
  Avatar,
  InputAdornment,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import {
  Search as SearchIcon,
  Autorenew as AutorenewIcon,
  Payment as PaymentIcon,
  Discount as DiscountIcon,
  CalendarToday as CalendarIcon,
  Receipt as ReceiptIcon,
  BadgeRounded as BadgeRoundedIcon,
  AccountBalanceWallet as WalletIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Print as PrintIcon,
  Info as InfoIcon,
  CheckCircleOutlineRounded as CheckCircleOutlineRoundedIcon,
  ErrorOutlineRounded as ErrorOutlineRoundedIcon,
  ArrowDropDown as ArrowDropDownIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Styled Components
const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 1400,
  margin: '0 auto',
  '@media print': {
    padding: 0
  }
}));

const ReceiptContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  maxWidth: 500,
  '@media print': {
    border: 'none',
    padding: 0,
    maxWidth: '100%'
  }
}));

const PageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  gap: theme.spacing(2),
  flexWrap: 'wrap'
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flexGrow: 1,
  maxWidth: 600,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column'
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1.5, 3),
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: theme.shadows[1],
  '&:hover': {
    boxShadow: theme.shadows[3]
  }
}));

const PaymentFormCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  height: '100%'
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

const SummaryHeader = styled(CardHeader)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiCardHeader-action': {
    marginTop: theme.spacing(0.5)
  }
}));

const PaymentInputField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 2,
    '&.Mui-focused fieldset': {
      borderWidth: 2
    }
  }
}));

const StatusBadge = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.75rem',
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius
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

const formatCurrency = (value: number | string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(Number(value));

interface PaymentFormData {
  studentId: number;
  amountPaid: number;
  discount: number;
  discountReason: string;
  paymentDate: Date;
}

interface ExpandedSections {
  depositSummary: boolean;
  balanceSummary: boolean;
}

interface ReceiptProps {
  payment: {
    id: number;
    studentId: number;
    StudentName: string;
    userId: number;
    amountPaid: string;
    discount: string;
    Description: string;
    date: string;
  };
  allocations: Array<{
    studentFeeId: number;
    total: number;
    paid: number;
    discount: number;
    month: number;
    year: number;
  }>;
  carryForward: number;
}

const ReceiptVoucher: React.FC<ReceiptProps> = ({ payment, allocations, carryForward }) => {
  const paymentDate = new Date(payment.date);
  
  return (
    <ReceiptContainer elevation={3} className="receipt-container">
      <Box textAlign="center" mb={3}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          AL-IRSHAAD SECONDARY SCHOOL 
        </Typography>
        
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Payment Receipt
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {paymentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Typography>
      </Box>
      
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6}>
          <Typography variant="subtitle1" color="text.secondary">
            Name:
          </Typography>
          <Typography variant="body1">{payment.StudentName}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="text.secondary">
           Receipt No.
          </Typography>
          <Typography variant="body1">{payment.id}</Typography>
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
            <TableCell align="right">{formatCurrency(Number(payment.amountPaid))}</TableCell>
          </TableRow>
          {Number(payment.discount) > 0 && (
            <TableRow>
              <TableCell>Discount</TableCell>
              <TableCell align="right">-{formatCurrency(Number(payment.discount))}</TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Payment Method</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
              {payment.Description}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
              {formatCurrency(Number(payment.amountPaid) + Number(payment.discount))}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      {allocations.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight="bold" mt={3} mb={1}>
            Allocation
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Period</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allocations.map((allocation, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(allocation.year, allocation.month - 1).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell align="right">{formatCurrency(allocation.paid)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
      
      {carryForward > 0 && (
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            Note: {formatCurrency(carryForward)} has been carried forward to next payment.
          </Typography>
        </Box>
      )}
      
      <Box mt={4} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Thank you for your payment!
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary" mt={2}>
          This is an automated receipt. No signature required.
        </Typography>
      </Box>
    </ReceiptContainer>
  );
};

const SummaryPrintView: React.FC<{
  depositStatus: any;
  balanceSummary: any;
}> = ({ depositStatus, balanceSummary }) => {
  return (
    <Box sx={{ p: 3, backgroundColor: 'white', color: 'black' }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          AL-IRSHAAD SECONDARY SCHOOL
        </Typography>
        <Typography variant="h6" gutterBottom>
          Student Account Summary
        </Typography>
        <Typography variant="body2">
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Typography>
      </Box>

      {depositStatus && (
        <Box mb={4}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle1" fontWeight="bold">
                Student Name:
              </Typography>
              <Typography variant="body1">{depositStatus.name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" fontWeight="bold">
                Student ID:
              </Typography>
              <Typography variant="body1">{depositStatus.studentId}</Typography>
            </Grid>
          </Grid>
        </Box>
      )}

      <Box mb={4}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ borderBottom: '1px solid #ddd', pb: 1 }}>
          Deposit Status
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <Typography variant="subtitle2" fontWeight="bold">
              Status:
            </Typography>
            <Chip
              label={depositStatus?.hasExtraDeposit ? 'Sufficient Deposit' : 'Insufficient Deposit'}
              color={depositStatus?.hasExtraDeposit ? 'success' : 'warning'}
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2" fontWeight="bold">
              Required:
            </Typography>
            <Typography>{formatCurrency(depositStatus?.totalRequired || 0)}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2" fontWeight="bold">
              Paid:
            </Typography>
            <Typography>{formatCurrency(depositStatus?.totalPaid || 0)}</Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" fontWeight="bold">
              Carry Forward:
            </Typography>
            <Typography>{formatCurrency(depositStatus?.carryForward || 0)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" fontWeight="bold">
              Overpaid:
            </Typography>
            <Typography>{formatCurrency(depositStatus?.overpaid || 0)}</Typography>
          </Grid>
        </Grid>

        <Box mt={2}>
          <Typography variant="body2" fontStyle="italic">
            {depositStatus?.message}
          </Typography>
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ borderBottom: '1px solid #ddd', pb: 1 }}>
          Balance Summary
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" fontWeight="bold">
              Monthly Fee:
            </Typography>
            <Typography>{formatCurrency(balanceSummary?.monthlyFee || 0)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" fontWeight="bold">
              Unpaid Months:
            </Typography>
            <Typography>{balanceSummary?.unpaidMonths || 0}</Typography>
          </Grid>
        </Grid>

        {balanceSummary?.unpaidDetails && balanceSummary.unpaidDetails.length > 0 && (
          <>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Unpaid Details:
            </Typography>
            <Table size="small" sx={{ border: '1px solid #ddd' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Period</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Due</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Paid</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {balanceSummary.unpaidDetails.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      {new Date(item.year, item.month - 1).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell align="right">{formatCurrency(item.due)}</TableCell>
                    <TableCell align="right">{formatCurrency(item.paid)}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={formatCurrency(item.due)}
                        color={item.due - item.paid > 0 ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}

        <Box mt={4} textAlign="center">
          <Typography variant="body2" fontStyle="italic">
            Generated on {new Date().toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const StudentPaymentPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    loading, 
    error, 
    paymentResponse, 
    depositStatus, 
    balanceSummary 
  } = useAppSelector((state) => state.payment);
  const generateFeesState = useAppSelector((state) => state.generateFees);

  const [isMulti, setIsMulti] = useState(false);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [form, setForm] = useState<PaymentFormData>({
    studentId: 0,
    amountPaid: 0,
    discount: 0,
    discountReason: '',
    paymentDate: new Date()
  });

  const [multiForms, setMultiForms] = useState<PaymentFormData[]>([
    { studentId: 0, amountPaid: 0, discount: 0, discountReason: '', paymentDate: new Date() }
  ]);

  const [validationMessages, setValidationMessages] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    depositSummary: true,
    balanceSummary: true
  });

  // Payment method states
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [zaadNumber, setZaadNumber] = useState('');
  const [edahabNumber, setEdahabNumber] = useState('');

  const summaryPrintRef = useRef<HTMLDivElement>(null);
 const handlePrintSummary = useReactToPrint({
  content: () => summaryPrintRef.current||null,
  documentTitle: `Summary_${studentId}`,
  pageStyle: `@page { size: A4; margin: 20mm; }`
});


  useEffect(() => {
    const globalStyles = `
      @media print {
        body * {
          visibility: hidden;
        }
        .receipt-container, .receipt-container * {
          visibility: visible;
        }
        .receipt-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
      }
    `;

    const styleElement = document.createElement('style');
    styleElement.innerHTML = globalStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    if (studentId !== null) {
      dispatch(fetchPaymentHistory(studentId));
      dispatch(fetchStudentDepositStatus(studentId));
      dispatch(fetchStudentBalanceSummary(studentId));
      setForm((prev) => ({
        ...prev,
        studentId,
        amountPaid: 0,
        discount: 0,
        discountReason: '',
      }));
    }
  }, [dispatch, studentId]);

  const handleSearch = () => {
    const id = parseInt(searchInput);
    if (!isNaN(id) && id > 0) {
      setStudentId(id);
      setValidationMessages([]);
    } else {
      setValidationMessages(['Please enter a valid Student ID']);
    }
  };

  const handleGenerateFees = () => {
    dispatch(triggerGenerateFees());
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!studentId) {
      errors.push('Please search for a valid student first');
      return errors;
    }

    if (form.amountPaid <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (form.discount > form.amountPaid) {
      errors.push('Discount cannot exceed the payment amount');
    }

    if (form.discount > 0 && !form.discountReason.trim()) {
      errors.push('Please provide a reason for the discount');
    }

    // Validate payment method details
    if (paymentMethod === 'ZAAD' && !zaadNumber.trim()) {
      errors.push('Please enter a valid ZAAD number');
    }
    
    if (paymentMethod === 'E-dahab' && !edahabNumber.trim()) {
      errors.push('Please enter a valid E-dahab number');
    }

    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationMessages(errors);
      return;
    }

    // Create description based on payment method
    let description = paymentMethod;
    if (paymentMethod === 'ZAAD' && zaadNumber) {
      description = `ZAAD - ${zaadNumber}`;
    } else if (paymentMethod === 'E-dahab' && edahabNumber) {
      description = `E-dahab - ${edahabNumber}`;
    }

    dispatch(submitPayment({
      ...form,
      studentId: studentId!,
      amountPaid: form.amountPaid,
      discount: form.discount,
      Description: description
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'amountPaid' || name === 'discount' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) setForm({ ...form, paymentDate: date });
  };

  const handleMultiFormChange = (index: number, key: string, value: any) => {
    setMultiForms((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [key]: key === 'amountPaid' ? parseFloat(value) || 0 : value } : item
      )
    );
  };

  const handleMultiSubmit = () => {
    const errors: string[] = [];
    
    // Validate each form in multiForms
    multiForms.forEach((entry, index) => {
      if (!entry.studentId || entry.studentId <= 0) {
        errors.push(`Entry ${index + 1}: Invalid Student ID`);
      }
      if (entry.amountPaid <= 0) {
        errors.push(`Entry ${index + 1}: Amount must be greater than 0`);
      }
      if (entry.discount > entry.amountPaid) {
        errors.push(`Entry ${index + 1}: Discount cannot exceed payment amount`);
      }
      if (entry.discount > 0 && !entry.discountReason.trim()) {
        errors.push(`Entry ${index + 1}: Discount reason required`);
      }
    });

    if (errors.length > 0) {
      setValidationMessages(errors);
      return;
    }

    dispatch(
      submitMultiPayment({
        students: multiForms.map(entry => ({
          studentId: entry.studentId,
          amountPaid: entry.amountPaid,
          discount: entry.discount,
          discountReason: entry.discountReason,
          Description: "Payment" // Default for multi-payment
        }))
      })
    );
  };

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle payment method change
  const handlePaymentMethodChange = (e: SelectChangeEvent) => {
    const method = e.target.value as string;
    setPaymentMethod(method);
    
    // Clear number inputs when switching methods
    if (method !== 'ZAAD') setZaadNumber('');
    if (method !== 'E-dahab') setEdahabNumber('');
  };

  return (
    <PageContainer>
      {/* Hidden print component */}
      <Box sx={{ display: 'none' }}>
        <div ref={summaryPrintRef}>
          {studentId && depositStatus && balanceSummary && (
            <SummaryPrintView 
              depositStatus={depositStatus} 
              balanceSummary={balanceSummary} 
            />
          )}
        </div>
      </Box>

      {/* Header Section */}
      <PageHeader>
        <Box>
          <Typography variant="h4" fontWeight="700" gutterBottom>
            Student Payment Portal
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage student payments, view balances, and process transactions
          </Typography>
        </Box>
        
        <SearchContainer>
          <PaymentInputField
            label="Enter Student ID"
            variant="outlined"
            size="small"
            fullWidth
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeRoundedIcon color="action" />
                </InputAdornment>
              )
            }}
          />
          <ActionButton
            variant="contained"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
          >
            Find Student
          </ActionButton>
          <ActionButton
            variant="outlined"
            color="secondary"
            onClick={handleGenerateFees}
            disabled={generateFeesState.loading}
            startIcon={
              generateFeesState.loading ? (
                <CircularProgress size={20} />
              ) : (
                <AutorenewIcon />
              )
            }
          >
            Generate Fees
          </ActionButton>
          <ActionButton
            variant={isMulti ? 'contained' : 'outlined'}
            onClick={() => setIsMulti(!isMulti)}
          >
            {isMulti ? 'Single Mode' : 'Multi Mode'}
          </ActionButton>
        </SearchContainer>
      </PageHeader>

      {/* System Alerts */}
      <Box mb={3}>
        {generateFeesState.message && (
          <Alert
            severity="success"
            onClose={() => dispatch(clearGenerateFeesMessage())}
            sx={{ mb: 1 }}
            icon={<CheckCircleOutlineRoundedIcon fontSize="inherit" />}
          >
            <AlertTitle>Success</AlertTitle>
            {generateFeesState.message}
          </Alert>
        )}
        {generateFeesState.error && (
          <Alert
            severity="error"
            onClose={() => dispatch(clearGenerateFeesMessage())}
            sx={{ mb: 1 }}
            icon={<ErrorOutlineRoundedIcon fontSize="inherit" />}
          >
            <AlertTitle>Error</AlertTitle>
            {generateFeesState.error}
          </Alert>
        )}
        {validationMessages.map((msg, idx) => (
          <Alert key={idx} severity="error" sx={{ mb: 1 }}>
            {msg}
          </Alert>
        ))}
      </Box>

      {/* Main Content Grid */}
      {isMulti ? (
        // Multi-payment form
        <Box>
          <Typography variant="h5" gutterBottom mb={2}>
            Multi-Student Payment
          </Typography>
          
          {multiForms.map((entry, index) => (
            <Paper key={index} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <PaymentInputField
                    fullWidth
                    label="Student ID"
                    type="number"
                    value={entry.studentId === 0 ? '' : entry.studentId}
                    onChange={(e) => handleMultiFormChange(index, 'studentId', e.target.value)}
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <PaymentInputField
                    fullWidth
                    label="Amount Paid"
                    type="number"
                    value={entry.amountPaid === 0 ? '' : entry.amountPaid}
                    onChange={(e) => handleMultiFormChange(index, 'amountPaid', e.target.value)}
                    required
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PaymentIcon color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <PaymentInputField
                    fullWidth
                    label="Discount"
                    type="number"
                    value={entry.discount === 0 ? '' : entry.discount}
                    onChange={(e) => handleMultiFormChange(index, 'discount', e.target.value)}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DiscountIcon color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                {entry.discount > 0 && (
                  <Grid item xs={12} sm={6}>
                    <PaymentInputField
                      fullWidth
                      label="Discount Reason"
                      value={entry.discountReason}
                      onChange={(e) => handleMultiFormChange(index, 'discountReason', e.target.value)}
                      size="small"
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Payment Date"
                      value={entry.paymentDate}
                      onChange={(date) => 
                        handleMultiFormChange(index, 'paymentDate', date || new Date())
                      }
                      maxDate={new Date()}
                      renderInput={(params) => (
                        <PaymentInputField
                          {...params}
                          fullWidth
                          size="small"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarIcon color="action" />
                              </InputAdornment>
                            )
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Paper>
          ))}
          
          <Box display="flex" gap={2} mt={2}>
            <ActionButton
              variant="outlined"
              onClick={() => setMultiForms([...multiForms, 
                { studentId: 0, amountPaid: 0, discount: 0, discountReason: '', paymentDate: new Date() }
              ])}
            >
              Add Another Student
            </ActionButton>
            <ActionButton
              variant="contained"
              color="success"
              onClick={handleMultiSubmit}
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <PaymentIcon />
              }
            >
              Submit Multi Payments
            </ActionButton>
          </Box>
        </Box>
      ) : (
        // Single payment mode
        <Grid container spacing={3}>
          {/* Payment Form Column */}
          <Grid item xs={12} md={5}>
            <PaymentFormCard>
              <SummaryHeader
                title={
                  <Typography variant="h6" fontWeight="600">
                    New Payment
                  </Typography>
                }
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <PaymentIcon />
                  </Avatar>
                }
              />
              <CardContent>
                <form onSubmit={handleSubmit}>
                  {/* Payment Method Dropdown */}
                  <Grid item xs={12} mb={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="payment-method-label">Payment Method</InputLabel>
                      <Select
                        labelId="payment-method-label"
                        value={paymentMethod}
                        label="Payment Method"
                        onChange={handlePaymentMethodChange}
                        fullWidth
                        IconComponent={ArrowDropDownIcon}
                      >
                        <MenuItem value="Cash">Cash</MenuItem>
                        <MenuItem value="ZAAD">ZAAD</MenuItem>
                        <MenuItem value="E-dahab">E-dahab</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* ZAAD Input */}
                  {paymentMethod === 'ZAAD' && (
                    <Grid item xs={12} mb={2}>
                      <Box display="flex" gap={1}>
                        <PaymentInputField
                          fullWidth
                          label="ZAAD Number"
                          value={zaadNumber}
                          onChange={(e) => setZaadNumber(e.target.value)}
                          size="small"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PaymentIcon color="action" />
                              </InputAdornment>
                            )
                          }}
                        />
                      </Box>
                    </Grid>
                  )}

                  {/* E-dahab Input */}
                  {paymentMethod === 'E-dahab' && (
                    <Grid item xs={12} mb={2}>
                      <Box display="flex" gap={1}>
                        <PaymentInputField
                          fullWidth
                          label="E-dahab Number"
                          value={edahabNumber}
                          onChange={(e) => setEdahabNumber(e.target.value)}
                          size="small"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PaymentIcon color="action" />
                              </InputAdornment>
                            )
                          }}
                        />
                      </Box>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <PaymentInputField
                      fullWidth
                      label="Amount Paid"
                      name="amountPaid"
                      value={form.amountPaid === 0 ? '' : form.amountPaid}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PaymentIcon color="action" />
                          </InputAdornment>
                        )
                      }}
                      type="number"
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <PaymentInputField
                      fullWidth
                      label="Discount Amount"
                      name="discount"
                      value={form.discount === 0 ? '' : form.discount}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DiscountIcon color="action" />
                          </InputAdornment>
                        )
                      }}
                      type="number"
                      size="small"
                    />
                  </Grid>
                  {form.discount > 0 && (
                    <Grid item xs={12}>
                      <PaymentInputField
                        fullWidth
                        label="Discount Reason"
                        name="discountReason"
                        value={form.discountReason}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Payment Date"
                        value={form.paymentDate}
                        onChange={handleDateChange}
                        maxDate={new Date()}
                        renderInput={(params) => (
                          <PaymentInputField
                            {...params}
                            fullWidth
                            size="small"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CalendarIcon color="action" />
                                </InputAdornment>
                              )
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} mt={2}>
                    <ActionButton
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading || !studentId}
                      startIcon={
                        loading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <PaymentIcon />
                        )
                      }
                      size="large"
                    >
                      {loading ? 'Processing...' : 'Submit Payment'}
                    </ActionButton>
                  </Grid>
                </form>

                {error && (
                  <Alert severity="error" sx={{ mt: 3 }}>
                    <AlertTitle>Payment Error</AlertTitle>
                    {error}
                  </Alert>
                )}

                {paymentResponse && (
                  <Box>
                    <Alert severity="success" sx={{ mt: 3 }}>
                      <AlertTitle>Payment Successful</AlertTitle>
                      {paymentResponse.message}
                      <Box mt={2}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => window.print()}
                          startIcon={<ReceiptIcon />}
                        >
                          Print Receipt
                        </Button>
                      </Box>
                    </Alert>
                    
                    <ReceiptVoucher
                      payment={{...paymentResponse.payment,
                        StudentName: paymentResponse.StudentName}}
                      allocations={paymentResponse.allocations}
                      carryForward={paymentResponse.carryForward}
                    />
                  </Box>
                )}
              </CardContent>
            </PaymentFormCard>
          </Grid>

          {/* Student Summary Column */}
          <Grid item xs={12} md={7}>
            {studentId ? (
              <>
                {/* Deposit Status Card */}
                <SummaryCard className="deposit-card" sx={{ mb: 3 }}>
                  <SummaryHeader
                    title={
                      <Typography variant="h6" fontWeight="600">
                        Deposit Status
                      </Typography>
                    }
                    avatar={
                      <Avatar sx={{ bgcolor: 'success.light' }}>
                        <WalletIcon />
                      </Avatar>
                    }
                    action={
                      <Box>
                        <IconButton 
                          onClick={() => toggleSection('depositSummary')}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          {expandedSections.depositSummary ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                        <IconButton 
                          onClick={handlePrintSummary}
                          size="small"
                          disabled={!studentId}
                          title="Print Summary"
                        >
                          <PrintIcon />
                        </IconButton>
                      </Box>
                    }
                  />
                  <Collapse in={expandedSections.depositSummary}>
                    <CardContent>
                      {depositStatus ? (
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Student Name
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {depositStatus.name}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Status
                            </Typography>
                            <StatusBadge
                              label={
                                depositStatus.hasExtraDeposit
                                  ? 'Sufficient Deposit'
                                  : 'Insufficient Deposit'
                              }
                              color={
                                depositStatus.hasExtraDeposit
                                  ? 'success'
                                  : 'warning'
                              }
                            />
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Required
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {formatCurrency(depositStatus.totalRequired)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Paid
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {formatCurrency(depositStatus.totalPaid)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Carry Forward
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {formatCurrency(depositStatus.carryForward)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Overpaid
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {formatCurrency(depositStatus.overpaid)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} mt={1}>
                            <Alert
                              severity={
                                depositStatus.hasExtraDeposit
                                  ? 'success'
                                  : 'info'
                              }
                              icon={
                                depositStatus.hasExtraDeposit ? (
                                  <CheckCircleOutlineRoundedIcon />
                                ) : (
                                  <InfoIcon />
                                )
                              }
                            >
                              {depositStatus.message}
                            </Alert>
                          </Grid>
                        </Grid>
                      ) : (
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          minHeight={100}
                        >
                          <CircularProgress />
                        </Box>
                      )}
                    </CardContent>
                  </Collapse>
                </SummaryCard>

                {/* Balance Summary Card */}
                <SummaryCard className="balance-card">
                  <SummaryHeader
                    title={
                      <Typography variant="h6" fontWeight="600">
                        Balance Summary
                      </Typography>
                    }
                    avatar={
                      <Avatar sx={{ bgcolor: 'warning.light' }}>
                        <ReceiptIcon />
                      </Avatar>
                    }
                    action={
                      <IconButton onClick={() => toggleSection('balanceSummary')}>
                        {expandedSections.balanceSummary ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                    }
                  />
                  <Collapse in={expandedSections.balanceSummary}>
                    <CardContent>
                      {balanceSummary ? (
                        <>
                          <Grid container spacing={2} mb={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                Monthly Fee
                              </Typography>
                              <Typography variant="body1" fontWeight="500">
                                {formatCurrency(balanceSummary.monthlyFee)}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                Unpaid Months
                              </Typography>
                              <Typography variant="body1" fontWeight="500">
                                {balanceSummary.unpaidMonths}
                              </Typography>
                            </Grid>
                          </Grid>

                          <Divider sx={{ my: 2 }} />

                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            mb={1}
                          >
                            Unpaid Details
                          </Typography>
                          <Box
                            sx={{
                              maxHeight: 300,
                              overflow: 'auto',
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: 'divider'
                            }}
                          >
                            <StyledTable>
                              <TableHead>
                                <TableRow>
                                  <TableCell className="header-cell">
                                    Period
                                  </TableCell>
                                  <TableCell
                                    className="header-cell"
                                    align="right"
                                  >
                                    Due
                                  </TableCell>
                                  <TableCell
                                    className="header-cell"
                                    align="right"
                                  >
                                    Paid
                                  </TableCell>
                                  <TableCell
                                    className="header-cell"
                                    align="right"
                                  >
                                    Status
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {balanceSummary.unpaidDetails.map(
                                  (item, index) => (
                                    <TableRow key={index} hover>
                                      <TableCell>
                                        {new Date(
                                          item.year,
                                          item.month - 1
                                        ).toLocaleDateString('en-US', {
                                          month: 'short',
                                          year: 'numeric'
                                        })}
                                      </TableCell>
                                      <TableCell align="right">
                                        {formatCurrency(item.due)}
                                      </TableCell>
                                      <TableCell align="right">
                                        {formatCurrency(item.paid)}
                                      </TableCell>
                                      <TableCell align="right">
                                        <StatusBadge
                                          label={formatCurrency(
                                            item.due
                                          )}
                                          color={
                                            item.due > 0
                                              ? 'error'
                                              : 'success'
                                          }
                                        />
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </StyledTable>
                          </Box>
                        </>
                      ) : (
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          minHeight={100}
                        >
                          <CircularProgress />
                        </Box>
                      )}
                    </CardContent>
                  </Collapse>
                </SummaryCard>
              </>
            ) : (
              <Paper
                sx={{
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 300,
                  borderRadius: 2,
                  textAlign: 'center',
                  bgcolor: 'background.paper'
                }}
              >
                <WalletIcon
                  sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Student Selected
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Search for a student to view payment history and account
                  details
                </Typography>
                <ActionButton
                  variant="outlined"
                  onClick={() => document.getElementById('student-search')?.focus()}
                  startIcon={<SearchIcon />}
                >
                  Search Student
                </ActionButton>
              </Paper>
            )}
          </Grid>
        </Grid>
      )}
    </PageContainer>
  );
};

export default StudentPaymentPage;
// import React, { useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from "../../Redux/store";
// import {
//   fetchFamilyBalance,
//   payFamilyMonthly,
//   clearFamilyBalance,
//   clearFamilyPaymentStatus,
//   checkPaymentNumberUsed,
//   checkLastPaymentByNumber,
// } from "../../Redux/Payment/familyPaymentSlice";
// import { toast } from "react-hot-toast";
// import { FiSearch, FiX, FiDollarSign, FiInfo, FiUser } from "react-icons/fi";
// import { FaUserGraduate, FaMoneyBillWave } from "react-icons/fa";

// const FamilyPayment: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const {
//     family,
//     loading,
//     error,
//     paymentError,
//     paymentSuccess,
//     paymentLoading,
//     checkLoading,
//     lastPayment,
//   } = useAppSelector((state) => state.familyPayment);

//   const [parentPhone, setParentPhone] = useState("");
//   const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
//   const [year, setYear] = useState<number>(new Date().getFullYear());
//   const [discount, setDiscount] = useState<number>(0);
//   const [discountReason, setDiscountReason] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("Cash");
//   const [zaadNumber, setZaadNumber] = useState("");
//   const [edahabNumber, setEdahabNumber] = useState("");
//   const [isDiscountVisible, setIsDiscountVisible] = useState(false);
//   const [numberChecked, setNumberChecked] = useState(false);

//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

//   const handleSearch = (e?: React.FormEvent) => {
//     e?.preventDefault();
//     if (parentPhone.trim()) {
//       dispatch(fetchFamilyBalance(parentPhone.trim()));
//     }
//   };

//   const handleCheckNumber = async () => {
//     const number =
//       paymentMethod === "ZAAD" ? zaadNumber.trim() :
//       paymentMethod === "E-dahab" ? edahabNumber.trim() : "";

//     if (!number) {
//       toast.error("Please enter a valid number to check.");
//       return;
//     }

//     try {
//       const result = await dispatch(
//         checkPaymentNumberUsed({ number, month, year, method: paymentMethod })
//       ).unwrap();

//       if (result.alreadyUsed) {
//         toast.error(result.message);
//         setNumberChecked(false);
//       } else {
//         toast.success(result.message);
//         setNumberChecked(true);
//       }

//       // Fetch latest payment info as well
//       dispatch(checkLastPaymentByNumber({ number, method: paymentMethod }));
//     } catch (error: any) {
//       toast.error(error);
//       setNumberChecked(false);
//     }
//   };

//   const handlePay = (e: React.FormEvent) => {
//     e.preventDefault();

//     let finalDescription = paymentMethod;
//     if (paymentMethod === "ZAAD" && zaadNumber.trim()) {
//       finalDescription = `ZAAD - ${zaadNumber.trim()}`;
//     } else if (paymentMethod === "E-dahab" && edahabNumber.trim()) {
//       finalDescription = `E-dahab - ${edahabNumber.trim()}`;
//     }

//     dispatch(
//       payFamilyMonthly({
//         parentPhone,
//         month,
//         year,
//         discount,
//         discountReason,
//         description: finalDescription,
//       })
//     );
//   };

//   const handleClear = () => {
//     dispatch(clearFamilyBalance());
//     setParentPhone("");
//     setMonth(new Date().getMonth() + 1);
//     setYear(new Date().getFullYear());
//     setDiscount(0);
//     setDiscountReason("");
//     setZaadNumber("");
//     setEdahabNumber("");
//     setPaymentMethod("Cash");
//     setNumberChecked(false);
//     setIsDiscountVisible(false);
//   };

//   useEffect(() => {
//     if (paymentSuccess) {
//       toast.success(paymentSuccess);
//       dispatch(clearFamilyPaymentStatus());
//       dispatch(fetchFamilyBalance(parentPhone));
//     }
//     if (paymentError) {
//       toast.error(paymentError);
//       dispatch(clearFamilyPaymentStatus());
//     }
//   }, [paymentSuccess, paymentError, dispatch, parentPhone]);

//   return (
//     <div className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow">
//       <div className="flex items-center mb-6">
//         <FaMoneyBillWave className="text-blue-600 text-3xl mr-3" />
//         <h2 className="text-3xl font-bold text-gray-800">Family Payment Portal</h2>
//       </div>

//       {/* Search */}
//       <form onSubmit={handleSearch} className="mb-6 flex gap-3 flex-wrap">
//         <div className="relative flex-grow">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
//             <FiUser className="text-gray-400" />
//           </div>
//           <input
//             type="text"
//             placeholder="Enter Parent Phone Number"
//             className="border pl-10 pr-4 py-2 rounded w-full"
//             value={parentPhone}
//             onChange={(e) => setParentPhone(e.target.value)}
//           />
//         </div>
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
//         >
//           {loading ? "Searching..." : "Search"}
//         </button>
//         {family && (
//           <button
//             type="button"
//             onClick={handleClear}
//             className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
//           >
//             Clear
//           </button>
//         )}
//       </form>

//       {/* Error */}
//       {error && (
//         <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
//           <FiInfo className="inline-block mr-2" />
//           {error}
//         </div>
//       )}

//       {/* Last Payment Response */}
//       {lastPayment && (
//         <div className="bg-gray-50 border border-gray-200 p-4 rounded mb-6">
//           <p className="text-gray-800 font-semibold">{lastPayment.message}</p>
//           {lastPayment.alreadyUsed && (
//             <>
//               <p className="text-sm text-gray-500 mt-2">
//                 Description: <strong>{lastPayment.description}</strong><br />
//                 Created At: <strong>{new Date(lastPayment.createdAt).toLocaleString()}</strong>
//               </p>
//               <ul className="mt-3 text-sm list-disc list-inside">
//                 {lastPayment.paidFor.map((p, i) => (
//                   <li key={i}>
//                     {p.student} - {p.month}/{p.year} - ${p.amount}
//                   </li>
//                 ))}
//               </ul>
//             </>
//           )}
//         </div>
//       )}

//       {family && (
//         <div className="grid md:grid-cols-2 gap-6">
//           {/* Payment Form */}
//           <form onSubmit={handlePay} className="bg-gray-50 border rounded p-6 space-y-4">
//             <h3 className="text-xl font-semibold mb-2 text-gray-800">💵 Payment Details</h3>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label>Month</label>
//                 <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="w-full border px-3 py-2 rounded">
//                   {[...Array(12)].map((_, i) => (
//                     <option key={i + 1} value={i + 1}>
//                       {new Date(0, i).toLocaleString("default", { month: "long" })}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label>Year</label>
//                 <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full border px-3 py-2 rounded">
//                   {years.map((y) => (
//                     <option key={y} value={y}>{y}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Payment Method */}
//             <div>
//               <label>Payment Method</label>
//               <select
//                 value={paymentMethod}
//                 onChange={(e) => {
//                   setPaymentMethod(e.target.value);
//                   setZaadNumber("");
//                   setEdahabNumber("");
//                   setNumberChecked(false);
//                 }}
//                 className="w-full border px-3 py-2 rounded"
//               >
//                 <option value="Cash">Cash</option>
//                 <option value="ZAAD">ZAAD</option>
//                 <option value="E-dahab">E-dahab</option>
//               </select>
//             </div>

//             {paymentMethod === "ZAAD" && (
//               <div>
//                 <label>ZAAD Number</label>
//                 <input
//                   type="text"
//                   value={zaadNumber}
//                   onChange={(e) => setZaadNumber(e.target.value)}
//                   className="w-full border px-3 py-2 rounded"
//                 />
//                 <button
//                   type="button"
//                   onClick={handleCheckNumber}
//                   className="text-sm text-blue-600 mt-1"
//                 >
//                   {checkLoading ? "Checking..." : "Check number"}
//                 </button>
//               </div>
//             )}

//             {paymentMethod === "E-dahab" && (
//               <div>
//                 <label>E-dahab Number</label>
//                 <input
//                   type="text"
//                   value={edahabNumber}
//                   onChange={(e) => setEdahabNumber(e.target.value)}
//                   className="w-full border px-3 py-2 rounded"
//                 />
//                 <button
//                   type="button"
//                   onClick={handleCheckNumber}
//                   className="text-sm text-blue-600 mt-1"
//                 >
//                   {checkLoading ? "Checking..." : "Check number"}
//                 </button>
//               </div>
//             )}

//             {/* Discount */}
//             <div>
//               <button
//                 type="button"
//                 onClick={() => setIsDiscountVisible(!isDiscountVisible)}
//                 className="text-sm text-blue-500 hover:underline"
//               >
//                 {isDiscountVisible ? "Hide Discount" : "Apply Discount"}
//               </button>

//               {isDiscountVisible && (
//                 <div className="mt-2 space-y-2">
//                   <input
//                     type="number"
//                     value={discount}
//                     onChange={(e) => setDiscount(Number(e.target.value))}
//                     className="w-full border px-3 py-2 rounded"
//                     placeholder="Discount Amount"
//                     min={0}
//                   />
//                   {discount > 0 && (
//                     <input
//                       type="text"
//                       value={discountReason}
//                       onChange={(e) => setDiscountReason(e.target.value)}
//                       className="w-full border px-3 py-2 rounded"
//                       placeholder="Discount Reason"
//                     />
//                   )}
//                 </div>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={
//                 paymentLoading ||
//                 ((paymentMethod === "ZAAD" || paymentMethod === "E-dahab") && !numberChecked)
//               }
//               className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded w-full"
//             >
//               {paymentLoading ? "Processing..." : "Confirm & Pay"}
//             </button>
//           </form>

//           {/* Students Section - Hidden when lastPayment exists */}
//           {!lastPayment && (
//             <div className="border rounded p-6 bg-white">
//               <h3 className="text-xl font-semibold mb-4">🧑‍🎓 Students</h3>
//               <p className="text-lg font-bold text-blue-700 mb-4">
//                 Total Balance: ${family.totalFamilyBalance.toFixed(2)}
//               </p>
//               {family.students.map((s) => (
//                 <div key={s.studentId} className="border p-3 mb-4 rounded">
//                   <h4 className="font-semibold">{s.fullname}</h4>
//                   <p>Balance: ${s.balance.toFixed(2)}</p>
//                   <ul className="text-sm mt-2 space-y-1">
//                     {s.months.map((m, i) => (
//                       <li key={i}>
//                         {new Date(m.year, m.month - 1).toLocaleString("default", {
//                           month: "long",
//                         })}{" "}
//                         {m.year} - Due: ${m.due.toFixed(2)}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FamilyPayment;
