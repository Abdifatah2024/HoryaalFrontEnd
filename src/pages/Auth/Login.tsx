// import { useFormik } from "formik";
// import * as yup from "yup";
// import { useAppDispatch, useAppSelector } from "../../Redux/store";
// import {
//   Loginfn,
//   ForgotPasswordfn,
//   clearForgetPasswordState,
// } from "../../Redux/Auth/LoginSlice";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Toaster, toast } from "react-hot-toast";
// import {
//   FiEye,
//   FiEyeOff,
//   FiMail,
//   FiLock,
//   FiArrowRight,
// } from "react-icons/fi";
// import { motion } from "framer-motion";
// import React from "react";

// const Login = () => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const { loading, error, data, forgetPasswordSuccess } = useAppSelector(
//     (state) => state.loginSlice
//   );

//   const [showPassword, setShowPassword] = useState(false);
//   const [lockTimer, setLockTimer] = useState<number | null>(null);

//   // Extract seconds from backend lockout message
//   useEffect(() => {
//     if (error && error.includes("Try again in")) {
//       const match = error.match(/in (\d+) seconds?/);
//       if (match && match[1]) {
//         setLockTimer(parseInt(match[1], 10));
//       }
//     }
//   }, [error]);

//   // Countdown for lock timer
//   useEffect(() => {
//     if (lockTimer && lockTimer > 0) {
//       const timer = setInterval(() => {
//         setLockTimer((prev) => (prev !== null ? prev - 1 : null));
//       }, 1000);
//       return () => clearInterval(timer);
//     }
//   }, [lockTimer]);

//   const formik = useFormik({
//     initialValues: { email: "", password: "" },
//     validationSchema: yup.object({
//       email: yup.string().email("Invalid email format").required("Required"),
//       password: yup
//         .string()
//         .min(5, "Password must be at least 5 characters")
//         .required("Required"),
//     }),
//     onSubmit: (values) => {
//       if (lockTimer) return;
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
//     toast.loading("Sending reset link...", { id: "forgot" });
//   };

//   // Handle login success or error
//   useEffect(() => {
//     if (error && !error.includes("Try again in")) {
//       toast.error(error, { id: "login" });
//     }

//     if (data?.message && data?.user?.Role) {
//       toast.success("Login successful!", { id: "login" });
//       localStorage.setItem("userData", JSON.stringify(data));

//       const role = data.user.Role;

//       if (role === "PARENT") {
//         navigate("/parent-dashboard");
//       } else {
//         navigate("/dashboard");
//       }
//     }
//   }, [error, data, navigate]);

//   // After forgot password success, redirect to /auth/reset-password
//   useEffect(() => {
//     if (forgetPasswordSuccess) {
//       toast.success("Reset link sent! Check your email.", {
//         id: "forgot",
//       });
//       dispatch(clearForgetPasswordState());
//       navigate("/auth/reset-password");
//     }
//   }, [forgetPasswordSuccess, dispatch, navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
//       <Toaster position="top-right" />
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6"
//       >
//         <div className="text-center">
//           <h2 className="text-3xl font-bold text-indigo-700 mb-2">
//             Welcome Back
//           </h2>
//           <p className="text-gray-600">Sign in to access your account</p>
//         </div>

//         <form onSubmit={formik.handleSubmit} className="space-y-6">
//           {/* Email */}
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Email Address
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiMail className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formik.values.email}
//                 onChange={formik.handleChange}
//                 disabled={!!lockTimer}
//                 placeholder="you@example.com"
//                 className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//             {formik.touched.email && formik.errors.email && (
//               <p className="mt-1 text-sm text-red-600">
//                 {formik.errors.email}
//               </p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Password
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiLock className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 id="password"
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 value={formik.values.password}
//                 onChange={formik.handleChange}
//                 disabled={!!lockTimer}
//                 placeholder="Enter your password"
//                 className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
//               >
//                 {showPassword ? (
//                   <FiEyeOff className="h-5 w-5" />
//                 ) : (
//                   <FiEye className="h-5 w-5" />
//                 )}
//               </button>
//             </div>
//             {formik.touched.password && formik.errors.password && (
//               <p className="mt-1 text-sm text-red-600">
//                 {formik.errors.password}
//               </p>
//             )}
//           </div>

//           {/* Forgot Password */}
//           <div className="flex justify-end">
//             <button
//               type="button"
//               onClick={handleForgotPassword}
//               disabled={!!lockTimer}
//               className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
//             >
//               Forgot Password?
//             </button>
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loading || !!lockTimer}
//             className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
//           >
//             {loading ? (
//               <>
//                 <svg
//                   className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Signing in...
//               </>
//             ) : (
//               <>
//                 Sign In <FiArrowRight className="ml-2" />
//               </>
//             )}
//           </button>
//         </form>

//         {/* Lockout message */}
//         {lockTimer !== null && (
//           <div className="text-center mt-4 text-sm text-red-600 font-medium">
//             Account is locked. Try again in {lockTimer} second
//             {lockTimer !== 1 ? "s" : ""}.
//           </div>
//         )}

//         <div className="text-center text-sm text-gray-600">
//           Don&apos;t have an account?{" "}
//           <button className="font-medium text-indigo-600 hover:text-indigo-500">
//             Contact administrator
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;
import { useFormik } from "formik";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  Loginfn,
  ForgotPasswordfn,
  clearForgetPasswordState,
} from "../../Redux/Auth/LoginSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
  FiLogIn, // Changed from FiArrowRight for more thematic icon
  FiAlertCircle, // For error icon
} from "react-icons/fi";
import { motion } from "framer-motion";
import React from "react"; // Explicitly import React

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, data, forgetPasswordSuccess } = useAppSelector(
    (state) => state.loginSlice
  );

  const [showPassword, setShowPassword] = useState(false);
  const [lockTimer, setLockTimer] = useState<number | null>(null);

  // Effect to handle login errors and success, and initiate lockout timer
  useEffect(() => {
    // Handle lockout error specifically
    if (error && error.includes("Try again in")) {
      const match = error.match(/in (\d+) seconds?/);
      if (match && match[1]) {
        const seconds = parseInt(match[1], 10);
        setLockTimer(seconds);
        // Display persistent toast for lockout
        toast.error(`Too many failed attempts. Try again in ${seconds} seconds.`, { id: "login", duration: seconds * 1000 + 500 });
      }
    } else if (error) {
      // Show generic error if not a lockout message
      toast.error(error, { id: "login" });
    }

    // Handle loading state for toast
    if (loading) {
      toast.loading("Logging in...", { id: "login" });
    } else if (data?.message && data?.user?.Role) {
      // Handle successful login
      toast.success("Login successful!", { id: "login" });
      localStorage.setItem("userData", JSON.stringify(data)); // Store user data

      const role = data.user.Role;
      // Navigate based on user role
      if (role === "PARENT") {
        navigate("/parent-dashboard");
      } else {
        navigate("/dashboard");
      }
    }
    // Dependencies for this effect: error, data, loading, navigate
  }, [error, data, loading, navigate]);

  // Effect for the lockout countdown timer
  useEffect(() => {
    if (lockTimer && lockTimer > 0) {
      const timer = setInterval(() => {
        setLockTimer((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(timer); // Cleanup on unmount or when timer finishes
    } else if (lockTimer === 0) {
      setLockTimer(null); // Clear lock timer when it reaches zero
      toast.success("Account unlocked! Please try again.", { id: "login" }); // Notify user
    }
    // Dependency for this effect: lockTimer
  }, [lockTimer]);

  // Formik setup for form validation and submission
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: yup.object({
      email: yup.string().email("Invalid email format").required("Email is required"), // User-friendly validation messages
      password: yup
        .string()
        .min(5, "Password must be at least 5 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      if (lockTimer) {
        // Prevent submission if locked out, show a toast
        toast.error(`Please wait ${lockTimer} seconds before trying again.`, { id: "lockout_warning" });
        return;
      }
      dispatch(Loginfn(values)); // Dispatch login action
    },
  });

  // Handler for Forgot Password link
  const handleForgotPassword = () => {
    if (!formik.values.email) {
      // If email is empty, mark field as touched and show error
      formik.setFieldTouched('email', true, true);
      toast.error("Please enter your email to reset password.");
      return;
    }
    dispatch(ForgotPasswordfn(formik.values.email)); // Dispatch forgot password action
    toast.loading("Sending reset link...", { id: "forgot" }); // Show loading toast
  };

  // Effect for handling forgot password success and redirection
  useEffect(() => {
    if (forgetPasswordSuccess) {
      toast.success("Reset link sent! Check your email.", {
        id: "forgot",
      });
      dispatch(clearForgetPasswordState()); // Clear the success state
      navigate("/auth/reset-password"); // Redirect to reset password page
    }
    // Dependencies for this effect: forgetPasswordSuccess, dispatch, navigate
  }, [forgetPasswordSuccess, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-blue-500 to-green-300 p-4 font-sans relative overflow-hidden">
      {/* Toaster for notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* More dynamic and beautiful background elements with Framer Motion animations */}
      {/* Large, slow pulsating gradient from top-left */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.3 }}
        transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 blur-2xl opacity-20"
      ></motion.div>
      {/* Large, slow pulsating gradient from top-left with a delay */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.1, opacity: 0.3 }}
        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "mirror", delay: 0.5 }}
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-bl from-yellow-400 via-orange-400 to-red-400 blur-3xl opacity-20"
      ></motion.div>
      {/* Small, floating circular blob moving from top-left to bottom-right */}
      <motion.div
        initial={{ x: -50, y: -50, opacity: 0 }}
        animate={{ x: 50, y: 50, opacity: 0.2 }}
        transition={{ duration: 3, ease: "linear", repeat: Infinity, repeatType: "loop" }}
        className="absolute w-48 h-48 bg-blue-300 rounded-full blur-xl opacity-15"
      ></motion.div>
      {/* Another small, floating circular blob moving from bottom-right to top-left with a delay */}
      <motion.div
        initial={{ x: 50, y: 50, opacity: 0 }}
        animate={{ x: -50, y: -50, opacity: 0.2 }}
        transition={{ duration: 4, ease: "linear", repeat: Infinity, repeatType: "loop", delay: 1 }}
        className="absolute w-64 h-64 bg-green-300 rounded-full blur-xl opacity-15"
      ></motion.div>

      {/* Main Login Card with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-7 relative z-10 border border-gray-100"
      >
        {/* Header Section */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-extrabold text-indigo-800 mb-2 tracking-tight">
            Welcome Back!
          </h2>
          <p className="text-gray-600 text-lg">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Email Input Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
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
                onBlur={formik.handleBlur} // Validate on blur
                disabled={!!lockTimer || loading} // Disable input if locked or loading
                placeholder="you@example.com"
                className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out
                  ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'}
                  ${!!lockTimer || loading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
                `}
              />
            </div>
            {/* Email validation error message */}
            {formik.touched.email && formik.errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center text-sm text-red-600"
              >
                <FiAlertCircle className="h-4 w-4 mr-1" /> {formik.errors.email}
              </motion.p>
            )}
          </div>

          {/* Password Input Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"} // Toggle password visibility
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // Validate on blur
                disabled={!!lockTimer || loading} // Disable input if locked or loading
                placeholder="Enter your password"
                className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out
                  ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'}
                  ${!!lockTimer || loading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
                `}
              />
              {/* Password visibility toggle button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={!!lockTimer || loading} // Disable button if locked or loading
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
            </div>
            {/* Password validation error message */}
            {formik.touched.password && formik.errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center text-sm text-red-600"
              >
                <FiAlertCircle className="h-4 w-4 mr-1" /> {formik.errors.password}
              </motion.p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={!!lockTimer || loading} // Disable button if locked or loading
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }} // Subtle grow on hover
            whileTap={{ scale: 0.99 }} // Subtle shrink on tap
            disabled={loading || !!lockTimer || !formik.isValid} // Disable if loading, locked, or form invalid
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-semibold text-white transition-all duration-200 ease-in-out
              ${loading || !!lockTimer || !formik.isValid
                ? 'bg-indigo-300 cursor-not-allowed' // Disabled style
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' // Enabled style
              }
            `}
          >
            {loading ? (
              <>
                {/* Loading spinner */}
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>
                Sign In <FiLogIn className="ml-2 h-5 w-5" /> {/* Login icon */}
              </>
            )}
          </motion.button>
        </form>

        {/* Account Lockout Message */}
        {lockTimer !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-5 text-base text-red-700 font-semibold p-3 bg-red-50 rounded-lg border border-red-200 flex items-center justify-center"
          >
            <FiAlertCircle className="h-5 w-5 mr-2" />
            Account locked. Try again in {lockTimer} second
            {lockTimer !== 1 ? "s" : ""}.
          </motion.div>
        )}

        {/* Registration/Contact Administrator Link */}
        <div className="text-center text-sm text-gray-600 mt-7">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => toast.success("Please contact your administrator for account creation.")} // Provides user with a clear action
            className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
          >
            Contact administrator
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;