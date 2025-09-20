import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: 'http://localhost:3333',
  withCredentials: true, 
});

export { axiosInstance };