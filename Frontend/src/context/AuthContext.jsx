import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('spotify_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem('spotify_user');
        }
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem('spotify_user', JSON.stringify(data.user));
        } else {
          setUser(null);
          localStorage.removeItem('spotify_user');
        }
      } catch (err) {
        console.error("Error verifying session status:", err);
      } finally {
        setLoading(false);
      }
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

    const loggedUser = {
      id: data.user.id,
      role: data.user.role,
      username: data.user.username,
      email: data.user.email,
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
