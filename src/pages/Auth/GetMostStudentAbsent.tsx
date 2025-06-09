import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { fetchAbsences } from '../../Redux/Auth/GetMostStudentAbsentSlice';
import {
  FiUser,
  FiCalendar,
  FiAlertCircle,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiFilter
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import { format, parseISO } from 'date-fns';

interface Absence {
  date: string;
  remark?: string;
}

interface StudentAbsence {
  id: number;
  name: string;
  totalAbsences: number;
  recentAbsences: Absence[];
  avatar?: string;
}

const AbsenceList: React.FC = () => {
  const dispatch = useAppDispatch();
  const data: StudentAbsence[] = useAppSelector((state) => state.absence.data);
  const loading = useAppSelector((state) => state.absence.loading);
  const error = useAppSelector((state) => state.absence.error);

  const [expandedStudent, setExpandedStudent] = useState<number | null>(null);
  const [filterThreshold, setFilterThreshold] = useState<number>(0);
  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'totalAbsences'; direction: 'asc' | 'desc' }>({
    key: 'totalAbsences',
    direction: 'desc'
  });
  const [imageErrorMap, setImageErrorMap] = useState<{ [id: number]: boolean }>({});

  useEffect(() => {
    dispatch(fetchAbsences());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAbsences());
    setExpandedStudent(null);
  };

  const toggleStudentExpand = (id: number) => {
    setExpandedStudent(expandedStudent === id ? null : id);
  };

  const handleSort = (key: 'name' | 'totalAbsences') => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedData = [...data]
    .filter((student) => student.totalAbsences >= filterThreshold)
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const getAbsenceSeverity = (count: number) => {
    if (count > 10) return 'critical';
    if (count > 5) return 'high';
    if (count > 0) return 'medium';
    return 'none';
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3"
      >
        <FiAlertCircle className="text-red-500 mt-1 flex-shrink-0" />
        <div>
          <p className="text-red-700 font-medium">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm flex items-center gap-1 hover:bg-red-200 transition-colors"
          >
            <FiRefreshCw className="w-3 h-3" />
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Student Absence Tracking</h2>
          <p className="text-gray-500 text-sm">Monitor and analyze student attendance patterns</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <FiFilter className="text-gray-400" />
            <select
              value={filterThreshold}
              onChange={(e) => setFilterThreshold(Number(e.target.value))}
              className="text-sm bg-transparent outline-none appearance-none"
            >
              <option value={0}>All Absences</option>
              <option value={1}>1+ Absences</option>
              <option value={3}>3+ Absences</option>
              <option value={5}>5+ Absences</option>
              <option value={10}>10+ Absences</option>
            </select>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Refresh Data</span>
          </button>
        </div>
      </motion.div>

      {/* Student List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200 font-medium text-gray-600 text-sm">
          <div
            className="col-span-5 flex items-center gap-1 cursor-pointer hover:text-gray-800"
            onClick={() => handleSort('name')}
          >
            Student
            {sortConfig.key === 'name' && (
              <span className="text-indigo-500">
                {sortConfig.direction === 'asc' ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              </span>
            )}
          </div>
          <div
            className="col-span-3 flex items-center justify-center gap-1 cursor-pointer hover:text-gray-800"
            onClick={() => handleSort('totalAbsences')}
          >
            Total Absences
            {sortConfig.key === 'totalAbsences' && (
              <span className="text-indigo-500">
                {sortConfig.direction === 'asc' ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              </span>
            )}
          </div>
          <div className="col-span-4">Absence History</div>
        </div>

        {/* Student Items */}
        <AnimatePresence>
          {filteredAndSortedData.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 text-center text-gray-500"
            >
              No students found matching your criteria
            </motion.div>
          ) : (
            filteredAndSortedData.map((student) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <div className="grid grid-cols-12 p-4 cursor-pointer" onClick={() => toggleStudentExpand(student.id)}>
                  <div className="col-span-5 flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600"
                      data-tooltip-id="student-tooltip"
                      data-tooltip-content={`ID: ${student.id}`}
                    >
                      {student.avatar && !imageErrorMap[student.id] ? (
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-full h-full rounded-full object-cover"
                          onError={() =>
                            setImageErrorMap((prev) => ({
                              ...prev,
                              [student.id]: true
                            }))
                          }
                        />
                      ) : (
                        <FiUser className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{student.name}</span>
                      <span className="text-xs text-gray-500">
                        {student.recentAbsences.length > 0
                          ? `Last absent ${format(parseISO(student.recentAbsences[0].date), 'MMM d, yyyy')}`
                          : 'Perfect attendance'}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-3 flex items-center justify-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        getAbsenceSeverity(student.totalAbsences) === 'critical'
                          ? 'bg-red-100 text-red-800'
                          : getAbsenceSeverity(student.totalAbsences) === 'high'
                          ? 'bg-orange-100 text-orange-800'
                          : getAbsenceSeverity(student.totalAbsences) === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {student.totalAbsences} {student.totalAbsences === 1 ? 'absence' : 'absences'}
                    </span>
                  </div>

                  <div className="col-span-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {student.recentAbsences.length > 0 ? (
                        <span>{student.recentAbsences.length} recent</span>
                      ) : (
                        <span className="text-gray-400">No recent absences</span>
                      )}
                    </div>
                    <div className="text-gray-400">
                      {expandedStudent === student.id ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedStudent === student.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 ml-16">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Absence Details</h4>
                        {student.recentAbsences.length > 0 ? (
                          <div className="space-y-3">
                            {student.recentAbsences.map((absence, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-3 text-sm p-2 bg-gray-50 rounded-lg"
                              >
                                <div className="mt-1">
                                  <FiCalendar className="text-gray-400 flex-shrink-0" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-700">
                                    {format(parseISO(absence.date), 'EEEE, MMMM d, yyyy')}
                                  </div>
                                  {absence.remark && (
                                    <div className="text-gray-500 mt-1">{absence.remark}</div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-400">
                            No absence records found for this student
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      <Tooltip id="student-tooltip" />
    </div>
  );
};

export default AbsenceList;
