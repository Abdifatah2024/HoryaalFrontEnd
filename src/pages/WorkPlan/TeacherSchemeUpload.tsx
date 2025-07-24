// import { useFormik } from "formik";
// import * as yup from "yup";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import {
//   uploadPdfFn,
//   resetPdfState,
//   fetchDocuments,
//   deleteDocument,
// } from "../PdfFiles/PdfUploadSlice";
// import { AppDispatch, RootState } from "../../Redux/store";
// import toast, { Toaster } from "react-hot-toast";
// import {
//   FiUpload,
//   FiFile,
//   FiLoader,
//   FiX,
//   FiTrash2,
//   FiEye,
//   FiExternalLink,
//   FiXCircle,
//   FiPlusCircle,
// } from "react-icons/fi";
// import { motion } from "framer-motion";

// const TeacherSchemeUpload = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { loading, error, success, documents } = useSelector(
//     (state: RootState) => state.pdfUpload
//   );

//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [dragActive, setDragActive] = useState(false);

//   const validationSchema = yup.object({
//     title: yup
//       .string()
//       .required("Cinwaanka waa muhiim")
//       .max(60, "Cinwaanku waa inuu ka yar yahay 60 xaraf"),
//     pdf: yup
//       .mixed()
//       .required("Faylka PDF waa muhiim")
//       .test("fileType", "Kaliya faylalka PDF ayaa la oggol yahay", (value) => {
//         return value && (value as File).type === "application/pdf";
//       })
//       .test("fileSize", "Faylka wuu weyn yahay (ugu badnaan 10MB)", (value) => {
//         return value && (value as File).size <= 10 * 1024 * 1024;
//       }),
//   });

//   const formik = useFormik({
//     initialValues: {
//       title: "",
//       pdf: null as File | null,
//     },
//     validationSchema,
//     onSubmit: (values) => {
//       if (!values.pdf) return;
//       const formData = new FormData();
//       formData.append("title", values.title);
//       formData.append("pdf", values.pdf);
//       toast.loading("Faylka wuu soo dhacayaa...", { id: "uploading" });
//       dispatch(uploadPdfFn(formData));
//     },
//   });

//   useEffect(() => {
//     dispatch(fetchDocuments());
//   }, [dispatch]);

//   useEffect(() => {
//     if (error) {
//       toast.dismiss("uploading");
//       toast.error(error);
//       dispatch(resetPdfState());
//     }
//     if (success) {
//       toast.dismiss("uploading");
//       toast.success(success);
//       formik.resetForm();
//       setPreviewUrl(null);
//       dispatch(resetPdfState());
//       dispatch(fetchDocuments());
//     }
//   }, [error, success, dispatch, formik]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       formik.setFieldValue("pdf", file);
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//     e.target.value = "";
//   };

//   const handleDrag = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       const file = e.dataTransfer.files[0];
//       if (file.type === "application/pdf") {
//         formik.setFieldValue("pdf", file);
//         setPreviewUrl(URL.createObjectURL(file));
//       } else {
//         formik.setFieldError("pdf", "Kaliya faylalka PDF ayaa la oggol yahay");
//         toast.error("Fadlan soo geli PDF kaliya.");
//       }
//     }
//   };

//   const handleDelete = (id: number) => {
//     if (window.confirm("Ma hubtaa inaad tirtirayso faylkan?")) {
//       toast.loading("Faylka waa la tirtirayaa...", { id: "deleting" });
//       dispatch(deleteDocument(id))
//         .unwrap()
//         .then(() => {
//           toast.dismiss("deleting");
//           toast.success("Faylka si guul leh ayaa loo tirtiray");
//           dispatch(fetchDocuments());
//         })
//         .catch((err) => {
//           toast.dismiss("deleting");
//           toast.error(err.message || "Tirtiridda faylka way guuldarreysatay");
//         });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
//       <Toaster position="top-right" />

//       <motion.header
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="text-center mb-10 w-full max-w-4xl"
//       >
//         <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
//           Upload Scheme of Work
//         </h1>
//         <p className="mt-3 text-lg text-gray-600">
//           Soo geli cinwaanka iyo faylka qorshaha waxbarashada.
//         </p>
//       </motion.header>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl">
//         {/* Upload section */}
//         <motion.div
//           initial={{ opacity: 0, x: -50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5, delay: 0.1 }}
//           className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
//         >
//           <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
//             <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
//               <FiUpload className="text-blue-500" /> Upload New Scheme
//             </h2>
//             <p className="text-sm text-gray-500 mt-1">
//               Fadlan buuxi cinwaanka oo soo dooro fayl PDF ah.
//             </p>
//           </div>

//           <form onSubmit={formik.handleSubmit} className="p-6">
//             {/* Title Field */}
//             <div className="mb-6">
//               <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
//                 Cinwaan <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="title"
//                 name="title"
//                 value={formik.values.title}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className={`w-full px-4 py-3 rounded-lg border-2 ${
//                   formik.touched.title && formik.errors.title
//                     ? "border-red-400 focus:border-red-500"
//                     : "border-gray-300 focus:border-blue-500"
//                 } focus:outline-none focus:ring-2 focus:ring-blue-200`}
//               />
//               {formik.touched.title && formik.errors.title && (
//                 <div className="flex items-center text-red-600 text-sm mt-2">
//                   <FiXCircle className="mr-1.5 w-4 h-4" />
//                   {formik.errors.title}
//                 </div>
//               )}
//             </div>

//             {/* File Upload */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 PDF File <span className="text-red-500">*</span>
//               </label>
//               <div
//                 onDragEnter={handleDrag}
//                 onDragLeave={handleDrag}
//                 onDragOver={handleDrag}
//                 onDrop={handleDrop}
//                 className={`relative border-2 border-dashed rounded-xl p-8 text-center ${
//                   dragActive
//                     ? "border-blue-500 bg-blue-100"
//                     : "border-gray-300 hover:border-blue-400 bg-gray-50"
//                 }`}
//               >
//                 <input
//                   type="file"
//                   id="pdf-upload"
//                   accept="application/pdf"
//                   onChange={handleFileChange}
//                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                 />
//                 <div className="flex flex-col items-center justify-center space-y-3">
//                   <div className="p-3 rounded-full bg-white border border-gray-200 shadow-sm">
//                     <FiPlusCircle className="w-8 h-8 text-blue-500" />
//                   </div>
//                   <p className="text-base font-medium text-gray-800">
//                     {dragActive
//                       ? "Halkaan ku rid faylka"
//                       : "Jiid oo dhig ama guji si aad u dooratid"}
//                   </p>
//                   <p className="text-xs text-gray-500">PDF kaliya (ugu badnaan 10MB)</p>
//                 </div>
//               </div>
//               {formik.touched.pdf && formik.errors.pdf && (
//                 <div className="flex items-center text-red-600 text-sm mt-2">
//                   <FiXCircle className="mr-1.5 w-4 h-4" />
//                   {formik.errors.pdf}
//                 </div>
//               )}
//             </div>

//             {/* Preview */}
//             {previewUrl && (
//               <div className="flex items-center justify-between bg-blue-100 rounded-lg p-4 mb-6 border border-blue-200">
//                 <div className="flex items-center space-x-3">
//                   <FiFile className="text-blue-600" />
//                   <span className="text-sm font-medium text-blue-800">
//                     {formik.values.pdf?.name}
//                   </span>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     formik.setFieldValue("pdf", null);
//                     setPreviewUrl(null);
//                   }}
//                   className="text-blue-500 hover:text-blue-700"
//                   title="Remove file"
//                 >
//                   <FiX className="w-5 h-5" />
//                 </button>
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={loading || !formik.values.pdf || !formik.values.title}
//               className={`w-full flex justify-center items-center py-3.5 px-6 rounded-lg font-semibold text-white transition-all ${
//                 loading
//                   ? "bg-blue-400 cursor-not-allowed"
//                   : "bg-blue-600 hover:bg-blue-700 shadow-md"
//               }`}
//             >
//               {loading ? (
//                 <>
//                   <FiLoader className="animate-spin mr-2.5" />
//                   Soo dhacaya...
//                 </>
//               ) : (
//                 <>
//                   <FiUpload className="mr-2.5" />
//                   Upload Scheme
//                 </>
//               )}
//             </button>
//           </form>
//         </motion.div>

//         {/* List section */}
//         <motion.div
//           initial={{ opacity: 0, x: 50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//           className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
//         >
//           <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-green-50">
//             <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
//               <FiFile className="text-teal-600" /> Qorshayaashii Hore
//             </h2>
//             <p className="text-sm text-gray-500 mt-1">
//               {documents.length} faylal keydsan.
//             </p>
//           </div>
//           <div className="divide-y divide-gray-100">
//             {documents.length === 0 ? (
//               <div className="p-8 text-center bg-gray-50">
//                 <p className="text-gray-600">Faylal lama helin</p>
//               </div>
//             ) : (
//               documents.map((doc) => (
//                 <div
//                   key={doc.id}
//                   className="p-4 hover:bg-gray-50 transition-colors group cursor-pointer"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-4 min-w-0">
//                       <div className="p-2.5 rounded-lg bg-teal-100 text-teal-600 flex-shrink-0 shadow-sm">
//                         <FiFile className="w-5 h-5" />
//                       </div>
//                       <div className="min-w-0">
//                         <a
//                           href={doc.fileUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="font-medium text-gray-800 hover:text-blue-600 truncate block hover:underline text-lg"
//                         >
//                           {doc.title}
//                           <FiExternalLink className="inline-block w-4 h-4 ml-1" />
//                         </a>
//                         <p className="text-xs text-gray-500 mt-0.5">
//                           Uploaded:{" "}
//                           {new Date(doc.uploadedAt).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                       <a
//                         href={doc.fileUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50"
//                         title="View"
//                       >
//                         <FiEye className="w-5 h-5" />
//                       </a>
//                       <button
//                         onClick={() => handleDelete(doc.id)}
//                         className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50"
//                         title="Delete"
//                       >
//                         <FiTrash2 className="w-5 h-5" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default TeacherSchemeUpload;
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { FiUpload, FiFile, FiLoader, FiX, FiXCircle, FiPlusCircle } from "react-icons/fi";
import { motion } from "framer-motion";

import { uploadPdfFn, resetPdfState } from "../PdfFiles/PdfUploadSlice";
import type { AppDispatch, RootState } from "../../Redux/store";

const TeacherSchemeUpload: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success } = useSelector((state: RootState) => state.pdfUpload);
  const fullname = useSelector(
    (state: RootState) => state.loginSlice.data?.user?.fullname || ""
  );

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const validationSchema = yup.object({
    title: yup.string().required(),
    pdf: yup
      .mixed()
      .required("PDF file is required")
      .test("fileType", "Only PDF files are accepted", (value) => {
        return value && (value as File).type === "application/pdf";
      })
      .test("fileSize", "File too large (max 10MB)", (value) => {
        return value && (value as File).size <= 10 * 1024 * 1024;
      }),
  });

  const formik = useFormik({
    initialValues: {
      title: `${fullname} - Scheme`,
      pdf: null as File | null,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      if (!values.pdf) return;
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("pdf", values.pdf);
      toast.loading("Uploading Scheme...", { id: "uploading" });
      dispatch(uploadPdfFn(formData));
    },
  });

  useEffect(() => {
    if (error) {
      toast.dismiss("uploading");
      toast.error(error);
      dispatch(resetPdfState());
    }
    if (success) {
      toast.dismiss("uploading");
      toast.success(success);
      formik.resetForm();
      setPreviewUrl(null);
      dispatch(resetPdfState());
    }
  }, [error, success, dispatch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue("pdf", file);
      setPreviewUrl(URL.createObjectURL(file));
    }
    e.target.value = "";
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type === "application/pdf") {
      formik.setFieldValue("pdf", file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      toast.error("Only PDF files can be uploaded.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <Toaster position="top-right" />
      <motion.header
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Upload Scheme of Work
        </h1>
        <p className="text-gray-500 mt-2">Only PDF files allowed (max 10MB)</p>
      </motion.header>

      <motion.form
        onSubmit={formik.handleSubmit}
        onDragEnter={handleDrag}
        className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-lg border"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Title (readonly) */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formik.values.title}
            readOnly
            className="w-full px-4 py-3 rounded-md border border-gray-300 bg-gray-100 text-gray-700"
          />
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload PDF <span className="text-red-500">*</span>
          </label>
          <div
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : formik.touched.pdf && formik.errors.pdf
                ? "border-red-400 bg-red-50"
                : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-gray-100"
            }`}
          >
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <FiPlusCircle className="w-8 h-8 text-blue-500" />
              <p className="text-sm text-gray-600">
                Drag & drop your PDF here or click to browse
              </p>
            </div>
          </div>
          {formik.touched.pdf && formik.errors.pdf && (
            <div className="text-red-600 text-sm mt-2 flex items-center">
              <FiXCircle className="mr-2" />
              {formik.errors.pdf}
            </div>
          )}
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="flex items-center justify-between bg-blue-100 px-4 py-2 rounded-lg mb-6">
            <div className="flex items-center gap-2 text-blue-800 text-sm font-medium">
              <FiFile />
              {formik.values.pdf?.name}
            </div>
            <button
              type="button"
              onClick={() => {
                setPreviewUrl(null);
                formik.setFieldValue("pdf", null);
              }}
              className="text-blue-600 hover:text-red-500"
            >
              <FiX />
            </button>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !formik.values.pdf}
          className={`w-full flex justify-center items-center py-3 rounded-lg font-semibold text-white transition duration-200 ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow hover:shadow-lg"
          }`}
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin mr-2" /> Uploading...
            </>
          ) : (
            <>
              <FiUpload className="mr-2" /> Upload Scheme
            </>
          )}
        </button>
      </motion.form>
    </div>
  );
};

export default TeacherSchemeUpload;
