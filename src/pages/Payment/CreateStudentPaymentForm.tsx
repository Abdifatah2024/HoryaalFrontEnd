import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { submitPayment } from "../../Redux/Payment/paymentSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DollarSign } from "lucide-react";
import PayPayment from "./PayPayment"; // ✅ Make sure this path is correct

const CreateStudentPaymentForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, paymentResponse } = useSelector(
    (state: RootState) => state.payment
  );

  const [studentId, setStudentId] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountReason, setDiscountReason] = useState("");
  const [description, setDescription] = useState("");
  const [showVoucher, setShowVoucher] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId || !amountPaid) {
      toast.error("Student ID and Amount Paid are required");
      return;
    }

    dispatch(
      submitPayment({
        studentId: Number(studentId),
        amountPaid: Number(amountPaid),
        discount: Number(discount) || 0,
        discountReason,
        Description: description,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Payment submitted successfully");

        // reset form
        setStudentId("");
        setAmountPaid("");
        setDiscount("");
        setDiscountReason("");
        setDescription("");

        // show voucher dialog
        setShowVoucher(true);
      })
      .catch((err: string) => {
        toast.error(err || "Payment submission failed");
      });
  };

  // close voucher dialog
  const handleCloseVoucher = () => {
    setShowVoucher(false);
  };

  return (
    <>
      <ToastContainer />

      {/* ✅ Voucher dialog shown after payment */}
      {showVoucher && paymentResponse && (
        <PayPayment
          paymentData={paymentResponse}
          onClose={handleCloseVoucher}
        />
      )}

      {/* Form only shows when voucher is hidden */}
      {!showVoucher && (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl border border-blue-200"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <DollarSign className="text-green-600" />
              Student Payment Entry
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID
                </label>
                <input
                  type="number"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Paid
                </label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount
                </label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Reason
                </label>
                <input
                  type="text"
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 mt-2 bg-red-100 p-2 rounded">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Payment"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default CreateStudentPaymentForm;
