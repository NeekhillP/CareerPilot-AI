import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api/auth',
    withCredentials: true
})

export async function registerUser({username, email, password}){
    try{
        const response = await api.post('/register', {
            username,
            email,
            password
        })
        return response.data;
    } catch(error){
        console.error('Error registering user:', error);
        throw error;
    }
}


export async function loginUser({email, password}){
    try{
        const response = await api.post('/login', {
            email, password
        })

        return response.data;

    } catch(error){
        console.error('Error logging in user:', error);
        throw error;
    }
}

export async function logoutUser(){
    const response = await api.get('/logout', {timeout: 15000});
    return response.data;
}

export async function getCurrentUser(signal){
    const response = await api.get('/get-me', {signal});
    return response.data;
}
