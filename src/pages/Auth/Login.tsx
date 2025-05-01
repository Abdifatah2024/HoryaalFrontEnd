// import { useFormik } from "formik";
// import * as yup from "yup";
// import { useAppDispatch, useAppSelector } from "../../Redux/store";
// import { Loginfn, ForgotPasswordfn, clearForgetPasswordState } from "../../Redux/Auth/LoginSlice";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Toaster, toast } from "react-hot-toast";

// const Login = () => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const { loading, error, data, forgetPasswordSuccess } = useAppSelector((state) => state.loginSlice);
//   const [showPassword, setShowPassword] = useState(false);

//   const formik = useFormik({
//     initialValues: { email: "", password: "" },
//     validationSchema: yup.object({
//       email: yup.string().email("Invalid email format").required("Required"),
//       password: yup.string().min(5, "Password must be at least 5 characters").required("Required"),
//     }),
//     onSubmit: (values) => {
//       dispatch(Loginfn(values));
//       toast.loading("Logging in...", { id: "login" });
//     },
//   });

//   const handleForgotPassword = () => {
//     if (!formik.values.email) {
//       toast.error("Please enter your email first.");
//       return;
//     }
//     dispatch(ForgotPasswordfn(formik.values.email));
//     toast.loading("Sending reset code...", { id: "forgot" });
//   };

//   useEffect(() => {
//     if (error) {
//       toast.error(error, { id: "login" });
//     }
//     if (data?.message) {
//       toast.success("Login successful!", { id: "login" });
//       localStorage.setItem("userData", JSON.stringify(data));
//       navigate("/dashboard");
//     }
//   }, [error, data, navigate]);

//   useEffect(() => {
//     if (forgetPasswordSuccess) {
//       toast.success("Reset code sent! Check your email/phone.", { id: "forgot" });
//       dispatch(clearForgetPasswordState());
//       navigate("/auth/reset-password");
//     }
//   }, [forgetPasswordSuccess, dispatch, navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
//       <Toaster position="top-right" />
//       <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-5">
//         <h2 className="text-3xl font-bold text-center text-indigo-700">Login</h2>

//         <form onSubmit={formik.handleSubmit} className="space-y-5">
//           {/* Email */}
//           <div>
//             <input
//               name="email"
//               type="email"
//               value={formik.values.email}
//               onChange={formik.handleChange}
//               placeholder="Enter your email"
//               className="w-full p-3 border rounded-lg"
//             />
//             {formik.touched.email && formik.errors.email && (
//               <p className="text-red-500 text-sm">{formik.errors.email}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <input
//               name="password"
//               type={showPassword ? "text" : "password"}
//               value={formik.values.password}
//               onChange={formik.handleChange}
//               placeholder="Enter your password"
//               className="w-full p-3 border rounded-lg"
//             />
//           </div>

//           {/* Forgot Password Button */}
//           <div className="text-right">
//             <button
//               type="button"
//               onClick={handleForgotPassword}
//               className="text-sm text-indigo-600 hover:underline"
//             >
//               Forgot Password?
//             </button>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700"
//           >
//             {loading ? "Logging in..." : "Sign In"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
import { useFormik } from "formik";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { Loginfn, ForgotPasswordfn, clearForgetPasswordState } from "../../Redux/Auth/LoginSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { FiEye, FiEyeOff, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, data, forgetPasswordSuccess } = useAppSelector((state) => state.loginSlice);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: yup.object({
      email: yup.string().email("Invalid email format").required("Required"),
      password: yup.string().min(5, "Password must be at least 5 characters").required("Required"),
    }),
    onSubmit: (values) => {
      dispatch(Loginfn(values));
      toast.loading("Logging in...", { id: "login" });
    },
  });

  const handleForgotPassword = () => {
    if (!formik.values.email) {
      toast.error("Please enter your email first.");
      return;
    }
    dispatch(ForgotPasswordfn(formik.values.email));
    toast.loading("Sending reset code...", { id: "forgot" });
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { id: "login" });
    }
    if (data?.message) {
      toast.success("Login successful!", { id: "login" });
      localStorage.setItem("userData", JSON.stringify(data));
      navigate("/dashboard");
    }
  }, [error, data, navigate]);

  useEffect(() => {
    if (forgetPasswordSuccess) {
      toast.success("Reset code sent! Check your email/phone.", { id: "forgot" });
      dispatch(clearForgetPasswordState());
      navigate("/auth/reset-password");
    }
  }, [forgetPasswordSuccess, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
      <Toaster position="top-right" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-indigo-700 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to access your account</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                placeholder="your@email.com"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
            )}
          </div>

          {/* Forgot Password Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>
                Sign In <FiArrowRight className="ml-2" />
              </>
            )}
          </button>
        </form>

        {/* Optional: Sign up link */}
        <div className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button className="font-medium text-indigo-600 hover:text-indigo-500">
            Contact administrator
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;