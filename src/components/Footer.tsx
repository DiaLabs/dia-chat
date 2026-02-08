'use client';

import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import clsx from 'clsx';

export default function Footer() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const showThemeToggle = !user;

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            © {new Date().getFullYear()} Dia Chat. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
            <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Terms
            </a>
          </div>

          {showThemeToggle && (
            <div className="flex items-center gap-1 p-1 rounded-full bg-neutral-100 dark:bg-neutral-800">
              <button
                onClick={() => setTheme('light')}
                className={clsx(
                  'p-2 rounded-full transition-colors',
                  theme === 'light'
                    ? 'bg-white dark:bg-neutral-700 shadow-sm text-amber-500'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                )}
                aria-label="Light mode"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={clsx(
                  'p-2 rounded-full transition-colors',
                  theme === 'system'
                    ? 'bg-white dark:bg-neutral-700 shadow-sm text-amber-500'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                )}
                aria-label="System theme"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={clsx(
                  'p-2 rounded-full transition-colors',
                  theme === 'dark'
                    ? 'bg-white dark:bg-neutral-700 shadow-sm text-amber-500'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                )}
                aria-label="Dark mode"
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
