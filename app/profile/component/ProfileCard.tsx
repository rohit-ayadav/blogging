// ProfileCard.tsx
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserType } from './types';
import { Calendar, Instagram, Link } from 'lucide-react';
import { Facebook, GitHub, Linkedin, Twitter } from 'react-feather';
import { formatRelativeTime } from '@/utils/date-formatter';

interface ProfileCardProps {
    userData: UserType;
    setEditMode: (editMode: boolean) => void;
}

export const ProfileCard = ({ userData, setEditMode }: ProfileCardProps) => {
    const joinDate = formatRelativeTime(userData.createdAt);
    const length = 0;

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col items-center">
                    <Avatar className="w-32 h-32">
                        <AvatarImage
                            src={userData?.image ?? '/default-profile.jpg'}
                            alt={userData?.name ?? 'User'}
                        />
                        <AvatarFallback>
                            {userData?.name?.split(' ').map(n => n[0]).join('') ?? 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <CardTitle className="mt-4 text-2xl font-bold">{userData?.name}</CardTitle>
                    <CardDescription className="text-center">@{userData?.username}</CardDescription>

                    {userData?.bio && (
                        <p className="mt-2 text-center text-sm text-gray-600 max-w-md">
                            {userData.bio}
                        </p>
                    )}

                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {joinDate}</span>
                    </div>

                    {userData?.website && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                            <Link className="w-4 h-4" />
                            <a
                                href={userData.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                {userData.website}
                            </a>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 rounded-lg bg-gray-50">
                        <p className="text-2xl font-bold">{userData?.follower ?? 0}</p>
                        <p className="text-sm text-gray-500">Followers</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50">
                        <p className="text-2xl font-bold">{userData?.following ?? 0}</p>
                        <p className="text-sm text-gray-500">Following</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50">
                        <p className="text-2xl font-bold">{length}</p>
                        <p className="text-sm text-gray-500">Blogs</p>
                    </div>
                </div>
                <div>
                    {/* User Social Links */}
                    {userData?.socialLinks && (
                        <div className="mt-4 flex items-center gap-4">
                            {userData.socialLinks.linkedin && (
                                <a
                                    href={userData.socialLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            )}
                            {userData.socialLinks.github && (
                                <a
                                    href={userData.socialLinks.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    <GitHub className="w-5 h-5" />
                                </a>
                            )}
                            {userData.socialLinks.twitter && (
                                <a
                                    href={userData.socialLinks.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    <Twitter className="w-5 h-5" />
                                </a>
                            )}
                            {userData.socialLinks.instagram && (
                                <a
                                    href={userData.socialLinks.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                            {userData.socialLinks.facebook && (
                                <a
                                    href={userData.socialLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    <Facebook className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter>
                <Button
                    className="w-full"
                    onClick={() => setEditMode(true)}
                >
                    Edit Profile
                </Button>
            </CardFooter>
        </Card>
    );
};