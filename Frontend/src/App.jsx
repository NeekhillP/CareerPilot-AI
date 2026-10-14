import {RouterProvider} from 'react-router'
import {router} from './app.routes.jsx'
import {AuthProvider} from './features/Auth/auth.context.jsx'

function App() {

  return (
    <>
    <AuthProvider>
       <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
     
    </>
  )
}

export default App
