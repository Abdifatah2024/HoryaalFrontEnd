// src/api/refreshToken.ts
import axios from "axios";

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const res = await axios.post(
      "http://localhost:4000/user/auth/refresh",
      {},
      { withCredentials: true }
    );
    return res.data.accessToken;
  } catch (err) {
    console.error("Refresh failed:", err);
    return null;
  }
};
