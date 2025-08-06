// import React from "react";

// interface VoucherProps {
//   studentName: string;
//   monthYear: string;
//   amountPaid: number;
//   discount: number;
//   paymentDescription: string;
//   receivedBy: string;
//   date: string;
// }

// const PaymentVoucher: React.FC<VoucherProps> = ({
//   studentName,
//   monthYear,
//   amountPaid,
//   discount,
//   paymentDescription,
//   receivedBy,
//   date,
// }) => {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto" id="voucher-to-print">
//       {/* Office Copy */}
//       <div className="mb-8">
//         <div className="text-center font-bold text-lg mb-4">
//           HORYAAL PRIMARY SCHOOL 
//         </div>
//         <div className="text-center text-sm mb-4">
//           ZAAD NO: 500536 Morning, ZAAD NO: 500929 Afternoon Tel: 063-4818888 / 063-6294444
//         </div>
//         <div className="text-center font-bold mb-4">
//           CASH RECEIPT - OFFICE COPY - DATE: {date}
//         </div>

//         <table className="w-full mb-4">
//           <tbody>
//             <tr>
//               <td className="font-semibold py-1">Student:</td>
//               <td className="py-1">{studentName}</td>
//             </tr>
//             <tr>
//               <td className="font-semibold py-1">Month/Year:</td>
//               <td className="py-1">{monthYear}</td>
//             </tr>
//             <tr>
//               <td className="font-semibold py-1">Amount Paid:</td>
//               <td className="py-1">${amountPaid}</td>
//             </tr>
//             <tr>
//               <td className="font-semibold py-1">Discount:</td>
//               <td className="py-1">${discount}</td>
//             </tr>
//             <tr>
//               <td className="font-semibold py-1">Description:</td>
//               <td className="py-1">{paymentDescription}</td>
//             </tr>
//             <tr>
//               <td className="font-semibold py-1">Received By:</td>
//               <td className="py-1">{receivedBy}</td>
//             </tr>
//           </tbody>
//         </table>

//         <div className="mt-6">
//           <div>CASHIER: {receivedBy}</div>
//           <div className="mt-4">Sign: ________________</div>
//         </div>
//       </div>

//       {/* Student Copy */}
//       <div>
//         <div className="text-center font-bold text-lg mb-4">
//           HORYAAL PRIMARY SCHOOL 
//         </div>
//         <div className="text-center text-sm mb-4">
//        ZAAD NO: 500536 Morning, ZAAD NO: 500929 Afternoon Tel: 063-481888 / 063-6294444
//         </div>
//         <div className="text-center font-bold mb-4">
//           CASH RECEIPT - STUDENT COPY - DATE: {date}
//         </div>

//         <table className="w-full mb-4">
//           <tbody>
//             <tr>
//               <td className="font-semibold py-1">Student:</td>
//               <td className="py-1">{studentName}</td>
//             </tr>
//             <tr>
//               <td className="font-semibold py-1">Month/Year:</td>
//               <td className="py-1">{monthYear}</td>
//             </tr>
//             <tr>
//               <td className="font-semibold py-1">Amount Paid:</td>
//               <td className="py-1">${amountPaid}</td>
//             </tr>
//             <tr>
//               <td className="font-semibold py-1">Discount:</td>
//               <td className="py-1">${discount}</td>
//             </tr>
//             <tr>
//               <td className="font-semibold py-1">Description:</td>
//               <td className="py-1">{paymentDescription}</td>
//             </tr>
//             <tr>
//               <td className="font-semibold py-1">Received By:</td>
//               <td className="py-1">{receivedBy}</td>
//             </tr>
//           </tbody>
//         </table>

//         <div className="mt-6">
//           <div>CASHIER: {receivedBy}</div>
//           <div className="mt-4">Sign: ________________</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentVoucher;
import React, { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { fetchLastGlobalPayment } from "../../Redux/Payment/lastPaymentSlice";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import jsPDF from "jspdf";

interface VoucherProps {
  studentName: string;
  monthYear: string;
  amountPaid: number;
  discount: number;
  paymentDescription: string;
  receivedBy: string;
  date: string;
  copyType: "OFFICE" | "STUDENT";
}

const PaymentVoucher: React.FC<VoucherProps> = ({
  studentName,
  monthYear,
  amountPaid,
  discount,
  paymentDescription,
  receivedBy,
  date,
  copyType,
}) => {
  return (
    <Box sx={{ 
      bgcolor: 'background.paper', 
      p: 3, 
      borderRadius: 1, 
      boxShadow: 1,
      mb: copyType === "OFFICE" ? 4 : 0
    }}>
      <Typography variant="h6" align="center" fontWeight="bold" gutterBottom>
        HORYAAL PRIMARY SCHOOL
      </Typography>
      <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
        ZAAD NO: 500536 Morning, ZAAD NO: 500929 Afternoon Tel: 063-481888 / 063-6294444
      </Typography>
      <Typography variant="subtitle1" align="center" fontWeight="bold" gutterBottom>
        CASH RECEIPT - {copyType} COPY - DATE: {new Date(date).toLocaleDateString()}
      </Typography>

      <Box component="table" sx={{ width: '100%', mb: 2 }}>
        <Box component="tbody">
          <Box component="tr">
            <Box component="td" sx={{ py: 1, fontWeight: 'bold' }}>Student:</Box>
            <Box component="td" sx={{ py: 1 }}>{studentName}</Box>
          </Box>
          <Box component="tr">
            <Box component="td" sx={{ py: 1, fontWeight: 'bold' }}>Month/Year:</Box>
            <Box component="td" sx={{ py: 1 }}>{monthYear}</Box>
          </Box>
          <Box component="tr">
            <Box component="td" sx={{ py: 1, fontWeight: 'bold' }}>Amount Paid:</Box>
            <Box component="td" sx={{ py: 1 }}>${amountPaid.toFixed(2)}</Box>
          </Box>
          <Box component="tr">
            <Box component="td" sx={{ py: 1, fontWeight: 'bold' }}>Discount:</Box>
            <Box component="td" sx={{ py: 1 }}>${discount.toFixed(2)}</Box>
          </Box>
          <Box component="tr">
            <Box component="td" sx={{ py: 1, fontWeight: 'bold' }}>Description:</Box>
            <Box component="td" sx={{ py: 1 }}>{paymentDescription || "N/A"}</Box>
          </Box>
          <Box component="tr">
            <Box component="td" sx={{ py: 1, fontWeight: 'bold' }}>Received By:</Box>
            <Box component="td" sx={{ py: 1 }}>{receivedBy}</Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2">CASHIER: {receivedBy}</Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>Sign: ________________</Typography>
      </Box>
    </Box>
  );
};

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

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a5"
    });

    // Office Copy
    doc.setFontSize(16);
    doc.text("HORYAAL PRIMARY SCHOOL", 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text("ZAAD NO: 500536 Morning, ZAAD NO: 500929 Afternoon Tel: 063-481888 / 063-6294444", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`CASH RECEIPT - OFFICE COPY - DATE: ${new Date(globalPayment.date).toLocaleDateString()}`, 105, 30, { align: "center" });

    let yPos = 40;
    doc.text(`Student: ${globalPayment.student?.fullname || 'N/A'}`, 20, yPos);
    yPos += 7;
    doc.text(`Month/Year: ${globalPayment.allocations?.[0]?.studentFee?.month || ''}/${globalPayment.allocations?.[0]?.studentFee?.year || ''}`, 20, yPos);
    yPos += 7;
    doc.text(`Amount Paid: $${parseFloat(globalPayment.amountPaid).toFixed(2)}`, 20, yPos);
    yPos += 7;
    doc.text(`Discount: $${parseFloat(globalPayment.discount).toFixed(2)}`, 20, yPos);
    yPos += 7;
    doc.text(`Description: ${globalPayment.Description || "N/A"}`, 20, yPos);
    yPos += 7;
    doc.text(`Received By: ${globalPayment.user?.fullName || 'N/A'}`, 20, yPos);
    yPos += 10;
    doc.text(`CASHIER: ${globalPayment.user?.fullName || 'N/A'}`, 20, yPos);
    yPos += 7;
    doc.text("Sign: ________________", 20, yPos);

    // Add new page for Student Copy
    doc.addPage();
    yPos = 15;
    doc.setFontSize(16);
    doc.text("HORYAAL PRIMARY SCHOOL", 105, yPos, { align: "center" });
    yPos += 5;
    doc.setFontSize(10);
    doc.text("ZAAD NO: 500536 Morning, ZAAD NO: 500929 Afternoon Tel: 063-481888 / 063-6294444", 105, yPos, { align: "center" });
    yPos += 10;
    doc.setFontSize(12);
    doc.text(`CASH RECEIPT - STUDENT COPY - DATE: ${new Date(globalPayment.date).toLocaleDateString()}`, 105, yPos, { align: "center" });
    yPos += 10;

    doc.text(`Student: ${globalPayment.student?.fullname || 'N/A'}`, 20, yPos);
    yPos += 7;
    doc.text(`Month/Year: ${globalPayment.allocations?.[0]?.studentFee?.month || ''}/${globalPayment.allocations?.[0]?.studentFee?.year || ''}`, 20, yPos);
    yPos += 7;
    doc.text(`Amount Paid: $${parseFloat(globalPayment.amountPaid).toFixed(2)}`, 20, yPos);
    yPos += 7;
    doc.text(`Discount: $${parseFloat(globalPayment.discount).toFixed(2)}`, 20, yPos);
    yPos += 7;
    doc.text(`Description: ${globalPayment.Description || "N/A"}`, 20, yPos);
    yPos += 7;
    doc.text(`Received By: ${globalPayment.user?.fullName || 'N/A'}`, 20, yPos);
    yPos += 10;
    doc.text(`CASHIER: ${globalPayment.user?.fullName || 'N/A'}`, 20, yPos);
    yPos += 7;
    doc.text("Sign: ________________", 20, yPos);

    const safeName = globalPayment.student?.fullname?.replace(/\s+/g, "_") || 'receipt';
    doc.save(`receipt_${safeName}.pdf`);
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "", "width=600,height=800");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Receipt</title>
              <style>
                @page {
                  size: A5;
                  margin: 10mm;
                }
                body {
                  font-family: Arial, sans-serif;
                  padding: 10mm;
                }
                .voucher {
                  background-color: white;
                  padding: 10mm;
                  margin-bottom: 10mm;
                  border-radius: 4px;
                  box-shadow: 0 0 5px rgba(0,0,0,0.1);
                }
                .header {
                  text-align: center;
                  margin-bottom: 5mm;
                }
                .title {
                  font-weight: bold;
                  font-size: 16pt;
                  margin-bottom: 2mm;
                }
                .subtitle {
                  font-size: 10pt;
                  color: #555;
                  margin-bottom: 2mm;
                }
                .receipt-title {
                  font-weight: bold;
                  text-align: center;
                  margin-bottom: 5mm;
                  font-size: 12pt;
                }
                table {
                  width: 100%;
                  margin-bottom: 5mm;
                }
                td {
                  padding: 2mm 0;
                  vertical-align: top;
                }
                .label {
                  font-weight: bold;
                }
                .signature {
                  margin-top: 10mm;
                }
              </style>
            </head>
            <body>
              <div>
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

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

  const monthYear = globalPayment.allocations?.[0] 
    ? `${globalPayment.allocations[0].studentFee?.month}/${globalPayment.allocations[0].studentFee?.year}`
    : 'N/A';

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h5" textAlign="center" fontWeight="bold" mb={3}>
        Payment Receipt Voucher
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
            p: 3,
            width: '100%',
            maxWidth: 500
          }} 
          ref={printRef}
        >
          <PaymentVoucher
            studentName={globalPayment.student?.fullname || 'N/A'}
            monthYear={monthYear}
            amountPaid={parseFloat(globalPayment.amountPaid)}
            discount={parseFloat(globalPayment.discount)}
            paymentDescription={globalPayment.Description || "N/A"}
            receivedBy={globalPayment.user?.fullName || 'N/A'}
            date={globalPayment.date}
            copyType="OFFICE"
          />

          <Divider sx={{ my: 4, borderStyle: 'dashed' }} />

          <PaymentVoucher
            studentName={globalPayment.student?.fullname || 'N/A'}
            monthYear={monthYear}
            amountPaid={parseFloat(globalPayment.amountPaid)}
            discount={parseFloat(globalPayment.discount)}
            paymentDescription={globalPayment.Description || "N/A"}
            receivedBy={globalPayment.user?.fullName || 'N/A'}
            date={globalPayment.date}
            copyType="STUDENT"
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default LastGlobalPayment;
