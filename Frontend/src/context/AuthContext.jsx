import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to read cookie values on the client
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  // Decode JWT payload without backend endpoints
  const getUserFromToken = () => {
    const token = getCookie('token');
    if (!token) return null;
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadDecoded = JSON.parse(
        atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
      );
      return payloadDecoded; // contains { id, role }
    } catch (e) {
      console.error("Error decoding token cookie:", e);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = () => {
      const savedUser = localStorage.getItem('spotify_user');
      const tokenInfo = getUserFromToken();

      if (savedUser && tokenInfo) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed.id === tokenInfo.id) {
            setUser(parsed);
          } else {
            setUser({
              id: tokenInfo.id,
              role: tokenInfo.role,
              username: tokenInfo.role === 'artist' ? 'Artist' : 'User'
            });
          }
        } catch (e) {
          setUser({
            id: tokenInfo.id,
            role: tokenInfo.role,
            username: tokenInfo.role === 'artist' ? 'Artist' : 'User'
          });
        }
      } else if (tokenInfo) {
        setUser({
          id: tokenInfo.id,
          role: tokenInfo.role,
          username: tokenInfo.role === 'artist' ? 'Artist' : 'User'
        });
      } else {
        setUser(null);
        localStorage.removeItem('spotify_user');
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (usernameOrEmail, password) => {
    const isEmail = usernameOrEmail.includes('@');
    const payload = isEmail
      ? { email: usernameOrEmail, password }
      : { username: usernameOrEmail, password };

    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }

    const tokenInfo = getUserFromToken();
    const loggedUser = {
      id: tokenInfo?.id || 'temp-id',
      role: tokenInfo?.role || 'user',
      username: isEmail ? usernameOrEmail.split('@')[0] : usernameOrEmail,
    };

    setUser(loggedUser);
    localStorage.setItem('spotify_user', JSON.stringify(loggedUser));
    return loggedUser;
  };

  const register = async (username, email, password, role) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role }),
      credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    const registeredUser = {
      id: data.user.id,
      role: data.user.role,
      username: data.user.username,
      email: data.user.email,
    };

    setUser(registeredUser);
    localStorage.setItem('spotify_user', JSON.stringify(registeredUser));
    return registeredUser;
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.warn('Logout endpoint crashed or failed, cleaning up local state:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('spotify_user');
      // Force cookie removal on client side
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
