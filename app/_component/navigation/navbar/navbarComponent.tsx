"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Menu, X, Code, Terminal, Settings, Edit3, Layout, Users, User, Search, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
// import SearchHeader as client component
const SearchHeader = React.lazy(() => import('@/app/search/SearchHeader'));

const NavLink = ({ href, children, icon: Icon, setIsMobileMenuOpen }: any) => (
  <Link
    href={href}
    onClick={() => setIsMobileMenuOpen?.(false)}
    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 
    hover:bg-indigo-500/10 text-gray-700 dark:text-gray-200 hover:text-indigo-600 
    dark:hover:text-indigo-400 group relative overflow-hidden"
  >
    {Icon && (
      <Icon
        size={18}
        className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 
        transition-colors duration-200"
      />
    )}
    <span className="text-sm font-medium">{children}</span>
  </Link>
);

const TheFoodBloggerNavbar = () => {
  const { data: session } = useSession();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: Layout },
    { href: '/blogs', label: 'DevPosts', icon: Terminal },
    { href: '/create', label: 'Write', icon: Edit3 },
    { href: '/dashboard', label: 'Dashboard', icon: Code },
    { href: '/contacts', label: 'Community', icon: Users },
  ];

  const profileLinks = [
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/profile#settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className={`w-full top-0 z-50 transition-all duration-300
      ${isScrolled
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg'
        : 'bg-white dark:bg-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 shrink-0"
            onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 
              flex items-center justify-center shadow-lg">
              <Code size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white ">
              TheFoodBlogger
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center max-w-2xl mx-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 
                transition-colors duration-200"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 
              transition-colors duration-200 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full"></span>
            </button>

            {session?.user ? (
              <div className="relative flex items-center">
                <Link href="/profile">
                  <button className="flex items-center space-x-3 px-4 py-2 rounded-lg
                  bg-gradient-to-r from-indigo-500 to-purple-600 text-white
                  hover:from-indigo-600 hover:to-purple-700 transition-all duration-300
                  shadow-md hover:shadow-lg">
                    <img
                      src={session.user.image || "/api/placeholder/32/32"}
                      alt="Profile"
                      className="w-6 h-6 rounded-full border-2 border-white/50"
                    />
                    <span className="font-medium">{session.user.name}</span>
                  </button>
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 
                  text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300
                  shadow-md hover:shadow-lg font-medium flex items-center gap-2"
              >
                <Terminal size={18} />
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-200
              hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out 
        ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="container mx-auto px-4 py-4 space-y-4 border-t 
          border-gray-200 dark:border-gray-800">
          {/* Search Bar - Mobile */}
          <div className="relative">
            <SearchHeader />
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Profile Section */}
          {session?.user ? (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-3 px-3 py-2">
                <img
                  src={session.user.image || "/api/placeholder/32/32"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-indigo-500"
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {session.user.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {session.user.email}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {profileLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    icon={link.icon}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
              <button
                onClick={() => window.location.href = '/signout'}
                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 
                  text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 
                  rounded-lg transition-colors duration-200"
              >
                <Terminal size={18} />
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg 
                bg-gradient-to-r from-indigo-500 to-purple-600 text-white
                hover:from-indigo-600 hover:to-purple-700 transition-all duration-300
                shadow-md hover:shadow-lg font-medium"
            >
              <Terminal size={18} />
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default function Navbar() {
  return (
    // <Suspense fallback={<div>Loading...</div>}>
    <TheFoodBloggerNavbar />
    // {/* </Suspense> */}
  )
}
