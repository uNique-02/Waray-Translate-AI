import { useState } from "react";
import {
  MessageSquare,
  Settings,
  Info,
  Sparkles,
  Send,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
      <div className="flex items-center space-x-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl blur-sm opacity-75"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl">
              <MessageSquare className="text-white" size={24} />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              WarayTranscribe AI
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Sparkles size={10} />
              <span>Powered by AI</span>
            </div>
          </div>
        </div>
        <nav className="hidden sm:flex space-x-6 text-sm font-medium">
          <a
            href="/"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Home
          </a>
          <a
            href="/about"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            About
          </a>
          <a
            href="/features"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Features
          </a>
        </nav>
      </div>
      {/* Mobile: Icon button */}
      <Link
        to="/new"
        className="sm:hidden p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all"
        aria-label="Get Started"
      >
        <Plus size={20} />
      </Link>

      {/* Desktop: Full button */}
      <Link
        to="/new"
        className="hidden sm:block px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all"
      >
        Get Started
      </Link>
    </div>
  );
}
