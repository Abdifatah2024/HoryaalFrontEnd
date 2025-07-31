import React, { useEffect, useState, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  fetchFamilyBalance,
  fetchStudentBalance,
  payFamilyMonthly,
  payStudentMonthly,
  clearFamilyPaymentStatus,
  checkPaymentNumberUsed,
  checkLastPaymentByNumber,
  clearLastPaymentInfo,
} from "../../Redux/Payment/familyPaymentSlice";
import { toast } from "react-hot-toast";
import { UsedNumberResponse } from "@/types/Login";

// ReceiptVoucher Component for reusability and cleaner code
// This component will render a single voucher copy (either Office or Student)
const ReceiptVoucher: React.FC<{ data: any; copyType: "OFFICE COPY" | "STUDENT COPY" }> = ({ data, copyType }) => (
  // Removed print:w-[48%] from here, as printing width will be controlled by handlePrint CSS
  <div className="receipt-voucher p-6 border border-gray-300 rounded-lg bg-white shadow-sm mb-6 w-full max-w-md mx-auto print:border-none print:shadow-none print:mb-0 print:break-inside-avoid">
    <div className="school-header text-center mb-4">
      <h3 className="text-xl font-bold text-gray-800">AL-IRSHAAD SECONDARY SCHOOL</h3>
      <p className="text-sm text-gray-600">ZAAD NO: 515449 Tel: 4740303/4422850/6388881</p>
      <p className="text-md font-semibold text-gray-700 mt-2">
        CASH RECEIPT - {copyType} - DATE: {data.date}
      </p>
    </div>
    <div className="receipt-details text-gray-700 text-base space-y-2">
      <p><strong>Student:</strong> {data.student}</p>
      <p><strong>Month/Year:</strong> {data.monthYear}</p>
      <p><strong>Amount Paid:</strong> ${data.amountPaid?.toFixed(2)}</p>
      <p><strong>Discount:</strong> ${data.discount?.toFixed(2)}</p>
      <p><strong>Description:</strong> {data.description}</p>
      <p><strong>Received By:</strong> {data.receivedBy}</p>
    </div>
    <div className="signature-line mt-8 text-sm text-gray-700 text-center border-t border-dashed border-gray-400 pt-2">
      <p>CASHIER: {data.receivedBy}</p>
      <p>Sign:</p>
    </div>
    {copyType === "OFFICE COPY" && (
      <div className="text-xs text-gray-500 text-center mt-4">
        <p>This is the Office Copy for record keeping.</p>
      </div>
    )}
    {copyType === "STUDENT COPY" && (
      <div className="text-xs text-gray-500 text-center mt-4">
        <p>Thank you for your payment!</p>
      </div>
    )}
  </div>
);

const FamilyPayment: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    family,
    paymentError,
    paymentSuccess,
    checkLoading,
  } = useAppSelector((state) => state.familyPayment);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchSingleStudent, setSearchSingleStudent] = useState(false);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [discount, setDiscount] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [zaadNumber, setZaadNumber] = useState("");
  const [edahabNumber, setEdahabNumber] = useState("");
  const [isDiscountVisible, setIsDiscountVisible] = useState(false);
  const [numberChecked, setNumberChecked] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<{
    type: "family" | "student";
    payload: any;
  } | null>(null);

  const [usedNumberInfo, setUsedNumberInfo] = useState<null | {
    message: string;
    description?: string;
    createdAt?: string;
    paidFor?: { student: string; month: number; year: number; amount: string }[];
  }>(null);

  // New state for print receipt
  const [showPrintButton, setShowPrintButton] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null); // State to hold data for the receipt
  const receiptPrintAreaRef = useRef<HTMLDivElement>(null); // Ref for the printable area that will contain both vouchers

  const currentStudent = useMemo(() => {
    if (selectedStudentId && family?.students?.length) {
      return family.students.find((s) => s.studentId === selectedStudentId) || family.students[0];
    }
    if (family?.students?.length) {
      return family.students[0];
    }
    return null;
  }, [family, selectedStudentId]);

  const displayBalance = useMemo(() => {
    if (!currentStudent) return 0;
    return currentStudent.balance || 0;
  }, [currentStudent]);

  const totalBalance = useMemo(() => {
    if (!family || !family.students) return 0;
    return family.students.reduce((sum, s) => sum + (s.balance || 0), 0);
  }, [family]); // Corrected: Added missing ']' here

  const handleSearch = () => {
    const query = searchQuery.trim();
    if (!query) {
      toast.error(
        searchSingleStudent
          ? "Enter a student ID."
          : "Enter a phone number or family name."
      );
      return;
    }
    if (searchSingleStudent) {
      dispatch(fetchStudentBalance(query));
    } else {
      dispatch(fetchFamilyBalance(query));
    }
    dispatch(clearLastPaymentInfo());
    // Hide print button on new search
    setShowPrintButton(false);
    setReceiptData(null);
  };

  const handleCheckNumber = () => {
    const number = paymentMethod === "ZAAD" ? zaadNumber : edahabNumber;
    if (!number) {
      toast.error("Enter the payment number to check.");
      return;
    }

    setUsedNumberInfo(null);

    // dispatch(
    //   checkPaymentNumberUsed({ number, month, year, method: paymentMethod })
    // ).then((res) => {
    //   const success = res.meta.requestStatus === "fulfilled";
    //   setNumberChecked(success);

    //   if (
    //     success &&
    //     res.payload &&
    //     typeof res.payload === "object" &&
    //     "alreadyUsed" in res.payload &&
    //     res.payload.alreadyUsed === true
    //   ) {
    //     setUsedNumberInfo(res.payload);
    //     toast.error(res.payload.message);
    //   } else if (
    //     success &&
    //     res.payload &&
    //     typeof res.payload === "object" &&
    //     "message" in res.payload
    //   ) {
    //     toast.success(res.payload.message);
    //   }
    // });

    dispatch(
  checkPaymentNumberUsed({ number, month, year, method: paymentMethod })
).then((res) => {
  const success = res.meta.requestStatus === "fulfilled";
  setNumberChecked(success);

  if (success && res.payload && typeof res.payload === "object") {
    const data = res.payload as UsedNumberResponse;

    if (data.alreadyUsed) {
      setUsedNumberInfo(data);
      toast.error(data.message);
    } else {
      toast.success(data.message);
    }
  }
});

    dispatch(checkLastPaymentByNumber({ number, method: paymentMethod }));
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();

    if (!family) {
      toast.error("Search for a family or student first.");
      return;
    }

    if (paymentMethod !== "Cash" && !numberChecked) {
      toast("⚠️ You have not verified this payment number.", { icon: "⚠️" });
      return;
    }

    const desc =
      paymentMethod === "ZAAD" && zaadNumber
        ? `ZAAD - ${zaadNumber}`
        : paymentMethod === "E-dahab" && edahabNumber
        ? `E-dahab - ${edahabNumber}`
        : paymentMethod;

    if (searchSingleStudent) {
      if (!currentStudent) {
        toast.error("No student found.");
        return;
      }
      setPendingPayment({
        type: "student",
        payload: {
          studentId: currentStudent.studentId,
          month,
          year,
          discount,
          discountReason,
          description: desc,
        },
      });
    } else {
      setPendingPayment({
        type: "family",
        payload: {
          parentPhone: family.phone,
          month,
          year,
          discount,
          discountReason,
          description: desc,
        },
      });
    }
    setShowConfirmModal(true);
  };

  const confirmPayment = () => {
    if (!pendingPayment) return;
    if (pendingPayment.type === "student") {
      dispatch(payStudentMonthly(pendingPayment.payload));
    } else {
      dispatch(payFamilyMonthly(pendingPayment.payload));
    }
    setShowConfirmModal(false);
    setPendingPayment(null);
  };

  const cancelPayment = () => {
    setShowConfirmModal(false);
    setPendingPayment(null);
  };

  // Function to handle printing
  const handlePrint = () => {
    if (receiptPrintAreaRef.current) {
      const printContents = receiptPrintAreaRef.current.innerHTML;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Print Receipt</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
          body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; }
          .print-container {
            /* No flexbox for vertical stacking */
          }
          .receipt-voucher {
            box-sizing: border-box;
            background-color: #fff;
            padding: 20px; /* Default padding for screen */
            border: 1px solid #ccc; /* Default border for screen */
            border-radius: 8px; /* Default border-radius for screen */
            box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Default shadow for screen */
            margin-bottom: 20px; /* Space between vouchers on screen */
            width: 100%; /* Full width for screen, and for print when stacked */
            max-width: 600px; /* Max width for screen display */
            margin-left: auto;
            margin-right: auto;
          }
          .school-header { text-align: center; margin-bottom: 15px; }
          .school-header h3 { margin: 0; font-size: 1.2em; }
          .school-header p { margin: 2px 0; font-size: 0.8em; }
          .receipt-details p { margin: 5px 0; font-size: 0.9em; }
          .receipt-details strong { display: inline-block; min-width: 90px; }
          .signature-line { margin-top: 30px; border-top: 1px dashed #ccc; padding-top: 5px; font-size: 0.8em; text-align: center; }

          @media print {
            body { background-color: #fff; }
            .print-container {
                width: 100%;
            }
            .receipt-voucher {
                border: none;
                box-shadow: none;
                margin-bottom: 30px; /* Space between vouchers when stacked */
                width: 100%; /* Full width for stacking */
                padding: 15px; /* Adjust padding for print */
                page-break-inside: avoid; /* Prevent breaking a voucher across pages */
            }
            /* Add more space for the second voucher (student copy) */
            .receipt-voucher:nth-child(2) {
                margin-top: 30px; /* Ensure visual separation on print */
            }
          }
        `);
        printWindow.document.write('</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<div class="print-container">'); // Wrapper for both vouchers
        printWindow.document.write(printContents); // This will now contain both vouchers from the ref
        printWindow.document.write('</div>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      } else {
        toast.error("Could not open print window.");
      }
    }
  };

  useEffect(() => {
    if (paymentSuccess) {
      toast.success(paymentSuccess.message || "Payment successful!");

      // Prepare receipt data
      const studentName = currentStudent?.fullname || (family && family.students?.length === 1 ? family.students[0].fullname : 'N/A');
      const amountPaid = searchSingleStudent ? displayBalance : totalBalance;
      const receivedBy = "Abdifatah Ismail Abdi"; // This should come from user context or backend

      setReceiptData({
        student: studentName,
        monthYear: `${month}/${year}`,
        amountPaid: amountPaid,
        discount: discount,
        description: pendingPayment?.payload.description || paymentMethod,
        receivedBy: receivedBy,
        date: new Date().toLocaleDateString(),
      });
      setShowPrintButton(true); // Show print button after successful payment

      dispatch(clearFamilyPaymentStatus());
      setDiscount(0);
      setDiscountReason("");
      setZaadNumber("");
      setEdahabNumber("");
      setNumberChecked(false);
      setIsDiscountVisible(false);
      setSelectedStudentId(null);
      setSearchQuery("");
      dispatch(clearLastPaymentInfo());
      setShowStudentModal(false);
      setUsedNumberInfo(null);
    }
    if (paymentError) {
      toast.error(paymentError);
      dispatch(clearFamilyPaymentStatus());
      setShowPrintButton(false); // Hide print button on error
      setReceiptData(null);
    }
  }, [paymentSuccess, paymentError, dispatch, currentStudent, family, month, year, discount, paymentMethod, displayBalance, totalBalance, pendingPayment]);

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-2xl max-w-4xl my-8">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
        {searchSingleStudent ? "Single Student Payment" : "Family Payment Dashboard"}
      </h2>

      <form onSubmit={handlePay} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <input
              type="text"
              placeholder={searchSingleStudent ? "Student ID" : "Family name or phone number"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg py-2 px-4"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
            >
              Search
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={searchSingleStudent}
              onChange={() => setSearchSingleStudent(!searchSingleStudent)}
              className="h-5 w-5 text-blue-600 rounded"
            />
            <label className="text-base font-medium text-gray-800">Single Student</label>
          </div>

          {family && (
            <div className="border border-gray-200 rounded-xl p-5 bg-blue-50/50 shadow-sm space-y-4">
              <div>
                <h4 className="font-bold text-xl text-blue-800 mb-1">
                  Parent: {family.parentName}
                </h4>
                <p className="text-gray-700 font-medium">Phone: {family.phone}</p>
                <p className="text-gray-700 font-medium">
                  Total Balance:{" "}
                  <span className="text-green-700 font-semibold">
                    ${family.totalFamilyBalance?.toFixed(2)}
                  </span>
                </p>
                {family.students?.length > 1 && (
                  <button
                    onClick={() => setShowStudentModal(true)}
                    className="mt-2 text-sm text-blue-600 underline"
                  >
                    View Students ({family.students.length})
                  </button>
                )}
              </div>
              {currentStudent && (
                <div className="border-t border-gray-300 pt-4">
                  <h4 className="font-bold text-lg text-blue-700">
                    Student: {currentStudent.fullname}
                  </h4>
                  <p className="text-gray-700 font-medium">
                    Balance:{" "}
                    <span className="text-green-700 font-semibold">
                      ${currentStudent.balance?.toFixed(2)}
                    </span>
                  </p>
                  {currentStudent.months?.length > 0 && (
                    <ul className="mt-2 list-disc pl-5 text-gray-700 text-sm">
                      {currentStudent.months.map((m, idx) => (
                        <li key={idx}>
                          {m.month}/{m.year}: ${(m.due || 0).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          {/* Print Button - Conditionally Rendered at the top of the right column */}
          {showPrintButton && receiptData && (
            <button
              type="button"
              onClick={handlePrint}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded mb-4"
            >
              Print Receipt
            </button>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Month</label>
              <input
                type="number"
                min={1}
                max={12}
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setNumberChecked(false);
                setUsedNumberInfo(null);
                dispatch(clearLastPaymentInfo());
              }}
              className="w-full border border-gray-300 rounded px-4 py-2"
            >
              <option value="Cash">Cash</option>
              <option value="ZAAD">ZAAD</option>
              <option value="E-dahab">E-dahab</option>
            </select>
          </div>

          {(paymentMethod === "ZAAD" || paymentMethod === "E-dahab") && (
            <div className="space-y-2 border border-gray-200 p-4 rounded bg-gray-50">
              <label className="block text-sm font-medium mb-1">
                {paymentMethod} Number
              </label>
              <input
                type="text"
                value={paymentMethod === "ZAAD" ? zaadNumber : edahabNumber}
                onChange={(e) =>
                  paymentMethod === "ZAAD"
                    ? setZaadNumber(e.target.value)
                    : setEdahabNumber(e.target.value)
                }
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <button
                type="button"
                onClick={handleCheckNumber}
                className={`w-full mt-2 py-2 rounded text-white font-semibold ${
                  numberChecked
                    ? "bg-green-500"
                    : "bg-yellow-500 hover:bg-yellow-600"
                }`}
                disabled={checkLoading}
              >
                {checkLoading
                  ? "Checking..."
                  : numberChecked
                  ? "Checked!"
                  : "Check Number"}
              </button>

              {/* Used Number Info Display */}
              {usedNumberInfo && (
                <div className="mt-3 text-sm bg-red-50 border border-red-200 rounded p-3 space-y-2">
                  <p className="font-semibold text-red-700">{usedNumberInfo.message}</p>
                  {usedNumberInfo.description && (
                    <p><span className="font-medium">Description:</span> {usedNumberInfo.description}</p>
                  )}
                  {usedNumberInfo?.createdAt && (
                    <p>
                      <span className="font-medium">Created At:</span>{" "}
                      {new Date(usedNumberInfo.createdAt).toLocaleString()}
                    </p>
                  )}
                  {usedNumberInfo?.paidFor && usedNumberInfo.paidFor.length > 0 && (
                    <div>
                      <p className="font-medium mb-1">Paid For:</p>
                      <ul className="list-disc pl-5 text-gray-700">
                        {usedNumberInfo.paidFor.map((entry, idx) => (
                          <li key={idx}>
                            {entry.student} — {entry.month}/{entry.year} — ${entry.amount}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="border border-gray-200 rounded p-4 bg-gray-50">
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={isDiscountVisible}
                onChange={() => setIsDiscountVisible(!isDiscountVisible)}
                className="h-5 w-5 text-blue-600"
              />
              Apply Discount
            </label>
            {isDiscountVisible && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Discount Amount ($)
                  </label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Reason</label>
                  <input
                    type="text"
                    value={discountReason}
                    onChange={(e) => setDiscountReason(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded"
          >
            Submit Payment
          </button>
        </div>
      </form>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold">Confirm Payment</h3>
            {pendingPayment?.type === "student" ? (
              <>
                <p><strong>Student:</strong> {currentStudent?.fullname}</p>
                <p><strong>Amount:</strong> ${displayBalance.toFixed(2)}</p>
              </>
            ) : (
              <>
                <p><strong>Family:</strong> {family?.parentName}</p>
                <p><strong>Total Amount:</strong> ${totalBalance.toFixed(2)}</p>
              </>
            )}
            <p><strong>Month:</strong> {month}</p>
            <p><strong>Year:</strong> {year}</p>
            <p><strong>Discount:</strong> ${discount.toFixed(2)}</p>
            <p><strong>Description:</strong> {pendingPayment?.payload.description}</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={cancelPayment} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={confirmPayment} className="px-4 py-2 bg-green-600 text-white rounded">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Student Modal */}
      {showStudentModal && family?.students && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 overflow-y-auto max-h-[80vh]">
            <h3 className="text-xl font-bold">Students</h3>
            {family.students.map((s) => (
              <div
                key={s.studentId}
                className={`border-b py-2 ${selectedStudentId === s.studentId ? "bg-blue-50" : ""}`}
                onClick={() => setSelectedStudentId(s.studentId)}
              >
                <div className="flex justify-between">
                  <span>{s.fullname}</span>
                  <span>${(s.balance || 0).toFixed(2)}</span>
                </div>
                {s.months?.length > 0 && (
                  <ul className="mt-1 pl-4 text-sm">
                    {s.months.map((m, i) => (
                      <li key={i}>
                        {m.month}/{m.year}: ${(m.due || 0).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <button
              onClick={() => setShowStudentModal(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hidden Receipt Component for Printing */}
      {receiptData && (
        <div style={{ display: 'none' }}>
          <div ref={receiptPrintAreaRef} className="print-area-wrapper">
            <ReceiptVoucher data={receiptData} copyType="OFFICE COPY" />
            <ReceiptVoucher data={receiptData} copyType="STUDENT COPY" />
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyPayment;