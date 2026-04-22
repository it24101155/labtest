import axios from 'axios';

const envApiUrl = import.meta.env.VITE_API_URL;
const baseURL = (envApiUrl && envApiUrl.trim()) || 'http://localhost:5000/api';

const API = axios.create({
baseURL: baseURL.replace(/\/$/, ''),
});

export const getItems = () => API.get('/items');
export const createItem = (data) => API.post('/items', data);
export const deleteItem = (id) => API.delete(`/items/${id}`);
export const updateItem = (id, data) => API.put(`/items/${id}`, data);