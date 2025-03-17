import axios from "axios";

const API_URL = "http://localhost:5500/api/auth";

export const signup = async (email, password, confirmPassword) => {
  return await axios.post(`${API_URL}/signup`, { email, password, confirmPassword });
};

export const login = async (email, password) => {
  return await axios.post(`${API_URL}/login`, { email, password });
};
