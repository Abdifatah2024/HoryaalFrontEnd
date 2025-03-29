import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { AiOutlineArrowLeft } from "react-icons/ai";

interface ClassDetails {
  id: number;
  name: string;
  description: string;
  teacher: {
    id: number;
    name: string;
    email: string;
  };
  students: {
    id: number;
    name: string;
  }[];
  createdAt: string;
}

const ClassOnce = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/classes/${classId}`);
        setClassDetails(response.data);
      } catch (error) {
        setError("Failed to load class details");
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchClassDetails();
    }
  }, [classId]);

  if (loading) {
    return (
      <div className={`min-h-screen p-8 flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? "text-white" : "text-gray-700"}`}>Loading class details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen p-8 flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
        <div className="text-center">
          <p className={`text-red-500 text-lg mb-4 ${darkMode ? "text-red-400" : ""}`}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!classDetails) {
    return (
      <div className={`min-h-screen p-8 flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
        <p className={`text-lg ${darkMode ? "text-white" : "text-gray-700"}`}>Class not found</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-8 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-500 hover:text-blue-700"
          >
            <AiOutlineArrowLeft className="mr-2" /> Back to Classes
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden mb-8"
        >
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{classDetails.name}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{classDetails.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-3">Teacher Information</h2>
                <p><span className="font-medium">Name:</span> {classDetails.teacher.name}</p>
                <p><span className="font-medium">Email:</span> {classDetails.teacher.email}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-3">Class Details</h2>
                <p><span className="font-medium">Class ID:</span> {classDetails.id}</p>
                <p><span className="font-medium">Created:</span> {new Date(classDetails.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Students ({classDetails.students.length})</h2>
              {classDetails.students.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classDetails.students.map((student) => (
                        <motion.tr 
                          key={student.id}
                          whileHover={{ backgroundColor: darkMode ? "rgba(55, 65, 81, 0.5)" : "rgba(243, 244, 246, 0.5)" }}
                          className="border-b dark:border-gray-700"
                        >
                          <td className="p-3">{student.id}</td>
                          <td className="p-3">{student.name}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No students enrolled in this class yet.</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClassOnce;