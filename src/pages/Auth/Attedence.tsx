import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import {
  markAttendance,
  fetchAttendanceRecords,
  updateAttendanceRecord,
  selectAttendanceRecords,
  selectAttendanceMarkStatus,
  selectAttendanceFetchStatus,
  selectAttendanceUpdateStatus,
  selectAttendanceError,
  clearAttendanceRecords,
  resetAttendanceStatus,
} from '../../Redux/Auth/AttedenceSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEdit, FiDownload, FiSearch, FiUser, FiCalendar, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { FaChalkboardTeacher } from 'react-icons/fa';

interface AttendanceRecord {
  id: number;
  date: string;
  present: boolean;
  remark: string;
  user?: {
    fullName: string;
    avatar?: string;
  };
}

const Attendance = () => {
  const dispatch = useAppDispatch();
  const records = useAppSelector(selectAttendanceRecords);
  const markStatus = useAppSelector(selectAttendanceMarkStatus);
  const fetchStatus = useAppSelector(selectAttendanceFetchStatus);
  const updateStatus = useAppSelector(selectAttendanceUpdateStatus);
  const error = useAppSelector(selectAttendanceError);

  const [studentId, setStudentId] = useState<number | null>(null);
  const [inputId, setInputId] = useState('');
  const [present, setPresent] = useState(true);
  const [remark, setRemark] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    return () => {
      dispatch(clearAttendanceRecords());
      dispatch(resetAttendanceStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (markStatus === 'succeeded' || updateStatus === 'succeeded') {
      toast.success(
        <div className="flex items-center">
          {editMode ? (
            <>
              <FiCheckCircle className="mr-2 text-green-500" />
              Attendance updated successfully!
            </>
          ) : (
            <>
              <FiCheckCircle className="mr-2 text-green-500" />
              Attendance marked successfully!
            </>
          )}
        </div>
      );
      resetForm();
      if (studentId) {
        dispatch(fetchAttendanceRecords({
          studentId,
          date: filterDate,
          present: filterStatus === 'present' ? true : filterStatus === 'absent' ? false : undefined,
        }));
      }
    }

    if (error) {
      toast.error(
        <div className="flex items-center">
          <FiXCircle className="mr-2 text-red-500" />
          {error}
        </div>
      );
      dispatch(resetAttendanceStatus());
    }
  }, [markStatus, updateStatus, error, dispatch, studentId, filterDate, filterStatus, editMode]);

  const resetForm = () => {
    setEditMode(false);
    setEditingId(null);
    setPresent(true);
    setRemark('');
    setAttendanceDate(new Date().toISOString().split('T')[0]);
  };

  const handleFetchRecords = () => {
    const id = parseInt(inputId);
    if (isNaN(id) || id <= 0) {
      toast.error(
        <div className="flex items-center">
          <FiXCircle className="mr-2 text-red-500" />
          Please enter a valid positive Student ID.
        </div>
      );
      return;
    }

    toast.promise(
      dispatch(fetchAttendanceRecords({
        studentId: id,
        date: filterDate,
        present: filterStatus === 'present' ? true : filterStatus === 'absent' ? false : undefined,
      })).unwrap(),
      {
        pending: {
          render: () => (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
              Fetching attendance records...
            </div>
          )
        },
        success: {
          render() {
            setStudentId(id);
            return (
              <div className="flex items-center">
                <FiCheckCircle className="mr-2 text-green-500" />
                Records loaded successfully
              </div>
            );
          },
        },
        error: {
          render({ data }) {
            return (
              <div className="flex items-center">
                <FiXCircle className="mr-2 text-red-500" />
                Error: {data || 'Failed to fetch records'}
              </div>
            );
          },
        },
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const id = parseInt(inputId);
    if (isNaN(id) || id <= 0) {
      toast.error(
        <div className="flex items-center">
          <FiXCircle className="mr-2 text-red-500" />
          Please enter a valid Student ID.
        </div>
      );
      return;
    }

    if (!present && !remark.trim()) {
      toast.error(
        <div className="flex items-center">
          <FiXCircle className="mr-2 text-red-500" />
          Please enter a remark for absence.
        </div>
      );
      return;
    }

    const action = editMode && editingId
      ? dispatch(updateAttendanceRecord({ id: editingId, present, remark }))
      : dispatch(markAttendance({ studentId: id, present, remark, date: attendanceDate }));

    toast.promise(action, {
      pending: {
        render: () => (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            {editMode ? 'Updating attendance...' : 'Marking attendance...'}
          </div>
        )
      },
      success: {
        render: () => (
          <div className="flex items-center">
            <FiCheckCircle className="mr-2 text-green-500" />
            {editMode ? 'Attendance updated!' : 'Attendance marked!'}
          </div>
        )
      },
      error: {
        render({ data }) {
          return (
            <div className="flex items-center">
              <FiXCircle className="mr-2 text-red-500" />
              Error: {data || 'Operation failed'}
            </div>
          );
        },
      },
    });
  };

  const handleEdit = (record: AttendanceRecord) => {
    setEditMode(true);
    setEditingId(record.id);
    setPresent(record.present);
    setRemark(record.remark);
    setAttendanceDate(record.date.split('T')[0]);
    toast.info(
      <div className="flex items-center">
        <FiEdit className="mr-2 text-blue-500" />
        Editing record from {formatDate(record.date)}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMonthlySummary = () => {
    const presentDays = records.filter((r) => r.present).length;
    const absentDays = records.length - presentDays;
    const totalDays = records.length;
    const attendanceRate = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : '0.0';

    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;
    const sortedRecords = [...records].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    sortedRecords.forEach(record => {
      if (record.present) {
        currentStreak++;
        if (currentStreak > longestStreak) longestStreak = currentStreak;
      } else {
        currentStreak = 0;
      }
    });

    return {
      presentDays,
      absentDays,
      totalDays,
      attendanceRate,
      currentStreak: sortedRecords[0]?.present ? currentStreak : 0,
      longestStreak
    };
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Status', 'Remark', 'Marked By'];
    const csvRows = [
      headers.join(','),
      ...records.map((rec) =>
        [
          new Date(rec.date).toLocaleDateString(),
          rec.present ? 'Present' : 'Absent',
          `"${rec.remark || '-'}"`,
          rec.user?.fullName || 'N/A',
        ].join(',')
      ),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance_${studentId}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    toast.success(
      <div className="flex items-center">
        <FiDownload className="mr-2 text-green-500" />
        CSV exported successfully!
      </div>
    );
  };

  const summary = getMonthlySummary();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            🎓 Attendance Tracker
          </h1>
          <p className="text-gray-600">Manage and track student attendance records</p>
        </div>
        {studentId && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center"
          >
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </motion.button>
        )}
      </motion.div>

      {/* Search Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-gray-100"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FiSearch className="mr-2 text-blue-500" />
          Student Search
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                type="text"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 101"
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400" />
              </div>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFetchRecords}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-md shadow-md flex items-center justify-center"
            >
              {fetchStatus === 'loading' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <FiSearch className="mr-2" />
                  Search Records
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Analytics Panel */}
      <AnimatePresence>
        {showAnalytics && studentId && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-gray-100 overflow-hidden"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Attendance Analytics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 text-center shadow-sm"
              >
                <div className="text-3xl font-bold text-green-700">{summary.presentDays}</div>
                <div className="text-sm text-green-800 uppercase tracking-wider">Days Present</div>
                <div className="mt-2 h-2 bg-green-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${summary.totalDays ? (summary.presentDays / summary.totalDays * 100) : 0}%` }}
                  ></div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 text-center shadow-sm"
              >
                <div className="text-3xl font-bold text-red-700">{summary.absentDays}</div>
                <div className="text-sm text-red-800 uppercase tracking-wider">Days Absent</div>
                <div className="mt-2 h-2 bg-red-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${summary.totalDays ? (summary.absentDays / summary.totalDays * 100) : 0}%` }}
                  ></div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 text-center shadow-sm"
              >
                <div className="text-3xl font-bold text-blue-700">{summary.attendanceRate}%</div>
                <div className="text-sm text-blue-800 uppercase tracking-wider">Attendance Rate</div>
                <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${summary.attendanceRate}%` }}
                  ></div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 text-center shadow-sm"
              >
                <div className="text-3xl font-bold text-purple-700">{summary.currentStreak}</div>
                <div className="text-sm text-purple-800 uppercase tracking-wider">Current Streak</div>
                <div className="text-xs text-purple-600 mt-1">Longest: {summary.longestStreak} days</div>
              </motion.div>
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportToCSV}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center"
              >
                <FiDownload className="mr-2" />
                Export Analytics
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attendance Form */}
      {studentId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-gray-100"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            {editMode ? (
              <>
                <FiEdit className="mr-2 text-yellow-500" />
                Edit Attendance Record
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mark New Attendance
              </>
            )}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block font-medium mb-3 text-gray-700">Attendance Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]} // Can't select future dates
                  className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-medium mb-3 text-gray-700">Attendance Status</label>
              <div className="flex gap-6">
                <motion.label
                  whileHover={{ scale: 1.05 }}
                  className={`inline-flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${present ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                >
                  <input
                    type="radio"
                    name="status"
                    checked={present}
                    onChange={() => setPresent(true)}
                    className="form-radio h-5 w-5 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-3 text-gray-700 flex items-center">
                    <FiCheckCircle className={`mr-2 ${present ? 'text-green-600' : 'text-gray-400'}`} />
                    Present
                  </span>
                </motion.label>

                <motion.label
                  whileHover={{ scale: 1.05 }}
                  className={`inline-flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${!present ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                >
                  <input
                    type="radio"
                    name="status"
                    checked={!present}
                    onChange={() => setPresent(false)}
                    className="form-radio h-5 w-5 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-3 text-gray-700 flex items-center">
                    <FiXCircle className={`mr-2 ${!present ? 'text-red-600' : 'text-gray-400'}`} />
                    Absent
                  </span>
                </motion.label>
              </div>
            </div>

            {!present && (
              <div className="mb-6">
                <label className="block mb-2 font-medium text-gray-700">Absence Remark</label>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  rows={3}
                  placeholder="Please provide a reason for absence..."
                />
                <p className="text-sm text-gray-500 mt-1">This helps us understand the absence reason.</p>
              </div>
            )}

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg shadow-md flex items-center"
              >
                {editMode ? (
                  <>
                    <FiEdit className="mr-2" />
                    Update Record
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Confirm Attendance
                  </>
                )}
              </motion.button>

              {editMode && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => {
                    resetForm();
                    toast.info(
                      <div className="flex items-center">
                        <FiXCircle className="mr-2 text-blue-500" />
                        Edit cancelled
                      </div>
                    );
                  }}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg border border-gray-300 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      )}

      {/* Attendance Records */}
      {studentId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100"
        >
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Attendance History
            </h2>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToCSV}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center text-sm"
            >
              <FiDownload className="mr-2" />
              Export CSV
            </motion.button>
          </div>

          {fetchStatus === 'loading' ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : records.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No attendance records</h3>
              <p className="mt-1 text-sm text-gray-500">No records found for this student with the current filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remark
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marked By
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.map((record) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${record.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {record.present ? 'Present' : 'Absent'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {record.remark || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <FaChalkboardTeacher className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{record.user?.fullName || 'System'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(record)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FiEdit className="h-5 w-5" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Attendance;
