'use client';

import { ReactNode, useEffect } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AppSettingsProvider } from '@/context/AppSettingsContext';

function SettingsWrapper({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  return (
    <AppSettingsProvider user={user}>
      {children}
    </AppSettingsProvider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Suppress specific warnings that are noisy but harmless
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('powerPreference option is currently ignored')) {
        return;
      }
      originalWarn.apply(console, args);
    };
    return () => {
      console.warn = originalWarn;
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsWrapper>
          {children}
        </SettingsWrapper>
      </AuthProvider>
    </ThemeProvider>
  );
}
