import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "https://zanchi.duckdns.org/",
  withCredentials: true,

  headers: { 'Content-Type': 'application/json' },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

// 요청/응답 인터셉터
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    let token = localStorage.getItem('auth_token');
    if (token === 'undefined' || token === 'null' || token === '') token = null;
    if (token) {
      const hasPrefix = /^bearer\s/i.test(token) || /^jwt\s/i.test(token);
      config.headers.Authorization = hasPrefix ? token : `Bearer ${token}`;
    } else {
      if (config.headers && 'Authorization' in config.headers) {
        delete config.headers.Authorization;
      }
    }
  }
  return config;
});
api.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;


