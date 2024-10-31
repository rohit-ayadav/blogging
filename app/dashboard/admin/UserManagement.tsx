import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    Users, UserPlus, UserMinus, Calendar, MoreVertical, Mail, Edit, Trash2,
    UserCog, Eye, Download, ArrowUpDown, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    role: string;
    noOfBlogs: number;
    bio: string;
    image: string;
}

interface UserGrowthData {
    month: string;
    users: number;
    activeUsers: number;
}

interface UserStats {
    total: number;
    active: number;
    inactive: number;
    averageBlogs: number;
}


const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [growthData, setGrowthData] = useState<UserGrowthData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<string>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [stats, setStats] = useState<UserStats>({
        total: 0,
        active: 0,
        inactive: 0,
        averageBlogs: 0
    });
    const [itemsPerPage, setItemsPerPage] = useState(15);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/user');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data.user || []);

                // Calculate stats
                const userArray = data.user || [];
                const totalBlogs = userArray.reduce((sum: number, user: User) => sum + user.noOfBlogs, 0);
                setStats({
                    total: userArray.length,
                    active: userArray.filter((u: User) => u.noOfBlogs > 0).length,
                    inactive: userArray.filter((u: User) => u.noOfBlogs === 0).length,
                    averageBlogs: userArray.length ? Math.round(totalBlogs / userArray.length) : 0
                });

                // Process growth data...
                const monthCounts = new Map<string, { total: number; active: number }>();
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                months.forEach(month => monthCounts.set(month, { total: 0, active: 0 }));

                userArray.forEach((user: User) => {
                    const month = months[new Date(user.createdAt).getMonth()];
                    const currentCount = monthCounts.get(month) || { total: 0, active: 0 };
                    monthCounts.set(month, {
                        total: currentCount.total + 1,
                        active: user.noOfBlogs > 0 ? currentCount.active + 1 : currentCount.active
                    });
                });

                const chartData = months.map(month => ({
                    month,
                    users: monthCounts.get(month)?.total || 0,
                    activeUsers: monthCounts.get(month)?.active || 0
                }));

                setGrowthData(chartData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setGrowthData(Array.from({ length: 12 }, (_, i) => ({
                    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
                    users: Math.floor(Math.random() * 100) + 50,
                    activeUsers: Math.floor(Math.random() * 50) + 25
                })));
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const openUserDetails = (user: User) => {
        // window.history.pushState(null, '', `/author/${user.id}`);
        setSelectedUser(user);
    }
    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedAndFilteredUsers = users
        .filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            return matchesSearch && matchesRole;
        })
        .sort((a, b) => {
            const direction = sortDirection === 'asc' ? 1 : -1;
            if (sortField === 'name') {
                return direction * a.name.localeCompare(b.name);
            }
            if (sortField === 'blogs') {
                return direction * (a.noOfBlogs - b.noOfBlogs);
            }
            if (sortField === 'date') {
                return direction * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            }
            return 0;
        });

    const totalPages = Math.ceil(sortedAndFilteredUsers.length / itemsPerPage);
    const paginatedUsers = sortedAndFilteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const UserDetailsDialog = ({ user }: { user: User }) => (
        <Dialog open={true} onOpenChange={() => setSelectedUser(null)}>
            <DialogTrigger>
                <Button variant="ghost">
                    <UserCog className="h-5 w-5 mr-2" />
                    Manage User
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                    <DialogDescription>Complete information about the user</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user.image} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-semibold">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <div>
                            <h4 className="font-medium">Role</h4>
                            <Badge className="mt-1">{user.role}</Badge>
                        </div>
                        <div>
                            <h4 className="font-medium">Joined</h4>
                            <p className="text-sm text-muted-foreground">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium">Total Blogs</h4>
                            <p className="text-sm text-muted-foreground">{user.noOfBlogs}</p>
                        </div>
                        <div>
                            <h4 className="font-medium">Bio</h4>
                            <p className="text-sm text-muted-foreground">{user.bio || 'No bio available'}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4">
            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Writers</CardTitle>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.active}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Readers Only</CardTitle>
                        <UserMinus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.inactive}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Blogs/User</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.averageBlogs}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>Monthly user registration and activity trends</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="month" stroke="currentColor" />
                                <YAxis stroke="currentColor" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        border: '1px solid hsl(var(--border))'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="users"
                                    name="Total Users"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="activeUsers"
                                    name="Active Writers"
                                    stroke='hsl(0, 0%, 70%)'
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>View and manage user information</CardDescription>
                    </div>
                    <Button className="hidden md:flex">
                        <Download className="mr-2 h-4 w-4" />
                        Export Users
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <Input
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-14">Sr. No</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                                        Name {sortField === 'name' && (
                                            <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                                        )}
                                    </TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="cursor-pointer" onClick={() => handleSort('blogs')}>
                                        Blogs {sortField === 'blogs' && (
                                            <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                                        )}
                                    </TableHead>
                                    <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                                        Joined {sortField === 'date' && (
                                            <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                                        )}
                                    </TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedUsers.map((user, index) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="w-14">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                        <TableCell>
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.image} alt={user.name} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell
                                            onClick={() => openUserDetails(user)}
                                            className="cursor-pointer"
                                        >
                                            {user.name}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'} className="ml-2">
                                                {user.role === 'admin' ? 'Admin' : 'User'}
                                            </Badge>

                                        </TableCell>
                                        <TableCell>{user.noOfBlogs}</TableCell>
                                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <MoreVertical className="h-5 w-5" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem
                                                        onClick={() => setSelectedUser(user)}
                                                    >
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => alert('Delete user')}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <div>
                            <Button
                                variant="ghost"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span>Items per page:</span>
                            <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                                setItemsPerPage(parseInt(value));
                                setCurrentPage(1);
                            }}>
                                <SelectTrigger className="w-[60px]">
                                    <SelectValue placeholder={itemsPerPage.toString()} />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 15, 20, 25, 30].map((number) => (
                                        <SelectItem key={number} value={number.toString()}>
                                            {number}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <span className="text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {selectedUser && (
                <UserDetailsDialog user={selectedUser} />
            )
            }
        </div >
    );
}

export default UserManagement;
