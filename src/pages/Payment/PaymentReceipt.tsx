import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const PaymentReceipt = React.forwardRef(({ data }: { data: any }, ref: any) => {
  const payment = data.payment;
  const allocations = data.allocations;
  const carryForward = data.carryForward;

  return (
    <Box ref={ref} sx={{ p: 3, width: 320, backgroundColor: '#fff', color: '#000' }}>
      <Typography variant="h6" align="center" gutterBottom>
        🧾 Payment Voucher
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Typography variant="body2"><strong>Receipt #:</strong> {payment.id}</Typography>
      <Typography variant="body2"><strong>Student ID:</strong> {payment.studentId}</Typography>
      <Typography variant="body2"><strong>Amount Paid:</strong> ${Number(payment.amountPaid).toFixed(2)}</Typography>
      <Typography variant="body2"><strong>Discount:</strong> ${Number(payment.discount).toFixed(2)}</Typography>
      <Typography variant="body2"><strong>Date:</strong> {new Date(payment.date).toLocaleString()}</Typography>
      <Typography variant="body2"><strong>Description:</strong> {payment.Description}</Typography>
      <Typography variant="body2"><strong>Carry Forward:</strong> ${Number(carryForward).toFixed(2)}</Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" gutterBottom>Allocations:</Typography>
      {allocations.map((alloc: any, i: number) => (
        <Box key={i} sx={{ mb: 1 }}>
          <Typography variant="body2">• Fee ID: {alloc.studentFeeId}</Typography>
          <Typography variant="body2">  - Month: {alloc.month}, Year: {alloc.year}</Typography>
          <Typography variant="body2">  - Total: ${Number(alloc.total).toFixed(2)}</Typography>
          <Typography variant="body2">  - Paid: ${Number(alloc.paid).toFixed(2)}</Typography>
          <Typography variant="body2">  - Discount: ${Number(alloc.discount).toFixed(2)}</Typography>
        </Box>
      ))}

      <Divider sx={{ mt: 2 }} />
      <Typography variant="caption" display="block" align="center" sx={{ mt: 1 }}>
        Thank you for your payment!
      </Typography>
    </Box>
  );
});

PaymentReceipt.displayName = 'PaymentReceipt';

export default PaymentReceipt;
