import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  fetchVouchers,
  fetchVoucherGroups,
  fetchVoucherById,
  updateVoucher,
  selectVoucherState,
} from "./VoucherSlice";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const VoucherList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { vouchers, voucherGroups, selectedVoucher, loading, error } =
    useAppSelector(selectVoucherState);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [amountPaid, setAmountPaid] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [description, setDescription] = useState("");

  useEffect(() => {
    dispatch(fetchVouchers());
    dispatch(fetchVoucherGroups());
  }, [dispatch]);

  const handleView = (id: number) => {
    dispatch(fetchVoucherById(id));
    setIsViewOpen(true);
    setEditMode(false);
  };

  const handleClose = () => {
    setIsViewOpen(false);
  };

  const getMonthYear = () => {
    const fee = selectedVoucher?.allocations?.[0]?.studentFee;
    if (fee?.month && fee?.year) {
      return `${fee.month}/${fee.year}`;
    }
    const date = new Date(selectedVoucher?.date || "");
    return `${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handlePrint = () => {
    if (!selectedVoucher) return;

    const content = `
      <html>
        <head>
          <title>Voucher</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1, h2 { text-align: center; margin: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            td, th { border: 1px solid #000; padding: 8px; }
          </style>
        </head>
        <body>
          <h1>AL-IRSHAAD SECONDARY SCHOOL</h1>
          <h2>Payment Voucher</h2>
          <p><strong>Month/Year:</strong> ${getMonthYear()}</p>
          <table>
            <tr><td><strong>Student</strong></td><td>${selectedVoucher.student?.fullname || ""}</td></tr>
            <tr><td><strong>Amount Paid</strong></td><td>${selectedVoucher.amountPaid}</td></tr>
            <tr><td><strong>Discount</strong></td><td>${selectedVoucher.discount}</td></tr>
            <tr><td><strong>Date</strong></td><td>${new Date(selectedVoucher.date).toLocaleString()}</td></tr>
            <tr><td><strong>Description</strong></td><td>${selectedVoucher.Description}</td></tr>
            <tr><td><strong>User</strong></td><td>${selectedVoucher.user?.fullName || ""}</td></tr>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `;

    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(content);
      newWindow.document.close();
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedVoucher) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("AL-IRSHAAD SECONDARY SCHOOL", 70, 10);
    doc.text("Payment Voucher", 85, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Field", "Value"]],
      body: [
        ["Month/Year", getMonthYear()],
        ["Student", selectedVoucher.student?.fullname || ""],
        ["Amount Paid", selectedVoucher.amountPaid],
        ["Discount", selectedVoucher.discount],
        ["Date", new Date(selectedVoucher.date).toLocaleString()],
        ["Description", selectedVoucher.Description],
        ["User", selectedVoucher.user?.fullName || ""]
      ]
    });

    doc.save(`Voucher-${selectedVoucher.id}.pdf`);
  };

  const handleSave = () => {
    if (selectedVoucher) {
      dispatch(updateVoucher({
        id: selectedVoucher.id,
        amountPaid,
        discount,
        Description: description,
      }));
      setEditMode(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Voucher List</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Monthly Groups</h3>
        <ul className="space-y-2">
          {Array.isArray(voucherGroups) &&
            voucherGroups.map((group, index) => (
              <li key={index} className="border p-2 rounded bg-gray-50">
                {group.month}/{group.year} — {group.count} vouchers
              </li>
            ))}
        </ul>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">#</th>
            <th className="p-2 border">Student</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Discount</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((voucher, idx) => (
            <tr key={voucher.id} className="border">
              <td className="p-2 border">{idx + 1}</td>
              <td className="p-2 border">{voucher.student?.fullname}</td>
              <td className="p-2 border">{voucher.amountPaid}</td>
              <td className="p-2 border">{voucher.discount}</td>
              <td className="p-2 border">
                {new Date(voucher.date).toLocaleDateString()}
              </td>
              <td className="p-2 border">{voucher.user?.fullName}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleView(voucher.id)}
                  className="text-blue-500 hover:underline"
                >
                  View
                </button>
                <button
                  onClick={() => {
                    handleView(voucher.id);
                    setEditMode(true);
                    setAmountPaid(voucher.amountPaid);
                    setDiscount(voucher.discount);
                    setDescription(voucher.Description || "");
                  }}
                  className="text-green-600 hover:underline"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedVoucher && isViewOpen && (
        <div className="mt-6 p-4 border rounded bg-white shadow relative">
          <button
            className="absolute top-2 right-2 text-red-600"
            onClick={handleClose}
          >
            ✕
          </button>

          <h3 className="text-lg font-semibold mb-2">
            Voucher #{selectedVoucher.id} Details
          </h3>
          <p><strong>Month/Year:</strong> {getMonthYear()}</p>
          {editMode ? (
            <div className="space-y-2">
              <p><strong>Student:</strong> {selectedVoucher.student?.fullname}</p>
              <label className="block">
                Amount Paid:
                <input type="number" value={amountPaid} onChange={(e) => setAmountPaid(Number(e.target.value))} className="border rounded w-full p-1" />
              </label>
              <label className="block">
                Discount:
                <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="border rounded w-full p-1" />
              </label>
              <label className="block">
                Description:
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border rounded w-full p-1" />
              </label>
              <Button variant="default" onClick={handleSave}>Save</Button>
            </div>
          ) : (
            <div>
              <p><strong>Student:</strong> {selectedVoucher.student?.fullname}</p>
              <p><strong>Amount Paid:</strong> {selectedVoucher.amountPaid}</p>
              <p><strong>Discount:</strong> {selectedVoucher.discount}</p>
              <p><strong>Date:</strong> {new Date(selectedVoucher.date).toLocaleString()}</p>
              <p><strong>Description:</strong> {selectedVoucher.Description}</p>
              <p><strong>User:</strong> {selectedVoucher.user?.fullName}</p>
            </div>
          )}

          <div className="mt-4 space-x-4">
            <Button variant="outline" onClick={handlePrint}>
              Print Voucher
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF}>
              Download PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherList;
