// import axios from "axios";
// import { store } from "../Redux/store";
// import { logout } from "../Redux/Auth/LoginSlice";

// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;
//     console.log("Axios intercepted error:", status);

//     if (status === 401) {
//       store.dispatch(logout());

//       // Force a full redirect to login
//       window.location.href = `${window.location.origin}/auth/login`;
//     }

//     return Promise.reject(error);
//   }
// );

import axios from "axios";
import { store } from "../Redux/store";
import { logout } from "../Redux/Auth/LoginSlice";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const res = await axios.post(
          "http://localhost:4000/user/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;

        // Save it in localStorage
        localStorage.setItem("Access_token", newAccessToken);

        // Set to Axios default header
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        store.dispatch(logout());
        window.location.href = "/auth/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
