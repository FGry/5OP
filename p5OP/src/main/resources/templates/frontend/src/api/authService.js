import api from '../api/axios';

export const registerUser = async(userData) => {
    try{
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch(error){
        throw error.response ? error.response.data : error;
    }
}