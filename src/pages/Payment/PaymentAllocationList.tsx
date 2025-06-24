import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  fetchAllPaymentAllocations,
  updatePayment,
} from "../../Redux/Payment/paymentSlice";

const PaymentAllocationList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { allocations } = useAppSelector((state) => state.payment);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedAmountPaid, setEditedAmountPaid] = useState<string>("");
  const [editedDiscount, setEditedDiscount] = useState<string>("");
  const [editedDescription, setEditedDescription] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    dispatch(fetchAllPaymentAllocations());
  }, [dispatch]);

  const handleEdit = (
    paymentId: number,
    amountPaid: string,
    discount: string,
    description: string | undefined
  ) => {
    setEditingId(paymentId);
    setEditedAmountPaid(amountPaid);
    setEditedDiscount(discount);
    setEditedDescription(description || ""); // fallback for undefined
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedAmountPaid("");
    setEditedDiscount("");
    setEditedDescription("");
  };

  const handleSave = () => {
    if (editingId === null) return;

    dispatch(
      updatePayment({
        id: editingId,
        amountPaid: editedAmountPaid,
        discount: editedDiscount,
        Description: editedDescription,
      })
    )
      .unwrap()
      .then(() => dispatch(fetchAllPaymentAllocations()));

    setEditingId(null);
    setEditedAmountPaid("");
    setEditedDiscount("");
    setEditedDescription("");
  };

  const filteredAllocations = allocations.filter((alloc) => {
    const name = alloc?.payment?.fullname?.toLowerCase() || "";
    const id = alloc?.payment?.studentId?.toString() || "";
    return (
      name.includes(searchTerm.toLowerCase()) ||
      id.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Payment Allocations</h2>
        <input
          type="text"
          placeholder="Search by name or student ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded-md"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Student ID</th>
              <th className="px-4 py-2">Full Name</th>
              <th className="px-4 py-2">Payment ID</th>
              <th className="px-4 py-2">Amount Paid</th>
              <th className="px-4 py-2">Discount</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAllocations.map((alloc, index) => (
              <tr key={alloc.id} className="border-t">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{alloc?.payment?.studentId ?? "N/A"}</td>
                <td className="px-4 py-2">{alloc?.payment?.fullname}</td>
                <td className="px-4 py-2">{alloc?.payment?.id}</td>
                <td className="px-4 py-2">
                  {editingId === alloc.payment.id ? (
                    <input
                      type="number"
                      value={editedAmountPaid}
                      onChange={(e) => setEditedAmountPaid(e.target.value)}
                      className="border rounded px-2 py-1 w-24"
                    />
                  ) : (
                    `$${alloc?.payment?.amountPaid}`
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingId === alloc.payment.id ? (
                    <input
                      type="number"
                      value={editedDiscount}
                      onChange={(e) => setEditedDiscount(e.target.value)}
                      className="border rounded px-2 py-1 w-20"
                    />
                  ) : (
                    `$${alloc?.payment?.discount}`
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingId === alloc.payment.id ? (
                    <input
                      type="text"
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    alloc?.payment?.description || "-"
                  )}
                </td>
                <td className="px-4 py-2">
                  {new Date(alloc.payment.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  {editingId === alloc.payment.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-300 text-black px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        handleEdit(
                          alloc.payment.id,
                          alloc.payment.amountPaid,
                          alloc.payment.discount,
                          alloc.payment.description
                        )
                      }
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredAllocations.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center text-gray-500 py-6">
                  No matching results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentAllocationList;
