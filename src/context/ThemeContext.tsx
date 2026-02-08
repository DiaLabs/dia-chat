'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Theme } from '@/types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Initial mount - load saved theme and apply immediately
  useEffect(() => {
    const saved = localStorage.getItem('dia-theme') as Theme | null;
    const initialTheme = saved || 'system';
    setThemeState(initialTheme);
    
    // Immediately resolve and apply theme
    let resolved: 'light' | 'dark';
    if (initialTheme === 'system') {
      resolved = getSystemTheme();
    } else {
      resolved = initialTheme;
    }
    setResolvedTheme(resolved);
    
    // Apply to document immediately
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolved);
    
    setMounted(true);
  }, []);

  // Update when theme changes
  useEffect(() => {
    if (!mounted) return;
    
    const updateResolvedTheme = () => {
      let resolved: 'light' | 'dark';
      if (theme === 'system') {
        resolved = getSystemTheme();
      } else {
        resolved = theme;
      }
      setResolvedTheme(resolved);
      
      // Apply to document
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(resolved);
    };

    updateResolvedTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateResolvedTheme);
    return () => mediaQuery.removeEventListener('change', updateResolvedTheme);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('dia-theme', newTheme);
  };

  // Prevent flash of wrong theme
  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
