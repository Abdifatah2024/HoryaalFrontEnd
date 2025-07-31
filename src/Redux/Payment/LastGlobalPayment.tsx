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
    if (!globalPayment) return;

    const doc = new jsPDF();
    const amountPaid = parseFloat(globalPayment.amountPaid) || 0;
    const discount = parseFloat(globalPayment.discount) || 0;

    doc.setFontSize(18);
    doc.text("Payment Receipt Voucher", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.text("AL-IRSHAAD SECONDARY SCHOOL", 105, 28, { align: "center" });
    doc.text("123 Business Rd, Suite 456", 105, 34, { align: "center" });
    doc.text("City, ZIP | Phone: (123) 456-7890", 105, 40, { align: "center" });

    doc.line(10, 45, 200, 45);
    doc.setFontSize(12);

    let yPos = 55;
    doc.text(`Receipt No: ${globalPayment.id}`, 10, yPos);
    yPos += 7;
    doc.text(`Date: ${new Date(globalPayment.date).toLocaleString()}`, 10, yPos);
    yPos += 7;
    doc.text(`Student: ${globalPayment.student.fullname}`, 10, yPos);
    yPos += 7;
    doc.text(`Paid By: ${globalPayment.user.fullName}`, 10, yPos);
    yPos += 7;
    doc.text(`Description: ${globalPayment.Description || "N/A"}`, 10, yPos);
    yPos += 10;

    doc.setFontSize(14);
    doc.text("Financial Summary", 10, yPos);
    yPos += 7;
    doc.setFontSize(12);
    doc.text(`Amount Paid: $${amountPaid.toFixed(2)}`, 10, yPos);
    yPos += 7;
    doc.text(`Discount: $${discount.toFixed(2)}`, 10, yPos);
    yPos += 10;

    doc.setFontSize(14);
    doc.text("Allocations", 10, yPos);
    yPos += 5;

    const tableRows = globalPayment.allocations.map((a) => [
      a.studentFee.month.toString(),
      a.studentFee.year.toString(),
    ]);

    doc.autoTable({
      startY: yPos,
      head: [["Month", "Year"]],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 10, halign: "center" },
    });

    const finalY = (doc as jsPDF & { lastAutoTable?: { finalY?: number } })
      .lastAutoTable?.finalY ?? yPos + 20;

    doc.setFontSize(10);
    doc.text("Thank you for your payment!", 105, finalY + 10, { align: "center" });
    doc.text("Please keep this receipt for your records.", 105, finalY + 16, {
      align: "center",
    });

    const safeName = globalPayment.student.fullname.replace(/\s+/g, "_");
    doc.save(`receipt_${safeName}.pdf`);
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "", "width=800,height=700");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Receipt</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .voucher-box {
                  max-width: 700px;
                  margin: auto;
                  padding: 30px;
                  border: 1px solid #000;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
                }
                h2 { text-align: center; margin-bottom: 20px; }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
                }
                table, th, td {
                  border: 1px solid black;
                }
                th, td {
                  padding: 10px;
                  text-align: center;
                }
              </style>
            </head>
            <body>
              <div class="voucher-box">
                ${printRef.current.innerHTML}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h5" textAlign="center" fontWeight="bold">
        📄 Last Global Payment Voucher
      </Typography>

      <Box textAlign="center" mt={3}>
        <Button
          variant="contained"
          onClick={handleFetch}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Get Last Payment"}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handlePdfDownload}
          disabled={!globalPayment}
          sx={{ mr: 2 }}
        >
          📥 Download PDF
        </Button>
        <Button
          variant="outlined"
          color="success"
          onClick={handlePrint}
          disabled={!globalPayment}
        >
          🖨️ Print Voucher
        </Button>
      </Box>

      {error && (
        <Typography color="error" textAlign="center" mt={2}>
          {error}
        </Typography>
      )}

      {globalPayment && (
        <Paper elevation={4} sx={{ mt: 4, p: 3 }} ref={printRef}>
          <Box>
            <Typography variant="h6" textAlign="center" fontWeight="bold">
              Payment Receipt Voucher
            </Typography>
            <Typography textAlign="center">AL-IRSHAAD SECONDARY SCHOOL</Typography>
            <Typography textAlign="center">MASALA NEAR AIRPORT</Typography>
            <Typography textAlign="center">Hargeisa, | Phone: (+252)-634740303</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mt: 2 }}>
            <Typography><strong>Receipt No:</strong> {globalPayment.id}</Typography>
            <Typography><strong>Date:</strong> {new Date(globalPayment.date).toLocaleString()}</Typography>
            <Typography><strong>Student:</strong> {globalPayment.student.fullname}</Typography>
            <Typography><strong>Casheir:</strong> {globalPayment.user.fullName}</Typography>
            <Typography><strong>Description:</strong> {globalPayment.Description || "N/A"}</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography><strong>Amount Paid:</strong> ${parseFloat(globalPayment.amountPaid).toFixed(2)}</Typography>
            <Typography><strong>Discount:</strong> ${parseFloat(globalPayment.discount).toFixed(2)}</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight="bold">
            Allocations:
          </Typography>
          <Table size="small" sx={{ mt: 1 }}>
            <TableHead>
              <TableRow>
                <TableCell><strong>Month</strong></TableCell>
                <TableCell><strong>Year</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {globalPayment.allocations.map((alloc, index) => (
                <TableRow key={index}>
                  <TableCell>{alloc.studentFee.month}</TableCell>
                  <TableCell>{alloc.studentFee.year}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Divider sx={{ my: 2 }} />
          <Typography textAlign="center" mt={3}>
            Thank you for your payment!
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default LastGlobalPayment;
