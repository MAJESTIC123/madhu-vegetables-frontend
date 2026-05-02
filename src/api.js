import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchProducts = async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};

export const placeOrder = async (orderData) => {
  const response = await axios.post(`${API_URL}/orders`, orderData);
  return response.data;
};