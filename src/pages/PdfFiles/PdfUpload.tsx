import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  uploadPdfFn,
  resetPdfState,
  fetchDocuments,
  deleteDocument,
} from "../PdfFiles/PdfUploadSlice";
import { AppDispatch, RootState } from "../../Redux/store";
import toast, { Toaster } from "react-hot-toast";
import {
  FiUpload,
  FiFile,
  FiLoader,
  FiX,
  FiTrash2,
  FiEye,
  FiExternalLink,
   FiXCircle
} from "react-icons/fi";

const PdfUpload = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success, documents } = useSelector(
    (state: RootState) => state.pdfUpload
  );

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const validationSchema = yup.object({
    title: yup.string()
      .required("Title is required")
      .max(60, "Title must be 60 characters or less"),
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
      title: "",
      pdf: null as File | null 
    },
    validationSchema,
    onSubmit: (values) => {
      if (!values.pdf) return;
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("pdf", values.pdf);
      toast.loading("Uploading PDF...");
      dispatch(uploadPdfFn(formData));
    },
  });

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetPdfState());
    }
    if (success) {
      toast.success(success);
      formik.resetForm();
      setPreviewUrl(null);
      dispatch(resetPdfState());
      dispatch(fetchDocuments());
    }
  }, [error, success, dispatch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue("pdf", file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        formik.setFieldValue("pdf", file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        formik.setFieldError("pdf", "Only PDF files are accepted");
      }
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      dispatch(deleteDocument(id))
        .unwrap()
        .then(() => toast.success("Document deleted successfully"))
        .catch((err) => toast.error(err));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '8px',
            background: '#fff',
            color: '#333',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Document Manager</h1>
        <p className="text-gray-500 mt-2">Upload and manage your PDF documents</p>
      </header>

      <div className="grid gap-8">
        {/* Upload Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Upload New Document</h2>
          </div>
          
          <form onSubmit={formik.handleSubmit} className="p-6">
            {/* Title Input */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Document Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 rounded-lg border ${
                  formik.touched.title && formik.errors.title
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                } focus:outline-none focus:ring-2`}
                placeholder="Enter a descriptive title"
              />
              {formik.touched.title && formik.errors.title && (
                <div className="flex items-center text-red-500 text-sm mt-2">
                  <FiXCircle className="mr-1.5" />
                  {formik.errors.title}
                </div>
              )}
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF File <span className="text-red-500">*</span>
              </label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive 
                    ? "border-blue-500 bg-blue-50" 
                    : formik.touched.pdf && formik.errors.pdf
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400 bg-gray-50"
                }`}
              >
                <input
                  type="file"
                  id="pdf-upload"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="p-3 rounded-full bg-white border border-gray-200">
                    <FiUpload className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {dragActive 
                        ? "Drop your PDF here" 
                        : "Drag & drop your PDF or click to browse"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF files only (max 10MB)
                    </p>
                  </div>
                </div>
              </div>
              {formik.touched.pdf && formik.errors.pdf && (
                <div className="flex items-center text-red-500 text-sm mt-2">
                  <FiXCircle className="mr-1.5" />
                  {formik.errors.pdf}
                </div>
              )}
            </div>

            {/* File Preview */}
            {previewUrl && (
              <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <FiFile className="text-blue-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                    {formik.values.pdf?.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    formik.setFieldValue("pdf", null);
                    setPreviewUrl(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !formik.values.pdf || !formik.values.title}
              className={`w-full flex justify-center items-center py-3.5 px-6 rounded-lg font-medium text-white transition-all ${
                loading || !formik.values.pdf || !formik.values.title
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-sm"
              }`}
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin mr-2.5" />
                  Uploading...
                </>
              ) : (
                <>
                  <FiUpload className="mr-2.5" />
                  Upload Document
                </>
              )}
            </button>
          </form>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Your Documents</h2>
            <p className="text-sm text-gray-500 mt-1">
              {documents.length} document{documents.length !== 1 ? 's' : ''} stored
            </p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {documents.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <FiFile className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-gray-500 font-medium">No documents yet</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Upload your first PDF document to get started
                </p>
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 min-w-0">
                      <div className="p-2.5 rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
                        <FiFile className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-gray-800 hover:text-blue-600 truncate block hover:underline"
                          title={`Open ${doc.title}`}
                        >
                          {doc.title} <FiExternalLink className="inline-block w-3 h-3 ml-1 opacity-70 group-hover:opacity-100" />
                        </a>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Uploaded {new Date(doc.uploadedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View in new tab"
                      >
                        <FiEye className="w-5 h-5" />
                      </a>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete document"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfUpload;