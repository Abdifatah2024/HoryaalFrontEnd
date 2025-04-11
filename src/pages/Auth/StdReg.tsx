import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineUser } from "react-icons/ai";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../Redux/store";
import { createStudent, updateStudent } from "../../Redux/Auth/RegstdSlice";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const StudentForm = () => {
  const toastId = "student-register";
  const dispatch = useDispatch<AppDispatch>();
  const studentState = useSelector((state: RootState) => state.StdRegSlice);

  const [editing, setEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // 🔹 Sample class list (can be replaced with dynamic data)
  const classList = [
    { id: 1, name: "1A" },
    { id: 2, name: "1B" },
    { id: 3, name: "1C" },
    { id: 4, name: "1D" },
    { id: 5, name: "1E" },
    { id: 6, name: "1G" },
    { id: 7, name: "2A" },
    { id: 8, name: "2B" },
    { id: 9, name: "2C" },
    { id: 10, name: "2D" },
    { id: 11, name: "2E" },
    { id: 12, name: "2F" },
    { id: 13, name: "3A" },

  ];

  const formik = useFormik({
    initialValues: {
      id: "",
      firstname: "",
      middlename: "",
      lastname: "",
      classId: "",
      phone: "",
      gender: "",
      Age: "",
      fee: "",
      Amount: "",
    },
    validationSchema: yup.object({
      firstname: yup.string().required("First name is required"),
      lastname: yup.string().required("Last name is required"),
      classId: yup.number().required("Class ID is required"),
      phone: yup
        .string()
        .matches(/^\d+$/, "Phone number must contain only digits")
        .required("Phone number is required"),
      gender: yup.string().oneOf(["Male", "Female"]).required("Gender is required"),
      Age: yup.number().min(3, "Minimum age is 3").required("Age is required"),
      fee: yup.number().required("Fee is required"),
      Amount: yup.number().required("Amount is required"),
    }),

    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const data = {
        ...values,
        Age: Number(values.Age),
        fee: Number(values.fee),
        Amount: Number(values.Amount),
        classId: Number(values.classId),
        phone: values.phone.toString(),
        fullname: `${values.firstname} ${values.middlename || ""} ${values.lastname}`,
      };

      try {
        if (editing) {
          const action = await dispatch(updateStudent({ studentId: values.id, studentData: data }));
          if (updateStudent.fulfilled.match(action)) {
            toast.success("Student updated successfully!", { id: toastId });
            resetForm();
            setEditing(false);
          }
        } else {
          const action = await dispatch(createStudent(data));
          if (createStudent.fulfilled.match(action)) {
            toast.success("Student registered successfully!", { id: toastId });
            resetForm();
          }
        }
      } catch (error) {
        console.error("Student form error:", error);
        toast.error((error as Error).message || "Something went wrong!");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (studentState.student && !editing) {
      formik.setValues({
        id: studentState.student?.id?.toString() || "",
        firstname: studentState.student?.firstname || "",
        middlename: studentState.student?.middlename || "",
        lastname: studentState.student?.lastname || "",
        classId: studentState.student?.classId || "",
        phone: studentState.student?.phone || "",
        gender: studentState.student?.gender || "",
        Age: studentState.student?.age?.toString() || "",
        fee: studentState.student?.fee?.toString() || "",
        Amount: studentState.student?.amount?.toString() || "",
      });
      setEditing(true);
    }
  }, [studentState.student]);

  useEffect(() => {
    if (studentState.error) {
      toast.error(studentState.error, { id: toastId });
    }
  }, [studentState.error]);

  return (
    <div className={`flex items-center justify-center min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-r from-green-50 to-blue-50"}`}>
      <div className={`w-full max-w-4xl p-8 ${darkMode ? "bg-gray-800 text-white" : "bg-white"} rounded-xl shadow-2xl flex flex-row`}>
        
        {/* Left Section */}
        <div className="w-1/4 bg-gradient-to-b from-violet-900 to-indigo-900 text-slate-100 rounded-lg p-8 flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome!</h1>
          <p className="text-lg text-center">
            {editing ? "Update student details" : "Register a new student"}
          </p>
          <div className="mt-8">
            <img
              src="https://illustrations.popsy.co/amber/student-graduation.svg"
              alt="Illustration"
              className="w-64 h-64"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">{editing ? "Update Student" : "Register Student"}</h1>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Text fields */}
            {["firstname", "middlename", "lastname", "phone"].map((field) => (
              <motion.div key={field} whileHover={{ scale: 1.02 }}>
                <label htmlFor={field} className="block text-sm font-medium capitalize">
                  {field}
                </label>
                <div className="flex items-center border border-gray-300 rounded-md focus-within:ring focus-within:ring-green-200">
                  <AiOutlineUser className="ml-2 text-gray-400" />
                  <input
                    id={field}
                    name={field}
                    type="text"
                    value={formik.values[field]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`mt-1 w-full p-2 border-0 focus:outline-none ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
                    placeholder={`Enter ${field}`}
                  />
                </div>
                {formik.touched[field] && formik.errors[field] && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors[field]}</p>
                )}
              </motion.div>
            ))}

            {/* 🔽 classId dropdown */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <label htmlFor="classId" className="block text-sm font-medium">Class</label>
              <select
                id="classId"
                name="classId"
                value={formik.values.classId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-200 ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
              >
                <option value="">Select Class</option>
                {classList.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
              {formik.touched.classId && formik.errors.classId && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.classId}</p>
              )}
            </motion.div>

            {/* Gender Select */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <label htmlFor="gender" className="block text-sm font-medium">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {formik.touched.gender && formik.errors.gender && <p className="text-red-500 text-xs mt-1">{formik.errors.gender}</p>}
            </motion.div>

            {/* Age, Fee, and Amount Fields */}
            {["Age", "fee", "Amount"].map((field) => (
              <motion.div key={field} whileHover={{ scale: 1.02 }}>
                <label htmlFor={field} className="block text-sm font-medium capitalize">{field}</label>
                <input
                  id={field}
                  name={field}
                  type="number"
                  value={formik.values[field]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-200 ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
                  placeholder={`Enter ${field}`}
                />
                {formik.touched[field] && formik.errors[field] && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors[field]}</p>
                )}
              </motion.div>
            ))}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 text-white font-bold rounded-md transition duration-300 ease-in-out bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring focus:ring-green-300"
              disabled={formik.isSubmitting || studentState.loading}
            >
              {formik.isSubmitting || studentState.loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              ) : editing ? "Update Student" : "Register Student"}
            </button>

            {/* Dark Mode Toggle */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className={`text-sm ${darkMode ? "text-gray-300 hover:text-gray-100" : "text-gray-500 hover:text-gray-700"}`}
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

export default StudentForm;
