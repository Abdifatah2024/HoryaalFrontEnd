import { useFormik } from "formik";
import * as yup from "yup";
import { AppDispatch, RootState } from "../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { uploadPhotoFn, resetPhotoState } from "@/Redux/PhotouploadSlice";
import { FiUploadCloud, FiImage } from "react-icons/fi";

const PhotoUpload = () => {
  const toastId = "photoUpload";
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success } = useSelector((state: RootState) => state.photoSlice);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const validationSchema = yup.object({
    photo: yup.mixed()
      .required("A file is required")
      .test("fileType", "Only image files are accepted", (value) => {
        if (!value) return true;
        return ['image/jpeg', 'image/png', 'image/gif'].includes((value as File).type);
      })
      .test("fileSize", "File too large (max 5MB)", (value) => {
        if (!value) return true;
        return (value as File).size <= 5_242_880; // 5MB
      })
  });

  const formik = useFormik({
    initialValues: {
      photo: null as File | null,
    },
    validationSchema,
    onSubmit: (values) => {
      if (!values.photo) return;
      
      const formData = new FormData();
      formData.append("photo", values.photo);
      toast.loading("Uploading photo...", { id: toastId });
      dispatch(uploadPhotoFn(formData));
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(error, { id: toastId });
      dispatch(resetPhotoState());
    }
    if (success) {
      toast.success("Photo uploaded successfully!", { id: toastId });
      dispatch(resetPhotoState());
      setPreviewUrl(null);
      formik.resetForm();
    }
  }, [error, success, dispatch]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    formik.setFieldValue("photo", file);
    setPreviewUrl(URL.createObjectURL(file));
  };

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
              Upload Photo
            </motion.h1>
            <p className="text-gray-600 font-medium">Update your profile picture</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* File Upload Area */}
            <div className="relative">
              <label
                htmlFor="photo"
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-colors"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg"
                  />
                ) : (
                  <FiUploadCloud className="text-4xl text-gray-400 mb-4" />
                )}
                
                <div className="text-center">
                  <p className="text-blue-600 font-semibold">
                    Choose a file
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    JPEG, PNG, GIF (max 5MB)
                  </p>
                </div>
              </label>
              
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                onBlur={formik.handleBlur}
                className="hidden"
              />

              {formik.touched.photo && formik.errors.photo && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mt-2 flex items-center justify-center"
                >
                  <span className="mr-1">⚠</span>{formik.errors.photo}
                </motion.p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !formik.values.photo}
              className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all ${
                loading || !formik.values.photo
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <FiImage className="text-lg" />
                  <span>Upload Photo</span>
                </div>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default PhotoUpload;
