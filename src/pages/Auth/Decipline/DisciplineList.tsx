
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  fetchDisciplines,
  createDiscipline,
  updateDiscipline,
  deleteDiscipline,
  verifyStudent,
  clearStudentVerification,
  Discipline,
} from "../../../Redux/Auth/Decipline/disciplineSlice";
import { fetchStudentList } from "../../../Redux/Auth/Decipline/studentDisciplineSlice";
import { RootState, AppDispatch } from "../../../Redux/store";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2, FiPieChart } from "react-icons/fi";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DisciplinePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { disciplines, studentVerification, loading } = useSelector(
    (state: RootState) => state.discipline
  );
  const { students } = useSelector((state: RootState) => state.studentDiscipline);

  const [editId, setEditId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"form" | "records" | "analytics">("form");

  const formik = useFormik({
    initialValues: {
      studentId: "",
      type: "",
      description: "",
      actionTaken: "",
    },
    validationSchema: yup.object({
      studentId: yup.number().required("Student ID is required"),
      type: yup.string().required("Type is required"),
      description: yup.string().required("Description is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          studentId: +values.studentId,
          type: values.type,
          description: values.description,
          actionTaken: values.actionTaken,
        };

        if (editId) {
          await dispatch(updateDiscipline({ id: editId, updatedData: payload })).unwrap();
          toast.success("Discipline updated successfully");
        } else {
          await dispatch(createDiscipline(payload)).unwrap();
          toast.success("New discipline record created");
        }

        resetForm();
        setEditId(null);
        dispatch(clearStudentVerification());
        dispatch(fetchDisciplines());
        setActiveTab("records");
      } catch (err: any) {
        toast.error(err.message || "Failed to submit record");
      }
    },
  });

  useEffect(() => {
    dispatch(fetchDisciplines());
    dispatch(fetchStudentList());
  }, [dispatch]);

  useEffect(() => {
    const id = Number(formik.values.studentId);
    if (id && !editId) {
      dispatch(verifyStudent(id));
    } else {
      dispatch(clearStudentVerification());
    }
  }, [formik.values.studentId, dispatch, editId]);

  const handleEdit = (d: Discipline) => {
    setEditId(d.id);
    formik.setValues({
      studentId: d.studentId.toString(),
      type: d.type,
      description: d.description,
      actionTaken: d.actionTaken || "",
    });
    setActiveTab("form");
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      try {
        await dispatch(deleteDiscipline(id)).unwrap();
        toast.success("Record deleted successfully");
        dispatch(fetchDisciplines());
      } catch (err: any) {
        toast.error(err.message || "Failed to delete record");
      }
    }
  };

  const typeData = disciplines.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeChartData = {
    labels: Object.keys(typeData),
    datasets: [
      {
        label: "Incidents by Type",
        data: Object.values(typeData),
        backgroundColor: ["#3b82f6", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6"],
        borderWidth: 0,
      },
    ],
  };

 
  const formatDate = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Not recorded";


  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Discipline Management</h1>
        <p className="text-gray-500 mt-1">Track and manage student disciplinary records</p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b border-gray-200 mb-6">
        {[
          { id: "form", label: editId ? "Edit Record" : "New Record" },
          { id: "records", label: "Records" },
          { id: "analytics", label: "Analytics" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-1 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Section */}
      {activeTab === "form" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-lg font-semibold mb-4">
            {editId ? "Edit Discipline Record" : "Create New Record"}
          </h2>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Student ID Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <input
                  type="number"
                  name="studentId"
                  value={formik.values.studentId}
                  onChange={formik.handleChange}
                  placeholder="Enter student ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {formik.errors.studentId && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.studentId}</p>
                )}
              </div>

              {/* Student Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Or select student
                </label>
                <select
                  onChange={(e) =>
                    formik.setFieldValue("studentId", Number(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formik.values.studentId || ""}
                >
                  <option value="" disabled>
                    Select student
                  </option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullname} (ID: {s.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Incident Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Incident Type
              </label>
              <select
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select incident type</option>
                <option value="Late Arrival">Late Arrival</option>
                <option value="Disruption">Disruption</option>
                <option value="Dishonesty">Dishonesty</option>
                <option value="Behavior">Behavior</option>
              </select>
              {formik.errors.type && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.type}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe the incident..."
              />
              {formik.errors.description && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.description}</p>
              )}
            </div>

            {/* Action Taken */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Action Taken (Optional)
              </label>
              <input
                name="actionTaken"
                value={formik.values.actionTaken}
                onChange={formik.handleChange}
                placeholder="e.g. Verbal warning, detention, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Verification Status */}
            {studentVerification && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <span className="text-green-700 text-sm">
                  ✅ Verified: {studentVerification.fullname}
                </span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
              >
                {loading ? "Processing..." : editId ? "Update Record" : "Create Record"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Records Section */}
      {activeTab === "records" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Incident Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action Taken
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {disciplines.length > 0 ? (
                  disciplines.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {d.student?.fullname || "Unknown"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{d.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{d.actionTaken || "—"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(d.recordedAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleEdit(d)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <FiEdit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(d.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No discipline records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Analytics Section */}
      {activeTab === "analytics" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center mb-6">
            <FiPieChart className="h-5 w-5 text-indigo-500 mr-2" />
            <h2 className="text-lg font-semibold">Disciplinary Incidents by Type</h2>
          </div>
          <div className="h-64">
            <Pie
              data={typeChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DisciplinePage;
