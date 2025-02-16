import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      setIsLoggedIn(!!session);
      if (session) {
        try {
          const response = await fetch("/api/theme");
          if (response.ok) {
            const { theme } = await response.json();
            // theme can be "light" or "dark" or "system"
            if (theme === "system") {
              setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
            } else setIsDarkMode(theme === "dark");
          }
        } catch (error) {
          console.error("Error fetching theme:", error);
        }
      } else {
        const theme = localStorage.getItem("theme");
        setIsDarkMode(theme === "dark");
      }
    };

    checkSession();
  }, []);

  const toggleDarkMode = async () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);

    if (isLoggedIn) {
      try {
        await fetch("/api/theme", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ theme: newTheme }),
        });
        console.log("Theme updated successfully to ", newTheme);
      } catch (error) {
        console.error("Error updating theme:", error);
        setIsDarkMode(!isDarkMode);
      }
    } else {
      localStorage.setItem("theme", newTheme);
    }
  };

  return { isDarkMode, toggleDarkMode };
};