import { useContext, useEffect } from 'react';
import WindowSizeContext from './WindowSizeContext';

export function useWindowSize() {
  const ctx = useContext(WindowSizeContext);

  if (!ctx) {
    throw new Error('useWindowSize must be used within a WindowSizeProvider');
  }

  const { windowSize, setWindowSize } = ctx;

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
