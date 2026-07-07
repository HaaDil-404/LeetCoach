import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("leetcoach_token");
    localStorage.removeItem("leetcoach_user");
    setUser(null);
  }, []);

  // Hydrate user on mount — keep loading=true until token is verified
  useEffect(() => {
    const token = localStorage.getItem("leetcoach_token");
    const storedUser = localStorage.getItem("leetcoach_user");

    if (token && storedUser) {
      // Optimistically set user from cache so UI doesn't flash
      setUser(JSON.parse(storedUser));
      // Silently verify token validity with the server
      authAPI
        .getMe()
        .then((res) => {
          const freshUser = res.data.data;
          setUser(freshUser);
          localStorage.setItem("leetcoach_user", JSON.stringify(freshUser));
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          // Loading is done only after the server responds
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [logout]);

  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { data, token } = res.data;
    localStorage.setItem("leetcoach_token", token);
    localStorage.setItem("leetcoach_user", JSON.stringify(data));
    setUser(data);
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    const { data, token } = res.data;
    localStorage.setItem("leetcoach_token", token);
    localStorage.setItem("leetcoach_user", JSON.stringify(data));
    setUser(data);
    return data;
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("leetcoach_user", JSON.stringify(userData));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
