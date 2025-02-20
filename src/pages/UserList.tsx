// // import { useEffect } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { AppDispatch, RootState } from "../Redux/store";
// // import { listUser } from "../Redux/Auth/RegisterSlice";

// // const RegisterList = () => {
// //     const dispatch = useDispatch<AppDispatch>();
// //     const listusers = useSelector((state: RootState) => state.registerSlice);

// //     useEffect(() => {
// //         dispatch(listUser());
// //     }, [dispatch]);

// //     if (listusers.loading)
// //         return <h1 className="text-center text-lg font-semibold text-gray-600 mt-10 animate-pulse">Loading...</h1>;

// //     if (listusers.error)
// //         return <p className="text-red-500 text-center mt-5">{listusers.error}</p>;

// //     return (
// //         <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10">
// //             <div className="text-center mb-8">
// //                 <h1 className="text-4xl font-extrabold text-gray-800">User Profiles</h1>
// //                 <p className="text-gray-500 mt-2">Manage registered users efficiently</p>
// //             </div>

// //             <div className="grid gap-6 w-[90%] md:w-[70%] lg:w-[50%] mx-auto">
// //                 {listusers?.users?.length === 0 && (
// //                     <h1 className="text-center text-lg text-gray-500">No users registered yet.</h1>
// //                 )}

// //                 {listusers?.users?.map((user) => (
// //                     <div
// //                         key={user.id}
// //                         className="relative bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 transform hover:scale-[1.01]"
// //                     >
// //                         {/* Profile Image Placeholder */}
// //                         <div className="flex items-center space-x-4">
// //                             <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white flex items-center justify-center text-2xl font-bold shadow-md">
// //                                 {user.fullName.charAt(0)}
// //                             </div>
// //                             <div>
// //                                 <h1 className="text-xl font-semibold text-gray-900">{user.fullName}</h1>
// //                                 <p className="text-sm text-gray-600">{user.email}</p>
// //                             </div>
// //                         </div>

// //                         {/* Details Section */}
// //                         <div className="mt-4 text-gray-700">
// //                             <p className="text-sm">
// //                                 <strong>Phone:</strong> {user.phoneNumber}
// //                             </p>
// //                         </div>

// //                         {/* Buttons */}
// //                         <div className="absolute top-4 right-4 flex space-x-2">
// //                             <button className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full shadow-md hover:bg-blue-600 transition-all">
// //                                 Edit
// //                             </button>
// //                             <button className="bg-red-500 text-white text-sm px-4 py-2 rounded-full shadow-md hover:bg-red-600 transition-all">
// //                                 Delete
// //                             </button>
// //                         </div>
// //                     </div>
// //                 ))}
// //             </div>
// //         </div>
// //     );
// // };

// // export default RegisterList;

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../Redux/store";
// import { listUser, getUserById, deleteUser } from "../Redux/Auth/RegisterSlice"; // ✅ Import required actions
// import toast from "react-hot-toast";

// const RegisterList = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const listusers = useSelector((state: RootState) => state.registerSlice);

//     useEffect(() => {
//         dispatch(listUser()); // ✅ Fetch users on component mount
//     }, [dispatch]);

//     if (listusers.loading)
//         return <h1 className="text-center text-lg font-semibold text-gray-600 mt-10 animate-pulse">Loading...</h1>;

//     if (listusers.error)
//         return <p className="text-red-500 text-center mt-5">{listusers.error}</p>;

//     // ✅ Handle Edit User
//     const handleEdit = (userId: string) => {
//         dispatch(getUserById(userId)); // ✅ Fetch user details for editing
//         toast.success("User details loaded for editing!");
//     };

//     // ✅ Handle Delete User
//     const handleDelete = (userId: string) => {
//         if (window.confirm("Are you sure you want to delete this user?")) {
//             dispatch(deleteUser(userId)).then((action) => {
//                 if (deleteUser.fulfilled.match(action)) {
//                     toast.success("User deleted successfully!");
//                     dispatch(listUser()); // ✅ Refresh user list after deletion
//                 }
//             });
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10">
//             <div className="text-center mb-8">
//                 <h1 className="text-4xl font-extrabold text-gray-800">User Profiles</h1>
//                 <p className="text-gray-500 mt-2">Manage registered users efficiently</p>
//             </div>

//             <div className="grid gap-6 w-[90%] md:w-[70%] lg:w-[50%] mx-auto">
//                 {listusers?.users?.length === 0 && (
//                     <h1 className="text-center text-lg text-gray-500">No users registered yet.</h1>
//                 )}

//                 {listusers?.users?.map((user) => (
//                     <div
//                         key={user.id}
//                         className="relative bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 transform hover:scale-[1.01]"
//                     >
//                         {/* Profile Image Placeholder */}
//                         <div className="flex items-center space-x-4">
//                             <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white flex items-center justify-center text-2xl font-bold shadow-md">
//                                 {user.fullName.charAt(0)}
//                             </div>
//                             <div>
//                                 <h1 className="text-xl font-semibold text-gray-900">{user.fullName}</h1>
//                                 <p className="text-sm text-gray-600">{user.email}</p>
//                             </div>
//                         </div>

//                         {/* Details Section */}
//                         <div className="mt-4 text-gray-700">
//                             <p className="text-sm">
//                                 <strong>Phone:</strong> {user.phoneNumber}
//                             </p>
//                         </div>

//                         {/* Buttons */}
//                         <div className="absolute top-4 right-4 flex space-x-2">
//                             <button
//                                 onClick={() => handleEdit(user.id)}
//                                 className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full shadow-md hover:bg-blue-600 transition-all"
//                             >
//                                 Edit
//                             </button>
//                             <button
//                                 onClick={() => handleDelete(user.id)}
//                                 className="bg-red-500 text-white text-sm px-4 py-2 rounded-full shadow-md hover:bg-red-600 transition-all"
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default RegisterList;
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
import { listUser, getUserById, deleteUser } from "../Redux/Auth/RegisterSlice"; // ✅ Import required actions
import toast from "react-hot-toast";

const RegisterList = ({ setEditing}) => { // ✅ Accept setEditing from Register.tsx
    const dispatch = useDispatch<AppDispatch>();
    const listusers = useSelector((state: RootState) => state.registerSlice);

    useEffect(() => {
        dispatch(listUser()); // ✅ Fetch users on component mount
    }, [dispatch]);

    if (listusers.loading)
        return <h1 className="text-center text-lg font-semibold text-gray-600 mt-10 animate-pulse">Loading...</h1>;

    if (listusers.error)
        return <p className="text-red-500 text-center mt-5">{listusers.error}</p>;

    // ✅ Handle Edit User
    const handleEdit = (userId: string) => {
        dispatch(getUserById(userId)).then((action) => {
            if (getUserById.fulfilled.match(action)) {
                toast.success("User details loaded for editing!");
                setEditing(true); // ✅ Set editing mode
            }
        });
    };

    // ✅ Handle Delete User
    const handleDelete = (userId: string) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            dispatch(deleteUser(userId)).then((action) => {
                if (deleteUser.fulfilled.match(action)) {
                    toast.success("User deleted successfully!");
                    dispatch(listUser()); // ✅ Refresh user list after deletion
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-800">User Profiles</h1>
                <p className="text-gray-500 mt-2">Manage registered users efficiently</p>
            </div>

            <div className="grid gap-6 w-[90%] md:w-[70%] lg:w-[50%] mx-auto">
                {listusers?.users?.length === 0 && (
                    <h1 className="text-center text-lg text-gray-500">No users registered yet.</h1>
                )}

                {listusers?.users?.map((user) => (
                    <div
                        key={user.id}
                        className="relative bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 transform hover:scale-[1.01]"
                    >
                        {/* Profile Image Placeholder */}
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                                {user.fullName.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">{user.fullName}</h1>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="mt-4 text-gray-700">
                            <p className="text-sm">
                                <strong>Phone:</strong> {user.phoneNumber}
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="absolute top-4 right-4 flex space-x-2">
                            <button
                                onClick={() => handleEdit(user.id)}
                                className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full shadow-md hover:bg-blue-600 transition-all"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(user.id)}
                                className="bg-red-500 text-white text-sm px-4 py-2 rounded-full shadow-md hover:bg-red-600 transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RegisterList;
