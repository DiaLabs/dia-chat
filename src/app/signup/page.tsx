'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser } from '@/utils/auth';
import { Sun, Moon } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const router = useRouter();

  // Initialize theme on component mount
  useEffect(() => {
    // Check if there's a theme preference stored or use dark mode by default
    const isDarkMode = document.documentElement.classList.contains('dark-mode');
    setDarkMode(isDarkMode || !document.documentElement.classList.contains('light-mode'));
  }, []);

  // Toggle dark/light mode
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    // Apply theme to document
    if (darkMode) {
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark-mode');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Basic validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }
    
    // Register the user
    const result = registerUser({ name, email, password });
    
    if (result.success) {
      // Redirect to login page after successful registration
      setTimeout(() => {
        setIsLoading(false);
        router.push('/login');
      }, 1000);
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex-1 flex flex-col ${darkMode ? 'bg-slate-900' : 'bg-slate-100'} min-h-screen items-center justify-center p-4 relative`}>
      {/* Theme toggle button - positioned at the top right of the screen */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className={`w-10 h-10 ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-white text-slate-900 border border-slate-300'} rounded-full flex items-center justify-center cursor-pointer`}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-purple-300 rounded-full mb-4"></div>
          <h1 className={`${darkMode ? 'text-white' : 'text-slate-900'} text-2xl font-medium`}>Sign Up!</h1>
          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} mt-2 text-center`}>
            Create an account with email and password
          </p>
        </div>

        {/* Rest of the form remains unchanged */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className={`block ${darkMode ? 'text-slate-300' : 'text-slate-700'} text-sm`}>
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={`w-full p-3 rounded-md ${darkMode ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-slate-900 border-slate-300'} border focus:outline-none focus:ring-2 focus:ring-purple-300`}
              placeholder="John Doe"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className={`block ${darkMode ? 'text-slate-300' : 'text-slate-700'} text-sm`}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full p-3 rounded-md ${darkMode ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-slate-900 border-slate-300'} border focus:outline-none focus:ring-2 focus:ring-purple-300`}
              placeholder="your@email.com"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className={`block ${darkMode ? 'text-slate-300' : 'text-slate-700'} text-sm`}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full p-3 rounded-md ${darkMode ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-slate-900 border-slate-300'} border focus:outline-none focus:ring-2 focus:ring-purple-300`}
              placeholder="••••••••"
            />
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Password must be at least 6 characters long
            </p>
          </div>
          
          <button
            type="submit"
            className="w-full bg-purple-300 hover:bg-purple-400 text-black py-3 rounded-md font-medium cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        <div className={`text-center mt-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Already have an account?{' '}
          <Link href="/login" className="text-purple-300 hover:text-purple-400">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}