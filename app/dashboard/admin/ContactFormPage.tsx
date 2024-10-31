'use client'

import { useState, useCallback, useMemo } from 'react'
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
    const [data, setData] = useState<Message[]>(initialData)
    const [sortConfig, setSortConfig] = useState<{ key: keyof Message; direction: 'asc' | 'desc' } | null>(null)
    const [filters, setFilters] = useState({ name: '', email: '', date: '' })
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedMessages, setSelectedMessages] = useState<string[]>([])
    const [viewMessage, setViewMessage] = useState<Message | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const itemsPerPage = 10

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
                message.date.includes(filters.date) &&
                (message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    message.message.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .sort((a, b) => {
                if (!sortConfig) return 0
                const { key, direction } = sortConfig
                if ((a[key] ?? '') < (b[key] ?? '')) return direction === 'asc' ? -1 : 1
                if ((a[key] ?? '') > (b[key] ?? '')) return direction === 'asc' ? 1 : -1
                return 0
            })
    }, [data, filters, sortConfig, searchQuery])

    const paginatedData = filteredAndSortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)

    return (
        <>
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
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={selectedMessages.length === paginatedData.length}
                                        onCheckedChange={(checked: boolean) => {
                                            setSelectedMessages(checked ? paginatedData.map(m => m.id) : [])
                                        }}
                                    />
                                </TableHead>
                                <TableHead>
                                    Name
                                    <Button variant="ghost" size="sm" onClick={() => handleSort('name')}>
                                        <ArrowUpDown className="h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    Email
                                    <Button variant="ghost" size="sm" onClick={() => handleSort('email')}>
                                        <ArrowUpDown className="h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    Subject
                                    <Button variant="ghost" size="sm" onClick={() => handleSort('subject')}>
                                        <ArrowUpDown className="h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    Date
                                    <Button variant="ghost" size="sm" onClick={() => handleSort('date')}>
                                        <ArrowUpDown className="h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.map((message) => (
                                <TableRow key={message.id} className={message.read ? '' : 'font-bold'}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedMessages.includes(message.id)}
                                            onCheckedChange={(checked: boolean) => {
                                                setSelectedMessages(prev =>
                                                    checked
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
                                                <DropdownMenuItem onClick={() => window.location.href = `mailto:${message.email}`}>
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

                <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Select onValueChange={(value) => handleFilter('name', value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by name" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from(new Set(data.map(m => m.name))).map(name => (
                                    <SelectItem key={name} value={name}>{name}</SelectItem>
                                ))}
                                <SelectItem value="all-names">All names</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select onValueChange={(value) => handleFilter('email', value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by email" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from(new Set(data.map(m => m.email))).map(email => (
                                    <SelectItem key={email} value={email}>{email}</SelectItem>
                                ))}
                                <SelectItem value="all-emails">All emails</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            type="date"
                            onChange={(e) => handleFilter('date', e.target.value)}
                            className="w-[180px]"
                        />
                    </div>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                {currentPage > 1 && (
                                    <PaginationPrevious
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    />
                                )}
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
                            {currentPage < totalPages && (
                                <PaginationNext
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                />
                            )}

                            <PaginationItem>
                                <span className="text-gray-500">
                                    Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredAndSortedData.length)} to{' '}
                                    {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of{' '}
                                    {filteredAndSortedData.length} messages
                                </span>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
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
            </div >
        </>
    )
}
