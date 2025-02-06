"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, BookOpen, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import toast from "react-hot-toast";

import { ProfileCard } from "./component/ProfileCard";
import { ProfileInfoTab } from "./component/ProfileInfoTab";
import { BlogsTab } from "./component/BlogsTab";
import { SettingsTab } from "./component/SettingsTab";
import { BlogPostType, UserType } from "@/types/blogs-types";

export default function UserProfile() {
    const { isDarkMode, toggleDarkMode } = useTheme();
    const { data: session, status } = useSession();
    const router = useRouter();

    const [userData, setUserData] = useState<UserType | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(false);
    const [userBlogs, setUserBlogs] = useState<BlogPostType[]>([]);
    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        const fetchData = async () => {
            if (session?.user) {
                const response = await fetch(`/api/user?email=${session.user.email}`);
                const data = await response.json();
                setUserData(data.user);
                setEditData(data.user);
            }
        };
        fetchData();
    }, [session, status]);

    const fetchBlogs = async () => {
        if (session?.user) {
            const response = await fetch(`/api/blogpost?email=${session.user.email}`);
            const data = await response.json();
            setUserBlogs(data.blogs.map((blog: BlogPostType) => ({
                id: blog._id,
                title: blog.title,
                content: blog.content.replace(/<[^>]*>/g, '').slice(0, 100)?.trim() + (blog.content.length > 100 ? '...' : ''),
                thumbnail: blog.thumbnail,
                likes: blog.likes,
                views: blog.views,
            })));
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [session]);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditData((prevData) => prevData ? { ...prevData, [name]: value } : null);
    };

    const handleSaveProfile = async () => {
        toast.promise(saveProfile(), {
            loading: 'Saving profile...',
            success: 'Profile saved successfully',
            error: 'Failed to save profile',
        });
    };

    const saveProfile = async () => {
        if (editData) {
            const response = await fetch(`/api/user`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData),
            });
            if (response.ok) {
                setUserData(editData);
                setEditMode(false);
            }
        }
    };

    const changePassword = async (oldPassword: string, newPassword: string) => {
        if (!session?.user?.email) throw new Error('Login again to change password');
        if (!oldPassword || !newPassword) throw new Error('Please enter old and new password');

        const response = await fetch(`/api/user/password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldPassword, newPassword, email: session?.user?.email }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to change password');
        return data.message;
    };

    const manageLinkedAccounts = () => {
        // Implement the function logic here
        console.log("Managing linked accounts");
    };

    const updateThemeSettings = async (theme: { darkMode: boolean }) => {
        const response = await fetch("/api/theme", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ theme: theme.darkMode ? "dark" : "light" }),
        });
        if (response.ok) {
            toggleDarkMode();
        }
    };

    const handleEditBlog = (blogId: string) => {
        router.push(`/edit/${blogId}`);
    };

    const handleDeleteBlog = async (blogId: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/blog/?id=${blogId}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok) {
                toast.error(data.message || 'Failed to delete blog');
                return;
            }
            toast.success(data.message || 'Blog deleted successfully');
            fetchBlogs();
        } catch (error) {
            console.error('Failed to delete blog:', error);
        } finally {
            setLoading(false);
        }
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
                            userData={userData}
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
                            <ProfileInfoTab
                                editMode={editMode}
                                editData={editData}
                                handleEditChange={handleEditChange}
                                handleSaveProfile={handleSaveProfile}
                                setEditMode={setEditMode}
                            />
                        </TabsContent>

                        <TabsContent value="blogs">
                            <BlogsTab
                                userBlogs={userBlogs}
                                loading={loading}
                                handleEditBlog={handleEditBlog}
                                handleDeleteBlog={handleDeleteBlog}
                                handleViewBlog={handleViewBlog}
                            />
                        </TabsContent>

                        <TabsContent value="settings">
                            <SettingsTab
                                changePassword={changePassword}
                                updateThemeSettings={updateThemeSettings}
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
