import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  registerStudents,
  clearMultiStudentState,
} from "../../Redux/Auth/RegisterMultiStudentsSlice";
import { NewStudentInput } from "../../types/Register";
import { toast } from "react-toastify";

const classOptions = [
  { id: 1, name: "1A" }, { id: 2, name: "1B" }, { id: 3, name: "1C" },
  { id: 4, name: "1D" }, { id: 5, name: "1E" }, { id: 6, name: "1G" },
  { id: 7, name: "2A" }, { id: 8, name: "2B" }, { id: 9, name: "2C" },
  { id: 10, name: "2D" }, { id: 11, name: "2E" }, { id: 12, name: "2F" },
  { id: 13, name: "3A" }, { id: 14, name: "3B" }, { id: 15, name: "3C" },
  { id: 16, name: "3D" }, { id: 17, name: "3E" }, { id: 18, name: "4A" },
  { id: 19, name: "4B" }, { id: 20, name: "4C" }, { id: 21, name: "4D" },
];

const RegisterMultipleStudents = () => {
  const dispatch = useAppDispatch();
  const { loading, error, students } = useAppSelector(
    (state) => state.registerStudents
  );

  const initialStudentState: Omit<NewStudentInput, "Amount"> = {
    firstname: "",
    middlename: "",
    lastname: "",
    classId: 0,
    phone: "",
    phone2: "",
    gender: "",
    Age: 0,
    fee: 0,
    motherName: "",
    address: "",
    previousSchool: "",
    bus: "",
  };

  const [formData, setFormData] = useState(initialStudentState);
  const [addedStudents, setAddedStudents] = useState<typeof formData[]>([]);

  const hasShownSuccess = useRef(false);
  const hasShownError = useRef(false);

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddStudent = () => {
    const requiredFields = ["firstname", "lastname", "phone", "gender", "classId"];
    const isValid = requiredFields.every((key) => {
      const value = (formData as any)[key];
      return value !== "" && value !== 0;
    });

    if (!isValid) {
      toast.error("Please fill all required fields");
      return;
    }

    setAddedStudents((prev) => [...prev, formData]);
    setFormData({ ...initialStudentState });
  };

  const handleRegisterAll = async () => {
    if (addedStudents.length === 0) {
      toast.error("No students to register");
      return;
    }

    hasShownSuccess.current = false;
    hasShownError.current = false;
    await dispatch(registerStudents(addedStudents));
  };

  useEffect(() => {
    if (students.length > 0 && !hasShownSuccess.current) {
      hasShownSuccess.current = true;
      toast.success("Students registered successfully!");
      setAddedStudents([]);
      dispatch(clearMultiStudentState());
    }

    if (error && !hasShownError.current) {
      hasShownError.current = true;
      toast.error(error);
      dispatch(clearMultiStudentState());
    }
  }, [students, error, dispatch]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Add Student to List</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input placeholder="First Name *" value={formData.firstname} onChange={(e) => handleChange("firstname", e.target.value)} className="border rounded px-3 py-2" />
          <input placeholder="Middle Name" value={formData.middlename} onChange={(e) => handleChange("middlename", e.target.value)} className="border rounded px-3 py-2" />
          <input placeholder="Last Name *" value={formData.lastname} onChange={(e) => handleChange("lastname", e.target.value)} className="border rounded px-3 py-2" />
          <input placeholder="Phone *" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} className="border rounded px-3 py-2" />
          <input placeholder="Phone 2" value={formData.phone2} onChange={(e) => handleChange("phone2", e.target.value)} className="border rounded px-3 py-2" />
          <select value={formData.classId} onChange={(e) => handleChange("classId", Number(e.target.value))} className="border rounded px-3 py-2">
            <option value={0}>Select Class *</option>
            {classOptions.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
          <select value={formData.gender} onChange={(e) => handleChange("gender", e.target.value)} className="border rounded px-3 py-2">
            <option value="">Select Gender *</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input placeholder="Mother Name" value={formData.motherName} onChange={(e) => handleChange("motherName", e.target.value)} className="border rounded px-3 py-2" />
          <input placeholder="Address" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} className="border rounded px-3 py-2" />
          <input placeholder="Previous School" value={formData.previousSchool} onChange={(e) => handleChange("previousSchool", e.target.value)} className="border rounded px-3 py-2" />
          <input placeholder="Bus" value={formData.bus} onChange={(e) => handleChange("bus", e.target.value)} className="border rounded px-3 py-2" />
          <input type="number" placeholder="Age" value={formData.Age || ""} onChange={(e) => handleChange("Age", Number(e.target.value))} className="border rounded px-3 py-2" />
          <input type="number" placeholder="Fee" value={formData.fee || ""} onChange={(e) => handleChange("fee", Number(e.target.value))} className="border rounded px-3 py-2" />
        </div>

        <div className="flex justify-end space-x-3">
          <button onClick={handleAddStudent} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">➕ Add to List</button>
        </div>
      </div>

      {/* Table */}
      {addedStudents.length > 0 && (
        <div className="bg-white mt-6 shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Students to Register ({addedStudents.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm border">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 border">Full Name</th>
                  <th className="px-4 py-2 border">Phone</th>
                  <th className="px-4 py-2 border">Phone 2</th>
                  <th className="px-4 py-2 border">Mother</th>
                  <th className="px-4 py-2 border">Address</th>
                  <th className="px-4 py-2 border">School</th>
                  <th className="px-4 py-2 border">Bus</th>
                  <th className="px-4 py-2 border">Gender</th>
                  <th className="px-4 py-2 border">Class</th>
                  <th className="px-4 py-2 border">Age</th>
                  <th className="px-4 py-2 border">Fee</th>
                </tr>
              </thead>
              <tbody>
                {addedStudents.map((s, i) => (
                  <tr key={i} className="text-center">
                    <td className="px-4 py-2 border">{`${s.firstname} ${s.middlename} ${s.lastname}`}</td>
                    <td className="px-4 py-2 border">{s.phone}</td>
                    <td className="px-4 py-2 border">{s.phone2 || "-"}</td>
                    <td className="px-4 py-2 border">{s.motherName || "-"}</td>
                    <td className="px-4 py-2 border">{s.address || "-"}</td>
                    <td className="px-4 py-2 border">{s.previousSchool || "-"}</td>
                    <td className="px-4 py-2 border">{s.bus || "-"}</td>
                    <td className="px-4 py-2 border">{s.gender}</td>
                    <td className="px-4 py-2 border">{classOptions.find(c => c.id === s.classId)?.name}</td>
                    <td className="px-4 py-2 border">{s.Age || "-"}</td>
                    <td className="px-4 py-2 border">{s.fee || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-right">
            <button
              onClick={handleRegisterAll}
              disabled={loading}
              className={`px-5 py-2 rounded text-white ${
                loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Registering..." : "Register All Students"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterMultipleStudents;
