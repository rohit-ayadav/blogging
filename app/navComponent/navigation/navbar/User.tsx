"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface User {
    name?: string | null;
    image?: string | null;
}

interface UserMenuProps {
    user: User;
    onSignOut: () => void;
}

const UserMenu = ({ user, onSignOut }: UserMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-full"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <span className="text-white font-semibold">{user.name}</span>
                <Image
                    src={user.image ?? '/default-profile.jpg'}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                />
            </button>

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
                    <button
                        onClick={onSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                    >
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
};


export default UserMenu;