import { User } from "@/lib/types";
import { createContext, ReactNode, useState } from "react";

// Create the context
export const UserContext = createContext<{
  userData: User | null;
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

// UserContextProvider to provide userData and setUserData to the component tree
export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <UserContext.Provider
      value={{ userData, setUserData, loading, setLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};
