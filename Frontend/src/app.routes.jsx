import {createBrowserRouter} from "react-router";
import Login from "./features/Auth/Pages/Login";
import Register from "./features/Auth/Pages/Register";
import Protected from "./features/Auth/Components/Protected";
import Home from "./features/Interview/pages/Home";
import Interview from "./features/Interview/pages/Interview";

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
        element: <Protected><Home /></Protected>
    },
    {
        path: '/interview/:interviewId',
        element: <Protected><Interview /></Protected>
    }
])


