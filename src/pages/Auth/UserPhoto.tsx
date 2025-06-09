import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { fetchUserProfile, uploadUserPhoto } from '../../Redux/Auth/userPhotoSlice';
import { FiUser, FiUpload, FiEdit, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// ✅ Define User type
interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'Teacher' | 'USER';
  photoUrl?: string;
}

const UserProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: loginData } = useAppSelector((state) => state.loginSlice);
  const { userData, loading, error } = useAppSelector(
    (state) => state.user
  ) as { userData: User | null; loading: boolean; error: string | null };

  const currentUserId = loginData?.user?.id;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({ fullName: '', email: '' });
  const [isUploading, setIsUploading] = useState(false);

  const getFullPhotoUrl = (url?: string) => {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    return `${baseUrl}/${url.replace(/^\/+/, '')}`;
  };

  useEffect(() => {
    if (userData) {
      setEditValues({
        fullName: userData.fullName || '',
        email: userData.email || ''
      });
    }
  }, [userData]);

  useEffect(() => {
    if (currentUserId) dispatch(fetchUserProfile(currentUserId));
  }, [dispatch, currentUserId]);

  useEffect(() => {
    if (!selectedFile) return setPreviewUrl(null);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  // ✅ Reset image error if user photo changes
  useEffect(() => {
    setImageError(false);
  }, [userData?.photoUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
      toast.error('Image must be JPG, PNG, or GIF and under 5MB.');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !currentUserId) return;
    setIsUploading(true);
    try {
      await dispatch(uploadUserPhoto({ userId: currentUserId, photo: selectedFile })).unwrap();
      setSelectedFile(null);
      setPreviewUrl(null);
      dispatch(fetchUserProfile(currentUserId));
      toast.success('Photo uploaded successfully');
    } catch {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-lg">
        Please log in to view profile.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <FiLoader className="animate-spin text-5xl text-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white rounded-xl shadow p-6 border border-red-200">
        <div className="flex gap-3 text-red-600">
          <FiAlertCircle size={24} />
          <div>
            <h3 className="font-semibold">Profile Error</h3>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm font-medium text-gray-600 hover:underline"
            >
              Reload page
            </button>
          </div>
        </div>
      </div>
    );
  }

  const photoSrc = getFullPhotoUrl(userData?.photoUrl);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-md border border-gray-200 mb-8 p-6"
        >
          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage your information and access.</p>
        </motion.div>

        <AnimatePresence>
          {userData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-md border border-gray-200 p-6"
            >
              <div className="flex flex-col lg:flex-row gap-10">
                {/* Profile Picture */}
                <div className="flex flex-col items-center lg:items-start">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-50">
                    {photoSrc && !imageError ? (
                      <img
                        src={photoSrc}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <FiUser className="w-20 h-20" />
                      </div>
                    )}
                  </div>

                  {/* Upload Section */}
                  <div className="mt-5 w-full max-w-xs">
                    <label className="text-sm font-medium text-gray-700">Upload new photo</label>
                    <label className="block mt-2">
                      <div className="w-full py-2 px-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:bg-gray-100 text-sm text-gray-600">
                        <FiUpload className="inline-block mr-2 text-gray-400" />
                        {selectedFile ? selectedFile.name : 'Choose image'}
                      </div>
                      <input type="file" onChange={handleFileChange} className="hidden" />
                    </label>

                    {previewUrl && (
                      <div className="mt-4">
                        <img src={previewUrl} alt="Preview" className="rounded-lg shadow" />
                        <button
                          onClick={() => {
                            setPreviewUrl(null);
                            setSelectedFile(null);
                          }}
                          className="mt-2 text-sm text-red-500 hover:underline"
                        >
                          Remove Preview
                        </button>
                      </div>
                    )}

                    {selectedFile && (
                      <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm"
                      >
                        {isUploading ? 'Uploading...' : 'Upload Photo'}
                      </button>
                    )}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{userData.fullName}</h2>
                      <p className="text-gray-600">{userData.email}</p>
                      <span className="inline-block mt-1 px-3 py-0.5 bg-indigo-100 text-indigo-600 text-xs rounded-full font-medium uppercase">
                        {userData.role}
                      </span>
                    </div>

                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="inline-flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-md transition"
                    >
                      <FiEdit />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  {isEditing && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          className="border p-2 rounded-md"
                          value={editValues.fullName}
                          onChange={(e) => setEditValues({ ...editValues, fullName: e.target.value })}
                        />
                        <input
                          className="border p-2 rounded-md"
                          value={editValues.email}
                          onChange={(e) => setEditValues({ ...editValues, email: e.target.value })}
                        />
                      </div>
                      <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                        onClick={() => {
                          // TODO: Dispatch updateUserProfile action here
                          setIsEditing(false);
                          toast.success('Changes saved (mock)');
                        }}
                      >
                        Save Changes
                      </button>
                    </>
                  )}

                  {/* Access Info */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Access Permissions</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700 list-disc pl-4">
                      {userData.role === 'ADMIN' && (
                        <>
                          <li>Full access to user and student management</li>
                          <li>Can upload, register, and delete data</li>
                          <li>Full exam and attendance reporting</li>
                          <li>Class and subject management</li>
                        </>
                      )}
                      {userData.role === 'Teacher' && (
                        <>
                          <li>View and manage assigned classes</li>
                          <li>Submit grades and attendance</li>
                          <li>Limited access to student data</li>
                        </>
                      )}
                      {userData.role === 'USER' && (
                        <>
                          <li>Basic view access</li>
                          <li>Profile & password management</li>
                          <li>Submit attendance</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserProfile;
