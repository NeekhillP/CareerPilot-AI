import {RouterProvider} from 'react-router'
import {router} from './app.routes.jsx'

function App() {

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
