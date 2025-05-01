import axios from "axios";

const API_URL = "http://localhost:4000/user";

export const sendResetCodeAPI = (emailOrPhone: string) => {
  return axios.post(`${API_URL}/send-reset-code`, { emailOrPhone });
};

export const resetPasswordAPI = (token: string, newPassword: string) => {
  return axios.post(`${API_URL}/verify-reset-code`, { token, newPassword });
};
