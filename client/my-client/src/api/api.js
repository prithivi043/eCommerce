// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust based on your backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
