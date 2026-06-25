import { useState } from 'react';
import api from '../api/axiosInstance';
import { API_ENDPOINTS } from '../api/endpoints';
import { successToast, errorToast } from '../utils/toast';

export function useAuth() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
      const userData = response.data.data.user;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      successToast('Logged in successfully!');
      return userData;
    } catch (error) {
      errorToast(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await api.post(API_ENDPOINTS.REGISTER, { name, email, password });
      const userData = response.data.data.user;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      successToast('Registration successful! Logged in.');
      return userData;
    } catch (error) {
      errorToast(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
      localStorage.removeItem('user');
      setUser(null);
      successToast('Logged out successfully.');
    } catch (error) {
      // Even if endpoint fails (e.g. cookie expired), reset frontend state
      localStorage.removeItem('user');
      setUser(null);
      errorToast(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    setUser,
    loading,
    login,
    register,
    logout,
  };
}
