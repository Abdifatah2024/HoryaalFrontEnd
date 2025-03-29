import { createBrowserRouter } from 'react-router-dom'
import MainRouter from './pages/main'
import Home from './pages/Home'
import NotFoundPage from './pages/NotFound'
import Login from './pages/Auth/Login'
import Logout from './Components/logout'
import Register from './pages/Register'
import UsersList from './pages/UserList'
import UserSearch from './pages/userprofile'
import SidebarLayout from './pages/sidebar' //
import StudentForm from './pages/Auth/StdReg'
import StudentList from './Redux/Auth/StudentList'
import ClassList from './Redux/Auth/ClassList'
import { Sidebar } from 'lucide-react'

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainRouter/>,
        children: [
            {
                index: true,
                element: <Home/>
            },
            {
                path: "auth",
                children: [
                    {
                        path: "login",
                        element: <Login/>
                    }
                ]
            },
            {
                path: "logout",
                element: <Logout/>
            },
            {
                path: "/register",
                element: <Register/>
            },
            {
                // Sidebar layout wrapper for all dashboard routes
                path: "dashboard",
                element: <SidebarLayout/>,
                children: [
                    {
                        path: "user/list",
                        element: <UsersList/>
                    },
                    {
                        path: "ClassList",
                        element: <ClassList/>
                    },
                    {
                        path: "userinfo",
                        element: <UserSearch/>
                    },
                    {
                        path: "regstd",
                        element: <StudentForm />
                    },
                    {
                        path: "ListStd",
                        element: <StudentList />
                    }
                ]
            },
            {
                path: "*",
                element: <NotFoundPage/>
            }
        ]
    }
])

