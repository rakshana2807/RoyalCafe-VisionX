"use client";

import React, { createContext, useContext, useState } from "react";

export interface WifiPass {
  id: string;
  name: string;
  speed: string;
  duration: string;
  price: number;
}

interface WiFiContextType {
  activePass: WifiPass | null;
  setActivePass: (pass: WifiPass | null) => void;
}

const WiFiContext = createContext<WiFiContextType>({
  activePass: null,
  setActivePass: () => {},
});

export const WiFiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePass, setActivePass] = useState<WifiPass | null>(null);

  return (
    <WiFiContext.Provider value={{ activePass, setActivePass }}>
      {children}
    </WiFiContext.Provider>
  );
};

export const useWiFiContext = () => useContext(WiFiContext);
