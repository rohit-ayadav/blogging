"use client";
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Book, Users, Award, Newspaper } from 'lucide-react';
import CountUp from 'react-countup';

const AboutPage = () => {
  const blogStats = [
    { icon: <Book size={24} />, label: 'Articles Published', value: '500+' },
    { icon: <Users size={24} />, label: 'Monthly Readers', value: '100,000+' },
    { icon: <Award size={24} />, label: 'Industry Awards', value: '5' },
    { icon: <Newspaper size={24} />, label: 'Years Active', value: '10' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">About Our Blog</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">Our Story</h2>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Welcome to our blog! We started this journey in 2014 with a simple mission: to provide insightful, 
              engaging, and valuable content to our readers. Over the years, we've grown from a small personal 
              blog to a trusted source of information in our field.
            </p>
            <p>
              Our team of experienced writers and industry experts work tirelessly to bring you the latest news, 
              in-depth analyses, and practical advice. We're passionate about our subjects and committed to 
              delivering high-quality content that informs, inspires, and empowers our readers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">Meet the Founder</h2>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <Avatar className="h-20 w-20 mr-4">
                <AvatarImage src="/founder.jpg" alt="Rohit Kumar Yadav" />
                <AvatarFallback>RY</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">Rohit Kumar Yadav</h3>
                <p className="text-gray-500">Founder & Chief Editor</p>
              </div>
            </div>
            <p>
              Rohit Kumar Yadav is a veteran journalist with over 15 years of experience in digital media. He founded 
              this blog with the vision of creating a platform that bridges the gap between complex industry 
              topics and everyday readers. His work has been recognized with numerous awards, and he's a 
              frequent speaker at industry conferences.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Our Impact</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {blogStats.map((stat, index) => (
                <div key={index} className="text-center">
                <div className="mb-2 flex justify-center">{stat.icon}</div>
                <div className="text-2xl font-bold">
                  <CountUp end={parseInt(stat.value.replace(/\D/g, ''))} duration={3} />
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Our Expertise</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge>Technology</Badge>
            <Badge>Business</Badge>
            <Badge>Science</Badge>
            <Badge>Culture</Badge>
            <Badge>Lifestyle</Badge>
            <Badge>Health & Wellness</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;