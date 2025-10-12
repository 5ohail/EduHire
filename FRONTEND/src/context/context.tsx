import { User } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type MyContextType = {
  designation: string;
  setDesignation: React.Dispatch<React.SetStateAction<string>>;
  user: string;
  setUser: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultContextValue: MyContextType = {
  designation: "",
  setDesignation: () => {},
  user: "",
  setUser: () => {},
  email: "",
  setEmail: () => {},
  isLoggedIn: false,
  setIsLoggedIn: ()=>{}
};

export const MyContext = createContext<MyContextType>(defaultContextValue);

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) throw new Error("useMyContext must be used within a MyContextProvider");
  return context;
};

interface MyContextProviderProps {
  children: ReactNode;
}

export const MyContextProvider: React.FC<MyContextProviderProps> = ({ children }) => {
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : {};
  const [designation, setDesignation] = useState<string>(parsedUser.role || "student");
  const [user, setUser] = useState<string>(parsedUser.username || "");
  const [email, setEmail] = useState<string>(parsedUser.email || "");
  const [isLoggedIn,setIsLoggedIn] = useState<boolean>(Boolean(parsedUser) || false);
  return (
    <MyContext.Provider value={{ designation, setDesignation, user, setUser, email, setEmail,isLoggedIn,setIsLoggedIn }}>
      {children}
    </MyContext.Provider>
  );
};
