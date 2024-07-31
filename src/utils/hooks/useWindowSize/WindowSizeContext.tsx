'use client';
import { createContext, useState } from 'react';

type WindowSize = {
  width: number;
  height: number;
};

type WindowSizeContextType = {
  windowSize: WindowSize;
  setWindowSize: (size: WindowSize) => void;
};

const WindowSizeContext = createContext<WindowSizeContextType | null>(null);

export function WindowSizeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  return (
    <WindowSizeContext.Provider value={{ windowSize, setWindowSize }}>
      {children}
    </WindowSizeContext.Provider>
  );
}

export default WindowSizeContext;
