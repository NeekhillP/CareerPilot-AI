import {createBrowserRouter} from "react-router";
import Login from "./features/Auth/Pages/Login";
import Register from "./features/Auth/Pages/Register";


export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    }
])


