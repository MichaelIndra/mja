import axios from 'axios';
import { getHeader, setError, setNotification } from './config';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL, // url = base url + request url
  timeout: 900000,
  // withCredentials: true // send cookies when cross-domain requests
});

// Request interceptors
service.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    // if (AuthModule.token) {
    // config.headers['X-Access-Token'] = AuthModule.token;
    // }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

// Response interceptors
service.interceptors.response.use(
  (response) => {
    setNotification(response);
    if (response.status !== 200) {
      if (response.status === 201) {
        return response.data;
      }
      return response;
    } else {
      return response.data;
    }

    // const res = response.data;
    // if (res.code !== 200) {

    //   return Promise.reject(new Error(res.message || 'Error'));
    // } else {
    //   return response.data;
    // }
  },
  (error) => {
    if (error.response.data.status || error.response.data.statusCode) {
      setError(error.response.data);
    } else if (error.response.status) {
      const errorData = {
        ...error.response,
        message: 'Failed import data',
      };
      setError(errorData);
    }
    return Promise.reject(error);
  },
);

export default service;
