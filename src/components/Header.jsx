import { useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function Header({ darkMode, setDarkMode }) {
  return (
    <header
      className={`w-full flex items-center justify-between px-8 py-4 shadow-sm ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* Left: Logo */}
      <div className="flex items-center space-x-2">
        <span className="text-3xl font-extrabold text-blue-600">📸</span>
        <span className="font-semibold text-lg">Snap N Seek</span>
      </div>

      {/* Center: Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <h1
          className={`text-3xl font-extrabold tracking-tight ${
            darkMode
              ? "text-blue-400"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
          }`}
        >
          Snap N Seek 🔍
        </h1>
      </div>

      {/* Right: Buttons + Dark Mode */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => alert("Login feature under development!")}
          className={`px-4 py-2 rounded-lg border transition-all ${
            darkMode
              ? "border-blue-500 text-blue-400 hover:bg-blue-800"
              : "border-blue-500 text-blue-600 hover:bg-blue-50"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => alert("Sign-up feature under development!")}
          className={`px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all`}
        >
          Sign Up
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}
