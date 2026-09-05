import axios from 'axios';

const baseURL = import.meta.env.PROD 
  ? 'https://amdox-backend-1.onrender.com' 
  : 'http://localhost:5000';

const API = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
