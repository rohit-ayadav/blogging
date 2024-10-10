"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Edit2, Trash2, Eye } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";

export default function UserProfile() {
    const { data: session } = useSession();
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
    const [loading, setLoading] = useState(false); // Add loading state

    interface Blog {
        _id: any;
        id: string;
        title: string;
        excerpt: string;
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
                excerpt: blog.excerpt,
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
        console.log("Changing password:", oldPassword, newPassword);
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

    const updateThemeSettings = (theme: { darkMode: boolean }) => {
        console.log("Updating theme settings:", theme);
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
        await toast.promise(deleteAllBlogsRequest(), {
            loading: 'Deleting blogs...',
            success: 'Blogs deleted successfully',
            error: 'Failed to delete blogs',
        });

        await toast.promise(deleteAccountRequest(), {
            loading: 'Deleting account...',
            success: 'Account deleted successfully',
            error: 'Failed to delete account',
        });
        signOut();
        window.location.href = '/';
    };

    const handleEditBlog = (blogId: string) => {
        console.log("Editing blog:", blogId);
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
        console.log("Viewing blog:", blogId);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col items-center">
                                <Avatar className="w-32 h-32">
                                    <AvatarImage src={userData?.image ?? ''} alt={userData?.name ?? 'User'} />
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
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="blogs">Blogs</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
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
                                            <Textarea name="bio" value={editData?.bio ?? 'No Bio Available'} readOnly={!editMode} onChange={handleEditChange} />
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
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Blogs</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {userBlogs.map((blog) => (
                                        <div key={blog.id} className="mb-4 p-4 border rounded-lg">
                                            <h3 className="text-lg font-semibold">{blog.title}</h3>
                                            <p className="text-gray-600">{blog.excerpt}</p>
                                            <div className="mt-2 flex space-x-2">
                                                <Button size="sm" variant="outline" onClick={() => handleEditBlog(blog.id)}><Edit2 className="w-4 h-4 mr-2" /> Edit</Button>
                                                <Button size="sm" variant="outline" onClick={() => handleDeleteBlog(blog.id)}>
                                                    {loading ? 'Deleting...' : <><Trash2 className="w-4 h-4 mr-2" /> Delete</>}
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => handleViewBlog(blog.id)}><Eye className="w-4 h-4 mr-2" /> View</Button>
                                            </div>
                                        </div>
                                    ))}
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
                                        </div>

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
                                                            <Switch onCheckedChange={(checked) => updateThemeSettings({ darkMode: checked })} />
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
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