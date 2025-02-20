// // // import React, { useState } from 'react';

// // // const Header: React.FC = () => {
// // //   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

// // //   const toggleDropdown = () => {
// // //     setIsDropdownOpen(!isDropdownOpen);
// // //   };

// // //   return (
// // //     <header className="bg-blue-400 text-white shadow-md">
// // //       <div className="container mx-auto flex justify-between items-center p-4">
// // //         {/* Logo and School Name */}
// // //         <div className="flex items-center">
// // //           <img
// // //             src="/logo.png"
// // //             alt="School Logo"
// // //             className="h-10 w-10 mr-2"
// // //           />
// // //           <h1 className="text-xl font-bold">AL-IRSHAAD SECONDARY SCHOOL</h1>
// // //         </div>



// // //         {/* User Profile Dropdown */}
// // //         <div className="relative">
// // //           <button
// // //             onClick={toggleDropdown}
// // //             className="flex items-center focus:outline-none"
// // //           >
// // //             <img
// // //               src="/user-avatar.png"
// // //               alt="User Avatar"
// // //               className="h-8 w-8 rounded-full"
// // //             />
// // //             <span className="ml-2">John Doe</span>
// // //             <svg
// // //               className="w-4 h-4 ml-1"
// // //               fill="none"
// // //               stroke="currentColor"
// // //               viewBox="0 0 24 24"
// // //               xmlns="http://www.w3.org/2000/svg"
// // //             >
// // //               <path
// // //                 strokeLinecap="round"
// // //                 strokeLinejoin="round"
// // //                 strokeWidth="2"
// // //                 d="M19 9l-7 7-7-7"
// // //               />
// // //             </svg>
// // //           </button>

// // //         </div>
// // //       </div>
// // //     </header>
// // //   );
// // // };

// // // export default Header;

// // import { useDispatch, useSelector } from 'react-redux'
// // import { Link } from 'react-router-dom'


// // import { AppDispatch, RootState } from '../Redux/store'
// // import { logout } from '../Redux/Auth/LoginSlice'


// // const Header = () => {

// //     const loginState = useSelector((state: RootState) => state.loginSlice)
// //     const dispatch= useDispatch<AppDispatch>()
// // const logoutHandler=()=>{
// //   dispatch(logout())
 
// // }
// //     return (
// //         <div className='flex items-center justify-around p-3'>
// //             <div className="logo">
// //                 <Link to={'/'}>
// //                     <h1 className="text-xl">
// //                         AL-IRSHAAD SECONDARY SYSTEM
// //                     </h1>
// //                 </Link>

// //             </div>
          
// //             <div className="flex items-center gap-4">

// //                 {loginState.data.message ?  <div className='flex gap-2 items-center'> 
                    
// //                     <div className=' text-2xl gap-2'>
// //             <Link to={'/user/list'}>
// //                 <h1>UserList</h1>
// //                 </Link>
// //             </div>
// //             <p className='font-bold text-xl'>{loginState.data.user.fullname}</p>
// //                     <button onClick={logoutHandler} className='bg-red-500 text-white p-3 rounded-2xl cursor-pointer'> Logout </button>  </div> :
// //                    <div className="menus flex gap-4">
// //                     <Link className='bg-indigo-500 text-white p-3 rounded-md hover:bg-indigo-400 transition-all' to={'/auth/login'}>Login</Link>
// //                     <Link className='bg-indigo-500 text-white p-3 rounded-md hover:bg-indigo-400 transition-all' to={'/register'}>Register</Link>
// //                 </div>}

            
// //             </div>

// //         </div>
// //     )
// // }

// // export default Header

// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { AppDispatch, RootState } from '../Redux/store';
// import { logout } from '../Redux/Auth/LoginSlice';

// const Header = () => {
//     const loginState = useSelector((state: RootState) => state.loginSlice);
//     const dispatch = useDispatch<AppDispatch>();

//     const logoutHandler = () => {
//         dispatch(logout());
//     };

//     return (
//         <header className='bg-blue-300 text-white shadow-md'>
//             <div className='container mx-auto flex justify-between items-center p-4'>
//                 {/* Logo and School Name */}
//                 <Link to='/' className='flex items-center space-x-2'>
//                     <img src="/logo.png" alt="School Logo" className="h-10 w-10" />
//                     <h1 className="text-2xl font-bold">AL-IRSHAAD SECONDARY SCHOOL</h1>
//                 </Link>

//                 {/* User Profile and Navigation */}
//                 <div className='flex items-center space-x-4'>
//                     {loginState.data.message ? (
//                         <div className='flex items-center space-x-3'>
//                             <Link to='/user/list' className='text-lg font-semibold hover:underline'>
//                                 User List
//                             </Link>
//                             <p className='font-bold'>{loginState.data.user.fullname}</p>
//                             <button 
//                                 onClick={logoutHandler} 
//                                 className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all'
//                             >
//                                 Logout
//                             </button>
//                         </div>
//                     ) : (
//                         <div className="space-x-4">
//                             <Link className='bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-400 transition-all' to='/auth/login'>
//                                 Login
//                             </Link>
//                             <Link className='bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-400 transition-all' to='/register'>
//                                 Register
//                             </Link>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </header>
//     );
// };

// export default Header;


import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../Redux/store';
import { logout } from '../Redux/Auth/LoginSlice';
import { useState } from 'react';
import { Button } from '@mui/material';

const Header = () => {
    const loginState = useSelector((state: RootState) => state.loginSlice);
    const dispatch = useDispatch<AppDispatch>();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const logoutHandler = () => {
        dispatch(logout());
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const users = loginState.data.users || []; // Assuming that the logged-in user has access to a list of users.

    return (
        <header className='bg-blue-600 text-white shadow-md'>
            <div className='container mx-auto flex justify-between items-center p-4'>
                {/* Logo and School Name */}
                <Link to='/' className='flex items-center space-x-2'>
                    <img src="/logo.png" alt="School Logo" className="h-10 w-10" />
                    <h1 className="text-2xl font-bold">AL-IRSHAAD SECONDARY SCHOOL</h1>
                </Link>

                {/* User Profile and Navigation */}
                <div className='flex items-center space-x-4'>
                    {loginState.data.message ? (
                        <div className='flex items-center space-x-3'>
                            <div className='relative'>
                                <button
                                    onClick={toggleDropdown}
                                    className='bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-400 transition-all'
                                >
                                    User List
                                </button>
                                {isDropdownOpen && (
                                    <div className='absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10'>
                                        <ul className='py-2'>
                                            {users.length === 0 ? (
                                                <li className='px-4 py-2 text-gray-500'>No users found.</li>
                                            ) : (
                                                users.map((user) => (
                                                    <li key={user.id} className='px-4 py-2 hover:bg-gray-100'>
                                                        <Link to={`/user/${user.id}`} className='block'>
                                                            {user.fullname}
                                                        </Link>
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <p className='font-bold'>{loginState.data.user.fullname}</p>
                            <Button 
                            variant="contained" 
                            color="error" 
                            size="large" 
                            className='ml-2'
                                                    
                            onClick={logoutHandler} >Logout</Button>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link className='bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-400 transition-all' to='/auth/login'>
                                Login
                            </Link>
                            <Link className='bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-400 transition-all' to='/register'>
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;