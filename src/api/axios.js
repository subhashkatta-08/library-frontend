import axios from "axios";

let showLoader;
let hideLoader;

export const setLoaderHandlers = (show, hide) => {
  showLoader = show;
  hideLoader = hide;
};

const api = axios.create({
  baseURL: "https://library-backend-sim0.onrender.com/library-api"
});

api.interceptors.request.use(
  config => {
    if (!config.skipLoader && showLoader) showLoader();

    let token;
    if (config.url.startsWith("/user")) {
      token = localStorage.getItem("userToken");
    } else if (config.url.startsWith("/admin")) {
      token = localStorage.getItem("adminToken");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    if (hideLoader) hideLoader();
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    if (hideLoader) hideLoader();
    return response;
  },
  error => {
    if (hideLoader) hideLoader();
    if (error.response && error.response.status === 403) {
      console.warn("Access forbidden! Token may be invalid or expired.");
    }

    return Promise.reject(error);
  }
);

export default api;
