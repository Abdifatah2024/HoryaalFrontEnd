import React, { useEffect, useState } from "react";
import {
  createAdvance,
  deleteAdvance,
  getAllAdvances,
  updateAdvance,
  verifyEmployee,
  clearEmployeeVerification,
} from "../../Redux/Payment/advanceSlice";
import {
  getMonthlyBalance,
} from "../../Redux/Expense/ExpenseSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  FiPlus,
  FiEdit,
  FiTrash,
  FiLoader,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { format } from "date-fns";
import { Advance } from "../../types/Login";

const EmployeeAdvancePage: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    advances,
    loading,
    error,
    totalCount,
    employeeVerification,
    summary1
  } = useAppSelector((state) => state.paymentAdvance);

  const { incomeSummary } = useAppSelector((state) => state.expenses);

  const [form, setForm] = useState({
    employeeId: "",
    amount: "",
    reason: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    month: String(new Date().getMonth() + 1),
    year: String(new Date().getFullYear()),
  });

  useEffect(() => {
    dispatch(
      getAllAdvances({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        ...filters,
      })
    );
  }, [dispatch, currentPage, itemsPerPage, searchTerm, filters]);

  useEffect(() => {
    if (filters.month && filters.year) {
      dispatch(
        getMonthlyBalance({
          month: Number(filters.month),
          year: Number(filters.year),
        })
      );
    }
  }, [dispatch, filters]);

  useEffect(() => {
    if (form.employeeId) {
      const employeeId = Number(form.employeeId);
      if (!isNaN(employeeId)) {
        dispatch(verifyEmployee(employeeId));
      }
    } else {
      dispatch(clearEmployeeVerification());
    }
  }, [form.employeeId, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      employeeId: Number(form.employeeId),
      amount: Number(form.amount),
    };

    if (editingId) {
      dispatch(updateAdvance({ id: editingId, data: payload }));
      setEditingId(null);
    } else {
      dispatch(createAdvance(payload));
    }

    resetForm();
  };

  const resetForm = () => {
    setForm({
      employeeId: "",
      amount: "",
      reason: "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
  };

  const handleEdit = (advance: Advance) => {
    setEditingId(advance.id);
    setForm({
      employeeId: advance.employeeId.toString(),
      amount: advance.amount.toString(),
      reason: advance.reason || "",
      month: advance.month,
      year: advance.year,
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this advance?")) {
      dispatch(deleteAdvance(id));
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Employee Advance Management</h1>
        </header>

        {/* ✅ Monthly Summary from incomeSummary */}
        {incomeSummary && (
          <section className="bg-gray-50 p-4 rounded shadow mb-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <h4 className="text-sm text-gray-500">Total Income</h4>
              <p className="text-xl font-bold">${incomeSummary.totalIncome}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500">Total Advance</h4>
              <p className="text-xl font-bold">${incomeSummary.totalAdvance}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500">Total Expense</h4>
              <p className="text-xl font-bold">${incomeSummary.totalExpense}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500">Used</h4>
              <p className="text-xl font-bold">${incomeSummary.used}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500">Remaining</h4>
              <p className="text-xl font-bold">${incomeSummary.remaining}</p>
            </div>
          </section>
        )}

        {/* Filters */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Search by employee name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-3 py-2 rounded w-full md:w-1/3"
            />
            <select
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
              className="border px-3 py-2 rounded"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
            <input
              name="year"
              type="number"
              value={filters.year}
              onChange={handleFilterChange}
              className="border px-3 py-2 rounded"
              placeholder="Year"
            />
          </div>
        </section>

        {/* Advance Form */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                placeholder="Employee ID"
                value={form.employeeId}
                onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                className="border px-3 py-2 rounded"
                required
              />
              <input
                placeholder="Amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                type="number"
                className="border px-3 py-2 rounded"
                required
              />
              <select
                value={form.month}
                onChange={(e) => setForm({ ...form, month: +e.target.value })}
                className="border px-3 py-2 rounded"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: +e.target.value })}
                className="border px-3 py-2 rounded"
                placeholder="Year"
              />
            </div>
            <input
              placeholder="Reason (optional)"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="border px-3 py-2 rounded w-full"
            />
            <div className="flex justify-end gap-4">
              {editingId && (
                <button type="button" onClick={resetForm} className="text-gray-600 border px-4 py-2 rounded">
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                {editingId ? "Update Advance" : "Add Advance"}
              </button>
            </div>
          </form>
        </section>

        {/* Advance List */}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Employee</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Amount</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Period</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Reason</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Date Issued</th>
                  <th className="px-4 py-2 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {advances.map((adv) => (
                  <tr key={adv.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{adv.employee.fullName}</td>
                    <td className="px-4 py-2">${adv.amount.toFixed(2)}</td>
                    <td className="px-4 py-2">
                      {new Date(adv.year, adv.month - 1).toLocaleString("default", { month: "short" })} {adv.year}
                    </td>
                    <td className="px-4 py-2">{adv.reason || "-"}</td>
                    <td className="px-4 py-2">{format(new Date(adv.dateIssued), "MMM dd, yyyy")}</td>
                    <td className="px-4 py-2 text-right">
                      <button onClick={() => handleEdit(adv)} className="text-indigo-600 hover:underline mr-3">
                        <FiEdit />
                      </button>
                      <button onClick={() => handleDelete(adv.id)} className="text-red-600 hover:underline">
                        <FiTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Advance Summary */}
        {summary1 && (
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Advance Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Employee</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">{summary1.employee?.name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Advanced By</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">{summary1.advancesBy}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">${summary1.totalAdvance.toFixed(2)}</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default EmployeeAdvancePage;

