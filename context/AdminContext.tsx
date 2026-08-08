"use client";

import React, { createContext, useContext, useState } from "react";

interface AdminContextType {
  adminTab: string;
  setAdminTab: (tab: string) => void;
}

const AdminContext = createContext<AdminContextType>({
  adminTab: "dashboard",
  setAdminTab: () => {},
});

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminTab, setAdminTab] = useState("dashboard");

  return (
    <AdminContext.Provider value={{ adminTab, setAdminTab }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => useContext(AdminContext);
