import axios from 'axios';

const API_URL = 'http://localhost/src/config/member/signup_api.php';

export const signup = async (username: string, password: string) => {
  try {
    const response = await axios.post(API_URL, { username, password });
    return response.data;
  } catch (error) {
    throw new Error('Error signing up');
  }
};
