import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import {
  updateAttendance,
  deleteAttendance,
  verifyStudent,
  clearAttendanceState,
  clearStudentVerification,
} from "../../Redux/Auth/DeleteAndUpdateSlice";
import toast from "react-hot-toast";
import { useEffect } from "react";

const AttendanceForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    loading, 
    error, 
    success, 
    studentVerification 
  } = useSelector((state: RootState) => state.attend);

  const formik = useFormik({
    initialValues: {
      studentId: "",
      attendanceId: "",
      present: false,
      remark: "",
    },
    validationSchema: yup.object({
      studentId: yup.number().required("Student ID is required"),
      attendanceId: yup.number().required("Attendance ID is required"),
      remark: yup.string().required("Remark is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await dispatch(
          updateAttendance({
            studentId: +values.studentId,
            present: values.present,
            remark: values.remark,
            attendanceId: +values.attendanceId,
          })
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Verify student when studentId changes
  useEffect(() => {
    const id = Number(formik.values.studentId);
    if (id) {
      dispatch(verifyStudent(id));
    } else {
      dispatch(clearStudentVerification());
    }
  }, [formik.values.studentId, dispatch]);

  const handleDelete = async () => {
    const id = Number(formik.values.attendanceId);
    if (!id) return toast.error("Attendance ID required");
    await dispatch(deleteAttendance(id));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAttendanceState());
    }
    if (success) {
      toast.success(success);
      dispatch(clearAttendanceState());
      formik.resetForm();
    }
  }, [error, success, dispatch]);

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Attendance Management</h2>
      
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Attendance ID Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attendance ID
          </label>
          <input
            type="number"
            name="attendanceId"
            value={formik.values.attendanceId}
            onChange={formik.handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter attendance ID"
          />
          {formik.errors.attendanceId && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.attendanceId}</p>
          )}
        </div>

        {/* Student ID Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Student ID
          </label>
          <input
            type="number"
            name="studentId"
            value={formik.values.studentId}
            onChange={formik.handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter student ID"
          />
          {formik.errors.studentId && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.studentId}</p>
          )}
        </div>

        {/* Student Verification Display */}
        {studentVerification ? (
          <div className="p-3 bg-green-50 rounded-md border border-green-100">
            <p className="text-sm text-green-800">
              Verified: <span className="font-semibold">{studentVerification.fullname}</span>
            </p>
          </div>
        ) : formik.values.studentId ? (
          <div className="p-3 bg-yellow-50 rounded-md border border-yellow-100">
            <p className="text-sm text-yellow-800">Verifying student...</p>
          </div>
        ) : null}

        {/* Present/Absent Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="present"
            value={formik.values.present.toString()}
            onChange={(e) => formik.setFieldValue("present", e.target.value === "true")}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="true">Present</option>
            <option value="false">Absent</option>
          </select>
        </div>

        {/* Remark Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Remark
          </label>
          <input
            type="text"
            name="remark"
            value={formik.values.remark}
            onChange={formik.handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter remarks"
          />
          {formik.errors.remark && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.remark}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4">
          <button
            type="submit"
            disabled={!studentVerification || loading}
            className={`px-4 py-2 rounded-md text-white ${
              !studentVerification || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Processing..." : "Update Attendance"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={!formik.values.attendanceId || !studentVerification}
            className={`px-4 py-2 rounded-md ${
              !formik.values.attendanceId || !studentVerification
                ? "text-gray-400 cursor-not-allowed"
                : "text-red-600 hover:text-red-800"
            }`}
          >
            Delete Record
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttendanceForm;
