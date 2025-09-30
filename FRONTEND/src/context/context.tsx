import { createContext, useContext } from "react";
import type { ReactNode } from "react";

type MyContextType = {
  // define your context value type here, e.g.:
  designation?: string;
  setDesignation?: (designation: string) => void;
};

export const MyContext = createContext<MyContextType | undefined>({ designation: "mentor" });

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};

interface MyContextProviderProps {
  children: ReactNode;
  value: MyContextType;
}

export const MyContextProvider: React.FC<MyContextProviderProps> = ({ children, value }) => {
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};
