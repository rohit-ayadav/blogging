"use client";
import { createContext, useContext } from "react";
import { useDarkMode } from "../hooks/useDarkMode";

export interface ThemeContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

import { ReactNode } from "react";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
