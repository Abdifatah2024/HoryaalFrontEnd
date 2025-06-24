// // src/Redux/Config/menuSlice.ts

// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export type MenuItem = {
//   id: string;
//   title: string;
//   path?: string;
//   iconName: string;
//   subItems?: MenuItem[];
// };

// type Role = "ADMIN" | "Teacher" | "USER";

// type MenuState = {
//   [key in Role]: MenuItem[];
// };

// // Load from localStorage if available
// const loadFromLocalStorage = (): MenuState => {
//   try {
//     const data = localStorage.getItem("roleMenus");
//     return data ? JSON.parse(data) : defaultMenus;
//   } catch {
//     return defaultMenus;
//   }
// };

// // Save to localStorage whenever menus change
// const saveToLocalStorage = (state: MenuState) => {
//   try {
//     localStorage.setItem("roleMenus", JSON.stringify(state));
//   } catch (err) {
//     console.error("Failed to save menu to localStorage:", err);
//   }
// };

// // Default static menu (initial fallback)
// const defaultMenus: MenuState = {
//   ADMIN: [
//     {
//       id: "dashboard",
//       title: "Dashboard",
//       path: "/dashboard",
//       iconName: "AiOutlineDashboard",
//     },
//     {
//       id: "user-management",
//       title: "User Management",
//       iconName: "AiOutlineUser",
//       subItems: [
//         {
//           id: "user-list",
//           title: "User List",
//           path: "/dashboard/user/list",
//           iconName: "AiOutlineUser",
//         },
//         {
//           id: "register-user",
//           title: "Create User",
//           path: "/dashboard/register",
//           iconName: "AiOutlineUserAdd",
//         },
//       ],
//     },
//   ],
//   Teacher: [], // You can populate these dynamically later
//   USER: [], // You can populate these dynamically later
// };

// const menuSlice = createSlice({
//   name: "menu",
//   initialState: loadFromLocalStorage(),
//   reducers: {
//     setMenu: (
//       state,
//       action: PayloadAction<{ role: Role; menu: MenuItem[] }>
//     ) => {
//       state[action.payload.role] = action.payload.menu;
//       saveToLocalStorage(state);
//     },
//     resetMenu: (state, action: PayloadAction<Role>) => {
//       state[action.payload] = [];
//       saveToLocalStorage(state);
//     },
//   },
// });

// export const { setMenu, resetMenu } = menuSlice.actions;
// export default menuSlice.reducer;
