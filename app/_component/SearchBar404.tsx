"use client";
import React from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

const SearchBar404 = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = React.useState('');
    return (
        <div>
            <div className="max-w-md mx-auto">
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                router.push(`/search?q=${searchQuery}`);
                            }
                        }}
                        placeholder="Search for content..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                        onClick={() => {
                            router.push(`/search?q=${searchQuery}`);
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default SearchBar404
