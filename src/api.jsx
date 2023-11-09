// api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api', // Adjust the backend API URL accordingly
});

export default API;
