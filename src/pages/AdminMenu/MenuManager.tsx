// import { useAppDispatch, useAppSelector } from "../../Redux/store";
// import { setMenu } from "./menuSlice";
// import { useState } from "react";
// import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
// import { MenuItem } from "./menuSlice";

// const predefinedMenus = [
//   {
//     title: "Dashboard",
//     path: "/dashboard",
//     iconName: "AiOutlineDashboard",
//   },
//   {
//     title: "Student List",
//     path: "/dashboard/ListStd",
//     iconName: "AiOutlineUser",
//   },
//   {
//     title: "Register Student",
//     path: "/dashboard/regstd",
//     iconName: "AiOutlineUserAdd",
//   },
//   {
//     title: "Paid Fees",
//     path: "/dashboard/PaidFee",
//     iconName: "AiOutlineFileText",
//   },
//   {
//     title: "Attendance Report",
//     path: "/dashboard/AttendanceReports",
//     iconName: "AiOutlineCalendar",
//   },
// ];

// const MenuManager = () => {
//   const dispatch = useAppDispatch();
//   const menus = useAppSelector((state) => state.menu);
//   const [selectedRole, setSelectedRole] = useState<"ADMIN" | "Teacher" | "USER">("Teacher");

//   const [selectedMenuIndex, setSelectedMenuIndex] = useState<number>(0);
//   const [parentId, setParentId] = useState<string | null>(null);
//   const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

//   const toggleDropdown = (id: string) => {
//     setOpenDropdowns((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const handleAdd = () => {
//     const option = predefinedMenus[selectedMenuIndex];

//     const newItem: MenuItem = {
//       id: crypto.randomUUID(),
//       title: option.title,
//       path: option.path,
//       iconName: option.iconName,
//     };

//     const updatedMenu = menus[selectedRole].map((item) => {
//       if (item.id === parentId) {
//         const updatedSubItems = item.subItems ? [...item.subItems, newItem] : [newItem];
//         return { ...item, subItems: updatedSubItems };
//       }
//       return item;
//     });

//     const finalMenu = parentId
//       ? updatedMenu
//       : [...menus[selectedRole], newItem];

//     dispatch(setMenu({ role: selectedRole, menu: finalMenu }));
//     alert(`Added "${option.title}" to ${selectedRole}`);
//     setParentId(null);
//   };

//   const renderMenu = (items: MenuItem[]) =>
//     items.map((item) => (
//       <li key={item.id} className="p-2 border rounded mb-2 bg-gray-50">
//         <div className="flex justify-between items-center">
//           <div>
//             <strong>{item.title}</strong> — <code>{item.path}</code>
//           </div>
//           {item.subItems && (
//             <button onClick={() => toggleDropdown(item.id)} className="ml-2">
//               {openDropdowns.includes(item.id) ? <AiOutlineUp /> : <AiOutlineDown />}
//             </button>
//           )}
//         </div>

//         {item.subItems && openDropdowns.includes(item.id) && (
//           <ul className="ml-4 mt-2 space-y-1 border-l border-gray-300 pl-2">
//             {item.subItems.map((sub) => (
//               <li key={sub.id}>
//                 {sub.title} — <code>{sub.path}</code>
//               </li>
//             ))}
//           </ul>
//         )}
//       </li>
//     ));

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">Manage Sidebar for {selectedRole}</h2>

//       <select
//         value={selectedRole}
//         onChange={(e) => setSelectedRole(e.target.value as any)}
//         className="mb-4 border p-2 rounded"
//       >
//         <option value="ADMIN">Admin</option>
//         <option value="Teacher">Teacher</option>
//         <option value="USER">User</option>
//       </select>

//       <div className="space-y-2 mb-4">
//         <label className="block font-medium">Select Menu:</label>
//         <select
//           value={selectedMenuIndex}
//           onChange={(e) => setSelectedMenuIndex(Number(e.target.value))}
//           className="border p-2 rounded w-full"
//         >
//           {predefinedMenus.map((menu, index) => (
//             <option key={menu.path} value={index}>
//               {menu.title} — {menu.path}
//             </option>
//           ))}
//         </select>

//         <label className="block font-medium mt-4">Add Under (optional):</label>
//         <select
//           value={parentId || ""}
//           onChange={(e) => setParentId(e.target.value || null)}
//           className="border p-2 rounded w-full"
//         >
//           <option value="">Top-Level Menu</option>
//           {menus[selectedRole].map((item) => (
//             <option key={item.id} value={item.id}>
//               {item.title}
//             </option>
//           ))}
//         </select>

//         <button
//           onClick={handleAdd}
//           className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Add Menu Item
//         </button>
//       </div>

//       <ul className="mt-6 space-y-2">{renderMenu(menus[selectedRole])}</ul>
//     </div>
//   );
// };

// export default MenuManager;
