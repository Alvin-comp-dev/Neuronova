'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { logout } from '@/lib/store/slices/authSlice';
import { toggleTheme } from '@/lib/store/slices/themeSlice';
import NotificationCenter from '@/components/ui/NotificationCenter';
import ThemeToggle from '@/components/ui/ThemeToggle';
import {
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { isDarkMode } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Mock unread notification count - in real app, this would come from state/API
  const unreadNotificationCount = 3;

  console.log('Header rendered - isDarkMode:', isDarkMode);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const handleThemeToggle = () => {
    console.log('Theme toggle button clicked!');
    console.log('Current isDarkMode:', isDarkMode);
    
    // Toggle the theme in Redux
    dispatch(toggleTheme());
    
    // Also manually toggle the document classes as a backup
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      html.classList.add('light');
      console.log('Switched to light mode');
    } else {
      html.classList.remove('light');
      html.classList.add('dark');
      console.log('Switched to dark mode');
    }
    
    console.log('toggleTheme dispatched');
    console.log('Document classes after toggle:', html.className);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/search');
    }
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Research Feed', href: '/research' },
    { name: 'Trending Discoveries', href: '/trending' },
    { name: 'Community Hub', href: '/community' },
    { name: 'Expert Insights', href: '/experts' },
    { name: 'Knowledge Base', href: '/knowledge' },
    { name: 'Achievements', href: '/achievements' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'About', href: '/about' },
  ];

  return (
    <>
      <header className="bg-slate-800 shadow-lg border-b border-slate-700 sticky top-0 z-40 backdrop-blur-sm w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
<<<<<<< HEAD
              <Link href="/" className="flex items-center space-x-3">
                <div className="h-10 w-10 flex items-center justify-center">
                  <img 
                    src="/brain-logo.svg" 
                    alt="NeuroNova Brain Logo" 
                    className="h-8 w-8 drop-shadow-lg hover:scale-110 transition-transform duration-200"
                  />
                </div>
=======
              <Link href="/" className="flex items-center space-x-2">
                <img 
                  src="/neuronova-logo.svg" 
                  alt="Neuronova Logo" 
                  className="h-8 w-8"
                />
>>>>>>> 03806d4b54e00b624b51d1ea58aeb0b489a4de23
                <span className="text-xl font-bold text-white">
                  Neuronova
                </span>
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
<<<<<<< HEAD
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search research papers, authors, topics..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400 transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-blue-400 transition-colors"
                  title="Search"
                >
                  <MagnifyingGlassIcon className="w-4 h-4" />
=======
                  placeholder="Search research papers, authors, topics..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-600"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
>>>>>>> 03806d4b54e00b624b51d1ea58aeb0b489a4de23
                </button>
              </form>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 flex-shrink-0">
              <Link href="/" className="text-slate-300 hover:text-blue-400 transition-colors">
                Home
              </Link>
              <Link href="/research" className="text-slate-300 hover:text-blue-400 transition-colors">
                Research
              </Link>
              <Link href="/search" className="text-slate-300 hover:text-blue-400 transition-colors">
                Search
              </Link>
              <Link href="/publish" className="text-slate-300 hover:text-blue-400 transition-colors">
                Publish
              </Link>
              <Link href="/community" className="text-slate-300 hover:text-blue-400 transition-colors">
                Community
              </Link>
              <Link href="/experts" className="text-slate-300 hover:text-blue-400 transition-colors">
                Experts
              </Link>
              <Link href="/about" className="text-slate-300 hover:text-blue-400 transition-colors">
                About
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Notifications */}
              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationCenterOpen(true)}
                    className="relative p-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-md transition-colors"
                  >
                    <BellIcon className="h-6 w-6" />
                    {unreadNotificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                      </span>
                    )}
                  </button>
                </div>
              )}

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-md text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-8 w-8 rounded-full border-2 border-slate-600"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-slate-600 rounded-full flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-slate-300" />
                      </div>
                    )}
                    <span className="text-sm font-medium">{user?.name}</span>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg border border-slate-700 z-50">
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <UserIcon className="h-4 w-4 mr-3" />
                          Profile
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Cog6ToothIcon className="h-4 w-4 mr-3" />
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/auth/login"
                    className="text-slate-300 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg hover:shadow-xl"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-slate-400 hover:text-slate-300 hover:bg-slate-700 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
<<<<<<< HEAD
            <form onSubmit={handleSearch} className="relative">
=======
            <form onSubmit={handleSearch} className="relative w-full">
>>>>>>> 03806d4b54e00b624b51d1ea58aeb0b489a4de23
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
<<<<<<< HEAD
                onKeyDown={handleSearchKeyDown}
                placeholder="Search research..."
                className="w-full pl-10 pr-12 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400 transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-blue-400 transition-colors"
                title="Search"
              >
                <MagnifyingGlassIcon className="w-4 h-4" />
=======
                placeholder="Search research..."
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-600"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
>>>>>>> 03806d4b54e00b624b51d1ea58aeb0b489a4de23
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 w-full">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Auth */}
            <div className="pt-4 pb-3 border-t border-slate-700">
              {/* Mobile Theme Toggle */}
              <div className="px-3 py-2">
                <button
                  onClick={handleThemeToggle}
                  className="flex items-center w-full text-base font-medium text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-md px-3 py-2 transition-colors"
                >
                  {isDarkMode ? (
                    <>
                      <SunIcon className="h-5 w-5 mr-3" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <MoonIcon className="h-5 w-5 mr-3" />
                      Dark Mode
                    </>
                  )}
                </button>
              </div>
              
              {isAuthenticated ? (
                <div className="space-y-1">
                  <Link
                    href="/profile"
                    className="flex items-center px-3 py-2 text-base font-medium text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserIcon className="h-5 w-5 mr-3" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-md transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-3 py-2 text-base font-medium bg-blue-600 text-white hover:bg-blue-500 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />
    </>
  );
} 