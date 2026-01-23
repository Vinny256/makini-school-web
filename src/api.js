import axios from 'axios';

// We are forcing the Render URL here to break the 'localhost' loop
// To test locally, comment out the Render line and uncomment the localhost line below.
const API = axios.create({
  //baseURL: 'https://makini-backend-crgy.onrender.com/api'
   baseURL: 'http://localhost:5000/api' 
});

// --- VINNIE TECH PUBLIC AI SERVICE (Added) ---
// This function handles the guest chat bubble without needing a token
export const askPublicAI = async (question, history) => {
  try {
    const response = await API.post('/public/ask-ai', { 
      question, 
      history 
    });
    return response.data;
  } catch (error) {
    console.error("AI API Error:", error);
    throw error;
  }
};

export default API;