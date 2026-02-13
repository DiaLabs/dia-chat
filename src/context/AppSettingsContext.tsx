'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { AccentColor, FontSize } from '@/types';
import type { AuthUser } from '@/types';

interface AppSettingsContextType {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  cacheDuration: number; // in days
  setCacheDuration: (days: number) => void;
  inferenceMode: 'auto' | 'cpu' | 'gpu';
  setInferenceMode: (mode: 'auto' | 'cpu' | 'gpu') => void;
  clearCache: () => void;
  clearAllData: () => void;
}

interface AppSettingsProviderProps {
  children: ReactNode;
  user?: AuthUser | null;
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

export function AppSettingsProvider({ children, user }: AppSettingsProviderProps) {
  const [accentColor, setAccentColorState] = useState<AccentColor>('yellow');
  const [fontSize, setFontSizeState] = useState<FontSize>('medium');
  const [cacheDuration, setCacheDurationState] = useState<number>(7); // 7 days default
  const [inferenceMode, setInferenceModeState] = useState<'auto' | 'cpu' | 'gpu'>('auto');
  const [mounted, setMounted] = useState(false);

  // Load settings from localStorage only if user is logged in
  useEffect(() => {
    if (user) {
      const savedAccent = localStorage.getItem('dia-accent-color') as AccentColor | null;
      const savedFontSize = localStorage.getItem('dia-font-size') as FontSize | null;
      const savedCacheDuration = localStorage.getItem('dia-cache-duration');
      const savedInferenceMode = localStorage.getItem('dia-inference-mode') as 'auto' | 'cpu' | 'gpu' | null;

      if (savedAccent) setAccentColorState(savedAccent);
      if (savedFontSize) setFontSizeState(savedFontSize);
      if (savedCacheDuration) setCacheDurationState(parseInt(savedCacheDuration));
      if (savedInferenceMode) setInferenceModeState(savedInferenceMode);
    } else {
      // Reset to defaults when no user is logged in
      setAccentColorState('yellow');
      setFontSizeState('medium');
      setCacheDurationState(7);
      setInferenceModeState('auto');
    }

    setMounted(true);
  }, [user]);

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

  const setInferenceMode = (mode: 'auto' | 'cpu' | 'gpu') => {
    setInferenceModeState(mode);
    localStorage.setItem('dia-inference-mode', mode);
  };

  const clearCache = async () => {
    // Clear old chats based on cache duration from IndexedDB
    try {
      const { IndexedDBService } = await import('@/services/IndexedDBService');
      const db = IndexedDBService.getInstance();
      await db.init(); // Initialize DB first
      
      const now = Date.now();
      const maxAge = cacheDuration * 24 * 60 * 60 * 1000; // Convert days to ms
      
      // Get all chats
      const chats = await db.getAllChats();
      
      // Delete old chats
      let deletedCount = 0;
      for (const chat of chats) {
        if ((now - chat.lastVisitedAt) > maxAge) {
          await db.deleteChat(chat.id);
          deletedCount++;
        }
      }
      
      console.log(`Cleared ${deletedCount} old chats (older than ${cacheDuration} days)`);
    } catch (e) {
      console.error('Error clearing cache:', e);
    }
  };

  const clearAllData = async () => {
    // Clear all app data from IndexedDB
    try {
      const { IndexedDBService } = await import('@/services/IndexedDBService');
      const db = IndexedDBService.getInstance();
      await db.init(); // Initialize DB first
      
      // Get all chats and delete them
      const chats = await db.getAllChats();
      for (const chat of chats) {
        await db.deleteChat(chat.id);
      }
      
      console.log('Cleared all chats from IndexedDB');
    } catch (e) {
      console.error('Error clearing all data:', e);
    }
    
    // Clear localStorage theme
    localStorage.removeItem('dia-theme');
    
    // Reset settings to defaults
    setAccentColor('yellow');
    setFontSize('medium');
    setCacheDuration(7);
    setInferenceMode('auto');
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
        inferenceMode,
        setInferenceMode,
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
