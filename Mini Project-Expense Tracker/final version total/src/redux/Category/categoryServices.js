import axios from "axios";
// various services and api endpoints to interact with JSON server db which are redux compatible and return the promise alone handled in component
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const BASE_URL = `${API_BASE}/categories`;
const getCategories = async (queryString) => {
  const res = await axios.get(`${BASE_URL}?${queryString}`);
  return res.data;
};

const createCategory = async (categoryData) => {
  const res = await axios.post(BASE_URL, categoryData);
  return res.data;
};

const editCategory = async (categoryData) => {
  const res = await axios.put(`${BASE_URL}/${categoryData.id}`, categoryData);
  return res.data;
};

const removeCategory = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
  return id;
};

const categoryServices = {
  getCategories,
  createCategory,
  editCategory,
  removeCategory,
};

export default categoryServices;
