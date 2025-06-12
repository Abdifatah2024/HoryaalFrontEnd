// import  { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../Redux/store";
// import { fetchDocuments } from "./PdfUploadSlice";
// import toast from "react-hot-toast";
// import { FiFile, FiDownloadCloud, FiBookOpen } from "react-icons/fi";
// import { motion } from "framer-motion";
// import dayjs from 'dayjs';

// const PdfDocumentsList = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { documents, loading, error } = useSelector(
//     (state: RootState) => state.pdfUpload
//   );

//   // Debugging console logs (you can remove these after troubleshooting if needed)
//   console.log("Current Redux State - Documents:", documents);
//   console.log("Current Redux State - Loading:", loading);
//   console.log("Current Redux State - Error:", error);

//   useEffect(() => {
//     dispatch(fetchDocuments());
//   }, [dispatch]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//     }
//   }, [error]);

//   // Framer Motion Variants for staggered animations
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 30, scale: 0.95 },
//     show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
//   };

//   // Background animation variants
//   const backgroundVariants = {
//     initial: {
//       backgroundPosition: '0% 50%'
//     },
//     animate: {
//       backgroundPosition: '100% 50%',
//       transition: {
//         duration: 25,
//         ease: 'linear',
//         repeat: Infinity,
//         repeatType: 'reverse'
//       }
//     }
//   };


//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-indigo-100 to-blue-200"> {/* Slightly deeper loading background */}
//          {/* Animated background circles */}
//          <motion.div
//           className="absolute w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob top-0 left-0"
//           animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
//           transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
//         ></motion.div>
//         <motion.div
//           className="absolute w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000 bottom-0 right-0"
//           animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
//           transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
//         ></motion.div>
//         <motion.div
//           className="absolute w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000 top-1/4 left-1/4"
//           animate={{ x: [0, 50, 0], y: [0, -100, 0] }}
//           transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
//         ></motion.div>


//         <div className="max-w-5xl w-full p-8 bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 text-center relative z-10">
//           <motion.h1
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-4xl font-extrabold text-indigo-700 mb-8"
//           >
//             Fetching Important Documents...
//           </motion.h1>
//           <div className="flex justify-center items-center h-48">
//             <motion.div
//               initial={{ rotate: 0 }}
//               animate={{ rotate: 360 }}
//               transition={{ ease: "linear", duration: 1.5, repeat: Infinity }}
//               className="w-20 h-20 border-8 border-purple-500 border-t-transparent rounded-full shadow-lg"
//             ></motion.div>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
//             {[...Array(4)].map((_, i) => (
//               <div
//                 key={i}
//                 className="flex items-center p-6 bg-purple-100 rounded-2xl shadow-md animate-pulse border border-purple-300"
//               >
//                 <div className="p-3 bg-purple-300 rounded-xl mr-4 h-12 w-12 flex-shrink-0"></div>
//                 <div className="flex-1">
//                   <div className="h-5 bg-purple-300 rounded w-3/4 mb-2"></div>
//                   <div className="h-4 bg-purple-300 rounded w-1/2"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       className="min-h-screen p-6 relative overflow-hidden flex justify-center items-center"
//       style={{
//         // A vibrant, dynamic gradient for the main background
//         background: 'linear-gradient(270deg, #a7ccff, #c2e2ff, #f8dfff, #d2a4ff)', // Brighter, more varied gradient
//         backgroundSize: '400% 400%'
//       }}
//       variants={backgroundVariants}
//       initial="initial"
//       animate="animate"
//     >
//       {/* Animated background circles - kept prominent */}
//       <motion.div
//         className="absolute w-80 h-80 bg-fuchsia-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob top-10 left-1/4"
//         animate={{ x: [0, 100, 0], y: [0, 80, 0] }}
//         transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
//       ></motion.div>
//       <motion.div
//         className="absolute w-96 h-96 bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 bottom-20 right-1/4"
//         animate={{ x: [0, -120, 0], y: [0, -60, 0] }}
//         transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
//       ></motion.div>
//       <motion.div
//         className="absolute w-72 h-72 bg-violet-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
//         animate={{ x: [0, 60, 0], y: [0, -90, 0] }}
//         transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
//       ></motion.div>

//       <div className="max-w-5xl w-full p-8 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 relative z-10">
//         <motion.h1
//           initial={{ opacity: 0, y: -50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//           className="text-5xl font-extrabold text-center mb-12 tracking-tight flex items-center justify-center gap-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-900"
//         >
//           <FiBookOpen className="text-indigo-700" size={48} />
//           School Rules & Regulations
//         </motion.h1>

//         {documents.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.6, delay: 0.5 }}
//             className="text-center py-24 bg-indigo-50/90 rounded-2xl border-2 border-dashed border-indigo-500 text-indigo-900 shadow-xl flex flex-col items-center justify-center"
//             style={{ backdropFilter: 'blur(8px)' }}
//           >
//             <FiFile className="text-indigo-600 text-7xl mb-8 animate-bounce" />
//             <p className="text-3xl font-bold mb-4">No documents found!</p>
//             <p className="text-lg text-gray-800 max-w-md mx-auto">
//               It looks like no school rules and regulations have been uploaded yet. Please check back later or contact support.
//             </p>
//           </motion.div>
//         ) : (
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             animate="show"
//             className="grid grid-cols-1 md:grid-cols-2 gap-6"
//           >
//             {documents.map((doc) => (
//               <motion.a
//                 key={doc.id}
//                 href={doc.fileUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 title={`Open ${doc.title}`}
//                 variants={itemVariants}
//                 whileHover={{
//                   scale: 1.05,
//                   boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
//                   y: -7
//                 }}
//                 whileTap={{ scale: 0.98 }}
//                 // --- KEY CHANGES HERE FOR VISIBILITY ---
//                 className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-3xl shadow-xl hover:shadow-2xl hover:border-blue-500 transition-all duration-300 group cursor-pointer overflow-hidden transform-gpu"
//                 style={{ backdropFilter: 'blur(10px)' }} // Increased blur
//               >
//                 <div className="flex items-center space-x-5 flex-1 min-w-0">
//                   <div className="p-4 bg-blue-100 rounded-2xl group-hover:bg-blue-200 transition-colors transform group-hover:scale-110 shadow-md">
//                     <FiFile className="text-blue-600 text-4xl" /> {/* Adjusted icon color */}
//                   </div>
//                   <div className="min-w-0">
//                     <p className="font-bold text-gray-800 truncate text-xl group-hover:underline leading-tight"> {/* Adjusted title color for contrast */}
//                       {doc.title}
//                     </p>
//                     <p className="text-sm text-gray-600 mt-1">
//                       Uploaded on{" "}
//                       <span className="font-semibold text-gray-700">
//                         {dayjs(doc.uploadedAt).format('MMMM D,YYYY')}
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//                 <motion.div
//                   initial={{ opacity: 0, x: 20 }}
//                   whileHover={{ opacity: 1, x: 0 }}
//                   className="ml-4 p-3 rounded-full bg-blue-600 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out flex-shrink-0"
//                 >
//                   <FiDownloadCloud size={28} />
//                 </motion.div>
//               </motion.a>
//             ))}
//           </motion.div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default PdfDocumentsList;
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { fetchDocuments } from "./PdfUploadSlice";
import toast from "react-hot-toast";
import { FiFile, FiDownloadCloud, FiBookOpen } from "react-icons/fi";
import dayjs from "dayjs";

const PdfDocumentsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { documents, loading, error } = useSelector(
    (state: RootState) => state.pdfUpload
  );

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-teal-100 to-emerald-200">
        <div className="max-w-5xl w-full p-8 bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 text-center">
          <h1 className="text-4xl font-extrabold text-teal-700 mb-8">
            Fetching Important Documents...
          </h1>
          <div className="flex justify-center items-center h-48">
            <div className="w-20 h-20 border-8 border-teal-500 border-t-transparent rounded-full shadow-lg animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6 flex justify-center items-center"
      style={{
        background: "linear-gradient(270deg, #ccfbf1, #99f6e4, #6ee7b7, #5eead4)",
        backgroundSize: "400% 400%",
      }}
    >
      <div className="max-w-5xl w-full p-8 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100">
        <h1 className="text-5xl font-extrabold text-center mb-12 tracking-tight flex items-center justify-center gap-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-500">
          <FiBookOpen className="text-teal-700" size={48} />
          School Rules & Regulations
        </h1>

        {documents.length === 0 ? (
          <div className="text-center py-24 bg-teal-50/90 rounded-2xl border-2 border-dashed border-teal-500 text-teal-900 shadow-xl flex flex-col items-center justify-center">
            <FiFile className="text-teal-600 text-7xl mb-8 animate-bounce" />
            <p className="text-3xl font-bold mb-4">No documents found!</p>
            <p className="text-lg text-gray-800 max-w-md mx-auto">
              It looks like no school rules and regulations have been uploaded
              yet. Please check back later or contact support.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents.map((doc) => (
              <a
                key={doc.id}
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Open ${doc.title}`}
                className="flex items-center justify-between p-6 bg-teal-50 border border-teal-200 rounded-3xl shadow-xl hover:shadow-2xl hover:border-teal-500 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center space-x-5 flex-1 min-w-0">
                  <div className="p-4 bg-teal-100 rounded-2xl group-hover:bg-teal-200 transition-colors transform group-hover:scale-110 shadow-md">
                    <FiFile className="text-teal-600 text-4xl" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800 truncate text-xl group-hover:underline leading-tight">
                      {doc.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Uploaded on{" "}
                      <span className="font-semibold text-gray-700">
                        {dayjs(doc.uploadedAt).format("MMMM D, YYYY")}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="ml-4 p-3 rounded-full bg-teal-600 text-white group-hover:opacity-100 transition-all duration-300 ease-out flex-shrink-0">
                  <FiDownloadCloud size={28} />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfDocumentsList;
