import axios from "axios";

const api = axios.create({
  baseURL: "https://library-backend-km6k.onrender.com/library-api"
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("userToken") ;

  if (token) {
    
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
