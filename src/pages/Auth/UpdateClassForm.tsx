import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  updateStudentClass, 
  resetStudentClassState, 
  verifyStudent,
  clearVerificationData
} from '../../Redux/Auth/updateClassSlice';
import type { RootState, AppDispatch } from '../../Redux/store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, FiBook, FiPhone, FiCheck, 
  FiX, FiRefreshCw, FiAlertCircle,
  FiArrowLeft, FiInfo, FiAward
} from 'react-icons/fi';

interface ClassItem {
  id: number;
  name: string;
  grade: number;
}

const UpdateClassForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    loading, 
    error, 
    success, 
    student, 
    verificationLoading,
    verificationError,
    verifiedStudent 
  } = useSelector((state: RootState) => state.studentClassUpdate);

  const [formData, setFormData] = useState({
    studentId: '',
    classId: ''
  });
  const [verificationStep, setVerificationStep] = useState(false);
  const [sameClassError, setSameClassError] = useState('');


  const classList: ClassItem[] = [
    { id: 1, name: "1A", grade: 1 },
    { id: 2, name: "1B", grade: 1 },
    { id: 3, name: "1C", grade: 1 },
    { id: 4, name: "1D", grade: 1 },
    { id: 5, name: "1E", grade: 1 },
    { id: 6, name: "1G", grade: 1 },
    { id: 7, name: "2A", grade: 2 },
    { id: 8, name: "2B", grade: 2 },
    { id: 9, name: "2C", grade: 2 },
    { id: 10, name: "2D", grade: 2 },
    { id: 11, name: "2E", grade: 2 },
    { id: 12, name: "2F", grade: 2 },
    { id: 13, name: "3A", grade: 3 },
    { id: 14, name: "3B", grade: 3 },
    { id: 15, name: "3C", grade: 3 },
    { id: 16, name: "3D", grade: 3 },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setSameClassError('');
  };

  const handleVerifyStudent = async () => {
    if (!formData.studentId) return;
    
    try {
      await dispatch(verifyStudent(Number(formData.studentId))).unwrap();
      setVerificationStep(true);
    } catch (err) {
      // Error handling is done in the slice
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.classId) {
      setSameClassError("Please select a class");
      return;
    }

    if (verifiedStudent && Number(formData.classId) === verifiedStudent.classId) {
      setSameClassError("Student is already in this class");
      return;
    }

    dispatch(updateStudentClass({ 
      studentId: Number(formData.studentId), 
      classId: Number(formData.classId) 
    }));
  };

  const handleReset = () => {
    dispatch(resetStudentClassState());
    dispatch(clearVerificationData());
    setFormData({ studentId: '', classId: '' });
    setVerificationStep(false);
    setSameClassError('');
  };

  const handleBackToVerification = () => {
    setVerificationStep(false);
    setSameClassError('');
  };

  // Auto-clear success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(resetStudentClassState());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg mt-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiAward className="mr-2 text-blue-600" />
          Student Class Update
        </h2>
        {success && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center"
          >
            <FiCheck className="mr-1" /> Success
          </motion.span>
        )}
      </div>
      
      {!verificationStep ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiUser className="mr-2 text-gray-500" />
              Student ID
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
                min="1"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter student ID"
              />
              <button
                type="button"
                onClick={handleVerifyStudent}
                disabled={verificationLoading || !formData.studentId}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center transition-colors"
              >
                {verificationLoading ? (
                  <FiRefreshCw className="animate-spin mr-2" />
                ) : (
                  <FiCheck className="mr-2" />
                )}
                {verificationLoading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {verificationError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-red-50 text-red-700 rounded-lg flex items-start"
              >
                <FiAlertCircle className="mt-0.5 mr-2 flex-shrink-0" />
                <span>{verificationError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {verifiedStudent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-blue-50 rounded-lg border border-blue-200"
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <FiUser className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Student Verified</h3>
                  <p className="text-sm text-gray-600">ID: {formData.studentId}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div className="text-gray-600">Name:</div>
                <div className="font-medium">{verifiedStudent.fullname}</div>
                <div className="text-gray-600">Current Class:</div>
                <div className="font-medium">
                  {classList.find(c => c.id === verifiedStudent.classId)?.name || verifiedStudent.classId}
                </div>
              </div>
              
              <button
                onClick={() => setVerificationStep(true)}
                className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center transition-colors"
              >
                <FiArrowLeft className="transform rotate-180 mr-2" />
                Continue to Update
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-blue-800 flex items-center">
                <FiInfo className="mr-2" />
                Student Information
              </h3>
              <button
                type="button"
                onClick={handleBackToVerification}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              >
                <FiArrowLeft className="mr-1" />
                Change Student
              </button>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <FiUser className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{verifiedStudent?.fullname}</p>
                <p className="text-sm text-gray-600">
                  Current Class: {classList.find(c => c.id === verifiedStudent?.classId)?.name}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiBook className="mr-2 text-gray-500" />
              Select New Class
            </label>
            <select
              name="classId"
              value={formData.classId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="">Select a class</option>
              {classList.map((classItem) => (
                <option 
                  key={classItem.id} 
                  value={classItem.id}
                  disabled={verifiedStudent?.classId === classItem.id}
                  className={verifiedStudent?.classId === classItem.id ? 'bg-gray-100' : ''}
                >
                  {classItem.name} (Grade {classItem.grade})
                  {verifiedStudent?.classId === classItem.id && ' - Current'}
                </option>
              ))}
            </select>
            <AnimatePresence>
              {sameClassError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-1 text-sm text-red-600 flex items-center"
                >
                  <FiAlertCircle className="mr-1" />
                  {sameClassError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="flex space-x-3 pt-2">
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center ${
                loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
            >
              {loading ? (
                <FiRefreshCw className="animate-spin mr-2" />
              ) : (
                <FiCheck className="mr-2" />
              )}
              Confirm Update
            </motion.button>
            
            <motion.button
              type="button"
              onClick={handleReset}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              <FiX className="mr-2" />
              Cancel
            </motion.button>
          </div>
        </form>
      )}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start"
          >
            <FiAlertCircle className="mt-0.5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {success && student && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200"
        >
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <FiCheck className="text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-green-800">Update Successful!</h3>
              <p className="text-sm text-gray-600">
                {new Date().toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">Student:</div>
            <div className="font-medium">{student.fullname}</div>
            <div className="text-gray-600">From:</div>
            <div className="font-medium">
              {classList.find(c => c.id === verifiedStudent?.classId)?.name || verifiedStudent?.classId}
            </div>
            <div className="text-gray-600">To:</div>
            <div className="font-medium">
              {classList.find(c => c.id === student.classId)?.name || student.classId}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UpdateClassForm;