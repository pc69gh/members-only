import { createContext, useContext, useEffect, useState } from 'react';

const MenuContext = createContext<{
  chatVisible: boolean;
  setChatVisible: (visible: boolean) => void;
  chatRunning: boolean;
  setChatRunning: (running: boolean) => void;
}>({
  chatVisible: false,
  setChatVisible: () => {
    return;
  },
  chatRunning: false,
  setChatRunning: () => {
    return;
  },
});

export const useMenuContext = () => useContext(MenuContext);

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [chatVisible, setChatVisible] = useState(false);
  const [chatRunning, setChatRunning] = useState(false);

  useEffect(() => setChatVisible(chatRunning), [chatRunning]);

  return (
    <MenuContext.Provider
      value={{ chatVisible, setChatVisible, chatRunning, setChatRunning }}
    >
      {children}
    </MenuContext.Provider>
  );
};
