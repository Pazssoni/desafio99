/**
 * @file React context for managing authentication state.
 */
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { axiosInstance } from '../api/axios';

const AuthContext = createContext(null);

/**
 * Provides authentication state and functions to its children components.
 * Manages the user's token, loading state, and authentication status.
 * @param {{ children: React.ReactNode }} props
 */
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Attempts to refresh the session by calling the /refresh endpoint.
   * This is called once on initial application load.
   */
  const refreshLogin = useCallback(async () => {
    try {
      const response = await axiosInstance.post('/api/auth/refresh');
      setToken(response.data.accessToken);
    } catch {
      // This block is intentionally empty.
      // A failed refresh is an expected behavior for unauthenticated users.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshLogin();
  }, [refreshLogin]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setToken(null);
    }
  };

  const isAuthenticated = !!token;
  const contextValue = { isAuthenticated, token, login, logout, isLoading };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to consume the AuthContext.
 * @returns {{
 * isAuthenticated: boolean,
 * token: string | null,
 * login: (newToken: string) => void,
 * logout: () => Promise<void>,
 * isLoading: boolean
 * }} The authentication context value.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};