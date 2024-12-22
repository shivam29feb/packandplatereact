import axios from 'axios';

const API_BASE_URL = 'http://localhost/api'; // Update with your actual API base URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getExampleData = async () => {
  try {
    const response = await api.get('/example-endpoint');
    return response.data;
  } catch (error) {
    console.error('Error fetching example data:', error);
    throw error;
  }
};

// Add more API methods as needed
