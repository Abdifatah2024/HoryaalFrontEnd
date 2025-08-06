import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  fetchVouchers,
  fetchVoucherGroups,
  fetchVoucherById,
  updateVoucher,
  selectVoucherState,
} from "./VoucherSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/Components/ui/button"; // ✅ Adjust casing as needed

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

  const renderVoucherHTML = () => {
    const student = selectedVoucher?.student?.fullname || "";
    const amount = selectedVoucher?.amountPaid ?? 0;
    const discount = selectedVoucher?.discount ?? 0;
    const desc = selectedVoucher?.Description ?? "";
    const date = selectedVoucher?.date
      ? new Date(selectedVoucher.date).toLocaleDateString()
      : "N/A";
    const user = selectedVoucher?.user?.fullName || "";
    const monthYear = getMonthYear();

    return `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            .header { text-align: center; font-size: 16px; font-weight: bold; }
            .section-title { font-weight: bold; margin-top: 20px; }
            .info-table, .summary-table {
              width: 100%; border-collapse: collapse; margin-top: 10px;
            }
            .info-table td, .summary-table td, .summary-table th {
              border: 1px solid #000; padding: 8px;
            }
            .row { margin-top: 30px; display: flex; justify-content: space-between; }
            .signature { margin-top: 50px; text-align: left; }
          </style>
        </head>
        <body>
          ${["OFFICE COPY", "STUDENT COPY"].map(copy => `
            <div>
              <div class="header">
                HORYAAL PRIMARY <br/>
                  ZAAD NO: 500536 Morning, ZAAD NO: 500929 Afternoon Tel: 063-4818888 / 063-6294444<br/>
                <u>CASH RECEIPT - ${copy}</u> - DATE: ${date}
              </div>
              <table class="info-table">
                <tr><td><strong>Student:</strong></td><td>${student}</td></tr>
                <tr><td><strong>Month/Year:</strong></td><td>${monthYear}</td></tr>
                <tr><td><strong>Amount Paid:</strong></td><td>$${amount}</td></tr>
                <tr><td><strong>Discount:</strong></td><td>$${discount}</td></tr>
                <tr><td><strong>Description:</strong></td><td>${desc}</td></tr>
                <tr><td><strong>Received By:</strong></td><td>${user}</td></tr>
              </table>
              <div class="signature">
                <p><strong>CASHIER:</strong> ${user}</p>
                <p><strong>Sign:</strong> ___________________</p>
              </div>
              <hr style="margin: 40px 0;" />
            </div>
          `).join("")}
          <script>window.print();</script>
        </body>
      </html>
    `;
  };

  const handlePrint = () => {
    if (!selectedVoucher) return;
    const voucherWindow = window.open("", "_blank");
    if (voucherWindow) {
      voucherWindow.document.write(renderVoucherHTML());
      voucherWindow.document.close();
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedVoucher) return;
    const doc = new jsPDF();

    const drawVoucher = (yStart: number, copyType: string) => {
      doc.setFontSize(12);
      doc.text("HORYAAL PRIMARY SCHOOL", 70, yStart);
      doc.text("ZAAD NO:500536 Morning, ZAAD NO:500928 Afternoon,Tel:063-4818888 / 063-6294444", 50, yStart + 6);
      doc.text(`CASH RECEIPT - ${copyType}`, 80, yStart + 12);
      doc.text(`DATE: ${selectedVoucher?.date ? new Date(selectedVoucher.date).toLocaleDateString() : "N/A"}`, 150, yStart + 12);

      autoTable(doc, {
        startY: yStart + 20,
        head: [["Field", "Value"]],
        body: [
          ["Student", selectedVoucher.student?.fullname || ""],
          ["Month/Year", getMonthYear()],
          ["Amount Paid", `$${selectedVoucher.amountPaid}`],
          ["Discount", `$${selectedVoucher.discount}`],
          ["Description", selectedVoucher.Description ?? ""],
          ["Received By", selectedVoucher.user?.fullName ?? ""],
        ],
        styles: { fontSize: 10 },
        margin: { left: 15 },
      });

      if (doc.lastAutoTable?.finalY) {
        doc.text("CASHIER: " + (selectedVoucher.user?.fullName ?? ""), 15, doc.lastAutoTable.finalY + 15);
        doc.text("Sign: ___________________", 15, doc.lastAutoTable.finalY + 25);
      }
    };

    drawVoucher(10, "OFFICE COPY");

    if (doc.lastAutoTable?.finalY) {
      drawVoucher(doc.lastAutoTable.finalY + 40, "STUDENT COPY");
    }

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
              <td className="p-2 border">{new Date(voucher.date).toLocaleDateString()}</td>
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
