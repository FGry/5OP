import api from '../api/axios';

export const registerUser = async(userData) => {
    try{
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch(error){
        throw error.response ? error.response.data : error;
    }
}

export const loginUser = async(credentials) => {
    try{
        const response = await api.post('/auth/login', credentials);
        if(response.data.token){
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch(error){
        throw error.response ? error.response.data : error;
    }
}

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}