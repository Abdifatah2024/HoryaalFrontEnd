// import React, { useEffect, useState } from "react";
// import {
//   createExpense,
//   deleteExpense,
//   getAllExpenses,
//   updateExpense,
//   Expense,
// } from "../../Redux/Expense/ExpenseSlice";
// import { useAppDispatch, useAppSelector } from "../../Redux/store";
// import {
//   FiPlus,
//   FiEdit,
//   FiTrash,
//   FiLoader,
//   FiSearch,
//   FiAlertCircle,
// } from "react-icons/fi";
// import { format } from "date-fns";

// const ExpensesPage: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { expenses, summary, loading, error, totalCount } = useAppSelector(
//     (state) => state.expenses
//   );

//   const [form, setForm] = useState<Omit<Expense, "id" | "userId">>({
//     category: "",
//     amount: 0,
//     date: new Date().toISOString().split("T")[0],
//     description: "",
//     paymentMethod: "",
//     approvedBy: "",
//     receiptUrl: "",
//   });

//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [filters, setFilters] = useState({ month: "", year: "" });
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   useEffect(() => {
//     dispatch(
//       getAllExpenses({
//         page: currentPage,
//         limit: itemsPerPage,
//         ...filters,
//         search,
//       })
//     );
//   }, [dispatch, currentPage, filters, search]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const payload = {
//       ...form,
//       amount: Number(form.amount),
//       date: new Date(form.date).toISOString(),
//     };

//     if (editingId) {
//       dispatch(updateExpense({ id: editingId, data: payload }));
//       setEditingId(null);
//     } else {
//       dispatch(createExpense(payload));
//     }

//     resetForm();
//   };

//   const resetForm = () => {
//     setForm({
//       category: "",
//       amount: 0,
//       date: new Date().toISOString().split("T")[0],
//       description: "",
//       paymentMethod: "",
//       approvedBy: "",
//       receiptUrl: "",
//     });
//   };

//   const handleEdit = (expense: Expense) => {
//     setEditingId(expense.id);
//     setForm({
//       category: expense.category,
//       amount: expense.amount,
//       date: expense.date.split("T")[0],
//       description: expense.description || "",
//       paymentMethod: expense.paymentMethod,
//       approvedBy: expense.approvedBy || "",
//       receiptUrl: expense.receiptUrl || "",
//     });
//   };

//   const handleDelete = (id: number) => {
//     if (window.confirm("Delete this expense?")) {
//       dispatch(deleteExpense(id));
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">School Expense Management</h1>

//       {/* Form */}
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded shadow mb-6 space-y-4"
//       >
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//           <input
//             type="text"
//             placeholder="Category (e.g., Rent, Food)"
//             value={form.category}
//             onChange={(e) => setForm({ ...form, category: e.target.value })}
//             required
//             className="border p-2 rounded w-full"
//           />
//           <input
//             type="number"
//             placeholder="Amount"
//             min="0"
//             step="0.01"
//             value={form.amount}
//             onChange={(e) => setForm({ ...form, amount: +e.target.value })}
//             required
//             className="border p-2 rounded w-full"
//           />
//           <input
//             type="date"
//             value={form.date}
//             onChange={(e) => setForm({ ...form, date: e.target.value })}
//             required
//             className="border p-2 rounded w-full"
//           />
//           <input
//             type="text"
//             placeholder="Payment Method"
//             value={form.paymentMethod}
//             onChange={(e) =>
//               setForm({ ...form, paymentMethod: e.target.value })
//             }
//             required
//             className="border p-2 rounded w-full"
//           />
//           <input
//             type="text"
//             placeholder="Approved By"
//             value={form.approvedBy}
//             onChange={(e) => setForm({ ...form, approvedBy: e.target.value })}
//             className="border p-2 rounded w-full"
//           />
//           <input
//             type="text"
//             placeholder="Receipt URL"
//             value={form.receiptUrl}
//             onChange={(e) => setForm({ ...form, receiptUrl: e.target.value })}
//             className="border p-2 rounded w-full"
//           />
//         </div>

//         <textarea
//           placeholder="Description (optional)"
//           value={form.description}
//           onChange={(e) => setForm({ ...form, description: e.target.value })}
//           className="border p-2 rounded w-full"
//         />

//         <div className="flex justify-end">
//           {editingId && (
//             <button
//               type="button"
//               onClick={() => {
//                 setEditingId(null);
//                 resetForm();
//               }}
//               className="mr-4 px-4 py-2 border rounded text-gray-600"
//             >
//               Cancel
//             </button>
//           )}
//           <button
//             type="submit"
//             className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center"
//             disabled={loading}
//           >
//             {loading ? (
//               <FiLoader className="animate-spin mr-2" />
//             ) : (
//               <FiPlus className="mr-2" />
//             )}
//             {editingId ? "Update Expense" : "Add Expense"}
//           </button>
//         </div>
//       </form>

//       {/* Summary */}
//       {summary && (
//         <div className="bg-gray-100 p-4 rounded shadow mb-6 grid md:grid-cols-5 gap-4">
//           <div>
//             <h4 className="text-sm text-gray-500">Total Income</h4>
//             <p className="text-xl font-bold">${summary.totalIncome}</p>
//           </div>
//           <div>
//             <h4 className="text-sm text-gray-500">Total Advance</h4>
//             <p className="text-xl font-bold">${summary.totalAdvance}</p>
//           </div>
//           <div>
//             <h4 className="text-sm text-gray-500">Total Expense</h4>
//             <p className="text-xl font-bold">${summary.totalExpense}</p>
//           </div>
//           <div>
//             <h4 className="text-sm text-gray-500">Used</h4>
//             <p className="text-xl font-bold">${summary.used}</p>
//           </div>
//           <div>
//             <h4 className="text-sm text-gray-500">Remaining</h4>
//             <p className="text-xl font-bold">${summary.remaining}</p>
//           </div>
//         </div>
//       )}

//       {/* Filters & Search */}
//       <div className="flex gap-4 items-center mb-4">
//         <input
//           type="text"
//           placeholder="Search..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border px-3 py-2 rounded w-full md:w-1/3"
//         />
//         <select
//           className="border px-3 py-2 rounded"
//           value={filters.month}
//           onChange={(e) => setFilters({ ...filters, month: e.target.value })}
//         >
//           <option value="">All Months</option>
//           {[...Array(12)].map((_, i) => (
//             <option key={i + 1} value={i + 1}>
//               {new Date(0, i).toLocaleString("default", { month: "long" })}
//             </option>
//           ))}
//         </select>
//         <input
//           type="number"
//           placeholder="Year"
//           className="border px-3 py-2 rounded"
//           value={filters.year}
//           onChange={(e) => setFilters({ ...filters, year: e.target.value })}
//         />
//       </div>

//       {/* Table */}
//       {loading ? (
//         <div className="flex justify-center items-center py-12">
//           <FiLoader className="animate-spin text-4xl text-indigo-600" />
//         </div>
//       ) : error ? (
//         <div className="bg-red-100 text-red-700 p-4 rounded flex items-center gap-2">
//           <FiAlertCircle />
//           {error}
//         </div>
//       ) : (
//         <div className="overflow-x-auto bg-white shadow rounded">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Category</th>
//                 <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount</th>
//                 <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
//                 <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Payment</th>
//                 <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Approved By</th>
//                 <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {expenses.map((exp) => (
//                 <tr key={exp.id} className="hover:bg-gray-50">
//                   <td className="px-4 py-2 text-sm">{exp.category}</td>
//                   <td className="px-4 py-2 text-sm">${exp.amount.toFixed(2)}</td>
//                   <td className="px-4 py-2 text-sm">
//                     {format(new Date(exp.date), "MMM dd, yyyy")}
//                   </td>
//                   <td className="px-4 py-2 text-sm">{exp.paymentMethod}</td>
//                   <td className="px-4 py-2 text-sm">{exp.approvedBy || "-"}</td>
//                   <td className="px-4 py-2 text-right">
//                     <button
//                       onClick={() => handleEdit(exp)}
//                       className="text-indigo-600 hover:underline mr-4"
//                     >
//                       <FiEdit />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(exp.id)}
//                       className="text-red-600 hover:underline"
//                     >
//                       <FiTrash />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               {expenses.length === 0 && (
//                 <tr>
//                   <td colSpan={6} className="text-center py-4 text-sm text-gray-500">
//                     No expenses found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExpensesPage;
import React, { useEffect, useState } from "react";
import {
  createExpense,
  deleteExpense,
  getAllExpenses,
  updateExpense,
  getMonthlyBalance,
  Expense,
} from "../../Redux/Expense/ExpenseSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  FiPlus,
  FiEdit,
  FiTrash,
  FiLoader,
  FiSearch,
  FiAlertCircle,
} from "react-icons/fi";
import { format } from "date-fns";

const ExpensesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { expenses, summary, loading, error, totalCount } = useAppSelector(
    (state) => state.expenses
  );

  const [form, setForm] = useState<Omit<Expense, "id" | "userId">>({
    category: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    description: "",
    paymentMethod: "",
    approvedBy: "",
    receiptUrl: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [filters, setFilters] = useState({ month: "", year: "" });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(
      getAllExpenses({
        page: currentPage,
        limit: itemsPerPage,
        ...filters,
        search,
      })
    );
  }, [dispatch, currentPage, filters, search]);

  // Call monthly balance on initial load
  useEffect(() => {
    const now = new Date();
    dispatch(
      getMonthlyBalance({
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      })
    );
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      amount: Number(form.amount),
      date: new Date(form.date).toISOString(),
    };

    if (editingId) {
      dispatch(updateExpense({ id: editingId, data: payload }));
      setEditingId(null);
    } else {
      dispatch(createExpense(payload));
    }

    resetForm();
  };

  const resetForm = () => {
    setForm({
      category: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      description: "",
      paymentMethod: "",
      approvedBy: "",
      receiptUrl: "",
    });
  };

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setForm({
      category: expense.category,
      amount: expense.amount,
      date: expense.date.split("T")[0],
      description: expense.description || "",
      paymentMethod: expense.paymentMethod,
      approvedBy: expense.approvedBy || "",
      receiptUrl: expense.receiptUrl || "",
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this expense?")) {
      dispatch(deleteExpense(id));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">School Expense Management</h1>

      {/* Summary */}
      {summary && (
        <div className="bg-gray-100 p-4 rounded shadow mb-6 grid md:grid-cols-5 gap-4">
          <div>
            <h4 className="text-sm text-gray-500">Total Income</h4>
            <p className="text-xl font-bold">${summary.totalIncome}</p>
          </div>
          <div>
            <h4 className="text-sm text-gray-500">Total Advance</h4>
            <p className="text-xl font-bold">${summary.totalAdvance}</p>
          </div>
          <div>
            <h4 className="text-sm text-gray-500">Total Expense</h4>
            <p className="text-xl font-bold">${summary.totalExpense}</p>
          </div>
          <div>
            <h4 className="text-sm text-gray-500">Used</h4>
            <p className="text-xl font-bold">${summary.used}</p>
          </div>
          <div>
            <h4 className="text-sm text-gray-500">Remaining</h4>
            <p className="text-xl font-bold">${summary.remaining}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow mb-6 space-y-4"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Category (e.g., Rent, Food)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Amount"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: +e.target.value })}
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Payment Method"
            value={form.paymentMethod}
            onChange={(e) =>
              setForm({ ...form, paymentMethod: e.target.value })
            }
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Approved By"
            value={form.approvedBy}
            onChange={(e) =>
              setForm({ ...form, approvedBy: e.target.value })
            }
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Receipt URL"
            value={form.receiptUrl}
            onChange={(e) =>
              setForm({ ...form, receiptUrl: e.target.value })
            }
            className="border p-2 rounded w-full"
          />
        </div>

        <textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 rounded w-full"
        />

        <div className="flex justify-end">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                resetForm();
              }}
              className="mr-4 px-4 py-2 border rounded text-gray-600"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center"
            disabled={loading}
          >
            {loading ? (
              <FiLoader className="animate-spin mr-2" />
            ) : (
              <FiPlus className="mr-2" />
            )}
            {editingId ? "Update Expense" : "Add Expense"}
          </button>
        </div>
      </form>

      {/* Filters & Search */}
      <div className="flex gap-4 items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/3"
        />
        <select
          className="border px-3 py-2 rounded"
          value={filters.month}
          onChange={(e) => setFilters({ ...filters, month: e.target.value })}
        >
          <option value="">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Year"
          className="border px-3 py-2 rounded"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        />
      </div>

      {/* Expense List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <FiLoader className="animate-spin text-4xl text-indigo-600" />
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded flex items-center gap-2">
          <FiAlertCircle />
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Payment</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Approved By</th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{exp.category}</td>
                  <td className="px-4 py-2 text-sm">${exp.amount.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm">
                    {format(new Date(exp.date), "MMM dd, yyyy")}
                  </td>
                  <td className="px-4 py-2 text-sm">{exp.paymentMethod}</td>
                  <td className="px-4 py-2 text-sm">{exp.approvedBy || "-"}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="text-indigo-600 hover:underline mr-4"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="text-red-600 hover:underline"
                    >
                      <FiTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-sm text-gray-500">
                    No expenses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;
