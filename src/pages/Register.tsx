import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineMail, AiOutlineLock, AiFillEye, AiFillEyeInvisible, AiOutlineUser, AiOutlinePhone } from "react-icons/ai";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../Redux/store";
import { Registerfn, updateUser } from "../Redux/Auth/RegisterSlice"; // ✅ Import updateUser
import toast from "react-hot-toast";

const Register = () => {
  const toastId = "register";
  const dispatch = useDispatch<AppDispatch>();
  const RegisterState = useSelector((state: RootState) => state.registerSlice);

  const [showPassword, setShowPassword] = useState(false);
  const [editing, setEditing] = useState(false); // ✅ Track if updating user

  const formik = useFormik({
    initialValues: {
      id: "", // ✅ Add ID to track user for updates
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
        // ✅ If editing, dispatch updateUser action
        dispatch(updateUser({ userId: values.id, userData: data })).then((action) => {
          if (updateUser.fulfilled.match(action)) {
            toast.success("User updated successfully!", { id: toastId });
            resetForm();
            setEditing(false);
          }
        });
      } else {
        // ✅ Otherwise, register a new user
        dispatch(Registerfn(data)).then((action) => {
          if (Registerfn.fulfilled.match(action)) {
            toast.success("Registration Successful!", { id: toastId });
            resetForm();
          }
        });
      }
    },
  });

  // ✅ If the user is logged in or selected, prefill the form for updating
  useEffect(() => {
    if (RegisterState.user) {
      formik.setValues({
        id: RegisterState.user.id || "",
        fullName: RegisterState.user.fullName || "",
        username: RegisterState.user.username || "",
        email: RegisterState.user.email || "",
        phoneNumber: RegisterState.user.phoneNumber || "",
        password: "", // Don't prefill password for security
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{editing ? "Update User" : "Create an Account"}</h1>
          <p className="text-gray-600 my-3 font-bold text-md">{editing ? "Update your details" : "Enter your details to sign up"}</p>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {["fullName", "username", "email", "phoneNumber"].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-gray-700 text-sm font-medium capitalize">
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
                  className="mt-1 w-full p-2 border-0 focus:outline-none"
                  placeholder={`Enter your ${field}`}
                />
              </div>
              {formik.touched[field as keyof typeof formik.touched] && formik.errors[field as keyof typeof formik.errors] && (
                <p className="text-red-500 text-xs mt-1">{formik.errors[field as keyof typeof formik.errors]}</p>
              )}
            </div>
          ))}

          {/* 🔹 Password Input */}
          {!editing && (
            <>
              <div>
                <label htmlFor="password" className="block text-gray-700 text-sm font-medium">
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
                    className="mt-1 w-full p-2 border-0 focus:outline-none"
                    placeholder="Enter your password"
                  />
                  <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="mr-2">
                    {showPassword ? <AiFillEyeInvisible className="text-gray-400" /> : <AiFillEye className="text-gray-400" />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
                )}
              </div>

              {/* 🔹 Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium">
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
                    className="mt-1 w-full p-2 border-0 focus:outline-none"
                    placeholder="Confirm your password"
                  />
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 text-white font-bold rounded-md transition duration-300 ease-in-out bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
            disabled={RegisterState.loading}
          >
            {RegisterState.loading ? "Processing..." : editing ? "Update User" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;



