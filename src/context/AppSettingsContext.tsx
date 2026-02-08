'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { AccentColor, FontSize } from '@/types';

interface AppSettingsContextType {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  cacheDuration: number; // in days
  setCacheDuration: (days: number) => void;
  clearCache: () => void;
  clearAllData: () => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

const ACCENT_COLORS: Record<AccentColor, string> = {
  yellow: '251 191 36', // amber-400
  blue: '59 130 246',   // blue-500
  green: '34 197 94',   // green-500
  pink: '236 72 153',   // pink-500
  orange: '249 115 22', // orange-500
};

const ACCENT_HOVER_COLORS: Record<AccentColor, string> = {
  yellow: '245 158 11', // amber-500
  blue: '37 99 235',    // blue-600
  green: '22 163 74',    // green-600
  pink: '219 39 119',   // pink-600
  orange: '234 88 12',  // orange-600
};

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [accentColor, setAccentColorState] = useState<AccentColor>('yellow');
  const [fontSize, setFontSizeState] = useState<FontSize>('medium');
  const [cacheDuration, setCacheDurationState] = useState<number>(7); // 7 days default
  const [mounted, setMounted] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedAccent = localStorage.getItem('dia-accent-color') as AccentColor | null;
    const savedFontSize = localStorage.getItem('dia-font-size') as FontSize | null;
    const savedCacheDuration = localStorage.getItem('dia-cache-duration');

    if (savedAccent) setAccentColorState(savedAccent);
    if (savedFontSize) setFontSizeState(savedFontSize);
    if (savedCacheDuration) setCacheDurationState(parseInt(savedCacheDuration));

    setMounted(true);
  }, []);

  // Apply accent color to CSS variables
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    root.style.setProperty('--primary', ACCENT_COLORS[accentColor]);
    root.style.setProperty('--primary-hover', ACCENT_HOVER_COLORS[accentColor]);
  }, [accentColor, mounted]);

  // Apply font size
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    const sizes = { small: '14px', medium: '16px', large: '18px' };
    root.style.fontSize = sizes[fontSize];
  }, [fontSize, mounted]);

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
    localStorage.setItem('dia-accent-color', color);
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem('dia-font-size', size);
  };

  const setCacheDuration = (days: number) => {
    setCacheDurationState(days);
    localStorage.setItem('dia-cache-duration', days.toString());
  };

  const clearCache = () => {
    // Clear old chats based on cache duration
    const chatsData = localStorage.getItem('dia-chats');
    if (!chatsData) return;

    try {
      const chats = JSON.parse(chatsData);
      const now = Date.now();
      const maxAge = cacheDuration * 24 * 60 * 60 * 1000; // Convert days to ms
      
      const filteredChats = chats.filter((chat: any) => {
        return (now - chat.updatedAt) < maxAge;
      });

      localStorage.setItem('dia-chats', JSON.stringify(filteredChats));
    } catch (e) {
      console.error('Error clearing cache:', e);
    }
  };

  const clearAllData = () => {
    // Clear all app data except settings
    localStorage.removeItem('dia-chats');
    localStorage.removeItem('dia-theme');
    
    // Reset settings to defaults
    setAccentColor('yellow');
    setFontSize('medium');
    setCacheDuration(7);
  };

  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <AppSettingsContext.Provider
      value={{
        accentColor,
        setAccentColor,
        fontSize,
        setFontSize,
        cacheDuration,
        setCacheDuration,
        clearCache,
        clearAllData,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (!context) throw new Error('useAppSettings must be used within AppSettingsProvider');
  return context;
}
