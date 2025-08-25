import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:4444/',
});
export default API;