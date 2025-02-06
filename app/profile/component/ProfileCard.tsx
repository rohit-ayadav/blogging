// ProfileCard.tsx
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BlogPostType, UserType } from '@/types/blogs-types';

interface ProfileCardProps {
    userData: UserType;
    userBlogs: BlogPostType[];
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ProfileCard = ({ userData, userBlogs, setEditMode }: ProfileCardProps) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col items-center">
                    <Avatar className="w-32 h-32">
                        <AvatarImage src={userData?.image ?? '/default-profile.jpg'} alt={userData?.name ?? 'User'} />
                        <AvatarFallback>{userData?.name?.charAt(0) ?? 'U'}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="mt-4 text-2xl font-bold">{userData?.name ?? 'User'}</CardTitle>
                    <CardDescription>{userData?.email ?? 'username'}</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-center text-gray-600">{userData?.bio ?? "Bio not available"}</p>
                <div className="mt-4 flex justify-center space-x-4">
                    <div className="text-center">
                        <p className="font-bold">{userData?.follower ?? 10}</p>
                        <p className="text-sm text-gray-500">Followers</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold">{userData?.following ?? 5}</p>
                        <p className="text-sm text-gray-500">Following</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold">{userBlogs.length}</p>
                        <p className="text-sm text-gray-500">Blogs</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={() => setEditMode(true)}>Edit Profile</Button>
            </CardFooter>
        </Card>
    );
};
