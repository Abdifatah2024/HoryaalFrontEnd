// features/students/DeleteStudent.tsx
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { deleteStudent, resetDeleteState, selectDeleteStudent } from '../../Redux/Auth/SofteDeleteSlice';
// import { RootState } from '../../Redux/store';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiX, FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi';

const DeleteStudent: React.FC = () => {
  const dispatch = useAppDispatch(); // ✅ no more errors
const { loading, error, success, deletedStudent } = useAppSelector(selectDeleteStudent);
  const [studentId, setStudentId] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const handleDelete = () => {
    if (!studentId || isNaN(Number(studentId))) {
      return;
    }
    dispatch(deleteStudent(Number(studentId)));
    setShowConfirmation(false);
  };

  const handleReset = () => {
    dispatch(resetDeleteState());
    setStudentId('');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FiTrash2 className="mr-2 text-red-500" />
        Delete Student
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Student ID
          </label>
          <input
            type="number"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter student ID"
            min="1"
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setShowConfirmation(true)}
            disabled={!studentId || loading}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              !studentId ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
            } flex items-center`}
          >
            <FiTrash2 className="mr-2" />
            Delete Student
          </button>
          
          {success && (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md flex items-center"
            >
              <FiX className="mr-2" />
              Reset
            </button>
          )}
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200 flex items-start"
            >
              <FiAlertCircle className="mt-0.5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <div className="p-3 bg-blue-50 text-blue-700 rounded-md border border-blue-200 flex items-center">
            <FiLoader className="animate-spin mr-2" />
            Deleting student...
          </div>
        )}

        {success && deletedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-green-50 rounded-md border border-green-200"
          >
            <div className="flex items-center mb-2">
              <FiCheck className="text-green-500 mr-2" />
              <h3 className="font-medium text-green-800">{deletedStudent.fullname} deleted successfully</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600">ID:</div>
              <div>{deletedStudent.id}</div>
              <div className="text-gray-600">Status:</div>
              <div className={deletedStudent.isdeleted ? 'text-red-600' : 'text-green-600'}>
                {deletedStudent.isdeleted ? 'Deleted' : 'Active'}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete student with ID: {studentId}? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className={`px-4 py-2 text-white rounded-md ${
                    loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                  } flex items-center`}
                >
                  {loading ? (
                    <FiLoader className="animate-spin mr-2" />
                  ) : (
                    <FiTrash2 className="mr-2" />
                  )}
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeleteStudent;