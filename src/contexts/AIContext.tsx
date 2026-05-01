import React, { createContext, useContext, useState } from 'react';

type AIContextType = {
  isAIEnabled: boolean;
  setIsAIEnabled: (enabled: boolean) => void;
};

const AIContext = createContext<AIContextType>({
  isAIEnabled: false,
  setIsAIEnabled: () => {},
});

export const AIProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  return (
    <AIContext.Provider value={{ isAIEnabled, setIsAIEnabled }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);
