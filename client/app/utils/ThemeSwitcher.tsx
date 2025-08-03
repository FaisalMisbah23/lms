"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-gray-200 dark:border-gray-700"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <div className="relative w-5 h-5">
        <FiSun 
          className={`absolute inset-0 transition-all duration-300 ${
            theme === "light" 
              ? "opacity-100 rotate-0 scale-100 text-yellow-500" 
              : "opacity-0 -rotate-90 scale-50"
          }`}
          size={20}
        />
        <FiMoon 
          className={`absolute inset-0 transition-all duration-300 ${
            theme === "dark" 
              ? "opacity-100 rotate-0 scale-100 text-blue-400" 
              : "opacity-0 rotate-90 scale-50"
          }`}
          size={20}
        />
    </div>
    </button>
  );
};

export default ThemeSwitcher;
