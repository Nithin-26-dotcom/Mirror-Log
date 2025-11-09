import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getCurrentUser, updateUser } from "../api/user";
import { getPages } from "../api/pages";
import { getLogs } from "../api/logs";
import { UserCircle, Mail, Shield, Calendar, CheckCircle, XCircle, Edit2, Save, X, BookOpen, FileText, Tag, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ActivityHeatmap from "../components/ActivityHeatmap";

export default function Profile() {
    const { user: authUser, logout } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        username: "",
        email: "",
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [pages, setPages] = useState([]);
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({
        totalPages: 0,
        totalLogs: 0,
        totalTags: 0,
        pagesLoading: false,
        logsLoading: false,
    });

    useEffect(() => {
        fetchUserData();
        fetchPagesData();
        fetchAllLogs();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const userData = await getCurrentUser();
            setUser(userData.data || userData);
            setEditForm({
                username: userData.data?.username || userData.username || "",
                email: userData.data?.email || userData.email || "",
            });
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError("Failed to load profile data");
        } finally {
            setLoading(false);
        }
    };

    const fetchPagesData = async () => {
        try {
            setStats(prev => ({ ...prev, pagesLoading: true }));
            const response = await getPages();
            const pagesData = response.data || response || [];
            setPages(Array.isArray(pagesData) ? pagesData : []);
            setStats(prev => ({
                ...prev,
                totalPages: Array.isArray(pagesData) ? pagesData.length : 0,
                pagesLoading: false,
            }));
        } catch (err) {
            console.error("Error fetching pages:", err);
            setStats(prev => ({ ...prev, pagesLoading: false }));
        }
    };

    const fetchAllLogs = async () => {
        try {
            setStats(prev => ({ ...prev, logsLoading: true }));
            
            // Fetch all logs (without date filter) for accurate stats
            // Use a high limit to get as many logs as possible
            const response = await getLogs(null, null, null, null, null, 10000, 1);
            const logsData = response.data?.logs || response.data || response || [];
            const allLogs = Array.isArray(logsData) ? logsData : [];
            
            setLogs(allLogs);
            
            // Count unique tags
            const tagSet = new Set();
            allLogs.forEach(log => {
                if (log.tag) {
                    if (typeof log.tag === 'object' && log.tag.name) {
                        tagSet.add(log.tag.name);
                    } else if (typeof log.tag === 'string') {
                        tagSet.add(log.tag);
                    }
                }
            });

            setStats(prev => ({
                ...prev,
                totalLogs: allLogs.length,
                totalTags: tagSet.size,
                logsLoading: false,
            }));
        } catch (err) {
            console.error("Error fetching logs:", err);
            setStats(prev => ({ ...prev, logsLoading: false }));
        }
    };

    // Get logs count for a specific page
    const getLogsCountForPage = (pageId) => {
        return logs.filter(log => {
            if (typeof log.page === 'object' && log.page._id) {
                return log.page._id === pageId;
            } else if (typeof log.page === 'string') {
                return log.page === pageId;
            }
            return false;
        }).length;
    };

    // Get tags for a specific page
    const getTagsForPage = (page) => {
        if (!page.topicTags || !Array.isArray(page.topicTags)) return [];
        return page.topicTags;
    };

    // Format date for pages list (shorter format)
    const formatDateShort = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleEdit = () => {
        setIsEditing(true);
        setError(null);
        setSuccess(null);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm({
            username: user?.username || "",
            email: user?.email || "",
        });
        setError(null);
        setSuccess(null);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);

            const updatedUser = await updateUser(editForm);
            setUser(updatedUser.data || updatedUser);
            setIsEditing(false);
            setSuccess("Profile updated successfully!");
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Error updating profile:", err);
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading profile...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-600">Failed to load profile</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 shadow-lg">
                                    <UserCircle className="w-12 h-12 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold mb-1">{user.username}</h1>
                                    <p className="text-indigo-100 text-sm">{user.email}</p>
                                </div>
                            </div>
                            {!isEditing ? (
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all border border-white/30"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all border border-white/30 disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        {saving ? "Saving..." : "Save"}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all border border-white/30"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Success/Error Messages */}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg"
                        >
                            {success}
                        </motion.div>
                    )}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Profile Information Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Username Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <UserCircle className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                    Username
                                </h3>
                            </div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editForm.username}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, username: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="text-xl font-semibold text-gray-800">{user.username}</p>
                            )}
                        </motion.div>

                        {/* Email Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-purple-600" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                    Email
                                </h3>
                            </div>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, email: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="text-xl font-semibold text-gray-800 break-all">{user.email}</p>
                            )}
                        </motion.div>

                        {/* Role Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                    Role
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        user.role === "admin"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-indigo-100 text-indigo-700"
                                    }`}
                                >
                                    {user.role?.toUpperCase() || "USER"}
                                </span>
                            </div>
                        </motion.div>

                        {/* Account Status Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    {user.isActive ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-600" />
                                    )}
                                </div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                    Account Status
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                {user.isActive ? (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                        Active
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                                        Inactive
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Timestamps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-amber-600" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                    Member Since
                                </h3>
                            </div>
                            <p className="text-gray-800 font-medium">{formatDate(user.createdAt)}</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-teal-600" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                    Last Updated
                                </h3>
                            </div>
                            <p className="text-gray-800 font-medium">{formatDate(user.updatedAt)}</p>
                        </motion.div>
                    </div>

                    {/* Statistics Overview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Statistics Overview</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <BookOpen className="w-5 h-5 text-indigo-600" />
                                    <span className="text-sm font-medium text-indigo-700">Total Pages</span>
                                </div>
                                <p className="text-3xl font-bold text-indigo-900">{stats.totalPages}</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <FileText className="w-5 h-5 text-purple-600" />
                                    <span className="text-sm font-medium text-purple-700">Total Logs</span>
                                </div>
                                <p className="text-3xl font-bold text-purple-900">{stats.totalLogs}</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <Tag className="w-5 h-5 text-green-600" />
                                    <span className="text-sm font-medium text-green-700">Total Tags</span>
                                </div>
                                <p className="text-3xl font-bold text-green-900">{stats.totalTags}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Activity Heatmap */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <ActivityHeatmap logs={logs} />
                    </motion.div>

                    {/* Pages List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Your Pages</h3>
                                <p className="text-sm text-gray-500">All your pages with statistics</p>
                            </div>
                        </div>

                        {stats.pagesLoading ? (
                            <div className="text-center py-8">
                                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                <p className="text-gray-500 text-sm">Loading pages...</p>
                            </div>
                        ) : pages.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>No pages yet. Create your first page from the dashboard!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {pages.map((page, index) => {
                                    const logsCount = getLogsCountForPage(page._id);
                                    const pageTags = getTagsForPage(page);
                                    
                                    return (
                                        <motion.div
                                            key={page._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.9 + index * 0.05 }}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-gray-50 to-white"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-800 mb-1">{page.title}</h4>
                                                    {page.description && (
                                                        <p className="text-sm text-gray-600 mb-3">{page.description}</p>
                                                    )}
                                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                                        <div className="flex items-center gap-2 text-purple-600">
                                                            <FileText className="w-4 h-4" />
                                                            <span className="font-medium">{logsCount} {logsCount === 1 ? "log" : "logs"}</span>
                                                        </div>
                                                        {pageTags.length > 0 && (
                                                            <div className="flex items-center gap-2 text-indigo-600">
                                                                <Tag className="w-4 h-4" />
                                                                <span className="font-medium">{pageTags.length} {pageTags.length === 1 ? "tag" : "tags"}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-2 text-gray-500">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>Created {formatDateShort(page.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                    {pageTags.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-3">
                                                            {pageTags.map((tag, tagIndex) => (
                                                                <span
                                                                    key={tagIndex}
                                                                    className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}

