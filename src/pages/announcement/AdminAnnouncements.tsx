import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.extend(utc);

import {
  fetchAllAnnouncementsForAdmin,
  clearAnnouncementState,
} from './announcementSlice';
import { RootState, AppDispatch } from '../../Redux/store';
import { useNavigate } from 'react-router-dom'; // <--- Import useNavigate

// Import React Icons
import {
  FiBell,
  FiCalendar,
  FiClock,
  FiUser,
  FiAlertCircle,
  FiTarget,
  FiZap,
  FiCheckCircle,
  FiArrowLeft, // <--- Import FiArrowLeft for the back button
} from 'react-icons/fi';

// Define the Announcement interface based on your Redux state structure
// If not using TypeScript, you can omit this.
interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  targetRole: string;
  isExpired: boolean;
  timeRemaining: string;
  isUrgent?: boolean;
  createdBy: {
    fullName: string;
    role: string;
isExpired?: boolean;
  timeRemaining?: string;
  isUrgent?: boolean;

  };
}

// Skeleton Loader Component
const AnnouncementSkeleton = () => (
  <div className="p-6 border rounded-lg shadow-md bg-white animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
    <div className="flex justify-between items-center text-sm">
      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);

const AdminAnnouncements: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // <--- Initialize useNavigate hook
  const { announcements, loading, error } = useSelector(
    (state: RootState) => state.announcement
  );

  useEffect(() => {
    dispatch(fetchAllAnnouncementsForAdmin());
    return () => {
      dispatch(clearAnnouncementState());
    };
  }, [dispatch]);

  // Helper to calculate time remaining and check expiration
  const processAnnouncements = (anns: any[]): Announcement[] => {
    return anns.map((ann) => {
      const now = dayjs();
      // const startDate = dayjs.utc(ann.startDate);
      const endDate = ann.endDate ? dayjs.utc(ann.endDate) : null;

      const isExpired = endDate ? endDate.isBefore(now) : false;

      let timeRemaining = 'No expiration set';
      if (endDate) {
        if (isExpired) {
          timeRemaining = 'Expired';
        } else {
          timeRemaining = endDate.fromNow(true) + ' left';
          if (endDate.diff(now, 'day') < 2) {
            timeRemaining = endDate.diff(now, 'hour') > 0 ? `${endDate.diff(now, 'hour')} hours left` : `${endDate.diff(now, 'minute')} minutes left`;
          }
        }
      }

      const isUrgent = ann.isUrgent || (endDate && !isExpired && endDate.diff(now, 'hour') <= 24);

      return {
        ...ann,
        isExpired,
        timeRemaining,
        isUrgent,
        createdBy: {
          fullName: ann.createdBy?.fullName || 'Unknown',
          role: ann.createdBy?.role || 'N/A',
        },
      };
    }).sort((a, b) => {
        if (a.isExpired !== b.isExpired) return a.isExpired ? 1 : -1;
        if (a.isUrgent !== b.isUrgent) return a.isUrgent ? -1 : 1;
        return dayjs(b.createdAt).diff(dayjs(a.createdAt));
    });
  };


  

  const processedAnnouncements = processAnnouncements(announcements);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 sm:p-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8"> {/* Flex container for title and button */}
          <h2 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
            <FiBell className="text-purple-600 text-3xl" />
            Announcements Hub
          </h2>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(99, 102, 241, 0.2)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')} // <--- Navigate to your dashboard route
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 font-semibold"
          >
            <FiArrowLeft size={20} /> Back to Dashboard
          </motion.button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-lg shadow-sm flex items-center gap-2"
          >
            <FiAlertCircle className="h-5 w-5" />
            <p className="font-medium">Error: {error}</p>
          </motion.div>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnnouncementSkeleton />
            <AnnouncementSkeleton />
            <AnnouncementSkeleton />
          </div>
        )}

        {!loading && !error && processedAnnouncements.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-10 bg-white rounded-xl shadow-md text-gray-500 text-lg"
          >
            <FiBell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            No announcements found.
          </motion.div>
        )}

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading &&
            processedAnnouncements.map((a, index) => (
              <motion.li
                key={a.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative p-6 border rounded-xl shadow-lg transition-all duration-300
                  ${
                    a.isExpired
                      ? 'bg-red-50 border-red-200 text-red-800 opacity-70 hover:shadow-xl'
                      : a.isUrgent
                      ? 'bg-yellow-50 border-yellow-300 text-yellow-800 ring-2 ring-yellow-400 hover:shadow-xl'
                      : 'bg-white border-gray-200 text-gray-800 hover:shadow-xl'
                  }
                `}
              >
                {/* Urgent / Expired Badges */}
                {a.isExpired && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <FiAlertCircle size={14} /> EXPIRED
                  </span>
                )}
                {!a.isExpired && a.isUrgent && (
                  <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md animate-pulse">
                    <FiZap size={14} /> URGENT
                  </span>
                )}

                <div className="mb-4">
                  <h3 className={`text-xl font-bold mb-2 ${a.isExpired ? 'text-red-700' : 'text-gray-900'}`}>
                    {a.title}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <FiUser size={14} className="text-purple-500" />
                    By: <span className="font-semibold">{a.createdBy.fullName}</span> ({a.createdBy.role})
                  </p>
                </div>

                <p className="text-gray-700 mb-5 leading-relaxed line-clamp-3">
                  {a.message}
                </p>

                <div className="text-xs text-gray-500 border-t border-gray-100 pt-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <FiTarget size={14} className="text-blue-500" />
                    <span className="font-medium text-gray-700">Target Audience:</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                      {a.targetRole}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar size={14} className="text-green-500" />
                    <span className="font-medium text-gray-700">Duration:</span>
                    <span className="font-semibold">
                      {dayjs.utc(a.startDate).format('MMM D,YYYY')} –{' '}
                      {a.endDate ? dayjs.utc(a.endDate).format('MMM D,YYYY') : 'Ongoing'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock size={14} className="text-orange-500" />
                    <span className="font-medium text-gray-700">Time Left:</span>
                    <span
                      className={`font-bold ${
                        a.isExpired ? 'text-red-600' : a.isUrgent ? 'text-orange-600' : 'text-green-600'
                      }`}
                    >
                      {a.timeRemaining}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <FiCheckCircle size={14} className="text-gray-400" />
                    <span className="font-medium text-gray-700">Posted:</span>{' '}
                    {dayjs.utc(a.createdAt).format('MMM D,YYYY [at] h:mm A')}
                  </div>
                </div>
              </motion.li>
            ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default AdminAnnouncements;