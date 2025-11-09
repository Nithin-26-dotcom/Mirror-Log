import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, LogOut, Menu, X, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    if (!isAuthenticated) return null;

    return (
        <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-gray-800/80 backdrop-blur-md border-b border-gray-700/60 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 group transition-all"
                    >
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/30 transform group-hover:scale-105 transition-transform">
                            <span className="text-white font-extrabold text-lg">M</span>
                        </div>
                        <span className="text-xl font-semibold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent tracking-wide">
                            MirrorLog
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/dashboard"
                            className="text-gray-300 hover:text-indigo-400 transition-colors text-sm font-medium tracking-wide"
                        >
                            Dashboard
                        </Link>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 transition-colors"
                            >
                                <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center border border-gray-700/50">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <span className="hidden lg:block font-medium">
                                    {user?.username || "User"}
                                </span>
                            </button>

                            <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-3 w-52 bg-gray-900/95 border border-gray-700/70 backdrop-blur-md rounded-xl shadow-2xl shadow-black/40 overflow-hidden"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-700/60">
                                            <p className="text-sm font-semibold text-gray-100">
                                                {user?.username}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate">
                                                {user?.email}
                                            </p>
                                        </div>
                                        <Link
                                            to="/profile"
                                            onClick={() => setDropdownOpen(false)}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/70 hover:text-indigo-400 transition-all"
                                        >
                                            <UserCircle className="w-4 h-4" />
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/70 hover:text-red-400 transition-all border-t border-gray-700/60"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-gray-300 hover:text-indigo-400 transition-all"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="md:hidden border-t border-gray-700/70 mt-2 py-4 bg-gray-900/90 backdrop-blur-md rounded-b-2xl"
                        >
                            <Link
                                to="/dashboard"
                                className="block py-2 px-2 text-gray-300 hover:text-indigo-400 text-sm font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                            <div className="mt-3 border-t border-gray-700/60 pt-3">
                                <p className="text-sm font-semibold text-gray-100 py-1">
                                    {user?.username}
                                </p>
                                <p className="text-xs text-gray-400 py-1">{user?.email}</p>
                                <Link
                                    to="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 py-2 text-gray-300 hover:text-indigo-400 transition-all"
                                >
                                    <UserCircle className="w-4 h-4" />
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 py-2 text-gray-300 hover:text-red-400 transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}
