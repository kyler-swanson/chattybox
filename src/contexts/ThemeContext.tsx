import { createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  return useContext(ThemeContext)!;
};

export const useProvideTheme = () => {
  const storedTheme = localStorage.getItem('theme') as 'light' | 'dark';
  const [theme, setTheme] = useState<'light' | 'dark'>(storedTheme || 'light');

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);

    return () => {
      document.body.className = '';
    };
  }, [theme]);

  return {
    theme,
    setTheme
  };
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useProvideTheme();
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};
