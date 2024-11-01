"use client";
import React, { useState } from 'react';
import { Facebook, Instagram, Mail, Plus, Twitter, X } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { set } from 'mongoose';

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const router = useRouter();

  const handleCreatePost = () => {
    router.push('/create');
    setIsModalOpen(false);
  };

  return (
    <>
      <footer className={`${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-800 text-white'} py-8 relative`}>
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
                <li><a href="/contacts" className="hover:text-gray-300">Contact</a></li>
                <li><a href="/privacy" className="hover:text-gray-300">Privacy Policy</a></li>
                <li><a href='/tos' className='hover:text-gray-300'>Terms of Service</a></li>
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
        </div>
        <div className="mt-8 text-center text-sm">
          <p>&copy; {currentYear} My Blog. All rights reserved.</p>
        </div>
      </footer>
      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogTrigger asChild>
          <button className={`fixed bottom-4 right-4 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white p-3 rounded-full shadow-lg transition-colors`}>
            <Plus size={24} />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-xl`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Create Options</h3>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              <X size={24} />
            </Button>
          </div>
          <div className="space-y-4">
            <Button onClick={handleCreatePost} className={`w-full ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}>
              Create New Post
            </Button>
            <Button onClick={handleCreatePost} variant="outline" className={`w-full ${isDarkMode ? 'text-white border-white hover:bg-gray-700' : 'text-blue-500 border-blue-500 hover:bg-blue-50'}`}>
              Draft Quick Note
            </Button>
            <Button onClick={() => {
              router.push('/dashboard/admin');
              setIsModalOpen(false);
            }} variant="outline" className={`w-full ${isDarkMode ? 'text-white border-white hover:bg-gray-700' : 'text-blue-500 border-blue-500 hover:bg-blue-50'}`}>
              Open Admin Dashboard
            </Button>

          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Footer;