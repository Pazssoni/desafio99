/**
 * @file Centralized Axios instance configuration.
 * This instance is pre-configured to communicate with the backend via localhost.
 */
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3333',
  withCredentials: true,
});

export { axiosInstance };