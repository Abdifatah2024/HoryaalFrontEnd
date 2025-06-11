// import { useFormik } from "formik";
// import * as yup from "yup";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   AiOutlineMail,
//   AiOutlineLock,
//   AiFillEye,
//   AiFillEyeInvisible,
//   AiOutlineUser,
//   AiOutlinePhone,
// } from "react-icons/ai";
// import { FiSearch } from "react-icons/fi";
// import { useEffect, useState } from "react";
// import { AppDispatch, RootState } from "../Redux/store";
// import {
//   Registerfn,
//   updateUser,
//   getUserById,
//   clearUser,
// } from "../Redux/Auth/RegisterSlice";
// import toast from "react-hot-toast";

// const Register = () => {
//   const toastId = "register";
//   const dispatch = useDispatch<AppDispatch>();
//   const RegisterState = useSelector((state: RootState) => state.registerSlice);

//   const [showPassword, setShowPassword] = useState(false);
//   const [editing, setEditing] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState("");
//   const [searchId, setSearchId] = useState("");

//   const formik = useFormik({
//     initialValues: {
//       id: "",
//       username: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       fullName: "",
//       phoneNumber: "",
//     },
//     validationSchema: yup.object({
//       fullName: yup.string().required("Full Name is required"),
//       username: yup.string().required("Username is required"),
//       email: yup.string().email("Invalid email").required("Email is required"),
//       phoneNumber: yup.string().required("Phone number is required"),
//       password: yup.string().when("id", {
//         is: (val: string) => !val,
//         then: (schema) =>
//           schema.min(6, "Password must be at least 6 characters.").required("Password is required"),
//         otherwise: (schema) => schema.notRequired(),
//       }),
//       confirmPassword: yup.string().when("id", {
//         is: (val: string) => !val,
//         then: (schema) =>
//           schema.oneOf([yup.ref("password")], "Passwords must match").required("Confirm Password is required"),
//         otherwise: (schema) => schema.notRequired(),
//       }),
//     }),
//     onSubmit(values, { resetForm }) {
//       if (editing) {
//         const { password, confirmPassword, ...userData } = values;
//         dispatch(updateUser({ userId: values.id, userData })).then((action) => {
//           if (updateUser.fulfilled.match(action)) {
//             toast.success("User updated successfully!", { id: toastId });
//             resetForm();
//             dispatch(clearUser());
//             setEditing(false);
//           }
//         });
//       } else {
//         dispatch(Registerfn(values)).then((action) => {
//           if (Registerfn.fulfilled.match(action)) {
//             toast.success("Registration Successful!", { id: toastId });
//             resetForm();
//           }
//         });
//       }
//     },
//   });

//   useEffect(() => {
//     const strength = calculatePasswordStrength(formik.values.password);
//     setPasswordStrength(strength);
//   }, [formik.values.password]);

//   const calculatePasswordStrength = (password: string) => {
//     if (password.length === 0) return "";
//     if (password.length < 6) return "Weak";
//     if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
//       return "Strong";
//     }
//     return "Medium";
//   };

//   useEffect(() => {
//     if (RegisterState.user) {
//       formik.setValues({
//         id: RegisterState.user.id || "",
//         fullName: RegisterState.user.fullName || "",
//         username: RegisterState.user.email || "",
//         email: RegisterState.user.email || "",
//         phoneNumber: RegisterState.user.phoneNumber || "",
//         password: "",
//         confirmPassword: "",
//       });
//       setEditing(true);
//     }
//   }, [RegisterState.user]);

//   useEffect(() => {
//     if (RegisterState.error) {
//       toast.error(RegisterState.error, { id: toastId });
//     }
//   }, [RegisterState.error]);

//   const handleSearch = () => {
//     if (searchId.trim()) {
//       dispatch(getUserById(searchId)).then((action) => {
//         if (getUserById.fulfilled.match(action)) {
//           toast.success("User found!", { id: toastId });
//         } else {
//           toast.error("User not found", { id: toastId });
//         }
//       });
//     }
//   };

//   return (
//     <div className={`min-h-screen flex items-center justify-center py-10 px-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100"}`}>
//       <div className={`w-full max-w-3xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md`}>
//         <h2 className="text-2xl font-bold mb-6">{editing ? "Edit User" : "Register User"}</h2>

//         {!editing && (
//           <div className="mb-6 border bg-gray-50 dark:bg-gray-700 p-4 rounded-md shadow-sm">
//             <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-3 flex items-center gap-2">
//               <FiSearch className="text-blue-500" />
//               Search for User ID to Edit
//             </h3>
//             <div className="flex flex-col sm:flex-row gap-3">
//               <div className="relative w-full">
//                 <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Enter User ID"
//                   value={searchId}
//                   onChange={(e) => setSearchId(e.target.value)}
//                   className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white dark:bg-gray-700 dark:text-white"
//                 />
//               </div>
//               <button
//                 onClick={handleSearch}
//                 type="button"
//                 className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
//               >
//                 Search
//               </button>
//             </div>
//             <p className="text-xs text-gray-500 dark:text-gray-300 mt-2">Enter a valid user ID to auto-fill the form.</p>
//           </div>
//         )}

//         <form onSubmit={formik.handleSubmit} className="space-y-4">
//           {[
//             { name: "fullName", label: "Full Name", icon: <AiOutlineUser /> },
//             { name: "username", label: "Username", icon: <AiOutlineUser /> },
//             { name: "email", label: "Email", icon: <AiOutlineMail /> },
//             { name: "phoneNumber", label: "Phone Number", icon: <AiOutlinePhone /> },
//           ].map(({ name, label, icon }) => (
//             <div key={name}>
//               <label htmlFor={name} className="block text-sm font-medium mb-1">{label}</label>
//               <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md px-3">
//                 <span className="text-gray-400">{icon}</span>
//                 <input
//                   id={name}
//                   name={name}
//                   type="text"
//                   value={formik.values[name as keyof typeof formik.values]}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   className="w-full p-2 border-0 bg-transparent focus:outline-none text-sm dark:text-white"
//                   placeholder={`Enter ${label}`}
//                 />
//               </div>
//               {formik.touched[name as keyof typeof formik.touched] &&
//                 formik.errors[name as keyof typeof formik.errors] && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {formik.errors[name as keyof typeof formik.errors]}
//                   </p>
//               )}
//             </div>
//           ))}

//           {!editing && (
//             <>
//               {["password", "confirmPassword"].map((field) => (
//                 <div key={field}>
//                   <label htmlFor={field} className="block text-sm font-medium mb-1">
//                     {field === "password" ? "Password" : "Confirm Password"}
//                   </label>
//                   <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md px-3">
//                     <AiOutlineLock className="text-gray-400" />
//                     <input
//                       id={field}
//                       name={field}
//                       type={showPassword ? "text" : "password"}
//                       value={formik.values[field as keyof typeof formik.values]}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       className="w-full p-2 border-0 bg-transparent focus:outline-none text-sm dark:text-white"
//                       placeholder={`Enter ${field}`}
//                     />
//                     <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
//                       {showPassword ? <AiFillEyeInvisible className="text-gray-400" /> : <AiFillEye className="text-gray-400" />}
//                     </button>
//                   </div>
//                   {formik.touched[field as keyof typeof formik.touched] &&
//                     formik.errors[field as keyof typeof formik.errors] && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {formik.errors[field as keyof typeof formik.errors]}
//                       </p>
//                   )}
//                 </div>
//               ))}
//               {passwordStrength && (
//                 <div className="text-sm mt-1">
//                   Password Strength:{" "}
//                   <span
//                     className={`font-semibold ${
//                       passwordStrength === "Weak"
//                         ? "text-red-500"
//                         : passwordStrength === "Medium"
//                         ? "text-yellow-500"
//                         : "text-green-500"
//                     }`}
//                   >
//                     {passwordStrength}
//                   </span>
//                 </div>
//               )}
//             </>
//           )}

//           <div className="flex items-center justify-between mt-6">
//             <button
//               type="submit"
//               className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium w-full"
//               disabled={RegisterState.loading}
//             >
//               {RegisterState.loading ? "Processing..." : editing ? "Update User" : "Register"}
//             </button>
//           </div>

//           {editing && (
//             <div className="text-right mt-2">
//               <button
//                 type="button"
//                 className="text-sm text-red-500 underline"
//                 onClick={() => {
//                   setEditing(false);
//                   dispatch(clearUser());
//                   formik.resetForm();
//                 }}
//               >
//                 Cancel Edit
//               </button>
//             </div>
//           )}

//           <div className="text-right mt-6">
//             <button
//               type="button"
//               onClick={() => setDarkMode(!darkMode)}
//               className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-300"
//             >
//               {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineMail,
  AiOutlineLock,
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlineUser,
  AiOutlinePhone,
} from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../Redux/store";
import {
  Registerfn,
  updateUser,
  getUserById,
  clearUser,
} from "../Redux/Auth/RegisterSlice";
import { updateUserRole } from "../pages/Employee/registerRoleThunk";
import toast from "react-hot-toast";

const Register = () => {
  const toastId = "register";
  const dispatch = useDispatch<AppDispatch>();
  const RegisterState = useSelector((state: RootState) => state.registerSlice);

  const [showPassword, setShowPassword] = useState(false);
  const [editing, setEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [searchId, setSearchId] = useState("");

  const formik = useFormik({
    initialValues: {
      id: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phoneNumber: "",
      role: "USER",
    },
    validationSchema: yup.object({
      fullName: yup.string().required("Full Name is required"),
      username: yup.string().required("Username is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      phoneNumber: yup.string().required("Phone number is required"),
      role: yup.string().oneOf(["ADMIN", "USER"]).required("Role is required"),
      password: yup.string().when("id", {
        is: (val: string) => !val,
        then: (schema) =>
          schema.min(6, "Password must be at least 6 characters.").required("Password is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      confirmPassword: yup.string().when("id", {
        is: (val: string) => !val,
        then: (schema) =>
          schema.oneOf([yup.ref("password")], "Passwords must match").required("Confirm Password is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
   onSubmit(values, { resetForm }) {
  if (editing) {
    const { role, ...userData } = values;

    dispatch(updateUser({ userId: values.id, userData })).then((action) => {
      if (updateUser.fulfilled.match(action)) {
        if (role === "ADMIN" || role === "USER") {
          dispatch(updateUserRole({ userId: values.id, role }));
        }
        toast.success("User updated successfully!", { id: toastId });
        resetForm();
        dispatch(clearUser());
        setEditing(false);
      }
    });
  } else {
    const registerPayload = {
      username: values.username,
      email: values.email,
      password: values.password,
      fullName: values.fullName,
      phoneNumber: values.phoneNumber,
      Role: values.role as "ADMIN" | "USER",
      photoUrl: "", // add actual photo URL if needed
    };

    dispatch(Registerfn(registerPayload)).then((action) => {
      if (Registerfn.fulfilled.match(action)) {
        toast.success("Registration Successful!", { id: toastId });
        resetForm();
      }
    });
  }
}

  });

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
        username: RegisterState.user.email || "",
        email: RegisterState.user.email || "",
        phoneNumber: RegisterState.user.phoneNumber || "",
        role: RegisterState.user.Role || "USER",
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

  const handleSearch = () => {
    if (searchId.trim()) {
      dispatch(getUserById(searchId)).then((action) => {
        if (getUserById.fulfilled.match(action)) {
          toast.success("User found!", { id: toastId });
        } else {
          toast.error("User not found", { id: toastId });
        }
      });
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-10 px-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100"}`}>
      <div className={`w-full max-w-3xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md`}>
        <h2 className="text-2xl font-bold mb-6">{editing ? "Edit User" : "Register User"}</h2>

        {!editing && (
          <div className="mb-6 border bg-gray-50 dark:bg-gray-700 p-4 rounded-md shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-3 flex items-center gap-2">
              <FiSearch className="text-blue-500" />
              Search for User ID to Edit
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter User ID"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                onClick={handleSearch}
                type="button"
                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
              >
                Search
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-300 mt-2">Enter a valid user ID to auto-fill the form.</p>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {[
            { name: "fullName", label: "Full Name", icon: <AiOutlineUser /> },
            { name: "username", label: "Username", icon: <AiOutlineUser /> },
            { name: "email", label: "Email", icon: <AiOutlineMail /> },
            { name: "phoneNumber", label: "Phone Number", icon: <AiOutlinePhone /> },
          ].map(({ name, label, icon }) => (
            <div key={name}>
              <label htmlFor={name} className="block text-sm font-medium mb-1">{label}</label>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md px-3">
                <span className="text-gray-400">{icon}</span>
                <input
                  id={name}
                  name={name}
                  type="text"
                  value={formik.values[name as keyof typeof formik.values]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 border-0 bg-transparent focus:outline-none text-sm dark:text-white"
                  placeholder={`Enter ${label}`}
                />
              </div>
              {formik.touched[name as keyof typeof formik.touched] &&
                formik.errors[name as keyof typeof formik.errors] && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors[name as keyof typeof formik.errors]}
                  </p>
              )}
            </div>
          ))}

          {editing && (
            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-1">Role</label>
              <select
                id="role"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              {formik.touched.role && formik.errors.role && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.role}</p>
              )}
            </div>
          )}

          {!editing && (
            <>
              {["password", "confirmPassword"].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-sm font-medium mb-1">
                    {field === "password" ? "Password" : "Confirm Password"}
                  </label>
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md px-3">
                    <AiOutlineLock className="text-gray-400" />
                    <input
                      id={field}
                      name={field}
                      type={showPassword ? "text" : "password"}
                      value={formik.values[field as keyof typeof formik.values]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full p-2 border-0 bg-transparent focus:outline-none text-sm dark:text-white"
                      placeholder={`Enter ${field}`}
                    />
                    <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? <AiFillEyeInvisible className="text-gray-400" /> : <AiFillEye className="text-gray-400" />}
                    </button>
                  </div>
                  {formik.touched[field as keyof typeof formik.touched] &&
                    formik.errors[field as keyof typeof formik.errors] && (
                      <p className="text-red-500 text-xs mt-1">
                        {formik.errors[field as keyof typeof formik.errors]}
                      </p>
                  )}
                </div>
              ))}
              {passwordStrength && (
                <div className="text-sm mt-1">
                  Password Strength:{" "}
                  <span
                    className={`font-semibold ${
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
            </>
          )}

          <div className="flex items-center justify-between mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium w-full"
              disabled={RegisterState.loading}
            >
              {RegisterState.loading ? "Processing..." : editing ? "Update User" : "Register"}
            </button>
          </div>

          {editing && (
            <div className="text-right mt-2">
              <button
                type="button"
                className="text-sm text-red-500 underline"
                onClick={() => {
                  setEditing(false);
                  dispatch(clearUser());
                  formik.resetForm();
                }}
              >
                Cancel Edit
              </button>
            </div>
          )}

          <div className="text-right mt-6">
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-300"
            >
              {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
