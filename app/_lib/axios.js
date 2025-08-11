import axios from "axios";

const api = axios.create({
  baseURL: "/",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청/응답 인터셉터 예시 (필요 시 확장)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;


