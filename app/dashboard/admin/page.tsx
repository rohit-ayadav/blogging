"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartLegend } from "@/components/ui/chart"
import { toast } from 'react-hot-toast'
import { Eye, ThumbsUp, Tag, Search, Save, Loader2, BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react'
import { Bar, Line, Pie, BarChart, LineChart, PieChart } from 'recharts'

const CATEGORIES = [
  { value: "DSA", label: "DSA" },
  { value: "Job Posting", label: "Job Posting" },
  { value: "WebDev", label: "Web Development" },
  { value: "AI", label: "Artificial Intelligence" },
  { value: "ML", label: "Machine Learning" },
  { value: "Skill Development", label: "Skill Development" },
  { value: "Resume and Cover Letter Guidance", label: "Resume & Cover Letter" },
  { value: "Interview Preparation", label: "Interview Prep" },
  { value: "Others", label: "Others" }
]

interface BlogPostType {
  _id: string
  title: string
  createdAt: string
  category?: string
  views?: number
  likes?: number
  createdBy: string
}

interface CategoryStats {
  category: string
  count: number
  totalViews: number
  totalLikes: number
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<BlogPostType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPosts, setFilteredPosts] = useState<BlogPostType[]>([])
  const [savingPost, setSavingPost] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    uncategorizedPosts: 0,
    categoryStats: [] as CategoryStats[]
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/blog')
      const data = await response.json()
      setPosts(data.data)
      setFilteredPosts(data.data)
      calculateStats(data.data)
    } catch (error) {
      toast.error('Failed to fetch posts')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (postsData: BlogPostType[]) => {
    const categoryMap = new Map<string, CategoryStats>()
    let totalViews = 0
    let totalLikes = 0
    let uncategorizedPosts = 0

    postsData.forEach(post => {
      totalViews += post.views || 0
      totalLikes += post.likes || 0

      if (!post.category) {
        uncategorizedPosts++
        return
      }

      const currentStats = categoryMap.get(post.category) || {
        category: post.category,
        count: 0,
        totalViews: 0,
        totalLikes: 0
      }

      categoryMap.set(post.category, {
        ...currentStats,
        count: currentStats.count + 1,
        totalViews: currentStats.totalViews + (post.views || 0),
        totalLikes: currentStats.totalLikes + (post.likes || 0)
      })
    })

    setStats({
      totalPosts: postsData.length,
      totalViews,
      totalLikes,
      uncategorizedPosts,
      categoryStats: Array.from(categoryMap.values())
    })
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(value.toLowerCase()) ||
      post._id.toLowerCase().includes(value.toLowerCase()) ||
      post.createdBy.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredPosts(filtered)
  }

  const updateCategory = async (postId: string, category: string) => {
    try {
      setSavingPost(postId)
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`${response.status} - ${errorData.message}`)
      }
      const data = await response.json()
      const updatedPosts = posts.map(post =>
        post._id === postId ? { ...post, category } : post
      )
      setPosts(updatedPosts)
      setFilteredPosts(updatedPosts)
      calculateStats(updatedPosts)
      toast.success(data.message)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`${error.message}`)
      } else {
        toast.error('An unknown error occurred')
      }
      console.error(error)
    } finally {
      setSavingPost(null)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Blog Admin Dashboard</h1>
        <Button onClick={fetchPosts}>Refresh Data</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.uncategorizedPosts} uncategorized
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLikes.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categoryStats.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Views Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{
                  views: {
                    label: "Views",
                    color: "hsl(var(--chart-1))",
                  },
                }} className="h-[200px]">
                  <LineChart data={[
                    { date: "Jan", views: 100 },
                    { date: "Feb", views: 300 },
                    { date: "Mar", views: 200 },
                    { date: "Apr", views: 500 },
                    { date: "May", views: 400 },
                    { date: "Jun", views: 700 },
                  ]}>
                    <Line type="monotone" dataKey="views" stroke="var(--color-views)" />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{
                  value: {
                    color: "hsl(var(--chart-1))",
                  },
                }} className="h-[200px]">
                  <PieChart data={stats.categoryStats.map(stat => ({
                    name: stat.category,
                    value: stat.count
                  }))}>
                    <Pie dataKey="value" nameKey="name" fill="var(--color-value)" />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {posts.slice(0, 10).map((post, index) => (
                  <div key={post._id} className="flex items-center mb-4 last:mb-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`https://avatar.vercel.sh/${post.createdBy}.png`} alt={post.createdBy} />
                      <AvatarFallback>{post.createdBy.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{post.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Posted by {post.createdBy} on {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {post.category || 'Uncategorized'}
                    </Badge>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="posts" className="space-y-4">
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
                      filteredPosts.map((post) => (
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
                                <Save className="h-4  w-4" />
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
        </TabsContent>
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Overview</CardTitle>
              <CardDescription>Detailed statistics for each category</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                count: {
                  label: "Post Count",
                  color: "hsl(var(--chart-1))",
                },
                views: {
                  label: "Total Views",
                  color: "hsl(var(--chart-2))",
                },
                likes: {
                  label: "Total Likes",
                  color: "hsl(var(--chart-3))",
                },
              }} className="h-[300px]">
                <BarChart data={stats.categoryStats}>
                  <Bar dataKey="count" fill="var(--color-count)" />
                  <Bar dataKey="totalViews" fill="var(--color-views)" />
                  <Bar dataKey="totalLikes" fill="var(--color-likes)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.categoryStats.map(stat => (
              <Card key={stat.category}>
                <CardHeader>
                  <CardTitle>{stat.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Posts</span>
                    </div>
                    <span>{stat.count}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Views</span>
                    </div>
                    <span>{stat.totalViews}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Likes</span>
                    </div>
                    <span>{stat.totalLikes}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}