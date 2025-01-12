// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // To decode JWT tokens
import { useNavigate } from 'react-router-dom';
import API from '../api/UserAPI'; // Ensure you have an API utility for making requests

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  });

  const fetchUser = async (token) => {
    try {
      const response = await API.get('/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Assuming response.data contains user info
    } catch (err) {
      console.error('Error fetching user:', err);
      throw err;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token && !auth.user) {
        try {
          const userData = await fetchUser(token);
          setAuth({ token, user: userData });
          localStorage.setItem('user', JSON.stringify(userData)); // Persist user data
        } catch (err) {
          // If fetching user fails, remove invalid token and user data
          setAuth({ token: null, user: null });
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setAuth((prev) => ({ ...prev, token }));

      const userData = await fetchUser(token);
      setAuth((prev) => ({...prev, user: userData }));
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/');
    } catch (err) {
      throw err;
    }
  };

  const signup = async (firstName, lastName, email, password) => {
    try {
      const response = await API.post('/auth/register', {
        firstName,
        lastName,
        email,
        password,
      });
      // Optionally, auto-login after signup
      await login(email, password);
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ auth, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
