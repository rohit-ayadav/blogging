"use client";
import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Mail, Plus, Twitter, X, ArrowUp, Github, Linkedin, InstagramIcon } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const currentYear = new Date().getFullYear();
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!validateEmail(email)) {
        throw new Error("Please enter a valid email address");
      }

      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to subscribe. Please try again later.");
      }

      toast({
        title: "Success!",
        description: "Successfully subscribed to newsletter! 🎉",
        duration: 5000,
      });

      setEmail("");

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <footer className={`${isDarkMode
        ? 'bg-gradient-to-b from-gray-900 to-black text-gray-200'
        : 'bg-gradient-to-b from-gray-800 to-gray-900 text-white'
        } pt-12 pb-6 relative`}
        role="contentinfo"
        aria-label="Site Footer"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                TheFoodBlogger
              </h3>
              <p className="text-sm leading-relaxed opacity-85">
                Empowering developers to share knowledge, experiences, and insights with the global tech community.
              </p>
              <div className="flex space-x-4 pt-4">
                <a
                  href="https://github.com/rohit-ayadav"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors duration-200"
                  aria-label="GitHub Profile"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/rohitkumaryadav-rky/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors duration-200"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin size={20} />
                </a>
                {/* <a
                  href="https://twitter.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors duration-200"
                  aria-label="Twitter Profile"
                >
                  <Twitter size={20} />
                </a> */}
                {/* Instagram */}
                <a
                  href='https://www.instagram.com/rohit.ayadav/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-blue-400 transition-colors duration-200'
                  aria-label='Instagram Profile'
                >
                  <InstagramIcon size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Quick Links</h4>
              <nav>
                <ul className="space-y-2">
                  {[
                    ['Home', '/'],
                    ['About', '/about'],
                    ['Blogs', '/blogs'],
                    ['Write', '/create'],
                    ['Contact', '/contacts'],
                  ].map(([title, url]) => (
                    <li key={title}>
                      <Link
                        href={url}
                        className="text-sm hover:text-blue-400 transition-colors duration-200 block py-1"
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Resources</h4>
              <nav>
                <ul className="space-y-2">
                  {[
                    // ['Documentation', '/docs'],
                    // ['API Reference', '/api'],
                    ['Dashboard', '/dashboard'],
                    ['Privacy Policy', '/privacy'],
                    ['Terms of Service', '/tos'],
                    ['Sitemap', '/sitemap.xml'],
                  ].map(([title, url]) => (
                    <li key={title}>
                      <Link
                        href={url}
                        className="text-sm hover:text-blue-400 transition-colors duration-200 block py-1"
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Newsletter Section */}
            <div>
              <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Stay Updated</h4>
              <p className="text-sm mb-4 opacity-85">
                Subscribe to our newsletter for the latest updates and articles.
              </p>
              <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500 text-sm"
                  aria-label="Email subscription"
                />
                <button
                  type="submit"
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-6 mt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm opacity-85">
                &copy; {currentYear} TheFoodBlogger. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link href="/privacy" className="text-sm hover:text-blue-400 transition-colors duration-200">
                  Privacy
                </Link>
                <Link href="/tos" className="text-sm hover:text-blue-400 transition-colors duration-200">
                  Terms
                </Link>
                <Link href="/cookies" className="text-sm hover:text-blue-400 transition-colors duration-200">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } text-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out z-50`}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        {/* Create Post Modal */}
        {!showScrollTop && (
          <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <AlertDialogTrigger asChild>
              <button
                className={`fixed bottom-6 right-6 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
                  } text-white p-3 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 ease-in-out z-50 group`}
                aria-label="Create new content"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent
              className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                } p-8 rounded-xl shadow-2xl max-w-md mx-auto transform transition-all duration-300`}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Create Content
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Choose your content type</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close dialog"
                  className="hover:rotate-90 transition-transform duration-300"
                >
                  <X size={20} />
                </Button>
              </div>

              <div className="space-y-4">
                <Link href="/create" className="block">
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    className={`w-full h-14 relative overflow-hidden group ${isDarkMode
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                      } transition-all duration-300`}
                  >
                    <div className="flex items-center space-x-3">
                      <Plus className="w-5 h-5" />
                      <div className="text-left">
                        <span className="block font-semibold">Create New Post</span>
                        <span className="text-xs opacity-90">Write a detailed blog post</span>
                      </div>
                    </div>
                  </Button>
                </Link>

                <Link href="/create?type=quick-note" className="block">
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    className={`w-full h-14 relative group ${isDarkMode
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800'
                      : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700'
                      } transition-all duration-300`}
                  >
                    <div className="flex items-center space-x-3">
                      <Plus className="w-5 h-5" />
                      <div className="text-left">
                        <span className="block font-semibold">Quick Note</span>
                        <span className="text-xs opacity-90">Share a quick thought or tip</span>
                      </div>
                    </div>
                  </Button>
                </Link>

                <Link href="/dashboard/admin" className="block">
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    variant="outline"
                    className={`w-full h-14 relative group ${isDarkMode
                      ? 'border-gray-600 hover:bg-gray-700 hover:border-gray-500'
                      : 'border-gray-300 hover:bg-gray-50'
                      } transition-all duration-300`}
                  >
                    <div className="flex items-center space-x-3">
                      <Plus className="w-5 h-5" />
                      <div className="text-left">
                        <span className="block font-semibold">Admin Dashboard</span>
                        <span className="text-xs opacity-90">Manage your content</span>
                      </div>
                    </div>
                  </Button>
                </Link>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </footer>
    </>
  );
};

export default Footer;