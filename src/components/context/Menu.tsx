import { createContext, useContext, useState } from 'react';

const MenuContext = createContext<{
  chatVisible: boolean;
  setChatVisible: (visible: boolean) => void;
}>({
  chatVisible: false,
  setChatVisible: () => {
    return;
  },
});

export const useMenuContext = () => useContext(MenuContext);

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [chatVisible, setChatVisible] = useState(false);

  return (
    <MenuContext.Provider value={{ chatVisible, setChatVisible }}>
      {children}
    </MenuContext.Provider>
  );
};
