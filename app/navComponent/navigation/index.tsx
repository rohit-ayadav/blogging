"use client";
import { useState } from "react";
// import Navbar from "./navbar/index";
import Sidebar from "./sidebar";
export default function Navigation() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    return (
        <div>
            <Sidebar isOpen={isSidebarOpen} toggle={toggle} />
            {/* <Navbar /> */}
        </div>
    );
}