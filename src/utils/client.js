import axios from 'axios';
import URLS from '../constants/urls.js'
import lscache from 'lscache';
import { getAccessToken } from './session.js';


const axiosInstance = axios.create({
  baseURL: URLS.API_URL,
  headers: {
    'Authorization': lscache.get('AUTH_TOKEN_KEY')
  }
});

export default axiosInstance;
