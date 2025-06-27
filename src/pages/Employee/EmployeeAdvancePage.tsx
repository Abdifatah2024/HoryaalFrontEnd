import React, { useEffect, useState } from "react";
import {
  createAdvance,
  deleteAdvance,
  getAllAdvances,
  updateAdvance,
  verifyEmployee,
  clearEmployeeVerification,
} from "../../Redux/Payment/advanceSlice";
import toast from "react-hot-toast";
import { getMonthlyBalance } from "../../Redux/Expense/ExpenseSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { FiEdit, FiTrash } from "react-icons/fi";
import { format } from "date-fns";
import { Advance } from "../../types/Login";
import axios from "axios";
import { BASE_API_URL } from "../../Constant"; // make sure this is defined properly

const EmployeeAdvancePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    advances,
   
    summary1,
  } = useAppSelector((state) => state.paymentAdvance);
  const { incomeSummary } = useAppSelector((state) => state.expenses);

  const [employeeList, setEmployeeList] = useState<
    { id: number; fullName: string }[]
  >([]);
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

  // ✅ Fetch employee list for dropdown
  useEffect(() => {
    axios
      .get(`${BASE_API_URL}/user/employees`)
      .then((res) => {
        setEmployeeList(res.data.employees || []);
      })
      .catch((err) => {
        console.error("Failed to fetch employees:", err);
        toast.error("Failed to fetch employee list");
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      employeeId: Number(form.employeeId),
      amount: Number(form.amount),
    };

    try {
      if (editingId) {
        await dispatch(updateAdvance({ id: editingId, data: payload })).unwrap();
        toast.success("Advance updated successfully");
        setEditingId(null);
      } else {
        await dispatch(createAdvance(payload)).unwrap();
        toast.success("Advance created successfully");
      }
      resetForm();
    } catch (err: any) {
      const errorMessage = err?.message || err?.data?.message || "Failed to submit";
      toast.error(errorMessage);
    }
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

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this advance?")) {
      try {
        await dispatch(deleteAdvance(id)).unwrap();
        toast.success("Advance deleted");
      } catch (err: any) {
        const errorMessage = err?.message || err?.data?.message || "Failed to delete";
        toast.error(errorMessage);
      }
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Employee Advance Management</h1>

        {/* Summary */}
        {incomeSummary && (
          <section className="bg-gray-50 p-4 rounded shadow mb-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div><h4>Total Income</h4><p>${incomeSummary.totalIncome}</p></div>
            <div><h4>Total Advance</h4><p>${incomeSummary.totalAdvance}</p></div>
            <div><h4>Total Expense</h4><p>${incomeSummary.totalExpense}</p></div>
            <div><h4>Used</h4><p>${incomeSummary.used}</p></div>
            <div><h4>Remaining</h4><p>${incomeSummary.remaining}</p></div>
          </section>
        )}

        {/* Filters */}
        <section className="mb-8">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded mr-2"
          />
          <select name="month" value={filters.month} onChange={handleFilterChange} className="border px-3 py-2 rounded mr-2">
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
        </section>

        {/* Form */}
        <section className="bg-white p-6 shadow rounded mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={form.employeeId}
                onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                className="border px-3 py-2 rounded"
                required
              >
                <option value="">-- Select Employee --</option>
                {employeeList.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName}
                  </option>
                ))}
              </select>
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
              />
            </div>
            <input
              placeholder="Reason (optional)"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="border px-3 py-2 rounded w-full"
            />
            <div className="text-right">
              {editingId && (
                <button type="button" onClick={resetForm} className="text-gray-600 mr-2">
                  Cancel
                </button>
              )}
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
                {editingId ? "Update" : "Add"} Advance
              </button>
            </div>
          </form>
        </section>

        {/* Advance List */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Employee</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Month</th>
                <th className="px-4 py-2">Reason</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {advances.map((adv) => (
                <tr key={adv.id} className="hover:bg-gray-50">
                  <td>{adv.employee?.fullName || "Unknown"}</td>

                  <td className="px-4 py-2">${adv.amount}</td>
                  <td className="px-4 py-2">
                    {new Date(adv.year, adv.month - 1).toLocaleString("default", { month: "short" })} {adv.year}
                  </td>
                  <td className="px-4 py-2">{adv.reason || "-"}</td>
                  <td>
  {adv.dateIssued
    ? format(new Date(adv.dateIssued), "MMM dd, yyyy")
    : "N/A"}
</td>

                  <td className="px-4 py-2 text-right">
                    <button onClick={() => handleEdit(adv)} className="text-blue-600 mr-3"><FiEdit /></button>
                    <button onClick={() => handleDelete(adv.id)} className="text-red-600"><FiTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary 1 */}
        {summary1 && (
          <div className="mt-6 bg-white rounded shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Advance Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><p className="text-gray-500">Employee</p><p>{summary1.employee?.name}</p></div>
              <div><p className="text-gray-500">Advanced By</p><p>{summary1.advancesBy}</p></div>
              <div><p className="text-gray-500">Total Advance</p><p>${summary1.totalAdvance.toFixed(2)}</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeAdvancePage;
