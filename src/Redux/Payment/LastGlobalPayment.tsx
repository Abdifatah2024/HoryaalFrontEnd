
import React, { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { fetchLastGlobalPayment } from "../../Redux/Payment/lastPaymentSlice";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  Grid,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";

const LastGlobalPayment: React.FC = () => {
  const dispatch = useAppDispatch();
  const { globalPayment, loading, error } = useAppSelector(
    (state) => state.lastPayment
  );
  const printRef = useRef<HTMLDivElement>(null);

  const handleFetch = () => {
    dispatch(fetchLastGlobalPayment());
  };

  const handlePdfDownload = () => {
    if (!globalPayment) {
      console.warn("No payment data available for PDF generation");
      return;
    }

    // A4 size in portrait (210mm x 297mm)
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const amountPaid = parseFloat(globalPayment.amountPaid) || 0;
    const discount = parseFloat(globalPayment.discount) || 0;

    // Function to create a single voucher
    const createVoucher = (startY: number) => {
      // School header
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("HORYAAL PRIMARY SCHOOL", 105, startY + 10, { align: "center" });
      
      // School details and ZAAD info
      doc.setFontSize(10);
      doc.text("M.haybe, Calaamadaha | Tel: 063-481888 / 063-6294444", 105, startY + 15, { align: "center" });
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text("ZAAD NO: 500536 (Morning) | ZAAD NO: 500929 (Afternoon)", 105, startY + 20, { align: "center" });

      // Title
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("PAYMENT RECEIPT", 105, startY + 28, { align: "center" });

      // Divider line
      doc.setDrawColor(200, 200, 200);
      doc.line(20, startY + 32, 190, startY + 32);

      // Receipt details
      doc.setFontSize(10);
      let yPos = startY + 40;
      doc.text(`Receipt No: ${globalPayment.id}`, 25, yPos);
      doc.text(`Date: ${new Date(globalPayment.date).toLocaleDateString()}`, 140, yPos);
      yPos += 8;
      doc.text(`Student: ${globalPayment.student?.fullname || 'N/A'}`, 25, yPos);
      yPos += 8;
      doc.text(`Cashier: ${globalPayment.user?.fullName || 'N/A'}`, 25, yPos);
      yPos += 8;
      doc.text(`Description: ${globalPayment.Description || "N/A"}`, 25, yPos);
      yPos += 12;

      // Payment summary
      doc.setFontSize(12);
      doc.text("PAYMENT SUMMARY", 105, yPos, { align: "center" });
      yPos += 8;
      doc.setFontSize(10);
      doc.text(`Amount Paid: $${amountPaid.toFixed(2)}`, 60, yPos, { align: "center" });
      doc.text(`Discount: $${discount.toFixed(2)}`, 150, yPos, { align: "center" });
      yPos += 12;

      // Allocations table
      doc.setFontSize(12);
      doc.text("FEE ALLOCATIONS", 105, yPos, { align: "center" });
      yPos += 8;

      const tableRows = (globalPayment.allocations || []).map((a) => [
        a.studentFee?.month?.toString() || '',
        a.studentFee?.year?.toString() || '',
      ]);

      doc.autoTable({
        startY: yPos,
        head: [["Month", "Year"]],
        body: tableRows,
        theme: "grid",
        styles: { 
          fontSize: 10, 
          halign: "center",
          cellPadding: 3,
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineWidth: 0.1
        },
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          fontStyle: 'bold'
        },
        margin: { left: 50, right: 50 },
        tableWidth: 110
      });

      return (doc as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? yPos + 20;
    };

    // Create first voucher (top half)
    const firstVoucherEnd = createVoucher(15);
    
    // Add divider between vouchers
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(20, firstVoucherEnd + 5, 190, firstVoucherEnd + 5);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Duplicate Copy", 105, firstVoucherEnd + 9, { align: "center" });
    
    // Create second voucher (bottom half)
    createVoucher(firstVoucherEnd + 15);

    // Footer note
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for your payment! Please keep this receipt for your records", 105, 285, { align: "center" });

    const safeName = globalPayment.student?.fullname?.replace(/\s+/g, "_") || 'receipt';
    doc.save(`receipt_${safeName}.pdf`);
  };

  const handlePrint = () => {
    if (!globalPayment || !printRef.current) {
      console.warn("No payment data available for printing");
      return;
    }

    const printWindow = window.open("", "", "width=800,height=1120");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Receipt</title>
            <style>
              @page {
                size: A4 portrait;
                margin: 10mm;
              }
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                padding: 0;
                margin: 0;
                width: 210mm;
              }
              .page {
                width: 190mm;
                min-height: 277mm;
                margin: 0 auto;
                padding: 0;
                position: relative;
              }
              .voucher {
                width: 100%;
                height: 125mm;
                margin-bottom: 5mm;
                padding: 5mm;
                border: 1px solid #e0e0e0;
                box-sizing: border-box;
                position: relative;
              }
              .voucher-divider {
                border-top: 1px dashed #ccc;
                margin: 5mm 0;
                text-align: center;
                color: #999;
                font-size: 10px;
              }
              .school-header {
                text-align: center;
                margin-bottom: 3mm;
              }
              .school-name {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 1mm;
              }
              .school-details {
                font-size: 12px;
                color: #555;
              }
              .zaad-info {
                font-size: 11px;
                color: #666;
                text-align: center;
                margin-bottom: 2mm;
              }
              .receipt-title {
                text-align: center;
                font-size: 16px;
                font-weight: bold;
                margin: 2mm 0 4mm 0;
              }
              .divider {
                border-top: 1px solid #e0e0e0;
                margin: 3mm 0;
              }
              .details-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 2mm;
                font-size: 12px;
              }
              .summary-title {
                text-align: center;
                font-size: 14px;
                font-weight: bold;
                margin: 3mm 0;
              }
              .summary-row {
                display: flex;
                justify-content: center;
                gap: 30mm;
                margin: 2mm 0;
                font-size: 12px;
              }
              .allocations-title {
                text-align: center;
                font-size: 14px;
                font-weight: bold;
                margin: 3mm 0 2mm 0;
              }
              table {
                width: 80%;
                margin: 0 auto;
                border-collapse: collapse;
                font-size: 12px;
              }
              th {
                background-color: #f5f5f5;
                padding: 2mm;
                text-align: center;
                font-weight: bold;
              }
              td {
                padding: 2mm;
                text-align: center;
                border: 1px solid #e0e0e0;
              }
              .footer-note {
                text-align: center;
                font-size: 12px;
                color: #666;
                margin-top: 3mm;
              }
            </style>
          </head>
          <body>
            <div class="page">
              <div class="voucher">
                <div class="school-header">
                  <div class="school-name">HORYAAL PRIMARY SCHOOL</div>
                  <div class="school-details">M.haybe, Calaamadaha | Tel: 063-481888 / 063-6294444</div>
                  <div class="zaad-info">ZAAD NO: 500536 (Morning) | ZAAD NO: 500929 (Afternoon)</div>
                </div>
                <div class="receipt-title">PAYMENT RECEIPT</div>
                <div class="divider"></div>
                <div class="details-row">
                  <div><strong>Receipt No:</strong> ${globalPayment.id}</div>
                  <div><strong>Date:</strong> ${new Date(globalPayment.date).toLocaleDateString()}</div>
                </div>
                <div class="details-row">
                  <div><strong>Student:</strong> ${globalPayment.student?.fullname || 'N/A'}</div>
                </div>
                <div class="details-row">
                  <div><strong>Cashier:</strong> ${globalPayment.user?.fullName || 'N/A'}</div>
                </div>
                <div class="details-row">
                  <div><strong>Description:</strong> ${globalPayment.Description || "N/A"}</div>
                </div>
                <div class="summary-title">PAYMENT SUMMARY</div>
                <div class="summary-row">
                  <div><strong>Amount Paid:</strong> $${parseFloat(globalPayment.amountPaid).toFixed(2)}</div>
                  <div><strong>Discount:</strong> $${parseFloat(globalPayment.discount).toFixed(2)}</div>
                </div>
                <div class="allocations-title">FEE ALLOCATIONS</div>
                <table>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${(globalPayment.allocations || []).map((alloc) => `
                      <tr>
                        <td>${alloc.studentFee?.month || ''}</td>
                        <td>${alloc.studentFee?.year || ''}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
                <div class="footer-note">Thank you for your payment! Please keep this receipt for your records</div>
              </div>
              
              <div class="voucher-divider">Duplicate Copy</div>
              
              <div class="voucher">
                <div class="school-header">
                  <div class="school-name">HORYAAL PRIMARY SCHOOL</div>
                  <div class="school-details">M.haybe, Calaamadaha | Tel: 063-481888 / 063-6294444</div>
                  <div class="zaad-info">ZAAD NO: 500536 (Morning) | ZAAD NO: 500929 (Afternoon)</div>
                </div>
                <div class="receipt-title">PAYMENT RECEIPT</div>
                <div class="divider"></div>
                <div class="details-row">
                  <div><strong>Receipt No:</strong> ${globalPayment.id}</div>
                  <div><strong>Date:</strong> ${new Date(globalPayment.date).toLocaleDateString()}</div>
                </div>
                <div class="details-row">
                  <div><strong>Student:</strong> ${globalPayment.student?.fullname || 'N/A'}</div>
                </div>
                <div class="details-row">
                  <div><strong>Cashier:</strong> ${globalPayment.user?.fullName || 'N/A'}</div>
                </div>
                <div class="details-row">
                  <div><strong>Description:</strong> ${globalPayment.Description || "N/A"}</div>
                </div>
                <div class="summary-title">PAYMENT SUMMARY</div>
                <div class="summary-row">
                  <div><strong>Amount Paid:</strong> $${parseFloat(globalPayment.amountPaid).toFixed(2)}</div>
                  <div><strong>Discount:</strong> $${parseFloat(globalPayment.discount).toFixed(2)}</div>
                </div>
                <div class="allocations-title">FEE ALLOCATIONS</div>
                <table>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${(globalPayment.allocations || []).map((alloc) => `
                      <tr>
                        <td>${alloc.studentFee?.month || ''}</td>
                        <td>${alloc.studentFee?.year || ''}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
                <div class="footer-note">Thank you for your payment! Please keep this receipt for your records</div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>
          Error loading payment data
        </Typography>
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button variant="contained" onClick={handleFetch}>
          Retry
        </Button>
      </Box>
    );
  }

  // Handle no data state
  if (!globalPayment) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          No payment data available
        </Typography>
        <Button variant="contained" onClick={handleFetch}>
          Fetch Payment Data
        </Button>
      </Box>
    );
  }

  // Main render when we have data
  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h5" textAlign="center" fontWeight="bold" mb={3}>
        🧾 Payment Receipt Voucher (A4 with 2 copies)
      </Typography>

      <Box textAlign="center" mt={3} mb={4}>
        <Button
          variant="contained"
          onClick={handleFetch}
          disabled={loading}
          sx={{ mr: 2, mb: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Refresh Payment Data"}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handlePdfDownload}
          disabled={!globalPayment}
          sx={{ mr: 2, mb: 2 }}
        >
          📥 Download PDF
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handlePrint}
          disabled={!globalPayment}
          sx={{ mb: 2 }}
        >
          🖨️ Print Voucher
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Paper 
          elevation={4} 
          sx={{ 
            mt: 4, 
            p: 0,
            width: '210mm',
            minHeight: '297mm',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }} 
          ref={printRef}
        >
          {/* First Voucher */}
          <Box sx={{ 
            width: '190mm', 
            height: '125mm',
            p: 2,
            mb: 1,
            border: '1px solid #e0e0e0'
          }}>
            <Box textAlign="center" my={1}>
              <Typography variant="h6" fontWeight="bold">
                HORYAAL PRIMARY SCHOOL
              </Typography>
              <Typography variant="body2" color="text.secondary">
                M.haybe, Calaamadaha | Tel: 063-481888 / 063-6294444
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                ZAAD NO: 500536 (Morning) | ZAAD NO: 500929 (Afternoon)
              </Typography>
            </Box>

            <Typography variant="h5" textAlign="center" fontWeight="bold" my={1}>
              PAYMENT RECEIPT
            </Typography>

            <Divider sx={{ my: 1 }} />

            <Grid container spacing={1} sx={{ mb: 1 }}>
              <Grid item xs={6}>
                <Typography variant="body2"><strong>Receipt No:</strong> {globalPayment.id}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2"><strong>Date:</strong> {new Date(globalPayment.date).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2"><strong>Student:</strong> {globalPayment.student?.fullname || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2"><strong>Cashier:</strong> {globalPayment.user?.fullName || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2"><strong>Description:</strong> {globalPayment.Description || "N/A"}</Typography>
              </Grid>
            </Grid>

            <Typography variant="h6" textAlign="center" fontWeight="bold" my={1}>
              PAYMENT SUMMARY
            </Typography>
            
            <Box display="flex" justifyContent="center" gap={8} mb={2}>
              <Box textAlign="center">
                <Typography variant="body2"><strong>Amount Paid:</strong></Typography>
                <Typography variant="body2">$${parseFloat(globalPayment.amountPaid).toFixed(2)}</Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="body2"><strong>Discount:</strong></Typography>
                <Typography variant="body2">$${parseFloat(globalPayment.discount).toFixed(2)}</Typography>
              </Box>
            </Box>

            <Typography variant="h6" textAlign="center" fontWeight="bold" my={1}>
              FEE ALLOCATIONS
            </Typography>
            
            <Table size="small" sx={{ width: '80%', mx: 'auto', mb: 1 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Month</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Year</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(globalPayment.allocations || []).map((alloc, index) => (
                  <TableRow key={index}>
                    <TableCell>{alloc.studentFee?.month || ''}</TableCell>
                    <TableCell>{alloc.studentFee?.year || ''}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Typography variant="body2" textAlign="center" mt={1} color="text.secondary">
              Thank you for your payment! Please keep this receipt for your records
            </Typography>
          </Box>

          {/* Divider */}
          <Divider sx={{ borderStyle: 'dashed', width: '100%', my: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Duplicate Copy
            </Typography>
          </Divider>

          {/* Second Voucher */}
          <Box sx={{ 
            width: '190mm', 
            height: '125mm',
            p: 2,
            border: '1px solid #e0e0e0'
          }}>
            <Box textAlign="center" my={1}>
              <Typography variant="h6" fontWeight="bold">
                HORYAAL PRIMARY SCHOOL
              </Typography>
              <Typography variant="body2" color="text.secondary">
                M.haybe, Calaamadaha | Tel: 063-481888 / 063-6294444
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                ZAAD NO: 500536 (Morning) | ZAAD NO: 500929 (Afternoon)
              </Typography>
            </Box>

            <Typography variant="h5" textAlign="center" fontWeight="bold" my={1}>
              PAYMENT RECEIPT
            </Typography>

            <Divider sx={{ my: 1 }} />

            <Grid container spacing={1} sx={{ mb: 1 }}>
              <Grid item xs={6}>
                <Typography variant="body2"><strong>Receipt No:</strong> {globalPayment.id}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2"><strong>Date:</strong> {new Date(globalPayment.date).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2"><strong>Student:</strong> {globalPayment.student?.fullname || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2"><strong>Cashier:</strong> {globalPayment.user?.fullName || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2"><strong>Description:</strong> {globalPayment.Description || "N/A"}</Typography>
              </Grid>
            </Grid>

            <Typography variant="h6" textAlign="center" fontWeight="bold" my={1}>
              PAYMENT SUMMARY
            </Typography>
            
            <Box display="flex" justifyContent="center" gap={8} mb={2}>
              <Box textAlign="center">
                <Typography variant="body2"><strong>Amount Paid:</strong></Typography>
                <Typography variant="body2">$${parseFloat(globalPayment.amountPaid).toFixed(2)}</Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="body2"><strong>Discount:</strong></Typography>
                <Typography variant="body2">$${parseFloat(globalPayment.discount).toFixed(2)}</Typography>
              </Box>
            </Box>

            <Typography variant="h6" textAlign="center" fontWeight="bold" my={1}>
              FEE ALLOCATIONS
            </Typography>
            
            <Table size="small" sx={{ width: '80%', mx: 'auto', mb: 1 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Month</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Year</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(globalPayment.allocations || []).map((alloc, index) => (
                  <TableRow key={index}>
                    <TableCell>{alloc.studentFee?.month || ''}</TableCell>
                    <TableCell>{alloc.studentFee?.year || ''}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Typography variant="body2" textAlign="center" mt={1} color="text.secondary">
              Thank you for your payment! Please keep this receipt for your records
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default LastGlobalPayment;