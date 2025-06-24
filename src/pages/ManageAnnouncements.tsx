import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllAnnouncementsForAdmin,
  createAnnouncement,
  deleteAnnouncement,
  clearAnnouncementState,
  editAnnouncement,
} from './announcement/announcementSlice';
import { AppDispatch, RootState } from '../Redux/store';

interface Announcement {
  id: number;
  title: string;
  message: string;
  targetRole: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  timeRemaining?: string;
}

// Helper: Format date string
const formatDateTime = (isoString: string) => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const ManageAnnouncements = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { announcements, loading, error, success } = useSelector(
    (state: RootState) => state.announcement
  );

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState('USER');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchAllAnnouncementsForAdmin());
    return () => {
      dispatch(clearAnnouncementState());
    };
  }, [dispatch]);

  const handleCreateOrEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message || !startDate || !endDate) {
      alert('Please fill in all fields.');
      return;
    }

    const data = { title, message, targetRole, startDate, endDate };

    if (editingId !== null) {
      await dispatch(editAnnouncement({ id: editingId, ...data }));
    } else {
      await dispatch(createAnnouncement(data));
    }

    setTitle('');
    setMessage('');
    setTargetRole('USER');
    setStartDate('');
    setEndDate('');
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      dispatch(deleteAnnouncement(id));
    }
  };

  const handleEdit = (a: Announcement) => {
    setEditingId(a.id);
    setTitle(a.title);
    setMessage(a.message);
    setTargetRole(a.targetRole);
    setStartDate(a.startDate?.slice(0, 16));
    setEndDate(a.endDate?.slice(0, 16));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setMessage('');
    setTargetRole('USER');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="font-sans p-8 max-w-7xl mx-auto bg-gray-50 rounded-xl shadow-2xl">
      <h2 className="text-4xl text-gray-800 text-center mb-10 font-bold flex items-center justify-center gap-2">
        📢 Manage Announcements
      </h2>

      <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8">
        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <h4 className="text-2xl text-gray-700 mb-6 pb-3 border-b-2">New Announcement</h4>
          <form onSubmit={handleCreateOrEdit} className="grid gap-5">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="p-3 border rounded-lg"
            />
            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              className="p-3 border rounded-lg"
            />
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="p-3 border rounded-lg"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="Teacher">Teacher</option>
              <option value="PARENT">Parent</option>
            </select>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="p-3 border rounded-lg"
            />
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="p-3 border rounded-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
            >
              {editingId
                ? loading
                  ? 'Updating...'
                  : 'Update Announcement'
                : loading
                ? 'Creating...'
                : 'Create Announcement'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-red-600 text-sm underline mt-2"
              >
                Cancel Edit
              </button>
            )}
            {success && <p className="text-green-600">{success}</p>}
            {error && <p className="text-red-600">{error}</p>}
          </form>
        </div>

        {/* List */}
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <h4 className="text-2xl text-gray-700 mb-6 pb-3 border-b-2">All Announcements</h4>
          {loading ? (
            <p>Loading...</p>
          ) : announcements.length === 0 ? (
            <p>No announcements available.</p>
          ) : (
            <ul className="space-y-6">
              {announcements.map((a) => (
                <li key={a.id} className="border p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center">
                    <h5 className="text-lg font-bold">{a.title}</h5>
                    <span className="text-sm text-blue-600">🎯 {a.targetRole}</span>
                  </div>
                  <p className="text-gray-700 my-2">{a.message}</p>
                  <p className="text-sm text-gray-500">
                    📅 {formatDateTime(a.startDate)} → {formatDateTime(a.endDate)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    ⏳{' '}
                    <b
                      className={
                        a.timeRemaining === 'Expired' ? 'text-red-600' : 'text-green-600'
                      }
                    >
                      {a.timeRemaining || 'Expired'}
                    </b>
                  </p>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleEdit(a)}
                      className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAnnouncements;
