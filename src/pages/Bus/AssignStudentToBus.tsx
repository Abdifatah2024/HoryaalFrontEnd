import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../Redux/store";
import { assignStudentToBus, fetchAllBuses } from "../../Redux/Auth/busFeeSlice";

const AssignStudentToBus: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { buses, loading } = useSelector((state: RootState) => state.busFee);

  const [studentId, setStudentId] = useState(0);
  const [busId, setBusId] = useState<number | "">("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchAllBuses());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !busId) return;
    dispatch(assignStudentToBus({ studentId, busId: Number(busId) }))
      .unwrap()
      .then(() => {
        setMessage("Student successfully assigned to bus");
        setStudentId(0);
        setBusId("");
      })
      .catch((err) => setMessage(err));
  };

  return (
    <div className="max-w-xl mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Assign Student to Bus</h2>

      {message && <p className="mb-4 text-green-600 font-medium">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Enter Student ID"
          value={studentId || ""}
          onChange={(e) => setStudentId(Number(e.target.value))}
          className="w-full p-2 border rounded"
          required
        />

        <select
          value={busId}
          onChange={(e) => {
  const value = e.target.value;
  setBusId(value === "" ? "" : Number(value));
}}

          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Bus</option>
          {buses.map((bus) => (
            <option key={bus.id} value={bus.id}>
              {bus.name} - {bus.route}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Assign
        </button>
      </form>

      {loading && <p className="mt-4 text-gray-600">Loading buses...</p>}
    </div>
  );
};

export default AssignStudentToBus;
