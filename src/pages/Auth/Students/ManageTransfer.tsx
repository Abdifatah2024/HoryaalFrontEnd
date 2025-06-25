import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux/store";
import {
  fetchUntransferredStudents,
  updateTransferAndRollNumber,
} from "../../../Redux/Auth/RegstdSlice";
import { FiRefreshCw, FiCheckCircle, FiUser, FiPhone, FiBook, FiHash } from "react-icons/fi";
import { toast } from "react-hot-toast";

const ManageTransfer = () => {
  const dispatch = useAppDispatch();
  const { untransferredStudents, loading, error } = useAppSelector(
    (state) => state.StdRegSlice
  );

  const [rollNumbers, setRollNumbers] = useState<Record<number, string>>({});
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<number, string>>({});

  useEffect(() => {
    dispatch(fetchUntransferredStudents());
  }, [dispatch]);

  const handleRollNumberChange = (studentId: number, value: string) => {
    setRollNumbers(prev => ({ ...prev, [studentId]: value }));
    // Clear validation error when typing
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[studentId];
      return newErrors;
    });
  };

  const handleTransferStudent = async (studentId: number) => {
    const rollNumber = rollNumbers[studentId]?.trim();
    
    if (!rollNumber) {
      setValidationErrors(prev => ({
        ...prev,
        [studentId]: "Please enter a roll number"
      }));
      return;
    }

    try {
      setUpdatingIds(prev => [...prev, studentId]);
      
      const result = await dispatch(
        updateTransferAndRollNumber({ 
          id: studentId, 
          transfer: true, 
          rollNumber 
        })
      ).unwrap();

      toast.success(`Student ${result.data.fullname} transferred successfully!`);
      setRollNumbers(prev => {
        const newState = { ...prev };
        delete newState[studentId];
        return newState;
      });
    } catch (error) {
      toast.error(`Transfer failed`);
    } finally {
      setUpdatingIds(prev => prev.filter(id => id !== studentId));
    }
  };

  const refreshStudents = () => {
    dispatch(fetchUntransferredStudents());
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Student Transfers</h2>
          <p className="text-gray-500 mt-1">
            {untransferredStudents.length} students pending transfer
          </p>
        </div>
        <button
          onClick={refreshStudents}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          Refresh List
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : untransferredStudents.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <FiCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">All students transferred</h3>
          <p className="text-gray-500">No pending transfers found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiUser className="mr-2" />
                    Student
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiBook className="mr-2" />
                    Class
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiPhone className="mr-2" />
                    Contact
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiHash className="mr-2" />
                    Roll Number
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {untransferredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{student.fullname}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {student.previousSchool || "No previous school"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {student.classes?.name || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.phone}</div>
                    {student.phone2 && (
                      <div className="text-xs text-gray-500 mt-1">{student.phone2}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={rollNumbers[student.id] || student.rollNumber || ""}
                      onChange={(e) => handleRollNumberChange(student.id, e.target.value)}
                      className={`w-32 px-3 py-1 border ${
                        validationErrors[student.id] ? 'border-red-500' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter roll #"
                    />
                    {validationErrors[student.id] && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors[student.id]}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleTransferStudent(student.id)}
                      disabled={updatingIds.includes(student.id)}
                      className={`px-4 py-2 rounded-md text-white ${
                        updatingIds.includes(student.id)
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      } transition-colors flex items-center gap-2`}
                    >
                      {updatingIds.includes(student.id) ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                          Processing
                        </>
                      ) : (
                        "Confirm Transfer"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageTransfer;