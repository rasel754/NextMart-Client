"use client";
import Loading from "@/components/ui/loading";
import { AppStore, makeStore } from "@/redux/store";
import { ReactNode, useRef } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

const StoreProviders = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<AppStore>(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  const persistedStore = persistStore(storeRef.current);

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={<Loading></Loading> } persistor={persistedStore}>{children}</PersistGate>
    </Provider>
  );
};

export default StoreProviders;
