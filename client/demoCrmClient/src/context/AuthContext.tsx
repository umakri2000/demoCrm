import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance, { setAuthToken } from '../api/axiosInstance';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

var AuthContext = createContext<AuthContextType | undefined>(undefined);

export var AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  var [user, setUser] = useState<User | null>(null);
  var [isLoading, setIsLoading] = useState<boolean>(true);
  var [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Attempt to silently refresh token on load
    axiosInstance.post('/auth/refresh')
      .then((res) => {
        var { accessToken } = res.data;
        if (accessToken) {
          setAuthToken(accessToken);
          // Now fetch user details
          return axiosInstance.get('/auth/me');
        }
        throw new Error('No access token');
      })
      .then((res) => {
        if (res && res.data && res.data.user) {
          setUser(res.data.user);
        }
      })
      .catch((err) => {
        console.log('No active session found during initialization');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  var login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      var response = await axiosInstance.post('/auth/login', { email, password });
      var { accessToken, user: loggedUser } = response.data;

      setAuthToken(accessToken);
      setUser(loggedUser);
    } catch (err: any) {
      console.error('Login request failed:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again later.');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  var register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      var response = await axiosInstance.post('/auth/register', { name, email, password });
      var { accessToken, user: loggedUser } = response.data;

      setAuthToken(accessToken);
      setUser(loggedUser);
    } catch (err: any) {
      console.error('Register request failed:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again later.');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  var logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (e) {
      console.warn('Logout request failed', e);
    }
    setAuthToken(null);
    setUser(null);
    setError(null);
  };

  var clearError = () => setError(null);

  var value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export var useAuth = (): AuthContextType => {
  var context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
