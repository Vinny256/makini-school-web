import axios from 'axios';

// Automatically detects if the site is live on Render or on localhost
const isProduction = import.meta.env.PROD; 

const API = axios.create({
  // Replace the first URL with your actual Render Backend URL once it's live
  baseURL: isProduction 
    ? 'https://makini-backend-1.onrender.com/api' 
    : 'http://localhost:5000/api'
});

export default API; // This allows you to import it as "API" elsewhere