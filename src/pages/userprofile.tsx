import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
import { getUserById, deleteUser } from "../Redux/Auth/RegisterSlice";

const UserSearch = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.registerSlice.user);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        if (userId.trim()) {
            dispatch(getUserById(userId));
        }
    }, [dispatch, userId]);

    const handleDeleteUser = () => {
        dispatch(deleteUser());
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center px-6 py-12">
            {/* Search Section */}
            <div className="w-full max-w-lg bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-slate-800">User Search</h1>
                        <p className="text-slate-500 mt-1">Find user details by entering their ID</p>
                    </div>
                    
                    <div className="flex flex-col space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-slate-700">User ID</label>
                            </div>
                            <input
                                type="text"
                                placeholder="Enter user ID..."
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        
                        <button
                            onClick={() => setUserId("")}
                            disabled={!userId}
                            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Reset Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            {user && (
                <div className="w-full max-w-lg bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl font-bold">
                                {user?.fullName?.charAt(0) || "U"}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-slate-800">{user.fullName}</h2>
                                <p className="text-slate-500">{user.email}</p>
                            </div>
                        </div>
                        
                        <div className="space-y-3 mb-8">
                            <div className="flex items-center text-slate-700">
                                <svg className="w-5 h-5 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>{user.phoneNumber}</span>
                            </div>
                        </div>
                        
                        <button
                            onClick={handleDeleteUser}
                            className="w-full py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Delete User</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserSearch;
