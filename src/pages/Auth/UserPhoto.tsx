import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { fetchUserProfile, uploadUserPhoto } from '../../Redux/Auth/userPhotoSlice';
import {
  FiUser,
  FiUpload,
  FiImage,
  FiMail,
  FiKey,
  FiTag,
  FiLoader,
  FiAlertCircle,
  FiEdit,
  FiX,
  FiCalendar,
  FiSettings,
  FiActivity
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const dispatch = useAppDispatch();

  const { data: loginData } = useAppSelector((state) => state.loginSlice);
  const { userData, loading, error } = useAppSelector((state) => state.user);

  const currentUserId = loginData?.user?.id;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    fullName: '',
    email: ''
  });
  const [activeTab, setActiveTab] = useState<'profile' | 'activity' | 'settings'>('profile');
  const [isUploading, setIsUploading] = useState(false);

  // Prefill form when userData loads
  useEffect(() => {
    if (userData) {
      setEditValues({
        fullName: userData.fullName || '',
        email: userData.email || ''
      });
    }
  }, [userData]);

  // Fetch profile based on logged-in user ID
  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchUserProfile(currentUserId));
    }
  }, [dispatch, currentUserId]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const getFullPhotoUrl = (url: string) => {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    const cleanPath = url.replace(/^\/+/, '');
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    return `${baseUrl}/${cleanPath}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSizeMB = 5;

    if (!validTypes.includes(file.type)) {
      toast.error('Please select a JPEG, PNG, or GIF image (max 5MB)');
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !currentUserId) return;

    setIsUploading(true);
    try {
      await dispatch(uploadUserPhoto({
        userId: currentUserId,
        photo: selectedFile
      })).unwrap();

      setSelectedFile(null);
      setPreviewUrl(null);
      dispatch(fetchUserProfile(currentUserId));
      toast.success('Profile photo updated successfully');
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Failed to upload profile photo');
    } finally {
      setIsUploading(false);
    }
  };

  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Please log in to view your profile.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <FiLoader className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-sm border border-red-100">
        <div className="flex items-start gap-3 text-red-600">
          <FiAlertCircle className="mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium">Profile Error</h3>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xs border border-gray-200 p-6 mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-1">User Profile</h1>
          <p className="text-gray-500">Manage your account settings and profile.</p>
        </motion.div>

        <AnimatePresence>
          {userData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden"
            >
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'profile' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    <FiUser className="w-4 h-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'activity' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    <FiActivity className="w-4 h-4" />
                    Activity
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'settings' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    <FiSettings className="w-4 h-4" />
                    Settings
                  </button>
                </nav>
              </div>

              <div className="p-6 md:p-8">
                {activeTab === 'profile' && (
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Photo Section */}
                    <div className="flex flex-col items-center lg:items-start">
                      <div className="relative w-40 h-40 rounded-2xl bg-gray-100 overflow-hidden border-4 border-white shadow-md">
                        {userData.photoUrl && !imageError ? (
                          <img
                            src={getFullPhotoUrl(userData.photoUrl)}
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

                      <div className="mt-6 w-full max-w-xs">
                        <label className="block mb-3 text-sm font-medium text-gray-700">
                          Update Profile Photo
                        </label>
                        <label className="block">
                          <div className="flex flex-col items-center px-4 py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
                            <FiUpload className="w-6 h-6 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-600 text-center">
                              {selectedFile ? selectedFile.name : 'Click to select image'}
                            </span>
                          </div>
                          <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                          />
                        </label>

                        {previewUrl && (
                          <div className="mt-4">
                            <img src={previewUrl} alt="Preview" className="rounded-lg shadow" />
                            <button
                              onClick={() => setPreviewUrl(null)}
                              className="mt-2 text-red-500 hover:underline"
                            >
                              Remove Preview
                            </button>
                          </div>
                        )}

                        {selectedFile && (
                          <button
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="mt-4 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                          >
                            {isUploading ? 'Uploading...' : 'Upload Photo'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Profile Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-6">
                        <h2 className="text-xl font-bold text-gray-900">{userData.fullName}</h2>
                        <button
                          onClick={() => setIsEditing(!isEditing)}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                          <FiEdit className="w-4 h-4" />
                          {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {isEditing ? (
                          <>
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
                          </>
                        ) : (
                          <>
                            <div className="bg-gray-50 p-4 rounded-xl">
                              <p className="text-xs text-gray-500">Full Name</p>
                              <p className="font-medium">{userData.fullName}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                              <p className="text-xs text-gray-500">Email</p>
                              <p className="font-medium">{userData.email}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Tabs: Activity, Settings */}
                {activeTab === 'activity' && (
                  <div className="py-4">Recent activity goes here.</div>
                )}

                {activeTab === 'settings' && (
                  <div className="py-4">Settings go here.</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserProfile;

