import {createContext, useEffect, useState} from 'react';
import {getCurrentUser} from './Services/auth.api';




export const AuthContext = createContext({})



export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const controller = new AbortController();

        const restoreSession = async ()=>{
            try{
                const userData = await getCurrentUser(controller.signal);

                if(!controller.signal.aborted){
                    setUser(userData.user);
                }
            } catch {
                if(!controller.signal.aborted){
                    setUser(null);
                }
            } finally {
                if(!controller.signal.aborted){
                    setLoading(false);
                }
            }
        }

        restoreSession();

        return ()=>controller.abort();
    }, []);



    return (
        <AuthContext.Provider value={{user, setUser, loading, setLoading}}>
            {children}
        </AuthContext.Provider>
    )

}
