import { useContext } from 'react';
import {AuthContext} from '../authContext';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../Services/auth.api';

export const useAuth = () => {
    const context = useContext(AuthContext);

    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const userData = await loginUser({ email, password });
            setUser(userData.user);
            return userData;
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setLoading(false)
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const userData = await registerUser({ username, email, password });
            setUser(userData.user);
            return userData;
        } catch (error) {
            console.error('Registration failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logoutUser();
        setUser(null);
    };

    const handleGetCurrentUser = async () => {
        setLoading(true);
        try {
            const userData = await getCurrentUser();
            setUser(userData.user);
        } catch (error) {
            setUser(null);
            console.error('Failed to get current user:', error);
        } finally {
            setLoading(false);
        }
    };

    return { user, loading, handleLogin, handleRegister, handleLogout, handleGetCurrentUser };
};
