
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineMail, AiOutlineLock, AiFillEye, AiFillEyeInvisible, AiOutlineUser, AiOutlinePhone } from "react-icons/ai";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../Redux/store";
import { Registerfn, updateUser } from "../Redux/Auth/RegisterSlice";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Register = () => {
  const toastId = "register";
  const dispatch = useDispatch<AppDispatch>();
  const RegisterState = useSelector((state: RootState) => state.registerSlice);

  const [showPassword, setShowPassword] = useState(false);
  const [editing, setEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Dark mode state
  const [passwordStrength, setPasswordStrength] = useState(""); // Password strength indicator

  const formik = useFormik({
    initialValues: {
      id: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phoneNumber: "",
    },
    validationSchema: yup.object({
      fullName: yup.string().required("Full Name is required"),
      username: yup.string().required("Username is required"),
      email: yup.string().email("Invalid email address").required("Email is required"),
      phoneNumber: yup.string().required("Phone number is required"),
      password: yup.string().min(6, "Password must be at least 6 characters long.").required("Password is required"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match.")
        .required("Confirm Password is required"),
    }),

    onSubmit(values, { resetForm }) {
      const data = { ...values };

      if (editing) {
        dispatch(updateUser({ userId: values.id, userData: data })).then((action) => {
          if (updateUser.fulfilled.match(action)) {
            toast.success("User updated successfully!", { id: toastId });
            resetForm();
            setEditing(false);
          }
        });
      } else {
        dispatch(Registerfn(data)).then((action) => {
          if (Registerfn.fulfilled.match(action)) {
            toast.success("Registration Successful!", { id: toastId });
            resetForm();
          }
        });
      }
    },
  });

  // Password strength calculator
  useEffect(() => {
    const strength = calculatePasswordStrength(formik.values.password);
    setPasswordStrength(strength);
  }, [formik.values.password]);

  const calculatePasswordStrength = (password: string) => {
    if (password.length === 0) return "";
    if (password.length < 6) return "Weak";
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return "Strong";
    }
    return "Medium";
  };

  useEffect(() => {
    if (RegisterState.user) {
      formik.setValues({
        id: RegisterState.user.id || "",
        fullName: RegisterState.user.fullName || "",
        username: RegisterState.user.username || "",
        email: RegisterState.user.email || "",
        phoneNumber: RegisterState.user.phoneNumber || "",
        password: "",
        confirmPassword: "",
      });
      setEditing(true);
    }
  }, [RegisterState.user]);

  useEffect(() => {
    if (RegisterState.error) {
      toast.error(RegisterState.error, { id: toastId });
    }
  }, [RegisterState.error]);

  return (
    <div className={`flex items-center justify-center min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-r from-blue-50 to-purple-50"}`}>
      <div className={`w-full max-w-4xl p-8 ${darkMode ? "bg-gray-800 text-white" : "bg-white"} rounded-xl shadow-2xl flex flex-row`}>
        {/* Left Section: Illustration or Branding */}
        <div className="w-1/2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome!</h1>
          <p className="text-lg text-center">
            {editing ? "Update your details to keep your profile fresh." : "Join us and start your journey today."}
          </p>
          <div className="mt-8">
            <img
              src="https://illustrations.popsy.co/amber/student-graduation.svg"
              alt="Illustration"
              className="w-64 h-64"
            />
          </div>
        </div>

        {/* Right Section: Form */}
        <div className="w-1/2 p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">{editing ? "Update User" : "Create an Account"}</h1>
            <p className={`my-3 font-bold text-md ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              {editing ? "Update your details" : "Enter your details to sign up"}
            </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {["fullName", "username", "email", "phoneNumber"].map((field) => (
              <motion.div key={field} whileHover={{ scale: 1.02 }}>
                <label htmlFor={field} className="block text-sm font-medium capitalize">
                  {field.replace("Number", " Number")}
                </label>
                <div className="flex items-center border border-gray-300 rounded-md focus-within:ring focus-within:ring-blue-200">
                  {field === "email" && <AiOutlineMail className="ml-2 text-gray-400" />}
                  {field === "phoneNumber" && <AiOutlinePhone className="ml-2 text-gray-400" />}
                  {(field === "fullName" || field === "username") && <AiOutlineUser className="ml-2 text-gray-400" />}
                  <input
                    id={field}
                    name={field}
                    type="text"
                    value={formik.values[field as keyof typeof formik.values]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`mt-1 w-full p-2 border-0 focus:outline-none ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
                    placeholder={`Enter your ${field}`}
                  />
                </div>
                {formik.touched[field as keyof typeof formik.touched] && formik.errors[field as keyof typeof formik.errors] && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors[field as keyof typeof formik.errors]}</p>
                )}
              </motion.div>
            ))}

            {/* Password Input */}
            {!editing && (
              <>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <label htmlFor="password" className="block text-sm font-medium">
                    Password
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md focus-within:ring focus-within:ring-blue-200">
                    <AiOutlineLock className="ml-2 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`mt-1 w-full p-2 border-0 focus:outline-none ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
                      placeholder="Enter your password"
                    />
                    <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="mr-2">
                      {showPassword ? <AiFillEyeInvisible className="text-gray-400" /> : <AiFillEye className="text-gray-400" />}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
                  )}
                  {passwordStrength && (
                    <div className="mt-2">
                      <span className="text-sm">Password Strength: </span>
                      <span
                        className={`font-bold ${
                          passwordStrength === "Weak"
                            ? "text-red-500"
                            : passwordStrength === "Medium"
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      >
                        {passwordStrength}
                      </span>
                    </div>
                  )}
                </motion.div>

                {/* Confirm Password Input */}
                <motion.div whileHover={{ scale: 1.02 }}>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium">
                    Confirm Password
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md focus-within:ring focus-within:ring-blue-200">
                    <AiOutlineLock className="ml-2 text-gray-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`mt-1 w-full p-2 border-0 focus:outline-none ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
                      placeholder="Confirm your password"
                    />
                  </div>
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
                  )}
                </motion.div>
              </>
            )}


            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 text-white font-bold rounded-md transition duration-300 ease-in-out bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring focus:ring-blue-300"
              disabled={RegisterState.loading}
            >
              {RegisterState.loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              ) : editing ? (
                "Update User"
              ) : (
                "Sign Up"
              )}
            </button>

            {/* Dark Mode Toggle */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className="text-sm text-gray-500 hover:text-gray-700"
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

export default Register;