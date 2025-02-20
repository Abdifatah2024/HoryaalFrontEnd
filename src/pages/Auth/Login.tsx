
// import { useFormik } from "formik";
// import * as yup from "yup";
// import { AppDispatch, RootState } from "../../Redux/store";
// import { useDispatch, useSelector } from "react-redux";
// import { Loginfn } from "../../Redux/Auth/LoginSlice";
// import { AiOutlineMail, AiOutlineLock, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
// import { useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom'
// import toast from 'react-hot-toast'



// const Login = () => {
//    let toastId = "login"
//    const dispatch = useDispatch<AppDispatch>();
//    const loginState = useSelector((state: RootState) => state.loginSlice)
//   const [showPassword, setShowPassword] = useState(false);

//   const formik = useFormik({
//     initialValues: {
//         email: "",
//         password: ""
//     },
//     onSubmit(values) {
//         const data = {
//             email: values.email,
//             password: values.password
//         }
//         toast.loading("Logging in...", { id: toastId })
//         dispatch(Loginfn(data))
//     },

//     validationSchema: yup.object({
//         email: yup.string().email("Please enter valid email").required("Please enter email"),
//         password: yup.string().min(5, "Password must be atleast 5 chars long.").required("Password is required")
//     })
// })

// useEffect(() => {
//   if (Login.error) {
//       toast.error(loginState.error, { id: toastId })
//   }

//   if (loginState.data.message) {
//       toast.success("Succesfully logged in", { id: toastId })
//       localStorage.setItem("userData", JSON.stringify(loginState.data))

//   }
// }, [loginState.error, loginState.data])

// useEffect(() => {
//   if (loginState.data.message) {
//       navigate("/")
//   }
// }, [loginState.data.message])

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <Toaster position="top-right" reverseOrder={false} /> {/* Toaster for notifications */}

//       <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
//         <div className="text-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">Welcome back</h1>
//           <p className="text-gray-600 my-3 font-bold text-md">Enter your credentials to sign in</p>
//         </div>

//         {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}

//         <form onSubmit={formik.handleSubmit} className="space-y-4">
//           {/* Email Field */}
//           <div>
//             <label htmlFor="email" className="block text-gray-700 text-sm font-medium">Email</label>
//             <div className="flex items-center border border-gray-300 rounded-md focus-within:ring focus-within:ring-blue-200">
//               <AiOutlineMail className="ml-2 text-gray-400" />
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formik.values.email}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className="mt-1 w-full p-2 border-0 focus:outline-none"
//                 placeholder="Enter your email"
//               />
//             </div>
//             {formik.touched.email && formik.errors.email && (
//               <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
//             )}
//           </div>

//           {/* Password Field */}
//           <div>
//             <label htmlFor="password" className="block text-gray-700 text-sm font-medium">Password</label>
//             <div className="flex items-center border border-gray-300 rounded-md focus-within:ring focus-within:ring-blue-200">
//               <AiOutlineLock className="ml-2 text-gray-400" />
//               <input
//                 id="password"
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 value={formik.values.password}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className="mt-1 w-full p-2 border-0 focus:outline-none"
//                 placeholder="Enter your password"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((prev) => !prev)}
//                 className="mr-2"
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//               >
//                 {showPassword ? <AiFillEyeInvisible className="text-gray-400" /> : <AiFillEye className="text-gray-400" />}
//               </button>
//             </div>
//             {formik.touched.password && formik.errors.password && (
//               <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2 px-4 text-white font-bold rounded-md transition duration-300 ease-in-out ${
//               loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
//             } focus:outline-none focus:ring focus:ring-blue-300`}
//           >
//             {loading ? "Signing In..." : "Sign In"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
// import { useFormik } from "formik";
// import * as yup from "yup";
// import { AppDispatch, RootState } from "../../Redux/store";
// import { useDispatch, useSelector } from "react-redux";
// import { Loginfn } from "../../Redux/Auth/LoginSlice";
// import { AiOutlineMail, AiOutlineLock, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
// import { useState } from "react";
// import toast, { Toaster } from "react-hot-toast"; // Import react-hot-toast

// const Login = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { loading, error } = useSelector((state: RootState) => state.loginSlice);
//   const [showPassword, setShowPassword] = useState(false);

//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//     },
//     validationSchema: yup.object({
//       email: yup.string().email("Invalid email address").required("Email is required"),
//       password: yup
//         .string()
//         .min(6, "Password must be at least 6 characters")
//         .required("Password is required"),
//     }),
//     onSubmit: async (values, { resetForm }) => {
//       try {
//         await dispatch(Loginfn(values)).unwrap(); // Dispatch Redux action
//         toast.success("Login successful!"); // Show success toast
//         resetForm();
//       } catch (error) {
//         toast.error(error?.messege || "Failed to login. Please try again letter.");
//       }
//     },
//   });

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <Toaster position="top-right" reverseOrder={false} /> {/* Toast notifications */}

//       <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
//         <div className="text-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">Welcome back</h1>
//           <p className="text-gray-600 my-3 font-bold text-md">Enter your credentials to sign in</p>
//         </div>

//         <form onSubmit={formik.handleSubmit} className="space-y-4">
//           {/* Email Field */}
//           <div>
//             <label htmlFor="email" className="block text-gray-700 text-sm font-medium">Email</label>
//             <div className="flex items-center border border-gray-300 rounded-md focus-within:ring focus-within:ring-blue-200">
//               <AiOutlineMail className="ml-2 text-gray-400" />
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formik.values.email}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className="mt-1 w-full p-2 border-0 focus:outline-none"
//                 placeholder="Enter your email"
//               />
//             </div>
//             {formik.touched.email && formik.errors.email && (
//               <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
//             )}
//           </div>

//           {/* Password Field */}
//           <div>
//             <label htmlFor="password" className="block text-gray-700 text-sm font-medium">Password</label>
//             <div className="flex items-center border border-gray-300 rounded-md focus-within:ring focus-within:ring-blue-200">
//               <AiOutlineLock className="ml-2 text-gray-400" />
//               <input
//                 id="password"
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 value={formik.values.password}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className="mt-1 w-full p-2 border-0 focus:outline-none"
//                 placeholder="Enter your password"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((prev) => !prev)}
//                 className="mr-2"
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//               >
//                 {showPassword ? <AiFillEyeInvisible className="text-gray-400" /> : <AiFillEye className="text-gray-400" />}
//               </button>
//             </div>
//             {formik.touched.password && formik.errors.password && (
//               <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2 px-4 text-white font-bold rounded-md transition duration-300 ease-in-out ${
//               loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
//             } focus:outline-none focus:ring focus:ring-blue-300`}
//           >
//             {loading ? "Signing In..." : "Sign In"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;


import { useFormik } from "formik";
import * as yup from "yup";
import { AppDispatch, RootState } from "../../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Loginfn } from "../../Redux/Auth/LoginSlice";
import { AiOutlineMail, AiOutlineLock, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

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
      navigate("/");
    }
  }, [loginState.data?.message, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome back</h1>
          <p className="text-gray-600 my-3 font-bold text-md">Enter your credentials to sign in</p>
        </div>

        {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-md focus-within:ring focus-within:ring-blue-200">
              <AiOutlineMail className="ml-2 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 w-full p-2 border-0 focus:outline-none"
                placeholder="Enter your email"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password Field */}
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
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="mr-2"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <AiFillEyeInvisible className="text-gray-400" /> : <AiFillEye className="text-gray-400" />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white font-bold rounded-md transition duration-300 ease-in-out ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
            } focus:outline-none focus:ring focus:ring-blue-300`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

