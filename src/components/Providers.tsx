'use client';

import { ReactNode } from 'react';
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
