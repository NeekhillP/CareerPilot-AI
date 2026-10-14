import {createBrowserRouter} from "react-router";
import Login from "./features/Auth/Pages/Login";
import Register from "./features/Auth/Pages/Register";
import Protected from "./features/Auth/Components/Protected";


export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    }, 
    {
        path: '/',
        element: <Protected><div>Home</div></Protected>
    }
])


