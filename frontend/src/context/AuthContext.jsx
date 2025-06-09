import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    if (userInfo) {
      setUser(userInfo);
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/users/login', { email, password });
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response && error.response.data.message
          ? error.response.data.message
          : error.message 
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const { data } = await axios.post('/api/users', { username, email, password });
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response && error.response.data.message
          ? error.response.data.message
          : error.message 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};