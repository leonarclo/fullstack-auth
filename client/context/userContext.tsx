"use client";
import { useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface IUserData {
  name: string;
  email: string;
  image?: string;
  token: string;
  role?: string | null;
  account_access_token?: string | null;
  account_expires_at?: Date | null;
}

interface IUserContext {
  userData?: IUserData | null;
  loading: boolean;
  setUserData?: (userData: IUserData | null) => void;
  setLoading: (loading: boolean) => void;
}

export const UserContext = createContext<IUserContext>({
  userData: null,
  loading: true,
  setUserData: () => {},
  setLoading: () => {},
});

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [userData, setUserData] = useState<IUserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3001/user-data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();
        if (response.ok) {
          setUserData(data);
        } else {
          // router.push("/login");
          console.log(response);
        }
      } catch (error: any) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router, userData]);

  return (
    <UserContext.Provider
      value={{ userData, setUserData, loading, setLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
