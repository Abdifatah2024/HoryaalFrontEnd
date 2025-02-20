import { createBrowserRouter } from 'react-router-dom'
import MainRouter from './pages/main'
import Home from './pages/Home'
import NotFoundPage from './pages/NotFound'

import Login from './pages/Auth/Login'
import Logout from './Components/logout'
import Register from './pages/Register'
import UsersList from './pages/UserList'
import UserSearch from './pages/userprofile'





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
                element:<Logout/>

            },
            {
                path: "/register",
                element: <Register/>
            },
            {
                path:"/user/list",
                element: <UsersList/>

            },
            {
                path:"user/userinfo",
                element: <UserSearch/>
            },
            {
                path: "*",
                element: <NotFoundPage/>
            }
        ]
    }
])