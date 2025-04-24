import axios from 'axios';
import * as jwt_decode from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (loginData) => {
    try {
        const res = await axios.post(`${API_URL}/login`, loginData);
        const token = res.data.token;

        // Store the token in sessionStorage
        sessionStorage.setItem('jwt_token', token);

        return res.data; // return token or any other data you need
    } catch (err) {
        console.error('Error logging in:', err);
        throw err;
    }
};

export const logoutUser = () => {
    // Remove token from sessionStorage to log the user out
    sessionStorage.removeItem('jwt_token');
};

export const getToken = () => {
    const token = sessionStorage.getItem('jwt_token');

    if (!token) return null;

    try {
        const decodedToken = jwt_decode(token);

        const currentTime = Date.now() / 1000; // current time in seconds
        if (decodedToken.exp < currentTime) {
            // Token has expired
            sessionStorage.removeItem('jwt_token');
            return null;
        }

        return token;
    } catch (err) {
        console.error('Error decoding token:', err);
        sessionStorage.removeItem('jwt_token');
        return null;
    }
};
