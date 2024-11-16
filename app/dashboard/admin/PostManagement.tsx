import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Save, Loader2 } from 'lucide-react'
import { CATEGORIES } from '@/types/blogs-types'
interface BlogPostType {
    _id: string
    title: string
    createdAt: string
    category?: string
    views?: number
    likes?: number
    createdBy: string
}


interface PostManagementProps {
    posts: BlogPostType[];
    loading: boolean;
    searchTerm: string;
    handleSearch: (value: string) => void;
    updateCategory: (id: string, category: string) => void;
    savingPost: string | null;
}

const PostManagement: React.FC<PostManagementProps> = ({ posts, loading, searchTerm, handleSearch, updateCategory, savingPost }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Post Management</CardTitle>
                <CardDescription>Update categories for individual posts</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center mb-4">
                    <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Views</TableHead>
                                <TableHead>Likes</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-10">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                posts.map((post) => (
                                    <TableRow key={post._id}>
                                        <TableCell className="font-medium">{post.title}</TableCell>
                                        <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{post.createdBy}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={post.category || ''}
                                                onValueChange={(value) => updateCategory(post._id, value)}
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {CATEGORIES.map((cat) => (
                                                        <SelectItem key={cat.value} value={cat.value}>
                                                            {cat.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>{post.views || 0}</TableCell>
                                        <TableCell>{post.likes || 0}</TableCell>
                                        <TableCell className="text-right">
                                            {savingPost === post._id ? (
                                                <Button disabled size="sm">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    onClick={() => updateCategory(post._id, post.category || '')}
                                                >
                                                    <Save className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </TableCell>

                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

export default PostManagement