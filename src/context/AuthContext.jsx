import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = AuthService.getCurrentUser();
    setUser(current);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await AuthService.login(email, password);
    if (res.success) {
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.error || 'Authentication failed');
  };

  const register = async (name, email, password, role) => {
    const res = await AuthService.register(name, email, password, role);
    if (res.success) {
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.error || 'Registration failed');
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const updateProfile = (updatedData) => {
    const updated = AuthService.updateProfile(updatedData);
    setUser(updated);
    return updated;
  };

  const changePassword = async (currentPassword, newPassword) => {
    return AuthService.changePassword(currentPassword, newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'Administrator',
        login,
        register,
        logout,
        updateProfile,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
