"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { AuraData } from "./aura-engine";

interface AuraContextType {
  aura: AuraData | null;
  setAura: (data: AuraData | null) => void;
}

const AuraContext = createContext<AuraContextType | undefined>(undefined);

export function AuraProvider({ children }: { children: ReactNode }) {
  const [aura, setAuraState] = useState<AuraData | null>(null);

  const setAura = useCallback((data: AuraData | null) => {
    setAuraState(data);
  }, []);

  return (
    <AuraContext.Provider value={{ aura, setAura }}>
      {children}
    </AuraContext.Provider>
  );
}

export function useAura() {
  const context = useContext(AuraContext);
  if (context === undefined) {
    throw new Error("useAura must be used within an AuraProvider");
  }
  return context;
}
