import axios from 'axios';

// This checks for a custom variable first, then the build mode
const BASE_URL = import.meta.env.VITE_API_URL || 
                 (import.meta.env.PROD 
                    ? 'https://makini-backend-1.onrender.com/api' 
                    : 'http://localhost:5000/api');

const API = axios.create({
  baseURL: BASE_URL,
  // Added timeout so users see your countdown if the server is sleeping
  timeout: 10000 
});

export default API;