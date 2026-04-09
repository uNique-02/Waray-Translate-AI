import { useState } from "react";
import {
  MessageSquare,
  Settings,
  Sparkles,
  Plus,
  Menu,
  X,
  User,
  LogIn,
  LogOut,
  Code,
  ChevronDown,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useUserStore from "../stores/useUserStore.js";

export default function Navbar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useUserStore();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/"); // ✅ Redirect to root after logout
  };

  return (
    <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
      <div className="flex items-center space-x-4">
        {/* Menu button (visible on mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/20 bg-slate-100/10 text-slate-100 shadow-sm transition hover:bg-slate-100/20 focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl blur-sm opacity-75"></div>
            <div className="relative bg-gradient-to-br from-blue-700 to-cyan-600 p-2 rounded-xl">
              <MessageSquare className="text-white" size={24} />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              WarayTranscribe AI
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Sparkles size={10} />
              <span>Powered by AI</span>
            </div>
          </div>
        </div>
        <nav className="hidden sm:flex space-x-6 text-sm font-medium">
          <a
            href="/"
            className="text-gray-300 hover:text-cyan-300 transition-colors"
          >
            Home
          </a>
          <a
            href="/about"
            className="text-gray-300 hover:text-cyan-300 transition-colors"
          >
            About
          </a>
          <a
            href="/features"
            className="text-gray-300 hover:text-cyan-300 transition-colors"
          >
            Features
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {/* Mobile: Icon button */}
        {location.pathname === "/" && !user && (
          <Link
            to="/new"
            className="sm:hidden p-3 bg-gradient-to-r from-blue-700 to-cyan-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all"
            aria-label="Get Started"
          >
            <Plus size={20} />
          </Link>
        )}

        {location.pathname === "/" && user && (
          <Link
            to="/new"
            className="sm:hidden p-3 bg-gradient-to-r from-blue-700 to-cyan-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all"
            aria-label="New Chat"
          >
            <Plus size={20} />
          </Link>
        )}

        {/* Desktop: Full button */}
        {location.pathname === "/" && !user && (
          <Link
            to="/new"
            className="hidden sm:block px-5 py-2 bg-gradient-to-r from-blue-700 to-cyan-600 text-white text-sm font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all"
          >
            Get Started
          </Link>
        )}

        {location.pathname === "/" && user && (
          <Link
            to="/new"
            className="hidden sm:block px-5 py-2 bg-gradient-to-r from-blue-700 to-cyan-600 text-white text-sm font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all"
          >
            New Chat
          </Link>
        )}

        {/* Profile Dropdown - Only visible on desktop */}
        <div className="relative hidden lg:block">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-2 rounded-full hover:bg-blue-950/30 transition-all duration-200 group"
            aria-label="Profile Menu"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-700 to-cyan-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              {!user && <User className="text-white" size={20} />}
              {user && (
                <img
                  src={user.picture}
                  className="text-white"
                  size={20}
                  alt=""
                />
              )}
            </div>
            <ChevronDown
              size={16}
              className={`text-slate-300 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Backdrop to close dropdown */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />

              {/* Dropdown content */}
              <div className="absolute right-0 mt-2 w-56 bg-slate-100/95 backdrop-blur-xl rounded-xl shadow-2xl border border-blue-200/80 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User Info (if logged in) */}
                {user && (
                  <>
                    <div className="px-4 py-3 border-b border-blue-100">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user.email || "user@example.com"}
                      </p>
                    </div>
                  </>
                )}

                {/* Menu Items */}
                <div className="py-1">
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <LogIn size={18} />
                      <span>Login</span>
                    </Link>
                  )}

                  <Link
                    to="/developers"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    <Code size={18} />
                    <span>Developers</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
