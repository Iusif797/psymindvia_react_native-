import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type DrawerOpenContextValue = {
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
};

const DrawerOpenContext = createContext<DrawerOpenContextValue | null>(null);

export function DrawerOpenProvider({ children }: { children: ReactNode }) {
  const [isDrawerOpen, setDrawerOpenState] = useState(false);
  const setDrawerOpen = useCallback((open: boolean) => {
    setDrawerOpenState(open);
  }, []);
  return (
    <DrawerOpenContext.Provider value={{ isDrawerOpen, setDrawerOpen }}>
      {children}
    </DrawerOpenContext.Provider>
  );
}

export function useDrawerOpen() {
  const ctx = useContext(DrawerOpenContext);
  return ctx ?? { isDrawerOpen: false, setDrawerOpen: () => {} };
}
