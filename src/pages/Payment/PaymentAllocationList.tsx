// import React, { useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from "../../Redux/store";
// import {
//   fetchAllPaymentAllocations,
//   updatePaymentAllocation,
// } from "../../Redux/Payment/paymentSlice";

// const PaymentAllocationList: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { allocations, loading, error } = useAppSelector((state) => state.payment);

//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [editedAmount, setEditedAmount] = useState<string>("");
//   const [searchTerm, setSearchTerm] = useState<string>("");

//   useEffect(() => {
//     dispatch(fetchAllPaymentAllocations());
//   }, [dispatch]);

//   const handleEdit = (id: number, currentAmount: string) => {
//     setEditingId(id);
//     setEditedAmount(currentAmount);
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditedAmount("");
//   };

//   const handleSave = () => {
//     if (editingId === null) return;
//     const newAmount = parseFloat(editedAmount);
//     if (isNaN(newAmount) || newAmount < 0) {
//       alert("Please enter a valid positive amount");
//       return;
//     }

//     dispatch(updatePaymentAllocation({ id: editingId, amount: newAmount.toString() }))
//       .unwrap()
//       .then(() => dispatch(fetchAllPaymentAllocations()));

//     setEditingId(null);
//     setEditedAmount("");
//   };

//   const formatCurrency = (value: string | number) => {
//     const amount = typeof value === "string" ? parseFloat(value) : value;
//     return isNaN(amount)
//       ? "$0"
//       : new Intl.NumberFormat("en-US", {
//           style: "currency",
//           currency: "USD",
//           maximumFractionDigits: 0,
//         }).format(amount);
//   };

//   const totalAllocations = allocations.reduce((sum, alloc) => {
//     const amt = parseFloat(alloc.amount);
//     return isNaN(amt) ? sum : sum + amt;
//   }, 0);

//   const filteredAllocations = allocations.filter((alloc) => {
//     const name = alloc?.Student?.fullname?.toLowerCase() || "";
//     const pid = alloc?.paymentId?.toString() || "";
//     const month = alloc?.studentFee?.month?.toString() || "";
//     const year = alloc?.studentFee?.year?.toString() || "";

//     return (
//       name.includes(searchTerm.toLowerCase()) ||
//       pid.includes(searchTerm) ||
//       month.includes(searchTerm) ||
//       year.includes(searchTerm)
//     );
//   });

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-100 text-red-800 p-4 rounded-md text-center mt-4">
//         Error: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow p-6">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-800">Payment Allocations</h2>
//           <p className="text-sm text-gray-500">Manage allocations and update payment amounts</p>
//         </div>
//         <div className="w-full max-w-xs">
//           <input
//             type="text"
//             placeholder="Search by student, payment ID, month, year..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>

//       {filteredAllocations.length === 0 ? (
//         <div className="text-center py-10 text-gray-500">
//           No matching payment allocations found.
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full border text-sm">
//             <thead className="bg-gray-100 text-gray-600 font-medium">
//               <tr>
//                 <th className="px-4 py-2">#</th>
//                 <th className="px-4 py-2">Student</th>
//                 <th className="px-4 py-2">Payment ID</th>
//                 <th className="px-4 py-2">Amount</th>
//                 <th className="px-4 py-2">Month</th>
//                 <th className="px-4 py-2">Year</th>
//                 <th className="px-4 py-2">Date</th>
//                 <th className="px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredAllocations.map((alloc, index) => (
//                 <tr key={alloc.id} className="border-t">
//                   <td className="px-4 py-2">{index + 1}</td>
//                   <td className="px-4 py-2 text-blue-700">
//                     {alloc?.Student?.fullname || "N/A"}
//                   </td>
//                   <td className="px-4 py-2">{alloc?.paymentId ?? "N/A"}</td>
//                   <td className="px-4 py-2">
//                     {editingId === alloc.id ? (
//                       <input
//                         type="number"
//                         className="border px-2 py-1 rounded w-24"
//                         value={editedAmount}
//                         onChange={(e) => setEditedAmount(e.target.value)}
//                       />
//                     ) : (
//                       formatCurrency(alloc.amount)
//                     )}
//                   </td>
//                   <td className="px-4 py-2">{alloc?.studentFee?.month ?? "-"}</td>
//                   <td className="px-4 py-2">{alloc?.studentFee?.year ?? "-"}</td>
//                   <td className="px-4 py-2">
//                     {alloc?.payment?.date
//                       ? new Date(alloc.payment.date).toLocaleDateString()
//                       : "-"}
//                   </td>
//                   <td className="px-4 py-2">
//                     {editingId === alloc.id ? (
//                       <div className="flex gap-2">
//                         <button
//                           onClick={handleSave}
//                           className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
//                         >
//                           Save
//                         </button>
//                         <button
//                           onClick={handleCancel}
//                           className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     ) : (
//                       <button
//                         onClick={() => handleEdit(alloc.id, alloc.amount)}
//                         className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
//                       >
//                         Edit
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//               <tr className="bg-gray-50 border-t font-bold">
//                 <td className="px-4 py-2 text-right" colSpan={3}>
//                   Total:
//                 </td>
//                 <td className="px-4 py-2">{formatCurrency(totalAllocations)}</td>
//                 <td colSpan={4}></td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentAllocationList;
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  fetchAllPaymentAllocations,
  updatePaymentAllocation,
} from "../../Redux/Payment/paymentSlice";

const PaymentAllocationList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { allocations, loading, error } = useAppSelector((state) => state.payment);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedAmount, setEditedAmount] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    dispatch(fetchAllPaymentAllocations());
  }, [dispatch]);

  const handleEdit = (id: number, currentAmount: string) => {
    setEditingId(id);
    setEditedAmount(currentAmount);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedAmount("");
  };

  const handleSave = () => {
    if (editingId === null) return;
    const newAmount = parseFloat(editedAmount);
    if (isNaN(newAmount) || newAmount < 0) {
      alert("Please enter a valid positive amount");
      return;
    }

    dispatch(updatePaymentAllocation({ id: editingId, amount: newAmount.toString() }))
      .unwrap()
      .then(() => dispatch(fetchAllPaymentAllocations()));

    setEditingId(null);
    setEditedAmount("");
  };

  const formatCurrency = (value: string | number) => {
    const amount = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(amount)
      ? "$0"
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(amount);
  };

  const lowerSearch = searchTerm.toLowerCase();

  const filteredAllocations = allocations.filter((alloc) => {
    const name = alloc?.Student?.fullname?.toLowerCase() || "";
    const pid = alloc?.paymentId?.toString() || "";
    const month = alloc?.studentFee?.month?.toString() || "";
    const year = alloc?.studentFee?.year?.toString() || "";

    return (
      name.includes(lowerSearch) ||
      pid.includes(lowerSearch) ||
      month.includes(lowerSearch) ||
      year.includes(lowerSearch)
    );
  });

  const totalAllocations = filteredAllocations.reduce((sum, alloc) => {
    const amt = parseFloat(alloc.amount);
    return isNaN(amt) ? sum : sum + amt;
  }, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded-md text-center mt-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Payment Allocations</h2>
          <p className="text-sm text-gray-500">Manage allocations and update payment amounts</p>
        </div>
        <div className="w-full max-w-xs">
          <input
            type="text"
            placeholder="Search by student, payment ID, month, year..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {filteredAllocations.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No matching payment allocations found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100 text-gray-600 font-medium">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Student</th>
                <th className="px-4 py-2">Payment ID</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Month</th>
                <th className="px-4 py-2">Year</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAllocations.map((alloc, index) => (
                <tr key={alloc.id} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 text-blue-700">
                    {alloc?.Student?.fullname || "N/A"}
                  </td>
                  <td className="px-4 py-2">{alloc?.paymentId ?? "N/A"}</td>
                  <td className="px-4 py-2">
                    {editingId === alloc.id ? (
                      <input
                        type="number"
                        className="border px-2 py-1 rounded w-24"
                        value={editedAmount}
                        onChange={(e) => setEditedAmount(e.target.value)}
                      />
                    ) : (
                      formatCurrency(alloc.amount)
                    )}
                  </td>
                  <td className="px-4 py-2">{alloc?.studentFee?.month ?? "-"}</td>
                  <td className="px-4 py-2">{alloc?.studentFee?.year ?? "-"}</td>
                  <td className="px-4 py-2">
                    {alloc?.payment?.date
                      ? new Date(alloc.payment.date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    {editingId === alloc.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(alloc.id, alloc.amount)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 border-t font-bold">
                <td className="px-4 py-2 text-right" colSpan={3}>
                  Total:
                </td>
                <td className="px-4 py-2">{formatCurrency(totalAllocations)}</td>
                <td colSpan={4}></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentAllocationList;
