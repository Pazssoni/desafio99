import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { axiosInstance } from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshLogin = useCallback(async () => {
    try {
      const response = await axiosInstance.post('/api/auth/refresh');
      setToken(response.data.accessToken);
    } catch {
      // Bloco intencionalmente vazio. Uma falha no refresh é esperada
      // para usuários que não estão logados, e nenhuma ação é necessária.
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
      console.error("Erro no logout:", error);
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};