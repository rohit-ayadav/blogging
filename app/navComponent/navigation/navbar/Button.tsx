"use client";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getSessionAtHome } from "@/auth";

export default function Button() {
    const router = useRouter();
    const [login, setLogin] = useState(false);
    const { data: session } = useSession();
    const [showDropdown, setShowDropdown] = useState(false);
    useEffect(() => {
        if (session) {
            setLogin(true);
        }
    }, [session]);
    if (login && session && session.user) {
        return (
            <div className="relative flex items-center space-x-2 hover:cursor-pointer">
                <span className="text-white font-semibold">{session.user.name}</span>
                <img src={session.user.image ?? '/default-profile.jpg'} alt="profile" className="w-10 h-10 rounded-full" onClick={() => router.push('/profile')} />
                <img src={session.user.image ?? '/default-profile.jpg'} alt="profile" className="w-10 h-10 rounded-full" onClick={() => setShowDropdown(!showDropdown)} />
                {showDropdown && (
                    <div className="absolute right-0 top-12 bg-white shadow-md w-48 rounded-md">
                        <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View Profile</a>
                        <a href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                        <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                    </div>
                )}
            </div>
        )
    }

    return (
        <button className="bg-white text-emerald-800 px-4 py-2 rounded-md" onClick={() => window.location.href = '/login'}>
            Get Started
        </button >


    );
}