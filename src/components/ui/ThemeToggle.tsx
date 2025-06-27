'use client';

import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { toggleTheme } from '@/lib/store/slices/themeSlice';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { isDarkMode } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    console.log('ThemeToggle: Button clicked!');
    console.log('ThemeToggle: Current isDarkMode:', isDarkMode);
    
    // Dispatch the Redux action
    dispatch(toggleTheme());
    
    console.log('ThemeToggle: toggleTheme dispatched');
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-md text-slate-400 hover:text-slate-300 hover:bg-slate-700 transition-colors"
        aria-label="Toggle theme"
        disabled
      >
        <div className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-md text-slate-400 hover:text-slate-300 hover:bg-slate-700 transition-colors"
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  );
} 