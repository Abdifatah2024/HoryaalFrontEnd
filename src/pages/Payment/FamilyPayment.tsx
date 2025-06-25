import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  fetchFamilyBalance,
  payFamilyMonthly,
  payStudentMonthly,
  clearFamilyPaymentStatus,
  checkPaymentNumberUsed,
  checkLastPaymentByNumber,
  clearLastPaymentInfo,
} from "../../Redux/Payment/familyPaymentSlice";
import { toast } from "react-hot-toast";

const FamilyPayment: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    family,
    paymentError,
    paymentSuccess,
    checkLoading,
    lastPaymentInfo,
  } = useAppSelector((state) => state.familyPayment);

  const [searchQuery, setSearchQuery] = useState("");
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [discount, setDiscount] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [zaadNumber, setZaadNumber] = useState("");
  const [edahabNumber, setEdahabNumber] = useState("");
  const [isDiscountVisible, setIsDiscountVisible] = useState(false);
  const [numberChecked, setNumberChecked] = useState(false);
  const [paySingle, setPaySingle] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const [showStudentModal, setShowStudentModal] = useState(false);

  // Calculate total balance using useMemo for efficiency
  const totalBalance = useMemo(() => {
    if (!family || !family.students) return 0;
    return family.students.reduce((sum, student) => sum + student.balance, 0);
  }, [family]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      toast.error("Please enter a phone number or family name to search.");
      return;
    }
    dispatch(fetchFamilyBalance(query));
    dispatch(clearLastPaymentInfo());
  };

  const handleCheckNumber = () => {
    const number = paymentMethod === "ZAAD" ? zaadNumber : edahabNumber;
    if (!number) {
      toast.error("Please enter the payment number to check.");
      return;
    }
    dispatch(
      checkPaymentNumberUsed({ number, month, year, method: paymentMethod })
    ).then((res) => {
      const success = res.meta.requestStatus === "fulfilled";
      setNumberChecked(success);
     if (
  success &&
  res.payload &&
  typeof res.payload === "object" &&
  "message" in res.payload
) {
  toast.success((res.payload as { message: string }).message);
}
      
    });
    dispatch(checkLastPaymentByNumber({ number, method: paymentMethod }));
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!family) {
      toast.error("Please search for a family first.");
      return;
    }
    if (paymentMethod !== "Cash" && !numberChecked) {
      toast.error("Please check the payment number before submitting.");
      return;
    }

    const desc =
      paymentMethod === "ZAAD" && zaadNumber
        ? `ZAAD - ${zaadNumber}`
        : paymentMethod === "E-dahab" && edahabNumber
        ? `E-dahab - ${edahabNumber}`
        : paymentMethod;

    if (paySingle) {
      if (!selectedStudentId) {
        toast.error("Please select a student to pay for.");
        return;
      }
      dispatch(
        payStudentMonthly({
          studentId: selectedStudentId,
          month,
          year,
          discount,
          discountReason,
          description: desc,
        })
      );
    } else {
      const isPhone = /^\d{6,}$/.test(searchQuery.trim());
      dispatch(
        payFamilyMonthly({
          ...(isPhone
            ? { parentPhone: searchQuery.trim() }
            : { familyName: searchQuery.trim() }),
          month,
          year,
          discount,
          discountReason,
          description: desc,
        })
      );
    }
  };

  useEffect(() => {
    if (paymentSuccess) {
      toast.success(paymentSuccess.message || "Payment successful!");
      dispatch(clearFamilyPaymentStatus());
      setDiscount(0);
      setDiscountReason("");
      setZaadNumber("");
      setEdahabNumber("");
      setNumberChecked(false);
      setIsDiscountVisible(false);
      setSelectedStudentId(null);
      setSearchQuery(""); // Clear search query after successful payment
      dispatch(clearLastPaymentInfo()); // Clear last payment info
      setShowStudentModal(false); // Close modal on success
    }
    if (paymentError) {
      toast.error(paymentError);
      dispatch(clearFamilyPaymentStatus());
    }
  }, [paymentSuccess, paymentError, dispatch]);

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-2xl max-w-4xl my-8">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
        Family Payment Dashboard
      </h2>
      <form onSubmit={handlePay} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Search, Family Details, Pay Single */}
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-blue-700 mb-4 border-b pb-2">
            Family Information
          </h3>
          {/* Search Family Section */}
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label
                htmlFor="searchQuery"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Family (Name or Phone)
              </label>
              <input
                type="text"
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                placeholder="e.g., 615xxxxxx or Hussein Family"
              />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105"
            >
              Search
            </button>
          </div>

          {/* Family and Student Details Summary */}
          {family && (
            <div className="border border-gray-200 rounded-xl p-5 bg-blue-50/50 shadow-sm">
              <h4 className="font-bold text-xl text-blue-800 mb-3">
                Family: {family.familyName}
              </h4>
              <div className="flex justify-between items-center mb-3">
                <p className="text-gray-700 text-md font-semibold">
                  Total Balance:{" "}
                  <span className="text-green-700 text-lg">
                    ${totalBalance.toFixed(2)}
                  </span>
                </p>
                {family?.students?.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowStudentModal(true)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm transition duration-150 ease-in-out"
                  >
                    View Student Details ({family?.students?.length})
                  </button>
                )}
              </div>
              {family?.students?.length === 0 && (
                <p className="text-gray-600 italic">
                  No students found for this family.
                </p>
              )}
            </div>
          )}

          {/* Pay Single Student Option */}
          <div className="flex items-center gap-3 mt-6">
            <input
              type="checkbox"
              checked={paySingle}
              onChange={() => setPaySingle(!paySingle)}
              id="paySingle"
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="paySingle"
              className="text-base font-medium text-gray-800 cursor-pointer"
            >
              Pay for a Single Student
            </label>
          </div>

         {paySingle && family?.students?.length > 0 && (
  <div>
    <label htmlFor="selectStudent" className="block text-sm font-medium text-gray-700 mb-1">
      Select Student
    </label>
    <select
      id="selectStudent"
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
      value={selectedStudentId ?? ""}
      onChange={(e) => setSelectedStudentId(Number(e.target.value))}
    >
      <option value="">-- Select a Student --</option>
      {family?.students?.map((s) => (
        <option key={s.studentId} value={s.studentId}>
          {s.fullname} (${s.balance.toFixed(2)})
        </option>
      ))}
    </select>
  </div>
)}

        </div>

        {/* Right Column: Payment Details, Discount, Submit */}
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-green-700 mb-4 border-b pb-2">
            Payment Details
          </h3>
          {/* Month and Year Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="month"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Month
              </label>
              <input
                type="number"
                id="month"
                min={1}
                max={12}
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
            </div>
            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Year
              </label>
              <input
                type="number"
                id="year"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label
              htmlFor="paymentMethod"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setNumberChecked(false); // Reset check when method changes
                dispatch(clearLastPaymentInfo()); // Clear last payment info when method changes
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            >
              <option value="Cash">Cash</option>
              <option value="ZAAD">ZAAD</option>
              <option value="E-dahab">E-dahab</option>
            </select>
          </div>

          {/* Mobile Payment Number Check */}
          {(paymentMethod === "ZAAD" || paymentMethod === "E-dahab") && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Mobile Payment Verification
              </h4>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label
                    htmlFor="paymentNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {paymentMethod === "ZAAD" ? "ZAAD" : "E-dahab"} Number
                  </label>
                  <input
                    type="text"
                    id="paymentNumber"
                    value={
                      paymentMethod === "ZAAD" ? zaadNumber : edahabNumber
                    }
                    onChange={(e) =>
                      paymentMethod === "ZAAD"
                        ? setZaadNumber(e.target.value)
                        : setEdahabNumber(e.target.value)
                    }
                    placeholder="Enter payment number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCheckNumber}
                  className={`w-full sm:w-auto font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105
                ${
                  numberChecked
                    ? "bg-green-500 text-white"
                    : "bg-yellow-500 hover:bg-yellow-600 text-white"
                }
              `}
                  disabled={checkLoading}
                >
                  {checkLoading
                    ? "Checking..."
                    : numberChecked
                    ? "Checked!"
                    : "Check Number"}
                </button>
              </div>
              {lastPaymentInfo?.message && (
                <p className="text-sm text-gray-600 italic bg-gray-100 p-3 rounded-md border border-gray-200 mt-4">
                  <span className="font-semibold">Last Payment Info:</span>{" "}
                  {lastPaymentInfo.message}
                </p>
              )}
            </div>
          )}

          {/* Discount Section */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Discount Options
            </h4>
            <label className="flex items-center gap-2 text-base font-medium text-gray-800 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={isDiscountVisible}
                onChange={() => setIsDiscountVisible(!isDiscountVisible)}
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              Apply Discount
            </label>
            {isDiscountVisible && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="discountAmount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Discount Amount ($)
                  </label>
                  <input
                    type="number"
                    id="discountAmount"
                    placeholder="e.g., 10"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label
                    htmlFor="discountReason"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Reason for Discount
                  </label>
                  <input
                    type="text"
                    id="discountReason"
                    placeholder="e.g., Early payment, Sibling discount"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    value={discountReason}
                    onChange={(e) => setDiscountReason(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mt-auto"
            // mt-auto pushes the button to the bottom if the right column is shorter
          >
            Submit Payment
          </button>
        </div>
      </form>

      {/* Student List Pop-up (Modal) */}
      {showStudentModal && family && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                Students of {family.familyName}
              </h3>
              <button
                onClick={() => setShowStudentModal(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl font-semibold leading-none"
              >
                &times;
              </button>
            </div>
            {family?.students?.length > 0 ? (
              <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {family?.students?.map((s) => (
                  <li
                    key={s.studentId}
                    className="flex justify-between items-center text-base text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100"
                  >
                    <span className="font-medium">{s.fullname}</span>
                    <span className="font-semibold text-green-600">
                      ${s.balance.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 italic">
                No students found for this family.
              </p>
            )}
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">
                Overall Total:
              </span>
              <span className="text-2xl font-bold text-green-700">
                ${totalBalance.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyPayment;