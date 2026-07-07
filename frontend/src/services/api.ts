import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";


const api = axios.create({
  baseURL: API_BASE_URL,

  timeout: 30000,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


api.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig,
  ) => {
    const token =
      localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error: AxiosError) => {
    return Promise.reject(error);
  },
);


api.interceptors.response.use(
  (response) => response,

  (error: AxiosError) => {
    if (!error.response) {
      console.error(
        "Network error: backend unavailable.",
      );

      return Promise.reject(
        new Error(
          "Unable to connect to the StockSense AI backend.",
        ),
      );
    }


    if (error.response.status === 401) {
      localStorage.removeItem(
        "access_token",
      );

      console.warn(
        "Authentication session expired.",
      );
    }


    if (error.response.status >= 500) {
      console.error(
        "StockSense AI backend error:",
        error.response.data,
      );
    }


    return Promise.reject(error);
  },
);


export default api;