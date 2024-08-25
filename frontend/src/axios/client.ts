import axios from "axios";

export const client = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export default client;
