"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "./Button";

const Logo = () => {
    //update the size of the logo when the size of the screen changes
    const [width, setWidth] = useState(0);

    const updateWidth = () => {
        const newWidth = window.innerWidth;
        setWidth(newWidth);
    };

    useEffect(() => {
        window.addEventListener("resize", updateWidth);
        updateWidth();
    }, []);

    // change between the logo and the button when the user scrolls
    const [showButton, setShowButton] = useState(false);

    const changeNavButton = () => {
        if (window.scrollY >= 400 && window.innerWidth < 768) {
            setShowButton(true);
        } else {
            setShowButton(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", changeNavButton);
    }, []);

    return (
        <>
            <Link href="/" style={{ display: showButton ? "none" : "block" }}>
                <svg
                    width={width < 768 ? 80 : 100}
                    height={width < 768 ? 80 : 100}
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <text
                        x="100%"
                        y="50%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fontSize={width < 768 ? 35 : 40}
                        fill="white"
                    >
                        Blogging
                    </text>
                </svg>
            </Link>
            <div
                style={{
                    display: showButton ? "block" : "none",
                }}
            >
                <Button />
            </div>
        </>
    );
};

export default Logo;
