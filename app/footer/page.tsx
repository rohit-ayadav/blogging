import React from 'react';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">My Blog</h3>
            <p className="text-sm">Sharing thoughts and ideas since 2024</p>
          </div>
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
            <ul className="text-sm">
              <li><a href="/" className="hover:text-gray-300">Home</a></li>
              <li><a href="/about" className="hover:text-gray-300">About</a></li>
              <li><a href="/contact" className="hover:text-gray-300">Contact</a></li>
              <li><a href="/privacy" className="hover:text-gray-300">Privacy Policy</a></li>
              <li><a href="/tos" className="hover:text-gray-300">Terms of Service</a></li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-semibold mb-2">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="https://whatsapp.com/channel/0029VaVd6px8KMqnZk7qGJ2t" className="hover:text-gray-300"><Facebook size={24} /></a>
              <a href="https://whatsapp.com/channel/0029VaVd6px8KMqnZk7qGJ2t" className="hover:text-gray-300"><Twitter size={24} /></a>
              <a href="https://whatsapp.com/channel/0029VaVd6px8KMqnZk7qGJ2t" className="hover:text-gray-300"><Instagram size={24} /></a>
              <a href="https://whatsapp.com/channel/0029VaVd6px8KMqnZk7qGJ2t" className="hover:text-gray-300"><Mail size={24} /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          <p>&copy; {currentYear} DevBloggers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;