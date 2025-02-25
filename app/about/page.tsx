import React from 'react';
import { Mail, Linkedin, Instagram } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-white to-blue-50">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Welcome to <span className="text-blue-600">TheFoodBlogger</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                TheFoodBlogger is a platform built for developers, by developers. Whether you're a beginner or an experienced coder, TheFoodBlogger helps you share insights, tutorials, and personal experiences with the developer community.
              </p>
            </div>
            <div className="lg:flex lg:justify-end">
              <img
                src="/logo.png"
                alt="TheFoodBlogger Logo"
                className="rounded-lg shadow-xl w-full h-64 lg:h-80 object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Our Mission</h2>
            <p className="mt-4 text-lg text-gray-600">
              We believe in open knowledge sharing. Our mission is to create a space where developers can learn, collaborate, and grow through meaningful blogs and discussions.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-4">📌</div>
              <h3 className="text-lg font-semibold mb-2 text-blue-600">Developer-Focused Content</h3>
              <p className="text-gray-600">Articles on programming, tech trends, and coding challenges.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold mb-2 text-blue-600">Interactive Dashboard</h3>
              <p className="text-gray-600">Track blog views, likes, and comments.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold mb-2 text-blue-600">Secure Auth System</h3>
              <p className="text-gray-600">NextAuth for authentication.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-4">📊</div>
              <h3 className="text-lg font-semibold mb-2 text-blue-600">Stats & Analytics</h3>
              <p className="text-gray-600">View insights on your blog's performance.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Target Audience Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center mb-12">
            Who is it for?
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <h3 className="text-lg font-semibold mb-2 text-blue-600">Beginners</h3>
              <p className="text-gray-600">Looking to learn and share their journey.</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <h3 className="text-lg font-semibold mb-2 text-blue-600">Experienced Devs</h3>
              <p className="text-gray-600">Wanting to document their expertise.</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <h3 className="text-lg font-semibold mb-2 text-blue-600">Tech Enthusiasts</h3>
              <p className="text-gray-600">Who love coding and writing.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
            Join Us Today! 🚀
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join TheFoodBlogger today and start sharing your knowledge with the world!
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
            Get Started
          </button>
        </div>
      </div>

      {/* Founder Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
                About the Founder
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">Rohit Kumar Yadav</h3>
                <p className="text-lg text-gray-600 mb-6">
                  A passionate full-stack developer with expertise in modern web technologies. With a strong foundation in React, Node.js, and cloud technologies, Rohit has dedicated himself to creating tools that help developers grow and succeed.
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  Beyond coding, he's an avid technical writer and mentor who believes in the power of sharing knowledge and building communities.
                </p>
                <div className="flex gap-4">
                  <a href="mailto:rohitkuyada@gmail.com" className="text-gray-600 hover:text-blue-600 transition-colors">
                    <Mail size={24} />
                  </a>
                  <a href="https://www.linkedin.com/in/rohitkumaryadav-rky/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
                    <Linkedin size={24} />
                  </a>
                  <a href="https://instagram.com/rohit.ayadav" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
                    <Instagram size={24} />
                  </a>
                </div>
              </div>
              <div className="order-1 md:order-2 flex justify-center">
                <img
                  src="/founder.jpg"
                  alt="Rohit Kumar Yadav"
                  className="rounded-full w-64 h-64 object-cover shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;