import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const BASE_URL = `${API_BASE}/expenses`;
// various services and api endpoints to interact with JSON server db which are redux compatible and return the promise alone handled in component
const getExpenses = async (queryString = "") => {
  const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
  const res = await axios.get(url);

  return {
    data: res.data,
    totalCount: parseInt(res.headers["x-total-count"]) || 0,
  };
};

const createExpense = async (expenseData) => {
  const res = await axios.post(BASE_URL, expenseData);
  return res.data;
};

const editExpense = async (expenseData) => {
  const res = await axios.put(`${BASE_URL}/${expenseData.id}`, expenseData);
  return res.data;
};

const removeExpense = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
  return id;
};

const expenseServices = {
  getExpenses,
  createExpense,
  editExpense,
  removeExpense,
};

export default expenseServices;