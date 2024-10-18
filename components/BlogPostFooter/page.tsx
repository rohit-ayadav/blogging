import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FaHeart } from "react-icons/fa";

interface Post {
  _id: string;
  title: string;
  thumbnail?: string;
  createdAt: string;
  content: string;
  tags: string[];
  createdBy: string;
  likes: number;
  bio?: string;
}

import { Heart, Eye } from 'lucide-react';
import { HeartFilledIcon } from '@radix-ui/react-icons';
import { SiWhatsapp, SiFacebook, SiX, SiLinkedin } from 'react-icons/si';
import { RiHeart3Fill } from 'react-icons/ri';
import { set } from 'mongoose';

interface BlogPostFooterProps {
  post: Post;
  likes: number;
  views: number;
  liked: boolean;
  id: string;
}

const BlogPostFooter = ({ post, likes, views, liked, id }: BlogPostFooterProps) => {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [no_of_likes, setNoOfLikes] = React.useState(0);
  const [isLiked, setIsLiked] = React.useState(false);

  useEffect(() => {
    setNoOfLikes(post.likes);
    console.log(`Likes and setNoOfLikes: ${post.likes} ${no_of_likes}`);
  }, []);

  const handleLike = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (isLiked) {
      setNoOfLikes(no_of_likes - 1);
      setIsLiked(!isLiked);
      try {
        const response = await fetch(`/api/blog/${id}/dislike`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          setNoOfLikes(no_of_likes + 1);
          setIsLiked(!isLiked);
          throw new Error(`${response.status} - ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      setNoOfLikes(no_of_likes + 1);
      setIsLiked(!isLiked);
      try {
        const response = await fetch(`/api/blog/${id}/like`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          setNoOfLikes(no_of_likes - 1);
          setIsLiked(!isLiked);
          throw new Error(`${response.status} - ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error:", error);
      }
      setIsLiked(!isLiked);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center m-8 mt-10">
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={handleLike}>
          {isLiked ? <HeartFilledIcon color='red' className="h-4 w-4 mr-2" /> : <Heart className="h-4 w-4 mr-2" />}
          Like ({no_of_likes})
        </Button>
        <Button variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          View ({views})
        </Button>
      </div>
      <div className="flex items-center space-x-2 mt-4 md:mt-0">
        <span>Share:</span>
        <Button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent("Check out this amazing post: " + post.title + " " + shareUrl)}`, '_blank')} variant="outline">
          <SiWhatsapp className="h-4 w-4" />
        </Button>
        <Button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank')} variant="outline">
          <SiFacebook className="h-4 w-4" />
        </Button>
        <Button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(post.title)}`, '_blank')} variant="outline">
          <SiX className="h-4 w-4" />
        </Button>
        <Button onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${encodeURIComponent(post.title)}`, '_blank')} variant="outline">
          <SiLinkedin size={16} />
        </Button>
      </div>
    </div>
  );
};

export default BlogPostFooter;
