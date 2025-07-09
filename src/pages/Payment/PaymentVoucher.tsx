import React from "react";

interface VoucherProps {
  studentName: string;
  monthYear: string;
  amountPaid: number;
  discount: number;
  paymentDescription: string;
  receivedBy: string;
  date: string;
}

const PaymentVoucher: React.FC<VoucherProps> = ({
  studentName,
  monthYear,
  amountPaid,
  discount,
  paymentDescription,
  receivedBy,
  date,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto" id="voucher-to-print">
      {/* Office Copy */}
      <div className="mb-8">
        <div className="text-center font-bold text-lg mb-4">
          AL-IRSHAAD SECONDARY SCHOOL
        </div>
        <div className="text-center text-sm mb-4">
          ZAAD NO: 515449 Tel: 4740303 / 4422850 / 6388881
        </div>
        <div className="text-center font-bold mb-4">
          CASH RECEIPT - OFFICE COPY - DATE: {date}
        </div>

        <table className="w-full mb-4">
          <tbody>
            <tr>
              <td className="font-semibold py-1">Student:</td>
              <td className="py-1">{studentName}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Month/Year:</td>
              <td className="py-1">{monthYear}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Amount Paid:</td>
              <td className="py-1">${amountPaid}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Discount:</td>
              <td className="py-1">${discount}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Description:</td>
              <td className="py-1">{paymentDescription}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Received By:</td>
              <td className="py-1">{receivedBy}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6">
          <div>CASHIER: {receivedBy}</div>
          <div className="mt-4">Sign: ________________</div>
        </div>
      </div>

      {/* Student Copy */}
      <div>
        <div className="text-center font-bold text-lg mb-4">
          AL-IRSHAAD SECONDARY SCHOOL
        </div>
        <div className="text-center text-sm mb-4">
          ZAAD NO: 515449 Tel: 4740303 / 4422850 / 6388881
        </div>
        <div className="text-center font-bold mb-4">
          CASH RECEIPT - STUDENT COPY - DATE: {date}
        </div>

        <table className="w-full mb-4">
          <tbody>
            <tr>
              <td className="font-semibold py-1">Student:</td>
              <td className="py-1">{studentName}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Month/Year:</td>
              <td className="py-1">{monthYear}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Amount Paid:</td>
              <td className="py-1">${amountPaid}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Discount:</td>
              <td className="py-1">${discount}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Description:</td>
              <td className="py-1">{paymentDescription}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Received By:</td>
              <td className="py-1">{receivedBy}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6">
          <div>CASHIER: {receivedBy}</div>
          <div className="mt-4">Sign: ________________</div>
        </div>
      </div>
    </div>
  );
};

export default PaymentVoucher;