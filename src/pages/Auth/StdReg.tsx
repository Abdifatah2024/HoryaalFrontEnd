// import { useFormik } from "formik";
// import * as yup from "yup";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { FiSearch } from "react-icons/fi";

// import {
//   createStudent,
//   updateStudent,
//   getStudentById,
//   clearStudent,
//   fetchSiblingStudentByPhone,
//   clearSibling,
// } from "../../Redux/Auth/RegstdSlice";

// import { AppDispatch, RootState } from "../../Redux/store";

// const StudentForm = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const studentState = useSelector((state: RootState) => state.StdRegSlice);

//   const [editing, setEditing] = useState(false);
//   const [searchId, setSearchId] = useState("");
//   const [prefilled, setPrefilled] = useState(false);

//   const formik = useFormik({
//     initialValues: {
//       id: 0,
//       firstname: "",
//       middlename: "",
//       lastname: "",
//       fourtname: "",
//       classId: "",
//       phone: "",
//       phone2: "",
//       bus: "",
//       address: "",
//       previousSchool: "",
//       previousSchoolType: "",
//       motherName: "",
//       gender: "",
//       age: 0,
//       fee: 0,
//     },
//     validationSchema: yup.object({
//       firstname: yup.string().required("First name is required"),
//       lastname: yup.string().required("Last name is required"),
//       classId: yup.string().required("Class is required"),
//       phone: yup
//         .string()
//         .matches(/^[0-9]+$/, "Phone must be digits only")
//         .required("Phone is required"),
//       gender: yup.string().oneOf(["Male", "Female"]).required("Gender is required"),
//       previousSchoolType: yup
//         .string()
//         .oneOf(["PRIVATE", "PUBLIC", "NOT_SPECIFIC"])
//         .required("School type is required"),
//       age: yup.number().min(3, "Minimum age is 3").required("Age is required"),
//       fee: yup.number().required("Fee is required"),
//     }),
//     onSubmit: async (values, { resetForm, setSubmitting }) => {
//       const payload = {
//         ...values,
//         fullname: `${values.firstname} ${values.middlename} ${values.lastname} ${values.fourtname}`.trim(),
//         classId: (values.classId),
//         age: Number(values.age),
//         fee: Number(values.fee),
//         previousSchoolType: values.previousSchoolType || "NOT_SPECIFIC",
//       };

//       try {
//         if (editing) {
//           const res = await dispatch(updateStudent({ studentId: values.id, studentData: payload }));
//           if (updateStudent.fulfilled.match(res)) {
//             toast.success("Student updated!");
//             resetForm();
//             setEditing(false);
//             dispatch(clearStudent());
//           }
//         } else {
//           const res = await dispatch(createStudent(payload));
//           if (createStudent.fulfilled.match(res)) {
//             toast.success("Student registered!");
//             resetForm();
//             dispatch(clearSibling());
//             setPrefilled(false);
//           }
//         }
//       } catch {
//         toast.error("Something went wrong!");
//       } finally {
//         setSubmitting(false);
//       }
//     },
//   });

//   // Auto fee based on bus
//   useEffect(() => {
//     if (!editing) {
//       const autoFee = formik.values.bus.trim() ? 43 : 28;
//       if (formik.values.fee !== autoFee) {
//         formik.setFieldValue("fee", autoFee);
//       }
//     }
//   }, [formik.values.bus, editing]);

//   // Fetch sibling by phone
// useEffect(() => {
//   const phone = formik.values.phone.trim();
//   if (phone.length >= 9 && !editing && !prefilled) {
//     dispatch(fetchSiblingStudentByPhone(phone));
//   }
// }, [formik, formik.values.phone, editing, prefilled, dispatch]);

//   // Prefill from sibling
//   useEffect(() => {
//     const s = studentState.siblingStudent;
//     if (s && !editing && !prefilled) {
//       formik.setValues({
//         ...formik.values,
//         middlename: s.middlename || "",
//         lastname: s.lastname || "",
//         fourtname: s.fourthname || "",
//         phone2: s.phone2 || "",
//         bus: s.bus || "",
//         address: s.address || "",
//         previousSchool: s.previousSchool || "",
//         previousSchoolType: s.previousSchoolType || "NOT_SPECIFIC",
//         motherName: s.motherName || "",
//         gender: s.gender || "",
//         age: s.age || 0,
//         fee: s.fee || 0,
//         firstname: "",
//         classId: "",
//       });
//       toast.success("Sibling data auto-filled.");
//       setPrefilled(true);
//     }
//   }, [studentState.siblingStudent]);

//   // Prefill for editing
//  useEffect(() => {
//   const s = studentState.student;
//   if (s) {
//     formik.setValues({
//       id: s.id,
//       firstname: s.firstname || "",
//       middlename: s.middlename || "",
//       lastname: s.lastname || "",
//       fourtname: s.fourtname || "",
//       classId: s.classId.toString(),
//       phone: s.phone || "",
//       phone2: s.phone2 || "",
//       bus: s.bus || "",
//       address: s.address || "",
//       previousSchool: s.previousSchool || "",
//       previousSchoolType: s.previousSchoolType || "NOT_SPECIFIC",
//       motherName: s.motherName || "",
//       gender: s.gender || "",
//       age: s.age || 0,
//       fee: s.fee || 0,
//     });
//     setEditing(true);
//   }
// }, [studentState.student, formik]); // 👈 include 'formik'

//   // Handle errors
//   useEffect(() => {
//     if (studentState.error) {
//       toast.error(studentState.error);
//     }
//   }, [studentState.error]);

//   const handleSearch = () => {
//     if (searchId.trim()) {
//       dispatch(getStudentById(searchId)).then((action) => {
//         if (getStudentById.fulfilled.match(action)) {
//           toast.success("Student found!");
//         } else {
//           toast.error("Student not found.");
//         }
//       });
//     }
//   };

//   const classList = [
//     { id: 1, name: "1A" }, { id: 2, name: "1B" }, { id: 3, name: "1C" },
//     { id: 4, name: "1D" }, { id: 5, name: "1E" }, { id: 6, name: "1F" },
//     { id: 7, name: "2A" }, { id: 8, name: "2B" }, { id: 9, name: "2C" },
//     { id: 10, name: "2D" }, { id: 11, name: "2E" }, { id: 12, name: "2F" },
//     { id: 13, name: "3A" }, { id: 14, name: "3B" }, { id: 15, name: "3C" },
//     { id: 16, name: "3D" }, { id: 17, name: "3E" }, { id: 18, name: "4A" },
//     { id: 19, name: "4B" }, { id: 20, name: "4C" }, { id: 21, name: "4D" },
//   ];

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-6">
//       <div className="bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-xl font-bold mb-4 text-gray-800">
//           {editing ? "Edit Student" : "Register New Student"}
//         </h2>

//         {!editing && (
//           <div className="mb-6">
//             <label className="block text-sm font-medium mb-1">Search by ID</label>
//             <div className="flex items-center gap-2">
//               <input
//                 type="text"
//                 value={searchId}
//                 onChange={(e) => setSearchId(e.target.value)}
//                 className="border px-3 py-2 rounded w-full text-sm"
//                 placeholder="Enter student ID"
//               />
//               <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
//                 <FiSearch />
//               </button>
//             </div>
//           </div>
//         )}

//         <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {[
//             "firstname", "middlename", "lastname", "fourtname",
//             "phone", "phone2", "bus", "address",
//             "previousSchool", "motherName"
//           ].map((name) => (
//             <div key={name}>
//               <label className="text-sm block mb-1 capitalize">{name}</label>
//               <input
//                 name={name}
//                 value={formik.values[name as keyof typeof formik.values] as string}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className="w-full border px-3 py-2 rounded text-sm"
//                 placeholder={`Enter ${name}`}
//                 type="text"
//               />
//               {formik.touched[name as keyof typeof formik.values] && formik.errors[name as keyof typeof formik.values] && (
//                 <p className="text-red-500 text-sm mt-0.5">{formik.errors[name as keyof typeof formik.values]}</p>
//               )}
//             </div>
//           ))}

//           {/* Age */}
//           <div>
//             <label className="text-sm block mb-1">Age</label>
//             <input
//               name="age"
//               value={formik.values.age}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               type="number"
//               className="w-full border px-3 py-2 rounded text-sm"
//             />
//             {formik.touched.age && formik.errors.age && (
//               <p className="text-red-500 text-sm mt-0.5">{formik.errors.age}</p>
//             )}
//           </div>

//           {/* Fee */}
//           <div>
//             <label className="text-sm block mb-1">Fee</label>
//             <input
//               name="fee"
//               value={formik.values.fee}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               type="number"
//               className="w-full border px-3 py-2 rounded text-sm"
//             />
//             {formik.touched.fee && formik.errors.fee && (
//               <p className="text-red-500 text-sm mt-0.5">{formik.errors.fee}</p>
//             )}
//           </div>

//           {/* Class */}
//           <div>
//             <label className="text-sm block mb-1">Class</label>
//             <select
//               name="classId"
//               value={formik.values.classId}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               className="w-full border px-3 py-2 rounded text-sm"
//             >
//               <option value="">Select Class</option>
//               {classList.map((cls) => (
//                 <option key={cls.id} value={cls.id}>
//                   {cls.name}
//                 </option>
//               ))}
//             </select>
//             {formik.touched.classId && formik.errors.classId && (
//               <p className="text-red-500 text-sm mt-0.5">{formik.errors.classId}</p>
//             )}
//           </div>

//           {/* Gender */}
//           <div>
//             <label className="text-sm block mb-1">Gender</label>
//             <select
//               name="gender"
//               value={formik.values.gender}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               className="w-full border px-3 py-2 rounded text-sm"
//             >
//               <option value="">Select Gender</option>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//             </select>
//             {formik.touched.gender && formik.errors.gender && (
//               <p className="text-red-500 text-sm mt-0.5">{formik.errors.gender}</p>
//             )}
//           </div>

//           {/* Previous School Type */}
//           <div>
//             <label className="text-sm block mb-1">Previous School Type</label>
//             <select
//               name="previousSchoolType"
//               value={formik.values.previousSchoolType}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               className="w-full border px-3 py-2 rounded text-sm"
//             >
//               <option value="">Select Type</option>
//               <option value="PRIVATE">Private</option>
//               <option value="PUBLIC">Public</option>
//               <option value="NOT_SPECIFIC">Not Specific</option>
//             </select>
//             {formik.touched.previousSchoolType && formik.errors.previousSchoolType && (
//               <p className="text-red-500 text-sm mt-0.5">{formik.errors.previousSchoolType}</p>
//             )}
//           </div>

//           {/* Submit & Cancel */}
//           <div className="md:col-span-2 flex items-center justify-between mt-6">
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-6 py-2 rounded text-sm"
//               disabled={formik.isSubmitting || studentState.loading}
//             >
//               {formik.isSubmitting || studentState.loading
//                 ? "Processing..."
//                 : editing
//                 ? "Update Student"
//                 : "Register Student"}
//             </button>

//             {editing && (
//               <button
//                 type="button"
//                 onClick={() => {
//                   const confirm = window.confirm("Are you sure you want to cancel editing?");
//                   if (confirm) {
//                     formik.resetForm();
//                     setEditing(false);
//                     dispatch(clearStudent());
//                     setPrefilled(false);
//                   }
//                 }}
//                 className="text-red-600 underline text-sm"
//               >
//                 Cancel Edit
//               </button>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default StudentForm;
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiSearch } from "react-icons/fi";

import {
  createStudent,
  updateStudent,
  getStudentById,
  clearStudent,
  fetchSiblingStudentByPhone,
  clearSibling,
} from "../../Redux/Auth/RegstdSlice";

import { AppDispatch, RootState } from "../../Redux/store";

const StudentForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const studentState = useSelector((state: RootState) => state.StdRegSlice);

  const [editing, setEditing] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [prefilled, setPrefilled] = useState(false);

  const formik = useFormik({
    initialValues: {
      id: 0,
      firstname: "",
      middlename: "",
      lastname: "",
      fourtname: "",
      classId: "",
      phone: "",
      phone2: "",
      bus: "",
      address: "",
      previousSchool: "",
      previousSchoolType: "",
      motherName: "",
      gender: "",
      age: 0,
      fee: 0,
    },
    validationSchema: yup.object({
      firstname: yup.string().required("First name is required"),
      lastname: yup.string().required("Last name is required"),
      classId: yup.string().required("Class is required"),
      phone: yup
        .string()
        .matches(/^[0-9]+$/, "Phone must be digits only")
        .required("Phone is required"),
      gender: yup.string().oneOf(["Male", "Female"]).required("Gender is required"),
      previousSchoolType: yup
        .string()
        .oneOf(["PRIVATE", "PUBLIC", "NOT_SPECIFIC"])
        .required("School type is required"),
      age: yup.number().min(3, "Minimum age is 3").required("Age is required"),
      fee: yup.number().required("Fee is required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const payload = {
        ...values,
        fullname: `${values.firstname} ${values.middlename} ${values.lastname} ${values.fourtname}`.trim(),
        classId: values.classId,
        age: Number(values.age),
        fee: Number(values.fee),
        previousSchoolType: values.previousSchoolType || "NOT_SPECIFIC",
      };

      try {
        if (editing) {
          const res = await dispatch(updateStudent({ studentId: values.id, studentData: payload }));
          if (updateStudent.fulfilled.match(res)) {
            toast.success("Student updated!");
            resetForm();
            setEditing(false);
            dispatch(clearStudent());
          }
        } else {
          const res = await dispatch(createStudent(payload));
          if (createStudent.fulfilled.match(res)) {
            toast.success("Student registered!");
            resetForm();
            dispatch(clearSibling());
            setPrefilled(false);
          }
        }
      } catch {
        toast.error("Something went wrong!");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Auto fee based on bus
  useEffect(() => {
    if (!editing) {
      const autoFee = formik.values.bus.trim() ? 43 : 28;
      if (formik.values.fee !== autoFee) {
        formik.setFieldValue("fee", autoFee);
      }
    }
  }, [formik.values.bus, editing, formik]);

  // Fetch sibling by phone
  useEffect(() => {
    const phone = formik.values.phone.trim();
    if (phone.length >= 9 && !editing && !prefilled) {
      dispatch(fetchSiblingStudentByPhone(phone));
    }
  }, [formik, formik.values.phone, editing, prefilled, dispatch]);

  // Prefill from sibling
  useEffect(() => {
    const s = studentState.siblingStudent;
    if (s && !editing && !prefilled) {
      formik.setValues({
        ...formik.values,
        middlename: s.middlename || "",
        lastname: s.lastname || "",
        fourtname: s.fourthname || "",
        phone2: s.phone2 || "",
        bus: s.bus || "",
        address: s.address || "",
        previousSchool: s.previousSchool || "",
        previousSchoolType: s.previousSchoolType || "NOT_SPECIFIC",
        motherName: s.motherName || "",
        gender: s.gender || "",
        age: s.age || 0,
        fee: s.fee || 0,
        firstname: "",
        classId: "",
      });
      toast.success("Sibling data auto-filled.");
      setPrefilled(true);
    }
  }, [studentState.siblingStudent, editing, prefilled, formik]);

  // Prefill for editing
  useEffect(() => {
    const s = studentState.student;
    if (s) {
      formik.setValues({
        id: s.id,
        firstname: s.firstname || "",
        middlename: s.middlename || "",
        lastname: s.lastname || "",
        fourtname: s.fourtname || "",
        classId: s.classId.toString(),
        phone: s.phone || "",
        phone2: s.phone2 || "",
        bus: s.bus || "",
        address: s.address || "",
        previousSchool: s.previousSchool || "",
        previousSchoolType: s.previousSchoolType || "NOT_SPECIFIC",
        motherName: s.motherName || "",
        gender: s.gender || "",
        age: s.age || 0,
        fee: s.fee || 0,
      });
      setEditing(true);
    }
  }, [studentState.student, formik]);

  // Handle errors
  useEffect(() => {
    if (studentState.error) {
      toast.error(studentState.error);
    }
  }, [studentState.error]);

  const handleSearch = () => {
    if (searchId.trim()) {
      dispatch(getStudentById(searchId)).then((action) => {
        if (getStudentById.fulfilled.match(action)) {
          toast.success("Student found!");
        } else {
          toast.error("Student not found.");
        }
      });
    }
  };

  const classList = [
    { id: 1, name: "1A" }, { id: 2, name: "1B" }, { id: 3, name: "1C" },
    { id: 4, name: "1D" }, { id: 5, name: "1E" }, { id: 6, name: "1F" },
    { id: 7, name: "2A" }, { id: 8, name: "2B" }, { id: 9, name: "2C" },
    { id: 10, name: "2D" }, { id: 11, name: "2E" }, { id: 12, name: "2F" },
    { id: 13, name: "3A" }, { id: 14, name: "3B" }, { id: 15, name: "3C" },
    { id: 16, name: "3D" }, { id: 17, name: "3E" }, { id: 18, name: "4A" },
    { id: 19, name: "4B" }, { id: 20, name: "4C" }, { id: 21, name: "4D" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-xl p-8">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-900 text-center">
          {editing ? "Edit Student Information" : "Register New Student"}
        </h2>

        {!editing && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <label htmlFor="searchId" className="block text-lg font-semibold mb-2 text-blue-800">Search Student by ID</label>
            <div className="flex items-center gap-3">
              <input
                id="searchId"
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="flex-grow border border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2 rounded-lg text-base transition duration-200"
                placeholder="e.g., 12345"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 transition duration-200 shadow-md"
                aria-label="Search Student"
              >
                <FiSearch className="text-xl" />
                Search
              </button>
            </div>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            "firstname", "middlename", "lastname", "fourtname",
            "phone", "phone2", "bus", "address",
            "previousSchool", "motherName"
          ].map((name) => (
            <div key={name} className="relative">
              <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1 block capitalize">
                {name === "fourtname" ? "Fourth Name" : name === "phone" ? "Primary Phone" : name === "phone2" ? "Secondary Phone" : name.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                id={name}
                name={name}
                value={formik.values[name as keyof typeof formik.values] as string}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border ${formik.touched[name as keyof typeof formik.values] && formik.errors[name as keyof typeof formik.values] ? 'border-red-400' : 'border-gray-300'} px-4 py-2 rounded-md text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-150`}
                placeholder={`Enter ${name === "fourtname" ? "fourth name" : name.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
                type="text"
              />
              {formik.touched[name as keyof typeof formik.values] && formik.errors[name as keyof typeof formik.values] && (
                <p className="text-red-600 text-xs mt-1 absolute -bottom-5 left-0">{formik.errors[name as keyof typeof formik.values]}</p>
              )}
            </div>
          ))}

          {/* Age */}
          <div className="relative">
            <label htmlFor="age" className="text-sm font-medium text-gray-700 mb-1 block">Age</label>
            <input
              id="age"
              name="age"
              value={formik.values.age}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="number"
              className={`w-full border ${formik.touched.age && formik.errors.age ? 'border-red-400' : 'border-gray-300'} px-4 py-2 rounded-md text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-150`}
              placeholder="Enter age"
            />
            {formik.touched.age && formik.errors.age && (
              <p className="text-red-600 text-xs mt-1 absolute -bottom-5 left-0">{formik.errors.age}</p>
            )}
          </div>

          {/* Fee */}
          <div className="relative">
            <label htmlFor="fee" className="text-sm font-medium text-gray-700 mb-1 block">Fee</label>
            <input
              id="fee"
              name="fee"
              value={formik.values.fee}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="number"
              className={`w-full border ${formik.touched.fee && formik.errors.fee ? 'border-red-400' : 'border-gray-300'} px-4 py-2 rounded-md text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-150`}
              placeholder="Enter fee"
            />
            {formik.touched.fee && formik.errors.fee && (
              <p className="text-red-600 text-xs mt-1 absolute -bottom-5 left-0">{formik.errors.fee}</p>
            )}
          </div>

          {/* Class */}
          <div className="relative">
            <label htmlFor="classId" className="text-sm font-medium text-gray-700 mb-1 block">Class</label>
            <select
              id="classId"
              name="classId"
              value={formik.values.classId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full border ${formik.touched.classId && formik.errors.classId ? 'border-red-400' : 'border-gray-300'} px-4 py-2 rounded-md text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-150`}
            >
              <option value="">Select Class</option>
              {classList.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
            {formik.touched.classId && formik.errors.classId && (
              <p className="text-red-600 text-xs mt-1 absolute -bottom-5 left-0">{formik.errors.classId}</p>
            )}
          </div>

          {/* Gender */}
          <div className="relative">
            <label htmlFor="gender" className="text-sm font-medium text-gray-700 mb-1 block">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full border ${formik.touched.gender && formik.errors.gender ? 'border-red-400' : 'border-gray-300'} px-4 py-2 rounded-md text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-150`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {formik.touched.gender && formik.errors.gender && (
              <p className="text-red-600 text-xs mt-1 absolute -bottom-5 left-0">{formik.errors.gender}</p>
            )}
          </div>

          {/* Previous School Type */}
          <div className="relative">
            <label htmlFor="previousSchoolType" className="text-sm font-medium text-gray-700 mb-1 block">Previous School Type</label>
            <select
              id="previousSchoolType"
              name="previousSchoolType"
              value={formik.values.previousSchoolType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full border ${formik.touched.previousSchoolType && formik.errors.previousSchoolType ? 'border-red-400' : 'border-gray-300'} px-4 py-2 rounded-md text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-150`}
            >
              <option value="">Select Type</option>
              <option value="PRIVATE">Private</option>
              <option value="PUBLIC">Public</option>
              <option value="NOT_SPECIFIC">Not Specific</option>
            </select>
            {formik.touched.previousSchoolType && formik.errors.previousSchoolType && (
              <p className="text-red-600 text-xs mt-1 absolute -bottom-5 left-0">{formik.errors.previousSchoolType}</p>
            )}
          </div>

          {/* Submit & Cancel */}
          <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-end gap-4 mt-8 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={formik.isSubmitting || studentState.loading}
            >
              {formik.isSubmitting || studentState.loading
                ? "Processing..."
                : editing
                  ? "Update Student"
                  : "Register Student"}
            </button>

            {editing && (
              <button
                type="button"
                onClick={() => {
                  const confirmCancel = window.confirm("Are you sure you want to cancel editing?");
                  if (confirmCancel) {
                    formik.resetForm();
                    setEditing(false);
                    dispatch(clearStudent());
                    dispatch(clearSibling()); // Clear sibling data on cancel edit
                    setPrefilled(false);
                  }
                }}
                className="w-full sm:w-auto text-red-600 hover:text-red-800 font-medium px-4 py-2 underline transition duration-200 ease-in-out"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;