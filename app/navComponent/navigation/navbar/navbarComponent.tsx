"use client";
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import Logo from './Logo';
import UserMenu from './User';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  setIsMobileMenuOpen?: (isOpen: boolean) => void;
}

const NavLink = ({ href, children, setIsMobileMenuOpen }: NavLinkProps) => (
  <Link
    onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
    href={href}
    className="text-white hover:text-emerald-200 transition-colors duration-200"
  >
    {children}
  </Link>
);

function NavbarComponent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/services', label: 'Services' },
    { href: '/contacts', label: 'Contacts' },
    { href: '/blogs', label: 'Blog' },
    { href: '/profile', label: 'Profile' },
    { href: '/profile#settings', label: 'Settings' },
    { href: `${session ? '/signout' : '/login'}`, label: `${session ? 'Sign Out' : 'Login'}`, onClick: session ? () => signOut() : undefined },
  ];

  return (
    <nav className="bg-emerald-800 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-6">
              {navLinks.slice(0, 3).map(({ href, label }) => (
                <li key={href}>
                  <NavLink href={href} setIsMobileMenuOpen={setIsMobileMenuOpen}>{label}</NavLink>
                </li>
              ))}
            </ul>

            {session?.user ? (
              <UserMenu
                user={session.user}
                onSignOut={() => signOut()}
              />
            ) : (
              <Link
                onClick={() => setIsMobileMenuOpen(false)}
                href="/login"
                className="bg-white text-emerald-800 px-4 py-2 rounded-md hover:bg-emerald-50 transition-colors duration-200"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <ul className="flex flex-col space-y-4">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <NavLink href={href} setIsMobileMenuOpen={setIsMobileMenuOpen}>{label}</NavLink>
                </li>
              ))}
            </ul>
            {session?.user ? (
              <div className="mt-4">
                <UserMenu
                  user={session.user}
                  onSignOut={() => signOut()}
                />
              </div>
            ) : (
              <Link
                onClick={() => setIsMobileMenuOpen(false)}
                href="/login"
                className="block mt-4 bg-white text-emerald-800 px-4 py-2 rounded-md text-center"
              >
                Get Started
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavbarComponent;