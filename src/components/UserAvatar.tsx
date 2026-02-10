'use client';

import { useState, useEffect } from 'react';
import { useAppSettings } from '@/context/AppSettingsContext';
import type { AuthUser } from '@/types';

interface UserAvatarProps {
  user: AuthUser | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showRing?: boolean;
}

export default function UserAvatar({ user, size = 'md', className = '', showRing = false }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const { accentColor } = useAppSettings();

  // Reset error state when user or photoURL changes
  useEffect(() => {
    setImageError(false);
  }, [user?.photoURL]);

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  const ringClass = showRing ? 'ring-2 ring-[rgb(var(--primary))]/20' : '';
  
  // Get background colors based on accent color
  const getGradientColors = () => {
    switch (accentColor) {
      case 'blue':
        return 'from-blue-400 to-blue-600';
      case 'green':
        return 'from-green-400 to-green-600';
      case 'pink':
        return 'from-pink-400 to-pink-600';
      case 'orange':
        return 'from-orange-400 to-orange-600';
      case 'yellow':
      default:
        return 'from-amber-400 to-amber-600';
    }
  };
  
  // Get user initial from displayName or email
  const getUserInitial = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden shrink-0 ${ringClass} ${className}`}>
      {user?.photoURL && !imageError ? (
        <img
          src={user.photoURL}
          alt={user.displayName || 'User'}
          className="w-full h-full object-cover bg-neutral-100 dark:bg-neutral-800"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`w-full h-full bg-linear-to-br ${getGradientColors()} flex items-center justify-center font-bold text-white`}>
          {getUserInitial()}
        </div>
      )}
    </div>
  );
}

