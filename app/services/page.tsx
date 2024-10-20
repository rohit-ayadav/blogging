import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Video, Headphones, Users, Mail, TrendingUp } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  ctaText: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, features, ctaText }) => (
  
  <Card className="flex flex-col h-full">
    <CardHeader>
      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Badge variant="secondary" className="mr-2">
              ✓
            </Badge>
            {feature}
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Button className="w-full">{ctaText}</Button>
    </CardFooter>
  </Card>
);

const ServicesPage = () => {
  const services = [
    {
      icon: <BookOpen className="text-white" size={24} />,
      title: "In-depth Articles",
      description: "Dive deep into a wide range of topics with our comprehensive articles.",
      features: ["Well-researched content", "Expert insights", "Regular updates"],
      ctaText: "Start Reading"
    },
    {
      icon: <Video className="text-white" size={24} />,
      title: "Video Tutorials",
      description: "Learn visually with our easy-to-follow video tutorials on various subjects.",
      features: ["Step-by-step guides", "High-quality production", "Downloadable resources"],
      ctaText: "Watch Now"
    },
    {
      icon: <Headphones className="text-white" size={24} />,
      title: "Podcast Series",
      description: "Listen to engaging discussions and interviews with industry experts.",
      features: ["Weekly episodes", "Diverse topics", "Guest speakers"],
      ctaText: "Subscribe"
    },
    {
      icon: <Users className="text-white" size={24} />,
      title: "Community Forums",
      description: "Join our vibrant community to discuss, share, and learn from peers.",
      features: ["Moderated discussions", "Networking opportunities", "Knowledge sharing"],
      ctaText: "Join Community"
    },
    {
      icon: <Mail className="text-white" size={24} />,
      title: "Newsletter",
      description: "Stay updated with our curated content delivered straight to your inbox.",
      features: ["Weekly digest", "Exclusive content", "Early access to new features"],
      ctaText: "Sign Up"
    },
    {
      icon: <TrendingUp className="text-white" size={24} />,
      title: "Trend Analysis",
      description: "Get ahead with our insightful analysis of industry trends and forecasts.",
      features: ["Data-driven insights", "Expert commentary", "Quarterly reports"],
      ctaText: "Explore Trends"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Services</h1>
      <p className="text-xl mb-8">
        Discover the wide range of services we offer to keep you informed, educated, and engaged.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;