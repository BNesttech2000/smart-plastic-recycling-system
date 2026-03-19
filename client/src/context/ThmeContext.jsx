import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const [primaryColor, setPrimaryColor] = useState(() => {
    const savedColor = localStorage.getItem('primaryColor');
    return savedColor || 'blue';
  });

  const [fontSize, setFontSize] = useState(() => {
    const savedSize = localStorage.getItem('fontSize');
    return savedSize || 'base';
  });

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.classList.add('dark:bg-gray-900', 'dark:text-gray-100');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark:bg-gray-900', 'dark:text-gray-100');
    }

    // Apply primary color
    const colorMap = {
      blue: '#0ea5e9',
      green: '#10b981',
      purple: '#8b5cf6',
      red: '#ef4444',
      orange: '#f59e0b',
    };
    root.style.setProperty('--primary-color', colorMap[primaryColor] || colorMap.blue);

    // Apply font size
    const sizeMap = {
      small: '14px',
      base: '16px',
      large: '18px',
    };
    root.style.fontSize = sizeMap[fontSize] || sizeMap.base;

    localStorage.setItem('theme', theme);
    localStorage.setItem('primaryColor', primaryColor);
    localStorage.setItem('fontSize', fontSize);
  }, [theme, primaryColor, fontSize]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const changePrimaryColor = (color) => {
    setPrimaryColor(color);
  };

  const changeFontSize = (size) => {
    setFontSize(size);
  };

  const value = {
    theme,
    primaryColor,
    fontSize,
    toggleTheme,
    changePrimaryColor,
    changeFontSize,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};