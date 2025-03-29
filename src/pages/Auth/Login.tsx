import { useFormik } from "formik";
import * as yup from "yup";
import { AppDispatch, RootState } from "../../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Loginfn } from "../../Redux/Auth/LoginSlice";
import { AiOutlineMail, AiOutlineLock, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FiGithub } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

const Login = () => {
  const toastId = "login";
  const dispatch = useDispatch<AppDispatch>();
  const loginState = useSelector((state: RootState) => state.loginSlice);
  const { loading, error } = loginState;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().email("Please enter a valid email").required("Please enter an email"),
      password: yup.string().min(5, "Password must be at least 5 characters long.").required("Password is required"),
    }),
    onSubmit(values) {
      const data = {
        email: values.email,
        password: values.password,
      };
      toast.loading("Logging in...", { id: toastId });
      dispatch(Loginfn(data));
    },
  });

  useEffect(() => {
    if (loginState.error) {
      toast.error(loginState.error, { id: toastId });
    }

    if (loginState.data?.message) {
      toast.success("Successfully logged in", { id: toastId });
      localStorage.setItem("userData", JSON.stringify(loginState.data));
    }
  }, [loginState.error, loginState.data]);

  useEffect(() => {
    if (loginState.data?.message) {
      navigate("/dashboard");
    }
  }, [loginState.data?.message, navigate]);

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
              Welcome Back
            </motion.h1>
            <p className="text-gray-600 font-medium">Sign in to continue your journey</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <div className="flex items-center border-b-2 border-gray-200 focus-within:border-blue-500 transition-colors">
                <AiOutlineMail className="ml-2 text-gray-400 text-lg" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-3 py-3 border-0 focus:ring-0 bg-transparent placeholder-gray-400"
                  placeholder="Email address"
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mt-1 flex items-center"
                >
                  <span className="mr-1">⚠</span>{formik.errors.email}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="flex items-center border-b-2 border-gray-200 focus-within:border-blue-500 transition-colors">
                <AiOutlineLock className="ml-2 text-gray-400 text-lg" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-3 py-3 border-0 focus:ring-0 bg-transparent placeholder-gray-400"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="mr-2 transition-transform hover:scale-110"
                >
                  {showPassword ? (
                    <AiFillEyeInvisible className="text-gray-400" />
                  ) : (
                    <AiFillEye className="text-gray-400" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mt-1 flex items-center"
                >
                  <span className="mr-1">⚠</span>{formik.errors.password}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
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
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          <div className="my-6 flex items-center before:flex-1 before:border-t before:border-gray-300 after:flex-1 after:border-t after:border-gray-300">
            <p className="text-center mx-4 text-gray-500">or continue with</p>
          </div>

          <div className="flex space-x-4 justify-center">
            <button className="p-3 rounded-lg border-2 border-gray-200 hover:bg-gray-50 transition-colors">
              <FcGoogle className="text-2xl" />
            </button>
            <button className="p-3 rounded-lg border-2 border-gray-200 hover:bg-gray-50 transition-colors">
              <FiGithub className="text-2xl" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;