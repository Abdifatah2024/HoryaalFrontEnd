import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
import { getUserById, deleteUser } from "../Redux/Auth/RegisterSlice";
import { FiSearch, FiTrash2, FiUser, FiAlertCircle, FiSmartphone, FiUserPlus, FiCalendar } from "react-icons/fi";

const UserSearch = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, loading, error } = useSelector((state: RootState) => state.registerSlice);
    const [userId, setUserId] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto">
                {/* Search Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="mb-4">
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
                            className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>

                {/* Results Section */}
                {loading && (
                    <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                        <div className="h-6 bg-gray-100 rounded w-1/3 mb-4"></div>
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 rounded-xl p-4 mb-6 flex items-start gap-3">
                        <FiAlertCircle className="text-red-500 mt-1" />
                        <div>
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {user && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6">
                            {/* User Header */}
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                    <FiUser className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">{user.fullName}</h2>
                                    <p className="text-gray-500">{user.email}</p>
                                </div>
                            </div>

                            {/* User Details */}
                            <div className="grid gap-4 mb-6">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <FiSmartphone className="text-gray-400" />
                                    <span>Mobile: {user.phoneNumber}</span>
                                </div>
                                
                                <div className="flex items-center gap-2 text-gray-600">
                                    <FiCalendar className="text-gray-400" />
                                    <span>Created Date: {new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>

                                {user.createdBy && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FiUser className="text-gray-400" />
                                        <span>Created By: {user.createdBy}</span>
                                    </div>
                                )}

                                {user.role && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FiUser className="text-gray-400" />
                                        <span>Role: {user.role}</span>
                                    </div>
                                )}
                            </div>

                            {/* Delete Button */}
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="w-full py-2.5 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2"
                            >
                                <FiTrash2 />
                                Delete User
                            </button>
                        </div>
                    </div>
                )}

                {/* Delete Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl p-6 max-w-md w-full">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold">Confirm Deletion</h3>
                                <p className="text-gray-500 mt-1">Are you sure you want to delete this user?</p>
                            </div>
                            
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Delete
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