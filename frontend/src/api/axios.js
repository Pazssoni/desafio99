/**
 * @file Centralized Axios instance configuration.
 * This instance is pre-configured to communicate with the backend via localhost.
 */
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export { axiosInstance };