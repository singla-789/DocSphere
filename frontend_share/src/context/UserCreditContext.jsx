import { createContext } from "react";

export const UserCreditsContext = createContext();

export const UserCreditsProvider = ({ children }) => {

  const contextValue = {

  }

  return (
    <UserCreditsContext.Provider value={contextValue}>
      {children}
    </UserCreditsContext.Provider>
  );
};