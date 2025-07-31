import React, { useState } from "react";
import { useAppDispatch } from "../../Redux/store";
import { payEmployeeRemainingSalaries } from "../../Redux/Epmloyee/payRemainSalarySlice"; // Adjust if it's in another slice
import { toast } from "react-toastify";

const PayRemainingSalaries: React.FC = () => {
  const dispatch = useAppDispatch();
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!month || !year) {
      toast.error("Please select both month and year");
      return;
    }

    try {
      setLoading(true);
      const resultAction = await dispatch(
        payEmployeeRemainingSalaries({ month, year })
      );

      if (payEmployeeRemainingSalaries.fulfilled.match(resultAction)) {
        toast.success("Remaining salaries paid successfully!");
      } else {
        throw new Error(resultAction.payload || "Payment failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Error processing salary payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-6 max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-bold mb-2">Pay Remaining Salaries</h2>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Month</label>
          <select
            className="w-full mt-1 border border-gray-300 rounded p-2"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m} - {new Date(0, m - 1).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input
            type="number"
            className="w-full mt-1 border border-gray-300 rounded p-2"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay Salaries"}
        </button>
      </div>
    </div>
  );
};

export default PayRemainingSalaries;
