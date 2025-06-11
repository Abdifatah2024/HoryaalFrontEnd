import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { fetchDocuments } from "../PdfFiles/PdfUploadSlice";
import toast from "react-hot-toast";
import { FiFile } from "react-icons/fi";

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-md border border-gray-100">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        📄 SCHOOL RULES AND REGULATIONS
      </h1>

      {documents.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No documents uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <a
              key={doc.id}
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow group cursor-pointer"
              title={`Open ${doc.title}`}
            >
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                  <FiFile className="text-blue-600 text-2xl" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-blue-700 truncate text-base group-hover:underline">
                    {doc.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Uploaded on{" "}
                    <span className="font-medium">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default PdfDocumentsList;
