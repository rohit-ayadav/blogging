'use client'

import { useCallback, useMemo, useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination"
import {
    ArrowUpDown,
    MoreHorizontal,
    Search,
    Trash,
    Mail,
    Eye
} from 'lucide-react'
import { useState } from 'react'
import { Textarea } from "@/components/ui/textarea"

interface Message {
    id: string
    name: string
    email: string
    subject: string
    message: string
    date: string
    read?: boolean
}

interface ContactFormPageProps {
    data: Message[]
}

export default function ContactFormPage({ data: initialData }: ContactFormPageProps) {
    // Initialize state directly with initialData
    const [data, setData] = useState<Message[]>(initialData || [])
    const [sortConfig, setSortConfig] = useState<{ key: keyof Message; direction: 'asc' | 'desc' } | null>(null)
    const [filters, setFilters] = useState({ name: '', email: '', date: '' })
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedMessages, setSelectedMessages] = useState<string[]>([])
    const [viewMessage, setViewMessage] = useState<Message | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [replyMessage, setReplyMessage] = useState<Message | null>(null)
    const [message, setMessage] = useState<Message | null>(null)

    const itemsPerPage = 10

    // Update data when initialData changes
    useEffect(() => {
        if (initialData && initialData.length > 0) {
            setData(initialData)
        }
    }, [initialData])

    const handleSort = (key: keyof Message) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig?.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
        }))
    }

    const handleFilter = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
        setCurrentPage(1)
    }

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        setCurrentPage(1)
    }

    const handleDelete = useCallback((id: string) => {
        setData(prev => prev.filter(message => message.id !== id))
    }, [])

    const handleBulkDelete = useCallback(() => {
        setData(prev => prev.filter(message => !selectedMessages.includes(message.id)))
        setSelectedMessages([])
    }, [selectedMessages])

    const handleBulkMarkAsRead = useCallback((read: boolean) => {
        setData(prev => prev.map(message =>
            selectedMessages.includes(message.id) ? { ...message, read } : message
        ))
        setSelectedMessages([])
    }, [selectedMessages])

    const filteredAndSortedData = useMemo(() => {
        return data
            .filter(message =>
                message.name.toLowerCase().includes(filters.name.toLowerCase()) &&
                message.email.toLowerCase().includes(filters.email.toLowerCase()) &&
                (message.date?.includes(filters.date) ?? false) &&
                (message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    message.message.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .sort((a, b) => {
                if (!sortConfig) return 0
                const { key, direction } = sortConfig
                const valueA = a[key]
                const valueB = b[key]
                if (valueA === undefined || valueB === undefined) return 0
                if (valueA < valueB) return direction === 'asc' ? -1 : 1
                if (valueA > valueB) return direction === 'asc' ? 1 : -1
                return 0
            })
    }, [data, filters, sortConfig, searchQuery])

    const paginatedData = filteredAndSortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Contact Form Messages</h1>

            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                    <Input
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-64"
                    />
                    <Button variant="outline" size="icon">
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={handleBulkDelete} disabled={selectedMessages.length === 0}>
                        Delete Selected
                    </Button>
                    <Button onClick={() => handleBulkMarkAsRead(true)} disabled={selectedMessages.length === 0}>
                        Mark as Read
                    </Button>
                    <Button onClick={() => handleBulkMarkAsRead(false)} disabled={selectedMessages.length === 0}>
                        Mark as Unread
                    </Button>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className='bg-gray-100'>
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    checked={paginatedData.length > 0 && selectedMessages.length === paginatedData.length}
                                    onChange={(e) => {
                                        setSelectedMessages(
                                            (e.target as HTMLInputElement).checked
                                                ? paginatedData.map(m => m.id)
                                                : []
                                        )
                                    }}
                                />
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center">
                                    Name
                                    <Button variant="ghost" size="sm" onClick={() => handleSort('name')}>
                                        <ArrowUpDown className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center">
                                    Email
                                    <Button variant="ghost" size="sm" onClick={() => handleSort('email')}>
                                        <ArrowUpDown className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center">
                                    Subject
                                    <Button variant="ghost" size="sm" onClick={() => handleSort('subject')}>
                                        <ArrowUpDown className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center">
                                    Date
                                    <Button variant="ghost" size="sm" onClick={() => handleSort('date')}>
                                        <ArrowUpDown className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">
                                    No messages found
                                </TableCell>
                            </TableRow>
                        )}
                        
                        {paginatedData.map((message) => (
                            <TableRow key={message.id} className={message.read ? '' : 'font-bold'}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedMessages.includes(message.id)}
                                        onChange={(e) => {
                                            setSelectedMessages(prev =>
                                                (e.target as HTMLInputElement).checked
                                                    ? [...prev, message.id]
                                                    : prev.filter(id => id !== message.id)
                                            )
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{message.name}</TableCell>
                                <TableCell>{message.email}</TableCell>
                                <TableCell>{message.subject}</TableCell>
                                <TableCell>{message.date}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => setViewMessage(message)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setReplyMessage(message)}>
                                                <Mail className="mr-2 h-4 w-4" />
                                                Reply
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleDelete(message.id)}>
                                                <Trash className="mr-2 h-4 w-4" />
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

            {totalPages > 1 && (
                <div className="mt-4 flex justify-end">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    aria-disabled={currentPage === 1}
                                />
                            </PaginationItem>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        onClick={() => setCurrentPage(page)}
                                        isActive={currentPage === page}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    aria-disabled={currentPage === totalPages}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            <Dialog open={!!viewMessage} onOpenChange={() => setViewMessage(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{viewMessage?.subject}</DialogTitle>
                        <DialogDescription>From: {viewMessage?.name} ({viewMessage?.email})</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        <p className="text-sm text-gray-500">Received on: {viewMessage?.date}</p>
                        <p className="mt-2">{viewMessage?.message}</p>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={!!replyMessage} onOpenChange={() => setReplyMessage(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reply to {replyMessage?.name}</DialogTitle>
                        <DialogDescription>Email: {replyMessage?.email}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        const customMessage = formData.get('customMessage') as string
                        const fullMessage = `Dear ${replyMessage?.name},\n\nThank you for your message regarding "${replyMessage?.subject}".\n\n${customMessage}\n\nBest regards,\nAdmin Team`
                        window.location.href = `mailto:${replyMessage?.email}?subject=Re: ${replyMessage?.subject}&body=${encodeURIComponent(fullMessage)}`
                        setReplyMessage(null)
                    }}>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="customMessage" className="block text-sm font-medium text-gray-700">
                                    Add your custom message:
                                </label>
                                <Textarea
                                    id="customMessage"
                                    name="customMessage"
                                    rows={3}
                                    className="mt-1 block w-full"
                                    required
                                />
                            </div>
                            <Button type="submit">Send Reply</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}