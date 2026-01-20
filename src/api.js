import API from '../api';

// Switch between local and live backend easily
const isProduction = import.meta.env.PROD; 

const API = axios.create({
  baseURL: isProduction 
    ? 'https://your-backend-service-name.onrender.com/api' // Your LIVE Render URL
    : 'http://localhost:5000/api' // Your local URL
});

export default API;