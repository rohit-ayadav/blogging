"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Edit2, Trash2, Eye, Settings, User, BookOpen, ThumbsUp, ImageIcon } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

export default function UserProfile() {
    const { isDarkMode, toggleDarkMode } = useTheme();
    const { data: session } = useSession();
    const router = useRouter();
    interface UserData {
        name: string;
        username: string;
        image: string;
        bio: string;
        followers: number;
        following: number;
        email: string;
    }

    const [userData, setUserData] = useState<UserData | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(false);

    interface Blog {
        _id: any;
        id: string;
        title: string;
        content: string;
        likes: number;
        views: number;
        thumbnail: string;
    }

    const [userBlogs, setUserBlogs] = useState<Blog[]>(() => []);
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
    }, [session]);



    const fetchBlogs = async () => {
        if (session?.user) {
            const response = await fetch(`/api/blogpost?email=${session.user.email}`);
            const data = await response.json();

            setUserBlogs(data.blogs.map((blog: Blog) => ({
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
    }

    const saveProfile = async () => {
        if (editData) {

            const response = await fetch(`/api/user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editData),
            });

            if (response.ok) {
                setUserData(editData);
                setEditMode(false);
            } else {
                console.error('Failed to update profile');
            }
        }
    };
    const changePassword = (oldPassword: string, newPassword: string) => {
        try {
            toast.promise(changePasswordRequest(oldPassword, newPassword), {
                loading: 'Changing password...',
                success: 'Password changed successfully',
                error: (error: any) => <div>{error.message}</div>,
            });
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    const changePasswordRequest = async (oldPassword: string, newPassword: string) => {
        if (!session?.user?.email) {
            throw new Error('Login again to change password');
        }
        if (!oldPassword || !newPassword) {
            throw new Error('Please enter old and new password');
        }

        const response = await fetch(`/api/user/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ oldPassword, newPassword, email: session?.user?.email }),
        });
        let data;
        try {
            data = await response.json();
        } catch (error) {
            throw new Error('Failed to parse JSON response');
        }
        if (!response.ok) {
            throw new Error(data.message || 'Failed to change password');
        } else {
            return data.message;
        }
    };

    const manageLinkedAccounts = (action: string, accountType: string) => {
        console.log("Managing linked account:", action, accountType);
    };

    const updateNotificationPreferences = (preferences: { email?: boolean; push?: boolean }) => {
        console.log("Updating notification preferences:", preferences);
    };

    const updatePrivacySettings = (settings: { publicProfile?: boolean; showEmail?: boolean }) => {
        console.log("Updating privacy settings:", settings);
    };

    const updateThemeSettings = async (theme: { darkMode: boolean }) => {
        try {
            const response = await fetch("/api/theme", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ theme: theme.darkMode ? "dark" : "light" }),
            });
            if (response.ok) {
                toggleDarkMode();
                const data = await response.json();

            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteAccountRequest = async () => {
        const email = session?.user?.email;
        const response = await fetch(`/api/user?email=${email}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to delete account');
        }
    };

    const deleteAllBlogsRequest = async () => {
        const response = await fetch(`/api/blogpost?email=${session?.user?.email}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const data = await response.json();
            console.error('Failed to delete blogs:', data.message);
            throw new Error(data.message || 'Failed to delete blogs');
        }
    };

    const deleteAccount = async () => {
        console.log("Deleting account");


        try {
            await toast.promise(deleteAllBlogsRequest(), {
                loading: 'Deleting blogs...',
                success: 'Blogs deleted successfully',
                error: 'Failed to delete blogs',
            });
        } catch (error) {
            if (error instanceof Error) {
                console.error('Blog deletion failed:', error.message);
            } else {
                console.error('Blog deletion failed:', error);
            }
            toast.error('Cannot delete account until all blogs are deleted.');
            return;
        }


        try {
            await toast.promise(deleteAccountRequest(), {
                loading: 'Deleting account...',
                success: 'Account deleted successfully',
                error: 'Failed to delete account',
            });
            await signOut();
            router.push('/');
        } catch (error) {
            if (error instanceof Error) {
                console.error('Account deletion failed:', error.message);
            } else {
                console.error('Account deletion failed:', error);
            }
            toast.error('Failed to delete account.');
        }
    };

    const handleEditBlog = (blogId: string) => {
        router.push(`/edit/${blogId}`);
    };

    const handleDeleteBlog = async (blogId: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/blog/?id=${blogId}`, {
                method: 'DELETE',
            });
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
        <Link href={`/blogs/${blogId}`} />;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
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
                                    <p className="font-bold">{userData?.followers ?? 10}</p>
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
                </div>
                <div className="md:col-span-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-3 mb-8">
                            <TabsTrigger value="profile" className="flex items-center justify-center"><User className="w-4 h-4 mr-2" /> Profile</TabsTrigger>
                            <TabsTrigger value="blogs" className="flex items-center justify-center"><BookOpen className="w-4 h-4 mr-2" /> Blogs</TabsTrigger>
                            <TabsTrigger value="settings" className="flex items-center justify-center"><Settings className="w-4 h-4 mr-2" /> Settings</TabsTrigger>
                        </TabsList>
                        <TabsContent value="profile">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium">Full Name</label>
                                            <Input name="name" value={editData?.name ?? ''} readOnly={!editMode} onChange={handleEditChange} />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Username</label>
                                            <Input name="username" value={editData?.username ?? editData?.email} readOnly={!editMode} onChange={handleEditChange} />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Email</label>
                                            <Input name="email" value={editData?.email ?? ''} readOnly={!editMode} onChange={handleEditChange} />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Bio</label>
                                            <Textarea name="bio" value={editData?.bio ?? ''} readOnly={!editMode} onChange={handleEditChange} />
                                        </div>
                                    </div>
                                    {editMode && (
                                        <div className="mt-4 flex justify-end space-x-2">
                                            <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                                            <Button onClick={handleSaveProfile}>Save</Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="blogs">
                            <Card className="w-full">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold">Your Blogs</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {userBlogs.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-gray-600 mb-4">You have not created any blogs yet.</p>
                                            <Link href="/create" className="text-blue-500 hover:underline">
                                                Click here to create your first blog
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                            {userBlogs.map((blog) => (
                                                <Card key={blog.id} className="flex flex-col h-full overflow-hidden">
                                                    <div className="relative w-full pt-[56.25%] bg-gray-200">
                                                        {blog.thumbnail ? (
                                                            <img
                                                                src={blog.thumbnail}
                                                                alt={blog.title}
                                                                className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).onerror = null;
                                                                    (e.target as HTMLImageElement).src = '/default-thumbnail.png';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <ImageIcon className="h-16 w-16 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <CardContent className="flex-grow p-6">
                                                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{blog.title}</h3>
                                                        <p className="text-gray-600 mb-4 line-clamp-3">{blog.content}</p>
                                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                                            <div className="flex items-center space-x-2">
                                                                <Eye className="h-4 w-4" />
                                                                <span>{blog.views}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <ThumbsUp className="h-4 w-4" />
                                                                <span>{blog.likes}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            <Button size="sm" variant="outline" onClick={() => handleEditBlog(blog.id)}>
                                                                <Edit2 className="w-4 h-4 mr-2" /> Edit
                                                            </Button>
                                                            <Button size="sm" variant="outline" onClick={() => handleDeleteBlog(blog.id)}>
                                                                {loading ? 'Deleting...' : <><Trash2 className="w-4 h-4 mr-2" /> Delete</>}
                                                            </Button>
                                                            <Button size="sm" variant="outline" onClick={() => handleViewBlog(blog.id)}>
                                                                <Eye className="w-4 h-4 mr-2" /> View
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="settings">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Settings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">Change Password</h3>
                                                <p className="text-sm text-gray-500">Update your account password</p>
                                            </div>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline">Change</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Change Password</DialogTitle>
                                                        <DialogDescription>Enter your current password and a new password to update your account.</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <Label htmlFor="current-password">Current Password</Label>
                                                            <Input id="current-password" type="password" />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="new-password">New Password</Label>
                                                            <Input id="new-password" type="password" />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                                                            <Input id="confirm-password" type="password" />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button onClick={() => changePassword("oldPassword", "newPassword")}>Update Password</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">Linked Accounts</h3>
                                                <p className="text-sm text-gray-500">Manage your linked social accounts</p>
                                            </div>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline">Manage</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Manage Linked Accounts</DialogTitle>
                                                        <DialogDescription>Connect or disconnect your social accounts.</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <span>Google</span>
                                                            <Button onClick={() => manageLinkedAccounts("connect", "google")}>Connect</Button>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span>GitHub</span>
                                                            <Button onClick={() => manageLinkedAccounts("disconnect", "github")}>Disconnect</Button>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        {/* 
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">Notification Preferences</h3>
                                                <p className="text-sm text-gray-500">Control how you receive notifications</p>
                                            </div>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline">Configure</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Notification Preferences</DialogTitle>
                                                        <DialogDescription>Customize your notification settings.</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <span>Email Notifications</span>
                                                            <Switch onCheckedChange={(checked) => updateNotificationPreferences({ email: checked })} />
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span>Push Notifications</span>
                                                            <Switch onCheckedChange={(checked) => updateNotificationPreferences({ push: checked })} />
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">Privacy Settings</h3>
                                                <p className="text-sm text-gray-500">Manage your account privacy</p>
                                            </div>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline">Configure</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Privacy Settings</DialogTitle>
                                                        <DialogDescription>Control your account privacy settings.</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <span>Make profile public</span>
                                                            <Switch onCheckedChange={(checked) => updatePrivacySettings({ publicProfile: checked })} />
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span>Show email address</span>
                                                            <Switch onCheckedChange={(checked) => updatePrivacySettings({ showEmail: checked })} />
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div> */}

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">Theme Settings</h3>
                                                <p className="text-sm text-gray-500">Customize your app appearance</p>
                                            </div>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline">Customize</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Theme Settings</DialogTitle>
                                                        <DialogDescription>Choose your preferred theme.</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <span>Dark Mode</span>
                                                            <Switch onCheckedChange={(isDarkMode) => updateThemeSettings({ darkMode: isDarkMode })} />
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        {/* Log out Button above Delete Account Button */}
                                        <div className="pt-4">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" className="w-full">Log Out</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            You will be logged out of your account.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => signOut()}>Log Out</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                        <div className="pt-4">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" className="w-full">Delete Account</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={deleteAccount}>Delete Account</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}