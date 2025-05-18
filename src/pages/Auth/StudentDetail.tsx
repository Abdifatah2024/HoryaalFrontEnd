import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyStudent } from '../../Redux/Auth/GetOneStudentsSlice';
import type { RootState, AppDispatch } from '../../Redux/store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, 
  FiLoader, 
  FiAlertCircle, 
  FiSearch, 
  FiInfo, 
  FiPhone, 
  FiHome, 
  FiBook, 
  FiUserCheck,
  FiDollarSign,
  FiMail
} from 'react-icons/fi';
import { FaTransgender, FaBirthdayCake } from 'react-icons/fa';

const StudentDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [studentId, setStudentId] = useState<string>('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

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
  }, [dispatch, studentId]);

  const safe = (val: any) =>
    val !== null && val !== undefined && val !== '' ? val : 'N/A';

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
      >
        {/* Header with gradient and better typography */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white relative">
          <div className="absolute top-0 right-0 opacity-10">
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 0C44.8 0 0 44.8 0 100C0 155.2 44.8 200 100 200C155.2 200 200 155.2 200 100C200 44.8 155.2 0 100 0ZM100 180C56 180 20 144 20 100C20 56 56 20 100 20C144 20 180 56 180 100C180 144 144 180 100 180Z" fill="white"/>
              <path d="M100 40C67.2 40 40 67.2 40 100C40 132.8 67.2 160 100 160C132.8 160 160 132.8 160 100C160 67.2 132.8 40 100 40ZM100 140C78 140 60 122 60 100C60 78 78 60 100 60C122 60 140 78 140 100C140 122 122 140 100 140Z" fill="white"/>
            </svg>
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold flex items-center">
              <FiUser className="mr-3 text-2xl" />
              Student Explorer
            </h1>
            <p className="opacity-90 mt-2 text-indigo-100">Discover and manage student records with ease</p>
          </div>
        </div>

        <div className="p-6">
          {/* Enhanced Search Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
              <div className="flex-1 w-full">
                <label htmlFor="student-search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search Students
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    id="student-search"
                    type="text"
                    placeholder="Enter student ID, name, or phone number"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <button
                      onClick={handleSearch}
                      disabled={verificationLoading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center h-full"
                    >
                      {verificationLoading ? (
                        <FiLoader className="animate-spin" />
                      ) : (
                        <FiSearch className="text-lg" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
              >
                {isExpanded ? 'Compact View' : 'Detailed View'}
              </button>
            </div>

            {/* Error Messages with better animation */}
            <AnimatePresence>
              {(inputError || verificationError) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3"
                >
                  <div className={`p-3 rounded-lg flex items-start ${inputError ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
                    <FiAlertCircle className="flex-shrink-0 mr-2 mt-0.5" />
                    <span>{inputError || verificationError}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results Section */}
          {verificationLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <FiLoader className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
                <p className="text-gray-600">Searching student records...</p>
              </div>
            </div>
          ) : verifiedStudent && verifiedStudent.length > 0 ? (
            <div>
              {/* Summary Cards for Mobile */}
              <div className="md:hidden grid gap-4 mb-6">
                {verifiedStudent.map((s, index) => (
                  <motion.div 
                    key={s.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                  >
                    <div className="p-4 bg-gray-50 border-b">
                      <h3 className="font-medium text-lg text-gray-800">{safe(s.fullname)}</h3>
                      <p className="text-sm text-gray-500">{safe(s.classes?.name)}</p>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Gender</p>
                        <p className="font-medium">{safe(s.gender)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Age</p>
                        <p className="font-medium">{safe(s.Age)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="font-medium">{safe(s.phone)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Fee</p>
                        <p className="font-medium">
                          {s.fee ? `$${parseFloat(String(s.fee)).toFixed(2)}` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="px-4 pb-4">
                      <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        {isExpanded ? 'Show less' : 'Show more details'}
                      </button>
                    </div>
                    
                    {/* Expanded mobile view */}
                    {isExpanded && (
                      <div className="p-4 border-t bg-gray-50">
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <FiHome className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gray-500">Address</p>
                              <p className="font-medium">{safe(s.address)}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <FiPhone className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gray-500">Alternate Phone</p>
                              <p className="font-medium">{safe(s.phone2)}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <FiUserCheck className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gray-500">Mother's Name</p>
                              <p className="font-medium">{safe(s.motherName)}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <FiMail className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gray-500">Created By</p>
                              <p className="font-medium">{safe(s.user?.email)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Full Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <FaTransgender className="mr-1" /> Gender
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <FaBirthdayCake className="mr-1" /> Age
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <FiPhone className="mr-1" /> Phone
                        </div>
                      </th>
                      {isExpanded && (
                        <>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Alt. Phone
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center">
                              <FiHome className="mr-1" /> Address
                            </div>
                          </th>
                        </>
                      )}
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <FiBook className="mr-1" /> Class
                        </div>
                      </th>
                      {isExpanded && (
                        <>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mother's Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center">
                              <FiDollarSign className="mr-1" /> Fee
                            </div>
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created By
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {verifiedStudent.map((s, index) => (
                      <motion.tr 
                        key={s.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                          {safe(s.fullname)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {safe(s.gender)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {safe(s.Age)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {safe(s.phone)}
                        </td>
                        {isExpanded && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {safe(s.phone2)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                              {safe(s.address)}
                            </td>
                          </>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {safe(s.classes?.name)}
                        </td>
                        {isExpanded && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {safe(s.motherName)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {s.fee ? `$${parseFloat(String(s.fee)).toFixed(2)}` : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {safe(s.user?.email)}
                            </td>
                          </>
                        )}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            !verificationLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiInfo className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No students found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Try searching by student ID, full name, or phone number to find student records.
                </p>
              </motion.div>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StudentDetails;