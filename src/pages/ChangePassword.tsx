import { useFormik } from "formik";
import * as yup from "yup";
import { AppDispatch, RootState } from "../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineLock, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { changePasswordFn } from "@/Redux/passwordSlice";

const ChangePassword = () => {
  const toastId = "changePassword";
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.passwordSlice);
  // const navigate = useNavigate()
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const validationSchema = yup.object({
    oldPassword: yup.string().required("Old password is required"),
    newPassword: yup.string()
      .min(6, "Password must be at least 6 characters")
      .notOneOf([yup.ref('oldPassword')], "New password must be different from old password")
      .required("New password is required"),
    confirmPassword: yup.string()
      .oneOf([yup.ref('newPassword')], "Passwords must match")
      .required("Confirm password is required")
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
    validationSchema,
    onSubmit(values) {
      toast.loading("Updating password...", { id: toastId });
      dispatch(changePasswordFn(values));
    },
  });

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { id: toastId });
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
      <Toaster position="top-right" reverseOrder={false} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl backdrop-blur-lg p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-10" />
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
            >
              Change Password
            </motion.h1>
            <p className="text-gray-600 font-medium">Secure your account with a new password</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Old Password */}
            <div className="relative">
              <div className="flex items-center border-b-2 border-gray-200 focus-within:border-blue-500 transition-colors">
                <AiOutlineLock className="ml-2 text-gray-400 text-lg" />
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type={showPasswords.old ? "text" : "password"}
                  value={formik.values.oldPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-3 py-3 border-0 focus:ring-0 bg-transparent placeholder-gray-400"
                  placeholder="Old Password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('old')}
                  className="mr-2 transition-transform hover:scale-110"
                >
                  {showPasswords.old ? (
                    <AiFillEyeInvisible className="text-gray-400" />
                  ) : (
                    <AiFillEye className="text-gray-400" />
                  )}
                </button>
              </div>
              {formik.touched.oldPassword && formik.errors.oldPassword && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mt-1 flex items-center"
                >
                  <span className="mr-1">⚠</span>{formik.errors.oldPassword}
                </motion.p>
              )}
            </div>

            {/* New Password */}
            <div className="relative">
              <div className="flex items-center border-b-2 border-gray-200 focus-within:border-blue-500 transition-colors">
                <AiOutlineLock className="ml-2 text-gray-400 text-lg" />
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-3 py-3 border-0 focus:ring-0 bg-transparent placeholder-gray-400"
                  placeholder="New Password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="mr-2 transition-transform hover:scale-110"
                >
                  {showPasswords.new ? (
                    <AiFillEyeInvisible className="text-gray-400" />
                  ) : (
                    <AiFillEye className="text-gray-400" />
                  )}
                </button>
              </div>
              {formik.touched.newPassword && formik.errors.newPassword && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mt-1 flex items-center"
                >
                  <span className="mr-1">⚠</span>{formik.errors.newPassword}
                </motion.p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <div className="flex items-center border-b-2 border-gray-200 focus-within:border-blue-500 transition-colors">
                <AiOutlineLock className="ml-2 text-gray-400 text-lg" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-3 py-3 border-0 focus:ring-0 bg-transparent placeholder-gray-400"
                  placeholder="Confirm New Password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="mr-2 transition-transform hover:scale-110"
                >
                  {showPasswords.confirm ? (
                    <AiFillEyeInvisible className="text-gray-400" />
                  ) : (
                    <AiFillEye className="text-gray-400" />
                  )}
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mt-1 flex items-center"
                >
                  <span className="mr-1">⚠</span>{formik.errors.confirmPassword}
                </motion.p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </div>
              ) : (
                "Change Password"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
