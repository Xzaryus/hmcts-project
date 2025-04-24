import axios from "axios";
import { getToken } from "./loginAPI";

const API_URL = import.meta.env.VITE_API_URL;


const getAuthHeader = () => {
    const token = getToken();

    if (!token) {
        throw new Error('No valid token found');
    }

    return { headers: { Authorization: `Bearer ${token}` } };
};

export const refreshTasks = async () => {
    try {
        const res = await axios.get(`${API_URL}/tasks`, getAuthHeader());
        return res.data.tasks; // returns array of tasks
    } catch (err) {
        console.error('Refresh failed:', err);
        throw err;
    }
};


// * Create a new task
export const createTask = async (taskData) => {
    try {
        const res = await axios.post(`${API_URL}/tasks`, taskData, getAuthHeader());
        return res.data; // returns { id: number }
    } catch (err) {
        console.error('Error creating task:', err);
        throw err;
    }
};

// * Get all tasks, optionally filter by completion
export const getTasks = async (showCompleted) => {
    try {
        const query = typeof showCompleted === 'boolean' ? `?showCompleted=${showCompleted}` : '';
        const res = await axios.get(`${API_URL}/tasks${query}`, getAuthHeader());
        return res.data.tasks; // returns array of tasks
    } catch (err) {
        console.error('Error fetching tasks:', err);
        throw err;
    }
};

// * Update a task by ID
export const updateTask = async (id, updatedTask) => {
    try {
        const res = await axios.put(`${API_URL}/tasks/${id}`, updatedTask, getAuthHeader());
        return res.data; // { status, message, success }
    } catch (err) {
        console.error('Error updating task:', err);
        throw err;
    }
};

// *Delete a task by ID
export const deleteTask = async (id) => {
    try {
        const res = await axios.delete(`${API_URL}/tasks/${id}`, getAuthHeader());
        return res.data; // { status, message, success }
    } catch (err) {
        console.error('Error deleting task:', err);
        throw err;
    }
};