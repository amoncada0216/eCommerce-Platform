import axios from "axios";

const apiUrl = process.env["NEXT_PUBLIC_API_URL"];

if (!apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const API_BASE_URL: string = apiUrl;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn("Unauthorized - possibly expired session");
      }

      if (error.response.status >= 500) {
        console.error("Server error");
      }
    }

    return Promise.reject(error);
  },
);
