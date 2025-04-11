import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCalendar } from "react-icons/ai";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../Redux/store";
import { markAttendance } from "../../Redux/Auth/AttedenceSlice";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { fetchStudents } from "../../Redux/Auth/RegstdSlice";

const AttendanceForm = () => {
  const toastId = "attendance-mark";
  const dispatch = useDispatch<AppDispatch>();
  const { students } = useSelector((state: RootState) => state.StdRegSlice);
  const { loading, error } = useSelector((state: RootState) => state.attendance);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const validationSchema = yup.object({
    studentId: yup.string().required("Student selection is required"),
    present: yup.boolean().required("Attendance status is required"),
    remark: yup.string().required("Remark is required"),
  });

  const formik = useFormik({
    initialValues: {
      studentId: "",
      present: true,
      remark: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(markAttendance(values));
        toast.success("Attendance marked successfully!", { id: toastId });
        resetForm();
      } catch (error) {
        toast.error(error.message || "Failed to mark attendance", { id: toastId });
      }
    },
  });

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-r from-green-50 to-blue-50"}`}>
      <div className={`max-w-4xl mx-auto p-8 ${darkMode ? "bg-gray-800 text-white" : "bg-white"} rounded-xl shadow-2xl flex flex-row mt-8`}>
        
        {/* Left Section */}
        <div className="w-1/4 bg-gradient-to-b from-violet-900 to-indigo-900 text-slate-100 rounded-lg p-8 flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold mb-4">Attendance</h1>
          <p className="text-lg text-center">Mark daily student attendance</p>
          <div className="mt-8">
            <img
              src="https://illustrations.popsy.co/amber/calendar-check.svg"
              alt="Attendance Illustration"
              className="w-64 h-64"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">Mark Attendance</h1>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Student Selection */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <label htmlFor="studentId" className="block text-sm font-medium">Student</label>
              <select
                id="studentId"
                name="studentId"
                value={formik.values.studentId}
                onChange={formik.handleChange}
                className={`w-full p-2 border border-gray-300 rounded-md ${
                  darkMode ? "bg-gray-700 text-white" : "bg-white"
                }`}
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.fullname} - {student.classId}
                  </option>
                ))}
              </select>
              {formik.touched.studentId && formik.errors.studentId && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.studentId}</p>
              )}
            </motion.div>

            {/* Attendance Status */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm font-medium">Status</label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="present"
                    value="true"
                    checked={formik.values.present}
                    onChange={() => formik.setFieldValue("present", true)}
                    className="mr-2"
                  />
                  Present
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="present"
                    value="false"
                    checked={!formik.values.present}
                    onChange={() => formik.setFieldValue("present", false)}
                    className="mr-2"
                  />
                  Absent
                </label>
              </div>
            </motion.div>

            {/* Remark Input */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <label htmlFor="remark" className="block text-sm font-medium">Remark</label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <AiOutlineCalendar className="ml-2 text-gray-400" />
                <input
                  id="remark"
                  name="remark"
                  type="text"
                  value={formik.values.remark}
                  onChange={formik.handleChange}
                  className={`w-full p-2 focus:outline-none ${
                    darkMode ? "bg-gray-700 text-white" : "bg-white"
                  }`}
                  placeholder="Enter remark"
                />
              </div>
              {formik.touched.remark && formik.errors.remark && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.remark}</p>
              )}
            </motion.div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 text-white font-bold rounded-md transition duration-300 ease-in-out bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              ) : (
                "Mark Attendance"
              )}
            </button>

            {/* Dark Mode Toggle */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AttendanceForm;