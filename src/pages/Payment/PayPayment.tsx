import React from "react";

interface Props {
  paymentData: any;
  onClose: () => void;
}

const PayPayment: React.FC<Props> = ({ paymentData, onClose }) => {
  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <>
      {/* Print-specific styles for A5 page size */}
      <style>
        {`
          @media print {
            @page {
              size: A5 portrait; /* Set page size to A5 in portrait orientation */
              margin: 10mm; /* Optional: Adjust margins for printing */
            }

            body {
              -webkit-print-color-adjust: exact; /* For Webkit browsers */
              print-color-adjust: exact; /* For other browsers */
            }

            /* Hide elements not needed in print, e.g., the close button */
            .no-print {
              display: none;
            }

            /* Adjust container width for A5 */
            .print-container {
              max-width: 148mm; /* A5 width is 148mm */
              margin: 0 auto; /* Center the content on the A5 page */
              box-shadow: none !important; /* Remove shadow in print */
              border: none !important; /* Remove border in print */
              padding: 0 !important; /* Remove padding in print */
            }
          }
        `}
      </style>

      <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-lg max-w-3xl mx-auto my-10 font-sans print-container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Payment Receipt</h2>
          <p className="text-gray-500">Thank you for your payment!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-8">
          <div>
            <p className="text-sm text-gray-500">Receipt Date:</p>
            <p className="font-semibold text-gray-800">{new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Receipt No:</p>
            <p className="font-semibold text-gray-800">#{Math.floor(100000 + Math.random() * 900000)}</p> {/* Example: Generate a random receipt number */}
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Student Name:</p>
            <p className="text-xl font-bold text-blue-700">{paymentData.StudentName}</p>
          </div>
        </div>

        <div className="border-t border-b border-gray-200 py-6 mb-8">
          <div className="flex justify-between items-center mb-3">
            <p className="text-gray-700 text-lg">Amount Paid:</p>
            <p className="font-bold text-xl text-green-600">{formatCurrency(paymentData.payment.amountPaid)}</p>
          </div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-gray-700">Discount Applied:</p>
            <p className="font-semibold text-red-500">-{formatCurrency(paymentData.payment.discount)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-700">Carry Forward Amount:</p>
            <p className="font-semibold text-gray-600">{formatCurrency(paymentData.carryForward)}</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Payment Allocations:</h3>
          <ul className="space-y-3">
            {paymentData.allocations.length > 0 ? (
              paymentData.allocations.map((a: any, index: number) => (
                <li key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                  <span className="text-gray-700">{a.month}/{a.year}</span>
                  <span className="text-gray-800">
                    Paid {formatCurrency(a.paid)} {a.discount > 0 && `+ Discount ${formatCurrency(a.discount)}`}
                  </span>
                </li>
              ))
            ) : (
              <p className="text-gray-500 italic">No specific allocations for this payment.</p>
            )}
          </ul>
        </div>

        <div className="text-center text-gray-500 text-sm mt-10">
          <p>This is an automated receipt. No signature is required.</p>
          <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 no-print">
          <button
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition ease-in-out duration-150"
            onClick={() => window.print()}
          >
            Print Receipt
          </button>
          <button
            className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition ease-in-out duration-150"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default PayPayment;