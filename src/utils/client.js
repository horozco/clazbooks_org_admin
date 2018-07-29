import axios from 'axios';
import URLS from '../constants/urls.js';
import lscache from 'lscache';
import { getAccessToken } from './session.js';

const axiosInstance = axios.create({
  baseURL: URLS.API_URL,
});

axiosInstance.interceptors.request.use(config => {
  if (getAccessToken()) {
    config.headers.Authorization = getAccessToken();
  }
  return config;
});

export default axiosInstance;
