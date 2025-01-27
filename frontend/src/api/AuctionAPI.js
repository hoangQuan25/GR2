import axios from "axios";

const AuctionAPI = axios.create({
  baseURL: "http://192.168.2.12:8090/api", // auction microservice
});

AuctionAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AuctionAPI;
