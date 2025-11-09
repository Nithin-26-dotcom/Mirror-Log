import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await login({ email, password });
            if (result.success) {
                navigate("/dashboard");
            } else {
                setError(result.message || "Invalid email or password");
            }
        } catch (err) {
            setError(
                err.response?.data?.message || "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-6 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 px-10 py-12 sm:px-12 sm:py-14">
                    {/* Logo and Title */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mb-4 shadow-lg">
                            <span className="text-white font-bold text-3xl">M</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                            Welcome back 👋
                        </h1>
                        <p className="text-gray-600 text-[15px]">
                            Sign in to your MirrorLog account
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[15px]"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-7">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-[15px] font-medium text-gray-700 mb-2"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 text-[15px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition placeholder-gray-400"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-[15px] font-medium text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 text-[15px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3.5 rounded-lg font-medium text-[15px] hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>Sign in</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-8 text-center">
                        <p className="text-[15px] text-gray-600">
                            Don’t have an account?{" "}
                            <Link
                                to="/register"
                                className="text-indigo-600 hover:text-indigo-700 font-medium transition"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
