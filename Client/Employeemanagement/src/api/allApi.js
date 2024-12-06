import axios from 'axios';

const Api = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
});

export const setAuthToken = (token) => {
  if (token) {
    Api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete Api.defaults.headers.common['Authorization'];
  }
};

export const refreshAuthToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token available');
    
    const response = await Api.post('token/refresh/', { refresh: refreshToken });
    const { access } = response.data;
    setAuthToken(access);
    localStorage.setItem('token', access);
  } catch (error) {
    console.error('Token refresh failed:', error);
    localStorage.clear();
    window.location.href = '/login'; 
  }
};

export default Api;
