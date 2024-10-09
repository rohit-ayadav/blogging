"use client";
export default function Button() {
    const login = () => {
        window.location.href = "/login";
    };
    return (
        <button className="bg-white text-emerald-800 px-4 py-2 rounded-md" onClick={login}>
            Get Started
        </button>
    );
}