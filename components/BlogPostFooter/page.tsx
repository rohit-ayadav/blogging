import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Eye, Share2 } from 'lucide-react';
import { HeartFilledIcon } from '@radix-ui/react-icons';
import { SiWhatsapp, SiFacebook, SiX, SiLinkedin } from 'react-icons/si';
import { toast } from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { BlogPostType } from '@/types/blogs-types';
import { dislikePost, likePost } from '@/action/like';
import { useTheme } from '@/context/ThemeContext';

interface BlogPostFooterProps {
  post: BlogPostType;
  likes: number;
  views: number;
  id: string;
  className?: string;
}

interface ShareOption {
  name: string;
  icon: React.ReactNode;
  color: string;
  getShareUrl: (url: string, title: string) => string;
}

const BlogPostFooter = ({
  post,
  likes: initialLikes,
  views,
  id,
  className
}: BlogPostFooterProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const { isDarkMode } = useTheme();

  useEffect(() => {
    setShareUrl(window.location.href);
    setLikes(post?.likes ?? initialLikes);
  }, [post?.likes, initialLikes]);

  const shareOptions: ShareOption[] = [
    {
      name: 'WhatsApp',
      icon: <SiWhatsapp className="h-4 w-4" />,
      color: 'hover:text-green-500',
      getShareUrl: (url, title) =>
        `https://wa.me/?text=${encodeURIComponent(`📖 ${title}\n\n👉 ${url}`)}`,
    },
    {
      name: 'Facebook',
      icon: <SiFacebook className="h-4 w-4" />,
      color: 'hover:text-blue-600',
      getShareUrl: (url) =>
        `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    },
    {
      name: 'Twitter',
      icon: <SiX className="h-4 w-4" />,
      color: 'hover:text-gray-800',
      getShareUrl: (url, title) =>
        `https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(title)}`,
    },
    {
      name: 'LinkedIn',
      icon: <SiLinkedin className="h-4 w-4" />,
      color: 'hover:text-blue-700',
      getShareUrl: (url, title) =>
        `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodeURIComponent(title)}`,
    },
  ];

  const handleLike = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (isLoading) return;
    let response;

    setIsLoading(true);
    const newLikesCount = isLiked ? likes - 1 : likes + 1;

    setLikes(newLikesCount);
    setIsLiked(!isLiked);

    if (!isLiked) {
      response = likePost(id);
    } else {
      response = dislikePost(id);
    }
    if (!response) {
      setLikes(newLikesCount);
      setIsLiked(!isLiked);
    }
    setIsLoading(false);
  };

  const handleShare = (option: ShareOption) => {
    try {
      window.open(option.getShareUrl(shareUrl, post.title), '_blank');
    } catch (error) {
      toast.error(`Failed to share on ${option.name}`);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t",
        isDarkMode ? "border-gray-700" : "border-gray-200",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLoading}
                className={cn(
                  "transition-all",
                  isLiked
                    ? "text-red-500 hover:text-red-600"
                    : isDarkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-600 hover:text-gray-800"
                )}
              >
                {isLiked ? (
                  <HeartFilledIcon className="h-5 w-5 mr-2" />
                ) : (
                  <Heart className="h-5 w-5 mr-2" />
                )}
                <span
                  className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  {likes}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isLiked ? 'Unlike' : 'Like'} this post</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`
                  ${isDarkMode
                    ? "text-gray-300 hover:text-gray-100"
                    : "text-gray-600 hover:text-gray-800"
                  }
                `}
              >
                <Eye className="h-5 w-5 mr-2" />
                <span
                  className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  {views}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Total views</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`text-sm ${isDarkMode ? "text-gray-400" : "text-muted-foreground"
            } mr-2`}
        >
          Share:
        </span>
        <div className="flex items-center gap-1">
          {shareOptions.map((option) => (
            <TooltipProvider key={option.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(option)}
                    className={cn(
                      "transition-colors",
                      option.color,
                      isDarkMode
                        ? "text-gray-300 hover:text-gray-100"
                        : "text-gray-600 hover:text-gray-800"
                    )}
                  >
                    {option.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share on {option.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={
                  isDarkMode
                    ? "text-gray-300 hover:text-gray-100"
                    : "text-gray-600 hover:text-gray-800"
                }
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={copyToClipboard}>
                Copy link
              </DropdownMenuItem>
              {shareOptions.map((option) => (
                <DropdownMenuItem
                  key={option.name}
                  onClick={() => handleShare(option)}
                >
                  <span className={cn("mr-2", option.color)}>{option.icon}</span>
                  Share on {option.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default BlogPostFooter;