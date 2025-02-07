"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, BookOpen, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import toast from "react-hot-toast";
import { ProfileCard } from "./ProfileCard";
import { ProfileInfoTab } from "./ProfileInfoTab";
import { BlogsTab } from "./BlogsTab";
import { SettingsTab } from "./SettingsTab";
import { BlogPostType, UserType } from "@/types/blogs-types";
import { ProfileFormData } from "./types";
import { saveEdit } from "@/action/my-profile-action";

interface UserProfileProps {
    userData: UserType;
    userBlogs: BlogPostType[];
}

export default function UserProfile({ userData, userBlogs }: UserProfileProps) {
    const { isDarkMode, toggleDarkMode } = useTheme();
    const { data: session, status } = useSession();
    const router = useRouter();
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [error, setError] = useState<string | null>(null);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditData((prevData) => prevData ? { ...prevData, [name]: value } : null);
    };

    const changePassword = async (oldPassword: string, newPassword: string) => {
        if (!session?.user?.email) throw new Error('Login again to change password');
        if (!oldPassword || !newPassword) throw new Error('Please enter old and new password');

        const response = await fetch(`/api/user/password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldPassword, newPassword }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to change password');
        return data.message;
    };

    const manageLinkedAccounts = () => {
        // Will be implemented in future
        console.log("Managing linked accounts");
    };

    const handleEditBlog = (blogId: string) => {
        router.push(`/edit/${blogId}`);
    };

    const handleViewBlog = (blogId: string) => {
        router.push(`/blogs/${blogId}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    {userData && (
                        <ProfileCard
                            userData={userData as UserType}
                            userBlogs={userBlogs}
                            setEditMode={setEditMode}
                        />
                    )}
                </div>
                <div className="md:col-span-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-3 mb-8">
                            <TabsTrigger value="profile" className="flex items-center justify-center">
                                <User className="w-4 h-4 mr-2" /> Profile
                            </TabsTrigger>
                            <TabsTrigger value="blogs" className="flex items-center justify-center">
                                <BookOpen className="w-4 h-4 mr-2" /> Blogs
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="flex items-center justify-center">
                                <Settings className="w-4 h-4 mr-2" /> Settings
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile">
                            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                            <ProfileInfoTab
                                userData={userData as UserType}
                                editMode={editMode}
                                setEditMode={setEditMode}
                            />
                        </TabsContent>

                        <TabsContent value="blogs">
                            <BlogsTab
                                userBlogs={userBlogs}
                                loading={loading}
                                handleEditBlog={handleEditBlog}
                                handleDeleteBlog={() => { }} // handleDeleteBlog
                                handleViewBlog={handleViewBlog}
                            />
                        </TabsContent>

                        <TabsContent value="settings">
                            <SettingsTab
                                changePassword={changePassword}
                                updateThemeSettings={toggleDarkMode}
                                manageLinkedAccounts={manageLinkedAccounts}
                                signOut={signOut}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
