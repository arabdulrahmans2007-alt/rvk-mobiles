import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('rvk_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('rvk_token') || null);

  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem('rvk_admin');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('rvk_admin_token') || null);

  // Customer login
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('rvk_user', JSON.stringify(userData));
    localStorage.setItem('rvk_token', userToken);
  };

  // Customer logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('rvk_user');
    localStorage.removeItem('rvk_token');
  };

  // Admin login
  const adminLogin = (adminData, aToken) => {
    setAdmin(adminData);
    setAdminToken(aToken);
    localStorage.setItem('rvk_admin', JSON.stringify(adminData));
    localStorage.setItem('rvk_admin_token', aToken);
  };

  // Admin logout
  const adminLogout = () => {
    setAdmin(null);
    setAdminToken(null);
    localStorage.removeItem('rvk_admin');
    localStorage.removeItem('rvk_admin_token');
  };

  // Refresh customer profile
  const refreshProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('rvk_user', JSON.stringify(data.user));
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        refreshProfile,
        admin,
        adminToken,
        isAdminAuthenticated: !!adminToken && !!admin,
        adminLogin,
        adminLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}