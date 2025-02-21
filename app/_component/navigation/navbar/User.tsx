"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
    name?: string | null;
    image?: string | null;
}

interface UserMenuProps {
    user: User;
}
const UserMenu = ({ user }: UserMenuProps) => {

    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <Link href="/profile">
                <button
                    className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-full"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                >
                    <span className="text-white font-semibold">{user.name}</span>
                    <img
                        src={user.image || "/default-profile.jpg"}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full"
                    />
                </button>
            </Link>

            {isOpen && (
                <div
                    className="absolute right-0 top-12 bg-white shadow-lg w-48 rounded-md py-1 z-50"
                    role="menu"
                    aria-orientation="vertical"
                >
                    <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                    >
                        View Profile
                    </Link>
                    <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                    >
                        Settings
                    </Link>
                    <Link href="/signout">
                        <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                        >
                            Sign Out
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default UserMenu;