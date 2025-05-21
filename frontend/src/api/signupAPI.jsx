
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export const signupUser = async (signupData) => {
    try {
        const res = await axios.post(`${API_URL}/signup`, signupData);
        const token = res.data.token;

        // Store the token in sessionStorage
        sessionStorage.setItem('jwt_token', token);
        console.log('Token in sessionStorage:', sessionStorage.getItem('jwt_token'));

        return res.data;
    } catch (err) {
        console.error('Error signing up:', err);
        throw err;
    }
};
