import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // to send HTTP-only cookies (important for auth)
});

export default client;
