import axios from 'axios';
import URLS from '../constants/urls.js';
import lscache from 'lscache';
import { getAccessToken, managedOrganization } from './session.js';

const axiosInstance = axios.create({
  baseURL: URLS.API_URL,
});

axiosInstance.interceptors.request.use(config => {
  if (getAccessToken()) {
    config.headers.Authorization = getAccessToken();
    config.headers['managed_organization_id'] = managedOrganization();
  }
  return config;
});

export default axiosInstance;
