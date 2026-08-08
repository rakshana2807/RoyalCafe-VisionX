"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncAuthState = () => {
    try {
      const savedUser = localStorage.getItem("royalcafe_user") || localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        const role = localStorage.getItem("role");
        const email = localStorage.getItem("email") || localStorage.getItem("adminEmail");
        if (role && email) {
          setUser({ role, email, name: email.split("@")[0] });
        } else {
          setUser(null);
        }
      }
    } catch (e) {
      console.error("Failed to load auth user from storage", e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    syncAuthState();
    window.addEventListener("auth-state-change", syncAuthState);
    return () => {
      window.removeEventListener("auth-state-change", syncAuthState);
    };
  }, []);

  const login = (userData: UserProfile) => {
    setUser(userData);
    if (userData.role) localStorage.setItem("role", userData.role);
    if (userData.email) {
      localStorage.setItem("email", userData.email);
      if (userData.role === "admin") {
        localStorage.setItem("adminEmail", userData.email);
      }
    }
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("royalcafe_user", JSON.stringify(userData));
    window.dispatchEvent(new Event("auth-state-change"));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("user");
    localStorage.removeItem("royalcafe_user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-state-change"));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
