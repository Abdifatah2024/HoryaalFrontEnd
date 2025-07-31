import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { fetchAllUnpaidStudents } from '../../Redux/Payment/paymentSlice';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  CircularProgress, Alert, Chip, useTheme, Avatar, IconButton,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  AccountBalanceWallet as WalletIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon,
  PictureAsPdf as PdfIcon,
  TableView as ExcelIcon
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
      fontWeight: 600
    }
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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const UnpaidStudentsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const printRef = useRef<HTMLDivElement>(null);
  const { unpaidStudents, loading, error } = useAppSelector((state) => state.payment);
  const [selectedClass, setSelectedClass] = useState<string>('All');

  const classOptions = ['All', ...Array.from(new Set(unpaidStudents.map((s) => s.className)))];
  const filteredStudents = selectedClass === 'All'
    ? unpaidStudents
    : unpaidStudents.filter((s) => s.className === selectedClass);

  useEffect(() => {
    dispatch(fetchAllUnpaidStudents());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAllUnpaidStudents());
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredStudents.map(s => ({
      ID: s.studentId,
      Name: s.name,
      Class: s.className,
      'Total Required': s.totalRequired,
      'Total Paid': s.totalPaid,
      'Unpaid Months': s.unpaidMonths,
      'Carry Forward': s.carryForward,
      'Balance Due': s.balanceDue,
      Status: s.balanceDue > 0 ? 'Due' : 'Paid'
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Unpaid Students');
    XLSX.writeFile(workbook, 'Unpaid_Students.xlsx');
  };

  const handleExportPDF = () => {
    if (filteredStudents.length === 0) {
      alert("No data available to export.");
      return;
    }

    const doc = new jsPDF('landscape');
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Students with Outstanding Balances", 148, 15, { align: "center" });

    autoTable(doc, {
      startY: 25,
      head: [[
        "ID", "Name", "Class", "Total Required", "Total Paid",
        "Unpaid Months", "Carry Forward", "Balance Due", "Status"
      ]],
      body: filteredStudents.map((s) => [
        s.studentId,
        s.name,
        s.className,
        formatCurrency(s.totalRequired),
        formatCurrency(s.totalPaid),
        s.unpaidMonths,
        formatCurrency(s.carryForward),
        formatCurrency(s.balanceDue),
        s.balanceDue > 0 ? "Due" : "Paid",
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        halign: "center",
        lineColor: [44, 62, 80],
        lineWidth: 0.2,
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      tableLineColor: [44, 62, 80],
      tableLineWidth: 0.2,
    });

    doc.save("Unpaid_Students_Report.pdf");
  };

  const handlePrint = () => {
    if (printRef.current) {
      const content = printRef.current.innerHTML;
      const printWindow = window.open("", "", "width=900,height=700");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Students with Outstanding Balances</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                  color: #333;
                }
                h2 {
                  text-align: center;
                  margin-bottom: 20px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
                th, td {
                  border: 1px solid #444;
                  padding: 8px;
                  font-size: 12px;
                  text-align: center;
                }
                th {
                  background-color: #f0f0f0;
                  font-weight: bold;
                }
                .footer {
                  margin-top: 40px;
                  text-align: right;
                  font-size: 12px;
                }
              </style>
            </head>
            <body>
              <h2>Students with Outstanding Balances</h2>
              ${content}
              <div class="footer">Printed on: ${new Date().toLocaleDateString()}</div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <PageContainer>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
            <WalletIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Students with Balance
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Filter and export student balances by class
            </Typography>
          </Box>
        </Box>

        <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Print">
            <IconButton onClick={handlePrint} disabled={filteredStudents.length === 0}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export to PDF">
            <IconButton onClick={handleExportPDF} disabled={filteredStudents.length === 0}>
              <PdfIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export to Excel">
            <IconButton onClick={handleExportExcel} disabled={filteredStudents.length === 0}>
              <ExcelIcon />
            </IconButton>
          </Tooltip>
          <Box minWidth={180}>
            <Typography variant="body2">Filter by Class</Typography>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border px-2 py-1 rounded w-full"
            >
              {classOptions.map(cls => <option key={cls} value={cls}>{cls}</option>)}
            </select>
          </Box>
        </Box>
      </Box>

      {loading ? (
        <Box textAlign="center"><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      ) : (
        <div ref={printRef}>
          <Paper>
            <StyledTable>
              <TableHead>
                <TableRow>
                  <TableCell className="header-cell">ID</TableCell>
                  <TableCell className="header-cell">Name</TableCell>
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
                {filteredStudents.map(s => (
                  <TableRow key={s.studentId}>
                    <TableCell>{s.studentId}</TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.className}</TableCell>
                    <TableCell align="right">{formatCurrency(s.totalRequired)}</TableCell>
                    <TableCell align="right">{formatCurrency(s.totalPaid)}</TableCell>
                    <TableCell align="right">{s.unpaidMonths}</TableCell>
                    <TableCell align="right">{formatCurrency(s.carryForward)}</TableCell>
                    <TableCell align="right">{formatCurrency(s.balanceDue)}</TableCell>
                    <TableCell align="center">
                      <StatusBadge
                        label={s.balanceDue > 0 ? 'Due' : 'Paid'}
                        className={s.balanceDue > 0 ? 'due' : 'paid'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </StyledTable>
          </Paper>
        </div>
      )}
    </PageContainer>
  );
};

export default UnpaidStudentsList;
