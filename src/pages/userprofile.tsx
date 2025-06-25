import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
import { getUserById, deleteUser } from "../Redux/Auth/RegisterSlice";
import { 
  FiSearch, 
  FiTrash2, 
  FiUser, 
  FiAlertCircle, 
  FiSmartphone, 
  FiUserPlus, 
  FiCalendar,
  FiImage,
  FiShield,
  FiX,
  FiCheck
} from "react-icons/fi";

const UserSearch = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, loading, error } = useSelector((state: RootState) => state.registerSlice);
    const [userId, setUserId] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Debounce search input
    useEffect(() => {
        if (userId.trim()) {
            const timer = setTimeout(() => dispatch(getUserById(userId)), 500);
            return () => clearTimeout(timer);
        }
    }, [dispatch, userId]);

    const handleDelete = () => {
        dispatch(deleteUser());
        setShowDeleteModal(false);
        setUserId("");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-3xl mx-auto">
                {/* Search Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <FiUserPlus className="text-blue-500" />
                            User Management
                        </h1>
                        <p className="text-gray-500 mt-1">Search users by ID</p>
                    </div>
                    
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Enter user ID..."
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 animate-pulse border border-gray-100">
                        <div className="h-6 bg-gray-100 rounded w-1/3 mb-4"></div>
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-start gap-3">
                        <FiAlertCircle className="text-red-500 mt-1 flex-shrink-0" />
                        <div>
                            <p className="text-red-700 font-medium">{error}</p>
                            <p className="text-red-600 text-sm mt-1">Please check the ID and try again</p>
                        </div>
                    </div>
                )}

                {/* User Data */}
                {user && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-6">
                        <div className="p-6">
                            {/* User Header */}
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                    {user.photo ? (
                                        <img 
                                            src={user.photo} 
                                            alt={user.fullName} 
                                            className="w-full h-full rounded-lg object-cover"
                                        />
                                    ) : (
                                        <FiUser className="w-6 h-6" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold text-gray-800">{user.fullName}</h2>
                                    <p className="text-gray-500 text-sm">{user.email}</p>
                                    {user.Role && (
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
                                            {user.Role}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* User Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <FiSmartphone className="text-gray-400 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400">Phone</p>
                                        <p className="text-gray-600">{user.phoneNumber || 'Not provided'}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <FiCalendar className="text-gray-400 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400">Joined</p>
                                        <p className="text-gray-600">
                                            {new Date(user.createdAt ?? "").toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {user.createdBy && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <FiUser className="text-gray-400 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-400">Created By</p>
                                            <p className="text-gray-600">{user.createdBy}</p>
                                        </div>
                                    </div>
                                )}

                                {user.photo && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <FiImage className="text-gray-400 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-400">Photo URL</p>
                                            <p className="text-gray-600 truncate">{user.photo}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Delete Button */}
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="w-full py-3 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-medium"
                            >
                                <FiTrash2 />
                                Delete User
                            </button>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl p-6 max-w-md w-full animate-fade-in">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <FiShield className="text-red-500" />
                                        Confirm Deletion
                                    </h3>
                                    <p className="text-gray-500 mt-1">
                                        This action cannot be undone. All data associated with this user will be permanently removed.
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setShowDeleteModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors flex items-center gap-2"
                                >
                                    <FiCheck size={16} />
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserSearch;