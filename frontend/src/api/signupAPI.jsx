
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export const signupUser = async (signupData) => {
    try {
        const res = await axios.post(`${API_URL}/signup`, signupData);
        return res.data; // returns the token
    } catch (err) {
        console.error('Error signing up:', err);
        throw err;
    }
};
