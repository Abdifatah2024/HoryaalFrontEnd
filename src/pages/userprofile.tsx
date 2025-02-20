// // import { useState, useEffect } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { AppDispatch, RootState } from "../Redux/store";
// // import { getUserById } from "../Redux/Auth/RegisterSlice";

// // const UserSearch = () => {
// //     const dispatch = useDispatch<AppDispatch>();
// //     const user = useSelector((state: RootState) => state.registerSlice.user);
// //     const [userId, setUserId] = useState("");

// //     useEffect(() => {
// //         if (userId.trim()) {
// //             dispatch(getUserById(userId));
// //         }
// //     }, [dispatch, userId]);

// //     return (
// //         <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10">
// //             <div className="text-center mb-8">
// //                 <h1 className="text-4xl font-extrabold text-gray-800">Search User</h1>
// //                 <p className="text-gray-500 mt-2">Enter a User ID to fetch details</p>
// //             </div>

// //             {/* Search Input */}
// //             <div className="flex justify-center gap-3">
// //                 <input
// //                     type="text"
// //                     placeholder="Enter User ID"
// //                     value={userId}
// //                     onChange={(e) => setUserId(e.target.value)}
// //                     className="border border-gray-300 rounded-lg p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 />
// //             </div>

// //             {/* Loading & Error Handling
// //             {loading && <h1 className="text-center text-lg font-semibold text-gray-600 mt-10 animate-pulse">Loading...</h1>}
// //             {error && <p className="text-red-500 text-center mt-5">{error}</p>} */}

// //             {/* User Details */}
// //             {user && (
// //                 <div className="mt-10 w-[90%] md:w-[50%] lg:w-[40%] mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
// //                     <div className="flex items-center space-x-4">
// //                         <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white flex items-center justify-center text-3xl font-bold shadow-md">
// //                         {user?.fullName?.charAt(0) || "?"}
// //                         </div>
// //                         <div>
// //                             <h1 className="text-2xl font-semibold text-gray-900">{user.fullName}</h1>
// //                             <p className="text-sm text-gray-600">{user.email}</p>
// //                         </div>
// //                     </div>

// //                     <div className="mt-6 text-gray-700 space-y-3">
// //                         <p className="text-lg">
// //                             <strong>Phone:</strong> {user.phoneNumber}
// //                         </p>
                       
// //                     </div>
// //                 </div>
// //             )}
// //             <p>
// //                 { user?.fullName}
// //             </p>
            
// //                 <button
// //                     onClick={() => setUserId("")}
// //                     className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all"
// //                 >
// //                     Clear Search
// //                 </button>
            
// //         </div>
// //     );
// // };


// // export default UserSearch;

// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../Redux/store";
// import { getUserById } from "../Redux/Auth/RegisterSlice";

// const UserSearch = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const user = useSelector((state: RootState) => state.registerSlice.user);
//     const [userId, setUserId] = useState("");

//     useEffect(() => {
//         if (userId.trim()) {
//             dispatch(getUserById(userId));
//         }
//     }, [dispatch, userId]);

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10 flex flex-col items-center">
//             {/* Page Title */}
//             <div className="text-center mb-6">
//                 <h1 className="text-4xl font-bold text-gray-800">🔍 Search User</h1>
//                 <p className="text-gray-500 mt-2">Enter a User ID to fetch user details</p>
//             </div>

//             {/* Search Input */}
//             <div className="flex flex-col sm:flex-row gap-4 items-center bg-white shadow-md rounded-lg p-4">
//                 <input
//                     type="text"
//                     placeholder="Enter User ID..."
//                     value={userId}
//                     onChange={(e) => setUserId(e.target.value)}
//                     className="border border-gray-300 rounded-lg p-2 w-64 sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
//                 />
//                 <button
//                     onClick={() => setUserId("")}
//                     className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all"
//                 >
//                     Clear Search
//                 </button>
//             </div>

//             {/* User Details Card */}
//             {user && (
//                 <div className="mt-10 w-full max-w-md bg-white shadow-lg rounded-xl p-6 border border-gray-300 hover:shadow-2xl transition-all duration-300">
//                     <div className="flex items-center space-x-4">
//                         {/* Profile Avatar */}
//                         <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white flex items-center justify-center text-3xl font-bold shadow-md">
//                             {user?.fullName?.charAt(0) || "?"}
//                         </div>

//                         {/* User Info */}
//                         <div>
//                             <h1 className="text-xl font-semibold text-gray-900">{user.fullName}</h1>
//                             <p className="text-sm text-gray-600">{user.email}</p>
//                         </div>
//                     </div>

//                     {/* User Additional Info */}
//                     <div className="mt-4 text-gray-700">
//                         <p className="text-sm">
//                             <strong>📞 Phone:</strong> {user.phoneNumber}
//                         </p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default UserSearch;
// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../Redux/store";
// import { getUserById, clearUser } from "../Redux/Auth/RegisterSlice"; 

// const UserSearch = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const user = useSelector((state: RootState) => state.registerSlice.user);
//     const [userId, setUserId] = useState("");

//     useEffect(() => {
//         if (userId.trim()) {
//             dispatch(getUserById(userId));
//         }
//     }, [dispatch, userId]);

//     // Handle user deletion
//     const handleDeleteUser = () => {
//         dispatch(clearUser()); // Clear user from Redux store
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10 flex flex-col items-center">
//             {/* Page Title */}
//             <div className="text-center mb-6">
//                 <h1 className="text-4xl font-bold text-gray-800">🔍 Search User</h1>
//                 <p className="text-gray-500 mt-2">Enter a User ID to fetch user details</p>
//             </div>

//             {/* Search Input */}
//             <div className="flex flex-col sm:flex-row gap-4 items-center bg-white shadow-md rounded-lg p-4">
//                 <input
//                     type="text"
//                     placeholder="Enter User ID..."
//                     value={userId}
//                     onChange={(e) => setUserId(e.target.value)}
//                     className="border border-gray-300 rounded-lg p-2 w-64 sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
//                 />
//                 <button
//                     onClick={() => setUserId("")}
//                     className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all"
//                 >
//                     Clear Search
//                 </button>
//             </div>

//             {/* User Details Card */}
//             {user && (
//                 <div className="mt-10 w-full max-w-md bg-white shadow-lg rounded-xl p-6 border border-gray-300 hover:shadow-2xl transition-all duration-300">
//                     <div className="flex items-center space-x-4">
//                         {/* Profile Avatar */}
//                         <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white flex items-center justify-center text-3xl font-bold shadow-md">
//                             {user?.fullName?.charAt(0) || "?"}
//                         </div>

//                         {/* User Info */}
//                         <div>
//                             <h1 className="text-xl font-semibold text-gray-900">{user.fullName}</h1>
//                             <p className="text-sm text-gray-600">{user.email}</p>
//                         </div>
//                     </div>

//                     {/* User Additional Info */}
//                     <div className="mt-4 text-gray-700">
//                         <p className="text-sm">
//                             <strong>📞 Phone:</strong> {user.phoneNumber}
//                         </p>
//                     </div>

//                     {/* Delete Button */}
//                     <button
//                         onClick={handleDeleteUser}
//                         className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition-all w-full"
//                     >
//                         ❌ Delete User
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default UserSearch;


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
        // Clear user from Redux store
        
                };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-200 flex flex-col items-center justify-center px-4 py-10">
            {/* Page Title */}
            <div className="text-center mb-8">
                <h1 className="text-5xl font-extrabold text-gray-800 drop-shadow-md">🔍 Search User</h1>
                <p className="text-gray-500 mt-2 text-lg">Enter a User ID to fetch user details</p>
            </div>

            {/* Search Input */}
            <div className="flex flex-col sm:flex-row gap-4 items-center bg-white bg-opacity-80 backdrop-blur-md shadow-lg rounded-lg p-4 transition-transform duration-300 hover:scale-105">
                <input
                    type="text"
                    placeholder="Enter User ID..."
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-72 sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 shadow-md"
                />
                <button
                    onClick={() => setUserId("")}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
                >
                    ✨ Clear Search
                </button>
            </div>

            {/* User Details Card */}
            {user && (
                <div className="mt-12 w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-xl p-6 border border-gray-300 transform transition-all duration-500 hover:scale-105">
                    <div className="flex items-center space-x-4">
                        {/* Profile Avatar */}
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center text-4xl font-bold shadow-lg">
                            {user?.fullName?.charAt(0) || "?"}
                        </div>

                        {/* User Info */}
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">{user.fullName}</h1>
                            <p className="text-md text-gray-600">{user.email}</p>
                        </div>
                    </div>

                    {/* User Additional Info */}
                    <div className="mt-4 text-gray-700 space-y-2">
                        <p className="text-md">
                            <strong>📞 Phone:</strong> {user.phoneNumber}
                        </p>
                    </div>

                    {/* Delete Button */}
                    <button
    onClick={handleDeleteUser}
    className="mt-6 relative group overflow-hidden w-full px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-red-500 to-red-700 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:from-red-600 hover:to-red-800"
>
    ❌ Delete User
    {/* Ripple Effect */}
    <span className="absolute inset-0 w-full h-full bg-white opacity-10 transform scale-0 transition-transform duration-500 ease-out group-hover:scale-100"></span>
</button>
                </div>
            )}
        </div>
    );
};

export default UserSearch;
