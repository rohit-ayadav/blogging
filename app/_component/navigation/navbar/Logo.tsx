import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const updateWidth = () => setWidth(window.innerWidth);
        window.addEventListener("resize", updateWidth);
        updateWidth();
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    return (
        <Link href="/" className="flex items-center space-x-2 select-none">
            <Image
                src="/logo.png"
                alt="Company Logo"
                width={width < 768 ? 50 : 60}
                height={width < 768 ? 50 : 60}
                className="rounded-full"
                priority
            />
            <span className="text-white text-xl font-bold">TheFoodBlogger</span>
        </Link>
    );
};

export default Logo;