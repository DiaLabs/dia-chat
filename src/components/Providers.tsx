'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { AppSettingsProvider } from '@/context/AppSettingsContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AppSettingsProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </AppSettingsProvider>
    </ThemeProvider>
  );
}
