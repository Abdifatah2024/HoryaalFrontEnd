import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyStudent } from '../../Redux/Auth/GetOneStudentsSlice';
import type { RootState, AppDispatch } from '../../Redux/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser, FiPhone, FiCalendar, FiBook,
  FiDollarSign, FiLoader, FiAlertCircle, FiMapPin, FiHome
} from 'react-icons/fi';
import { FaUserShield, FaBus } from 'react-icons/fa';

const StudentDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [studentId, setStudentId] = useState<string>('');
  const [inputError, setInputError] = useState<string | null>(null);

  const { verifiedStudent, verificationLoading, verificationError } = useSelector(
    (state: RootState) => state.studentClass
  );

  const handleSearch = () => {
    if (!studentId.trim()) {
      setInputError('Please enter a student ID or name');
      return;
    }
    setInputError(null);
    dispatch(verifyStudent(studentId));
  };

  useEffect(() => {
    if (studentId) {
      dispatch(verifyStudent(studentId));
    }
  }, [dispatch]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center">
            <FiUser className="mr-3" />
            Student Information Portal
          </h1>
          <p className="opacity-90 mt-1">View comprehensive student details</p>
        </div>

        <div className="p-6">
          {/* Search Input */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                Student ID or Name
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="studentId"
                  placeholder="Enter student ID or Name"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-4 py-2 rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleSearch}
                  disabled={verificationLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                >
                  {verificationLoading ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      Searching...
                    </>
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
              <AnimatePresence>
                {inputError && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1 text-sm text-red-600 flex items-center"
                  >
                    <FiAlertCircle className="mr-1" />
                    {inputError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Error Handling */}
          <AnimatePresence>
            {verificationError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md"
              >
                <div className="flex items-center">
                  <FiAlertCircle className="text-red-500 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Error loading student data</h3>
                    <p className="text-sm text-red-700 mt-1">{verificationError}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loader */}
          {verificationLoading && (
            <div className="flex justify-center py-12">
              <FiLoader className="animate-spin text-blue-500 text-4xl" />
            </div>
          )}

          {/* Student Details */}
          {verifiedStudent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Personal Information */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiUser className="mr-2 text-blue-500" />
                  Personal Information
                </h2>
                <div className="space-y-3">
                  <DetailItem label="Full Name" value={verifiedStudent.fullname} icon={<FiUser />} />
                  <DetailItem label="Age" value={verifiedStudent.Age} icon={<FiCalendar />} />
                  <DetailItem label="Gender" value={verifiedStudent.gender} icon={<FiUser />} />
                  <DetailItem label="Phone" value={verifiedStudent.phone} icon={<FiPhone />} />
                  <DetailItem label="Alternate Phone" value={verifiedStudent.phone2 || 'N/A'} icon={<FiPhone />} />
                  <DetailItem label="Address" value={verifiedStudent.address || 'N/A'} icon={<FiMapPin />} />
                  <DetailItem label="Bus Route" value={verifiedStudent.bus || 'N/A'} icon={<FaBus />} />
                  <DetailItem label="Previous School" value={verifiedStudent.previousSchool || 'N/A'} icon={<FaBus />} />
                  <DetailItem label="Mother's Name" value={verifiedStudent.motherName || 'N/A'} icon={<FiHome />} />
                </div>
              </div>

              {/* Academic Information */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiBook className="mr-2 text-blue-500" />
                  Academic Information
                </h2>
                <div className="space-y-3">
                  <DetailItem
                    label="Class"
                    value={verifiedStudent.classes?.name || 'Not assigned'}
                    icon={<FiBook />}
                  />
                  <DetailItem
                    label="Created By"
                    value={verifiedStudent.user?.fullName || 'Not specified'}
                    icon={<FaUserShield />}
                  />
                </div>
              </div>

              {/* Financial Information */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiDollarSign className="mr-2 text-blue-500" />
                  Financial Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem
                    label="Term Fee"
                    value={`$${verifiedStudent.fee}`}
                    icon={<FiDollarSign />}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// 🔹 Reusable DetailItem Component
const DetailItem: React.FC<{ label: string; value: React.ReactNode; icon?: React.ReactNode }> = ({
  label,
  value,
  icon,
}) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 h-5 w-5 text-gray-500 mr-3 mt-0.5">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900 mt-0.5">
        {value || <span className="text-gray-400">Not available</span>}
      </p>
    </div>
  </div>
);

export default StudentDetails;
