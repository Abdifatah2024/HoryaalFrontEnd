// // src/components/ClassList.tsx
// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from '../Redux/store';
// import { setClasses  } from '../Redux/Auth/classSlice';
// import axios from 'axios';
// import { Class } from '@/Redux/Auth/classSlice';

// const ClassList: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const classes = useSelector((state: RootState) => state.classSlice.classes);

//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const response = await axios.get<Class[]>('http://localhost:4000/student/classtList');
//         dispatch(setClasses(response.data));
//       } catch (error) {
//         console.error('Failed to fetch classes:', error);
//       }
//     };

//     fetchClasses();
//   }, [dispatch]);

//   return (
//     <div className="min-h-screen p-8 bg-gray-100 text-gray-900">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-semibold mb-6">Class List</h1>

//         <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
//           <table className="w-full">
//             <thead className="bg-gradient-to-b from-violet-900 to-indigo-900 text-slate-100">
//               <tr>
//                 <th className="p-4 text-left">Class ID</th>
//                 <th className="p-4 text-left">Class Name</th>
//                 <th className="p-4 text-left">User Full Name</th>
//               </tr>
//             </thead>
//             <tbody>
//               {classes.map(cls => (
//                 <tr key={cls.id} className="border-b hover:bg-gray-200 transition-all">
//                   <td className="p-4">{cls.id}</td>
//                   <td className="p-4">{cls.name}</td>
//                   <td className="p-4">{cls.user.fullName}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {classes.length === 0 && (
//           <p className="text-center text-gray-500 mt-4">No classes found</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ClassList;
