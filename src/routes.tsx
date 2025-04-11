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
import ClassList from './pages/ClassList'
import { Sidebar } from 'lucide-react'
import StudentSearch from './pages/GetOneStudent'
import ChangePassword from './pages/ChangePassword'
import PhotoUpload from './pages/PhotoUpload'
import CreateClassForm from './pages/CreateClassForm'
import StudentDetail from './pages/Auth/StudentDetail'
import AttendanceForm from './pages/Auth/Attedence'

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
                        path: "register",
                        element: <Register/>
                    },
                    {
                        path: "Attedence",
                        element: <AttendanceForm/>
                    },
                    {
                        path: "logout",
                        element: <Logout/>
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
                    },
                    {
                        path: "ChangePassword",
                        element: <ChangePassword />
                    },
                    {
                        path: "upload/photo",
                        element: <PhotoUpload />
                    },
                    {
                        path: "CeateClass",
                        element: <CreateClassForm/>
                    },
                    {
                        path:"GetOneStudent",
                        element:<StudentDetail/>
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

