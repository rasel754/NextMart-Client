"use client";

import { getCurrentUser } from "@/services/AuthService";
import { getMyShop } from "@/services/Shop";
import { IUser } from "@/types";
import { IShop } from "@/types/shop";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface IUserProviderValues {
  user: IUser | null;
  isLoading: boolean;
  setUser: (user: IUser | null) => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  shopInfo: IShop | null;
  isShopLoading: boolean;
  refetchShop: () => Promise<void>;
}

const UserContext = createContext<IUserProviderValues | undefined>(undefined);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shopInfo, setShopInfo] = useState<IShop | null>(null);
  const [isShopLoading, setIsShopLoading] = useState(true);

  const handleUser = async () => {
    const user = await getCurrentUser();
    setUser(user);
    setIsLoading(false);
  };

  const handleShop = async () => {
    if (user) {
      setIsShopLoading(true);
      const res = await getMyShop();
      setShopInfo(res?.data ?? null);
      setIsShopLoading(false);
    } else {
      setShopInfo(null);
      setIsShopLoading(false);
    }
  };

  const refetchShop = async () => {
    const res = await getMyShop();
    setShopInfo(res?.data ?? null);
  };

  useEffect(() => {
    handleUser();
  }, [isLoading]);

  useEffect(() => {
    handleShop();
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        setIsLoading,
        shopInfo,
        isShopLoading,
        refetchShop,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (context == undefined) {
    throw new Error("useUser must be used within the UserProvider context");
  }

  return context;
};

export default UserProvider;
