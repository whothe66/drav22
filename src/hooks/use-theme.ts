
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(
    () => (Cookies.get('theme') as Theme) || 'light'
  );

  const setMode = (mode: Theme) => {
    Cookies.set('theme', mode);
    setTheme(mode);
  };

  const toggleTheme = () => {
    setMode(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return { theme, setTheme: setMode, toggleTheme };
}
