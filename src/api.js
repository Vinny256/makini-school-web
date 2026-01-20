import axios from 'axios';

// Switch between local and live backend automatically
const isProduction = import.meta.env.PROD; 

const API = axios.create({
  baseURL: isProduction 
    ? 'https://makini-backend-1.onrender.com' // Replace with your REAL live backend URL
    : 'http://localhost:5000/api' 
});

export default API; // Export the single instance