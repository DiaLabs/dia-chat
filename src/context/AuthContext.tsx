'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged,
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase';
import type { AuthUser } from '@/types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    // Helper to save user to sessionStorage for persistence
    const saveUserToSession = (userData: AuthUser | null) => {
      if (typeof window !== 'undefined') {
        if (userData) {
          sessionStorage.setItem('dia-user', JSON.stringify(userData));
        } else {
          sessionStorage.removeItem('dia-user');
        }
      }
    };

    // Try to restore from sessionStorage first
    if (typeof window !== 'undefined') {
      try {
        const storedUser = sessionStorage.getItem('dia-user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          console.log('Restored user from session:', JSON.parse(storedUser).email);
        }
      } catch (error) {
        console.warn('Failed to restore user from session:', error);
      }
    }

    // Check for redirect result on mount
    const checkRedirectResult = async () => {
      try {
        const { getRedirectResult } = await import('firebase/auth');
        if (!auth || !isMounted) return;
        
        const result = await getRedirectResult(auth);
        if (!isMounted) return;
        
        if (result?.user) {
          console.log('User signed in via redirect:', result.user.email);
          // The onAuthStateChanged listener will handle the user state update
        }
      } catch (error: any) {
        if (!isMounted) return;
        console.error('Redirect sign-in error:', error);
        if (error.code === 'auth/network-request-failed' || error.message?.includes('network-request-failed')) {
          console.warn('Network error detected. Falling back to Guest mode.');
          const guestUser = {
            uid: 'guest-user',
            email: 'guest@diachat.app',
            displayName: 'Guest User',
            photoURL: null,
          };
          setUser(guestUser);
          saveUserToSession(guestUser);
          setLoading(false);
        }
      }
    };

    // Start checking redirect result
    checkRedirectResult();

    console.log('Setting up auth state listener...');
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (!isMounted) return;
      console.log('Auth state changed:', firebaseUser ? 'Logged In' : 'Logged Out');
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setUser(userData);
        saveUserToSession(userData);
      } else {
        setUser(null);
        saveUserToSession(null);
      }
      setLoading(false);
    });

    // Safety timeout: If Firebase doesn't respond in 5 seconds, stop loading
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        console.warn('Auth state listener timed out. Forcing loading completion.');
        setLoading(false);
      }
    }, 5000);

    return () => {
      isMounted = false;
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [loading]);

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      console.error('Firebase not configured. Please set up your .env.local file.');
      alert('Firebase authentication is not configured. Using demo mode.');
      // For demo purposes, create a mock user
      setUser({
        uid: 'demo-user',
        email: 'demo@diachat.app',
        displayName: 'Demo User',
        photoURL: null,
      });
      return;
    }

    try {
      console.log('Initiating Google sign-in with popup...');
      // Use popup for authentication
      const { signInWithPopup } = await import('firebase/auth');
      const result = await signInWithPopup(auth, googleProvider);
      if (result?.user) {
        console.log('✅ User signed in via popup:', result.user.email);
      }
    } catch (error: any) {
      console.error('❌ Google sign-in error:', error.code, error.message);
      
      // Handle specific error cases
      if (error.code === 'auth/popup-blocked') {
        console.warn('Popup blocked by browser, trying redirect...');
        try {
          const { signInWithRedirect } = await import('firebase/auth');
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectError) {
          console.error('Redirect sign-in also failed:', redirectError);
        }
      } else if (error.code === 'auth/popup-closed-by-user') {
        console.log('User closed the popup');
        return; // Don't throw, user intentionally closed
      } else if (error.code === 'auth/unauthorized-domain') {
        alert('Error: localhost is not authorized in Firebase Console.\n\nPlease add "localhost" to Authorized domains in Firebase Console > Authentication > Settings > Authorized domains');
        throw error;
      } else if (error.code === 'auth/network-request-failed') {
        alert('Network error. Please check your internet connection.');
        throw error;
      }
      
      // For other errors, throw to let user know
      throw error;
    }
  };

  const logout = async () => {
    if (!isFirebaseConfigured || !auth) {
      setUser(null);
      return;
    }

    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout, isConfigured: isFirebaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
