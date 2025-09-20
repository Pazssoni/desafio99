/**
 * @file Centralized Axios instance configuration.
 * This instance is pre-configured with the backend's base URL and to send credentials (cookies).
 */
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3333',
  withCredentials: true,
});

export { axiosInstance };