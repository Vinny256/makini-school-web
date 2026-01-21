import axios from 'axios';

// We are forcing the Render URL here to break the 'localhost' loop
const API = axios.create({
  baseURL: 'https://makini-backend-1.onrender.com/api'
});

export default API;