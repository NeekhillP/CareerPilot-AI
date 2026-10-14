import {Navigate} from 'react-router'
import {useAuth} from '../Hooks/useAuth'

const Protected = ({children}) => {
    const {user, loading} = useAuth()

    if(loading){
        return <p role="status">Checking your session...</p>
    }

    if(!user){
        return <Navigate to="/login" replace />
    }

    return children
}

export default Protected
