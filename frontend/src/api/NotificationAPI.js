// src/api/NotificationAPI.js
import axios from "axios";

const NotificationAPI = axios.create({
  baseURL: "http://localhost:9000/api/notifications", // Adjust based on your backend
  headers: {
    "Content-Type": "application/json",
  },
});

// If your Notification Service requires authentication, set up interceptors
NotificationAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Adjust based on your auth
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default NotificationAPI;
