// File: hooks/useDarkMode.ts
"use client";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        setIsLoggedIn(true);
      }
    };
    checkSession();
  }, []);

  if (isLoggedIn) {
    useEffect(() => {
      const findTheme = async () => {
        try {
          const response = await fetch("/api/theme");
          if (response.ok) {
            const { theme } = await response.json();
            setIsDarkMode(theme === "dark");
            console.log("Theme found:", theme);
          }
        } catch (error) {
          console.error(error);
        }
      };
      findTheme();
    }, []);
  } else {
    // User is not logged in, get theme from local storage
    useEffect(() => {
      const theme = localStorage.getItem("theme");
      setIsDarkMode(theme === "dark");
    }, []);
  }

  const toggleDarkMode = async () => {
    if (isLoggedIn) {
      setIsDarkMode(!isDarkMode);
      try {
        const newTheme = isDarkMode ? "light" : "dark";
        const response = await fetch("/api/theme", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ theme: newTheme }),
        });
        if (response.ok) {
          console.log("Theme updated:", newTheme);
        }
      } catch (error) {
        setIsDarkMode(!isDarkMode);
        console.error(error);
      }
    } else {
      const newTheme = isDarkMode ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      setIsDarkMode(!isDarkMode);
    }
  };
  return { isDarkMode, toggleDarkMode };
};
