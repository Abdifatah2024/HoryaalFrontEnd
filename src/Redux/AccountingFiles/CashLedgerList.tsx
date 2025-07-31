import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  TextField,
  MenuItem,
  Button,
  Grid,
  Collapse,
  Container,
  Stack,
  TableContainer,
  Alert,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { fetchCashLedger, createCashLedgerEntry } from "./profitLogSlice";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  AccountBalanceWallet as LedgerIcon,
} from '@mui/icons-material';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface LedgerEntry {
  id: number;
  date: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  source: string;
  amount: number;
  method: string;
  description: string;
  balanceAfter: number;
  createdBy?: { fullName: string };
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const CashLedgerList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { ledger, loading, error } = useAppSelector((state) => state.profitLog);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "DEPOSIT" as 'DEPOSIT' | 'WITHDRAWAL',
    source: "Manual",
    amount: "",
    method: "Cash",
    description: "",
  });

  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchCashLedger());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, amount: parseFloat(formData.amount) };

    try {
      await dispatch(createCashLedgerEntry(payload)).unwrap();
      toast.success("Ledger entry created successfully!");
      setFormData({ type: "DEPOSIT", source: "Manual", amount: "", method: "Cash", description: "" });
      setShowForm(false);
      dispatch(fetchCashLedger());
    } catch (err) {
      toast.error("Failed to create ledger entry.");
    }
  };

  const handleExportPdf = async (action: 'download' | 'print') => {
    if (!tableRef.current) return toast.error("Table content missing.");
    const canvas = await html2canvas(tableRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 297;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    if (action === 'download') {
      pdf.save('cash_ledger.pdf');
    } else {
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const printWindow = window.open(pdfUrl, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
          URL.revokeObjectURL(pdfUrl);
        };
      } else {
        toast.error("Could not open print window.");
      }
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight={700} color="primary.main">
            <LedgerIcon /> Cash Ledger
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button onClick={() => setShowForm(!showForm)} startIcon={<AddIcon />} variant="contained">
              {showForm ? "Close Form" : "New Entry"}
            </Button>
            <Button onClick={() => handleExportPdf('download')} startIcon={<DownloadIcon />} variant="outlined" disabled={ledger.length === 0}>
              Download PDF
            </Button>
            <Button onClick={() => handleExportPdf('print')} startIcon={<PrintIcon />} variant="outlined" disabled={ledger.length === 0}>
              Print Ledger
            </Button>
          </Stack>
        </Box>

        <Collapse in={showForm}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>Register New Ledger Entry</Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField name="type" label="Type" select fullWidth value={formData.type} onChange={handleChange}>
                    <MenuItem value="DEPOSIT">Deposit</MenuItem>
                    <MenuItem value="WITHDRAWAL">Withdrawal</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField name="source" label="Source" fullWidth value={formData.source} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField name="amount" label="Amount" type="number" fullWidth value={formData.amount} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField name="method" label="Method" select fullWidth value={formData.method} onChange={handleChange}>
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Bank">Bank</MenuItem>
                    <MenuItem value="Mobile">Mobile</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField name="description" label="Description" fullWidth multiline rows={2} value={formData.description} onChange={handleChange} />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="success" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Submit Entry"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Collapse>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && ledger.length > 0 && (
          <TableContainer component={Paper} ref={tableRef}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: 'primary.dark' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Date</TableCell>
                  <TableCell sx={{ color: 'white' }}>Type</TableCell>
                  <TableCell sx={{ color: 'white' }}>Source</TableCell>
                  <TableCell sx={{ color: 'white' }} align="right">Amount</TableCell>
                  <TableCell sx={{ color: 'white' }}>Method</TableCell>
                  <TableCell sx={{ color: 'white' }}>Description</TableCell>
                  <TableCell sx={{ color: 'white' }} align="right">Balance After</TableCell>
                  <TableCell sx={{ color: 'white' }}>Created By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ledger.map((entry: LedgerEntry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{format(new Date(entry.date), "yyyy-MM-dd HH:mm")}</TableCell>
                    <TableCell>
                      <Chip label={entry.type} color={entry.type === "DEPOSIT" ? "success" : "error"} size="small" />
                    </TableCell>
                    <TableCell>{entry.source}</TableCell>
                    <TableCell align="right">{formatCurrency(entry.amount)}</TableCell>
                    <TableCell>{entry.method}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell align="right">{formatCurrency(entry.balanceAfter)}</TableCell>
                    <TableCell>{entry.createdBy?.fullName || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default CashLedgerList;